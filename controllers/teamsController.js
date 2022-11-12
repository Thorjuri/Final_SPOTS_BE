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
        const { teamId } = req.params;
        const data = await this.teamsService.getTeamInfo(teamId);
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

    updateTeam = async(req, res)=> {
        const { teamName, newAdmin, newMember } = req.body;
        const { nickname } = res.locals.user;
        const data = await this.teamsService.updateTeam(nickname, teamName, newAdmin, newMember);
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
