const { Reservations, Users, Teams } = require('../models');
const sendEmail = require('../mail.js')

require("dotenv").config();

const mysql2 = require('mysql2');  //mysql 모듈 import

var db = mysql2.createConnection({  //mpsql 로컬 DB 연결
    host     : 'localhost',
    user     : 'root',
    password : 'thor71593!!',
    database : 'final'
	})
db.connect();


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

    createMatch = async(nickname, matchId, place, teamName, member, date, isDouble, price, email)=> {
        const admin = nickname
        const payment = await this.createPayment(nickname, price); //결제 후 잔여 포인트를 반환함
        const data = await Reservations.create({ admin, matchId, place, teamName, member, date, isDouble, price }); //매칭 등록
        // const contents = JSON.stringify(data)
        const contents = `장소: ${data.place} \n 팀명: ${data.teamName} \n 일자: ${data.date} \n 인원수: ${data.member}`
        const sendmail = sendEmail(email, contents)
        return {data, message : `매치 등록 완료. 결제 후 잔여 포인트:  ${payment} 포인트`, mailing: sendmail};
    };

    checkTeam = async(teamName)=> {
        const data = await Teams.findOne({ where : { teamName }});
        return data;
    };

    checkMatch = async(matchId, place)=> {
        const data = await Reservations.findAll({ where: { matchId, place }});
        return {data: data, message : "매치 조회 완료"};
    };

    getMatch = async(place, date)=> {
        const data = await Reservations.findAll({ 
            where : {place, date},
            order: [['matchId']]
        });
        return {data, message: `조회된 매치 신청: ${data.length}건`}
    };


    getMyMatch = async(admin)=> { 
        const data = await Reservations.findAll({ where : { admin }});
        return data;
    };

    cancleSuccess = async(matchId, teamName, place, price, nickname)=> {
        const points = await this.checkPoint(nickname);
        const newPoints = points.point + price;
        await Reservations.destroy({ where : { matchId, teamName, place}});
        await Users.update({ point: newPoints }, { where : { nickname }})
        return {message : '예약 취소 및 포인트 반환 완료'}
    };

    cancleConditional = async(matchId, teamName, place, price, nickname)=> {
        const points = await this.checkPoint(nickname);
        const newPoints = points.point + price*0.9;
        await Reservations.destroy({ where : { matchId, teamName, place}});
        await Users.update({ point: newPoints }, { where : { nickname }})
        return {message : '예약 취소 및 포인트 반환 완료 (취소 수수로 10% 차감)'}
    };

    dbQueryAsync = async(sql) => {
        return new Promise((resolve, reject) => {
            db.query(sql, (error, result) => {
                if (error) { reject(error) };
            resolve(result);
            });
        });
    };


    getPlace = async(words)=> {
        const sql = `SELECT * FROM reservations r
        where place like '%${words}%' OR teamName like '%${words}%' OR admin like '%${words}%' `  
        
        const data = await this.dbQueryAsync(sql);
        return data
    }

};

module.exports = ReservationsRepository;
