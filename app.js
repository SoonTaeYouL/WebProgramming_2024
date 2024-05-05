var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require("body-parser");// form이나 AJAX같은 데이터 처리

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//view 엔진 설정
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//미들웨어 설정
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// 404 에러 핸들러 => 라우터에서 요청이 처리되지 않으면(일치하는 주소가 없으면) 이 함수가 호출된다.
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler => 에러가 발생하면 이 함수가 호출된다.
// 미들웨어에서 발생하는 에러를 받아서 처리합니다.
app.use(function(err, req, res, next) {
  // 로컬 변수 설정, 오류 메시지를 렌더링할 때 사용, 개발 환경에서만 오류 스택을 렌더링
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // 오류 페이지 렌더링
  res.status(err.status || 500);
  res.render('error');
});

//여기서 app을 모듈로 내보낸다. => bin/www에서 사용
module.exports = app;
