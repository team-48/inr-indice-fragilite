<?php


namespace App\Domain\Exceptions;


use Exception;

class BadRequestException extends Exception
{

    /**
     * BadRequestException constructor.
     * @param string $message
     */
    public function __construct(string $message)
    {
        parent::__construct($message);
    }
}