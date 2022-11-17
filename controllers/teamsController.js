const TeamsService = require('../services/teamsService.js');

class TeamsController {
    teamsService = new TeamsService();

    // 나의 팀 조회
    getMyTeam = async(req, res)=> {
        const {nickname} = res.locals.user;
        console.log(nickname)
        const data = await this.teamsService.getMyTeam(nickname);
        res.status(200).send(data);
    };

    // 팀 상세정보 조회
    getTeamInfo = async(req, res)=>{
        const { teamId } = req.params;
        const data = await this.teamsService.getTeamInfo(teamId);
        res.status(200).send(data);
    };

    // 팀 신규 등록
    createTeam = async(req, res)=> {
        const { nickname } = res.locals.user
        const { teamName, sports, member} = req.body;
        let image = ''
        req.hasOwnProperty('file')===false?  image = null : image = req.file.location
        const data = await this.teamsService.createTeam(nickname, teamName, sports, member, image);
        res.status(201).send(data);
    };

    // 팀 정보 수정
    updateTeam = async(req, res)=> {
        const { teamName, newAdmin, newMember } = req.body;
        const { nickname } = res.locals.user;
        const data = await this.teamsService.updateTeam(nickname, teamName, newAdmin, newMember);
        res.status(201).send(data);
    };

    // 팀 삭제
    deleteTeam = async(req, res)=> {
        const {nickname} = res.locals.user;
        const { teamId } = req.params;
        const data = await this.teamsService.deleteTeam(nickname, teamId);
        res.status(201).send(data);
    };
};

module.exports = TeamsController;
