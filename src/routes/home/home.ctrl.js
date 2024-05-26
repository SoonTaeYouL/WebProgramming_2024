'use strict';
const fs = require('fs');
const path = require('path');
const session = require('express-session')

const users = {
    id: ['test','aaa'],
    password: ['1234','aaa'],
};

const output = {
    home: (req,res)=>{
        res.render('index');
    },
    login: (req,res)=>{
        res.render('login');
    },
    calendar: (req,res)=>{
        res.render('calendar');
    },
    room: (req,res)=>{
        res.render('room');
    }
};

const process = {
    login: (req,res)=>{
        const id = req.body.id,
            password = req.body.password;
        
        if(users.id.includes(id)){
            const idx = users.id.indexOf(id);
            if(users.password[idx] === password){
                req.session.user = id;
                return res.json({
                    success: true,
                    redirect: '/calendar'
                });
            }
        }
        return res.json({
            success: false,
            msg: '로그인에 실패하셨습니다.',
        });
    },
    manage: (req,res)=>{
        console.log(req.body);
        var date = req.body.date;
        const dbPath = path.join(__dirname, '../../database/db.json');
        fs.readFile(dbPath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, msg: '서버 오류' });
            }
            var reservations = JSON.parse(data);
            // console.log(reservations);
            var dateReservations = reservations[date];
            console.log(dateReservations);
            if (dateReservations) {
                res.json({
                    success: true,
                    reservations: dateReservations
                });
            } else {
                res.json({ success: false, msg: '예약이 없습니다.' });
            }
        });
    }
};

module.exports = {
    users,
    output,
    process,
};