<?php

namespace App\Controllers;

use Fig\Http\Message\StatusCodeInterface;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Domain\Services\Parser\ParserService;


class CityStatsController
{
    /**
     * @param Request $request
     * @param Response $response
     * @param array $args
     * @return Response
     */
    public function getCitiesByComCode(Request $request, Response $response, array $args): Response {
        $comCode = $args['communeCod'];
        $departementCode = substr($comCode, 0, 2);
        $rows = new ParserService($departementCode, ";");

        $response->getBody()->write(json_encode($rows->filterByComCode($comCode), JSON_UNESCAPED_UNICODE));
        return $response->withAddedHeader('Content-Type', 'application/json');
    }
}
