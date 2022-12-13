const ReservationsRepository = require('../repositories/reservationsRepository.js');
const sendEmail = require('../mail.js');
require("dotenv").config();


class ReservationsService {
    reservationsRepository = new ReservationsRepository();

    createMatch = async (
        nickname, matchId, place, teamName, member, date, isDouble, price, email
        )=> {
        const checkTeams = await this.reservationsRepository.checkTeam(teamName); //예외처리1
            if (!checkTeams) {
                const err = new Error(`reservationsService Error`);
                err.status = 400;
                err.message = '존재하지 않는 팀 입니다. 팀 명을 확인해주세요.'; 
                err.code = -1;
                throw err;
            };

        const checkMatchs = await this.reservationsRepository.checkMatchById(matchId); //예외처리2
            if (checkMatchs.length >= 2) {
                const err = new Error(`reservationsService Error`);
                err.status = 403;
                err.message = '해당 타임은 이미 마감되었습니다.';
                err.code = -1;
                throw err;
            };

            if (checkMatchs.length === 1) {
                if(checkMatchs[0].isDouble !== isDouble) {  //예외처리3
                    const err = new Error(`reservationsService Error`);
                    err.status = 400;
                    err.message = '단/복식은 상대팀과 일치해야 합니다.';
                    err.code = -3;
                    throw err;    
                };
                if(checkMatchs[0].member !== member) {  //예외처리4
                    const err = new Error(`reservationsService Error`);
                    err.status = 400;
                    err.message = '인원 수가 상대팀과 일치해야 합니다.';
                    err.code = -4;
                    throw err;    
                };
            }

            if (checkTeams.admin !== nickname) {  //예외처리5
                const err = new Error(`reservationsService Error`);
                err.status = 403;
                err.message = '매칭 신청은 팀장만 가능합니다.';
                err.code = -2;
                throw err;
            };

        const checkPoints = await this.reservationsRepository.checkPoint(nickname);  //예외처리6
            if (checkPoints.point < price) {
                const err = new Error(`reservationsService Error`);
                err.status = 400;
                err.message = `보유 포인트가 부족합니다. 현재 잔여 포인트: ${checkPoints.point} 포인트`;
                err.code = -2;
                throw err;
            };
        // DB 저장 
        const data = await this.reservationsRepository.createMatch(
            nickname, matchId, place, teamName, member, date, isDouble, price
        );
        // email 발송
        const contents = `🥇매치번호(매치ID): ${data.data.matchId} 
                        \n ⚡경기장소: ${data.data.place}
                        \n ⚡경기일자: ${data.data.date}
                        \n ⚡팀 명: ${data.data.teamName}
                        \n ⚡인원: ${data.data.member} 명
                        \n ⚡결제금액: ${data.data.price} 포인트`;
            if(email){ 
                sendEmail(email, contents, data.data.teamName)
            };
        return data;
    };      

    //장소별-날짜별 예약현황 조회
    checkMatchByPlace = async (place, date)=>{
        const data = await this.reservationsRepository.checkMatchByPlace(place, date);
        return data;
    };

    //나의 매치 조회(테스트)
    getMyMatch = async (nickname)=> {
        const admin = nickname;
        const allMyMatches = await this.reservationsRepository.getMyMatch(admin);
        let noneMatchTotal = []; 
        let doneMatchTotal = []; 
        let aMatch = {};

        for(let i = 0; i < allMyMatches.length; i++){
            let placeData = await this.reservationsRepository.getPlace(
                allMyMatches[i].place
                );
            let teamData = await this.reservationsRepository.checkTeam(
                allMyMatches[i].teamName
                );

            if(allMyMatches[i].result === "매칭 전") {
                aMatch = { matchData: allMyMatches[i], teamData, placeData }; //내 팀만
                noneMatchTotal.push(aMatch);
            }else if (allMyMatches[i].result === "매칭 완료") {
                let bothMatchData = await this.reservationsRepository.checkMatchById(
                    allMyMatches[i].matchId
                    );
                let bothTeamName = bothMatchData.map((val)=> val.teamName );   
                bothTeamName.splice(bothTeamName.indexOf(allMyMatches[i].teamName), 1); //상대팀 추출
                let opponent = await this.reservationsRepository.checkTeam(
                    bothTeamName[0]
                    );
                aMatch = { matchData: allMyMatches[i], teamData, placeData, opponent }; //양 팀 모두
                doneMatchTotal.push(aMatch);
            };
        };
        return { noneMatchTotal, doneMatchTotal };
    };

