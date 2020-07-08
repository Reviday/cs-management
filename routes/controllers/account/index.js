const express = require('express');
const router = express.Router();
const controller = require('./account.controller');

//push
router.all('/login', controller.login);
router.all('/siteslist', controller.sitesList);


module.exports = router;
