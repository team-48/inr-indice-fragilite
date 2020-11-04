<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Views\Twig;

class LandingController
{
    public function Index(Request $request, Response $response, array $args): Response {
        $view = Twig::fromRequest($request);
        return $view->render($response, 'landing.twig');
    }
}
