const {Places} = require('../models');

class PlacesRepository {

    createPlace = async (   //시설등록
        lat,
        lng,
        place,
        sports,
        address,
        state,
        phone,
        review
    ) => {  
        const createPlaceData = await Places.create({
            lat,
            lng,
            place,
            sports,
            address,
            state,
            phone,
            review
        });

        return createPlaceData;
    };

    // 시설 전체 조회
    findAllPlaces = async () => {
        const places = await Places.findAll();

        return places;
    };

    //종목 조회
    getSports = async (sports) => {  
        const findSports = await Places.findAll({where: {sports}});
        
        return findSports;
    };

    
};

module.exports = PlacesRepository;