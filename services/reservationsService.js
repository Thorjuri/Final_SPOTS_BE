const ReservationsRepository = require('../repositories/reservationsRepository.js');
const sendEmail = require('../mail.js');
const { DataPipeline } = require('aws-sdk');
require("dotenv").config();


class ReservationsService {
    reservationsRepository = new ReservationsRepository();

    createMatch = async(nickname, matchId, place, teamName, member, date, isDouble, price, email)=> {
        const checkTeams = await this.reservationsRepository.checkTeam(teamName);  //예외처리1
            if (!checkTeams) {
                const err = new Error(`reservationsService Error`);
                err.status = 400;
                err.message = '존재하지 않는 팀 입니다. 팀 명을 확인해주세요.'; 
                err.code = -1
                throw err;
            };

        const checkMatchs = await this.reservationsRepository.checkMatch(matchId) //예외처리2
            if (checkMatchs.data.length >= 2) {
                const err = new Error(`reservationsService Error`);
                err.status = 403;
                err.message = '해당 타임은 이미 마감되었습니다.';
                err.code = -1
                throw err;
            };

            if (checkMatchs.data.length === 1) {
                if(checkMatchs.data[0].isDouble !== isDouble) {  //예외처리3
                    const err = new Error(`reservationsService Error`);
                    err.status = 400;
                    err.message = '단/복식은 상대팀과 일치해야 합니다.';
                    err.code = -3
                    throw err;    
                };
                if(checkMatchs.data[0].member !== member) {  //예외처리4
                    const err = new Error(`reservationsService Error`);
                    err.status = 400;
                    err.message = '인원 수가 상대팀과 일치해야 합니다.';
                    err.code = -4
                    throw err;    
                };
            }

            if (checkTeams.admin !== nickname) {  //예외처리5
                const err = new Error(`reservationsService Error`);
                err.status = 403;
                err.message = '매칭 신청은 팀장만 가능합니다.';
                err.code = -2
                throw err;
            };

        const checkPoints = await this.reservationsRepository.checkPoint(nickname);  //예외처리6
            if (checkPoints.point < price) {
                const err = new Error(`reservationsService Error`);
                err.status = 400;
                err.message = `보유 포인트가 부족합니다. 현재 잔여 포인트:  ${checkPoints.point} 포인트`;
                err.code = -2
                throw err;
            };
        // DB 저장 
        const data = await this.reservationsRepository.createMatch(nickname, matchId, place, teamName, member, date, isDouble, price);
        // email 발송
        const contents = `🥇매치번호(매치ID): ${data.data.matchId} 
                        \n ⚡경기장소: ${data.data.place}
                        \n ⚡경기일자: ${data.data.date}
                        \n ⚡팀 명: ${data.data.teamName}
                        \n ⚡인원: ${data.data.member} 명
                        \n ⚡결제금액: ${data.data.price} 포인트`;
            if(email) { sendEmail(email, contents, data.data.teamName) };

        return data;
    };      


    //장소별-날짜별 예약현황 조회
    getMatch = async(place, date)=>{
        const data = await this.reservationsRepository.getMatch(place, date);
        return data;
    };

    //나의 매치 조회
    getMyMatch = async(nickname)=> {
        const admin = nickname;
        const data =  await this.reservationsRepository.getMyMatch(admin);
        console.log("-------------------", data)
        return data;
    };

    //전체 매치 조회
    getAllMatch = async()=>{
        const data = await this.reservationsRepository.getAllMatch();
        return data;
    };

    // 장소별-날짜별 매칭 전/후 조회
    getMatchResult = async(place, date)=> {
        const data = await this.reservationsRepository.getMatchResult(place, date);
        return data;
    };
    
    // 100& 취소
    cancleSuccess = async(matchId, teamName, place, price, nickname)=> {
        const data = await this.reservationsRepository.cancleSuccess(matchId, teamName, place, price, nickname);
        return data;
    };
    
    // 조건부 취소
    cancleConditional = async(matchId, teamName, place, price, nickname)=> {
        const data = await this.reservationsRepository.cancleConditional(matchId, teamName, place, price, nickname);
        return data;
    };
    
    // 기간 차이 계산
    getDateDiff = async(d1, d2) => {     
        const diffDate = d1.getTime() - d2.getTime();
        return diffDate / (1000 * 60 * 60 * 24); // 밀리세컨 * 초 * 분 * 시 = 일
    };
    
    //매치 예약 취소
    deleteMatch = async(nickname, matchId, teamName, place)=> {
        const reservations = await this.reservationsRepository.checkMatch(matchId, place);
        const reservation = reservations.data.filter((val)=> { return val.teamName === teamName })
        const price = reservation[0].price
            if(reservation[0].admin !== nickname){
                const err = new Error(`reservationsService Error`);
                err.status = 403;
                err.message = '매치 취소는 admin 계정만 가능합니다.';
                err.code = -1
                throw err;
            };    
        //신청 날짜
        const register = reservation[0].createdAt
        const dayRegister = register.getDate()
        const monthRegister = register.getMonth()+1
        console.log(register)
        console.log(` createdAt : 일:${dayRegister},  월:${monthRegister}`)

        //경기 날짜
        const dates = reservation[0].date
        const matchDate = new Date(dates)
        const dayMatch = matchDate.getDate()
        const monthMatch = matchDate.getMonth()+1
        console.log(matchDate)
        console.log(` 경기날짜 : 일:${dayMatch},  월:${monthMatch}`)
        
        //현재 날짜
        const now = new Date;
        const dayNow = now.getDate()
        const monthNow = now.getMonth()+1
        console.log(now)
        console.log(` 현재 : 일:${dayNow},  월:${monthNow}`)


        const diffRegister = await this.getDateDiff(now, register)
        const diffMatch = await this.getDateDiff(matchDate, now)
        console.log(`diffRegister : ${diffRegister} `)
        console.log(`diffMatch : ${diffMatch} `)

            // 경기 당일 취소
            if(monthMatch === monthNow && dayMatch === dayNow){
                const err = new Error(`reservationsService Error`);
                err.status = 400;
                err.message = '경기 당일 취소는 불가능합니다.';
                err.code = -1
                throw err;
            };
        
            // 경기일자 이후 취소
            if (diffMatch <= 0) {
                const err = new Error(`reservationsService Error`);
                err.status = 400;
                err.message = '취소 가능 기간이 아닙니다.';
                err.code = -2
                throw err;
            };

            // 신청 당일 취소
            if(monthRegister === monthNow && dayRegister === dayNow){
                const cancleSuccessData = this.cancleSuccess(matchId, teamName, place, price, nickname)
                return cancleSuccessData;
            };

            // 신청 익일 ~ 경기 전일 취소 
                const cancleConditionalData = this.cancleConditional(matchId, teamName, place, price, nickname)
                return cancleConditionalData;
    };
};

module.exports = ReservationsService;
