<?php

namespace App\Infrastructure\Region;

use App\Domain\Repositories\IRegionDepartmentRepository;

class RegionDepartmentRepository implements IRegionDepartmentRepository
{

    /**
     * @inheritdoc
     */
    public function getRegionCodeForDepartment(string $departmentCode): string
    {
        $departmentCode = substr($departmentCode, 0, 2);

        $filePath = __DIR__ . "/data/reg-dept-mapper.json";

        $fileContent = file_get_contents($filePath);
        $regionDepartmentMap = json_decode($fileContent, true);

        $departmentCodeColumn = 'codeDepartement';
        $regionsForDepartment = array_filter($regionDepartmentMap, function (array $item) use ($departmentCode, $departmentCodeColumn) {
            return preg_match("/^${departmentCode}/m", $item[$departmentCodeColumn]) != 0;
        });

        $firstKey = array_key_first($regionsForDepartment);
        $regionForDepartment = $regionsForDepartment[$firstKey];

        return $regionForDepartment["codeRegion"];
    }
}