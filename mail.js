const nodemailer = require('nodemailer');
require("dotenv").config();

const sendEmail = (email, contents, teamName)=> {
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
        subject: "SPOTS 매칭 예약 내역 안내", // 메일 제목
        text: `🏸안녕하세요! 생활 체육시설 매칭 서비스, SPOTS 입니다!⚽ 
                \n'${teamName}' 팀의 매칭 예약 내역은 아래와 같습니다. 
                \n \n ${contents}
                \n 더 자세한 내용은 홈페이지의 마이페이지 > 나의 예약현황에서확인 가능합니다. 
                \n 이용해주셔서 감사합니다. `  // 메일 내용
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
