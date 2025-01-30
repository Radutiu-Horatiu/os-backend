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
        WalletAddressAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-wallet-address',
          description: 'User ID for authentication',
        },
      },
    },
    security: [
      {
        WalletAddressAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Make sure this path is correct
});
