<?php

use App\Controllers\CitySearchController;
use App\Controllers\HelloWorldController;
use App\Domain\Services\Cities\CitiesService;
use App\Infrastructure\Cities\CitiesRepository;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/../system/autoloader.php';

$app = AppFactory::create();

$app->get('/', function (Request $request, Response $response, array $args) {
    $controller = new HelloWorldController();
    return $controller->Index($request, $response, $args);
});

$app->get("/cities", function (Request $request, Response $response, array $args) {
    $citiesRepository = new CitiesRepository();
    $citiesService = new CitiesService($citiesRepository);

    $controller = new CitySearchController($citiesService);
    return $controller->getCitiesByPostalCode($request, $response, $args);
});

$app->run();
