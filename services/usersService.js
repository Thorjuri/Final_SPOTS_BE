const UsersRepository = require("../repositories/usersRepository");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// +sms
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
      const checkRecommend = await this.usersRepository.checkRecommend(recommendId);
      if (!checkRecommend) {
        throw { code: -4 };
      }
    }
    const salt = await bcrypt.genSalt(10);
    const enpryptedPW = bcrypt.hashSync(password, salt);
    password = enpryptedPW;

    // +sms

    await this.usersRepository.createUser(
      loginId,
      password,
      nickname,
      gender,
      phone,
      sports,
      favSports,
      recommendId
    );
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

  // +sms

  // ID찾기
  findId = async (phone) => {
    const findId = await this.usersRepository.checkPhone(phone);
    if (!findId) throw { code: -1 };
    return {
      ID: findId.loginId,
    };
  };
  checkIdPhone = async (loginId, phone) => {
    const checkIdPhone = await this.usersRepository.checkIdPhone(loginId, phone);
    return checkIdPhone;
  };
  // 로그인
  LoginUser = async (loginId, password) => {
    const user = await this.usersRepository.checkId(loginId);

    if (!user) {
      throw { code: -1 };
    }
    const chekPass = await bcrypt.compare(password, user.password);
    if (!chekPass) {
      throw { code: -1 };
    }
    const accessToken = jwt.sign({ userId: user.userId }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    const refreshToken = jwt.sign({}, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    await this.usersRepository.updateRefresh(refreshToken, user);
    return [user, accessToken];
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
