const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/authController");
const authController = new AuthController();

router.get("/kakao", authController.loginKakao);
router.get("/google", authController.loginGoogle);
router.post("/signup", authController.signup);

module.exports = router;
