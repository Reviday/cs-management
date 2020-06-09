const express = require('express');
const router = express.Router();
const controller = require('./order.controller');

router.get('/making', controller.makingList);
router.post('/making', controller.makingList);
router.all('/making/insert', controller.makingInsert);
router.all('/making/update', controller.makingUpdate);
router.all('/making/delete', controller.makingDelete);


module.exports = router;
