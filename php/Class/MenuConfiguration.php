<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/MasterSol/php/Repositories/RepositoryMenuConfiguration.php';

class MenuConfiguration
{
    /**
     * @var RepositoryMenuConfiguration
     */
    private $repository;

    /**
     * MenuConfiguration constructor.
     */
    public function __construct()
    {
        $this->repository = new RepositoryMenuConfiguration();
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
}