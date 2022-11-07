const ReservationsRepository = require('../repositories/reservationsRepository.js');

class ReservationsService {
    reservationsRepository = new ReservationsRepository();

    createMatch = async(matchId, place, teamName, member, admin, date)=> {
        const data = await this.reservationsRepository.createMatch(matchId, place, teamName, member, admin, date);
        return data;
    };

    getMatch = async(matchId, place)=>{
        const data = await this.reservationsRepository.getMatch(matchId, place);
        return data;
    };

    getReservations = async(userId)=> {
        const data =  await this.reservationsRepository.getReservations(userId);
        return data;
    };
    
};

module.exports = ReservationsService;
