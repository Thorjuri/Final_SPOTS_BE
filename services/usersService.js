const UsersRepository = require("../repositories/usersRepository");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { NCPClient } = require("node-sens");
require("dotenv").config();

class UsersService {
  usersRepository = new UsersRepository();
  //회원가입
  createUser = async (
    loginId,
    password,
    nickname,
    gender,
    phone,
    sports,
    favSports,
    recommendId
  ) => {
    const checkId = await this.usersRepository.checkId(loginId); // id 중복확인
    if (checkId) {
      throw { code: -1 };
    }
    const checkNick = await this.usersRepository.checkNick(nickname); // nickname 중복확인
    if (checkNick) {
      throw { code: -2 };
    }
    const checkPhone = await this.usersRepository.checkPhone(phone); // phone 중복확인
    if (checkPhone) {
      throw { code: -3 };
    }
    if (recommendId) {
      // 추천인 ID 유무 확인
      const checkRecommend = await this.usersRepository.checkId(recommendId);
      if (!checkRecommend) {
        throw { code: -4 };
      }
    }
    const salt = await bcrypt.genSalt(10);
    const enpryptedPW = bcrypt.hashSync(password, salt);
    password = enpryptedPW;

    await this.usersRepository.createUser(
      loginId,
      password,
      nickname,
      gender,
      phone,
      sports,
      favSports
    );

    await this.usersRepository.plusPoint(loginId, 5000);
    if (recommendId) {
      await this.usersRepository.plusPoint(loginId, 2000);
      await this.usersRepository.plusPoint(recommendId, 2000);
    }

    return;
  };
  // ID 중복검사
  checkId = async (loginId) => {
    const checkId = await this.usersRepository.checkId(loginId);

    return checkId;
  };
  // 유저 정보 조회
  getUser = async (loginId) => {
    const getUser = await this.usersRepository.getUser(loginId);
    if (!getUser) {
      return;
    }
    return getUser;
  };
  // 닉네임 중복검사
  checkNick = async (nickname) => {
    const checkNick = await this.usersRepository.checkNick(nickname);
    return checkNick;
  };
  // 휴대폰 중복검사
  checkPhone = async (phone) => {
    const checkPhone = await this.usersRepository.checkPhone(phone);
    return checkPhone;
  };

  // sms
  sendSms = async (phone) => {
    const ncp = new NCPClient({
      phoneNumber: "01068551466",
      serviceId: process.env.SERVICE_ID,
      secretKey: process.env.SECRET_KEY,
      accessKey: process.env.ACCESS_KEY,
    });
    const code = Math.floor(900000 * Math.random()) + 100000;
    const { success } = await ncp.sendSMS({
      to: phone,
      content: "[Spots] 인증번호 [" + code + "]를 입력해 주세요",
      countryCode: "82",
    });
    console.log(success);

    const saveCode = await this.usersRepository.saveCode(phone, code);
    return saveCode;
  };
  checkSms = async (phone, code) => {
    const checkCode = await this.usersRepository.getCode(phone);
    if (checkCode === code) {
      return true;
    } else return false;
  };
  // ID찾기
  findId = async (phone) => {
    const findId = await this.usersRepository.checkPhone(phone);
    if (!findId) throw { code: -1 };
    return {
      ID: findId.loginId,
    };
  };

  //임시 비밀번호 발급
  tempPass = async (loginId) => {
    const password = crypto.randomBytes(4).toString("hex");
    const salt = await bcrypt.genSalt(10);
    const enpryptedPW = bcrypt.hashSync(password, salt);
    const tempPass = await this.usersRepository.updateUser(loginId, enpryptedPW);
    if (!tempPass) throw { code: -2 };
    return password;
  };

  // ID, 번호 해당 하는 아이디 찾기
  checkIdPhone = async (loginId, phone) => {
    const checkIdPhone = await this.usersRepository.checkIdPhone(loginId, phone);
    return checkIdPhone;
  };
  // 로그인
  LoginUser = async (loginId, password) => {
    const user = await this.usersRepository.checkId(loginId);
    //console.log(user);
    if (!user) {
      throw { code: -1 };
    }
    const chekPass = await bcrypt.compare(password, user.password);
    if (!chekPass) {
      throw { code: -1 };
    }
    const accessToken = jwt.sign({ loginId: user.loginId }, process.env.SECRET_KEY, {
      expiresIn: "10s",
    });
    const refreshToken = jwt.sign({}, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    await this.usersRepository.updateRefresh(refreshToken, user);
    return {
      user: user,
      accessToken: accessToken,
    };
  };
  // 포인트 충전
  plusPoint = async (loginId, point) => {
    const plusPoint = await this.usersRepository.plusPoint(loginId, point);
    return plusPoint;
  };
  // 회원 정보 수정
  updateUser = async (loginId, password, nickname, gender, phone, sports, favSports) => {
    if (nickname) {
      const checkNick = await this.usersRepository.checkNick(nickname);
      if (checkNick) {
        throw { code: -1 };
      }
    }
    if (phone) {
      const checkPhone = await this.usersRepository.checkPhone(phone);
      if (checkPhone) {
        throw { code: -2 };
      }
    }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const bryptedPW = bcrypt.hashSync(password, salt);
      password = bryptedPW;
    }
    await this.usersRepository.updateUser(
      loginId,
      password,
      nickname,
      gender,
      phone,
      sports,
      favSports
    );
    const getUpdate = await this.usersRepository.getUser(loginId);
    return getUpdate;
  };
  changeImg = async (loginId, profileImg) => {
    const changeImg = await this.usersRepository.changeImg(loginId, profileImg);
    if (!changeImg[0]) throw { code: -1 };
    return changeImg;
  };
  // 회원탈퇴
  dropUser = async (loginId) => {
    await this.usersRepository.dropUser(loginId);
    return;
  };
  //탈퇴 취소
  cancelDrop = async (loginId) => {
    await this.usersRepository.cancelDrop(loginId);
    return;
  };
}

module.exports = UsersService;
