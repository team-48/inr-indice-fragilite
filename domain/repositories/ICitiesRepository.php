<?php


namespace App\Domain\Repositories;


interface ICitiesRepository
{
    /**
     * Get all cities
     * @return array
     */
    public function getAll(): array;
}