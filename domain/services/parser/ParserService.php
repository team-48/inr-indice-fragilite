<?php

namespace App\Domain\Services\Parser;

class ParserService implements IParserService
{
    protected $csv;

    protected $data = array();

    protected $headers = array();

    protected $limit = 0;

    protected $delimiter;

    protected $inseeDept;

    public function __construct($inseeDept = null, $delimiter = ";")
    {
        if (strlen($inseeDept) > 0) {
            $this->setinseeDept($inseeDept);

            $this->setCsv($this->inseeDept);

            $this->setDelimeter($delimiter);

            $this->parse();
        }
    }

    public function setinseeDept($inseeDept)
    {
        $this->inseeDept = $inseeDept;
    }

    public function setCsv($inseeDept)
    {
        $this->csv = "dept_list/{$inseeDept}.csv";
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
        $filerow = 0;

        while (($row = fgetcsv($fileHandle, $this->limit, $this->delimiter)) !== FALSE ) {
            $this->data[$filerow] = $row;
            $filerow++;
        }
        fclose($fileHandle);
    }

    public function all()
    {
        return $this->data;
    }

    public function filterByName(string $value)
    {
        $rows = array();

        foreach ($this->data as $row) {
            if (strcmp($row[0], $value) === 0 ){
                print_r($row);
                array_push($rows, $row);
            }
        }

        return $rows;
    }

    public function filterByComCode(string $value)
    {
        $rows = array();

        foreach ($this->data as $row) {
            if (strcmp($row[10], $value) === 0 ){
                array_push($rows, $row);
            }
        }

        return $rows;
    }
}
