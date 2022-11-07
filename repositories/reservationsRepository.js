const { Reservations, Users } = require('../models');

class ReservationsRepository {
    
    createMatch = async(matchId, place, teamName, member, admin, date)=> {
        const data = await Reservations.create({ matchId, place, teamName, member, admin, date });
        return {data: data, message : "매치 등록 완료"};
    };

    getMatch = async(matchId, place)=> {
        const data = await Reservations.findAll({ where: { matchId, place }});
        return {data: data, message : "매치 조회 완료"};
    };

    getReservations = async(userId)=> {
        const user = await Users.findOne({ where : { userId }});
        const team = user.teamName.team;
        const matchs = await team.map((val)=>{
            const match = Reservations.findOne({ where: { teamName : val }})
            return match
        });
        return matchs;
    };
};

module.exports = ReservationsRepository;
