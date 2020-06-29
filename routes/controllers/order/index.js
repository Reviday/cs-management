const express = require('express');
const router = express.Router();
const controller = require('./order.controller');

router.all('/making', controller.making);
router.all('/making/statuslist', controller.statusList);
router.all('/making/count', controller.listCount);
router.all('/making/delay', controller.delayOrder);


module.exports = router;
