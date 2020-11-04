<?php

namespace App\Controllers;

use App\Domain\Services\Cities\ICitiesService;
use Fig\Http\Message\StatusCodeInterface;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class CitySearchController
{
    private ICitiesService $citiesService;

    /**
     * CitySearchController constructor.
     * @param ICitiesService $citiesService
     */
    public function __construct(ICitiesService $citiesService) {
        $this->citiesService = $citiesService;
    }

    /**
     * @param Request $request
     * @param Response $response
     * @param array $args
     * @return Response
     */
    public function getCitiesByPostalCode(Request $request, Response $response, array $args): Response {
        $postalQueryId = 'postalCode';
        $queryParams = $request->getQueryParams();

        if (!isset($queryParams[$postalQueryId])) {
            return $response->withStatus(StatusCodeInterface::STATUS_BAD_REQUEST);
        }

        $postalCode = $queryParams[$postalQueryId];

        $result = $this->citiesService->searchPostalCode($postalCode);

        $response->getBody()->write(json_encode($result));
        return $response->withAddedHeader('Content-Type', 'application/json');
    }
}