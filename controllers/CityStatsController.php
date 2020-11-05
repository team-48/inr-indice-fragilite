<?php

namespace App\Controllers;

use App\Domain\Services\Parser\IParserService;
use Psr\Http\Message\ResponseInterface as Response;


class CityStatsController
{
    private IParserService $parserService;

    /**
     * CityStatsController constructor.
     * @param IParserService $parserService
     */
    public function __construct(IParserService $parserService)
    {
        $this->parserService = $parserService;
    }

    /**
     * Get city statistics by city code
     * @param Response $response
     * @param array $args
     * @return Response
     */
    public function getCitiesByComCode(Response $response, array $args): Response {
        $comCode = $args['communeCod'];

        $cityStats = $this->parserService->getCityStatisticsByCityCode($comCode);

        $response->getBody()->write(json_encode($cityStats, JSON_UNESCAPED_UNICODE));
        return $response->withAddedHeader('Content-Type', 'application/json');
    }
}
