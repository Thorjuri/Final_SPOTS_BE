const ReservationsService = require('../services/reservationsService.js');

class ReservationsController {
    reservationsService = new ReservationsService();

    createMatch = async(req, res, next)=> {
        try{
            const {nickname} = res.locals.user;
            const {matchId, place, teamName, member, date} = req.body;
            const data = await this.reservationsService.createMatch(matchId, place, teamName, member, nickname, date);
            res.send(data);
        }catch(error) {
            res.status(401).json({error: error.message});
        }
    };

    getMatch = async(req, res, next)=> {
        try{
            const {matchId, place} = req.body;
            const data = await this.reservationsService.getMatch(matchId, place);
            res.send(data);
        }catch(error) {
            res.status(401).json({error: error.message});
        }
    };

    getReservations = async(req, res, next)=> {
        try{
            const {nickname} = res.locals.user;
            const data = await this.reservationsService.getReservations(nickname);
            res.send(data)
        }catch(error) {
            res.status(401).json({error: error.message});
        };
    };

};

module.exports = ReservationsController;
