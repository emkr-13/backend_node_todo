import swaggerJsdoc from "swagger-jsdoc";

// Determine the base URL based on environment
const getBaseUrl = () => {
  const protocol = "http";
  const host = `localhost:${process.env.APP_PORT || 3000}`;
  return `${protocol}://${host}`;
};

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Backend API Documentation Todo App",
      version: "1.0.0",
      description: "API documentation for the todo backend application",
    },
    servers: [
      {
        url: getBaseUrl(),
        description: "API Server",
      },
    ],
    tags: [
      {
        name: "Authentication",
        description: "Authentication endpoints for login, register, and logout",
      },
      {
        name: "User",
        description: "User profile and management endpoints",
      },
      {
        name: "Tasks",
        description: "Task management endpoints for todo items",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ApiResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Operation completed successfully",
            },
            data: {
              type: "object",
              example: {},
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    "./src/routes/*.ts",
    "./src/controllers/*.ts",
    "./src/dto/*.ts",
    "./src/docs/swagger/*.ts",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

// Import the Swagger documentation to ensure it is included in the build
import "../docs/swagger";

export default swaggerSpec;
