const { Reservations, Users } = require('../models');

class ReservationsRepository {

    createMatch = async(matchId, place, teamName, member, nickname, date)=> {
        const admin = nickname
        const data = await Reservations.create({ matchId, place, teamName, member, admin, date });
        return {data: data, message : "매치 등록 완료"};
    };

    getMatch = async(matchId, place)=> {
        const data = await Reservations.findAll({ where: { matchId, place }});
        return {data: data, message : "매치 조회 완료"};
    };

    getReservations = async(nickname)=> { // 수정중. 빈 값 반환 문제 (map 비동기 문제인 듯)
        const user = await Users.findOne({ where : { nickname }});
        const team = user.teamName.team; 
        let matchs = [];
        for(let i = 0; i<team.length; i++){
            let match = await Reservations.findOne({ where : { teamName : team[i]}});
            matchs.push(match);      
        }
        return matchs;
    };
};

module.exports = ReservationsRepository;
