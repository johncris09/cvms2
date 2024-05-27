<?php

defined('BASEPATH') or exit('No direct script access allowed');

class AddressModel extends CI_Model
{

    public $table = 'barangay';


    public function get()
    {
        $query = $this->db
            ->order_by('barangay', 'asc')
            ->get($this->table);
        return $query->result();
    }
 

}

