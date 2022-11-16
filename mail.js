const nodemailer = require('nodemailer');
require("dotenv").config();

const sendEmail = (email, contents)=> {
    var transporter = nodemailer.createTransport({
        service: process.env.SERVICE,   // 메일 보내는 곳
        prot: 465,
        host: process.env.HOST,  
        secure: false,  //true 시 SSL 인증된 https 통신 필요
        requireTLS: true ,
        auth: {
          user: process.env.MAIL_ID,  // 보내는 메일의 주소
          pass: process.env.MAIL_PASS   // 보내는 메일의 비밀번호
        }
        });
      // 메일 옵션
    var mailOptions = {
        from: process.env.MAIL, // 보내는 메일의 주소
        to: email, // 수신할 이메일
        subject: "SPOTS 매칭 예약 정보 안내", // 메일 제목
        text: `매칭 예약 정보 \n ------------\n ${contents}` // 메일 내용
        };
      // 메일 발송    
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
        console.log(error);
        } else {
        return('Email sent: ' + info.response);
        }
    });
}

module.exports = sendEmail;
