const { Places, Opens} = require("../models");

class PlacesRepository {   //시설등록

    createPlace = async (loginId,x,y,sports,spotName,spotKind,address,comforts,price,desc,image) => {

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
          image
      });

      return createPlaceData;
    };

    findPlaces = async (address) => {  //  등록된 시설 주소 찾기
      const findPlace = await Places.findOne({where: {address}});
      
      return findPlace;
    };

    // 시설 전체 조회
    findAllPlaces = async () => {
      const places = await Places.findAll();

      return places;
    };

    // 본인이 등록한 시설만 조회
    findGetPlaces = async (loginId) => {  
      const Place = await Places.findAll({where: {loginId}});
  
      return Place;
    };

    //종목 조회
    getSports = async (sports) => {
      const findSports = await Places.findAll({ where: { sports } });
  

      return findSports;
    };

    // 수정
    updatePlaces = async (placesId,loginId,x,y,sports,spotName,spotKind,address,comforts,price,desc,image) => {
      const updatePlaces = await Places.update(
          {x,y,sports,spotName,spotKind,address,comforts,price,desc,image}, {where: {placesId, loginId}}
      );
      const findPlaces = await Places.findOne({where : {placesId}});
      return findPlaces;
    };

    // 시설 삭제
    deletePlaces = async (placesId, loginId) => {
      const deletePlace = await Places.destroy({where: {placesId, loginId}});
      
      return deletePlace;
    };

    // //placesId 불러오기
    findPlacesId = async (placesId) => { 
      const findPlaceId = await Places.findByPk(placesId);

      return findPlaceId;
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
