const express = require('express');
const router = express.Router();
const controller = require('./order.controller');

router.all('/making', controller.making);
router.get('/making/statuslist', controller.statusList);


module.exports = router;
