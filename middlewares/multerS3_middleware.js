const multer = require('multer');
const path = require('path');
const AWS = require("aws-sdk");
const multerS3 = require('multer-s3');
const dotenv = require('dotenv');
dotenv.config();

AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: 'ap-northeast-2',
 });

 const upload = multer({
    storage: multerS3({
       s3: new AWS.S3(),
       bucket: process.env.S3_BUCEKT_NAME,
    //    acl: "public-read",
       contentType: multerS3.AUTO_CONTENT_TYPE,
       key(req, file, cb) {
          cb(null, `original/${Date.now()}_${path.basename(file.originalname)}`) // original 폴더안에다 파일을 저장
       },
    }),
    limits: { fileSize: 2 * 720 * 720 },
 });

 module.exports = upload;
