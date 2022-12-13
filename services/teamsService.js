const TeamsRepository = require('../repositories/teamsRepository.js');
const ReservationsRepository = require('../repositories/reservationsRepository.js');
const ReservationsService = require('./reservationsService.js');


class TeamsService {
    teamsRepository = new TeamsRepository();
    reservationsRepository = new ReservationsRepository();
    reservationsService = new ReservationsService();

    // 나의 팀 조회
    getMyTeam = async(nickname)=> {
        const data = await this.teamsRepository.getMyTeam(nickname);
        if (data.length === 0) {
            const err = new Error(`teamsService Error`);
            err.status = 404;
            err.message = '아직 등록한 팀이 없습니다.';
            err.code = -1
            throw err;
        };
        return data;
    };

    // 팀 상세 조회
    getTeamInfo = async(teamId)=> {
        const data = await this.teamsRepository.getTeamInfo(teamId);
        if (!data) {
            const err = new Error(`teamsService Error`);
            err.status = 404;
            err.message = '해당하는 팀을 찾을 수 없습니다.';
            err.code = -1
            throw err;
        };
        return data;
    };

    // 팀 신규 등록
    createTeam = async(nickname, teamName, sports, member, image)=> {
        if (!teamName || !sports || !member) {
            const err = new Error(`teamsService Error`);
            err.status = 400;
            err.message = '필수 기입 사항을 모두 입력해주세요.';
            err.code = -1
            throw err;
        };

        const allTeams = await this.teamsRepository.getAllTeams();
        const checkName = allTeams.map((val)=> val.teamName );

        if (checkName.indexOf(teamName) >= 0) {
            const err = new Error(`teamsService Error`);
            err.status = 400;
            err.message = '중복된 팀 이름입니다. 팀 이름을 다시 작성해 주세요.';
            err.code = -2
            throw err;
        };
        
        if(image === null) {
            image = 'https://woosungbucket.s3.ap-northeast-2.amazonaws.com/original/1669128469071_spots2.png'
        };

        const data = await this.teamsRepository.createTeam(
            nickname, teamName, sports, member, image
            );
        return data;
    };

    // 팀 정보 수정
    updateTeam = async(nickname, teamName, newAdmin, newMember)=> {
        const checkAdmin = await this.teamsRepository.getTeamOne(teamName);
            if (checkAdmin.admin !== nickname) {
                const err = new Error(`teamsService Error`);
                err.status = 403;
                err.message = '팀 수정 권한이 없습니다.';
                err.code = -1
                throw err;
            };    
            if(!newAdmin) {
                newAdmin = nickname
            };

        const checkUser = await this.teamsRepository.checkUser(newAdmin);

            if (!checkUser) {
                const err = new Error(`teamsService Error`);
                err.status = 400;
                err.message = 'admin은 가입한 회원에게만 위임할 수 있습니다.';
                err.code = -1
                throw err;
            };   
            if(!newMember) {
                newMember = checkAdmin.member
            };

        const data = await this.teamsRepository.updateTeam(teamName, newAdmin, newMember);
    return data;
    };

    // 팀 삭제
    deleteTeam = async(nickname, teamId)=> {
        const getTeam = await this.teamsRepository.getTeamInfo(teamId);
        const checkMatch = await this.reservationsRepository.checkMatchByTeam(getTeam.teamName)
        let result = []
        for(let i = 0; i < checkMatch.length; i++){
            let matchDay = new Date(checkMatch[i].date) 
            let today = new Date()
            let dayDiff = await this.reservationsService.getDateDiff(matchDay, today);
            if (dayDiff >= -1){ result.push(checkMatch[i])}
        };

            if (getTeam.admin !== nickname) {
                const err = new Error(`teamsService Error`);
                err.status = 403;
                err.message = '팀 삭제 권한이 없습니다.';
                err.code = -1
                throw err;
            };    
            if (result.length > 0) {
                const err = new Error(`teamsService Error`);
                err.status = 403;
                err.message = '예약이 있는 경우 팀을 삭제할 수 없습니다.';
                err.code = -2
                throw err;
            };    
        const data = await this.teamsRepository.deleteTeam(nickname, teamId);
        return data;
    };
};

module.exports = TeamsService;
