<?php

namespace App\Domain\Services\Parser;

use App\Domain\Exceptions\BadRequestException;
use App\Domain\Repositories\IRegionDepartmentRepository;
use App\Domain\Repositories\IStatisticsRepository;
use App\Domain\Views\CityStatsScoring;
use App\Domain\Views\CityStatsViewModel;

class ParserService implements IParserService
{
    public static string $REQUEST_TYPE_DEPARTMENT = "department";
    public static string $REQUEST_TYPE_REGION = "region";

    private static string $COLUMN_CITY_CODE = "COM";
    private static string $COLUMN_CITY_DEPARTMENT = "Insee Dep";

    private static string $COLUMN_CITY_IRIS = "Code Iris";
    private static string $COLUMN_CITY_IRIS_NAME = "Nom Iris";
    private static string $COLUMN_CITY_IRIS_TYPE = "Type Iris";
    
    private static string $COLUMN_CITY_DEPARTMENT_SCORE = "SCORE GLOBAL departement 1";
    private static string $COLUMN_CITY_DEPARTMENT_INFORMATION_ACCESS_SCORE = "ACCES A L'INFORMATION departement 1";
    private static string $COLUMN_CITY_DEPARTMENT_ACCESS_SCORE = "GLOBAL ACCES departement 1";
    private static string $COLUMN_CITY_DEPARTMENT_ADMINISTRATIVE_SKILLS_SCORE = "COMPETENCES ADMINISTATIVES departement 1";
    private static string $COLUMN_CITY_DEPARTMENT_DIGITAL_ACCESS_SCORE = "ACCÈS AUX INTERFACES NUMERIQUES departement 1";
    private static string $COLUMN_CITY_DEPARTMENT_SCHOOL_SKILLS_SCORE = "COMPÉTENCES NUMÉRIQUES / SCOLAIRES departement 1";
    private static string $COLUMN_CITY_DEPARTMENT_SKILLS_SCORE = "GLOBAL COMPETENCES  departement 1";

    private static string $COLUMN_CITY_REGION_SCORE = "SCORE GLOBAL region 1";
    private static string $COLUMN_CITY_REGION_INFORMATION_ACCESS_SCORE = "ACCES A L'INFORMATION region 1";
    private static string $COLUMN_CITY_REGION_ACCESS_SCORE = "GLOBAL ACCES region 1";
    private static string $COLUMN_CITY_REGION_ADMINISTRATIVE_SKILLS_SCORE = "COMPETENCES ADMINISTATIVES region 1";
    private static string $COLUMN_CITY_REGION_DIGITAL_ACCESS_SCORE = "ACCÈS AUX INTERFACES NUMERIQUES region 1";
    private static string $COLUMN_CITY_REGION_SCHOOL_SKILLS_SCORE = "COMPÉTENCES NUMÉRIQUES / SCOLAIRES region 1";
    private static string $COLUMN_CITY_REGION_SKILLS_SCORE = "GLOBAL COMPETENCES region 1";

    private IStatisticsRepository $statisticsRepository;
    private IRegionDepartmentRepository $regionDepartmentRepository;

    /**
     * ParserService constructor.
     * @param IStatisticsRepository $statisticsRepository
     * @param IRegionDepartmentRepository $regionDepartmentRepository
     */
    public function __construct(IStatisticsRepository $statisticsRepository, IRegionDepartmentRepository $regionDepartmentRepository)
    {
        $this->statisticsRepository = $statisticsRepository;
        $this->regionDepartmentRepository = $regionDepartmentRepository;
    }

    /**
     * @inheritdoc
     */
    public function getCityStatisticsByCityCode(string $cityCode, string $requestType): array
    {
        if ($requestType != self::$REQUEST_TYPE_REGION && $requestType != self::$REQUEST_TYPE_DEPARTMENT) {
            throw new BadRequestException("incorrect query type");
        }

        $departmentCode = substr($cityCode, 0, 3);

        $regionCode = $this->regionDepartmentRepository->getRegionCodeForDepartment($departmentCode);

        $cities = $this->statisticsRepository->getCityStatsByRegionCode($regionCode);

        $headers = $this->statisticsRepository->getStatsHeader();

        if ($requestType == self::$REQUEST_TYPE_DEPARTMENT)
        {
            $cities = $this->filterCitiesByDepartment($headers, $cities, $departmentCode);
        }

        $scoring = $this->computeScoring($headers, $cities, $requestType);

        $citiesForCityCode = $this->filterCityByCityCode($headers, $cities, $cityCode);

        return [
            'scoring' => $scoring,
            'cities' => $this->mapResponse($citiesForCityCode)
        ];
    }

