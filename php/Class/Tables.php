<?php
require_once $_SESSION['dir_folder_php'] . 'Repositories/RepositoryTables.php';

class Tables
{
    private $repository;

    public function __construct()
    {
        $this->repository = new RepositoryTables();
    }

    public function getTablesProperties($params)
    {
        $result = $this->repository->getTablesProperties($params);
        return $result;
    }

    public function getActions()
    {
        $result = $this->repository->getActions();
        return $result;
    }
}