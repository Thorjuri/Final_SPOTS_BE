const express = require('express');
const router = express.Router();

const ReservationsController = require('../controllers/reservationsController.js');
const reservationsController = new ReservationsController();
const authMiddleware = require('../middlewares/auth_middleware')
const wrapAsyncController = require('../middlewares/wrapAsyncController');


// 1. 매치 예약 신청
router.post('/register', authMiddleware, wrapAsyncController(reservationsController.createMatch));

// 2. 장소별-날짜별 예약현황 조회
router.get('/register/:place/:date', authMiddleware, wrapAsyncController(reservationsController.getMatch));

// 3. 나의 매치 조회
router.get('/me', authMiddleware, wrapAsyncController(reservationsController.getMyMatch));

// 4. 전체 매치 조회 (홈 화면 용)
router.get('/register', wrapAsyncController(reservationsController.getAllMatch))

// 5. 장소별-날짜별 매칭 전/후 조회
router.get('/register/result/:place/:date', authMiddleware, wrapAsyncController(reservationsController.getMatchResult))

// 6. 매치 예약 취소
router.put('/register/delete', authMiddleware, wrapAsyncController(reservationsController.deleteMatch));

module.exports = router;