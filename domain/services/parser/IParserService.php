<?php

namespace App\Domain\Services\Parser;

use App\Domain\Exceptions\BadRequestException;

interface IParserService
{
    /**
     * Get statistics by city code
     * @param string $cityCode
     * @param string $requestType
     * @return array
     * @throws BadRequestException
     */
    public function getCityStatisticsByCityCode(string $cityCode, string $requestType): array;
}
