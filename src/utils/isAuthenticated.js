// 로그인 여부 확인 미들웨어
function isAuthenticated(req, res, next) {
  // console.log(req.session);
  if (req.session && req.session.user) {
    return next();
  } else {
    res.redirect("/login");
  }
}
// 발표 직전에는 7번코드 /login 변경해야함

function isAlreadyAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    res.redirect("/calendar");
  } else {
    return next();
  }
}

module.exports = {
  isAlreadyAuthenticated,
  isAuthenticated,
};
