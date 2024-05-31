<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class Medication extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('MedicationModel');
	}
	public function index_get()
	{
		$model = new MedicationModel;
		$result = $model->get();
		$this->response($result, RestController::HTTP_OK);
	}


	public function insert_post()
	{

		$model = new MedicationModel;
		$requestData = json_decode($this->input->raw_input_stream, true);

		$data = array(
			'medication' => $requestData['medication'],
		);
		$result = $model->insert($data);

		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Inserted'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to create medication.'
			], RestController::HTTP_BAD_REQUEST);

		}


	}



	public function find_get($id)
	{
		$model = new MedicationModel;
		$result = $model->find($id);

		$this->response($result, RestController::HTTP_OK);

	}

	public function update_put($id)
	{


		$model = new MedicationModel;

		$requestData = json_decode($this->input->raw_input_stream, true);

		$data = array(
			'medication' => $requestData['medication'],

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
				'message' => 'Failed to update medication.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}


	public function delete_delete($id)
	{
		$model = new MedicationModel;
		$result = $model->delete($id);
		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Deleted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to delete medication.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}


}
