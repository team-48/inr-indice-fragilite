<?php

namespace App\Domain\Services\Parser;

interface IParserService
{
    /**
     * @param string $value
     */
    public function filterByName(string $value);

    /**
     * @param string $value
     */
    public function filterByComCode(string $value);
}
