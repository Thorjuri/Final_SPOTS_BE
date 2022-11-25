const { Users } = require("../models");
// const redis = require("redis");

// const redisClient = redis.createClient({ legacyMode: true });
// redisClient.on("connect", () => {
//   console.info("Redis connected!");
// });
// redisClient.on("error", (err) => {
//   console.error("Redis Client Error", err);
// });
// redisClient.connect().then();
// const redisCli = redisClient.v4;

class UsersRepository {
  // 회원가입
  createUser = async (loginId, password, nickname, gender, phone, sports, favSports) => {
    const profileImg =
      "https://woosungbucket.s3.ap-northeast-2.amazonaws.com/original/1669128469071_spots2.png";
    await Users.create({
      loginId,
      password,
      nickname,
      gender,
      phone,
      sports,
      favSports,
      profileImg: profileImg,
    });
    return;
  };

  // ID 중복확인
  checkId = async (loginId) => {
    const checkId = await Users.findOne({ where: { loginId } });
    if (!checkId) return false;
    return checkId;
  };
  // 닉네임 중복확인
  checkNick = async (nickname) => {
    const checkNick = await Users.findOne({ where: { nickname } });
    return checkNick;
  };

  //휴대폰 중복확인
  checkPhone = async (phone) => {
    const checkPhone = await Users.findOne({ where: { phone } });
    return checkPhone;
  };

  // id, phone 확인
  checkIdPhone = async (loginId, phone) => {
    const checkIdPhone = await Users.findOne({ where: { loginId, phone } });
    if (!checkIdPhone) return false;
    return true;
  };
  // 유저 조회
  getUser = async (loginId) => {
    const getUser = await Users.findOne({ where: { loginId } });
    return {
      ID: getUser.loginId,
      nickname: getUser.nickname,
      gender: getUser.gender,
      phone: getUser.phone,
      score: getUser.score,
      point: getUser.point,
      teamName: getUser.teamName,
      sports: getUser.sports,
      favSports: getUser.favSports,
      profileImg: getUser.profileImg,
    };
  };

  // saveCode = async (phone, code) => {
  //   const saveCode = await redisCli.set(phone, code, { EX: 180 });
  //   return saveCode;
  // };
  // getCode = async (phone) => {
  //   const getCode = await redisCli.get(phone);
  //   return getCode;
  // };

  // 포인트 충전
  plusPoint = async (loginId, point) => {
    const plusPoint = await Users.increment({ point: point }, { where: { loginId } });
    return plusPoint;
  };

  // 유저 정보 수정
  updateUser = async (loginId, password, nickname, gender, phone, sports, favSports) => {
    const updateUser = await Users.update(
      { loginId, password, nickname, gender, phone, sports, favSports },
      { where: { loginId } }
    );
    return updateUser;
  };
  changeImg = async (loginId, profileImg) => {
    if (!profileImg)
      profileImg =
        "https://woosungbucket.s3.ap-northeast-2.amazonaws.com/original/1669128469071_spots2.png";
    const changeImg = await Users.update({ profileImg: profileImg }, { where: { loginId } });
    return changeImg;
  };

  // 회원탈퇴
  dropUser = async (loginId) => {
    await Users.update({ deleteAt: new Date() }, { where: { loginId } });
    return;
  };
  // 회원탈퇴 취소
  cancelDrop = async (loginId) => {
    await Users.update({ deleteAt: null }, { where: { loginId } });
    return;
  };

  //Refresh토큰 업데이트
  updateRefresh = async (refreshToken, user, accKey) => {
    await Users.update({ refreshToken }, { where: { loginId: user.loginId } });
    await Users.update({ accKey }, { where: { loginId: user.loginId } });
  };
}

module.exports = UsersRepository;
