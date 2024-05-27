<?php

defined('BASEPATH') or exit('No direct script access allowed');

class DogPoundModel extends CI_Model
{

    public $table = 'dog_pound';

    public function get()
    {

        $query = $this->db
            ->select('
            d.id,
            b.id address_id,
            b.barangay address,
            d.color,
            d.date,
            d.or_number,
            d.owner_name,
            d.pet_name,
            d.sex,
            d.size')
            ->where('d.address = b.id')
            ->order_by('date(d.date)', 'desc')
            ->get('
                dog_pound d,
                barangay b');

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
            b.barangay address,
            d.color,
            d.date,
            d.or_number,
            d.owner_name,
            d.pet_name,
            d.sex,
            d.size')
            ->where('d.address = b.id')
            ->order_by('date(d.date)', 'desc');

        if (isset($data['start_date']) && !empty($data['start_date'])) {
            $this->db->where('date(date) >=', $data['start_date']);
        }

        if (isset($data['end_date']) && !empty($data['end_date'])) {
            $this->db->where('date(date) <=', $data['end_date']);
        }
        if (isset($data['address']) && !empty($data['address'])) {
            $this->db->where('address', $data['address']);
        }

        $query = $this->db
            ->order_by('date(date)', 'desc')
            ->get('dog_pound d, barangay b');
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




    public function get_gender_by_barangay()
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


            $query = $this->db
                ->select("COUNT(CASE WHEN sex = 'male' AND address ='$row->id' THEN 1 END) as male_count", FALSE)
                ->select("COUNT(CASE WHEN sex = 'female' AND address = '$row->id' THEN 1 END) as female_count", FALSE)
                ->where('date(date) >=', $filterData['start_date'])
                ->where('date(date) <=', $filterData['end_date'])
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




    public function get_total_gender()
    {


        $query = $this->db
            ->select("COUNT(CASE WHEN sex = 'male' THEN 1 END) as male_count", FALSE)
            ->select("COUNT(CASE WHEN sex = 'female' THEN 1 END) as female_count", FALSE)
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
        $query = $this->db
            ->select("COUNT(CASE WHEN sex = 'male'  THEN 1 END) as male_count", FALSE)
            ->select("COUNT(CASE WHEN sex = 'female' THEN 1 END) as female_count", FALSE)
            ->where('date(date) >=', $filterData['start_date'])
            ->where('date(date) <=', $filterData['end_date'])
            ->get($this->table);

        $result = $query->row_array();

        $data = array(
            'male' => number_format($result['male_count']),
            'female' => number_format($result['female_count']),
        );

        return $data;

    }


}

