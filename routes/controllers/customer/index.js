const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const mime = require('mime');
const controller = require('./customer.controller');
const APPROOT = require('app-root-path');
const Util = require(`${APPROOT}/util/util.js`);
const moment = require('moment');
const multer = require('multer');
fs.readdir('uploads', (error) => {
    if (error) {
        console.log('##### uploads Directory not existed!!! ####');
        console.log('##### Start Make directory uploads ####');
        fs.mkdirSync('uploads');
    }
});

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, callback) {
            callback(null, 'uploads/');
        },
        filename(req, file, callback) {
            const ext = path.extname(file.originalname); /* 파일 확장자 */
            const fullFileName = path.basename(file.originalname, ext)+moment().format('YYYYMMDD') + ext
            console.log('ext ::: ',ext);
            console.log('path.basename ::: ', path.basename(file.originalname, ext)+moment().format('YYYYMMDD'));
            //callback(null, path.basename(file.originalname, ext) + ext);
            callback(null, fullFileName);
        }
    })
});
router.all('/select', controller.select);
router.all('/selectbyid', controller.selectById);
router.all('/insert', upload.array('custom_image'), controller.insert);
router.all('/update', upload.array('custom_image'), controller.update);
router.all('/delete', upload.array('custom_image'), controller.delete);
router.all('/check', controller.check);
router.all('/:fileName', (req, res) => {
    const pathUpload = 'uploads/';
    const downloadFileName = pathUpload + req.params.fileName;

    try {
        if (fs.existsSync(downloadFileName)) {
            const filename = path.basename(downloadFileName);
            const mimetype = mime.getType(downloadFileName);

            res.setHeader('Content-disposition', 'attachment; filename=' + Util.getDownloadFilename(req, filename)); // 다운받아질 파일명 설정
            res.setHeader('Content-type', mimetype); // 파일 형식 지정

            const fileStream = fs.createReadStream(downloadFileName);
            fileStream.pipe(res);
        } else {
            res.send('해당 파일이 없습니다.');
        }

    } catch (e) {
        console.log(e);
        res.send('파일을 다운로드하는 중에 에러가 발생하였습니다.');
    }
})

//push
module.exports = router;
