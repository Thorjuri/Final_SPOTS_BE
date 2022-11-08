const TeamsService = require('../services/teamsService.js');

class TeamsController {
    teamsService = new TeamsService();

    getMyTeam = async(req, res)=> {
        const {userId} = res.locals.user;
        const data = await this.teamsService.getMyTeam(userId);
        res.send(data);
    };

    getAllTeams = async(req, res)=> {
        const data = await this.teamsService.getAllTeams();
        res.send(data);
    };

    getSportsTeams = async(req, res)=> {
        const {sports} = req.params;
        const data = await this. teamsService.getSportsTeams(sports);
        res.send(data);
    };

    getTeamInfo = async(req, res)=>{
        const { teamName } = req.body;
        const data = await this.teamsService.getTeamInfo(teamName);
        res.send(data);
    };

    createTeam = async(req, res)=> {
        const { nickname } = res.locals.user
        const {teamName, sports, state} = req.body;
        const data = await this.teamsService.createTeam(teamName, sports, state, nickname);
        res.send(data);
    };


    updateTeam = async(req, res)=> {
        const {nickname} = res.locals.user;
        const {teamName} = req.body;
        const data = await this.teamsService.updateTeam(nickname, teamName);
        res.send(data);
    };

    deleteTeam = async(req, res)=> {
        const {nickname} = res.locals.user;
        const {teamName} = req.body;
        const data = await this.teamsService.deleteTeam(nickname, teamName);
        res.send(data);
    };
};

module.exports = TeamsController;
