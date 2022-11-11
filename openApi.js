//   openPlaces = async (req, res, next) => {    // open api 전체 불러오기
//     
//     // try {

//     let request = require("request");
//     let options = {
//       method: "GET",
//       url: "http://openapi.seoul.go.kr:8088/554950534b7268613131624d597145/json/ListPublicReservationSport/1/3/?serviceKey=554950534b7268613131624d597145",
//       headers: {},
//     };
//     request(options, async function (error, response) {
//       if (error) throw new Error(error);
//       //console.log(response.body);       // postman request

//       let data = JSON.parse(response.body);   //내용들을 json형식으로 바꿔준다.
//       let ListPublicReservationSport = data.ListPublicReservationSport;
//       let rows = ListPublicReservationSport.row;

//       //console.log('=========================================');
//       //console.log(rows);
//       console.log(rows.length);

//       for (let i = 0; i < rows.length; i++) {
//         let MINCLASSNM = rows[i]["MINCLASSNM"]; //소분류명 
//         let SVCSTATNM = rows[i]["SVCSTATNM"]; //서비스상태
//         let SVCNM = rows[i]["SVCNM"]; //서비스명
//         let PLACENM = rows[i]["PLACENM"]; //장소명
//         let SVCURL = rows[i]["SVCURL"]; //바로가기URL
//         let X = rows[i]["X"];
//         let Y = rows[i]["Y"];
//         let AREANM = rows[i]["AREANM"]; //지역명
//         let IMGURL = rows[i]["IMGURL"]; //이미지경로

//         console.log(
//           "소분류명: " +
//             MINCLASSNM +
//             "\n서비스상태: " +
//             SVCSTATNM +
//             "\n장소명: " +
//             SVCNM +
//             "\n서비스명: " +
//             PLACENM +
//             "\n바로가기URL: " +
//             SVCURL +
//             "\nX좌표: " +
//             X +
//             "\nY좌표: " +
//             Y +
//             "\n이미지 경로: " +
//             IMGURL +
//             "\n지역명: " +
//             AREANM
//         );

        
//       }
      
//       console.log("=========================================");
//       console.log(rows.length);
//     });

//     const openPlace = await this.placesService.openPlaces(MINCLASSNM,SVCSTATNM,SVCNM,PLACENM,SVCURL,X,Y,AREANM,IMGURL);    // 여기서 db insert 코드 실행
//         console.log("\n");
//         //res.json({ data: openPlace });

    

//     //res.json({data: place});
//     // } catch (error) {
//     //     res.status(400).json({errorMessage: error.message});
//     // }
//   };