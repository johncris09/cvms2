<?php

defined('BASEPATH') or exit('No direct script access allowed');

class PetOwnerModel extends CI_Model
{

	public $table = 'pet_owner';

	public function get()
	{

		$query = $this->db
			->order_by('last_name', 'asc')
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


}
