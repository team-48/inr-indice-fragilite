<?php

namespace App\Domain\Services\Parser;

use App\Domain\Repositories\IStatisticsRepository;
use App\Domain\Views\CityStatsScoring;

class ParserService implements IParserService
{
    private static int $COLUMN_CITY_CODE = 8;
    private static int $COLUMN_CITY_NAME = 0;
    private static string $COLUMN_CITY_DEPARTMENT_SCORE = "SCORE GLOBAL departement 1";

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

        $headers = $this->statisticsRepository->getStatsHeader();

        $scoring = $this->computeScoring($headers, $cities);

        $citiesForCityCode =  $this->filterCityByCityCode($headers, $cities, $cityCode);

        return [
            'scoring' => $scoring,
            'cities' => $citiesForCityCode
        ];
    }

    private function getColumnIndexByName(array $headers, string $name) {
        return array_search($name, $headers);
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
     * @param array $headers
     * @param array $cities
     * @param string $value
     * @return array
     */
    private function filterCityByCityCode(array $headers, array $cities, string $value) {
        if ($value[0] === "0") {
            $value = substr($value, 1);
        }

        $filteredCities = array();

        foreach ($cities as $city) {
            if (strcmp($city[self::$COLUMN_CITY_CODE], $value) === 0 ){
                array_push($filteredCities, $this->formatRowWithHeader($city, $headers));
            }
        }

        return $filteredCities;
    }

    private function computeScoring(array $headers, array $cities) {
        $result = new CityStatsScoring();

        foreach ($cities as $city) {
            $departmentScoreIndex = $this->getColumnIndexByName($headers, self::$COLUMN_CITY_DEPARTMENT_SCORE);
            $departmentScore = (int)$city[$departmentScoreIndex];

            if ($departmentScore > $result->department) {
                $result->department = $departmentScore;
            }
        }

        return $result;
    }
}
