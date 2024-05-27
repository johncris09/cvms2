<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class AntiRabiesSpecies extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('AntiRabiesSpeciesModel');
		$this->load->helper('crypto_helper');
	}
	public function index_get()
	{
		$model = new AntiRabiesSpeciesModel; 
		$result = $model->get();
		$this->response($result, RestController::HTTP_OK);
	}


	public function find_get($id)
	{

		$model = new AntiRabiesSpeciesModel;
		$CryptoHelper = new CryptoHelper;
		$result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($model->find($id)));
		$this->response($result, RestController::HTTP_OK);

	}


	public function insert_post()
	{

		$model = new AntiRabiesSpeciesModel;

		$requestData = json_decode($this->input->raw_input_stream, true);

		$data = array(
			'name' => $requestData['name'],
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
			], RestController::HTTP_OK);
		}
	}


	public function update_put($id)
	{


		$model = new AntiRabiesSpeciesModel;
		$requestData = json_decode($this->input->raw_input_stream, true);


		$data = array(
			'name' => $requestData['name'],
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
		$model = new AntiRabiesSpeciesModel;
		$result = $model->delete($id);
		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Deleted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to delete species.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}
	public function bulk_delete_delete()
	{

		$model = new AntiRabiesSpeciesModel;
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


}
