<?php

defined('BASEPATH') or exit('No direct script access allowed');

class AntiRabiesVaccinationModel extends CI_Model
{

    public $table = 'anti_rabies_vaccination';

    public function get()
    {

        $query = $this->db
            ->select('
            a.id,
            b.id address_id,
            b.barangay address,
            a.color,
            a.date_vaccinated,
            a.pet_name,
            a.neutered,
            a.owner_name,
            date(a.pet_birthdate) pet_birthdate,
            s.id species_id,
            s.name species,
            a.sex,
            a.vaccine_type')
            ->where('a.address = b.id')
            ->where('a.species = s.id')
            ->order_by('date(a.date_vaccinated)', 'desc')
            ->get('
            anti_rabies_vaccination a,
            barangay b,
            anti_rabies_species s');

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
            a.id,
            b.barangay address,
            a.color,
            a.date_vaccinated,
            a.pet_name,
            a.neutered,
            a.owner_name,
            date(a.pet_birthdate) pet_birthdate,
            s.name species,
            a.sex,
            a.vaccine_type')
            ->where('a.address = b.id')
            ->where('a.species = s.id');

        if (isset($data['start_date']) && !empty($data['start_date'])) {
            $this->db->where('date(date_vaccinated) >=', $data['start_date']);
        } 

        if (isset($data['end_date']) && !empty($data['end_date'])) {
            $this->db->where('date(date_vaccinated) <=', $data['end_date']);
        }
        if (isset($data['address']) && !empty($data['address'])) {
            $this->db->where('address', $data['address']);
        }
          
        if (isset($data['species']) && !empty($data['species'])) {
            $this->db->where('species', $data['species']);
        }
        if (isset($data['neutered']) && !empty($data['neutered'])) {
            $this->db->where('neutered', $data['neutered']);
        } 

        $query = $this->db  
        ->order_by('(date_vaccinated)','desc')->get('
        anti_rabies_vaccination a,
        barangay b,
        anti_rabies_species s');
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


    // 3 = dog
    public function get_gender_by_barangay($defaultSpecies = 3)
    {

        $query = $this->db
            ->order_by('barangay', 'asc')
            ->get('barangay');


        $data = array();
        $address = $query->result();
        foreach ($address as $row) {


            $query = $this->db
                ->select("COUNT(CASE WHEN sex = 'male' AND address ='$row->id' THEN 1 END) as male_count", FALSE)
                ->select("COUNT(CASE WHEN sex = 'female' AND address = '$row->id' THEN 1 END) as female_count", FALSE)
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
                ->select("COUNT(CASE WHEN sex = 'male' AND address ='$row->id' THEN 1 END) as male_count", FALSE)
                ->select("COUNT(CASE WHEN sex = 'female' AND address = '$row->id' THEN 1 END) as female_count", FALSE)
                ->where('species', $filterData['species'])
                ->where('date(date_vaccinated) >=', $filterData['start_date'])
                ->where('date(date_vaccinated) <=', $filterData['end_date']);

            if (!empty($filterData['neutered'])) {
                $this->db->where('neutered', $filterData['neutered']);
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




    // 3 = dog
    public function get_total_gender($defaultSpecies = 3)
    {


        $query = $this->db
            ->select("COUNT(CASE WHEN sex = 'male'   THEN 1 END) as male_count", FALSE)
            ->select("COUNT(CASE WHEN sex = 'female'   THEN 1 END) as female_count", FALSE)
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
            ->select("COUNT(CASE WHEN sex = 'male'  THEN 1 END) as male_count", FALSE)
            ->select("COUNT(CASE WHEN sex = 'female'  THEN 1 END) as female_count", FALSE)
            ->where('species', $filterData['species'])
            ->where('date(date_vaccinated) >=', $filterData['start_date'])
            ->where('date(date_vaccinated) <=', $filterData['end_date']);

        if (!empty($filterData['neutered'])) {
            $this->db->where('neutered', $filterData['neutered']);
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

