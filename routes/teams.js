const express = require('express');
const router = express.Router();

const TeamsController = require('../controllers/teamsController.js');
const teamsController = new TeamsController();
const authMiddleware = require('../middlewares/auth_middleware');
const wrapAsyncController = require('../middlewares/wrapAsyncController');
const upload = require('../middlewares/multerS3_middleware.js')


// 1. 나의 팀 조회
router.get('/me', authMiddleware, wrapAsyncController(teamsController.getMyTeam))

// 2. 팀 상세 조회
router.get('/:teamId', authMiddleware, wrapAsyncController(teamsController.getTeamInfo))

// 3. 팀 신규 등록
router.post('/', authMiddleware, upload.single('image'), wrapAsyncController(teamsController.createTeam))

// 4. 팀 정보 수정
router.patch('/', authMiddleware, wrapAsyncController(teamsController.updateTeam));

// 5. 팀 삭제
router.delete('/:teamId', authMiddleware, wrapAsyncController(teamsController.deleteTeam))


module.exports = router;