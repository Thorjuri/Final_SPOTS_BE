const express = require('express');
const router = express.Router();

const PlacesController = require('../controllers/placesController.js');
const placesController = new PlacesController();
//const authMiddleware = require('../middlewares/auth_middleware');



//  시설 등록 
router.post('/', placesController.createPlace)

 //전체 조회 
router.get('/', placesController.findAllPlaces)

//Open Api 전체 조회 
router.get('/open', placesController.findAllOpens)

//  종목 조회 
router.get('/:sports', placesController.getSports)

//Open Api 소분류명 조회 
router.get('/open/:minclassnm', placesController.getSportsOpen)

//Open Api 지역명 조회 
router.get('/opens/:areanm', placesController.getRegionOpen)






module.exports = router;