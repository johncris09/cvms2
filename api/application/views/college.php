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
		$CI->load->model('CollegeSchoolModel');
		$CI->load->model('CourseModel');
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
				
				$count = 0;
				foreach ($notchecked as $row) {

					// echo json_encode($row);
					$barangay = $CI->BarangayModel->findByBarangayName($row['colAddress']);
					$school = $CI->CollegeSchoolModel->findByschoolName($row['colSchool']);
					$course = $CI->CourseModel->findByCourseName($row['colCourse']);
					$reference_number = "S" . $row['colAppNoSem'] . '-' . str_replace(["SY: 20", "-20"], "", $row['colSY']) . '-' . getFirstLetters($row['colFirstName']) . '' . getFirstLetters($row['colLastName']) . date('-mdy', strtotime($row['colDOB']));


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
							<?php echo $row['colLastName']; ?>
						</td>
						<td>
							<?php echo $row['colFirstName']; ?>
						</td>
						<td>
							<?php echo $row['colDOB']; ?>
						</td>
						<td>
							<?php echo $row['colAddress']; ?>
						</td>
						<td>
							<button class='btn btn-warning btn-sm check-btn' data-row_id='<?php echo $row['ID'] ?>'
								data-reference_number='<?php echo $reference_number ?>'
								data-firstname='<?php echo $row['colFirstName'] ?>'
								data-lastname='<?php echo $row['colLastName'] ?>'
								data-lastname='<?php echo $row['colLastName'] ?>'
								data-middlename='<?php echo $row['colMI'] ?>' data-suffix='<?php echo $row['colSuffix'] ?>'
								data-address='<?php echo $barangay->id ?>'
								data-birthdate='<?php echo date('Y-m-d', strtotime($row['colDOB'])) ?>'
								data-civil_status='<?php echo $row['colCivilStat'] ?>'
								data-sex='<?php echo $row['colGender'] ?>'
								data-contact_number='<?php echo $row['colContactNo'] ?>'
								data-email_address='<?php echo $row['colEmailAdd'] ?>'
								data-father_name='<?php echo $row['colFathersName'] ?>'
								data-father_occupation='<?php echo $row['colFatherOccu'] ?>'
								data-mother_name='<?php echo $row['colMothersName'] ?>'
								data-mother_occupation='<?php echo $row['colMotherOccu'] ?>'
								data-app_year_number='<?php echo $row['colAppNoYear'] ?>'
								data-app_id_number='<?php echo $row['colAppNoID'] ?>'
								data-app_sem_number='<?php echo $row['colAppNoSem'] ?>'
								data-ctc='<?php echo $row['colCTC'] ?>' 
								data-availment='<?php echo $row['colAvailment'] ?>'
								data-school='<?php echo $school->id ?>' 
								data-course='<?php echo $course->id ?>'
								data-unit='<?php echo $row['colUnits'] ?>'
								data-year_level='<?php echo $row['colYearLevel'] ?>'
								data-semester='<?php echo $row['colSem'] ?>' data-school_year='<?php echo $row['colSY'] ?>'
								data-app_status='<?php echo $row['colAppStat'] ?>'>Checked</button>
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
			}
			?>

		</div>

		<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>

		<script>
			$(document).ready(function () {
				$(document).on('click', '.check-btn', function () {

					let data = $(this).data()


					$.ajax({
						url: 'consolidate_college',
						method: 'POST',
						data: data,
						success: function (response) {
							console.info(response)

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