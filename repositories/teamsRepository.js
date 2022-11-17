const { Reservations, Users, Teams } = require('../models');

class TeamsRepository {

    //admin 여부 확인
    checkMyTeam = async(nickname)=> {
        const data = await Users.findOne({
            attributes: ['teamName'],
            where: { nickname }
        });
        return data.teamName.team
    };

    //멤버 조회
    getMember = async(teamName)=> {
        const data = await Teams.findOne({
            attributes: ['member', 'player'],
            where: { teamName }
        });
        const players = data.player.player
        const members = data.member
        return {players, members};
    }

    //유효 회원 체크
    checkUser = async(val)=> {
        const data = await Users.findOne({ where : { nickname : val}});
        return data;
    }

    //나의 팀 전체 조회
    getMyTeam = async(nickname)=> {
        const data = await Teams.findAll({ where: { admin : nickname } })
        return data;
    };

    //팀 전체 조회
    getAllTeams = async()=> {
        const data = await Teams.findAll({});
        return data;
    };

    //종목별 팀 조회
    getSportsTeams = async(sports)=> {
        const data =  await Teams.findAll({ where : { sports }});
        return data;
    };

    //팀 상세 조회(By Id)
    getTeamInfo = async(teamId)=>{
        const data = await Teams.findOne({ where : { teamId }});
        return data;
    };

    //팀 상세 조회(By Name)
    getTeamOne = async(teamName)=> {
        const data = await Teams.findOne({ where : { teamName }});
        return data;
    };

    //팀 신규 등록
    createTeam = async(nickname, teamName, sports, member, image)=> {
        const admin = nickname;
        const data = await Teams.create({admin, teamName, sports, member, image});
        return {data : data, message: "신규 팀 생성 완료."};
    };

    //팀 정보 수정
    updateTeam = async(teamName, newAdmin, newMember)=> {
        await Teams.update({ admin : newAdmin, member : newMember}, { where : { teamName }});
        await Reservations.update({ admin: newAdmin, member: newMember }, { where: { teamName, result: '경기 전'}});
        const updateTeam = await Teams.findOne({ where : { teamName }});
        const updateMatch = await Reservations.findAll({ where : { teamName, result: '경기 전'}});
        return {updateTeam, message: `변경된 매치 내역은 총 ${updateMatch.length}건 입니다`};
    };
    
    //팀 삭제
    deleteTeam = async(nickname, teamId)=> {
        await Teams.destroy({ where : { admin : nickname, teamId : teamId}});
        return {message : '팀이 삭제되었습니다.'}
    };

};

module.exports = TeamsRepository;
