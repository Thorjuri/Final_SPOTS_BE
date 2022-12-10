const jwt = require("jsonwebtoken");
const { Users } = require("../models");
const crypto = require("crypto");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization;
    if (!accessToken) {
      return res.status(401).json({ errormessage: "다시 로그인 해주세요." });
    }

    const [tokenType, tokenValue] = accessToken.split(" ");
    if (
      tokenType !== "Bearer" ||
      tokenValue === "null" ||
      tokenValue === "undefined" ||
      !tokenValue
    ) {
      return res.status(401).send({ errormessage: "로그인 후 이용 가능한 기능입니다." });
    }

    const myToken = verifyToken(tokenValue);
    if (myToken === "jwt expired") {
      // access token 만료
      const userInfo = jwt.decode(tokenValue, process.env.SECRET_KEY);
      const loginId = userInfo.loginId;
      let accKey = userInfo.accKey;
      let refreshToken;

      const user = await Users.findOne({ where: { loginId } });
      if (!user) return res.status(412).json({ errormessage: "없는 회원 입니다." });
      if (user.accKey !== accKey)
        return res.status(412).json({ errormessage: "잘못된 접근 입니다." });
      refreshToken = user.refreshToken;
      const myRefreshToken = verifyToken(refreshToken);
      if (myRefreshToken == "jwt expired")
        return res.status(412).json({ errormessage: "로그인이 필요합니다." });
      accKey = crypto.randomBytes(2).toString("hex");
      await Users.update({ accKey }, { where: { loginId: user.loginId } });
      const myNewToken = jwt.sign(
        { loginId: user.loginId, accKey: accKey },
        process.env.SECRET_KEY,
        { expiresIn: "30m" }
      );
      return res
        .status(200)
        .json({ code: 1, message: "new access token", myNewToken: `Bearer ${myNewToken}` });
    } else {
      const { loginId } = jwt.verify(tokenValue, process.env.SECRET_KEY);
      const user = await Users.findOne({ where: { loginId }, paranoid: false });
      res.locals.user = user;
      next();
    }
  } catch (err) {
    return res.status(412).json({ errormessage: err + " : 로그인이 필요합니다." });
  }
};

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    return error.message;
  }
}
