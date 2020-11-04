<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class HelloWorldController
{
    public function Index(Request $request, Response $response, array $args): Response {
        $response->getBody()->write("Hello World!");
        return $response;
    }
}