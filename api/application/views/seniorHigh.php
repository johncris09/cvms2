<!DOCTYPE html>
<html>

<head>
	<title>Senior High Consolidate</title>
	<link rel="icon" href="../client/build/static/media/logo-sm.f5e7c82333604415c254.png">
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" />
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js">
	</script>
	<style>
		.highlight {
			background-color: #D5F0C1;
			/* Example styling for the highlighted row */
		}
	</style>

</head>

<body>
	<div class="row">
		<?Php
		$CI =& get_instance();
		$CI->load->model('BarangayModel');
		$CI->load->model('SeniorHighSchoolModel');
		$CI->load->model('StrandModel');
		function getFirstLetters($str)
		{
			$words = explode(' ', ucwords($str)); // Capitalize each word and split into an array
			$firstLetters = array_map(function ($word) {
				return substr($word, 0, 1); // Get the first letter of each word
			}, $words);

			return implode('', $firstLetters); // Combine the first letters into a single string
		}
		?>
		<div class="col-6 px-5">
			<h1>Not Checked</h1>
			<table class="table ">
				<tr>
					<th>#</th>
					<th>ID</th>
					<th>
						Reference #
					</th>
					<th>Last Name</th>
					<th>First Name</th>
					<th>Birthdate</th>
					<th>Address</th>
					<th>Action</th>
				</tr>
				<?php
				// echo json_encode($notchecked[0]);
				
				$count = 0;
				foreach ($notchecked as $row) {
					$barangay = $CI->BarangayModel->findByBarangayName($row['AppAddress']);
					$school = $CI->SeniorHighSchoolModel->findByschoolName($row['AppSchool']);
					$strand = $CI->StrandModel->findByStrandDName($row['AppCourse']);
					$reference_number = "S" . $row['AppNoSem'] . '-' . str_replace(["SY: 20", "-20"], "", $row['AppSY']) . '-' . getFirstLetters($row['AppFirstName']) . '' . getFirstLetters($row['AppLastName']) . date('-mdy', strtotime($row['AppDOB']));
					
					 if($row['ID'] === "6806"){
						$reference_number.= '-T'; 
					 }
					?>

					<tr>
						<td>
							<?php echo ++$count; ?>
						</td>
						<td>
							<?php echo $row['ID']; ?>
						</td>
						<td>
							<?php echo $reference_number; ?>
						</td>
						<td>
							<?php echo $row['AppLastName']; ?>
						</td>
						<td>
							<?php echo $row['AppFirstName']; ?>
						</td>
						<td>
							<?php echo $row['AppDOB']; ?>
						</td>
						<td>
							<?php echo $row['AppAddress']; ?>
						</td>
						<td>
							<button class='btn btn-warning btn-sm check-btn' data-row_id='<?php echo $row['ID'] ?>'
								data-reference_number='<?php echo $reference_number ?>'
								data-firstname='<?php echo $row['AppFirstName'] ?>'
								data-lastname='<?php echo $row['AppLastName'] ?>'
								data-lastname='<?php echo $row['AppLastName'] ?>'
								data-middlename='<?php echo $row['AppMidIn'] ?>'
								data-suffix='<?php echo $row['AppSuffix'] ?>' data-address='<?php echo $barangay->id ?>'
								data-birthdate='<?php echo date('Y-m-d', strtotime($row['AppDOB'])) ?>'
								data-civil_status='<?php echo $row['AppCivilStat'] ?>'
								data-sex='<?php echo $row['AppGender'] ?>'
								data-contact_number='<?php echo $row['AppContact'] ?>'
								data-email_address='<?php echo $row['AppEmailAdd'] ?>'
								data-father_name='<?php echo $row['AppFather'] ?>'
								data-father_occupation='<?php echo $row['AppFatherOccu'] ?>'
								data-mother_name='<?php echo $row['AppMother'] ?>'
								data-mother_occupation='<?php echo $row['AppMotherOccu'] ?>'
								data-app_year_number='<?php echo $row['AppNoYear'] ?>'
								data-app_id_number='<?php echo $row['AppNoID'] ?>'
								data-app_sem_number='<?php echo $row['AppNoSem'] ?>' data-ctc='<?php echo $row['AppCTC'] ?>'
								data-availment='<?php echo $row['AppAvailment'] ?>' data-school='<?php echo $school->id ?>'
								data-strand='<?php echo $strand->id ?>' data-grade_level='<?php echo $row['AppYear'] ?>'
								data-semester='<?php echo $row['AppSem'] ?>' data-school_year='<?php echo $row['AppSY'] ?>'
								data-app_status='<?php echo $row['AppStatus'] ?>'>Checked</button>
						</td>

					</tr>

					<?php
				}


				?>
			</table>
		</div>
		<div class="col-6">

			<h1>New record search by lastname</h1>

			<?php
			foreach ($newrecord as $row) {

				// echo sizeof($row);
				if (sizeof($row) === 1) {
					echo "<br />";
					?>
					<table class="table rightTable">

						<thead>
							<tr>
								<th>
									ID
								</th>
								<th>
									Reference #
								</th>
								<th>
									Lastname
								</th>
								<th>
									Firstname
								</th>
								<th>
									Birthdate
								</th>

							</tr>
						</thead>


						<tr>
							<td>
								<?php echo $row[0]->id; ?>
							</td>
							<td>
								<?php echo $row[0]->reference_number; ?>
							</td>
							<td>
								<?php echo $row[0]->lastname; ?>
							</td>
							<td>
								<?php echo $row[0]->firstname; ?>
							</td>
							<td>
								<?php echo $row[0]->birthdate; ?>
							</td>

						</tr>
					</table>
					<?php

				} else if (sizeof($row) > 1) {
					echo "<br />"; ?>
						<table class="table rightTable">
							<thead>
								<tr>
									<th>
										ID
									</th>
									<th>
										Reference #
									</th>
									<th>
										Lastname
									</th>
									<th>
										Firstname
									</th>
									<th>
										Birthdate
									</th>

								</tr>
							</thead>
							<?php
							foreach ($row as $subRow) { ?>

								<tr>
									<td>
									<?php echo $subRow->id; ?>
									</td>
									<td>
									<?php echo $subRow->reference_number; ?>
									</td>
									<td>
									<?php echo $subRow->lastname; ?>
									</td>
									<td>
									<?php echo $subRow->firstname; ?>
									</td>
									<td>
									<?php echo $subRow->birthdate; ?>
									</td>

								</tr>

						<?php } ?>

						</table>
					<?php
				}
				// if (sizeof($row) > 0) {
			
				// 	echo json_encode($row[2]->reference_number);
				// }
			}
			?>

		</div>

		<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>

		<script>
			$(document).ready(function () {
				$(document).on('click', '.check-btn', function () {

					let data = $(this).data()

					$.ajax({
						url: 'consolidate_senior_high',
						method: 'POST',
						data: data,
						success: function (response) {
							console.info(response)
							// if (response) {
							// 	window.location.reload()
							// }
						},
						error: function (xhr, status, error) {
							// Handle errors
							console.error('AJAX error:', status, error);
						}
					});
					$('.rightTable').each(function () {
						var $table = $(this);
						var hideTable = false;
						$table.find('tr').each(function () {

							var cellValue = $(this).find('td:eq(2)').text().trim().toLowerCase();  // Get the text of the second cell

							if (cellValue === data.lastname.toLowerCase()) {  // Check if the cell value matches the target value
								hideTable = true;
								return false; // Break out of the loop if a match is found in this table
							}
						});
						if (hideTable) {
							$table.hide(); // Hide the entire table
						}
					});
					$(this).removeClass('btn-warning').addClass('btn-success').text('Success');
					var $row = $(this).closest('tr');

					// Add a class to the parent row
					$row.addClass('highlight');

				});
			});
		</script>

</body>

</html>