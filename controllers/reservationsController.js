const ReservationsService = require('../services/reservationsService.js');

class ReservationsController {
    reservationsService = new ReservationsService();

    // 매치 예약 신청
    createMatch = async(req, res)=> {
        const {nickname} = res.locals.user; //admin
        const {matchId, place, teamName, member, date, isDouble, price, email} = req.body;
        const data = await this.reservationsService.createMatch(nickname, matchId, place, teamName, member, date, isDouble, price, email);
        res.status(201).send(data);
    };

    // 장소별-날짜별 예약현황 조회
    getMatch = async(req, res)=> {
        const {place, date} = req.params;
        const data = await this.reservationsService.getMatch(place, date);
        res.status(200).send(data);
    };

    // 나의 매치 조회
    getMyMatch = async(req, res)=> {
        const {nickname} = res.locals.user;
        const data = await this.reservationsService.getMyMatch(nickname);
        res.status(200).send(data)
    };

    // 전체 매치 조회
    getAllMatch = async(req, res)=> {
        const data = await this.reservationsService.getAllMatch();
        res.status(200).send(data)
    };

    // 장소별-날짜별 매칭 전/후 조회
    getMatchResult = async(req, res)=> {
        const {place, date} = req.params;
        const data = await this.reservationsService.getMatchResult(place, date);
        res.status(200).send(data);
    };

    // 매치 예약 취소
    deleteMatch = async(req, res)=> {
        const { nickname } = res.locals.user;
        const { matchId, teamName, place } = req.body;
        const data = await this.reservationsService.deleteMatch(nickname, matchId, teamName, place);
        res.status(201).send(data)
    }
};

module.exports = ReservationsController;
