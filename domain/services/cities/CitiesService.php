<?php


namespace App\Domain\Services\Cities;


use App\Domain\Repositories\ICitiesRepository;
use App\Domain\Views\CityViewModel;

class CitiesService implements ICitiesService
{
    /**
     * @var ICitiesRepository
     */
    private ICitiesRepository $citiesRepository;

    /**
     * CitiesService constructor.
     * @param ICitiesRepository $citiesRepository
     */
    public function __construct(ICitiesRepository $citiesRepository)
    {
        $this->citiesRepository = $citiesRepository;
    }

    /**
     * @inheritdoc
     */
    public function searchPostalCode(string $postalCode): array
    {
        $postalCodeColumn = 'codePostal';
        $cityCodeColumn = 'codeCommune';
        $cityNameColumn = 'nomCommune';

        $cities = $this->citiesRepository->getAll();

        $citiesForPostalCode = array_filter($cities, function (array $city) use ($postalCode, $postalCodeColumn) {
            return preg_match("/^${postalCode}/m", $city[$postalCodeColumn]) != 0;
        });

        $citiesResponseModel = array_map(function (array $city) use ($postalCodeColumn, $cityCodeColumn, $cityNameColumn) {

            $cityModel = new CityViewModel();

            $cityModel->postalCode = $city[$postalCodeColumn];
            $cityModel->cityCode = $city[$cityCodeColumn];
            $cityModel->cityName = $city[$cityNameColumn];

            return $cityModel;

        }, $citiesForPostalCode);

        return array_values($citiesResponseModel);
    }
}