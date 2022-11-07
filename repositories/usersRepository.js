const { Users } = require("../models");

class UsersRepository {
  // 회원가입
  createUser = async (loginId, password, nickname, gender, phone) => {
    await Users.create({ loginId, password, nickname, gender, phone });
    return;
  };

  // ID 유무 확인
  checkId = async (loginId) => {
    const checkId = await Users.findOne({ where: { loginId } });
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
  // 유저 정보 수정
  updateUser = async (loginId, password, nickname, gender, phone) => {
    await Users.update({ password, nickname, gender, phone }, { where: { loginId } });
    return;
  };
  // 회원탈퇴
  dropUser = async (loginId) => {
    await Users.update({ drop: true }, { where: { loginId } });
    return;
  };
  // 회원탈퇴 취소
  cancelDrop = async (loginId) => {
    await Users.update({ drop: false }, { where: { loginId } });
    return;
  };

  //Refresh토큰 업데이트
  updateRefresh = async (refreshToken, user) => {
    await Users.update({ refreshToken }, { where: { userId: user.userId } });
  };
}

module.exports = UsersRepository;
