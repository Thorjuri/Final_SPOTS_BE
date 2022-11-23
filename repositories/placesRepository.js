const { Places, Opens, Reservations } = require("../models");
require("dotenv").config();
const mysql2 = require("mysql2"); //mysql 모듈 import

var db = mysql2.createConnection({
  //mpsql DB 연결  keywords 할때 sequelize 아니라서 다시 연결
  host: process.env.DB_ENDPOINT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
db.connect();

class PlacesRepository {
  //시설등록

  createPlace = async (
    loginId,
    x,
    y,
    sports,
    spotName,
    spotKind,
    address,
    comforts,
    price,
    desc,
    image
  ) => {
    const createPlaceData = await Places.create({
      loginId,
      x,
      y,
      sports,
      spotName,
      spotKind,
      address,
      comforts,
      price,
      desc,
      image,
    });

    return createPlaceData;
  };

  findPlaces = async (address) => {
    //  등록된 시설 주소 찾기
    const findPlace = await Places.findOne({ where: { address } });

    return findPlace;
  };

  // 사설 전체 조회
  findAllPlace = async () => {
    const places = await Places.findAll();

    return places;
  };

  // 사설 최신등록 6개만
  findRecentPlace = async () => {
    const RecentPlaces = await Places.findAll({
      limit: 6,
      order: [["createdAt", "DESC"]],
    });

    return RecentPlaces;
  };

  // 사설 + openApi 전체 조회
  findAllPlaces = async () => {
    const places = await Places.findAll();
    const opens = await Opens.findAll();

    return { private: places, public: opens };
  };

  // 본인이 등록한 시설만 조회
  findGetPlaces = async (loginId) => {
    const Place = await Places.findAll({ where: { loginId } });

    return Place;
  };

  //종목 조회
  getSports = async (sports) => {
    const findSports = await Places.findAll({ where: { sports } });

    return findSports;
  };

  dbQueryAsync = async (sql) => {
    return new Promise((resolve, reject) => {
      db.query(sql, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  };

  //keyword 조회
  getKeyword = async (keywords) => {
    const sql = `SELECT * FROM Places
      where sports like '%${keywords}%' OR spotName like '%${keywords}%' OR spotKind like '%${keywords}%' OR address like '%${keywords}%' OR comforts like '%${keywords}%' OR price like '%${keywords}%'`;

    const sql2 = `SELECT * FROM Opens
      where minclassnm like '%${keywords}%' OR svcstatnm like '%${keywords}%' OR svcnm like '%${keywords}%' OR placenm like '%${keywords}%' OR areanm like '%${keywords}%'`;

    const data = await this.dbQueryAsync(sql);
    const data2 = await this.dbQueryAsync(sql2);

    return { private: data, public: data2 };
  };

  // 수정
  updatePlaces = async (
    placesId,
    loginId,
    x,
    y,
    sports,
    spotName,
    spotKind,
    address,
    comforts,
    price,
    desc
  ) => {
    const updatePlaces = await Places.update(
      { x, y, sports, spotName, spotKind, address, comforts, price, desc },
      { where: { placesId, loginId } }
    );
    const findPlaces = await Places.findOne({ where: { placesId } });
    return findPlaces;
  };

  // 시설 삭제
  deletePlaces = async (placesId, loginId) => {
    const deletePlace = await Places.destroy({ where: { placesId, loginId } });

    return deletePlace;
  };

  //placesId 불러오기
  findPlacesId = async (placesId) => {
    const findPlaceId = await Places.findByPk(placesId);

    return findPlaceId;
  };

  //reservation의 place 불러오기
  findReservationPlace = async (place) => {
    const findPlace = await Reservations.findOne({ where: { place } });
    //console.log(findPlace);
    return findPlace;
  };

  // open api 전체 조회
  findAllOpens = async () => {
    const open = await Opens.findAll();

    return open;
  };

  // open api 소분류명 조회
  getSportsOpen = async (minclassnm) => {
    const findOpenSports = await Opens.findAll({ where: { minclassnm } });

    return findOpenSports;
  };

  // open api 지역명 조회
  getRegionOpen = async (areanm) => {
    const findOpenArea = await Opens.findAll({ where: { areanm } });
    console.log(findOpenArea);

    return findOpenArea;
  };
}

module.exports = PlacesRepository;
