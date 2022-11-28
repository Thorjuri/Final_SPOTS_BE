const express = require("express");

 const { Opens } = require("../models"); 

const router = express.Router();

    


    let request = require("request");     // %ED%85%8C%EB%8B%88%EC%8A%A4%EC%9E%A5 테니스장     %ED%92%8B%EC%82%B4%EC%9E%A5 풋살장
    let options = {                         // %EB%B0%B0%EB%93%9C%EB%AF%BC%ED%84%B4%EC%9E%A5 배드민턴장
      method: "GET",
      url: "http://openapi.seoul.go.kr:8088/554950534b7268613131624d597145/json/ListPublicReservationSport/1/300/%EB%B0%B0%EB%93%9C%EB%AF%BC%ED%84%B4%EC%9E%A5",
      headers: {},
    };
    request(options, async function (error, response) {
      if (error) throw new Error(error);
      //console.log(response.body);       // postman request

      let data = JSON.parse(response.body);   //내용들을 json형식으로 바꿔준다.
      let ListPublicReservationSport = data.ListPublicReservationSport;
      let rows = ListPublicReservationSport.row;
      //console.log(data)

      console.log('=========================================');
      //console.log(rows);
      console.log(rows.length);


      for (let i = 0; i < rows.length; i++) {
        let minclassnm = rows[i]["MINCLASSNM"]; //소분류명 
        let svcstatnm = rows[i]["SVCSTATNM"]; //서비스상태
        let svcnm = rows[i]["SVCNM"]; //서비스명
        let placenm = rows[i]["PLACENM" ]; //장소명
        let svcurl = rows[i]["SVCURL"]; //바로가기URL
        let x = rows[i]["X"];
        let y = rows[i]["Y"];
        let areanm = rows[i]["AREANM"]; //지역명
        let imgurl = rows[i]["IMGURL"]; //이미지경로 

        
        //await Opens.create({minclassnm, svcstatnm, svcnm,placenm,svcurl,x,y,areanm,imgurl});
        

        


        // console.log(
        //   "소분류명: " +
        //     MINCLASSNM +
        //     "\n서비스상태: " +
        //     SVCSTATNM +
        //     "\n장소명: " +
        //     SVCNM +
        //     "\n서비스명: " +
        //     PLACENM +
        //     "\n바로가기URL: " +
        //     SVCURL +
        //     "\nX좌표: " +
        //     X +
        //     "\nY좌표: " +
        //     Y +
        //     "\n이미지 경로: " +
        //     IMGURL +
        //     "\n지역명: " +
        //     AREANM
        //   );
        
        //     console.log("=========================================");
        

        //let sql = "INSERT INTO Opens (MINCLASSNM,SVCSTATNM,SVCNM,PLACENM,SVCURL,X,Y,AREANM,IMGURL) VALUES ? ";
        // Opens.query(sql, [values], function(err) {
        //   if (err) throw err;
        //   conn.end();
        // });
      
      }
      
    });

    // const openPlace = await Opens.create(MINCLASSNM,SVCSTATNM,SVCNM,PLACENM,SVCURL,X,Y,AREANM,IMGURL);    // 여기서 db insert 코드 실행
    //     console.log("\n");
        //res.json({ data: openPlace });

    
module.exports = router; 


