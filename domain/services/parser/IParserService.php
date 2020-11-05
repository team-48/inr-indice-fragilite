<?php

namespace App\Domain\Services\Parser;

interface IParserService
{
    /**
     * Get statistics by city code
     * @param string $cityCode
     * @return array
     */
    public function getCityStatisticsByCityCode(string $cityCode): array;
}
