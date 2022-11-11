const { Reservations, Users, Teams } = require('../models');
require("dotenv").config();


class ReservationsRepository {

    // 현재 보유 포인트조회
    checkPoint = async(nickname)=> {
        const data = await Users.findOne({
            attributes: ['point'],
            where : { nickname }
        });
        return data;
    };

    // 포인트 결제 (포인트 차감)
    createPayment = async(nickname, price)=> {
        const points = await this.checkPoint(nickname);
        const newPoints = points.point - price;
        await Users.update({ point : newPoints}, { where : { nickname }});
        return newPoints;
    }

    createMatch = async(nickname, matchId, place, teamName, member, date, isDouble, price)=> {
        const admin = nickname
        const payment = await this.createPayment(nickname, price); //결제 후 잔여 포인트를 반환함
        const data = await Reservations.create({ admin, matchId, place, teamName, member, date, isDouble, price }); //매칭 등록
        return {data, message : `매치 등록 완료. 결제 후 잔여 포인트:  ${payment} 포인트`};
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
