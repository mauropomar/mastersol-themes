<?php
require_once $_SESSION['dir_folder_php'] . 'Repositories/RepositoryLanguage.php';


class Language
{
    /**
     * @var RepositoryLanguage
     */
    private $repository;

    /**
     * Language constructor.
     */
    public function __construct()
    {
        $this->repository = new RepositoryLanguage();
    }

    /**
     * @param $params
     * @return string
     */
    public function getLanguages($params)
    {
        $result = $this->repository->getLanguages($params);
        return $result;
    }
}