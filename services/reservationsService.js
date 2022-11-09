const ReservationsRepository = require('../repositories/reservationsRepository.js');

class ReservationsService {
    reservationsRepository = new ReservationsRepository();

    createMatch = async(matchId, place, teamName, member, nickname, date)=> {
        const checkTeams = await this.reservationsRepository.checkTeam(teamName);
            if(!checkTeams){ throw new Error ('존재하지 않는 팀 입니다. 팀 명을 확인해주세요.')}
        const checkMatchs = await this.reservationsRepository.checkMatch(matchId, place)
            if(checkMatchs.data.length >= 2) { throw new Error ('해당 타임은 이미 마감되었습니다.')}
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
