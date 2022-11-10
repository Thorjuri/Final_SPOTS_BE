const PlacesService = require('../services/placesService');

class PlacesController {                    
    placesService = new PlacesService();

    createPlace = async (req, res, next) => {   //시설 등록
        //try {

            const {
                sports,
                spotName,
                spotKind,
                address,
                comforts,
                price,
                desc
                
            } = req.body;

            await this.placesService.createPlace(
                sports,
                spotName,
                spotKind,
                address,
                comforts,
                price,
                desc
            );

            return res.status(201).json({ message: "시설 등록이 완료되었습니다." });
        // } catch (error) {
        //     res.status(400).json({errorMessage: error.message});
        // }
    };

    findAllPlaces = async (req, res, next) => { // 시설 전체 불러오기
        // try {
            const places = await this.placesService.findAllPlaces();

            res.json({data: places});
        // } catch (error) {
        //     res.status(400).json({errorMessage: error.message});
        // }
    };

    getSports = async (req, res, next) => {  //종목별 조회
        // try {
            const {sports} = req.params;
            const places = await this.placesService.getSports(sports);

            res.json({data: places});
        // } catch (error) {
        //     res.status(400).json({errorMessage: error.message});
        // }
    };
  
}

module.exports = PlacesController;