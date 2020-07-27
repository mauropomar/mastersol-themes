<?php
require_once $_SESSION['dir_folder_php'] . 'Repositories/RepositoryTimeEvent.php';


class TimeEvent
{
    private $repository;

    /**
     * TimeEvent constructor.
     */
    public function __construct()
    {
        $this->repository = new RepositoryTimeEvent();
    }

}