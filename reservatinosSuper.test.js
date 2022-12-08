const request = require("supertest");
const app = require("./app");
const application = request(app);

const data = {
    nickname: 'hulk',
    matchId: '06:00 - 08:00ismatchSat Dec 20 2022 00:00:00 GMT+0900 (KST)윔블테니스',
    place: '국대풋살장',
    teamName: '헐크팀',
    member: '5',
    date: '2022. 12. 20',
    isDouble: '1',
    price: '0'
};

const {nickname, matchId, place, teamName, member, date, isDouble, price} = data;

// 전체 부분
describe("마감 임박 매칭 조회 API 요청", () => {


    test("GET 조회 시 200 반환", async() => {
        const res = await application.get("/reservations/register");
        await expect(res.statusCode).toEqual(200);
    });

    test("로그인 하지 않고 매칭 예약 API 요청", async() => {
        const res = await application.post("/reservations/register").send(nickname, matchId, place, teamName, member, date, isDouble, price);
        console.log(res)
        await expect(res.statusCode).toEqual(401);
    });
});