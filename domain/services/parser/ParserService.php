<?php

namespace App\Domain\Services\Parser;

class ParserService implements IParserService
{
    protected string $csv;

    protected array $data = array();

    protected array $headers = array();

    protected  int $limit = 0;

    protected string $delimiter;

    protected string $inseeDept;

    protected int $comCodeColumnIndex = 10;

    protected int $cityNameColumnIndex = 0;

    public function __construct($inseeDept = null, $delimiter = ";")
    {
        if (strlen($inseeDept) > 0) {
            $this->setinseeDept($inseeDept);
            $this->setCsv($this->inseeDept);
            $this->setDelimeter($delimiter);
            $this->setHeaders();
            $this->parse();
        }
    }

    public function setinseeDept($inseeDept)
    {
        $this->inseeDept = $inseeDept;
    }

    public function setHeaders()
    {
        $fileHandle = fopen(__DIR__ . "/../../../infrastructure/cities/data/dept_list/headers.csv", "r");
        $row = fgetcsv($fileHandle, $this->limit, $this->delimiter);
        $this->headers = $row;
        fclose($fileHandle);
    }

    public function getHeaders()
    {
        return $this->headers;
    }

    public function setCsv($inseeDept)
    {
        $this->csv = __DIR__ . "/../../../infrastructure/cities/data/dept_list/{$inseeDept}.csv";
    }

    public function setDelimeter($delimiter)
    {
        $this->delimiter = $delimiter;
    }

    public function getCsv()
    {
        return $this->csv;
    }

    public function parse()
    {
        $fileHandle = fopen($this->getCsv(), "r");
        $rowIndex = 0;

        while (($row = fgetcsv($fileHandle, $this->limit, $this->delimiter)) !== FALSE ) {
            $this->data[$rowIndex] = $row;
            $rowIndex++;
        }
        fclose($fileHandle);
    }

    public function filterByName(string $value)
    {
        $rows = array();

        foreach ($this->data as $row) {
            if (strcmp($row[$this->cityNameColumnIndex], $value) === 0 ){
                array_push($rows, $row);
            }
        }

        return $rows;
    }

    public function formatRowWithHeader(array $row) {
        $arr = array();
        $i = 0;

        foreach ($row as $elt) {
            $arr[$this->getHeaders()[$i]] = $elt;
            $i++;
        }

        return $arr;
    }

    public function filterByComCode(string $value)
    {
        if ($value[0] === "0") $value = substr($value, 1);

        $rows = array();

        foreach ($this->data as $row) {
            if (strcmp($row[$this->comCodeColumnIndex], $value) === 0 ){
                array_push($rows, $this->formatRowWithHeader($row));
            }
        }

        return $rows;
    }
}
