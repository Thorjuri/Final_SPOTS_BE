const { Reservations, Users, Teams } = require('../models');
const mysql2 = require('mysql2');  
require("dotenv").config();

const db = mysql2.createConnection({  
    host     : process.env.DB_ENDPOINT,
    user     : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    database : "Final"
});
db.connect();


class ReservationsRepository {

    createMatch = async(matchId, place, teamName, member, nickname, date)=> {
        const admin = nickname
        const data = await Reservations.create({ matchId, place, teamName, member, admin, date });
        return {data: data, message : "매치 등록 완료"};
    };

    checkTeam = async(teamName)=> {
        const data = await Teams.findOne({ where : { teamName }});
        return data;
    };

    checkMatch = async(matchId, place)=> {
        const data = await Reservations.findAll({ where: { matchId, place }});
        return {data: data, message : "매치 조회 완료"};
    };

    getMatch = async(matchId, place)=> {
        const sql = `
            select r.matchId, r.teamName, r.place, t.player FROM reservations r  
            inner join teams t 
            on t.teamName = r.teamName 
            order by matchId
        ` //reservations 테이블 및 teams 테이블 Inner Join

        function dbQueryAsync(query) {
            return new Promise((resolve, reject) => {
            db.query(query, (error, result) => {
                if (error){reject(error)};
                resolve(result);
                });
            });
        };
        const datas = await dbQueryAsync(sql);
        const data = datas.filter((val)=>{return val.matchId === matchId})
            if(data.length <= 0) { throw new Error('해당 일자에 신청된 매치가 없습니다.')}

        let teams = []
            for(let i = 0; i<data.length; i++){
                teams.push(data[i].teamName)
            }
        let players = {}
            for(let i = 0; i<data.length; i++){
                players[data[i].teamName] = data[i].player.player
            }
        const result = {
            matchId : data[0].matchId,
            place : data[0].place,
            teamNames : teams,
            player : players
        };
        return result;
    };


    getReservations = async(nickname)=> { // 수정중. 빈 값 반환 문제 (map 비동기 문제인 듯)
        const user = await Users.findOne({ where : { nickname }});
        const team = user.teamName.team; 
        let matchs = [];
        for(let i = 0; i<team.length; i++){
            let match = await Reservations.findOne({ where : { teamName : team[i]}});
            matchs.push(match);      
        }
        return matchs;
    };
};

module.exports = ReservationsRepository;
