<?php
require_once $_SESSION['dir_folder_php'] .'Repositories/RepositorySections.php';

class Sections
{
    private $repository;

    public function __construct()
    {
        $this->repository = new RepositorySections();
    }

    public function getSections($params)
    {
        $result = $this->repository->getSections($params);
        return $result;
    }
}