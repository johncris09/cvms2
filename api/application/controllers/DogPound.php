<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class DogPound extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('DogPoundModel');
		$this->load->helper('crypto_helper');
	}
	public function index_get()
	{
		$model = new DogPoundModel; 
		$result = $model->get();
		$this->response($result, RestController::HTTP_OK);
	}


	public function find_get($id)
	{

		$model = new DogPoundModel; 
		$result = $model->find($id) ;
		$this->response($result, RestController::HTTP_OK);
	}




	public function generate_report_get()
	{

		$model = new DogPoundModel; 
		$requestData = $this->get();
		$result =  $model->generate_report($requestData) ;
		$this->response($result, RestController::HTTP_OK);

	}


	public function insert_post()
	{

		$model = new DogPoundModel;
		$requestData = json_decode($this->input->raw_input_stream, true);

		$data = array(
			'address' => $requestData['address'],
			'color' => $requestData['color'],
			'date' => $requestData['date'],
			'or_number' => $requestData['or_number'],
			'owner_name' => $requestData['owner_name'],
			'pet_name' => $requestData['pet_name'],
			'sex' => $requestData['sex'],
			'size' => $requestData['size'],
		);

		$result = $model->insert($data);

		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Inserted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to create new data.'
			], RestController::HTTP_BAD_REQUEST);
		}
	}


	public function update_put($id)
	{


		$model = new DogPoundModel;
		$requestData = json_decode($this->input->raw_input_stream, true);

		$data = array(
			'address' => $requestData['address'],
			'color' => $requestData['color'],
			'date' => $requestData['date'],
			'or_number' => $requestData['or_number'],
			'owner_name' => $requestData['owner_name'],
			'pet_name' => $requestData['pet_name'],
			'sex' => $requestData['sex'],
			'size' => $requestData['size'],
		);


		$update_result = $model->update($id, $data);

		if ($update_result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Updated.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to update.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}


	public function delete_delete($id)
	{
		$model = new DogPoundModel;
		$result = $model->delete($id);
		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Deleted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to delete.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}
	public function bulk_delete_delete()
	{

		$model = new DogPoundModel;
		$requestData = json_decode($this->input->raw_input_stream, true);

		// Extract IDs
		// Object to array
		$ids = array_map(function ($item) {
			return $item['id'];
		}, $requestData);

		// Convert IDs to integers
		$ids = array_map('intval', $ids);

		$result = $model->bulk_delete($ids);

		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Deleted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to delete.'
			], RestController::HTTP_BAD_REQUEST);

		}

	}




	public function get_gender_by_barangay_get()
	{
		$model = new DogPoundModel; 
		$data = $model->get_gender_by_barangay();

		// Initialize arrays for labels and datasets
		$labels = array();
		$datasets = array(
			array('label' => 'Male', 'backgroundColor' => '#0dcaf0', 'data' => array()),
			array('label' => 'Female', 'backgroundColor' => '#ffc107', 'data' => array()),
		);

		// Populate labels and datasets
		foreach ($data as $item) {
			$labels[] = $item['address'];
			$datasets[0]['data'][] = $item['male'];
			$datasets[1]['data'][] = $item['female'];
		}

		// Assemble the final result
		$result = array(
			'labels' => $labels,
			'datasets' => $datasets
		);

		// $result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($result));
		$this->response($result, RestController::HTTP_OK);
	}


	public function filter_gender_by_barangay_post()
	{
		$model = new DogPoundModel;
		 

		$requestData = json_decode($this->input->raw_input_stream, true);
		$data = $model->filter_gender_by_barangay($requestData);

		// Initialize arrays for labels and datasets
		$labels = array();
		$datasets = array(
			array('label' => 'Male', 'backgroundColor' => '#0dcaf0', 'data' => array()),
			array('label' => 'Female', 'backgroundColor' => '#ffc107', 'data' => array()),
		);

		// Populate labels and datasets
		foreach ($data as $item) {
			$labels[] = $item['address'];
			$datasets[0]['data'][] = $item['male'];
			$datasets[1]['data'][] = $item['female'];
		}

		// Assemble the final result
		$result = array(
			'labels' => $labels,
			'datasets' => $datasets
		);
 
		$this->response($result, RestController::HTTP_OK);
	}




	public function get_total_gender_get()
	{
		$model = new DogPoundModel; 
		$data = $model->get_total_gender();

		 
		$this->response($data, RestController::HTTP_OK);
	}



	public function filter_total_gender_post()
	{
		$model = new DogPoundModel;
		 

		$requestData = json_decode($this->input->raw_input_stream, true);
		$data = $model->filter_total_gender($requestData);
 
		$this->response($data, RestController::HTTP_OK);
	}
}
