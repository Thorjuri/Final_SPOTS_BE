const { Reservations, Users, Teams } = require('../models');

class TeamsRepository {

    
    checkMyTeam = async(nickname)=> {
        const data = await Users.findOne({
            attributes: ['teamName'],
            where: { nickname }
        });
        return data.teamName.team
    };

    getMember = async(teamName)=> {
        const data = await Teams.findOne({
            attributes: ['member', 'player'],
            where: { teamName }
        });
        const players = data.player.player
        const members = data.member
        return {players, members};
    }

    checkUser = async(val)=> {
        const data = await Users.findOne({ where : { nickname : val}});
        return data;
    }

    getMyTeam = async(nickname)=> {
        const data = await Teams.findAll({ where: { admin : nickname } })
        return data;
    };

    getAllTeams = async()=> {
        const data = await Teams.findAll({});
        return data;
    };

    getSportsTeams = async(sports)=> {
        const data =  await Teams.findAll({ where : { sports }});
        return data;
    };

    getTeamInfo = async(teamId)=>{
        const data = await Teams.findOne({ where : { teamId }});
        return data;
    };

    getTeamOne = async(teamName)=> {
        const data = await Teams.findOne({ where : { teamName }});
        return data;
    };

    createTeam = async(nickname, teamName, sports, member, image)=> {
        const admin = nickname;
        const data = await Teams.create({admin, teamName, sports, member, image});
        return {data : data, message: "신규 팀 생성 완료."};
    };

    updateTeam = async(teamName, newAdmin, newMember)=> {
        await Teams.update({ admin : newAdmin, member : newMember}, { where : { teamName }});
        await Reservations.update({ admin: newAdmin, member: newMember }, { where: { teamName, result: '경기 전'}});
        const updateTeam = await Teams.findOne({ where : { teamName }});
        const updateMatch = await Reservations.findAll({ where : { teamName, result: '경기 전'}});
        return {updateTeam, message: `변경된 매치 내역은 총 ${updateMatch.length}건 입니다`};
    };
    
    deleteTeam = async(nickname, teamName)=> {
        await Teams.destroy({ where : { admin : nickname, teamName : teamName}});
        return {message : '팀이 삭제되었습니다.'}
    };

};

module.exports = TeamsRepository;
