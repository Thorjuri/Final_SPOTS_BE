const { DataPipeline } = require('aws-sdk');
const { Reservations, Users, Teams, Places } = require('../models');
require("dotenv").config();

class ReservationsRepository {

    // 현재 보유 포인트조회
    checkPoint = async (nickname)=> {
        const data = await Users.findOne({ 
            attributes: ['point'], 
            where: { nickname } 
        });
        return data;
    };

    // 포인트 결제 
    createPayment = async (nickname, price)=> {
        const points = await this.checkPoint(nickname);
        const newPoints = points.point - price;
        await Users.update({ 
            point : newPoints
        }, { 
            where: { nickname }
        });
        return newPoints;
    };
    
    // 매칭 성사 여부 업데이트
    updateMatch = async (matchId)=> {
        const data = await Reservations.findAll({ attributes: ["matchId"] });
        const counts = data.filter((val) => val.matchId === matchId );
        if(counts.length >= 2){
            const results = await Reservations.update({ 
                result: "매칭 완료" 
            }, { 
                where: { matchId } 
            });
            return results;
        }; 
    };

    //매치 예약 신청
    createMatch = async (nickname, matchId, place, teamName, member, date, isDouble, price)=> {
        const admin = nickname;
        const payment = await this.createPayment(nickname, price); //결제 후 잔여 포인트
        await Reservations.create({ 
            admin, matchId, place, teamName, member, date, isDouble, price 
        }); 
        await this.updateMatch(matchId);
        const data = await Reservations.findOne({ where: { matchId, teamName, place }});
        return {data, message : `매치 등록 완료. 결제 후 잔여 포인트:  ${payment} 포인트`};
    };

    // 팀 조회
    checkTeam = async (teamName)=> {
        const data = await Teams.findOne({ where: { teamName }});
        return data;
    };

    // 매치 조회(By MatchId)
    checkMatchById = async (matchId)=> {
        const data = await Reservations.findAll({ where: { matchId }});
        return data;
    };

    // 매치 조회(By teamName)
    checkMatchByTeam = async (teamName)=> {
        const data = await Reservations.findAll({ where: { teamName }});
        return data;
    };

    // 매치 조회(By Place)
    checkMatchByPlace = async (place, date)=> {
        const data = await Reservations.findAll({ 
            where: {place, date}, 
            order: [['matchId']] 
        });
        return {data, message: `조회된 매치 신청: ${data.length}건`};
    };

    // 장소 조회
    getPlace = async (spotName)=> {
        const data = await Places.findOne({ where: { spotName } }); //장소정보
        return data;
    };

    // 나의 매치내역 조회
    getMyMatch = async (admin)=> { 
        const data = await Reservations.findAll({ where: { admin }});
        return data;
    };

    //홈 마감 임박순 6건 - 팀
    getTeamInfoSix = async (arr)=> {
        const teamInfoSix = await Promise.all(arr.map((val)=> {
            let data = Teams.findOne({ where: { teamName: val.teamName }});
            return data;
        }));
        return teamInfoSix;
    };

    //홈 마감 임박순 6건 - 장소
    getPlaceInfoSix = async (arr)=> {
        const placeSix = await Promise.all(arr.map((val)=> {
            let data = Places.findOne({ where: { spotName: val.place }});
            return data;
        }));
        return placeSix;
    };

    // 홈 마감 임박순 6건 조회
    getAllMatch = async ()=> {
        const data = await Reservations.findAll({
            order: [["date"]],     
            where: { result: "매칭 전" } 
        });
        return data;
    };

    // 장소별-날짜별-매칭여부 별 조회
    getMatchResult = async (place, date)=> {
        const noneMatching = await Reservations.findAll({ 
            where: { place, date, result: "매칭 전" }
        });
        const doneMatching = await Reservations.findAll({ 
            where: { place, date, result: "매칭 완료" }
        });
        return { noneMatching, doneMatching };
    };

    // 100% 취소
    cancleSuccess = async (matchId, teamName, place, price, nickname)=> {
        const points = await this.checkPoint(nickname);
        const newPoints = points.point + price;
        await Reservations.update({ result: "매칭 전" }, { where: { matchId, place }});
        await Reservations.destroy({ where: { matchId, teamName, place}});
        await Users.update({ point: newPoints }, { where: { nickname }});
        return { message: '예약 취소 및 포인트 반환 완료' };
    };

    // 조건부 취소
    cancleConditional = async (matchId, teamName, place, price, nickname)=> {
        const points = await this.checkPoint(nickname);
        const newPoints = points.point + price*0.9;
        await Reservations.update({ result: "매칭 전"}, { where: { matchId, place }});
        await Reservations.destroy({ where: { matchId, teamName, place}});
        await Users.update({ point: newPoints }, { where: { nickname }});
        return { message: '예약 취소 및 포인트 반환 완료 (취소 수수로 10% 차감)' };
    };
};

module.exports = ReservationsRepository;
