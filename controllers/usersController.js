const UsersService = require("../services/usersService");
const Joi = require("joi");

class UsersController {
  usersService = new UsersService();
  //회원가입
  SignupUser = async (req, res, next) => {
    try {
      const { loginId, password, nickname, gender, phone } = req.body; // 밸리데이션 필요
      if (password.search(loginId) !== -1) {
        return res.status(412).send({
          errorMessage: "패스워드에 ID가 포함되어 있습니다.",
        });
      }
      await this.usersService.createUser(loginId, password, nickname, gender, phone);
      return res.status(201).json({ message: "회원가입이 완료되었습니다." });
    } catch (err) {
      if (err.code === -1) {
        res.status(412).json({ errormessage: "사용 중인 ID입니다." });
      } else if (err.code === -2) {
        res.status(412).json({ errormessage: "사용 중인 닉네임입니다." });
      } else if (err.code === -3) {
        res.status(412).json({ errormessage: "사용 중인 번호입니다." });
      } else {
        console.log(err);
        res.status(400).json({ errmessage: err });
      }
    }
  };
  // 로그인
  LoginUser = async (req, res, next) => {
    try {
      const { loginId, password } = req.body;
      const user = await this.usersService.LoginUser(loginId, password);
      return res.status(200).json({
        nickname: user[0].nickname,
        accessToken: user[1],
        message: "로그인 되었습니다.",
      });
    } catch (err) {
      if (err.code === -1) {
        res.status(412).json({ errormessage: "ID 또는 패스워드를 확인해 주세요" });
      } else {
        console.log(err);
        res.status(400).json({ errmessage: err });
      }
    }
  };
  // ID 중복확인
  checkId = async (req, res, next) => {
    try {
      const { loginId } = req.body;
      const checkId = await this.usersService.checkId(loginId);
      if (checkId) {
        throw { code: -1 };
      }
      return res.status(200).json({ message: "사용 가능한 ID" });
    } catch (err) {
      if (err.code === -1) {
        res.status(412).json({ errormessage: "사용 중인 ID입니다." });
      } else {
        console.log(err);
        res.status(400).json({ errmessage: err });
      }
    }
  };
  // 닉네임 중복확인
  checkNick = async (req, res, next) => {
    try {
      const { nickname } = req.body;
      const checkNick = await this.usersService.checkNick(nickname);
      if (checkNick) {
        throw { code: -1 };
      }
      return res.status(200).json({ message: "사용 가능한 닉네임" });
    } catch (err) {
      if (err.code === -1) {
        res.status(412).json({ errormessage: "사용 중인 닉네임입니다." });
      } else {
        console.log(err);
        res.status(400).json({ errmessage: err });
      }
    }
  };
  // 핸드폰 중복확인
  checkPhone = async (req, res, next) => {
    try {
      const { phone } = req.body;
      const checkPhone = await this.usersService.checkPhone(phone);
      if (checkPhone) {
        throw { code: -1 };
      }
      return res.status(200).json({ message: "사용 가능한 번호" });
    } catch (err) {
      if (err.code === -1) {
        res.status(412).json({ errormessage: "사용 중인 번호입니다." });
      } else {
        console.log(err);
        res.status(400).json({ errmessage: err });
      }
    }
  };
  // 유저 정보 조회
  getUser = async (req, res, next) => {
    try {
      const { loginId } = res.locals.user;
      const getUser = await this.usersService.checkId(loginId);
      return res.status(200).json({ user: getUser });
    } catch (err) {
      console.log(err);
      res.status(400).json({ errmessage: err });
    }
  };
  // 유저 정보 수정
  updateUser = async (req, res, next) => {
    try {
      const { loginId } = res.locals.user;
      const { password, nickname, gender, phone } = req.body;
      const updateUser = await this.usersService.updateUser(
        loginId,
        password,
        nickname,
        gender,
        phone
      );
      res.status(200).json({ user: updateUser });
    } catch (err) {
      if (err.code === -1) {
        res.status(412).json({ errormessage: "중복된 닉네임입니다." });
      } else if (err.code === -2) {
        res.status(412).json({ errormessage: "중복된 번호입니다." });
      } else {
        console.log(err);
        res.status(400).json({ errmessage: err });
      }
    }
  };
  // 회원탈퇴
  dropUser = async (req, res, next) => {
    try {
      const { loginId } = res.locals.user;
      await this.usersService.dropUser(loginId);
      res.status(200).send("회원 탈퇴 성공");
    } catch (err) {
      console.log(err);
      res.status(400).json({ errmessage: err });
    }
  };
  // 회원탈퇴 취소
  cancelDrop = async (req, res, next) => {
    try {
      const { loginId } = res.locals.user;
      await this.usersService.cancelDrop(loginId);
      res.status(200).send("회원 탈퇴 취소");
    } catch (err) {
      console.log(err);
      res.status(400).json({ errmessage: err });
    }
  };
}
module.exports = UsersController;
