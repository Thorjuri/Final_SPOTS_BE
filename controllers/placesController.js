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

    await this.placesService.createPlace(
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

    return res.status(201).json({ message: "시설 등록이 완료되었습니다." });
    } catch (error) {
        res.status(400).json({errorMessage: error.message});
    }
  };

  findAllPlaces = async (req, res, next) => {
    // 시설 전체 불러오기
    // try {
    const places = await this.placesService.findAllPlaces();

    res.json({ data: places });
    // } catch (error) {
    //     res.status(400).json({errorMessage: error.message});
    // }
    //};  
  };

  findGetPlaces = async (req, res, next) => {
    // 본인이 등록한 시설만 조회
    // try {
    const {loginId} = res.locals.user;
    const places = await this.placesService.findGetPlaces(loginId);

    res.json({ data: places });
    // } catch (error) {
    //     res.status(400).json({errorMessage: error.message});
    // }
  };



  getSports = async (req, res, next) => {
    // 종목별 조회
    // try {
    const { sports } = req.params;
    const places = await this.placesService.getSports(sports);

    res.json({ data: places });
    // } catch (error) {
    //     res.status(400).json({errorMessage: error.message});
    // }
  };

  updatePlaces = async (req, res, next) => {   // 시설정보 수정
    // try {
        const {placesId} = req.params;
        const {loginId} = res.locals.user;
        const {x,y,sports,spotName,spotKind,address,comforts,price,desc} = req.body;
        let image = ''
        req.hasOwnProperty('file')===false?  image = null : image = req.file.location

        const updateresult = await this.placesService.updatePlaces(
            placesId,
            loginId,
            x,y,sports,spotName,spotKind,address,comforts,price,desc,image
        );

        res.json({data: updateresult.message});
    // } catch (error) {
    //     res.status(error.status || 400).json({errorMessage: error.message});
    // }
};



deletePlaces = async (req, res, next) => {   // 시설 삭제
  try {
      const {placesId} = req.params;
      const {loginId} = res.locals.user;

      const deleteresult = await this.placesService.deletePlaces(
          placesId,
          loginId,
      );


      res.json({data: deleteresult.message});

  } catch (error) {
      res.status(error.status || 400).json({errorMessage: error.message});
  }
};










  findAllOpens = async (req, res, next) => {  // open api 전체 불러오기
    
    // try {
    const places = await this.placesService.findAllOpens();

    res.json({ data: places });
    //res.json({ data: places });
    // } catch (error) {
    //     res.status(400).json({errorMessage: error.message});
    // }
  };

  getSportsOpen = async (req, res, next) => {  // 소분류명 open api 조회
   
    // try {
    const { minclassnm } = req.params;
    const places = await this.placesService.getSportsOpen(minclassnm);

    res.json({ data: places });
    // } catch (error) {
    //     res.status(400).json({errorMessage: error.message});
    // }
  };

  getRegionOpen = async (req, res, next) => {  // 지역명 open api 조회
   
    // try {
    const { areanm } = req.params;
    const places = await this.placesService.getRegionOpen(areanm);
    // console.log(areanm)
    // console.log(places)

    res.json({ data: places });
    // } catch (error) {
    //     res.status(400).json({errorMessage: error.message});
    // }
  };

}

module.exports = PlacesController;
