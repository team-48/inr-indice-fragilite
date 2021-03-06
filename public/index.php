<?php

use App\Controllers\CitySearchController;
use App\Controllers\LandingController;
use App\Controllers\CityStatsController;
use App\Domain\Services\Cities\CitiesService;
use App\Domain\Services\Parser\ParserService;
use App\Infrastructure\Cities\CitiesRepository;
use App\Infrastructure\Region\RegionDepartmentRepository;
use App\Infrastructure\Statistics\StatisticsRepository;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use Slim\Views\Twig;
use Slim\Views\TwigMiddleware;

require __DIR__ . '/../system/autoloader.php';

$app = AppFactory::create();

// Create Twig
$twig = Twig::create(__DIR__ . '/../templates');

// Add Twig-View Middleware
$app->add(TwigMiddleware::create($app, $twig));

$app->get('/', function (Request $request, Response $response, array $args)  {
    $controller = new LandingController();
    return $controller->Index($request, $response, $args);
});

$app->get("/cities", function (Request $request, Response $response, array $args) {
    $citiesRepository = new CitiesRepository();
    $citiesService = new CitiesService($citiesRepository);

    $controller = new CitySearchController($citiesService);
    return $controller->getCitiesByPostalCode($request, $response, $args);
});

$app->get("/stats/{communeCod}", function (Request $request, Response $response, array $args) {
    $statisticsRepository = new StatisticsRepository();
    $regionDepartmentRepository = new RegionDepartmentRepository();
    $parserService = new ParserService($statisticsRepository, $regionDepartmentRepository);

    $controller = new CityStatsController($parserService);
    return $controller->getCitiesByComCode($request, $response, $args);
});

$app->run();
