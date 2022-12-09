const PlacesRepository = require("../repositories/placesRepository");

class PlacesService {
  placesRepository = new PlacesRepository();

  // 시설등록
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
    const findPlaces = await this.placesRepository.findPlaces(address);

    if (!sports || !spotName || !spotKind || !price || !desc) {
      throw { code: -1 };
      // const err = new Error(`placesService Error`);
      // err.statusCode = 400;
      // err.message = "빈칸을 입력해주세요.";
      // throw err;
    }

    if(image === null) {
      throw { code: -2 };
      // const err = new Error(`placesService Error`);
      // err.statusCode = 400;
      // err.message = "이미지를 등록해주세요.";
      // throw err;

    }

    if (findPlaces) {
      throw { code: -3 };
      // const err = new Error(`placesService Error`);
      // err.statusCode = 400;
      // err.message = "이미 등록된 시설입니다.";
      // throw err;
    }

    const createPlaces = await this.placesRepository.createPlace(
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

    return createPlaces;
  };

  findAllPlace = async () => {
    // 사설 전체 조회

    const findAllPlace = await this.placesRepository.findAllPlace();

    return findAllPlace;
  };

  findRecentPlace = async () => {
    // 사설 최신등록 6개만

    const findRecentPlace = await this.placesRepository.findRecentPlace();

    return findRecentPlace;
  };

  findAllPlaces = async (countPerPage,pageNo) => { 
    // 사설 + openApi 전체 조회
    
    const findAllPlace = await this.placesRepository.findAllPlaces();
    let privatePageList = [];
    let publicPageList = [];

    if (countPerPage == undefined || typeof countPerPage == "undefined" || countPerPage == null) {
      countPerPage = 5;
    } else {
      countPerPage = parseInt(countPerPage);
    }
    if (pageNo == undefined || typeof pageNo == "undefined" || pageNo == null) {
      pageNo = 0;
    } else {
      pageNo = parseInt(pageNo);
    }

    if (pageNo > 0) {
      // 전체 크기
      let totalCount =  findAllPlace.public.length + findAllPlace.private.length;   
      // 시작 번호
      let startItemNo = (pageNo - 1) * countPerPage;
      // 종료 번호
      let endItemNo = pageNo * countPerPage - 1;
      // 종료 번호가 전체 크기보다 크면 전체 크기로 변경
      if (endItemNo > totalCount - 1) {
        endItemNo = totalCount - 1;
      }
      if (startItemNo < totalCount) {
        for (let i = startItemNo; i <= endItemNo; i++) {
          privatePageList.push(findAllPlace.private[i]);
          publicPageList.push(findAllPlace.public[i]);
        }
      }
    }; 
    return {private : privatePageList, public : publicPageList};
  };

  findGetPlaces = async (loginId) => {
    // 본인이 등록한 시설만 조회

    const findPlaces = await this.placesRepository.findGetPlaces(loginId);

    if (findPlaces.length == 0) {
      const err = new Error(`placesService Error`);
      err.statusCode = 404;
      err.message = "등록된 시설이 없습니다.";
      throw err;
    }

    return findPlaces;
  };

  getSports = async (sports) => {
    //종목별 조회

    const findFootsal = await this.placesRepository.getSports(sports);

    if (findFootsal.length === 0) {
      const err = new Error(`placesService Error`);
      err.statusCode = 404;
      err.message = "등록이 안된 종목입니다.";
      throw err;
    }

    return findFootsal;
  };

  getKeyword = async (keywords) => {
    //키워드별 조회

    const findKeyword = await this.placesRepository.getKeyword(keywords);

    if (findKeyword.private.length === 0 && findKeyword.public.length === 0) {
      const err = new Error(`placesService Error`);
      err.statusCode = 206;
      err.message = "존재하지 않는 키워드입니다.";
      err.message2 = findKeyword.public;
      err.message3 = findKeyword.private;
      throw err;
    }

    return findKeyword;
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
    const findplacesId = await this.placesRepository.findPlacesId(placesId);

    // 수정할 시설 자체가 없을때
    if (findplacesId === null) {
      const err = new Error(`placesService Error`);
      err.statusCode = 404;
      err.message = "수정할 시설이 없습니다.";
      throw err;
    }

    //시설을 등록한 유저 아이디와 지금 정보를 바꾸려는 유저 아이디가 다른사람일때
    if (loginId !== findplacesId.dataValues.loginId) {
      const err = new Error(`placesService Error`);
      err.statusCode = 403;
      err.message = "시설 정보를 수정할 권한이 없습니다.";
      throw err;
    }

    const updateData = await this.placesRepository.updatePlaces(
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
    );

    return updateData;
  };

  //삭제
  deletePlaces = async (placesId, loginId) => {
    const findPlacesId = await this.placesRepository.findPlacesId(placesId); //repository에서 placesId 불러오기
    const place = findPlacesId.spotName;    //등록된 구장 이름

    const findReservationPlace = await this.placesRepository.findReservationPlace(place); //등록된 구장 이름과 같은 reservation의 place 불러오기

    //해당하는 데이터가 없으면
    if (findPlacesId === null) {
      const err = new Error(`placesService Error`);
      err.statusCode = 404;
      err.message = "삭제할 시설이 없습니다.";
      throw err;
    }

    //예약 된 구장은 삭제 x
    if (findReservationPlace) {
      const err = new Error(`placesService Error`);
      err.statusCode = 406;
      err.message = "예약이 있는 구장은 삭제할 수 없습니다.";
      throw err;
    }

    //댓글을 삭제하려는 userId와 댓글을 작성한 userId가 다를때
    if (loginId !== findPlacesId.dataValues.loginId) {
      const err = new Error(`placesService Error`);
      err.statusCode = 403;
      err.message = "시설을 삭제할 권한이 없습니다.";
      throw err;
    }

    const deleteData = await this.placesRepository.deletePlaces(
      placesId,
      loginId
    );

    return deleteData;
  };

  findAllOpens = async () => {
    // open api 전체조회

    const findOpenPlace = await this.placesRepository.findAllOpens();

    return findOpenPlace;
  };

  getSportsOpen = async (minclassnm) => {
    //소분류명 open api 조회

    const findOpenSports = await this.placesRepository.getSportsOpen(
      minclassnm
    );

    if (findOpenSports.length === 0) {
      const err = new Error(`placesService Error`);
      err.statusCode = 404;
      err.message = "등록이 안된 종목입니다.";
      throw err;
    }

    return findOpenSports;
  };

  getRegionOpen = async (areanm) => {
    //지역명 open api 조회

    const findOpenArea = await this.placesRepository.getRegionOpen(areanm);

    if (findOpenArea.length === 0) {
      const err = new Error(`placesService Error`);
      err.statusCode = 404;
      err.message = "등록이 안된 지역입니다.";
      throw err;
    }

    return findOpenArea;
  };
}

module.exports = PlacesService;
