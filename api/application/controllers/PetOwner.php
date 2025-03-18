<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/CreatorJwt.php';
require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class PetOwner extends RestController
{

  function __construct()
  {
    // Construct the parent class
    parent::__construct();
    $this->objOfJwt = new CreatorJwt();
    $this->load->model('PetOwnerModel');
    $this->load->helper('crypto_helper');
  }


  public function index_get()
  {
    $petOwnerModel = new PetOwnerModel; 
    $result =$petOwnerModel->get();
    $this->response($result, RestController::HTTP_OK);
  }
  

  public function insert_post()
  {

    $petOwnerModel = new PetOwnerModel;
    $requestData = json_decode($this->input->raw_input_stream, true);

    $data = array(
      'last_name' => $requestData['last_name'],
      'first_name' => $requestData['first_name'],
      'middle_name' => $requestData['middle_name'],
      'suffix' => $requestData['suffix'],
      'birthdate' => $requestData['birthdate'],
      'gender' => $requestData['gender'],
      'contact_number' => $requestData['contact_number'],
      'email' => $requestData['email'],
      'address' => $requestData['address'],
    );
    $result = $petOwnerModel->insert($data);

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


    $petOwnerModel = new PetOwnerModel;
    $requestData = json_decode($this->input->raw_input_stream, true);

    $data = array(
      'last_name' => $requestData['last_name'],
      'first_name' => $requestData['first_name'],
      'middle_name' => $requestData['middle_name'],
      'suffix' => $requestData['suffix'],
      'birthdate' => $requestData['birthdate'],
      'gender' => $requestData['gender'],
      'contact_number' => $requestData['contact_number'],
      'email' => $requestData['email'],
      'address' => $requestData['address'],
    );


    $update_result = $petOwnerModel->update($id, $data);

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
    $petOwnerModel = new PetOwnerModel;
    $result = $petOwnerModel->delete($id);
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
