import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerOptions = (
  port: number | string
): swaggerJSDoc.Options => ({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Zerk API',
      version: '1.0.0',
      description: 'API documentation for Zerk',
    },
    components: {
      schemas: {},
      securitySchemes: {
        UserIdAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-user-id',
          description: 'User ID for authentication',
        },
      },
    },
    security: [
      {
        UserIdAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Make sure this path is correct
});
