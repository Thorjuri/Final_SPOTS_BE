const PlacesRepository = require('../repositories/placesRepository');

class PlacesService {
    placesRepository = new PlacesRepository();

    createPlace = async (
        lat,
        lng,
        place,
        sports,
        address,
        state,
        phone,
        review
    ) => {  // 시설등록
           await this.placesRepository.createPlace(
                lat,
                lng,
                place,
                sports,
                address,
                state,
                phone,
                review
            );

            return;

    };

    findAllPlaces = async () => {  // 장소 전체 조회

        const findAllPlace = await this.placesRepository.findAllPlaces();

        return findAllPlace;

    };

    
    getFootsal = async (sports) => {   //풋살장만 보여주기

        // try {
            const findFootsal = await this.placesRepository.getSports(sports);

            return findFootsal;
        // } catch (error) {
        //     console.error(error);
        //     return (error.status || 400);
        // }
    };

    getTennis = async (sports) => {   //테니스장만 보여주기

        // try {
            const findFootsal = await this.placesRepository.getSports(sports);

            return findFootsal;
        // } catch (error) {
        //     console.error(error);
        //     return (error.status || 400);
        // }
    };

    getBadminton = async (sports) => {   //배드민턴장만 보여주기

        // try {
            const findFootsal = await this.placesRepository.getSports(sports);

            return findFootsal;
        // } catch (error) {
        //     console.error(error);
        //     return (error.status || 400);
        // }
    };
}

module.exports = PlacesService;