<?php
require_once $_SESSION['dir_folder_php'] . 'Repositories/RepositoryShortcut.php';

class Shortcut
{
    /**
     * @var RepositoryShortcut
     */
    private $repository;

    /**
     * Shortcut constructor.
     */
    public function __construct()
    {
        $this->repository = new RepositoryShortcut();
    }

    /**
     * @return string
     */
    public function getShortcut()
    {
        $result = $this->repository->getShortcuts();
        return $result;
    }

    /**
     * @param $params
     * @return array
     */
    public function deleteShortcut($params)
    {
        $result = $this->repository->deleteShortcut($params);
        return $result;
    }

}