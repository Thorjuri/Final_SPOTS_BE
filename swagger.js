const swaggerAutogen = require("swagger-autogen")();
require("dotenv").config();

const doc = {
  info: {
    version: "1.0.0",
    title: "Spots",
    description: "",
  },
  host: "sparta4.shop",
  schemes: ["https"],  
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    {
      name: "Users",
      description: "회원정보API",
    },
  ],
  securityDefinitions: {
    apiKeyAuth: {
      type: "apiKey",
      in: "header", // can be "header", "query" or "cookie"
      name: "Authorization", // name of the header, query parameter or cookie
      description: "any description...",
    },
  },
  definitions: {
    signup: {
      father: "Simon Doe",
      mother: "Marie Doe",
    },
    User: {
      userId: 1,
      $nickname: "aaa",
      $password: "1111",
    },
    AddUser: {
      $name: "Jhon Doe",
      $age: 29,
      about: "",
    },
  },
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
