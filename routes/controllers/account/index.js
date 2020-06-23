const express = require('express');
const router = express.Router();
const controller = require('./account.controller');

router.all('/login', controller.login);


module.exports = router;
