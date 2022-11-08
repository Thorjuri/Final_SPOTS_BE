const express = require('express');
const router = express.Router();

const TeamsController = require('../controllers/teamsController.js');
const teamsController = new TeamsController();
const authMiddleware = require('../middlewares/auth_middleware');
const wrapAsyncController = require('../middlewares/wrapAsyncController');


// 1. 나의 팀 조회
router.get('/me', authMiddleware, wrapAsyncController(teamsController.getMyTeam))

// 2. 전체 팀 조회
router.get('/', wrapAsyncController(teamsController.getAllTeams))

// 3. 팀 상세 조회
router.get('/info', authMiddleware, wrapAsyncController(teamsController.getTeamInfo))

// 4. 신규 팀 생성
router.post('/register', authMiddleware, wrapAsyncController(teamsController.createTeam))

// 5. 팀 수정 - 기존 팀 가입
router.put('/update', authMiddleware, wrapAsyncController(teamsController.updateTeam))

// 6. 팀 수정 - 기존 팀 탈퇴
router.put('/drop', authMiddleware, wrapAsyncController(teamsController.deleteTeam))




module.exports = router;