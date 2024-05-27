<?php

defined('BASEPATH') or exit('No direct script access allowed');

class UserModel extends CI_Model
{

	public $table = 'users';

	public function get()
	{

		$query = $this->db->get($this->table);
		return $query->result();

	}



	public function login($data)
	{
		$this->db->select('*');
		$this->db->from($this->table);
		$this->db->where('username', $data['username']); // Fixed array key
		$query = $this->db->get();
		$result = $query->row();


		if ($result) {
			$providedPassword = md5($data['password']);
			if ($providedPassword == $result->password) {
				return $result;
			}
		}

		return false;

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
