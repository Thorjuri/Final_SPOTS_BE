const PlacesService = require("../services/placesService");

class PlacesController {
  placesService = new PlacesService();


  createPlace = async (req, res, next) => {
    //시설 등록
    try {

      const {loginId} = res.locals.user;  
      const { x,y,sports, spotName, spotKind, address, comforts, price, desc } = req.body;

      let image = ''
        req.hasOwnProperty('file')===false?  image = null : image = req.file.location

      const createPlaces = await this.placesService.createPlace(
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
     
     res.status(201).json({ message: "시설 등록이 완료되었습니다.", data : createPlaces});
    }
    catch (err) {
      res.status(err.statusCode ||400).json({message: err.message});
    }
  };


  findAllPlace = async (req, res, next) => {
    // 사설 전체 불러오기
    try {
    const places = await this.placesService.findAllPlace();

    res.status(200).json({ data: places });
    }
    catch (err) {
      res.status(err.statusCode ||400).json({message: err.message});  
    }
  };


  findRecentPlace = async (req, res, next) => {
    // 사설 최신등록 6개만
    try {
    const Recentplaces = await this.placesService.findRecentPlace();

    res.status(200).json({ data: Recentplaces });
    }
    catch (err) {
      res.status(err.statusCode ||400).json({message: err.message});  
    }
  };



  findAllPlaces = async (req, res, next) => {
    // 사설 + openApi 전체 조회
    try {
    const places = await this.placesService.findAllPlaces();

    res.status(200).json({ data: places });
    }
    catch (err) {
      res.status(err.statusCode ||400).json({message: err.message});
    }
  };
  



  findGetPlaces = async (req, res, next) => {
    // 본인이 등록한 시설만 조회
    try {
      const { loginId } = res.locals.user;
      const places = await this.placesService.findGetPlaces(loginId);

    res.status(200).json({ data: places });
    } 
    catch (err) {
      res.status(err.statusCode ||400).json({message: err.message});
    }
  };




  getSports = async (req, res, next) => {
    // 종목별 조회
    try {
    const { sports } = req.params;
    const places = await this.placesService.getSports(sports);

    res.status(200).json({ data: places });
    } 
    catch (err) {
      res.status(err.statusCode ||400).json({message: err.message});
    }
  };




  getKeyword = async (req, res, next) => {
    // 키워드별 조회
    try {
    const { keywords } = req.params;
    const keydata = await this.placesService.getKeyword(keywords);

    res.status(200).json({ data: keydata });
    } 
    catch (err) {
      res.status(err.statusCode ||400).json({message: err.message,public: err.message2,private: err.message3});
    }
  };





  updatePlaces = async (req, res, next) => {
    // 시설정보 수정
    try {
        const {placesId} = req.params;
        const {loginId} = res.locals.user;
        const {x,y,sports,spotName,spotKind,address,comforts,price,desc} = req.body;
        // let image = ''
        // req.hasOwnProperty('file')===false?  image = null : image = req.file.location

        const updateresult = await this.placesService.updatePlaces(
            placesId,
            loginId,
            x,y,sports,spotName,spotKind,address,comforts,price,desc
        );

    res.status(201).json({ message: "시설 정보 수정이 완료 되었습니다", data: updateresult });
    } 
    catch (err) {
      res.status(err.statusCode ||400).json({message: err.message});
    }
  };





  deletePlaces = async (req, res, next) => {
    // 시설 삭제
    try {
      const { placesId } = req.params;
      const { loginId } = res.locals.user;

      const deleteresult = await this.placesService.deletePlaces(placesId, loginId);

      res.status(201).json({ message: "시설 삭제가 완료 되었습니다" });
    } 
    catch (err) {
      res.status(err.statusCode ||400).json({message: err.message});
    }
  };





  findAllOpens = async (req, res, next) => {
    // open api 전체 불러오기

    try {
    const places = await this.placesService.findAllOpens();

    res.status(200).json({ data: places });
    
    } 
    catch (err) {
      res.status(err.statusCode ||400).json({message: err.message});
    }
  };




  getSportsOpen = async (req, res, next) => {
    // 소분류명 open api 조회

    try {
    const { minclassnm } = req.params;
    const places = await this.placesService.getSportsOpen(minclassnm);

    res.status(200).json({ data: places });
    } 
    catch (err) {
      res.status(err.statusCode ||400).json({message: err.message});
    }
  };
  



  getRegionOpen = async (req, res, next) => {
    // 지역명 open api 조회

    try {
    const { areanm } = req.params;
    const places = await this.placesService.getRegionOpen(areanm);

    res.status(200).json({ data: places });
    } 
    catch (err) {
      res.status(err.statusCode ||400).json({message: err.message});
    }
  };  
};

module.exports = PlacesController;
