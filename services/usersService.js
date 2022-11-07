const UsersRepository = require("../repositories/usersRepository");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

class UsersService {
  usersRepository = new UsersRepository();
  //회원가입
  createUser = async (loginId, password, nickname, gender, address, phone) => {
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
    const salt = await bcrypt.genSalt(10);
    const enpryptedPW = bcrypt.hashSync(password, salt);
    password = enpryptedPW;
    await this.usersRepository.createUser(loginId, password, nickname, gender, address, phone);
    return;
  };
  // ID 중복검사
  checkId = async (loginId) => {
    const checkId = await this.usersRepository.checkId(loginId);
    if (!checkId) {
      return;
    }
    return {
      ID: checkId.loginId,
      nickname: checkId.nickname,
      gender: checkId.gender,
      phone: checkId.phone,
      address: checkId.address,
      score: checkId.score,
    };
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
  updateUser = async (loginId, password, nickname, address, gender, phone) => {
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
    await this.usersRepository.updateUser(loginId, password, nickname, address, gender, phone);
    const getUpdate = await this.checkId(loginId);
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
