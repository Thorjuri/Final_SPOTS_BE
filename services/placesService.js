const PlacesRepository = require("../repositories/placesRepository");

class PlacesService {
  placesRepository = new PlacesRepository();

  createPlace = async (
    x,
    y,
    sports,
    spotName,
    spotKind,
    address,
    comforts,
    price,
    desc
  ) => {
    // 시설등록
    await this.placesRepository.createPlace(
      x,
      y,
      sports,
      spotName,
      spotKind,
      address,
      comforts,
      price,
      desc
    );
    return;
  };

  findAllPlaces = async () => {
    // 장소 전체 조회

    const findAllPlace = await this.placesRepository.findAllPlaces();

    return findAllPlace;
  };

  getSports = async (sports) => {
    //종목별 조회

    // try {
    const findFootsal = await this.placesRepository.getSports(sports);

    return findFootsal;
    // } catch (error) {
    //     console.error(error);
    //     return (error.status || 400);
    // }
  };

  findAllOpens = async () => {
    // open api 전체조회

    const findOpenPlace = await this.placesRepository.findAllOpens();

    return findOpenPlace;
  };

  getSportsOpen = async (minclassnm) => {
    //소분류명 open api 조회

    // try {
    const findOpenSports = await this.placesRepository.getSportsOpen(
      minclassnm
    );

    return findOpenSports;
    // } catch (error) {
    //     console.error(error);
    //     return (error.status || 400);
    // }
  };

  getRegionOpen = async (areanm) => {
    //지역명 open api 조회

    // try {
    const findOpenArea = await this.placesRepository.getRegionOpen(areanm);

    return findOpenArea;
    // } catch (error) {
    //     console.error(error);
    //     return (error.status || 400);
    // }
  };
}

module.exports = PlacesService;
