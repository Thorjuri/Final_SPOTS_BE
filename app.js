const express = require("express");
const Http = require("http");
const app = express();
const http = Http.createServer(app);
const SocketIo = require("socket.io");
const io = SocketIo(http); // http + socketio 서버
const port = 3000;
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");

const Router = require("./routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorHandlerMiddleware = require("./middlewares/error_handler_middleware");

// require("./models");
//app.use(express.json());

app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: false,
  })
);
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

app.use(errorHandlerMiddleware);

app.get("/", (req, res) => {
  res.send("TEST!!!!123");
});

// ------------------ chat(socket)
// app.set('view engine', "pug");
// app.set("views", "./src/views");
// app.use('/public',express.static("./src/public"));

// app.get('/chat', (req, res)=> {
//     res.render("home")
// });

// app.get('/admin', (req, res)=> {
//   res.render("admin")
// });

// public room 목록 추출
function publicRooms() {
  //객체의 구조 분해 할당 3겹 (io란 객체 안의, sockets 객체 안의, adapter 객체 안의 sids, rooms 란 객체)
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = io;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

function findUser() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = io;
  const allUsers = [];
  sids.forEach((val, key) => {
    allUsers.push(key);
  });
  return allUsers;
}

function findRoom(room) {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = io;
  const roomid = [];
  sids.forEach((val, key) => {
    if (key === room) {
      roomid.push(key);
    }
  });
  return roomid;
}

// room의 접속자 수 추출
function countRoom(roomName) {
  return io.sockets.adapter.rooms.get(roomName)?.size;
}

io.on("connection", (socket) => {
  const roomName = socket.id;
  socket.join(roomName);
  const rooms = findUser();
  rooms.splice(rooms.indexOf(roomName), 1);

  socket.emit("client_main", roomName);

  socket.emit("admin_roomlist", rooms);

  socket.on("admin_enter_room", (room) => {
    socket.join(room);
    const roomName = room;
    const nickname = "admin";
    const message = "안녕하세요 고객님, 생활체육 매칭 서비스 SPOTS입니다. 무엇을 도와드릴까요?";
    const data = { roomName, nickname, message };
    io.sockets.in(roomName).emit("new_message", data);
  });

  socket.on("chatting", (obj) => {
    const convert = JSON.parse(obj);
    const { roomName, nickname, value } = convert;
    const data = { roomName, nickname, message: value };
    io.sockets.in(roomName).emit("new_message", data);
  });

  socket.on("disconnecting", () => {
    //disconnecting = 연결 종료 직전**
    const nickname = socket.id.slice(0, 5);
    const message = `${nickname} 님이 퇴장하셨습니다.`;
    const roomName = socket.id;
    io.sockets.in(roomName).emit("left_notice", message); // 연결 종료 시(직전에) 해당 room 전체에 메세지
  });

  socket.on("disconnect", () => {
    //disconnecting = 연결 종료 직후**
    console.log(socket.rooms);
  });
});

http.listen(port, () => {
  console.log(`${port}번 포트로 서버 실행`);
});
