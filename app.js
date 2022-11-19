const express = require("express");
const Http = require("http");
const app = express();
const http = Http.createServer(app);
const SocketIo = require('socket.io')
const io = SocketIo(http); // http + socketio 서버
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

app.use(errorHandlerMiddleware);

<<<<<<< HEAD



// chat - socket
app.set('view engine', "pug");
app.set("views", "./src/views");
app.use('/public',express.static("./src/public"));

app.get('/chat', (req, res)=> {
    res.render("home")
});

// public room 목록 추출
function publicRooms(){ //객체의 구조 분해 할당 3겹 (io란 객체 안의, sockets 객체 안의, adapter 객체 안의 sids, rooms 란 객체)
  const {
      sockets: {
          adapter: { sids, rooms }
      },
  } = io;
  const publicRooms = []  
  rooms.forEach((_, key) => {   //public room을 찾는 방법. 모든 소켓은 연결시 자동으로 각자의 private room을 갖는다.
      if(sids.get(key) === undefined){   //이 private room은 socketId(sids)와 같은 이름
          publicRooms.push(key)   // sockets.adapter의 rooms, sids 를 이용해, private room이 아닌, 누군가 임의로 만든 public room을 찾는 방법
      }                           // room 이름이 sids와 같으면 private room 인것을 이용해, if문으로 같지 않은 public room을 추출한다.
  })
  return publicRooms;
};

function findUser(){
  const {
    sockets: {
        adapter: { sids, rooms }
    },
} = io;
  const allUsers = [];
  sids.forEach((val, key) => {
    allUsers.push(key)
  });
  return allUsers;
};

// room의 접속자 수 추출
function countRoom(roomName){
  return io.sockets.adapter.rooms.get(roomName)?.size;
}

io.on("connection", socket => {
  // io.socketsJoin("Anouncement") //모든 소켓이 'Anouncemetn'라는 room으로 들어가게 함!!
  socket["nickname"] = "Anon";
  console.log(`현재 접속된 모든 socketId = ${findUser()}  `)
  socket.onAny((event)=> {  //onAny 메소드 = 미들웨어 개념. socket으로 들어온 모든 event를 감지함
      // console.log(io.sockets.adapter);
      console.log(`socket Event: ${event}`) // 'socket Event: enter_room'
  })
  socket.on("enter_room", (roomName, cb ) => {  // room 만들기 혹은 입장
      socket.join(roomName) // 1.room 입장
      const counts = countRoom(roomName)
      cb(counts)  //2. 프론트에 showRoom 함수실행
      socket.to(roomName).emit("welcome", socket.nickname, roomName, countRoom(roomName)); //해당 socket의, 해당 room의 - 모든 접속자에게 메세지 보냄(본인 제외)
      io.sockets.emit("room_change", publicRooms()); //연결된 모든 socket의 모든 접속자에게 'public room' 목록을 보냄
  });

  socket.on("new_message", (message, room, cb) => {  // message 보내기
      socket.to(room).emit("new_message", `${socket.nickname}: ${message}`); //해당 room의 모든 접속자에게 message 보냄
      cb();
  });

  socket.on("nickname", (nickname) => { //프론트에서 받아온 nickname을 socket 객체에 nickname 속성으로 저장
      socket["nickname"] = nickname;    // 필요할땐 언제든 socket 객체에서 꺼내설 쓸 수 있음
  });

  socket.on("disconnecting", ()=>{ //disconnecting = 연결 종료 직전**
      socket.rooms.forEach(room => { socket.to(room).emit("Bye", socket.nickname, countRoom(room)-1) // 연결 종료 시(직전에) 해당 room 전체에 메세지 보냄(본인 제외)
      });
  });

  socket.on("disconnect", ()=>{ //disconnecting = 연결 종료 직후**
      io.sockets.emit("room_change", publicRooms()); //연결된 모든 socket의 모든 접속자에게 'public room' 목록을 보냄
  });

});

//-----------

=======
>>>>>>> juri
http.listen(port, () => {
  console.log(`${port}번 포트로 서버 실행`);
});

