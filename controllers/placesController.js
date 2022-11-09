const PlacesService = require('../services/placesService');

class PlacesController {                    
    placesService = new PlacesService();

    createPlace = async (req, res, next) => {   //시설 등록
        //try {
            const {
                lat,
                lng,
                place,
                sports,
                address,
                state,
                phone,
                review
            } = req.body;

            await this.placesService.createPlace(
                lat,
                lng,
                place,
                sports,
                address,
                state,
                phone,
                review
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

    getFootsal = async (req, res, next) => {  //풋살장만 보이게하기
        // try {
            const {sports} = req.params;
            const places = await this.placesService.getFootsal(sports);

            res.json({data: places});
        // } catch (error) {
        //     res.status(400).json({errorMessage: error.message});
        // }
    };

    getTennis = async (req, res, next) => {  //테니스장만 보이게하기
        // try {
            const {sports} = req.params;
            const places = await this.placesService.getTennis(sports);

            res.json({data: places});
        // } catch (error) {
        //     res.status(400).json({errorMessage: error.message});
        // }
    };

    getBadminton = async (req, res, next) => {  //배드민턴장만 보이게하기
        // try {
            const {sports} = req.params;
            const places = await this.placesService.getBadminton(sports);

            res.json({data: places});
        // } catch (error) {
        //     res.status(400).json({errorMessage: error.message});
        // }
    };

   

   


}

module.exports = PlacesController;