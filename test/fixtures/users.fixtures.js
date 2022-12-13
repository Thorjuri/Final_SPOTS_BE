module.exports = {
  createUserInsert: {
    loginId: "aa",
    password: "1234",
    nickname: "qq",
    gender: "남성",
    phone: "010121",
    sports: ["football", "tennis"],
    favSports: ["swim", "running", "golf", "health"],
  },

  createUserResult: {
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
      "https://woosungbucket.s3.ap-northeast-2.amazonaws.com/original/1670935755055_spots2.png",
    updatedAt: "2022-12-08T16:13:55.056Z",
    createdAt: "2022-12-08T16:13:55.056Z",
  },

  loginIdInsert: {
    loginId: "aa",
  },

  checkIdResult: {
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
  },

  checkNickInsert: {
    nickname: "qq",
  },

  checkNickResult: {
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
  },

  checkPhoneInsert: {
    phone: "010121",
  },

  checkPhoneResult: {
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
  },

  checkIdPhoneInsert: {
    loginId: "aa",
    phone: "010121",
  },

  checkIdPhoneResult: true,

  getUserResult: {
    nickname: "qq",
    gender: "남성",
    phone: "010121",
    score: 0,
    point: 99941999,
    sports: ["football", "tennis"],
    favSports: ["swim", "running", "golf", "health"],
    profileImg:
      "https://woosungbucket.s3.ap-northeast-2.amazonaws.com/original/1669623364451_66938BB2-6CB3-4A4C-9730-1E62791D78C4.jpeg",
  },

  plusPointInsert: {
    loginId: "aa",
    point: 300000,
  },

  plusPointResult: [[undefined, 1]],
};
