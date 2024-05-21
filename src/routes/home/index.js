'use strict';

const express = require('express');
const router = express.Router();

const ctrl = require('./home.ctrl');

router.get('/',ctrl.output.home);
router.post('/',ctrl.process.login);
router.get('/login',ctrl.output.login);
router.get('/calendar',ctrl.output.calendar);
router.post('/calendar',ctrl.process.reserv);

router.get('/images/:imageName', function(req, res){
    var imgName = req.params.imageName;
    res.sendFile('/public/image/'+imgName);    
  });
// router.get('/login',ctrl.output.login);
// router.post('/login',ctrl.process.login);


module.exports = router;
