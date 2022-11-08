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

    getMyTeam = async(userId)=> {
        const data = await Users.findOne({
            attributes: ['teamName'],
            where: { userId }
        })
        return data;
    };

    getAllTeams = async()=> {
        const data = await Teams.findAll({});
        return data;
    };

    getTeamInfo = async(teamName)=>{
        const data = await Teams.findOne({ where : { teamName }});
        return data;
    };

    createTeam = async(teamName, sports, state, nickname)=> {
        const admin = nickname;
        const data = await Teams.create({teamName, sports, state, admin});
        return {data : data, message: "신규 팀 생성 완료."};
    };

    updateTeam = async(nickname, teamName, newTeam, newMember, newPlayer)=> {
        await Users.update({ teamName: newTeam }, { where: { nickname } });
        await Teams.update({ player: newPlayer, member: newMember }, { where: { teamName } });

        return {team : newTeam, player: newPlayer, message: "팀 가입 완료."};
    };

    
    deleteTeam = async(nickname, teamName, newTeam, newMember, newPlayer)=> {
        await Users.update({ teamName: newTeam }, { where: { nickname } });
        await Teams.update({ player: newPlayer, member: newMember }, { where: { teamName } });

        return {team : newTeam, player: newPlayer, message: "팀 탈퇴 완료."};
    };

};

module.exports = TeamsRepository;
