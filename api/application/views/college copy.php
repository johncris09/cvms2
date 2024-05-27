<!DOCTYPE html>
<html>

<head>
	<title>College</title>
	<link rel="icon" href="../client/build/static/media/logo-sm.f5e7c82333604415c254.png">
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" />
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js">
	</script>

</head>

<body>
	<div class="container">
		<?php
		$CI =& get_instance();
		$CI->load->model('ScholarModel');

		foreach ($record as $a) {
			$result = $CI->ScholarModel->getAllCollege($a->id);
			if (!empty($result)) {
				echo "
                   <table class='table  table-sm table-bordered table-striped'>
                   <tr>
                    <td><h4>$a->id</h4></td>
                    <td colspan='5'><h4>$a->lastname $a->firstname $a->middlename</h4></td>
                   
                   </tr>
                       <tr> 
					   		<th>id</th>
                           <th>school</th>
                           <th>course</th> 
                           <th>action</th> 
   
                       </tr>
                       ";
				foreach ($result as $row) {
					$data[] = $row;

					echo "
					<tr>
					<td>$row->id</td>
					<td>
						<input 
							style='width: 100%'
							value='$row->school'
							name='school_$row->id'  
						/>
					</td>
					<td>
						<input 
							style='width: 100%'
							value='$row->course'
							name='course_$row->id' 
						/>
					</td> 
					<td>
						<button class='btn btn-warning btn-sm edit-btn' data-row-id='$row->id'>Edit</button>
					</td>
				</tr>
					";

				}
				echo "
					</table>
					<br />
					<br />
					<br />
				";

			}


		}
		?>
	</div>

	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>

	<script>
		$(document).ready(function () {
			$('input[name^="school_"], input[name^="course_"]').on('change', function () {
				// Get the unique identifier from the data attribute
				var rowId = $(this).attr('name').split('_')[1];
            
            // Retrieve values from the changed input fields
            var schoolValue = $('input[name="school_' + rowId + '"]').val();
            var courseValue = $('input[name="course_' + rowId + '"]').val();
 

			
			// 	$.ajax({
			// 		url: 'college_insert', 
			// 		method: 'POST',
			// 		data: {
			// 			rowId: rowId,
			// 			schoolValue: schoolValue,
			// 			courseValue: courseValue
			// 		},
			// 		success: function (response) {
			// 			console.log(response);
			// 		},
			// 		error: function (xhr, status, error) {
			// 			// Handle errors
			// 			console.error('AJAX error:', status, error);
			// 		}
			// 	});

			// });
		});
	</script>

</body>

</html>