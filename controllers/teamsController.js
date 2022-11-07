const TeamsService = require('../services/teamsService.js');

class TeamsController {
    teamsService = new TeamsService();

    getMyTeam = async(req, res, next)=> {
        try{
            const {userId} = res.locals.user;
            const data = await this.teamsService.getMyTeam(userId);
            res.send(data);
        }catch(error){
            res.status(401).json({error: error.message});
        };
    };

    getAllTeams = async(req, res, next)=> {
        try{
            const data = await this.teamsService.getAllTeams();
            res.send(data);
        }catch(error){
            res.status(401).json({error: error.message});
        };
    };

    getTeamInfo = async(req, res, next)=>{
        try{
            const { teamName } = req.body;
            const data = await this.teamsService.getTeamInfo(teamName);
            res.send(data);
        }catch(error){
            res.status(401).json({error: error.message});
        };
    };

    createTeam = async(req, res, next)=> {
        try{
            const { nickname } = res.locals.user
            const {teamName, sports, state} = req.body;
            const data = await this.teamsService.createTeam(teamName, sports, state, nickname);
            res.send(data);
        }catch(error){
            res.status(401).json({error: error.message});
        };
    };


    updateTeam = async(req, res, next)=> {
        try{
            const {nickname} = res.locals.user;
            const {teamName} = req.body;
            const data = await this.teamsService.updateTeam(nickname, teamName);
            res.send(data);
        }catch(error){
            res.status(401).json({error: error.message});
        };
    };

    deleteTeam = async(req, res, next)=> {
        try{
            const {nickname} = res.locals.user;
            const {teamName} = req.body;
            const data = await this.teamsService.deleteTeam(nickname, teamName);
            res.send(data);
        }catch(error){
            res.status(401).json({error: error.message});
        };
    };
};

module.exports = TeamsController;
