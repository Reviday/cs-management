const express = require('express');
const router = express.Router();
const controller = require('./promise.controller');

//push
router.all('/selectByAll', controller.selectByAll);
router.all('/select', controller.selectByDay);
router.all('/insert', controller.insert);
router.all('/update', controller.update);
router.all('/delete', controller.delete);


module.exports = router;
