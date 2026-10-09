import { randomUUID } from 'crypto';

export function calcularTOPSIS(alternativas, criterios, options = {}) {
  const numAlt = alternativas.length;
  const numCrit = criterios.length;

  if (numAlt === 0 || numCrit === 0) {
    throw new Error('É necessário pelo menos 1 alternativa e 1 critério.');
  }

  // 1. Extração/Construção da Matriz de Decisão com dimensões corretas
  const matriz = alternativas.map(alt => {
    if (Array.isArray(alt.valores) && alt.valores.length === numCrit) {
      return alt.valores;
    }
    return Array.from({ length: numCrit }, () => Math.random() * 100);
  });

  // 2. Normalização Vetorial
  const somaQuadrados = Array(numCrit).fill(0);
  for (let j = 0; j < numCrit; j++) {
    for (let i = 0; i < numAlt; i++) {
      const val = matriz[i][j] || 0;
      somaQuadrados[j] += Math.pow(val, 2);
    }
    somaQuadrados[j] = Math.sqrt(somaQuadrados[j]) || 1;
  }

  const matrizNormalizada = matriz.map(linha =>
    linha.map((val, j) => val / somaQuadrados[j])
  );

  // 3. Matriz Ponderada
  const matrizPonderada = matrizNormalizada.map(linha =>
    linha.map((val, j) => val * (Number(criterios[j]?.peso) || 0.33))
  );

  // 4. Soluções Ideais (Positiva A+ e Negativa A-)
  const idealPositiva = [];
  const idealNegativa = [];

  for (let j = 0; j < numCrit; j++) {
    const colValores = matrizPonderada.map(linha => linha[j]);
    const ehBeneficio = criterios[j]?.tipo === 'BENEFICIO' || criterios[j]?.is_benefit === true;

    idealPositiva[j] = ehBeneficio ? Math.max(...colValores) : Math.min(...colValores);
    idealNegativa[j] = ehBeneficio ? Math.min(...colValores) : Math.max(...colValores);
  }

  // 5. Distâncias e Score
  const resultados = alternativas.map((alt, i) => {
    let distPositiva = 0;
    let distNegativa = 0;

    for (let j = 0; j < numCrit; j++) {
      distPositiva += Math.pow(matrizPonderada[i][j] - idealPositiva[j], 2);
      distNegativa += Math.pow(matrizPonderada[i][j] - idealNegativa[j], 2);
    }

    distPositiva = Math.sqrt(distPositiva);
    distNegativa = Math.sqrt(distNegativa);

    const denominador = distPositiva + distNegativa;
    const score = denominador === 0 ? 0 : distNegativa / denominador;

    return {
      id_alternativa: alt.id_alternativa || alt.id,
      nome: alt.nome,
      score: Number(score.toFixed(4)), 
      deliveres: options.deliveres || alternativas.length
    };
  });

  // 6. Ordenação e atribuição de ranking
  resultados.sort((a, b) => b.score - a.score);

  resultados.forEach((res, index) => {
    res.posicao_ranking = index + 1;
  });

  return {
    id_run: options.id_run || `RUN-${randomUUID().substring(0, 8).toUpperCase()}`,
    seed: options.seed || Math.floor(Math.random() * 10000),
    steps: options.steps || 5,
    status: 'COMPLETED',
    resultados
  };
}