const express = require("express");
const router = express.Router();
const axios = require("axios");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const KAKAO_OAUTH_TOKEN_API_URL = "https://kauth.kakao.com/oauth/token";
const GRANT_TYPE = "authorization_code";
const CLIENT_id = process.env.CLIENT_id;
// const REDIRECT_URL = "http://localhost:3000/auth/kakao/callback";
const REDIRECT_URL = "https://spots-fe.vercel.app/auth/kakao/callback";
const { Users } = require("../../models");

router.get("/code", async function (req, res, next) {
  let code = req.query.code;
  try {
    const resultPost = await axios.post(
      `${KAKAO_OAUTH_TOKEN_API_URL}?grant_type=${GRANT_TYPE}&client_id=${CLIENT_id}&redirect_uri=${REDIRECT_URL}&code=${code}&prompts=none`,
      {
        headers: {
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    );
    const data = resultPost.data["access_token"];
    const resultGet = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${data}`,
        "Content`Type": `application/x-www-form-urlencoded;charset=utf-8`,
      },
    });
    let loginId = resultGet.data["id"];
    if (!loginId) return res.status(402).json({ message: "카카오 로그인 실패" });
    const user = await Users.findOne({ where: { loginId } });
    if (!user)
      return res.status(200).json({ code: -1, message: "회원가입 필요(카카오)", loginId: loginId });

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
        message: "탈퇴한 계정(카카오)",
      });
    }
    return res.status(200).json({
      nickname: user.nickname,
      accessToken: `Bearer ${accessToken}`,
      message: "로그인 되었습니다(카카오)",
    });
  } catch (e) {
    console.log(e);
    res.send(e);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const { loginId, nickname, gender, phone, sports, favSports, recommendId } = req.body;
    const checkId = await Users.findOne({ where: { loginId } }); // id 중복확인
    if (checkId) {
      throw { code: -1 };
    }
    const checkNick = await Users.findOne({ where: { nickname } }); // nickname 중복확인
    if (checkNick) {
      throw { code: -2 };
    }
    const checkPhone = await Users.findOne({ where: { phone } }); // phone 중복확인
    if (checkPhone) {
      throw { code: -3 };
    }
    if (recommendId) {
      // 추천인 ID 유무 확인
      const checkRecommend = await Users.findOne({ where: { loginId: recommendId } });
      if (!checkRecommend) {
        throw { code: -4 };
      }
    }
    let password = crypto.randomBytes(4).toString("hex");
    const salt = await bcrypt.genSalt(10);
    const enpryptedPW = bcrypt.hashSync(password, salt);
    password = enpryptedPW;
    const profileImg =
      "https://woosungbucket.s3.ap-northeast-2.amazonaws.com/original/1669128469071_spots2.png";
    const singupKakao = await Users.create({
      loginId,
      password,
      nickname,
      gender,
      phone,
      sports,
      favSports,
      recommendId,
      profileImg,
    });
    return res.status(201).json({ message: "회원가입 되었습니다." });
  } catch (err) {
    if (err.code === -1) {
      res.status(412).json({ errormessage: "사용 중인 ID입니다.", code: -1 });
    } else if (err.code === -2) {
      res.status(412).json({ errormessage: "사용 중인 닉네임입니다.", code: -2 });
    } else if (err.code === -3) {
      res.status(412).json({ errormessage: "사용 중인 번호입니다.", code: -3 });
    } else if (err.code === -4) {
      res.status(412).json({ errormessage: "해당 아이디는 없습니다.", code: -4 });
    } else if (err.code === -5) {
      res.status(412).json({ errormessage: "비밀번호를 확인해 주세요.", code: -5 });
    } else {
      console.log(err);
      res.status(400).json({ errmessage: err });
    }
  }
});

module.exports = router;
