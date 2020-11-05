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
    public function getCityStatsByRegionCode(string $regionCode): array
    {
        $filePath = __DIR__ . "/data/{$regionCode}.csv";

        $data = [];

        $fileHandle = fopen($filePath, "r");

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
        $filePath = __DIR__ . '/data/headers.csv';

        $fileHandle = fopen($filePath, 'r');
        $headers = fgetcsv($fileHandle, self::$FILE_LIMIT, self::$PARSE_DELIMITER);

        fclose($fileHandle);

        return $headers;
    }
}
