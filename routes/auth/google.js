const express = require("express");
const router = express.Router();
const axios = require("axios");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const GOOGLE_GRANT_TYPE = "authorization_code";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// const GOOGLE_REDIRECT_URI = "http://localhost:3000/auth/google/callback";
const GOOGLE_REDIRECT_URI = "https://spots-fe.vercel.app/auth/google/callback";
const { Users } = require("../../models");

router.get("/code", async function (req, res, next) {
  try {
    let code = req.query.code;

    const url = `https://oauth2.googleapis.com/token?code=${code}&client_id=${GOOGLE_CLIENT_ID}&client_secret=${GOOGLE_CLIENT_SECRET}&redirect_uri=${GOOGLE_REDIRECT_URI}&grant_type=${GOOGLE_GRANT_TYPE}`;

    const resultPost = await axios.post(url, {
      headers: { "content-type": "application/x-www-form-urlencoded" },
    });
    const access_token = resultPost.data.access_token;
    const googleAPI = `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`;
    const userInfo = await axios.get(googleAPI, {
      headers: {
        authorization: `Bearer ${access_token}`,
      },
    });

    let loginId = userInfo.data["id"];
    if (!loginId) return res.status(402).json({ message: "구글 로그인 실패" });
    const user = await Users.findOne({ where: { loginId } });
    if (!user)
      return res.status(200).json({ code: -1, message: "회원가입 필요(구글)", loginId: loginId });

    const accessToken = jwt.sign({ loginId: user.loginId }, process.env.SECRET_KEY, {
      expiresIn: "30m",
    });
    const refreshToken = jwt.sign({}, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    Users.update({ refreshToken }, { where: { loginId: user.loginId } });
    if (user.deleteAt) {
      return res.status(202).json({
        nickname: user.nickname,
        accessToken: `Bearer ${accessToken}`,
        message: "탈퇴한 계정(구글)",
      });
    }
    return res.status(200).json({
      nickname: user.nickname,
      accessToken: `Bearer ${accessToken}`,
      message: "로그인 되었습니다(구글)",
    });
  } catch (e) {
    console.log(e);
    res.send(e);
  }
});

module.exports = router;
