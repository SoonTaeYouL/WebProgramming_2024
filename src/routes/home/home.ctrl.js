"use strict";

const fs = require("fs");
const path = require("path");
const { all } = require(".");

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
    // console.log(req.body);
    var date = req.body.date;
    const dbPath = path.join(__dirname, "../../database/db.json");
    fs.readFile(dbPath, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, msg: "서버 오류" });
      }
      var reservations = JSON.parse(data);
      var dateReservations = reservations[date];
      let count = dateReservations.filter(reservation => reservation.name !== '').length;
      if (count > 0) {
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
    const dbPath = path.join(__dirname, "../../database/db.json");
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
  // db.json 파일을 읽어와서 해당 날짜에 예약이 없으면 방과 name를 확인하고 예약을추가하고
  // 있으면 방과 name를 확인하고 예약을 수정하는 코드
  write: (req, res) => {
    const dbPath = path.join(__dirname, "../../database/db.json");

    const image = req.file ? "/images/" + req.file.filename : null;
    const new_reservation = JSON.parse(req.body.reserv_map);
    const date = req.body.date;

    const reservations = JSON.parse(fs.readFileSync(dbPath, "utf8"));

    const newReservationDate = reservations[date].map((reservation) => {
      if (reservation.room === new_reservation.room) {
        reservation = { ...new_reservation, image };
      }
      return reservation;
    });

    const updatedDB = { ...reservations, [date]: newReservationDate };
    fs.writeFileSync(dbPath, JSON.stringify(updatedDB, null, 2), "utf8");
    res.status(201).json(reservations);
  },
  delete: (req, res) => {
    const dbPath = path.join(__dirname, "../../database/db.json");
    var {
      room: new_room,
      reservation_code: new_reservation_code,
      name: new_name,
    } = JSON.parse(req.body.reserv_map);
    var new_date = req.body.date;
    var new_reserv = {
      room: new_room,
      reservation_code: new_reservation_code,
      name: new_name,
    };

    fs.readFile(dbPath, "utf8", (err, data) => {
      if (err) {
        // 에러
        console.error(err);
        return res.status(500).json({ success: false, msg: "서버 오류" });
      }
      var reservations = JSON.parse(data); // db.json 파일을 파싱
      var db_reservations = reservations[new_date]; // 해당 날짜의 예약을 가져옴
      db_reservations.forEach((reserv) => {
        if (reserv.room === new_room) {
          var index = db_reservations.indexOf(reserv);
          reservations[new_date][index] = new_reserv; // 해당 날짜의 예약을 수정
          fs.writeFile(dbPath, JSON.stringify(reservations, null, 2), (err) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ success: false, msg: "서버 오류" });
            }
            res.json({ success: true });
          });
        }
      });
    });
  },
  alldelete: (req, res) => {
    const dbPath = path.join(__dirname, "../../database/db.json");
    var date = req.body.date;
    fs.readFile(dbPath, "utf8", (err, data) => {
      if (err) {
        // 에러
        console.error(err);
        return res.status(500).json({ success: false, msg: "서버 오류" });
      }
      var reservations = JSON.parse(data); // db.json 파일을 파싱
      reservations[date] = [
        { room: 201, reservation_code: "", name: "" },
        { room: 202, reservation_code: "", name: "" },
        { room: 203, reservation_code: "", name: "" },
        { room: 204, reservation_code: "", name: "" },
        { room: 205, reservation_code: "", name: "" },
        { room: 301, reservation_code: "", name: "" },
        { room: 302, reservation_code: "", name: "" },
        { room: 303, reservation_code: "", name: "" },
        { room: 304, reservation_code: "", name: "" },
        { room: 305, reservation_code: "", name: "" },
        { room: 401, reservation_code: "", name: "" },
        { room: 402, reservation_code: "", name: "" },
        { room: 403, reservation_code: "", name: "" },
        { room: 404, reservation_code: "", name: "" },
        { room: 405, reservation_code: "", name: "" },
      ];
      fs.writeFile(dbPath, JSON.stringify(reservations, null, 2), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ success: false, msg: "서버 오류" });
        }
        res.json({ success: true });
      });
    });
  },
};

module.exports = {
  users,
  output,
  process,
};
