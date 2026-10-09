import { calcularTOPSIS } from './topsisService.js';

describe('Algoritmo TOPSIS - Validação Matemática e Estrutural', () => {
  const criteriosMock = [
    { id: 1, nome: 'Custo', peso: 0.4, tipo: 'CUSTO' },
    { id: 2, nome: 'Eficiência', peso: 0.6, tipo: 'BENEFICIO' }
  ];

  const alternativasMock = [
    { id_alternativa: 101, nome: 'Planta Solar A', valores: [100, 80] },
    { id_alternativa: 102, nome: 'Planta Eólica B', valores: [150, 95] },
    { id_alternativa: 103, nome: 'Biomassa C', valores: [80, 60] }
  ];

  test('Deve executar o TOPSIS e calcular os campos obrigatórios da RUN', () => {
    const resultado = calcularTOPSIS(alternativasMock, criteriosMock);

    expect(resultado).toHaveProperty('id_run');
    expect(resultado.id_run).toMatch(/^RUN-/);
    expect(resultado.status).toBe('COMPLETED');
    expect(resultado.resultados).toHaveLength(3);
  });

  test('Deve calcular os scores entre 0 e 1 e atribuir posições no ranking', () => {
    const resultado = calcularTOPSIS(alternativasMock, criteriosMock);

    expect(resultado.resultados[0].posicao_ranking).toBe(1);

    resultado.resultados.forEach(item => {
      expect(item.score).toBeGreaterThanOrEqual(0);
      expect(item.score).toBeLessThanOrEqual(1);
      expect(item).toHaveProperty('deliveres');
    });
  });

  test('Deve lançar erro quando alternativas ou critérios estiverem vazios', () => {
    expect(() => {
      calcularTOPSIS([], criteriosMock);
    }).toThrow('É necessário pelo menos 1 alternativa e 1 critério.');
  });
});