    private function filterCitiesByDepartment(array $headers, array $cities, string $departmentCode): array {
        return array_filter($cities, function ($city) use ($headers, $departmentCode) {
            if ((int)$departmentCode < 971) {
                $departmentCode = substr($departmentCode, 0, 2);
            }

            if ($departmentCode[0] == 0) {
                $departmentCode = substr($departmentCode, 1);
            }

            return (strcmp($city[$this->getColumnIndexByName($headers, self::$COLUMN_CITY_DEPARTMENT)], $departmentCode) === 0);
        });
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
        if ($value[0] == 0) {
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

    private function computeScoring(array $headers, array $cities, string $scoringType)
    {
        $result = new CityStatsScoring();
        $result->type = $scoringType;

        foreach ($cities as $city)
        {
            $column = $scoringType == self::$REQUEST_TYPE_REGION ? self::$COLUMN_CITY_REGION_SCORE : self::$COLUMN_CITY_DEPARTMENT_SCORE;
            $departmentScoreIndex = $this->getColumnIndexByName($headers, $column);
            $departmentScore = (int)$city[$departmentScoreIndex];

            if ($departmentScore > $result->department)
            {
                $result->department = $departmentScore;
            }

            $column = $scoringType == self::$REQUEST_TYPE_REGION ? self::$COLUMN_CITY_REGION_INFORMATION_ACCESS_SCORE : self::$COLUMN_CITY_DEPARTMENT_INFORMATION_ACCESS_SCORE;
            $informationAccessScoreIndex = $this->getColumnIndexByName($headers, $column);
            $informationAccessScore = (int)$city[$informationAccessScoreIndex];

            if ($informationAccessScore > $result->informationAccess)
            {
                $result->informationAccess = $informationAccessScore;
            }

            $column = $scoringType == self::$REQUEST_TYPE_REGION ? self::$COLUMN_CITY_REGION_ACCESS_SCORE : self::$COLUMN_CITY_DEPARTMENT_ACCESS_SCORE;
            $accessScoreIndex = $this->getColumnIndexByName($headers, $column);
            $accessScore = (int)$city[$accessScoreIndex];

            if ($accessScore > $result->access)
            {
                $result->access = $accessScore;
            }

            $column = $scoringType == self::$REQUEST_TYPE_REGION ? self::$COLUMN_CITY_REGION_ADMINISTRATIVE_SKILLS_SCORE : self::$COLUMN_CITY_DEPARTMENT_ADMINISTRATIVE_SKILLS_SCORE;
            $administrativeSkillsScoreIndex = $this->getColumnIndexByName($headers, $column);
            $administrativeSkillsScore = (int)$city[$administrativeSkillsScoreIndex];

            if ($administrativeSkillsScore > $result->administrativeSkills)
            {
                $result->administrativeSkills = $administrativeSkillsScore;
            }

            $column = $scoringType == self::$REQUEST_TYPE_REGION ? self::$COLUMN_CITY_REGION_DIGITAL_ACCESS_SCORE : self::$COLUMN_CITY_DEPARTMENT_DIGITAL_ACCESS_SCORE;
            $digitalInterfaceAccessScoreIndex = $this->getColumnIndexByName($headers, $column);
            $digitalInterfaceAccessScore = (int)$city[$digitalInterfaceAccessScoreIndex];

            if ($digitalInterfaceAccessScore > $result->digitalInterfacesAccess)
            {
                $result->digitalInterfacesAccess = $digitalInterfaceAccessScore;
            }

            $column = $scoringType == self::$REQUEST_TYPE_REGION ? self::$COLUMN_CITY_REGION_SCHOOL_SKILLS_SCORE : self::$COLUMN_CITY_DEPARTMENT_SCHOOL_SKILLS_SCORE;
            $schoolSkillsScoreIndex = $this->getColumnIndexByName($headers, $column);
            $schoolSkillsScore = (int)$city[$schoolSkillsScoreIndex];

            if ($schoolSkillsScore > $result->schoolSkills)
            {
                $result->schoolSkills = $schoolSkillsScore;
            }

            $column = $scoringType == self::$REQUEST_TYPE_REGION ? self::$COLUMN_CITY_REGION_SKILLS_SCORE : self::$COLUMN_CITY_DEPARTMENT_SKILLS_SCORE;
            $skillsScoreIndex = $this->getColumnIndexByName($headers, $column);
            $skillsScore = (int)$city[$skillsScoreIndex];

            if ($skillsScore > $result->skills) {
                $result->skills = $skillsScore;
            }
        }

        return $result;
    }

    private function mapResponse(array $cities): array {
        return array_map(function ($city) {

            $model = new CityStatsViewModel();

            $model->iris = $city[self::$COLUMN_CITY_IRIS];
            $model->irisName = $city[self::$COLUMN_CITY_IRIS_NAME];
            $model->irisType = $city[self::$COLUMN_CITY_IRIS_TYPE];

            $model->departmentGlobalScore = $city[self::$COLUMN_CITY_DEPARTMENT_SCORE];
            $model->regionGlobalScore = $city[self::$COLUMN_CITY_REGION_SCORE];

            $model->departmentInformationAccess = $city[self::$COLUMN_CITY_DEPARTMENT_INFORMATION_ACCESS_SCORE];
            $model->regionInformationAccess = $city[self::$COLUMN_CITY_REGION_INFORMATION_ACCESS_SCORE];

            $model->departmentDigitalInterfaceAccess = $city[self::$COLUMN_CITY_DEPARTMENT_DIGITAL_ACCESS_SCORE];
            $model->regionDigitalInterfaceAccess = $city[self::$COLUMN_CITY_REGION_DIGITAL_ACCESS_SCORE];

            $model->departmentAdministrativeSkills = $city[self::$COLUMN_CITY_DEPARTMENT_ADMINISTRATIVE_SKILLS_SCORE];
            $model->regionAdministrativeSkills = $city[self::$COLUMN_CITY_REGION_ADMINISTRATIVE_SKILLS_SCORE];

            $model->departmentDigitalSkills = $city[self::$COLUMN_CITY_DEPARTMENT_SCHOOL_SKILLS_SCORE];
            $model->regionDigitalSkills = $city[self::$COLUMN_CITY_REGION_SCHOOL_SKILLS_SCORE];

            $model->departmentGlobalAccess = $city[self::$COLUMN_CITY_DEPARTMENT_ACCESS_SCORE];
            $model->regionGlobalAccess = $city[self::$COLUMN_CITY_REGION_ACCESS_SCORE];

            $model->departmentGlobalSkills = $city[self::$COLUMN_CITY_DEPARTMENT_SKILLS_SCORE];
            $model->regionGlobalSkills = $city[self::$COLUMN_CITY_REGION_SKILLS_SCORE];

            return $model;

        }, $cities);
    }
}
