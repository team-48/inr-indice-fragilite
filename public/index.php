<?php

use App\Controllers\CitySearchController;
use App\Controllers\HelloWorldController;
use App\Domain\Services\Cities\CitiesService;
use App\Infrastructure\Cities\CitiesRepository;
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
