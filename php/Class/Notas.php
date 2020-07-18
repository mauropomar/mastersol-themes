<?php
require_once $_SESSION['dir_folder_php'] . 'Repositories/RepositoryNotas.php';

class Notas
{
    private $repository;

    public function __construct()
    {
        $this->repository = new RepositoryNotas();
    }

    public function insertNote($params)
    {
        $result = $this->repository->insertNote($params);
        return $result;
    }

    public function getNotes($params)
    {
        $result = $this->repository->getNotes($params);
        return $result;
    }

    public function updateNote($params)
    {
        $result = $this->repository->updateNote($params);
        return $result;
    }

    public function deleteNote($params)
    {
        $result = $this->repository->deleteNote($params);
        return $result;
    }
}