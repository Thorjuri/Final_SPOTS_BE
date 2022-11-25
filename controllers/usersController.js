const UsersService = require("../services/usersService");
const Joi = require("joi");

class UsersController {
  usersService = new UsersService();
  //회원가입
  SignupUser = async (req, res, next) => {
    try {
      const {
        loginId,
        password,
        confirmPassword,
        nickname,
        gender,
        phone,
        sports,
        favSports,
        recommendId,
      } = req.body;

      if (password !== confirmPassword) {
        throw { code: -5 };
      }
      await this.usersService.createUser(
        loginId,
        password,
        nickname,
        gender,
        phone,
        sports,
        favSports,
        recommendId
      );

      return res.status(201).json({ message: "회원가입이 완료되었습니다." });
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
  // ID찾기
  findId = async (req, res, next) => {
    try {
      const { phone, code } = req.body;
      const smsCheck = await this.usersService.checkSms(phone, code);
      if (!smsCheck) return res.status(401).json({ message: "인증 실패" });
      const findId = await this.usersService.findId(phone);
      return res.status(200).json(findId);
    } catch (err) {
      if (err.code === -1) {
        return res.status(412).json({ errormessage: "회원가입 안하신듯?" });
      } else {
        console.log(err);
        res.status(400).json({ errmessage: err });
      }
    }
  };
  // PW찾기
  findPW = async (req, res, next) => {
    try {
      const { loginId, phone, code } = req.body;
      const checkSms = await this.usersService.checkSms(phone, code);
      if (!checkSms) return res.status(401).json({ message: "인증 실패" });
      const checkIdPhone = await this.usersService.checkIdPhone(loginId, phone);
      if (!checkIdPhone) throw { code: -1 };
      const tempPass = await this.usersService.tempPass(loginId);
      res.status(200).json({ password: tempPass });
    } catch (err) {
      if (err.code === -1) res.status(412).json({ errormessage: "회원가입 안하신듯?" });
      if (err.code === -2) {
        res.status(400).json({ errormessage: "임시 비밀번호 발급 에러" });
      } else {
        console.log(err);
        res.status(400).json({ errmessage: err });
      }
    }
  };
  //sms
  signupSms = async (req, res, next) => {
    try {
      const { phone } = req.body;
      const checkPhone = await this.usersService.checkPhone(phone);
      if (checkPhone) {
        throw { code: -1 };
      }
      const sendSms = await this.usersService.sendSms(phone);
      if (!sendSms) return res.status(400).json({ errormessage: "전송 실패" });
      return res.status(200).json({ message: "메세지 전송" });
    } catch (err) {
      if (err.code === -1) {
        res.status(412).json({ errormessage: "사용 중인 번호입니다." });
      } else {
        console.log(err);
        res.status(400).json({ errmessage: err });
      }
    }
  };
  // sms
  sendSms = async (req, res, next) => {
    const { phone } = req.body;
    const sendSms = await this.usersService.sendSms(phone);
    if (!sendSms) return res.status(400).json({ errormessage: "전송 실패" });
    res.status(200).json({ message: "메세지 전송" });
  };
  checkSms = async (req, res, next) => {
    try {
      const { phone, code } = req.body;
      const smsCheck = await this.usersService.checkSms(phone, code);
      if (smsCheck) return res.status(200).json({ message: "인증 성공" });
      return res.status(401).json({ message: "인증 실패" });
    } catch (err) {
      console.log(err);
      res.status(400).json({ errmessage: err });
    }
  };
  // 로그인
  LoginUser = async (req, res, next) => {
    try {
      const { loginId, password } = req.body;
      const { user, accessToken } = await this.usersService.LoginUser(loginId, password);
      if (user.deleteAt) {
        return res.status(202).json({
          nickname: user.nickname,
          accessToken: `Bearer ${accessToken}`,
          message: "탈퇴한 계정",
        });
      }
      return res.status(200).json({
        nickname: user.nickname,
        accessToken: `Bearer ${accessToken}`,
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
  // 유저 정보 조회
  getUser = async (req, res, next) => {
    try {
      const { loginId } = res.locals.user;
      const getUser = await this.usersService.getUser(loginId);
      return res.status(200).json({ user: getUser });
    } catch (err) {
      console.log(err);
      res.status(400).json({ errmessage: err });
    }
  };
  // 포인트 충전
  plusPoint = async (req, res, next) => {
    try {
      const { loginId, point } = req.body;
      const plusPoint = await this.usersService.plusPoint(loginId, point);
      return res.status(200).json({ message: `${plusPoint}포인트 충전 완료!` });
    } catch (err) {
      console.log(err);
      res.status(400).json({ errmessage: err });
    }
  };
  // 유저 정보 수정
  updateUser = async (req, res, next) => {
    try {
      const { loginId } = res.locals.user;
      const { password, confirmPassword, nickname, gender, phone, sports, favSports } = req.body;
      if (password !== confirmPassword) {
        throw { code: -3 };
      }
      const updateUser = await this.usersService.updateUser(
        loginId,
        password,
        nickname,
        gender,
        phone,
        sports,
        favSports
      );
      res.status(200).json({ user: updateUser });
    } catch (err) {
      if (err.code === -1) {
        res.status(412).json({ errormessage: "중복된 닉네임입니다.", code: -1 });
      } else if (err.code === -2) {
        res.status(412).json({ errormessage: "중복된 번호입니다.", code: -2 });
      } else if (err.code === -3) {
        res.status(412).json({ errormessage: "비밀번호를 확인해 주세요", code: -3 });
      } else {
        console.log(err);
        res.status(400).json({ errmessage: err });
      }
    }
  };
  changeImg = async (req, res, next) => {
    try {
      const { loginId } = res.locals.user;
      let profileImg = "";
      if (req.hasOwnProperty("file")) profileImg = req.file.location;
      const changeImg = await this.usersService.changeImg(loginId, profileImg);
      return res.status(200).json({ meesage: "프로필 이미지 변경 성공" });
    } catch (err) {
      if (err.code === -1) {
        res.status(401).json({ errormessage: "변경 안됐씀메" });
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
