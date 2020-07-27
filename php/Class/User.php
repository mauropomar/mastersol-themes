<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/MasterSol/php/Repositories/RepositoryUser.php';

class User
{
    /**
     * @var RepositoryUser
     */
    private $repository;

    /**
     * User constructor.
     */
    public function __construct()
    {
        $this->repository = new RepositoryUser();
    }

    /**
     * @param $params
     * @return array|null
     */
    public function funcValidatingLogin($params)
    {
        if (!$this->validatingVariables($params[':user']) || !$this->validatingVariables($params[':passw'])) {
            return [];
        } else {
            return $this->repository->validatingLogin($params);
        }
    }

    /**
     * @param $variable
     * @return bool
     */
    private function validatingVariables($variable)
    {
        if (!isset($variable) && empty($variable)) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * @param $params
     * @return array
     */
    public function managerUserOption($params)
    {
        return $this->repository->managerUserOption($params);
    }

    /**
     * @param $params
     * @return string
     */
    public function getUsers($params)
    {
        return $this->repository->getUsers($params);
    }

}

