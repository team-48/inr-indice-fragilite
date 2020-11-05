<?php

namespace App\Domain\Services\Parser;

use App\Domain\Repositories\IStatisticsRepository;

class ParserService implements IParserService
{
    private static int $COLUMN_CITY_CODE = 10;
    private static int $COLUMN_CITY_NAME = 0;

    private IStatisticsRepository $statisticsRepository;

    /**
     * ParserService constructor.
     * @param IStatisticsRepository $statisticsRepository
     */
    public function __construct(IStatisticsRepository $statisticsRepository)
    {
        $this->statisticsRepository = $statisticsRepository;
    }

    /**
     * @inheritdoc
     */
    public function getCityStatisticsByCityCode(string $cityCode): array {
        $departmentCode = substr($cityCode, 0, 2);

        $cities = $this->statisticsRepository->getCityStatsByDepartment($departmentCode);

        return $this->filterCityByCityCode($cities, $cityCode);
    }

    /**
     * Add headers to city
     * @param array $row
     * @param array $headers
     * @return array
     */
    private function formatRowWithHeader(array $row, array $headers) {
        $arr = array();
        $i = 0;

        foreach ($row as $elt) {
            $arr[$headers[$i]] = $elt;
            $i++;
        }

        return $arr;
    }

    /**
     * Filter cities by city code
     * @param array $cities
     * @param string $value
     * @return array
     */
    private function filterCityByCityCode(array $cities, string $value)
    {
        if ($value[0] === "0") {
            $value = substr($value, 1);
        }

        $headers = $this->statisticsRepository->getStatsHeader();
        $filteredCities = array();

        foreach ($cities as $city) {
            if (strcmp($city[self::$COLUMN_CITY_CODE], $value) === 0 ){
                array_push($filteredCities, $this->formatRowWithHeader($city, $headers));
            }
        }

        return $filteredCities;
    }
}
