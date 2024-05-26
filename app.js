"use strict";

// 모듈 가져오기
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();

// 라우팅 모듈 가져오기
const home = require("./src/routes/home/index");

// 앱 세팅
app.set("views", "./src/views");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use(express.static(`${__dirname}/src/public`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 미들웨어 세팅
app.use("/", home);
app.use('/login', isAuthenticated, home);
app.use('/room', isAuthenticated, home);

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// 로그인 여부 확인 미들웨어
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    res.redirect("/login");
  }
}

module.exports = app;
