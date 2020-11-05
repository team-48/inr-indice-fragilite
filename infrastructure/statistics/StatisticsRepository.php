<?php

namespace App\Infrastructure\Statistics;

use App\Domain\Repositories\IStatisticsRepository;

class StatisticsRepository implements IStatisticsRepository
{
    private static int $FILE_LIMIT = 0;
    private static string $PARSE_DELIMITER = ';';

    /**
     * @inheritdoc
     */
    public function getCityStatsByDepartment(string $departmentCode): array
    {
        $regDeptMapper = file_get_contents(__DIR__ . "/reg-dept-mapper.json");
        $jsonMapper = json_decode($regDeptMapper, true);
        $depCodeColumn = 'codeDepartement';

        $regionForDepartment = array_filter($jsonMapper, function (array $item) use ($departmentCode, $depCodeColumn) {
            return preg_match("/^${departmentCode}/m", $item[$depCodeColumn]) != 0;
        });

        $keyElement = array_key_first($regionForDepartment);
        $file = __DIR__ . "/data/{$regionForDepartment[$keyElement]["codeRegion"]}.csv";

        $data = [];

        $fileHandle = fopen($file, "r");
        $rowIndex = 0;

        while (($row = fgetcsv($fileHandle, self::$FILE_LIMIT, self::$PARSE_DELIMITER)) !== FALSE ) {
            $data[$rowIndex] = $row;
            $rowIndex++;
        }

        fclose($fileHandle);

        return $data;
    }

    /**
     * @inheritdoc
     */
    public function getStatsHeader(): array
    {
        $file = __DIR__ . '/data/headers.csv';

        $fileHandle = fopen($file, 'r');
        $headers = fgetcsv($fileHandle, self::$FILE_LIMIT, self::$PARSE_DELIMITER);

        fclose($fileHandle);

        return $headers;
    }
}
