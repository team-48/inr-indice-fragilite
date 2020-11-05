<?php

namespace App\Domain\Services\Parser;

use App\Domain\Repositories\IStatisticsRepository;
use App\Domain\Views\CityStatsScoring;

class ParserService implements IParserService
{
    private static string $COLUMN_CITY_CODE = "COM";
    private static string $COLUMN_CITY_DEPARTMENT_SCORE = "SCORE GLOBAL departement 1";
    private static string $COLUMN_CITY_INFORMATION_ACCESS_SCORE = "ACCÈS AUX INTERFACES NUMERIQUES departement 1";
    private static string $COLUMN_CITY_ACCESS_SCORE = "GLOBAL ACCES departement 1";
    private static string $COLUMN_CITY_ADMINISTRATIVE_SKILLS_SCORE = "COMPETENCES ADMINISTATIVES departement 1";
    private static string $COLUMN_CITY_DIGITAL_ACCESS_SCORE = "ACCÈS AUX INTERFACES NUMERIQUES departement 1";
    private static string $COLUMN_CITY_SCHOOL_SKILLS_SCORE = "COMPÉTENCES NUMÉRIQUES / SCOLAIRES departement 1";
    private static string $COLUMN_CITY_SKILLS_SCORE = "GLOBAL COMPETENCES  departement 1";

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
    public function getCityStatisticsByCityCode(string $cityCode): array
    {
        $departmentCode = substr($cityCode, 0, 2);

        $cities = $this->statisticsRepository->getCityStatsByDepartment($departmentCode);

        $headers = $this->statisticsRepository->getStatsHeader();

        $scoring = $this->computeScoring($headers, $cities);

        $citiesForCityCode = $this->filterCityByCityCode($headers, $cities, $cityCode);

        return [
            'scoring' => $scoring,
            'cities' => $citiesForCityCode
        ];
    }

    private function getColumnIndexByName(array $headers, string $name)
    {
        return array_search($name, $headers);
    }

    /**
     * Add headers to city
     * @param array $row
     * @param array $headers
     * @return array
     */
    private function formatRowWithHeader(array $row, array $headers)
    {
        $arr = array();
        $i = 0;

        foreach ($row as $elt)
        {
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
    private function filterCityByCityCode(array $headers, array $cities, string $value)
    {
        if ($value[0] === "0")
        {
            $value = substr($value, 1);
        }

        $filteredCities = array();

        foreach ($cities as $city)
        {
            $codIndex = $this->getColumnIndexByName($headers, self::$COLUMN_CITY_CODE);
            if (strcmp($city[$codIndex], $value) === 0)
            {
                array_push($filteredCities, $this->formatRowWithHeader($city, $headers));
            }
        }

        return $filteredCities;
    }

    private function computeScoring(array $headers, array $cities)
    {
        $result = new CityStatsScoring();

        foreach ($cities as $city)
        {
            $departmentScoreIndex = $this->getColumnIndexByName($headers, self::$COLUMN_CITY_DEPARTMENT_SCORE);
            $departmentScore = (int)$city[$departmentScoreIndex];

            if ($departmentScore > $result->department)
            {
                $result->department = $departmentScore;
            }

            $informationAccessScoreIndex = $this->getColumnIndexByName($headers, self::$COLUMN_CITY_INFORMATION_ACCESS_SCORE);
            $informationAccessScore = (int)$city[$informationAccessScoreIndex];

            if ($informationAccessScore > $result->informationAccess)
            {
                $result->informationAccess = $informationAccessScore;
            }

            $accessScoreIndex = $this->getColumnIndexByName($headers, self::$COLUMN_CITY_ACCESS_SCORE);
            $accessScore = (int)$city[$accessScoreIndex];

            if ($accessScore > $result->access)
            {
                $result->access = $accessScore;
            }


            $administrativeSkillsScoreIndex = $this->getColumnIndexByName($headers, self::$COLUMN_CITY_ADMINISTRATIVE_SKILLS_SCORE);
            $administrativeSkillsScore = (int)$city[$administrativeSkillsScoreIndex];

            if ($administrativeSkillsScore > $result->administrativeSkills)
            {
                $result->administrativeSkills = $administrativeSkillsScore;
            }

            $digitalInterfaceAccessScoreIndex = $this->getColumnIndexByName($headers, self::$COLUMN_CITY_DIGITAL_ACCESS_SCORE);
            $digitalInterfaceAccessScore = (int)$city[$digitalInterfaceAccessScoreIndex];

            if ($digitalInterfaceAccessScore > $result->digitalInterfacesAccess)
            {
                $result->digitalInterfacesAccess = $digitalInterfaceAccessScore;
            }

            $schoolSkillsScoreIndex = $this->getColumnIndexByName($headers, self::$COLUMN_CITY_SCHOOL_SKILLS_SCORE);
            $schoolSkillsScore = (int)$city[$schoolSkillsScoreIndex];

            if ($schoolSkillsScore > $result->schoolSkills)
            {
                $result->schoolSkills = $schoolSkillsScore;
            }

            $skillsScoreIndex = $this->getColumnIndexByName($headers, self::$COLUMN_CITY_SKILLS_SCORE);
            $skillsScore = (int)$city[$skillsScoreIndex];

            if ($skillsScore > $result->skills) {
                $result->skills = $skillsScore;
            }
        }

        return $result;
    }
}
