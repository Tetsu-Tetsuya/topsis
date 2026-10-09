import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Renewable Energy Platform with TOPSIS API',
      version: '1.0.0',
      description: 'API RESTful para gestão de projetos de energia renovável e tomada de decisão com o algoritmo TOPSIS.',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor Local (Docker)',
      },
    ],
  },
  apis: ['./index.js', './routes/*.js', './server.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('Documentação Swagger disponível em: http://localhost:3001/api-docs');
}