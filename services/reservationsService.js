const ReservationsRepository = require('../repositories/reservationsRepository.js');

class ReservationsService {
    reservationsRepository = new ReservationsRepository();

    createMatch = async(matchId, place, teamName, member, nickname, date)=> {
        const check = await this.reservationsRepository.getMatch(matchId, place)
        if(check.data.length >= 2) { throw new Error ('해당 타임은 이미 마감되었습니다.')}
        const data = await this.reservationsRepository.createMatch(matchId, place, teamName, member, nickname, date);
        return data;
    };

    getMatch = async(matchId, place)=>{
        const data = await this.reservationsRepository.getMatch(matchId, place);
        return data;
    };

    getReservations = async(nickname)=> {
        const data =  await this.reservationsRepository.getReservations(nickname);
        return data;
    };
    
};

module.exports = ReservationsService;
