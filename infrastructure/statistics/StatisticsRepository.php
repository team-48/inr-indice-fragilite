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
        $file = __DIR__ . "/data/{$departmentCode}.csv";

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