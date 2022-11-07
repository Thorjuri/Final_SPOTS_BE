const ReservationsService = require('../services/reservationsService.js');

class ReservationsController {
    reservationsService = new ReservationsService();

    createMatch = async(req, res, next)=> {
        try{
            const {matchId, place, teamName, member, admin, date} = req.body;
            const data = await this.reservationsService.createMatch(matchId, place, teamName, member, admin, date);
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
            const userId = res.locals.user;
            const data = await this.reservationsService.getReservations(userId);
            res.send(data)
        }catch(error) {
            res.status(401).json({error: error.message});
        };
    };

};

module.exports = ReservationsController;
