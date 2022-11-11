const ReservationsRepository = require('../repositories/reservationsRepository.js');

class ReservationsService {
    reservationsRepository = new ReservationsRepository();

    createMatch = async(nickname, matchId, place, teamName, member, date, isDouble, price)=> {
        const checkTeams = await this.reservationsRepository.checkTeam(teamName);
            if(!checkTeams){ throw new Error ('존재하지 않는 팀 입니다. 팀 명을 확인해주세요.')}
        const checkMatchs = await this.reservationsRepository.checkMatch(matchId, place)
            if(checkMatchs.data.length >= 2) { throw new Error ('해당 타임은 이미 마감되었습니다.')}
            if(checkTeams.admin !== nickname) { throw new Error ('매칭 신청은 팀장만 가능합니다.')}
        const checkPoints = await this.reservationsRepository.checkPoint(nickname);
            if(checkPoints.point < price ) { throw new Error (`보유 포인트가 부족합니다. 현재 잔여 포인트:  ${checkPoints.point} 포인트`)};
        const data = await this.reservationsRepository.createMatch(nickname, matchId, place, teamName, member, date, isDouble, price);
        return data;
    };

    getMatch = async(place, date)=>{
        const data = await this.reservationsRepository.getMatch(place, date);
        return data;
    };

    getMyMatch = async(nickname)=> {
        const admin = nickname;
        const data =  await this.reservationsRepository.getMyMatch(admin);
        return data;
    };
    
};

module.exports = ReservationsService;
