<?php

namespace App\Domain\Services\Parser;

interface IParserService
{
    /**
     * @param string $value
     */
    public function filter_by_name(string $value);

    /**
     * @param string $value
     */
    public function filter_by_comCode(string $value);
}
