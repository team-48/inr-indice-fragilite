<?php


namespace App\Infrastructure\Cities;


use App\Domain\Repositories\ICitiesRepository;

class CitiesRepository implements ICitiesRepository
{
    /**
     * Cities data
     * @var array
     */
    private array $data;

    /**
     * CitiesRepository constructor.
     */
    public function __construct()
    {
        $data = file_get_contents(__DIR__ . "/data/codes-postaux.json");
        $this->data = json_decode($data, true);
    }

    /**
     * @inheritdoc
     */
    public function getAll(): array
    {
        return $this->data;
    }
}