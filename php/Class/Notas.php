<?php
require_once $_SESSION['dir_folder_php'] . 'Repositories/RepositoryNotas.php';

class Notas
{
    /**
     * @var RepositoryNotas
     */
    private $repository;

    /**
     * Notas constructor.
     */
    public function __construct()
    {
        $this->repository = new RepositoryNotas();
    }

    /**
     * @param $params
     * @return array
     */
    public function insertNote($params)
    {
        $result = $this->repository->insertNote($params);
        return $result;
    }

    /**
     * @param $params
     * @return array|string
     */
    public function getNotes($params)
    {
        $result = $this->repository->getNotes($params);
        return $result;
    }

    /**
     * @param $params
     * @return array
     */
    public function updateNote($params)
    {
        $result = $this->repository->updateNote($params);
        return $result;
    }

    /**
     * @param $params
     * @return array
     */
    public function deleteNote($params)
    {
        $result = $this->repository->deleteNote($params);
        return $result;
    }
}