const express = require('express');
const router = express.Router();

const TeamsController = require('../controllers/teamsController.js');
const teamsController = new TeamsController();
const authMiddleware = require('../middlewares/auth_middleware');


// 1. 나의 팀 조회
router.get('/me', authMiddleware, teamsController.getMyTeam)

// 2. 전체 팀 조회
router.get('/', teamsController.getAllTeams)

// 3. 신규 팀 생성
router.post('/register', authMiddleware, teamsController.createTeam)

// 4. 팀 수정 - 기존 팀 가입
router.put('/update', authMiddleware, teamsController.updateTeam)

// 2. 팀 수정 - 기존 팀 탈퇴
router.put('/drop', authMiddleware, teamsController.deleteTeam)




module.exports = router;