const { Reservations, Users, Teams } = require('../models');
require("dotenv").config();


class ReservationsRepository {

    // 현재 보유 포인트조회
    checkPoint = async(nickname)=> {
        const data = await Users.findOne({
            attributes: ['point'],
            where : { nickname }
        });
        return data;
    };

    // 포인트 결제 (포인트 차감)
    createPayment = async(nickname, price)=> {
        const points = await this.checkPoint(nickname);
        const newPoints = points.point - price;
        await Users.update({ point : newPoints}, { where : { nickname }});
        return newPoints;
    }

    createMatch = async(nickname, matchId, place, teamName, member, date, isDouble, price)=> {
        const admin = nickname
        const payment = await this.createPayment(nickname, price); //결제 후 잔여 포인트를 반환함
        const data = await Reservations.create({ admin, matchId, place, teamName, member, date, isDouble, price }); //매칭 등록
        return {data, message : `매치 등록 완료. 결제 후 잔여 포인트:  ${payment} 포인트`};
    };

    checkTeam = async(teamName)=> {
        const data = await Teams.findOne({ where : { teamName }});
        return data;
    };

    checkMatch = async(matchId, place)=> {
        const data = await Reservations.findAll({ where: { matchId, place }});
        return {data: data, message : "매치 조회 완료"};
    };

    getMatch = async(place, date)=> {
        const data = await Reservations.findAll({ 
            where : {place, date},
            order: [['matchId']]
        });
        return {data, message: `조회된 매치 신청: ${data.length}건`}
    };


    getMyMatch = async(admin)=> { // 수정중. 빈 값 반환 문제 (map 비동기 문제인 듯)
        const data = await Reservations.findAll({ where : { admin }});
        return data;
    };
};

module.exports = ReservationsRepository;
