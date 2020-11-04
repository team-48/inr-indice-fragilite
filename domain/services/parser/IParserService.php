<?php

namespace App\Domain\Services\Parser;

interface IParserService
{
    /**
     * @param int $value
     */
    public function filter_by_name(int $value);

    /**
     * @param int $value
     */
    public function filter_by_comCode(int $value);
}
