const express = require('express');
const router = express.Router();
const controller = require('./order.controller');
const multer = require('multer');
const upload = multer({
    storage : multer.diskStorage({
        destination(req, file, callback){
            callback(null, 'uploads/');
        },
        filename(req, file, callback){
            const ext = path.extname(file.originalname);
            callback(null, path.basename(file.originalname, ext) + ext);
        }
    })
});
//push
router.all('/making',controller.making);
router.all('/making/statuslist', controller.statusList);
router.all('/making/count', controller.listCount);
router.all('/making/delay', controller.delayOrder);


module.exports = router;
