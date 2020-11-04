<?php

use App\Controllers\HelloWorldController;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/../system/autoloader.php';

$app = AppFactory::create();

$app->get('/', function (Request $request, Response $response, array $args) {
    $controller = new HelloWorldController();
    return $controller->Index($request, $response, $args);
});

$app->run();