    // 기간 차 계산
    getDateDiff = async (d1, d2) => {     
        const diffDate = d1.getTime() - d2.getTime();
        return diffDate / (1000 * 60 * 60 * 24); 
    };

    // 홈 마감 임박순 6건 조회
    getAllMatch = async ()=>{
        const matches = await this.reservationsRepository.getAllMatch();
        const isMatches = matches.filter((val)=> val.matchId[13] === "i" );
        let result = [];
        for(let i = 0; i < isMatches.length; i++){
            let matchDate = isMatches[i].matchId.slice(20, 35);
            let nowDate = Date().slice(0, 15);
            let matchDay = new Date(matchDate) ;
            let today = new Date(nowDate);
            let dayDiff = await this.getDateDiff(matchDay, today);
            if (dayDiff > 0){ result.push(isMatches[i]) };
        };
        const isMatchesSix = result.splice(0, 6);
        const teamsInfo = await this.reservationsRepository.getTeamInfoSix(isMatchesSix);
        const placesInfo = await this.reservationsRepository.getPlaceInfoSix(isMatchesSix);
        let data = [];
        for (let i = 0; i < 6; i++){
            let result = { 
                match: isMatchesSix[i],
                team: teamsInfo[i],
                place: placesInfo[i]
            };
            data.push(result);
        };
        return data;
    };

    // 장소별-날짜별-매칭여부 별 조회
    getMatchResult = async (place, date)=> {
        const data = await this.reservationsRepository.getMatchResult(place, date);
        return data;
    };
    
    // 100& 취소
    cancleSuccess = async (matchId, teamName, place, price, nickname)=> {
        const data = await this.reservationsRepository.cancleSuccess(
            matchId, teamName, place, price, nickname
        );
        return data;
    };
    
    // 조건부 취소
    cancleConditional = async (matchId, teamName, place, price, nickname)=> {
        const data = await this.reservationsRepository.cancleConditional(
            matchId, teamName, place, price, nickname
        );
        return data;
    };
    
    //매칭 예약 취소
    deleteMatch = async (nickname, matchId, teamName, place)=> {
        const reservations = await this.reservationsRepository.checkMatchById(matchId);
        const reservation = reservations.filter((val)=> {
            return val.teamName === teamName
        });
        const price = reservation[0].price;
            if(reservation[0].admin !== nickname){
                const err = new Error(`reservationsService Error`);
                err.status = 403;
                err.message = '매치 취소는 admin 계정만 가능합니다.';
                err.code = -1;
                throw err;
            };

        //신청 날짜
        const register = reservation[0].createdAt;
        const dayRegister = register.getDate();
        const monthRegister = register.getMonth()+1;

        //경기 날짜
        const dates = reservation[0].date;
        const matchDate = new Date(dates);
        const dayMatch = matchDate.getDate();
        const monthMatch = matchDate.getMonth()+1;
        
        //현재 날짜
        const now = new Date;
        const dayNow = now.getDate();
        const monthNow = now.getMonth()+1;

        //날짜 차이
        const diffMatch = await this.getDateDiff(matchDate, now);

            // 경기 당일 취소
            if(monthMatch === monthNow && dayMatch === dayNow){
                const err = new Error(`reservationsService Error`);
                err.status = 400;
                err.message = '경기 당일 취소는 불가능합니다.';
                err.code = -1;
                throw err;
            };
        
            // 경기일자 이후 취소
            if (diffMatch <= 0) {
                const err = new Error(`reservationsService Error`);
                err.status = 400;
                err.message = '취소 가능 기간이 아닙니다.';
                err.code = -2;
                throw err;
            };

            // 신청 당일 취소
            if(monthRegister === monthNow && dayRegister === dayNow){
                const cancleSuccessData = this.cancleSuccess(
                    matchId, teamName, place, price, nickname
                );
                return cancleSuccessData;
            };

            // 신청 익일 ~ 경기 전일 취소 
                const cancleConditionalData = this.cancleConditional(
                    matchId, teamName, place, price, nickname
                );
                return cancleConditionalData;
    };
};

module.exports = ReservationsService;
