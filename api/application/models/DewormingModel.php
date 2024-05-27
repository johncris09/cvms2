<?php

defined('BASEPATH') or exit('No direct script access allowed');

class DewormingModel extends CI_Model
{

	public $table = 'deworming';

	public function get()
	{

		$query = $this->db
			->select('
            d.id, 
            b.id as address_id ,
            b.barangay as address ,
            d.amount ,
            d.date_deworming, 
            d.farmer_name, 
            d.female,
            d.head_number,
            d.male,
            s.id as species_id,
            s.name as species,
            d.timestamp,
            m.id as treatment_id,
            m.medication as treatment')
			->where('d.address  = b.id')
			->where('d.species = s.id')
			->where('d.treatment = m.id')
			->order_by('date(d.date_deworming)', 'desc')
			->get('
                deworming d, 
                barangay b, 
                deworm_species s, 
                medication as m');

		return $query->result();

	}


	public function find($id)
	{
		$this->db->where('id', $id);
		$query = $this->db->get($this->table);
		return $query->row();
	}


	public function generate_report($data)
	{


		$this->db
			->select('
        d.id, 
        b.barangay as address ,
        d.amount ,
        d.date_deworming, 
        d.farmer_name, 
        d.female,
        d.head_number,
        d.male,
        s.name as species,
        d.timestamp,
        m.medication as treatment')
			->where('d.address  = b.id')
			->where('d.species = s.id')
			->where('d.treatment = m.id');

		if (isset($data['start_date']) && !empty($data['start_date'])) {
			$this->db->where('date(date_deworming) >=', $data['start_date']);
		}

		if (isset($data['end_date']) && !empty($data['end_date'])) {
			$this->db->where('date(date_deworming) <=', $data['end_date']);
		}
		if (isset($data['address']) && !empty($data['address'])) {
			$this->db->where('address', $data['address']);
		}

		if (isset($data['species']) && !empty($data['species'])) {
			$this->db->where('species', $data['species']);
		}

		$query = $this->db
			->order_by('date(date_deworming)', 'desc')
			->get('deworming d, 
        barangay b, 
        deworm_species s, 
        medication as m');
		return $query->result();
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




	// 1 = Carabao
	public function get_gender_by_barangay($defaultSpecies = 1)
	{

		$query = $this->db
			->order_by('barangay', 'asc')
			->get('barangay');


		$data = array();
		$address = $query->result();
		foreach ($address as $row) {


			$query = $this->db
				->select("COUNT(male) as male_count", FALSE)
				->select("COUNT(female) as female_count", FALSE)
				->where('address', $row->id)
				->where('species', $defaultSpecies)
				->get($this->table);

			$result = $query->row_array();

			$data[] = array(
				'address' => $row->barangay,
				'male' => number_format($result['male_count']),
				'female' => number_format($result['female_count']),
			);

		}

		return $data;

	}



	public function filter_gender_by_barangay($filterData)
	{

		$query = $this->db
			->order_by('barangay', 'asc')
			->get('barangay');


		$data = array();
		$address = $query->result();
		foreach ($address as $row) {

			$this->db
				->select("COUNT(male) as male_count", FALSE)
				->select("COUNT(female) as female_count", FALSE)
				->where('address', $row->id)
				->where('species', $filterData['species'])
				->where('date(date_deworming) >=', $filterData['start_date'])
				->where('date(date_deworming) <=', $filterData['end_date']);


			if (!empty($filterData['treatment'])) {
				$this->db->where('treatment', $filterData['treatment']);
			}

			$query = $this->db->get($this->table);

			$result = $query->row_array();

			$data[] = array(
				'address' => $row->barangay,
				'male' => number_format($result['male_count']),
				'female' => number_format($result['female_count']),
			);

		}

		return $data;

	}





	// 1 = Carabao
	public function get_total_gender($defaultSpecies = 1)
	{


		$query = $this->db
			->select("COUNT(male) as male_count", FALSE)
			->select("COUNT(female) as female_count", FALSE)
			->where('species', $defaultSpecies)
			->get($this->table);

		$result = $query->row_array();

		$data = array(
			'male' => number_format($result['male_count']),
			'female' => number_format($result['female_count']),
		);

		return $data;

	}




	public function filter_total_gender($filterData)
	{

		$this->db
			->select("COUNT(male) as male_count", FALSE)
			->select("COUNT(female) as female_count", FALSE)
			->where('species', $filterData['species'])
			->where('date(date_deworming) >=', $filterData['start_date'])
			->where('date(date_deworming) <=', $filterData['end_date']);


		if (!empty($filterData['treatment'])) {
			$this->db->where('treatment', $filterData['treatment']);
		}

		$query = $this->db->get($this->table);

		$result = $query->row_array();

		$data = array(
			'male' => number_format($result['male_count']),
			'female' => number_format($result['female_count']),
		);

		return $data;

	}



}

