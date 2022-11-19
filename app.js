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
const { SocketAddress } = require("net");
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




// ------------------ chat(socket)
app.set('view engine', "pug");
app.set("views", "./src/views");
app.use('/public',express.static("./src/public"));

app.get('/chat', (req, res)=> {
    res.render("home")
});

app.get('/admin', (req, res)=> {
  res.render("admin")
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

function findRoom(room){
  const {
    sockets: {
        adapter: { sids, rooms }
    },
} = io;
  const roomid = [];
  sids.forEach((val, key) => {
    if(key === room){
      roomid.push(key)
    }
  });
  return roomid;
}

// room의 접속자 수 추출
function countRoom(roomName){
  return io.sockets.adapter.rooms.get(roomName)?.size;
}

io.on("connection", socket => {
  console.log('소켓아이디'  + socket.id)
  const roomName = socket.id
  io.socketsJoin(roomName) //모든 소켓이 'Anouncemetn'라는 room으로 들어가게 함!!
  console.log('해당 룸', roomName)
  // socket["nickname"] = "Anonymous";
  const rooms = findUser();
  rooms.splice(rooms.indexOf(roomName),1)
  console.log(`현재 접속된 모든 socketId = ${findUser()}  `)
  socket.emit("client_main", roomName)
  socket.emit("admin_roomlist", rooms )
  socket.onAny((event)=> {  
      console.log(`socket Event: ${event}`) 
  })
  socket.on("admin_enter_room", roomName => {
    io.socketsJoin(roomName)
    console.log(socket.room)
    const message = `관리자 입장완료. 1:1 채팅상담을 시작합니다. 무엇을 도와드릴까요?`
    socket.emit("private_QnA", message)
  })
  socket.on("enter_room", (roomName)  => {  // room 만들기 혹은 입장
      socket.join(roomName) // 1.room 입장
      // const counts = countRoom(roomName)
      // cb(counts)  //2. 프론트에 showRoom 함수실행
      const message = `${socket.nickname} 님 환영합니다. SPOTS 고객 상담 1:1 채팅방입니다. 무엇을 도와드릴까요?`
      socket.emit("enter_notice", message); //해당 socket의, 해당 room의 - 모든 접속자에게 메세지 보냄(본인 제외)
      // io.sockets.emit("room_change", publicRooms()); //연결된 모든 socket의 모든 접속자에게 'public room' 목록을 보냄
  });

  socket.on("chatting", (message) => {  // message 보내기
    console.log(message)
    const room = socket.id
    const data = findRoom(room)
    console.log(data)
    // io.socketsJoin(room)
    console.log(room, socket.id)
    socket.emit("new_message", message); //해당 room의 모든 접속자에게 message 보냄
});

  // socket.on("new_message", (message, room, cb) => {  // message 보내기
  //     socket.to(room).emit("new_message", `${socket.nickname}: ${message}`); //해당 room의 모든 접속자에게 message 보냄
  //     cb();
  // });

  // socket.on("nickname", (nickname) => { //프론트에서 받아온 nickname을 socket 객체에 nickname 속성으로 저장
  //     socket["nickname"] = nickname;    // 필요할땐 언제든 socket 객체에서 꺼내설 쓸 수 있음
  // });

  socket.on("disconnecting", ()=>{ //disconnecting = 연결 종료 직전**
      const message = `${socket.nickname} 님이 퇴장하셨습니다.`  
      socket.rooms.forEach(room => { socket.to(room).emit("left_notice", message) // 연결 종료 시(직전에) 해당 room 전체에 메세지 보냄(본인 제외)
      });
  });

  socket.on("disconnect", ()=>{ //disconnecting = 연결 종료 직후**
    console.log(socket.rooms)
      // io.sockets.emit("room_change", publicRooms()); //연결된 모든 socket의 모든 접속자에게 'public room' 목록을 보냄
  });

});

//-----------

http.listen(port, () => {
  console.log(`${port}번 포트로 서버 실행`);
});

