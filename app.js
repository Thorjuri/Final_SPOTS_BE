const express = require("express");
const Http = require("http");
const app = express();
const http = Http.createServer(app);
const port = 3000;
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");

const Router = require("./routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorHandlerMiddleware = require("./middlewares/error_handler_middleware");
const auth_middleware = require("./middlewares/auth_middleware");
require("./models");


app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "*", // 모든 출처 허용 옵션. true 를 써도 된다.

    allowedHeaders: ["content-Type", "Authorization"],
    exposedHeaders: ["content-Type", "Authorization"],
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH", "OPTIONS"],
    credential: "true",
  })
);

app.options("*", cors());
app.use("/", Router);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// 에러 핸들러 (주석처리 후 마지막에 적용)
app.use(errorHandlerMiddleware);


http.listen(port, () => {
  console.log(`${port}번 포트로 서버 실행`);
});
