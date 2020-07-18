<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/MasterSol/php/Repositories/RepositoryMenuOption.php';

class MenuOption
{
    private $repository;

    public function __construct()
    {
        $this->repository = new RepositoryMenuOption();
    }

    public function getMenu($params)
    {
        $result = $this->repository->getMenu($params);
        return $result;
    }

    public function getFilterMenu($params)
    {
        $result = $this->repository->getFilterMenu($params);
        return $result;
    }
}