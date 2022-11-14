const { date } = require('joi');
const ReservationsRepository = require('../repositories/reservationsRepository.js');

class ReservationsService {
    reservationsRepository = new ReservationsRepository();

    createMatch = async(nickname, matchId, place, teamName, member, date, isDouble, price)=> {
        const checkTeams = await this.reservationsRepository.checkTeam(teamName);
            if (!checkTeams) {
                const err = new Error(`reservationsService Error`);
                err.status = 400;
                err.message = '존재하지 않는 팀 입니다. 팀 명을 확인해주세요.';
                throw err;
            };

        const checkMatchs = await this.reservationsRepository.checkMatch(matchId, place)
            if (checkMatchs.data.length >= 2) {
                const err = new Error(`reservationsService Error`);
                err.status = 403;
                err.message = '해당 타임은 이미 마감되었습니다.';
                throw err;
            };

            if (checkTeams.admin !== nickname) {
                const err = new Error(`reservationsService Error`);
                err.status = 403;
                err.message = '매칭 신청은 팀장만 가능합니다.';
                throw err;
            };

        const checkPoints = await this.reservationsRepository.checkPoint(nickname);
            if (checkPoints.point < price) {
                const err = new Error(`reservationsService Error`);
                err.status = 400;
                err.message = `보유 포인트가 부족합니다. 현재 잔여 포인트:  ${checkPoints.point} 포인트`;
                throw err;
            };

        const data = await this.reservationsRepository.createMatch(nickname, matchId, place, teamName, member, date, isDouble, price);
        return data;
    };  


    getMatch = async(place, date)=>{
        const data = await this.reservationsRepository.getMatch(place, date);
        return data;
    };


    getMyMatch = async(nickname)=> {
        const admin = nickname;
        const data =  await this.reservationsRepository.getMyMatch(admin);
        return data;
    };

    cancleSuccess = async(matchId, teamName, place, price, nickname)=> {
        const data = await this.reservationsRepository.cancleSuccess(matchId, teamName, place, price, nickname);
        return data;
    };

    getDateDiff = async(d1, d2) => {     
        const diffDate = d1.getTime() - d2.getTime();
        return diffDate / (1000 * 60 * 60 * 24); // 밀리세컨 * 초 * 분 * 시 = 일
      };

    cancleConditional = async(matchId, teamName, place, price, nickname)=> {
        const data = await this.reservationsRepository.cancleConditional(matchId, teamName, place, price, nickname);
        return data;
    };
      

    deleteMatch = async(nickname, matchId, teamName, place)=> {
        const reservations = await this.reservationsRepository.checkMatch(matchId, place);
        const reservation = reservations.filter((val)=> { return val.teamName === teamName })
        const price = reservation.price
            if(reservation.admin !== nickname){
                const err = new Error(`reservationsService Error`);
                err.status = 403;
                err.message = '매치 취소는 admin 계정만 가능합니다.';
                throw err;
            };    
        //신청 날짜
        const register = reservation.createdAt
        const dayRegister = register.getDate()
        const monthRegister = register.getMonth()+1

        //경기 날짜
        const dates = reservation.date
        const matchDate = new Date(dates)
        const dayMatch = matchDate.getDate()
        const monthMatch = matchDate.getMonth()
        
        //현재 날짜
        const now = new Date;
        const dayNow = now.getDate()
        const monthNow = now.getMonth()+1

        const diffRegister = this.getDateDiff(now, register)
        const diffMatch = this.getDateDiff(matchDate, now)

            // 경기 당일 취소
            if(monthMatch === monthNow && dayMatch === dayNow){
                const err = new Error(`reservationsService Error`);
                err.status = 400;
                err.message = '경기 당일 취소는 불가능합니다.';
                throw err;
            };
        
            // 경기일자 이후 취소
            if (diffMatch <= 0) {
                const err = new Error(`reservationsService Error`);
                err.status = 400;
                err.message = '취소 가능 기간이 아닙니다.';
                throw err;
            };

            // 신청 당일 취소
            if(monthRegister === monthNow && dayRegister === dayNow){
                this.cancleSuccess(matchId, teamName, place, price, nickname)
            };

            // 신청 익일 ~ 경기 전일 취소 
            if(diffRegister >= 1 && diffMatch >= 1) { 
                this.cancleConditional(matchId, teamName, place, price, nickname)
            };
    };

};

module.exports = ReservationsService;
