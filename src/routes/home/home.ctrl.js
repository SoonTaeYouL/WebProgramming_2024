'use strict';

const fs = require("fs");
const path = require("path");

const users = {
  id: ["test", "aaa"],
  password: ["1234", "aaa"],
};

const output = {
  home: (req, res) => {
    res.render("index");
  },
  login: (req, res) => {
    res.render("login");
  },
  calendar: (req, res) => {
    res.render("calendar");
  },
  room: (req, res) => {
    res.render("room");
  },
};

const process = {
  // 로그인을 하면, 리다이렉트가 아닌, jwt 토큰을 발급한다.
  login: (req, res) => {
    const { id, password } = req.body;

    if (users.id.includes(id)) {
      const idx = users.id.indexOf(id);
      if (users.password[idx] === password) {
        console.log(req.session, "req.session");
        req.session = req.session || {};
        req.session.user = req.session.user || {};
        req.session.user = id;
        req.session.save();
        return res.json({
          success: true,
          redirect: "/calendar",
        });
      }
    }

    return res.json({
      success: false,
      msg: "로그인에 실패하셨습니다.",
    });
  },

  manage: (req, res) => {
    console.log(req.body);
    var date = req.body.date;
    const dbPath = path.join(__dirname, "../../database/ex.json");
    fs.readFile(dbPath, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, msg: "서버 오류" });
      }
      var reservations = JSON.parse(data);
      // console.log(reservations);
      var dateReservations = reservations[date];
      console.log(dateReservations);
      if (dateReservations) {
        res.json({
          success: true,
          reservations: dateReservations,
        });
      } else {
        res.json({ success: false, msg: "예약이 없습니다." });
      }
    });
  },

  read: (req, res) => {
    const dbPath = path.join(__dirname, "../../database/ex.json");
    fs.readFile(dbPath, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, msg: "서버 오류" });
      }
      const reservations = JSON.parse(data);
      res.json({
        reservations,
      });
    });
  },
  // 예약을 추가하는 함수
  // db.json 파일을 읽어와서 해당 날짜에 예약이 없으면 방과 color를 확인하고 예약을추가하고 
  // 있으면 방과 color를 확인하고 예약을 수정하는 코드
  write: (req, res) => {
    const dbPath = path.join(__dirname, "../../database/ex.json");
    const { index,color,room,reservation_code,name } = req.body.reserv_map;
    const date = req.body.date;
    const new_reserv = {color:color, room:room, reservation_code:reservation_code, name:name};

    fs.readFile(dbPath, "utf8", (err, data) => {
      if (err) { // 에러
        console.error(err);
        return res.status(500).json({ success: false, msg: "서버 오류" });
      }
      var reservations = JSON.parse(data); // db.json 파일을 파싱
      console.log(reservations[date][index]);
      reservations[date][index] = new_reserv; // 해당 날짜의 예약을 수정
      fs.writeFile(dbPath, JSON.stringify(reservations, null, 2), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ success: false, msg: "서버 오류" });
        }
        res.json({ success: true });
      });
      // if (reservations[date]) { // 해당 날짜에 예약이 있는 경우
      //   const idx = reservations[date].findIndex((r) => r.room === room); // 해당 날짜에 방이 있는지 확인
      //   if (idx === -1) { // 방이 없는 경우
      //     reservations[date].push({ room, name, color }); // 방을 추가
      //   } else {
      //     reservations[date][idx] = { room, name, color }; // 방이 있는 경우 수정
      //   }
      // } else {
      //   reservations[date] = [{ room, name, color }]; // 해당 날짜에 예약이 없는 경우
      // }
      // fs.writeFile(dbPath, JSON.stringify(reservations, null, 2), (err) => {
      //   if (err) {
      //     console.error(err);
      //     return res.status(500).json({ success: false, msg: "서버 오류" });
      //   }
      //   res.json({ success: true });
      // });
    });
  }
  
};

module.exports = {
    users,
    output,
    process,
};