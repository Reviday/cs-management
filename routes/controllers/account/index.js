const express = require('express');
const router = express.Router();
const controller = require('./account.controller');

router.get('/', controller.api);
router.post('/', controller.api);

module.exports = router;
