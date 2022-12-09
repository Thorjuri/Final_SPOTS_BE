const { Places, Opens, Reservations } = require("../models");

require("dotenv").config();
const mysql2 = require("mysql2"); //mysql 모듈 import


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


  //keyword 조회
  getKeyword = async (keywords) => {

    var db = mysql2.createConnection({
      //mpsql DB 연결  keywords 할때 sequelize 아니라서 다시 연결
      host: process.env.DB_ENDPOINT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    db.connect();

    const dbQueryAsync = async (sql) => {
        return new Promise((resolve, reject) => {
          db.query(sql, (error, result) => {
            if (error) {
              reject(error);
            }
            resolve(result);
          });
        });
      };
    
    const a = keywords.split(' ')

    let [keyword, keyword2, keyword3] = a
    

    if(a.length === 1){    // 키워드 1개일때
      const sql = `SELECT * FROM Places where deletedAt Is NULL AND (sports like '%${keywords}%' OR spotName like '%${keywords}%' OR spotKind like '%${keywords}%' OR address like '%${keywords}%' OR comforts like '%${keywords}%' OR price like '%${keywords}%')`;
      const sql2 = `SELECT * FROM Opens where minclassnm like '%${keywords}%' OR svcstatnm like '%${keywords}%' OR svcnm like '%${keywords}%' OR placenm like '%${keywords}%' OR areanm like '%${keywords}%'`;
      const data = await dbQueryAsync(sql);
      const data2 = await dbQueryAsync(sql2);
      
      return { private: data, public: data2 };
      } 
      if(a.length === 2){   // 키워드 2개일때
        const sql3 = `SELECT * FROM Places where deletedAt Is NULL AND (sports like '%${keyword}%' OR spotName like '%${keyword}%' OR spotKind like '%${keyword}%' OR address like '%${keyword}%' OR comforts like '%${keyword}%' OR price like '%${keyword}%') AND (sports like '%${keyword2}%' OR spotName like '%${keyword2}%' OR spotKind like '%${keyword2}%' OR address like '%${keyword2}%' OR comforts like '%${keyword2}%' OR price like '%${keyword2}%')`;
        const sql4 = `SELECT * FROM Opens where (minclassnm like '%${keyword}%' OR svcstatnm like '%${keyword}%' OR svcnm like '%${keyword}%' OR placenm like '%${keyword}%' OR areanm like '%${keyword}%') AND (minclassnm like '%${keyword2}%' OR svcstatnm like '%${keyword2}%' OR svcnm like '%${keyword2}%' OR placenm like '%${keyword2}%' OR areanm like '%${keyword2}%')`;
        const data3 = await dbQueryAsync(sql3);
        const data4 = await dbQueryAsync(sql4);
        return { private: data3, public: data4 };
      }
      else{          // 키워드 3개일때
      const sql5 = `SELECT * FROM Places where deletedAt Is NULL AND (sports like '%${keyword}%' OR spotName like '%${keyword}%' OR spotKind like '%${keyword}%' OR address like '%${keyword}%' OR comforts like '%${keyword}%' OR price like '%${keyword}%') AND (sports like '%${keyword2}%' OR spotName like '%${keyword2}%' OR spotKind like '%${keyword2}%' OR address like '%${keyword2}%' OR comforts like '%${keyword2}%' OR price like '%${keyword2}%') AND (sports like '%${keyword3}%' OR spotName like '%${keyword3}%' OR spotKind like '%${keyword3}%' OR address like '%${keyword3}%' OR comforts like '%${keyword3}%' OR price like '%${keyword3}%')`;
      const sql6 = `SELECT * FROM Opens where (minclassnm like '%${keyword}%' OR svcstatnm like '%${keyword}%' OR svcnm like '%${keyword}%' OR placenm like '%${keyword}%' OR areanm like '%${keyword}%') AND (minclassnm like '%${keyword2}%' OR svcstatnm like '%${keyword2}%' OR svcnm like '%${keyword2}%' OR placenm like '%${keyword2}%' OR areanm like '%${keyword2}%') AND (minclassnm like '%${keyword3}%' OR svcstatnm like '%${keyword3}%' OR svcnm like '%${keyword3}%' OR placenm like '%${keyword3}%' OR areanm like '%${keyword3}%')`;
      const data5 = await dbQueryAsync(sql5);
      const data6 = await dbQueryAsync(sql6);
      return { private: data5, public: data6 };
      }

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
