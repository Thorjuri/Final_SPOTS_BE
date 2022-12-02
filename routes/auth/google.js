const express = require("express");
const router = express.Router();
const axios = require("axios");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.get("/code", async function (req, res, next) {
  console.log("구글 get 연결");
  let code = req.query.code;
  console.log("req.query");
  console.log(req.query);
  console.log("req.query");
  console.log("code");
  console.log(code);
  console.log("code");
  try {
  } catch (e) {
    console.log(e);
    res.send(e);
  }
});
