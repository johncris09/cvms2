<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/CreatorJwt.php';
require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class PetRegistration extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->objOfJwt = new CreatorJwt();
		$this->load->model('PetRegistrationModel');
		$this->load->model('PetOwnerModel');
		$this->load->helper('crypto_helper');
	}


	public function index_get()
	{
		$petRegistrationModel = new PetRegistrationModel;
		$result = $petRegistrationModel->get();
		$this->response($result, RestController::HTTP_OK);
	}
	public function get_latest_registration_number_get()
	{
		$petRegistrationModel = new PetRegistrationModel;
		$result = $petRegistrationModel->get_latest_registration_number();
		$formatted_number = sprintf('%05d', $result);
		$this->response($formatted_number, RestController::HTTP_OK);
	}

	

	public function insert_post()
	{

		$petRegistrationModel = new PetRegistrationModel;
		$requestData = json_decode($this->input->raw_input_stream, true);
		
		$data = array(
			'application_number' => $petRegistrationModel->get_latest_registration_number(),
			'application_year' => date('Y'),
			'registration_date' => $requestData['registration_date'],
			'or_number' => $requestData['or_number'],
			'gender' => $requestData['gender'],
			'reproductive_status' => $requestData['reproductive_status'],
			'breed' => $requestData['breed'],
			'birthdate' => $requestData['birthdate'],
			'species' => $requestData['species'],
			'color' => $requestData['color'],
			'pet_owner' => $requestData['pet_owner'],
			'pet_name' => $requestData['pet_name'],
			'habitat' => implode(', ', $requestData['habitat']),
			'origin' => $requestData['pet_origin_text'],
		);
		$result = $petRegistrationModel->insert($data);
	
		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Inserted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to create new user.'
			], RestController::HTTP_OK);
		}
	}


	public function update_put($id)
	{


		$petRegistrationModel = new PetRegistrationModel;
		$requestData = json_decode($this->input->raw_input_stream, true);

		$data = array(
			'registration_date' => $requestData['registration_date'],
			'or_number' => $requestData['or_number'],
			'gender' => $requestData['gender'],
			'reproductive_status' => $requestData['reproductive_status'],
			'breed' => $requestData['breed'],
			'birthdate' => $requestData['birthdate'],
			'species' => $requestData['species'],
			'color' => $requestData['color'],
			'pet_owner' => $requestData['pet_owner'],
			'pet_name' => $requestData['pet_name'],
			'habitat' => implode(', ', $requestData['habitat']),
			'origin' => $requestData['pet_origin_text'],
		);


		$update_result = $petRegistrationModel->update($id, $data);

		if ($update_result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Updated.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to update.'
			], RestController::HTTP_OK);

		}
	}


	public function delete_delete($id)
	{
		$petRegistrationModel = new PetRegistrationModel;
		$result = $petRegistrationModel->delete($id);
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
