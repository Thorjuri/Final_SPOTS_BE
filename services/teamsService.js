const TeamsRepository = require('../repositories/teamsRepository.js');

class TeamsService {
    teamsRepository = new TeamsRepository();

    getMyTeam = async(nickname)=> {
        const data = await this.teamsRepository.getMyTeam(nickname);
        if (data.length === 0) {
            const err = new Error(`teamsService Error`);
            err.status = 404;
            err.message = '아직 등록한 팀이 없습니다.';
            throw err;
        };
        return data;
    };


    getTeamInfo = async(teamId)=> {
        const data = await this.teamsRepository.getTeamInfo(teamId);
        if (!data) {
            const err = new Error(`teamsService Error`);
            err.status = 404;
            err.message = '해당하는 팀을 찾을 수 없습니다.';
            throw err;
        };
        return data;
    };


    createTeam = async(nickname, teamName, sports, member, image)=> {
        if (!teamName || !sports || !member) {
            const err = new Error(`teamsService Error`);
            err.status = 400;
            err.message = '필수 기입 사항을 모두 입력해주세요.';
            throw err;
        };
        const allTeams = await this.teamsRepository.getAllTeams();
        const checkName = allTeams.map((val)=>{
            return val.teamName
        });
        if (checkName.indexOf(teamName) >= 0) {
            const err = new Error(`teamsService Error`);
            err.status = 400;
            err.message = '중복된 팀 이름입니다. 팀 이름을 다시 작성해 주세요.';
            throw err;
        };
        const data = await this.teamsRepository.createTeam(nickname, teamName, sports, member, image);
        return data;
    };


    updateTeam = async(nickname, teamName, newAdmin, newMember)=> {
        const checkAdmin = await this.teamsRepository.getTeamOne(teamName);
            if (checkAdmin.admin !== nickname) {
                const err = new Error(`teamsService Error`);
                err.status = 403;
                err.message = '팀 수정 권한이 없습니다.';
                throw err;
            };    
            if(!newAdmin) { newAdmin = nickname};
        const checkUser = await this.teamsRepository.checkUser(newAdmin);
            if (!checkUser) {
                const err = new Error(`teamsService Error`);
                err.status = 400;
                err.message = 'admin은 가입한 회원에게만 위임할 수 있습니다.';
                throw err;
            };    
            if(!newMember) { newMember = checkAdmin.member};
        const data = await this.teamsRepository.updateTeam(teamName, newAdmin, newMember);
        return data;
    };


    deleteTeam = async(nickname, teamId)=> {
        const checkAdmin = await this.teamsRepository.getTeamInfo(teamId);
            if (checkAdmin.admin !== nickname) {
                const err = new Error(`teamsService Error`);
                err.status = 403;
                err.message = '팀 삭제 권한이 없습니다.';
                throw err;
            };    
        const data = await this.teamsRepository.deleteTeam(nickname, teamId);
        return data;
    };
};

module.exports = TeamsService;
