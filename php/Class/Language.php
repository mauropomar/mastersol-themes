<?php
require_once $_SESSION['dir_folder_php'] .'Repositories/RepositoryLanguage.php';

class Language
{
    private $repository;

    public function __construct()
    {
        $this->repository = new RepositoryLanguage();
    }

    public function getLanguages($params)
    {
        $result = $this->repository->getLanguages($params);
        return $result;
    }
}