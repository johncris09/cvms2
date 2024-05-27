<?php
defined('BASEPATH') or exit('No direct script access allowed');
 
$route['default_controller'] = 'welcome';
$route['404_override'] = '';
$route['translate_uri_dashes'] = FALSE;
$route['api/demo'] = 'api/ApiDemoController/index';


$route['login'] = 'User/login';


// address 
$route['address'] = 'Address/index';


// User
$route['user'] = 'User/index';
// $route['user/get_gender_by_barangay'] = 'User/get_gender_by_barangay';
// $route['user/filter_gender_by_barangay'] = 'User/filter_gender_by_barangay';
// $route['user/get_total_gender'] = 'User/get_total_gender';
// $route['user/filter_total_gender'] = 'User/filter_total_gender';
// $route['user/insert'] = 'User/insert';
$route['user/find/(:any)'] = 'User/find/$1';
$route['user/update/(:any)'] = 'User/update/$1';
$route['user/change_password/(:any)'] = 'User/change_password/$1';
$route['user/delete/(:any)'] = 'User/delete/$1';
// $route['user/bulk_delete'] = 'User/bulk_delete';


// Dog Pound 
$route['dog_pound'] = 'DogPound/index';
$route['dog_pound/get_gender_by_barangay'] = 'DogPound/get_gender_by_barangay';
$route['dog_pound/filter_gender_by_barangay'] = 'DogPound/filter_gender_by_barangay';
$route['dog_pound/get_total_gender'] = 'DogPound/get_total_gender';
$route['dog_pound/filter_total_gender'] = 'DogPound/filter_total_gender';
$route['dog_pound/insert'] = 'DogPound/insert';
$route['dog_pound/find/(:any)'] = 'DogPound/find/$1';
$route['dog_pound/update/(:any)'] = 'DogPound/update/$1';
$route['dog_pound/delete/(:any)'] = 'DogPound/delete/$1';
$route['dog_pound/bulk_delete'] = 'DogPound/bulk_delete';
$route['dog_pound/generate_report'] = 'DogPound/generate_report';

// AntiRabiesVaccination 
$route['anti_rabies_vaccination'] = 'AntiRabiesVaccination/index';
$route['anti_rabies_vaccination/get_gender_by_barangay'] = 'AntiRabiesVaccination/get_gender_by_barangay';
$route['anti_rabies_vaccination/filter_gender_by_barangay'] = 'AntiRabiesVaccination/filter_gender_by_barangay';
$route['anti_rabies_vaccination/get_total_gender'] = 'AntiRabiesVaccination/get_total_gender';
$route['anti_rabies_vaccination/filter_total_gender'] = 'AntiRabiesVaccination/filter_total_gender';
$route['anti_rabies_vaccination/insert'] = 'AntiRabiesVaccination/insert';
$route['anti_rabies_vaccination/find/(:any)'] = 'AntiRabiesVaccination/find/$1';
$route['anti_rabies_vaccination/update/(:any)'] = 'AntiRabiesVaccination/update/$1';
$route['anti_rabies_vaccination/delete/(:any)'] = 'AntiRabiesVaccination/delete/$1';
$route['anti_rabies_vaccination/bulk_delete'] = 'AntiRabiesVaccination/bulk_delete';
$route['anti_rabies_vaccination/generate_report'] = 'AntiRabiesVaccination/generate_report';
// Deworming 
$route['deworming'] = 'Deworming/index';
$route['deworming/get_gender_by_barangay'] = 'Deworming/get_gender_by_barangay';
$route['deworming/filter_gender_by_barangay'] = 'Deworming/filter_gender_by_barangay';
$route['deworming/get_total_gender'] = 'Deworming/get_total_gender';
$route['deworming/filter_total_gender'] = 'Deworming/filter_total_gender';
$route['deworming/insert'] = 'Deworming/insert';
$route['deworming/find/(:any)'] = 'Deworming/find/$1';
$route['deworming/update/(:any)'] = 'Deworming/update/$1';
$route['deworming/delete/(:any)'] = 'Deworming/delete/$1';
$route['deworming/bulk_delete'] = 'Deworming/bulk_delete';
$route['deworming/generate_report'] = 'Deworming/generate_report';

// Deworming Species
$route['deworming_species'] = 'DewormingSpecies/index';
$route['deworming_species/insert'] = 'DewormingSpecies/insert';
$route['deworming_species/find/(:any)'] = 'DewormingSpecies/find/$1';
$route['deworming_species/update/(:any)'] = 'DewormingSpecies/update/$1';
$route['deworming_species/delete/(:any)'] = 'DewormingSpecies/delete/$1';
$route['deworming_species/bulk_delete'] = 'DewormingSpecies/bulk_delete';





// Medication
$route['medication'] = 'Medication/index';
$route['medication/insert'] = 'Medication/insert';
$route['medication/find/(:any)'] = 'Medication/find/$1';
$route['medication/update/(:any)'] = 'Medication/update/$1';
$route['medication/delete/(:any)'] = 'Medication/delete/$1';

 
// Anti Rabies Species
$route['anti_rabies_species'] = 'AntiRabiesSpecies/index';
$route['anti_rabies_species/insert'] = 'AntiRabiesSpecies/insert';
$route['anti_rabies_species/find/(:any)'] = 'AntiRabiesSpecies/find/$1';
$route['anti_rabies_species/update/(:any)'] = 'AntiRabiesSpecies/update/$1';
$route['anti_rabies_species/delete/(:any)'] = 'AntiRabiesSpecies/delete/$1';
$route['anti_rabies_species/bulk_delete'] = 'AntiRabiesSpecies/bulk_delete';
