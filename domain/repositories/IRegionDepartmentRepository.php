<?php


namespace App\Domain\Repositories;


interface IRegionDepartmentRepository
{
    /**
     * Get region code by department code
     * @param string $departmentCode
     * @return string
     */
    public function getRegionCodeForDepartment(string $departmentCode): string;
}