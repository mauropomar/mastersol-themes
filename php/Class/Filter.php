<?php
require_once $_SESSION['dir_folder_php'] . 'Repositories/RepositoryFilter.php';

class Filter
{
    private $repository;

    public function __construct()
    {
        $this->repository = new RepositoryFilter();
    }

    public function getFiltersOperators($params)
    {
        return $this->repository->getFiltersOperators($params);
    }

    public function getFunctionsResume($params)
    {
        return $this->repository->getFunctionsResume($params);
    }

    public function getResultFiltersOperators($params)
    {
        return $this->repository->getResultFiltersOperators($params);
    }

    public function getResultFiltersFunctions($params)
    {
        return $this->repository->getResultFiltersFunctions($params);
    }
}