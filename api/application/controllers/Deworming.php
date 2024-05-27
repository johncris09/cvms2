<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class Deworming extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('DewormingModel');
		$this->load->helper('crypto_helper');
	}
	public function index_get()
	{
		$model = new DewormingModel;
		$result = $model->get();
		$this->response($result, RestController::HTTP_OK);

	}


	public function find_get($id)
	{

		$model = new DewormingModel;
		$result = $model->find($id);
		$this->response($result, RestController::HTTP_OK);

	}



	public function generate_report_get()
	{

		$model = new DewormingModel;

		$requestData = $this->get();
		$result = $model->generate_report($requestData);
		$this->response($result, RestController::HTTP_OK);

	}



	public function insert_post()
	{

		$model = new DewormingModel;


		$requestData = json_decode($this->input->raw_input_stream, true);

		$data = array(
			'farmer_name' => $requestData['farmer_name'],
			'address' => $requestData['address'],
			'date_deworming' => $requestData['date_deworming'],
			'species' => $requestData['species'],
			'head_number' => $requestData['head_number'],
			'female' => $requestData['female'],
			'male' => $requestData['male'],
			'treatment' => $requestData['treatment'],
			'amount' => $requestData['amount'],
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


		$model = new DewormingModel;
		$requestData = json_decode($this->input->raw_input_stream, true);

		$data = array(
			'farmer_name' => $requestData['farmer_name'],
			'address' => $requestData['address'],
			'date_deworming' => $requestData['date_deworming'],
			'species' => $requestData['species'],
			'head_number' => $requestData['head_number'],
			'female' => $requestData['female'],
			'male' => $requestData['male'],
			'treatment' => $requestData['treatment'],
			'amount' => $requestData['amount'],
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
		$model = new DewormingModel;
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

		$model = new DewormingModel;
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
		$model = new DewormingModel;
		$CryptoHelper = new CryptoHelper;
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
		$model = new DewormingModel;
		$CryptoHelper = new CryptoHelper;
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

		// $result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($result));
		$this->response($result, RestController::HTTP_OK);
	}




	public function get_total_gender_get()
	{
		$model = new DewormingModel;
		$CryptoHelper = new CryptoHelper;
		$data = $model->get_total_gender();

		// $result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($result));
		$this->response($data, RestController::HTTP_OK);
	}




	public function filter_total_gender_post()
	{
		$model = new DewormingModel;
		$CryptoHelper = new CryptoHelper;
		$requestData = json_decode($this->input->raw_input_stream, true);
		$data = $model->filter_total_gender($requestData);

		// $result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($result));
		$this->response($data, RestController::HTTP_OK);
	}


}
