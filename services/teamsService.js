const TeamsRepository = require('../repositories/teamsRepository.js');

class TeamsService {
    teamsRepository = new TeamsRepository();

    getMyTeam = async(userId)=> {
        const data = await this.teamsRepository.getMyTeam(userId);
        if(data.length < 0){ throw new Error('아직 가입한 팀이 없습니다.')};
        return data;
    };

    getAllTeams = async()=> {
        const data = await this.teamsRepository.getAllTeams();
        if(data.length < 0){ throw new Error('아직 생성된 팀이 없습니다.')};
        return data;
    };

    getSportsTeams = async(sports)=> {
        const data = await this.teamsRepository.getSportsTeams(sports);
        if(data.length < 0){ throw new Error('아직 생성된 팀이 없습니다.')};
        return data;
    };

    getTeamInfo = async(teamName)=> {
        const data = await this.teamsRepository.getTeamInfo(teamName);
        if(!data){ throw new Error('해당하는 팀을 찾을 수 없습니다.')}
        return data;
    };

    createTeam = async(teamName, sports, state, nickname)=> {
        if(!teamName || !sports || !state) throw new Error('필수 기입 사항을 모두 입력해주세요.');
        const allTeams = await this.getAllTeams();
        const checkName = allTeams.map((val)=>{
            return val.teamName
        });
        if(checkName.indexOf(teamName) >= 0){ throw new Error('중복된 팀 이름입니다. 팀 이름을 다시 작성해 주세요.')};
        const data = await this.teamsRepository.createTeam(teamName, sports, state, nickname);
        return data;
    };

    updateTeam = async(nickname, teamName)=> {
        const myTeams = await this.teamsRepository.checkMyTeam(nickname);
        if(myTeams.indexOf(teamName) >= 0) { throw new Error('이미 가입된 팀 입니다.')};
        
        myTeams.push(teamName);  //user테이블: 팀 목록에 팀 추가
        const newTeam = {"team" : myTeams};

        const getMembers = await this.teamsRepository.getMember(teamName);

        const addPlayer = getMembers.players;
        addPlayer.push(nickname);  //team테이블: player 추가
        const newMember = getMembers.members + 1 ;  //team테이블: member 인원 수 증가
        const newPlayer = {"player" : addPlayer};

        const data = await this.teamsRepository.updateTeam(nickname, teamName, newTeam, newMember, newPlayer);

        return data;
    };


    deleteTeam = async(nickname, teamName)=> {
        const myTeams = await this.teamsRepository.checkMyTeam(nickname);
        if(myTeams.indexOf(teamName) < 0 ) { throw new Error('가입되지 않은 팀 입니다.')};
        
        const idx = myTeams.indexOf(teamName);
        myTeams.splice(idx, 1);
        const newTeam = {"team" : myTeams};

        const getMembers = await this.teamsRepository.getMember(teamName);

        const dropPlayer = getMembers.players;
        const index = dropPlayer.indexOf(nickname);
        dropPlayer.splice(index, 1);
        const newPlayer = {"player" : dropPlayer};
        const newMember = getMembers.members -1 ;

        const data = await this.teamsRepository.deleteTeam(nickname, teamName, newTeam, newMember, newPlayer);
        return data;
    };

};

module.exports = TeamsService;
