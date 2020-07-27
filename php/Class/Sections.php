<?php
require_once $_SESSION['dir_folder_php'] .'Repositories/RepositorySections.php';

class Sections
{
    /**
     * @var RepositorySections
     */
    private $repository;

    /**
     * Sections constructor.
     */
    public function __construct()
    {
        $this->repository = new RepositorySections();
    }

    /**
     * @param $params
     * @return array|mixed
     */
    public function getSections($params)
    {
        $result = $this->repository->getSections($params);
        return $result;
    }
}