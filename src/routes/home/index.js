'use strict';

const express = require('express');
const router = express.Router();

const ctrl = require('./home.ctrl');

router.get('/',ctrl.output.home);
router.get('/login',ctrl.output.login);
router.get('/calendar',ctrl.output.calendar);
router.get('/room',ctrl.output.room);


router.post('/login',ctrl.process.login);
router.post('/calendar',ctrl.process.reserv);


router.get('/images/:imageName', function(req, res){
    var imgName = req.params.imageName;
    res.sendFile('/public/image/'+imgName);    
  });



module.exports = router;