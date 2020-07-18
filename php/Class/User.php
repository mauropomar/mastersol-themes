<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/MasterSol/php/Repositories/RepositoryUser.php';

class User
{
    private $repository;
    private $password;
    private $usuario;

    public function __construct()
    {
        $this->repository = new RepositoryUser();
    }

    public function funcValidatingLogin($params)
    {
        if (!$this->validatingVariables($params[':user']) || !$this->validatingVariables($params[':passw'])) {
            return [];
        } else {
            return $this->repository->validatingLogin($params);
        }
    }

    private function validatingVariables($variable)
    {
        if (!isset($variable) && empty($variable)) {
            return false;
        } else {
            return true;
        }
    }

    public function managerUserOption($params)
    {
        return $this->repository->managerUserOption($params);
    }

    public function getUsers($params)
    {
        return $this->repository->getUsers($params);
    }

}

