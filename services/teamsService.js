const TeamsRepository = require('../repositories/teamsRepository.js');

class TeamsService {
    teamsRepository = new TeamsRepository();

    getMyTeam = async(userId)=> {
        const data = await this.teamsRepository.getMyTeam(userId);
        return data;
    };

    getAllTeams = async()=> {
        const data = await this.teamsRepository.getAllTeams();
        return data;
    }

    createTeam = async(teamName, sports, state, nickname)=> {
        const allTeams = await this.getAllTeams()
        const checkName = allTeams.map((val)=>{
            return val.teamName
        })
        if(checkName.indexOf(teamName) >= 0){ throw new Error('중복된 팀 이름입니다. 팀 이름을 다시 작성해 주세요.')}
        const data = await this.teamsRepository.createTeam(teamName, sports, state, nickname)
        return data;
    };

    updateTeam = async(nickname, teamName)=> {
        const data = await this.teamsRepository.updateTeam(nickname, teamName);
        return data;
    };

    deleteTeam = async(nickname, teamName)=> {
        const data = await this.teamsRepository.deleteTeam(nickname, teamName);
        return data;
    };

};

module.exports = TeamsService;
