const express = require('express');
const router = express.Router();
const controller = require('./promise.controller');

//push
router.all('/selectByAll', controller.selectByAll);
router.all('/insert', controller.insert);


module.exports = router;
