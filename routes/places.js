const express = require('express');
const router = express.Router();

const PlacesController = require('../controllers/placesController.js');
const placesController = new PlacesController();
//const authMiddleware = require('../middlewares/auth_middleware');



//  시설 등록 
router.post('/', placesController.createPlace)

 //전체 조회 
router.get('/', placesController.findAllPlaces)

//  풋살 조회 
router.get('/:sports', placesController.getFootsal)

//  테니스 조회 
router.get('/:sports', placesController.getTennis)

//  배드민턴 조회 
router.get('/:sports', placesController.getBadminton)



module.exports = router;