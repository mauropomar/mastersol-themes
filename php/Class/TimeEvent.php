<?php
require_once $_SESSION['dir_folder_php'] . 'Repositories/RepositoryTimeEvent.php';


class TimeEvent
{
    public function __construct($i)
    {
        $this->i = $i;
    }

    public function run()
    {
        while (true) {
            echo $this->i;
            sleep(5);
        }
    }
}

