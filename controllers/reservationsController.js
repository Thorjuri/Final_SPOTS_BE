const ReservationsService = require('../services/reservationsService.js');

class ReservationsController {
    reservationsService = new ReservationsService();

    createMatch = async(req, res, next)=> {
        try{
            const {nickname} = res.locals.user; //admin
            const {matchId, place, teamName, member, date, isDouble, price} = req.body;
            const data = await this.reservationsService.createMatch(nickname, matchId, place, teamName, member, date, isDouble, price);
            res.send(data);
        }catch(error) {
            res.status(401).json({error: error.message});
        }
    };

    getMatch = async(req, res, next)=> {
        try{
            const {place, date} = req.body;
            const data = await this.reservationsService.getMatch(place, date);
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
