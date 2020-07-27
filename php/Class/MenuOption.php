<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/MasterSol/php/Repositories/RepositoryMenuOption.php';

class MenuOption
{
    /**
     * @var RepositoryMenuOption
     */
    private $repository;

    /**
     * MenuOption constructor.
     */
    public function __construct()
    {
        $this->repository = new RepositoryMenuOption();
    }

    /**
     * @param $params
     * @return string
     */
    public function getMenu($params)
    {
        $result = $this->repository->getMenu($params);
        return $result;
    }

    /**
     * @param $params
     * @return string
     */
    public function getFilterMenu($params)
    {
        $result = $this->repository->getFilterMenu($params);
        return $result;
    }
}