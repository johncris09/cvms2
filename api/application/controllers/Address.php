<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class Address extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('AddressModel');
	}
	public function index_get()
	{
		$model = new AddressModel;
		$result = $model->get();
		$this->response($result, RestController::HTTP_OK);
	}

}
