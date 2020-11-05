<?php


namespace App\Domain\Repositories;


interface IStatisticsRepository
{
    /**
     * Get header of stats
     * @return array
     */
    public function getStatsHeader(): array;

    /**
     * Get city statistics by department
     * @param string $departmentCode
     * @return array
     */
    public function getCityStatsByRegionCode(string $departmentCode): array;
}