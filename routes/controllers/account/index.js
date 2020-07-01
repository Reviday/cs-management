const express = require('express');
const router = express.Router();
const controller = require('./account.controller');

router.all('/login', controller.login);
router.all('/siteslist', controller.sitesList);


module.exports = router;
