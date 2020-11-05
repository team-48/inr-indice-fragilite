<?php

namespace App\Controllers;

use App\Domain\Services\Parser\IParserService;
use App\Domain\Services\Parser\ParserService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;


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
     * @param Request $request
     * @param Response $response
     * @param array $args
     * @return Response
     */
    public function getCitiesByComCode(Request $request, Response $response, array $args): Response {
        $comCode = $args['communeCod'];
        $queryParams = $request->getQueryParams();
        $queryType = $queryParams['type'] ?? ParserService::$REQUEST_TYPE_REGION;

        $cityStats = $this->parserService->getCityStatisticsByCityCode($comCode, $queryType);

        $response->getBody()->write(json_encode($cityStats, JSON_UNESCAPED_UNICODE));
        return $response->withAddedHeader('Content-Type', 'application/json');
    }
}
