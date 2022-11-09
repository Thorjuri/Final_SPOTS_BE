const TeamsService = require('../services/teamsService.js');

class TeamsController {
    teamsService = new TeamsService();

    getMyTeam = async(req, res)=> {
        const {nickname} = res.locals.user;
        console.log(nickname)
        const data = await this.teamsService.getMyTeam(nickname);
        res.send(data);
    };

    getTeamInfo = async(req, res)=>{
        const { teamName } = req.body;
        const data = await this.teamsService.getTeamInfo(teamName);
        res.send(data);
    };

    createTeam = async(req, res)=> {
        const { nickname } = res.locals.user
        const { teamName, sports, member} = req.body;
        let image = ''
        req.hasOwnProperty('file')===false?  image = null : image = req.file.location
        const data = await this.teamsService.createTeam(nickname, teamName, sports, member, image);
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
