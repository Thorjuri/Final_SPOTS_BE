const { Users, Reservations } = require("../models");
const redis = require("redis");
let redisCli;

class UsersRepository {
  constructor() {
    this.Users = Users;
  }
  // 회원가입
  createUser = async (loginId, password, nickname, gender, phone, sports, favSports) => {
    const profileImg =
      "https://woosungbucket.s3.ap-northeast-2.amazonaws.com/original/1669128469071_spots2.png";
    if (!sports) sports = "[]";
    if (!favSports) favSports = "[]";
    const createUser = await this.Users.create({
      loginId,
      password,
      nickname,
      gender,
      phone,
      sports: sports,
      favSports: favSports,
      profileImg: profileImg,
    });
    return createUser;
  };

  // ID 중복확인
  checkId = async (loginId) => {
    const checkId = await this.Users.findOne({ where: { loginId }, paranoid: false });
    if (!checkId) return false;
    return checkId;
  };
  // 닉네임 중복확인
  checkNick = async (nickname) => {
    const checkNick = await this.Users.findOne({ where: { nickname }, paranoid: false });
    return checkNick;
  };

  //휴대폰 중복확인
  checkPhone = async (phone) => {
    const checkPhone = await this.Users.findOne({ where: { phone }, paranoid: false });
    return checkPhone;
  };

  // id, phone 확인
  checkIdPhone = async (loginId, phone) => {
    const checkIdPhone = await this.Users.findOne({ where: { loginId, phone } });
    if (!checkIdPhone) return false;
    return true;
  };
  // 유저 조회
  getUser = async (loginId) => {
    const getUser = await this.Users.findOne({ where: { loginId } });
    return {
      ID: getUser.loginId,
      nickname: getUser.nickname,
      gender: getUser.gender,
      phone: getUser.phone,
      score: getUser.score,
      point: getUser.point,
      sports: getUser.sports,
      favSports: getUser.favSports,
      profileImg: getUser.profileImg,
    };
  };

  connectRedis = async () => {
    const redisClient = redis.createClient({ legacyMode: true });
    redisClient.on("connect", () => {
      console.info("Redis connected!");
    });
    redisClient.on("error", (err) => {
      console.error("Redis Client Error", err);
    });
    redisClient.connect().then();
    redisCli = redisClient.v4;
  };

  saveCode = async (phone, code) => {
    this.connectRedis();
    const saveCode = await redisCli.set(phone, code, { EX: 180 });
    return saveCode;
  };
  getCode = async (phone) => {
    this.connectRedis();
    const getCode = await redisCli.get(phone);
    return getCode;
  };
  // 포인트 충전
  plusPoint = async (loginId, point) => {
    const plusPoint = await this.Users.increment({ point: point }, { where: { loginId } });
    return plusPoint;
  };

  // 유저 정보 수정
  updateUser = async (loginId, password, nickname, gender, phone, sports, favSports) => {
    const updateUser = await this.Users.update(
      { loginId, password, nickname, gender, phone, sports, favSports },
      { where: { loginId } }
    );
    return updateUser;
  };
  changeImg = async (loginId, profileImg) => {
    if (!profileImg)
      profileImg =
        "https://woosungbucket.s3.ap-northeast-2.amazonaws.com/original/1669128469071_spots2.png";
    const changeImg = await this.Users.update({ profileImg: profileImg }, { where: { loginId } });
    return changeImg;
  };

  // 회원탈퇴
  dropUser = async (loginId) => {
    await this.Users.destroy({ where: { loginId } });
    return;
  };
  // 회원탈퇴 취소
  cancelDrop = async (loginId) => {
    await this.Users.restore({ where: { loginId } });
    return;
  };

  findReservation = async (nickname) => {

    const reservation = await Reservations.findOne({ where: { admin: nickname } })
    return reservation;
  };

  //Refresh토큰 업데이트
  updateRefresh = async (refreshToken, user, accKey) => {
    await this.Users.update(
      { refreshToken },
      { where: { loginId: user.loginId }, paranoid: false }
    );
    await this.Users.update({ accKey }, { where: { loginId: user.loginId, paranoid: false } });
  };
}

module.exports = UsersRepository;
