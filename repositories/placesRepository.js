const { Places, Opens } = require("../models");

class PlacesRepository {
  createPlace = async (
    //시설등록
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
    const createPlaceData = await Places.create({
        x,
        y,
        sports,
        spotName,
        spotKind,
        address,
        comforts,
        price,
        desc,
    });

    return createPlaceData;
  };

  // 시설 전체 조회
  findAllPlaces = async () => {
    const places = await Places.findAll();

    return places;
  };

  //종목 조회
  getSports = async (sports) => {
    const findSports = await Places.findAll({ where: { sports } });

    return findSports;
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
