const PlacesRepository = require("../repositories/placesRepository");

class PlacesService {
  placesRepository = new PlacesRepository();

  // 시설등록
  createPlace = async (loginId,x,y,sports,spotName,spotKind,address,comforts,price,desc,image) => {

    const findPlaces = await this.placesRepository.findPlaces(address);
    console.log(findPlaces)

        if (!sports || !spotName || !spotKind || !address || !comforts || !price || !desc) {
          const err = new Error(`placesService Error`);
          err.statusCode = 400;
          err.message = '빈칸을 입력해주세요.';
          throw err;
        };

        if (findPlaces) {
          const err = new Error(`placesService Error`);
          err.statusCode = 400;
          err.message = '이미 등록된 시설입니다.';
          throw err;
             
        };

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

    
    const findPlaces = await this.placesRepository.findGetPlaces(loginId);

    if(findPlaces.length == 0){
      const err = new Error(`placesService Error`);
      err.statusCode = 404;
      err.message = '등록된 시설이 없습니다.';
      throw err;
    }

    return findPlaces;
  };

  getSports = async (sports) => {
    //종목별 조회
  
    const findFootsal = await this.placesRepository.getSports(sports);
    console.log(findFootsal)

    if(findFootsal.length === 0){
      const err = new Error(`placesService Error`);
      err.statusCode = 404;
      err.message = '등록이 안된 종목입니다.';
      throw err;
    }

    return findFootsal;

  };

   // 수정
  updatePlaces = async (placesId,loginId,x,y,sports,spotName,spotKind,address,comforts,price,desc,image) => {
    const findplacesId = await this.placesRepository.findPlacesId(placesId);
  
       
          // 수정할 시설 자체가 없을때
          if (findplacesId === null) {
            const err = new Error(`placesService Error`);
            err.statusCode = 404;
            err.message = '수정할 시설이 없습니다.';
            throw err;
            
        }

        //시설을 등록한 유저 아이디와 지금 정보를 바꾸려는 유저 아이디가 다른사람일때
        if (loginId !== findplacesId.dataValues.loginId) {
          const err = new Error(`placesService Error`);
            err.statusCode = 403;
            err.message = '시설 정보를 수정할 권한이 없습니다.';
            throw err;
          };


        await this.placesRepository.updatePlaces(placesId,loginId,x,y,sports,spotName,spotKind,address,comforts,price,desc,image);

        return {'message': '시설 정보 수정이 완료 되었습니다'};
  };

  //삭제
  deletePlaces = async (placesId, loginId) => { 

  
    const findPlacesId = await this.placesRepository.findPlacesId(placesId); //repository에서 placesId 불러오기

        //해당하는 데이터가 없으면
        if (findPlacesId === null) {
            return {'message': '삭제할 시설이 없습니다.'};
        }

        //댓글을 삭제하려는 userId와 댓글을 작성한 userId가 다를때
        if (loginId !== findPlacesId.dataValues.loginId) {
          const err = new Error(`placesService Error`);
            err.statusCode = 403;
            err.message = '시설을 삭제할 권한이 없습니다.';
            throw err;
          };
            
          await this.placesRepository.deletePlaces(placesId, loginId);
  
          return {'message': '시설 삭제가 완료 되었습니다'};
  };
     

    







  findAllOpens = async () => {
    // open api 전체조회

    const findOpenPlace = await this.placesRepository.findAllOpens();

    return findOpenPlace;
  };

  getSportsOpen = async (minclassnm) => {
    //소분류명 open api 조회
    
    const findOpenSports = await this.placesRepository.getSportsOpen(minclassnm);

    if(findOpenSports.length === 0){
      const err = new Error(`placesService Error`);
      err.statusCode = 404;
      err.message = '등록이 안된 종목입니다.';
      throw err;
    }

    return findOpenSports;
    
  };

  getRegionOpen = async (areanm) => {
    //지역명 open api 조회

    const findOpenArea = await this.placesRepository.getRegionOpen(areanm);

    if(findOpenArea.length === 0){
      const err = new Error(`placesService Error`);
      err.statusCode = 404;
      err.message = '등록이 안된 지역입니다.';
      throw err;
    }

    return findOpenArea;
    
  };
}

module.exports = PlacesService;
