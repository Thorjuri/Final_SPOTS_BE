const jwt = require("jsonwebtoken");
const { Users } = require("../models");
const crypto = require("crypto");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization;
    if (!accessToken) {
      return res.status(401).json({ errorMessage: "다시 로그인 해주세요." });
    }

    const [tokenType, tokenValue] = accessToken.split(" ");
    if (
      tokenType !== "Bearer" ||
      tokenValue === "null" ||
      tokenValue === "undefined" ||
      !tokenValue
    ) {
      return res.status(401).send({ errorMessage: "로그인 후 이용 가능한 기능입니다." });
    }

    const myToken = verifyToken(tokenValue);
    console.log(myToken);
    if (myToken == "jwt expired") {
      // access token 만료
      const userInfo = jwt.decode(tokenValue, process.env.SECRET_KEY);
      console.log(userInfo);
      const loginId = userInfo.loginId;
      let accKey = userInfo.accKey;
      let refreshToken;

      Users.findOne({ where: { loginId } }).then((user) => {
        if (!user) return res.send("jwt 코드를 확인해 주세요");
        refreshToken = user.refreshToken;
        const myRefreshToken = verifyToken(refreshToken);
        if (myRefreshToken == "jwt expired") {
          return res.send({ errorMessage: "로그인이 필요합니다." });
        }
        console.log("db정보");
        console.log(user.accKey);
        console.log("jwt 디코드");
        console.log(accKey);
        if (user.accKey !== accKey) return res.send("잘못된 접근 입니다.");
        else {
          accKey = crypto.randomBytes(2).toString("hex");
          Users.update({ accKey }, { where: { loginId: user.loginId } }).then(() => {
            const myNewToken = jwt.sign(
              { loginId: user.loginId, acckey: accKey },
              process.env.SECRET_KEY,
              {
                expiresIn: "1d",
              }
            );
            res.send({ message: "new access token", myNewToken: `Bearer ${myNewToken}` });
          });
        }
      });
    } else {
      const { loginId } = jwt.verify(tokenValue, process.env.SECRET_KEY);
      Users.findOne({ where: { loginId } }).then((user) => {
        res.locals.user = user;
        next();
      });
    }
  } catch (err) {
    return res.send({ errorMessage: err + " : 로그인이 필요합니다." });
  }
};

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    return error.message;
  }
}
