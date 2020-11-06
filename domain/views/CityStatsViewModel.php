<?php


namespace App\Domain\Views;


class CityStatsViewModel
{
    public string $iris;
    public string $irisName;
    public string $irisType;

    public float $departmentGlobalScore;
    public float $regionGlobalScore;

    public float $departmentInformationAccess;
    public float $regionInformationAccess;

    public float $departmentDigitalInterfaceAccess;
    public float $regionDigitalInterfaceAccess;

    public float $departmentAdministrativeSkills;
    public float $regionAdministrativeSkills;

    public float $departmentDigitalSkills;
    public float $regionDigitalSkills;

    public float $departmentGlobalAccess;
    public float $regionGlobalAccess;

    public float $departmentGlobalSkills;
    public float $regionGlobalSkills;
}