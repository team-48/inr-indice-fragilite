<?php


namespace App\Domain\Services\Cities;


interface ICitiesService
{
    /**
     * Search cities by postal code
     * @param string $postalCode
     * @return array
     */
    public function searchPostalCode(string $postalCode): array;
}