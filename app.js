"use strict";

// 모듈 가져오기
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();

// 라우팅 모듈 가져오기
const home = require("./src/routes/home");

// 앱 세팅
app.set("views", "./src/views");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use(express.static(`${__dirname}/src/public`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const secretKey = "NoMoreViolence";

// 미들웨어 세팅
// app.use의 순서에 따라 미들웨어가 실행되는 순서가 달라집니다.
// 미들웨어는 위에서부터 아래로 순서대로 실행됩니다.
// 따라서 session이 뒤쪽에 있을 경우 session이 실행되지 않은 상태에서 isAuthenticated가 실행될 수 있습니다.
app.use(
  session({
    secret: secretKey,
    resave: true,
    saveUninitialized: false,
  })
);
app.use("/", home);


module.exports = app;
