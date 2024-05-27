<?php

defined('BASEPATH') or exit('No direct script access allowed');

class DewormingSpeciesModel extends CI_Model
{

    public $table = 'deworm_species';

    public function get()
    {
        $query = $this->db
            ->order_by('name', 'asc')
            ->get($this->table);
        return $query->result();
    }


    public function find($id)
    {
        $this->db->where('id', $id);
        $query = $this->db->get($this->table);
        return $query->row();
    }

    public function insert($data)
    {
        return $this->db->insert($this->table, $data);
    }


    public function update($id, $data)
    {
        $this->db->where('id', $id);
        return $this->db->update($this->table, $data);
    }

    public function delete($id)
    {
        return $this->db->delete($this->table, ['id' => $id]);
    }

    public function bulk_delete($data)
    {
        $this->db->where_in('id', $data);
        return $this->db->delete($this->table);
    }

}

