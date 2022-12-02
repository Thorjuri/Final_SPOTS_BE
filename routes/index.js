const express = require("express");
const router = express.Router();
const usersRouter = require("./users.js");
const placesRouter = require("./places.js");
const teamsRouter = require("./teams.js");
const kakaoRouter = require("./auth/kakao");
const googleRouter = require("./auth/google");
const naverRouter = require("./auth/naver");
//const openPlacesRouter = require('./openPlaces.js');  // open Api연결  안쓸때는 주석해놓기!
//const mypagesRouter = require('./mypages.js');
const reservationsRouter = require("./reservations.js");

//전역 미들웨어

router.use("/users", usersRouter);
router.use("/places", placesRouter);
router.use("/teams", teamsRouter);
router.use("/kakao", kakaoRouter);
router.use("/google", googleRouter);
// router.use('/mypages', mypagesRouter);
router.use("/reservations", reservationsRouter);

module.exports = router;
