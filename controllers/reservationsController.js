const ReservationsService = require('../services/reservationsService.js');

class ReservationsController {
    reservationsService = new ReservationsService();

    createMatch = async(req, res)=> {
        const {nickname} = res.locals.user; //admin
        const {matchId, place, teamName, member, date, isDouble, price} = req.body;
        const data = await this.reservationsService.createMatch(nickname, matchId, place, teamName, member, date, isDouble, price);
        res.send(data);
    };

    getMatch = async(req, res)=> {
        const {place, date} = req.params;
        const data = await this.reservationsService.getMatch(place, date);
        res.send(data);
    };

    getMyMatch = async(req, res)=> {
        const {nickname} = res.locals.user;
        const data = await this.reservationsService.getMyMatch(nickname);
        res.send(data)
    };
};

module.exports = ReservationsController;
