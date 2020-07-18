<?php


class EnumDataTypes
{
    private $datatypes = array('_uuid', '_char', '_varchar');

    public function getAll()
    {
        return $this->datatypes;
    }

    public function isTypeString($value)
    {
        return in_array($value, $this->datatypes);
    }

}