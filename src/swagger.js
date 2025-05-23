const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Peenly Backend API",
            description: "API documentation for Peenly",
            version: "1.0"
        },
        servers: [
            {
                url: "http://localhost:3000/",
               url: "https://peenly.onrender.com/",
                description: 'Development server',

            },
        ],
        components: {
            securitySchemes: {
              bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
              },
            },
          },
          security: [
            {
              bearerAuth: [],
            },
          ],
    },
    apis: ["./routes/*.js"]
};



const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };