<?php


namespace App\Domain\Services\Parser;

class ParserService implements IParserService
{
    protected $csv;

    protected $data = array();

    protected $headers = array();

    protected $limit = 0;

    protected $delimiter;

    public function __construct($csv = null, $delimiter = ";")
    {
        if (strlen($csv) > 0) {
            $this->setCsv($csv);

            $this->setDelimeter($delimiter);

            $this->parse();
        }
    }

    public function setCsv($csv)
    {
        $this->csv = $csv;
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

        // DEV NOTE : $filerow < 500 use to bypass file size limit
        while (($row = fgetcsv($fileHandle, $this->limit, $this->delimiter)) && $filerow < 500 !== FALSE ) {
            if ($row == 1) continue; // skip header
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
