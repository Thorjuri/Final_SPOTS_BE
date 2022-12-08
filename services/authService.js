const AuthRepository = require("../repositories/authRepository");
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

const GOOGLE_GRANT_TYPE = "authorization_code";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// const GOOGLE_REDIRECT_URI = "http://localhost:3000/auth/google/callback";
const GOOGLE_REDIRECT_URI = "https://spots-fe.vercel.app/auth/google/callback";

class AuthService {
  authRepository = new AuthRepository();

  loginKakao = async (code) => {
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
    let profileImg = resultGet.data["properties"]['profile_image']
    if (!loginId) throw { code: -1 };

    const user = await this.authRepository.findUser(loginId);
    if (!user) return { code: -1, message: "회원가입 필요(카카오)", loginId: loginId ,profileImg:profileImg };

    const accKey = crypto.randomBytes(2).toString("hex");
    const getAccKey = await this.authRepository.getAccKey(loginId, accKey)
    const accessToken = jwt.sign({ loginId: user.loginId, accKey:accKey}, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    const refreshToken = jwt.sign({}, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const updateRefreshToken = await this.authRepository.updateRefreshToken(loginId, refreshToken);

    return {
      user: user,
      accessToken: accessToken,
    };
  };

  loginGoogle = async (code) => {
    const url = `https://oauth2.googleapis.com/token?code=${code}&client_id=${GOOGLE_CLIENT_ID}&client_secret=${GOOGLE_CLIENT_SECRET}&redirect_uri=${GOOGLE_REDIRECT_URI}&grant_type=${GOOGLE_GRANT_TYPE}`;

    const resultPost = await axios.post(url, {
      headers: { "content-type": "application/x-www-form-urlencoded;charset=utf-8" },
    });
    const access_token = resultPost.data.access_token;
    const googleAPI = `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`;
    const userInfo = await axios.get(googleAPI, {
      headers: {
        authorization: `Bearer ${access_token}`,
      },
    });
    let loginId = userInfo.data["id"];
    let profileImg = userInfo.data["picture"]
    if (!loginId) throw { code: -2 };

    const user = await this.authRepository.findUser(loginId);
    if (!user) return { code: -1, message: "회원가입 필요(구글)", loginId: loginId, profileImg:profileImg };

    const accKey = crypto.randomBytes(2).toString("hex");
    const getAccKey = await this.authRepository.getAccKey(loginId, accKey)
    const accessToken = jwt.sign({ loginId: user.loginId, accKey:accKey}, process.env.SECRET_KEY, {
      expiresIn: "30m",
    });
    const refreshToken = jwt.sign({}, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const updateRefreshToken = await this.authRepository.updateRefreshToken(loginId, refreshToken);

    return {
      user: user,
      accessToken: accessToken,
    };
  };

  signup = async (loginId, nickname, gender, phone, sports, favSports, recommendId, profileImg) => {
    const findUser = await this.authRepository.findUser(loginId);
    if (findUser) throw { code: -1 };

    const checkNick = await this.authRepository.checkNick(nickname);
    if (checkNick) throw { code: -2 };

    const checkPhone = await this.authRepository.checkPhone(phone);
    if (checkPhone) throw { code: -3 };

    if (recommendId) {
      const checkRecommend = await this.authRepository.findUser(recommendId);
      if (!checkRecommend) throw { code: -4 };
    }

    let password = crypto.randomBytes(4).toString("hex");
    const salt = await bcrypt.genSalt(10);
    const enpryptedPW = bcrypt.hashSync(password, salt);
    password = enpryptedPW;

    const signup = await this.authRepository.signup(
      loginId,
      password,
      nickname,
      gender,
      phone,
      sports,
      favSports,
      profileImg
    );
    return;
  };
}

module.exports = AuthService;
