'use strict';

// 모듈 가져오기
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// 라우팅 모듈 가져오기
const home = require('./src/routes/home/index');

// 앱 세팅
app.set('views','./src/views');
app.engine('html',require('ejs').renderFile);
app.set('view engine','html');
app.use(express.static(`${__dirname}/src/public`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// 미들웨어 세팅
app.use("/",home);

module.exports = app;