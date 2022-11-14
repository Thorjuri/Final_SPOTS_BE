const PlacesRepository = require("../repositories/placesRepository");

class PlacesService {
  placesRepository = new PlacesRepository();

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
    // 시설등록
    await this.placesRepository.createPlace(
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
    );
    return;
  };

  findAllPlaces = async () => {
    // 장소 전체 조회

    const findAllPlace = await this.placesRepository.findAllPlaces();

    return findAllPlace;
  };

  findGetPlaces = async (loginId) => {
    // 본인이 등록한 시설만 조회

    try {
    const findPlaces = await this.placesRepository.findGetPlaces(loginId);

    return findPlaces;
    } catch (error) {
        console.error(error);
        return (error.status || 400);
    }
  };

  getSports = async (sports) => {
    //종목별 조회

    try {
    const findFootsal = await this.placesRepository.getSports(sports);

    return findFootsal;
    } catch (error) {
        console.error(error);
        return (error.status || 400);
    }
  };

   // 수정
  updatePlaces = async (placesId,loginId,x,y,sports,spotName,spotKind,address,comforts,price,desc,image) => {
    const findplacesId = await this.placesRepository.updatePlaces(placesId);

        try {
          // 수정할 시설 자체가 없을때
          if (findplacesId === null) {
            return {'message': '수정할 시설이 없습니다.'};
        }

        //댓글을 적었던 유저 아이디와 지금 댓글을 바꾸려는 유저 아이디가 다른사람일때
        if (loginId !== findplacesId.dataValues.loginId) {
            return {'message': '시설 정보를 수정할 권한이 없습니다.'};
        }


        await this.placesRepository.updatePlaces(placesId,loginId,x,y,sports,spotName,spotKind,address,comforts,price,desc,image);

        return {'message': '시설 정보 수정이 완료 되었습니다'};

    } catch (error) {
        console.error(error);
        return (error.status || 400);
    }
};

  //삭제
  deletePlaces = async (placesId, loginId) => { 

    try {
    const findPlacesId = await this.placesRepository.findPlacesId(placesId); //repository에서 placesId 불러오기

        //해당하는 데이터가 없으면
        if (findPlacesId === null) {
            return {'message': '삭제할 시설이 없습니다.'};
        }

        //댓글을 삭제하려는 userId와 댓글을 작성한 userId가 다를때
        if (loginId !== findPlacesId.dataValues.loginId) {
            return {'message': '시설을 삭제할 권한이 없습니다.'};
        }

        await this.placesRepository.deletePlaces(placesId, loginId);

        return {'message': '시설 삭제가 완료 되었습니다'};

    } catch (error) {
        console.error(error);
        return (error.status || 400);
    }

};







  findAllOpens = async () => {
    // open api 전체조회

    const findOpenPlace = await this.placesRepository.findAllOpens();

    return findOpenPlace;
  };

  getSportsOpen = async (minclassnm) => {
    //소분류명 open api 조회

    try {
    const findOpenSports = await this.placesRepository.getSportsOpen(
      minclassnm
    );

    return findOpenSports;
    } catch (error) {
        console.error(error);
        return (error.status || 400);
    }
  };

  getRegionOpen = async (areanm) => {
    //지역명 open api 조회

    try {
    const findOpenArea = await this.placesRepository.getRegionOpen(areanm);

    return findOpenArea;
    } catch (error) {
        console.error(error);
        return (error.status || 400);
    }
  };
}

module.exports = PlacesService;
