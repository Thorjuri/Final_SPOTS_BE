const express = require("express");
const router = express.Router();
const axios = require("axios");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.get("/code", async function (req, res, next) {
  let code = req.query.code;
  try {
    console.log(code);
  } catch (e) {
    console.log(e);
    res.send(e);
  }
});
