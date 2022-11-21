const express = require('express');
const router = express.Router();

const PlacesController = require('../controllers/placesController.js');
const placesController = new PlacesController();
const authMiddleware = require('../middlewares/auth_middleware');
const upload = require('../middlewares/multerS3_middleware.js')



//  시설 등록 
router.post('/', authMiddleware, upload.single('image'), placesController.createPlace)

//  사설 전체 조회 
router.get('/', placesController.findAllPlace)  

// 사설 최신등록 6개만 
router.get('/new', placesController.findRecentPlace)  

 //  사설 + openApi 전체 조회 
router.get('/all', placesController.findAllPlaces) 

//  본인이 등록한 시설만 조회 
router.get('/me', authMiddleware, placesController.findGetPlaces)


//  Open Api 전체 조회 
router.get('/open', placesController.findAllOpens)


//  종목 조회 
router.get('/:sports', placesController.getSports)

//  키워드 조회 
router.get('/keyword/:keywords', placesController.getKeyword)

//  시설 수정
router.patch('/:placesId', authMiddleware, placesController.updatePlaces); 

//  시설 삭제
router.delete('/:placesId', authMiddleware, placesController.deletePlaces);

//  Open Api 소분류명 조회 
router.get('/open/:minclassnm', placesController.getSportsOpen)

//  Open Api 지역명 조회 
router.get('/opens/:areanm', placesController.getRegionOpen)






module.exports = router;