const UsersRepository = require("../repositories/usersRepository");
//
// const {
//   createUserInsert,
//   createUserResult,
//   loginIdInsert,
//   checkIdResult,
//   checkNickInsert,
//   checkNickResult,
//   checkPhoneInsert,
//   checkPhoneResult,
//   checkIdPhoneInsert,
//   checkIdPhoneResult,
//   getUserResult,
//   plusPointInsert,
//   plusPointResult,
// } = require("../fixtures/users.fixtures");

(createUserInsert = {
  loginId: "aa",
  password: "1234",
  nickname: "qq",
  gender: "남성",
  phone: "010121",
  sports: ["football", "tennis"],
  favSports: ["swim", "running", "golf", "health"],
}),
  (createUserResult = {
    score: 0,
    point: 0,
    userId: 70,
    loginId: "aa",
    password: "$2b$10$.6WxNSZgo9PcD7w0h0WZ6OGdJppr9CIQ9DL8eaH3qFlIR.tz/ZOX2",
    nickname: "qqq",
    gender: "남성",
    phone: "010121",
    sports: ["football", "tennis"],
    favSports: ["swim", "running", "golf", "health"],
    profileImg:
      "https://woosungbucket.s3.ap-northeast-2.amazonaws.com/original/1669128469071_spots2.png",
    updatedAt: "2022-12-08T16:13:55.056Z",
    createdAt: "2022-12-08T16:13:55.056Z",
  }),
  (loginIdInsert = {
    loginId: "aa",
  }),
  (checkIdResult = {
    userId: 70,
    loginId: "aa",
    password: "$2b$10$b97G4Cx34jKElmsV7kotVOAc.0HxbOC7EyNZSA.EWz3WfuUXobTWu",
    nickname: "qq",
    gender: "남성",
    phone: "010121",
    score: 0,
    point: 99941999,
    sports: ["football", "tennis"],
    favSports: ["swim", "running", "golf", "health"],
    accKey: "0a3e",
    refreshToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzAzNjE3MTEsImV4cCI6MTY3MDQ0ODExMX0.SPcQ5plF08G7CYKwUZ7B7z8OW8gRBPglBzyiNVAfnno",
    profileImg:
      "https://woosungbucket.s3.ap-northeast-2.amazonaws.com/original/1669623364451_66938BB2-6CB3-4A4C-9730-1E62791D78C4.jpeg",
    createdAt: "2022-11-25T07:30:53.000Z",
    updatedAt: "2022-12-06T21:56:48.000Z",
    deletedAt: null,
  }),
  (checkNickInsert = {
    nickname: "qq",
  }),
  (checkNickResult = {
    userId: 70,
    loginId: "aa",
    password: "$2b$10$b97G4Cx34jKElmsV7kotVOAc.0HxbOC7EyNZSA.EWz3WfuUXobTWu",
    nickname: "qq",
    gender: "남성",
    phone: "010121",
    score: 0,
    point: 99941999,
    sports: ["football", "tennis"],
    favSports: ["swim", "running", "golf", "health"],
    accKey: "0a3e",
    refreshToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzAzNjE3MTEsImV4cCI6MTY3MDQ0ODExMX0.SPcQ5plF08G7CYKwUZ7B7z8OW8gRBPglBzyiNVAfnno",
    profileImg:
      "https://woosungbucket.s3.ap-northeast-2.amazonaws.com/original/1669623364451_66938BB2-6CB3-4A4C-9730-1E62791D78C4.jpeg",
    createdAt: "2022-11-25T07:30:53.000Z",
    updatedAt: "2022-12-06T21:56:48.000Z",
    deletedAt: null,
  }),
  (checkPhoneInsert = {
    phone: "010121",
  }),
  (checkPhoneResult = {
    userId: 70,
    loginId: "aa",
    password: "$2b$10$b97G4Cx34jKElmsV7kotVOAc.0HxbOC7EyNZSA.EWz3WfuUXobTWu",
    nickname: "qq",
    gender: "남성",
    phone: "010121",
    score: 0,
    point: 99941999,
    sports: ["football", "tennis"],
    favSports: ["swim", "running", "golf", "health"],
    accKey: "0a3e",
    refreshToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzAzNjE3MTEsImV4cCI6MTY3MDQ0ODExMX0.SPcQ5plF08G7CYKwUZ7B7z8OW8gRBPglBzyiNVAfnno",
    profileImg:
      "https://woosungbucket.s3.ap-northeast-2.amazonaws.com/original/1669623364451_66938BB2-6CB3-4A4C-9730-1E62791D78C4.jpeg",
    createdAt: "2022-11-25T07:30:53.000Z",
    updatedAt: "2022-12-06T21:56:48.000Z",
    deletedAt: null,
  }),
  (checkIdPhoneInsert = {
    loginId: "aa",
    phone: "010121",
  }),
  (checkIdPhoneResult = true),
  (getUserResult = {
    nickname: "qq",
    gender: "남성",
    phone: "010121",
    score: 0,
    point: 99941999,
    sports: ["football", "tennis"],
    favSports: ["swim", "running", "golf", "health"],
    profileImg:
      "https://woosungbucket.s3.ap-northeast-2.amazonaws.com/original/1669623364451_66938BB2-6CB3-4A4C-9730-1E62791D78C4.jpeg",
  }),
  (plusPointInsert = {
    loginId: "aa",
    point: 300000,
  }),
  (plusPointResult = [[undefined, 1]]);

