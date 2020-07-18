<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/MasterSol/php/Repositories/RepositoryMenuConfiguration.php';

class MenuConfiguration
{
    private $repository;

    public function __construct()
    {
        $this->repository = new RepositoryMenuConfiguration();
    }

    public function getMenu($params)
    {
        $result = $this->repository->getMenu($params);
        return $result;

    }
}