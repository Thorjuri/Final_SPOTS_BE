const ReservationsRepository = require('../repositories/reservationsRepository');
let reservationsRepository = new ReservationsRepository();
const { Reservations, Users, Teams, Places } = require('../models');


describe('reservationsRepository: createMatch 매칭 예약 단위 테스트', () => {
    
    afterAll(async () => {
    });
    
    jest.spyOn(reservationsRepository, "createMatch");
    jest.spyOn(reservationsRepository, "createPayment");
    jest.spyOn(reservationsRepository, "updateMatch");
    jest.spyOn(Reservations, "findOne");
    jest.spyOn(Reservations, "update");
    jest.spyOn(Users, "update");
    const data = {
        nickname: 'hulk',
        matchId: '06:00 - 08:00ismatchSat Dec 17 2022 00:00:00 GMT+0900 (KST)윔블테니스',
        place: '국대풋살장',
        teamName: '헐크팀',
        member: '5',
        date: '2022. 12. 17',
        isDouble: '1',
        price: '0'
    };
    const {nickname, matchId, place, teamName, member, date, isDouble, price} = data;

    test("test1", async() => {
        const result1 = await reservationsRepository.createMatch(nickname, matchId, place, teamName, member, date, isDouble, price)
        await expect(result1.data.price).toBe(0);
    });
    test("test2", async() => {
        const result1 = await reservationsRepository.createMatch(nickname, matchId, place, teamName, member, date, isDouble, price)
        await expect(reservationsRepository.createPayment).toBeCalledTimes(2);
    });
    test("test3", async() => {
        const result1 = await reservationsRepository.createMatch(nickname, matchId, place, teamName, member, date, isDouble, price)
        await expect(reservationsRepository.updateMatch).toBeCalledTimes(3);
    });
    test("test4", async() => {
        const result1 = await reservationsRepository.createMatch(nickname, matchId, place, teamName, member, date, isDouble, price)
        await expect(Reservations.findOne).toBeCalledTimes(4);
    });
    test("test5", async() => {
        const result1 = await reservationsRepository.createMatch(nickname, matchId, place, teamName, member, date, isDouble, price)
        await expect(Reservations.update).toBeCalledTimes(5);
    });
    test("test6", async() => {
        const result1 = await reservationsRepository.createMatch(nickname, matchId, place, teamName, member, date, isDouble, price)
        await expect(result1.message).toBe("매치 등록 완료. 결제 후 잔여 포인트:  0 포인트");
    });
});
