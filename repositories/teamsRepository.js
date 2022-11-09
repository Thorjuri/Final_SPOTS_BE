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

    getTeamInfo = async(teamName)=>{
        const data = await Teams.findOne({ where : { teamName }});
        return data;
    };

    createTeam = async(nickname, teamName, sports, member, image)=> {
        const admin = nickname;
        const data = await Teams.create({admin, teamName, sports, member, image});
        return {data : data, message: "신규 팀 생성 완료."};
    };

    updateTeam = async(nickname, teamName, newTeam, newMember, newPlayer)=> {
        await Users.update({ teamName: newTeam }, { where: { nickname } });
        await Teams.update({ player: newPlayer, member: newMember }, { where: { teamName } });

        return {team : newTeam, player: newPlayer, message: "팀 가입 완료."};
    };

    
    deleteTeam = async(nickname, teamName)=> {
        await Teams.destroy({ where : { admin : nickname, teamName : teamName}});
        return {message : '팀이 삭제되었습니다.'}
    };

};

module.exports = TeamsRepository;
