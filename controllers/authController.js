const AuthService = require("../services/authService");

class AuthController {
  authService = new AuthService();

  loginKakao = async (req, res, next) => {
    try {
      let code = req.query.code;
      const loginKakao = await this.authService.loginKakao(code);
      if (loginKakao.code === -1) return res.status(200).json(loginKakao);
      if (loginKakao.user.deletedAt) {
        return res.status(202).json({
          nickname: loginKakao.user.nickname,
          accessToken: `Bearer ${loginKakao.accessToken}`,
          message: "탈퇴한 계정(카카오)",
        });
      }
      return res.status(200).json({
        nickname: loginKakao.user.nickname,
        accessToken: `Bearer ${loginKakao.accessToken}`,
        message: "로그인 되었습니다(카카오)",
      });
    } catch (err) {
      if (err.code === -1) res.status(402).json({ message: "카카오 로그인 실패" });
      if (err.code === -2) res.status(402).json({ message: "구글 로그인 실패" });
      console.log(err);
      res.status(400).json({ errmessage: err });
    }
  };

  loginGoogle = async (req, res, next) => {
    try {
      let code = req.query.code;
      const loginGoogle = await this.authService.loginGoogle(code);
      if (loginGoogle.code === -1) return res.status(200).json(loginGoogle);
      if (loginGoogle.user.deletedAt) {
        return res.status(202).json({
          nickname: loginGoogle.user.nickname,
          accessToken: `Bearer ${loginGoogle.accessToken}`,
          message: "탈퇴한 계정(구글)",
        });
      }
      return res.status(200).json({
        nickname: loginGoogle.user.nickname,
        accessToken: `Bearer ${loginGoogle.accessToken}`,
        message: "로그인 되었습니다(구글)",
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ errmessage: err });
    }
  };
  signup = async (req, res, next) => {
    try {
      const { loginId, nickname, gender, phone, sports, favSports, recommendId, profileImg } = req.body;
      const signup = await this.authService.signup(
        loginId,
        nickname,
        gender,
        phone,
        sports,
        favSports,
        recommendId,
        profileImg
      );
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
  };
}
module.exports = AuthController;
