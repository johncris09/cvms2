<?php

defined('BASEPATH') or exit('No direct script access allowed');

class PetRegistrationModel extends CI_Model
{

	public $table = 'pet_registration';

	public function get()
	{

		$this->db->select([
			'pet_owner.id AS pet_owner_id',
			'CONCAT(pet_owner.last_name, ", ", pet_owner.first_name, " ", IFNULL(pet_owner.middle_name, ""), " ", IFNULL(pet_owner.suffix, "")) AS owner_full_name',
			'pet_owner.last_name owner_last_name',
			'pet_owner.first_name owner_first_name',
			'pet_owner.middle_name owner_middle_name',
			'pet_owner.suffix owner_suffix',
			'pet_registration.id AS pet_registration_id',
			'pet_registration.pet_name',
			'pet_registration.gender',
			'pet_registration.reproductive_status',
			'pet_registration.breed',
			'pet_registration.or_number',
			'pet_registration.birthdate',
			'pet_registration.species',
			'pet_registration.color',
			'pet_registration.origin',
			'pet_registration.habitat',
			'pet_registration.application_number',
			'pet_registration.application_year',
			'pet_registration.registration_date'
		]);
		$this->db->from('pet_registration');
		$this->db->join('pet_owner', 'pet_registration.pet_owner = pet_owner.id');
		$this->db->order_by('pet_registration.application_number', 'desc');

		$query = $this->db->get();
		return $query->result_array();

	}
	public function get_latest_registration_number()
	{
		$query = $this->db->where('YEAR(registration_date)', date('Y'))->get($this->table);
		return $query->num_rows() + 1; 
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
