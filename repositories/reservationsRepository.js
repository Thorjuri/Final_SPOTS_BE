const { Reservations, Users, Teams, Places } = require('../models');
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
    // 매칭 성사 여부 업데이트
    updateMatch = async(matchId)=> {
        const data = await Reservations.findAll({
            attributes : ["matchId"]
        });
        console.log("1", data)
        const counts = data.filter((val) => {
            return val.matchId === matchId
        });
        console.log("2", counts)
        if(counts.length >= 2){
            const results = await Reservations.update({ result : "매칭 완료" }, { where : { matchId } })
            return results
        } 
    }

    updateMatch = async(matchId)=> {
        const data = await Reservations.findAll({
            attributes : ["matchId"]
        });
        console.log("1", data)
        const counts = data.filter((val) => {
            return val.matchId === matchId
        });
        console.log("2", counts)
        if(counts.length >= 2){
            const results = await Reservations.update({ result : "매칭 완료" }, { where : { matchId } })
            return results
        } 
    }

    //매치 예약 신청
    createMatch = async(nickname, matchId, place, teamName, member, date, isDouble, price)=> {
        const admin = nickname
        const payment = await this.createPayment(nickname, price); //결제 후 잔여 포인트를 반환함
        await Reservations.create({ admin, matchId, place, teamName, member, date, isDouble, price }); //매칭 등록
        await this.updateMatch(matchId)
        const data = await Reservations.findOne({ where : { matchId, teamName, place}})
        return {data, message : `매치 등록 완료. 결제 후 잔여 포인트:  ${payment} 포인트`};
    };

    // 팀 조회
    checkTeam = async(teamName)=> {
        const data = await Teams.findOne({ where : { teamName }});
        return data;
    };

    // 매치 조회(By MatchId)
    checkMatch = async(matchId)=> {
        const data = await Reservations.findAll({ where: { matchId}});
        return {data: data, message : "매치 조회 완료"};
    };

    // 매치 조회(By Place)
    getMatch = async(place, date)=> {
        const data = await Reservations.findAll({ 
            where : {place, date},
            order: [['matchId']]
        });
        return {data, message: `조회된 매치 신청: ${data.length}건`}
    };

    // 나의 매치 조회
    getMyMatch = async(admin)=> { 
        const myMatches = await Reservations.findAll({ where : { admin }});
        let noneMatchTotal = []
        let doneMatchTotal = []
        let aMatch = {}
        for(let i = 0; i < myMatches.length; i++){
            let placeData = await Places.findOne({ where : { spotName : myMatches[i].place } })
            let teamData = await Teams.findOne({ where : { teamName : myMatches[i].teamName }})
            let whole = await Reservations.findAll({ 
                where: { matchId: myMatches[i].matchId }
            })
            let wholeTeam = whole.map((val)=> {return val.teamName})  //매칭전: 본인의 팀 정보만
                if(myMatches[i].result === "매칭 전"){
                    aMatch = {matchData: myMatches[i], teamData, placeData}
                    noneMatchTotal.push(aMatch)
                }else if (myMatches[i].result === "매칭 완료") { //매칭완료: 상대팀 팀정보 함께
                    wholeTeam.splice(wholeTeam.indexOf(myMatches[i].teamName), 1)
                    let opponent = await Teams.findOne({ where : { teamName : wholeTeam[0]}})
                    aMatch = {matchData: myMatches[i], teamData, placeData, opponent}
                    doneMatchTotal.push(aMatch)
                }
        }
        return {noneMatchTotal, doneMatchTotal}
    };

    // 전체 매치 조회
    getAllMatch = async()=> {
        const data = await Reservations.findAll({
            limit: 6,
            order: [["date"]],      
        });
        return data;
    };

    // 장소별-날짜별 매칭 전/후 조회
    getMatchResult = async(place, date)=> {
        const noneMatching = await Reservations.findAll({ where : { place, date, result : "매칭 전" }});
        const doneMatching = await Reservations.findAll({ where : { place, date, result : "매칭 완료" }});
        return { noneMatching, doneMatching }
    };

    // 100% 취소
    cancleSuccess = async(matchId, teamName, place, price, nickname)=> {
        const points = await this.checkPoint(nickname);
        const newPoints = points.point + price;
        await Reservations.update({ result: "매칭 전"}, { where: { matchId, place }})
        await Reservations.destroy({ where : { matchId, teamName, place}});
        await Users.update({ point: newPoints }, { where : { nickname }})
        return {message : '예약 취소 및 포인트 반환 완료'}
    };

    // 조건부 취소
    cancleConditional = async(matchId, teamName, place, price, nickname)=> {
        const points = await this.checkPoint(nickname);
        const newPoints = points.point + price*0.9;
        await Reservations.update({ result: "매칭 전"}, { where: { matchId, place }})
        await Reservations.destroy({ where : { matchId, teamName, place}});
        await Users.update({ point: newPoints }, { where : { nickname }})
        return {message : '예약 취소 및 포인트 반환 완료 (취소 수수로 10% 차감)'}
    };
};

module.exports = ReservationsRepository;
