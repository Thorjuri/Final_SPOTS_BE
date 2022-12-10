const { Users } = require("../models");

class AuthRepository {
  findUser = async (loginId) => {
    const user = await Users.findOne({ where: { loginId }, paranoid: false });
    return user;
  };

  checkNick = async (nickname) => {
    const checkNick = await Users.findOne({ where: { nickname } });
    return checkNick;
  };

  checkPhone = async (phone) => {
    const checkPhone = await Users.findOne({ where: { phone } });
    return checkPhone;
  };

  getAccKey = async (loginId, accKey) => {
    const getAccKey = await Users.update({ accKey: accKey }, { where: { loginId: loginId } });
    return getAccKey;
  };
  signup = async (loginId, password, nickname, gender, phone, sports, favSports, profileImg) => {
    if (!profileImg)
      profileImg =
        "https://woosungbucket.s3.ap-northeast-2.amazonaws.com/original/1669128469071_spots2.png";
    if (!sports) sports = [];
    if (!favSports) favSports = [];
    const point = 300000;
    const signup = await Users.create({
      loginId,
      password,
      nickname,
      gender,
      phone,
      point,
      sports,
      favSports,
      profileImg,
    });
    return;
  };

  updateRefreshToken = async (loginId, refreshToken) => {
    const updateRefreshToken = await Users.update(
      { refreshToken },
      { where: { loginId: loginId } }
    );
  };
}

module.exports = AuthRepository;
