<?php
require_once $_SESSION['dir_folder_php'] . 'Repositories/RepositoryShortcut.php';

class Shortcut
{
    private $repository;

    public function __construct()
    {
        $this->repository = new RepositoryShortcut();
    }

    public function getShortcut()
    {
        $result = $this->repository->getShortcuts();
        return $result;
    }

    public function deleteShortcut($params)
    {
        $result = $this->repository->deleteShortcut($params);
        return $result;
    }

}