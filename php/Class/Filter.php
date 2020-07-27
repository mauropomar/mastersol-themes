<?php
require_once $_SESSION['dir_folder_php'] . 'Repositories/RepositoryFilter.php';

class Filter
{
    /**
     * @var RepositoryFilter
     */
    private $repository;

    /**
     * Filter constructor.
     */
    public function __construct()
    {
        $this->repository = new RepositoryFilter();
    }

    /**
     * @param $params
     * @return string
     */
    public function getFiltersOperators($params)
    {
        return $this->repository->getFiltersOperators($params);
    }

    /**
     * @param $params
     * @return string
     */
    public function getFunctionsResume($params)
    {
        return $this->repository->getFunctionsResume($params);
    }

    /**
     * @param $params
     * @return array
     */
    public function getResultFiltersOperators($params)
    {
        return $this->repository->getResultFiltersOperators($params);
    }

    /**
     * @param $params
     * @return array
     * @throws Exception
     */
    public function getResultFiltersFunctions($params)
    {
        return $this->repository->getResultFiltersFunctions($params);
    }
}