const mockUsers = () => ({
  create: jest.fn(),
  findOne: jest.fn(),
  increment: jest.fn(),
});

describe("Users Repository Layer test", () => {
  let usersRepository = new UsersRepository();
  usersRepository.Users = mockUsers();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("createUser toHaveBeenCalled", async () => {
    usersRepository.Users.create = jest.fn(() => {
      return createUserResult;
    });

    const user = await usersRepository.createUser(createUserInsert);

    expect(usersRepository.Users.create).toHaveBeenCalledTimes(1);
    expect(user).toEqual(createUserResult);
    // expect(usersRepository.Users.create).toHaveBeenCalledWith({
    //   createUserInsert,
    // });
  });

  test("checkId toHaveBeenCalled", async () => {
    usersRepository.Users.findOne = jest.fn(() => {
      return checkIdResult;
    });

    const checkId = await usersRepository.checkId(loginIdInsert.loginId);

    expect(checkId).toEqual(checkIdResult);
    expect(usersRepository.Users.findOne).toHaveBeenCalledWith({
      where: { loginId: loginIdInsert.loginId },
      paranoid: false,
    });
    expect(usersRepository.Users.findOne).toHaveBeenCalledTimes(1);
  });

  test("checkNick toHaveCalled", async () => {
    usersRepository.Users.findOne = jest.fn(() => {
      return checkNickResult;
    });

    const checkNick = await usersRepository.checkNick(checkNickInsert.nickname);

    expect(checkNick).toEqual(checkNickResult);
    expect(usersRepository.Users.findOne).toHaveBeenCalledWith({
      where: { nickname: checkNickInsert.nickname },
      paranoid: false,
    });
    expect(usersRepository.Users.findOne).toHaveBeenCalledTimes(1);
  });

  test("checkPhone toHaveBeenCalled", async () => {
    usersRepository.Users.findOne = jest.fn(() => {
      return checkPhoneResult;
    });

    const checkPhone = await usersRepository.checkPhone(checkPhoneInsert.phone);

    expect(checkPhone).toEqual(checkPhoneResult);
    expect(usersRepository.Users.findOne).toHaveBeenCalledWith({
      where: { phone: checkPhoneInsert.phone },
      paranoid: false,
    });
    expect(usersRepository.Users.findOne).toHaveBeenCalledTimes(1);
  });

  test("checkIdPhone toHaveBeenCalled", async () => {
    usersRepository.Users.findOne = jest.fn(() => {
      return checkIdPhoneResult;
    });

    const checkIdPhone = await usersRepository.checkIdPhone(
      checkIdPhoneInsert.loginId,
      checkIdPhoneInsert.phone
    );

    expect(checkIdPhone).toEqual(checkIdPhoneResult);
    expect(usersRepository.Users.findOne).toHaveBeenCalledWith({
      where: { loginId: checkIdPhoneInsert.loginId, phone: checkIdPhoneInsert.phone },
    });
    expect(usersRepository.Users.findOne).toHaveBeenCalledTimes(1);
  });

  test("getUser toHaveBeenCalled", async () => {
    usersRepository.Users.findOne = jest.fn(() => {
      return getUserResult;
    });

    const getUser = await usersRepository.getUser(loginIdInsert.loginId);

    expect(getUser).toEqual(getUserResult);
    expect(usersRepository.Users.findOne).toHaveBeenCalledWith({
      where: { loginId: loginIdInsert.loginId },
    });
    expect(usersRepository.Users.findOne).toHaveBeenCalledTimes(1);
  });

  test("plusPoint toHaveBeenCalled", async () => {
    usersRepository.Users.increment = jest.fn(() => {
      return plusPointResult;
    });

    const plusPoint = await usersRepository.plusPoint(plusPointInsert);

    expect(plusPoint).toEqual(plusPointResult);
    // expect(usersRepository.Users.increment).toHaveBeenCalledWith(
    //   { point: plusPointInsert["point"] },
    //   { where: { loginId: plusPointInsert["loginId"] } }
    // );
    expect(usersRepository.Users.increment).toHaveBeenCalledTimes(1);
  });
});
//
