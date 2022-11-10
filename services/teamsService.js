const TeamsRepository = require('../repositories/teamsRepository.js');

class TeamsService {
    teamsRepository = new TeamsRepository();

    getMyTeam = async(nickname)=> {
        const data = await this.teamsRepository.getMyTeam(nickname);
        if(data.length === 0){ throw new Error('아직 등록한 팀이 없습니다.')};
        return data;
    };

    getTeamInfo = async(teamId)=> {
        const data = await this.teamsRepository.getTeamInfo(teamId);
        if(!data){ throw new Error('해당하는 팀을 찾을 수 없습니다.')}
        return data;
    };

    createTeam = async(nickname, teamName, sports, member, image)=> {
        if(!teamName || !sports || !member) throw new Error('필수 기입 사항을 모두 입력해주세요.');
        const allTeams = await this.teamsRepository.getAllTeams();
        const checkName = allTeams.map((val)=>{
            return val.teamName
        });
        if(checkName.indexOf(teamName) >= 0){ throw new Error('중복된 팀 이름입니다. 팀 이름을 다시 작성해 주세요.')};
        const data = await this.teamsRepository.createTeam(nickname, teamName, sports, member, image);
        return data;
    };

    deleteTeam = async(nickname, teamName)=> {
        const check = await this.teamsRepository.getMyTeam(nickname);
        const myTeams = check.filter((val)=> {return val.teamName === teamName});
        if(myTeams.length === 0){ throw new Error('해당 팀을 찾을 수 없습니다. 팀 명을 확인해주세요.')}
        const data = await this.teamsRepository.deleteTeam(nickname, teamName);
        return data;
    };

};

module.exports = TeamsService;
