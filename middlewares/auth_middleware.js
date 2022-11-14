const jwt = require("jsonwebtoken");
const { Users } = require("../models");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization;
    if (!accessToken) {
      res.status(401).json({ errorMessage: "다시 로그인 해주세요." });
    }

    const [tokenType, tokenValue] = accessToken.split(" ");
    if (
      tokenType !== "Bearer" ||
      tokenValue === "null" ||
      tokenValue === "undefined" ||
      !tokenValue
    ) {
      res.status(401).send({ errorMessage: "로그인 후 이용 가능한 기능입니다." });
    }

    const myToken = verifyToken(tokenValue);
    if (myToken == "jwt expired") {
      // access token 만료
      const userInfo = jwt.decode(tokenValue, process.env.SECRET_KEY);
      console.log(userInfo);
      const userId = userInfo.userId;
      let refreshToken;

      Users.findOne({ where: { userId } }).then((user) => {
        if (!user) return res.send("jwt 코드를 확인해 주세요");
        refreshToken = user.refreshToken;
        const myRefreshToken = verifyToken(refreshToken);
        if (myRefreshToken == "jwt expired") {
          res.send({ errorMessage: "로그인이 필요합니다." });
        } else {
          const myNewToken = jwt.sign({ loginId: user.loginId }, process.env.SECRET_KEY, {
            expiresIn: "30m",
          });
          res.send({ message: "new access token", myNewToken: `Bearer ${myNewToken}` });
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
    res.send({ errorMessage: err + " : 로그인이 필요합니다." });
  }
};

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    return error.message;
  }
}
