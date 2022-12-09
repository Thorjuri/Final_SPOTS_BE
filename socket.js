const SocketIo = require("socket.io");

module.exports = (http) => {
  const io = SocketIo(http); // http + socketio 서버
  function publicRooms() {
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
    console.log(findUser())
    const roomName = socket.id;
    socket.join(roomName);
    const rooms = findUser();
    rooms.splice(rooms.indexOf(roomName), 1);
    console.log(rooms)

    socket.emit("client_main", roomName);
    socket.emit("admin_roomlist", rooms);

    socket.on("admin_enter_room", (room) => {
      console.log(room)
      socket.join(room);
      const roomName = room;
      const nickname = "admin";
      const message = "안녕하세요 고객님, 생활체육 매칭 서비스 SPOTS입니다. 무엇을 도와드릴까요?";
      const data = { roomName, nickname, message };
      io.sockets.in(roomName).emit("new_message", data);
    });

    socket.on("chatting", (obj) => {
      const convert = JSON.parse(obj);
      console.log(convert)
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
};
