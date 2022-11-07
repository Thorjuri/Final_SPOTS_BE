const { Reservations, Users, Teams } = require('../models');

class TeamsRepository {

    

    getMyTeam = async(userId)=> {
        const data = await Users.findOne({
            attributes: ['teamName', 'userId', 'nickname'],
            where: { userId }
        })
        const teams = data.teamName.team
        return data
    };

    getAllTeams = async()=> {
        const data = await Teams.findAll({});
        return data
    };

    createTeam = async(teamName, sports, state, nickname)=> {
        const admin = nickname
        const data = await Teams.create({teamName, sports, state, admin});
        return {data : data, message: "신규 팀 생성 완료."}
    }

    updateTeam = async(nickname, teamName)=> {
        const data = await Users.findOne({  //users 테이블의 팀 목록에 추가 
            attributes: ['teamName'],
            where: { nickname }
        })
        const teamArr = data.teamName.team
        if(teamArr.indexOf(teamName)>= 0) { throw new Error('이미 가입된 팀 입니다.') }
        teamArr.push(teamName)
        const newTeam = {"team" : teamArr}
        await Users.update({ teamName: newTeam }, { where: { nickname } })
        
        const players = await Teams.findOne({  //Teams 테이블의 해당 팀의 player, member에 추가
            attributes: ['player', 'member'],
            where: { teamName }
        });
        const playerArr = players.player.player
        playerArr.push(nickname)
        const newPlayer = {"player" : playerArr}
        const newMember = players.member + 1
        await Teams.update({ player: newPlayer, member: newMember }, { where: { teamName } })
        return {data : teamArr, team: playerArr, message: "팀 가입 완료."}
    };

    
    deleteTeam = async(nickname, teamName)=> {
        const data = await Users.findOne({  //users 테이블의 팀 목록에서 삭제 
            attributes: ['teamName'],
            where: { nickname }
        })
        const teamArr = data.teamName.team
        if(teamArr.indexOf(teamName)<0) { throw new Error('가입되지 않은 팀 입니다.') }
        const idx = teamArr.indexOf(teamName)
        teamArr.splice(idx, 1)
        const newTeam = {"team" : teamArr}
        await Users.update({ teamName: newTeam }, { where: { nickname } })

        const players = await Teams.findOne({  //Teams 테이블의 해당 팀의 player, member에서 삭제
            attributes: ['player', 'member'],
            where: { teamName }
        });
        const playerArr = players.player.player
        const index = playerArr.indexOf(nickname)
        playerArr.splice(index, 1)
        const newPlayer = {"player" : playerArr}
        const newMember = players.member -1
        await Teams.update({ player: newPlayer, member: newMember }, { where: { teamName } })

        return {data : teamArr, team: playerArr, message: "팀 탈퇴 완료."}
    };

};

module.exports = TeamsRepository;
