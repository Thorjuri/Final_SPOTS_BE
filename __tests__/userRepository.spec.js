const UsersRepository = require("../repositories/usersRepository");
const {
  createUserInsert,
  createUserResult,
  loginIdInsert,
  checkIdResult,
  checkNickInsert,
  checkNickResult,
  checkPhoneInsert,
  checkPhoneResult,
  checkIdPhoneInsert,
  checkIdPhoneResult,
  getUserResult,
  plusPointInsert,
  plusPointResult,
} = require("./no/fixtures/users.fixtures");
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
