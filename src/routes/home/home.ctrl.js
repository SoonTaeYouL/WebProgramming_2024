'use strict';

const users = {
    id: ['test'],
    password: ['1234'],
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
    }
};

const process = {
    login: (req,res)=>{
        const id = req.body.id,
            password = req.body.password;
        
        if(users.id.includes(id)){
            const idx = users.id.indexOf(id);
            if(users.password[idx] === password){
                return res.json({
                    success: true,
                });
            }
        }
        return res.json({
            success: false,
            msg: '로그인에 실패하셨습니다.',
        });
    },
    reserv: (req,res)=>{
        var date = req.body.date;
        fs.readFile('../../../database/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, msg: '서버 오류' });
            }
    
            var reservations = JSON.parse(data);
            var dateReservations = reservations[date];
    
            if (dateReservations && dateReservations.length > 0) {
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