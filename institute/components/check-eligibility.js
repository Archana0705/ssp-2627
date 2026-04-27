(function ($) {
  $.fn.check_eligibility_component = function () {
    const headerHTML = `
                       <div class="table-responsive">
                        <table class="table table-bordered table-striped  ">
                          <h5 class="head-label w-100"><strong id="schemeNameDisplay">-</strong> - <strong id="subSchemeNameDisplay">-</strong></h5>
                          <thead>
                            <tr>
                              <th scope="col">Parameters</th>
                              <th>Scheme Parameters</th>
                              <th>Student Parameters</th>
                              <th>Eligibility Status</th>
                            </tr>
                          </thead>
                          <tbody id="studentTableBody">
                            <tr id="loadingRow">
                              <td colspan="4" class="text-center">Loading...</td>
                            </tr>
                          </tbody>

                        </table>
                      </div>
      `;
    this.html(headerHTML);
    return this;
  };
})(jQuery);

$(document).ready(function () {
  $('#check_eligibility_content').check_eligibility_component();
});

$(document).on('click', '#check_eligibility', function () {
  var scheme_id = $(this).data('scheme-id');
  var sub_scheme_id = $(this).data('sub-scheme-id');
  var schemeName = $(this).data('scheme-name');
  var subSchemeName = $(this).data('sub-scheme-name');
  var currentModel = $(this).data('current-modal');
  var student_id = $(this).data('student-id') ?? studentId;
  var aadhaar_no = $(this).data('aadhaar-no') ?? aadhaarNo;
  $('#schemeNameDisplay').text(schemeName);
  $('#subSchemeNameDisplay').text(subSchemeName);
  $('#checkeligibility_modal').modal('show');
  if(currentModel == 1) {
    $('#check_scheme_eligibility').modal('hide');
  } 
  if(currentModel == 2) {
    $('#scheme_info').modal('hide');
  }
  const tableBody = document.getElementById('studentTableBody');
  tableBody.innerHTML = `
    <tr id="loadingRow">
      <td colspan="4" class="text-center">Loading...</td>
    </tr>
  `;
  var encryptDatas = {
    scheme_id: scheme_id, rule_id: sub_scheme_id, student_id: student_id, aadhaar_no: aadhaar_no
  };
  $.ajax({
    url: config.ssp_api_url + '/student/checkeligibility',
    type: 'POST',
    headers: { 'X-APP-KEY': 'te$t', 'X-APP-NAME': 'te$t' },
    data: { data: encryptData(encryptDatas) },
    success: function (response) {
      if (response.success) {
        function updateTable(result) {
          const data = JSON.parse(result[0].fielddetails);
          const fieldDetails = data.fielddetails;
          // Clear the current table body
          const tableBody = document.getElementById('studentTableBody');
          tableBody.innerHTML = '';

          fieldDetails.forEach(item => {
            const fieldName = item.fieldname.replace(/ /g, '_').toLowerCase(); // Normalize field names

            // Only add rows for relevant fields
            if (item.schemefieldvalues || item.studentfieldvalues) {
                const newRow = document.createElement('tr');


                newRow.innerHTML = `
                    <td>${item.fieldname}</td>
                    <td id="scheme_check_${fieldName}" class="long-text" style="height: 50px; overflow-y: scroll; display: block;">${item.schemefieldvalues || '-'}</td>
                    <td id="student_check_${fieldName}" class="long-text">${item.studentfieldvalues || '-'}</td>
                    <td id="status_check_${fieldName}">
                      ${item.status ? '<i class="bi bi-patch-check-fill text-success" style="font-size: 24px;"></i>' : '<i class="bi bi-x-circle-fill text-danger" style="font-size: 24px;"></i>'}
                    </td>
                `;
                tableBody.appendChild(newRow);
            }
          });
        }

        const decryptedData = decryptData(response.data);
        // Call the function to update the table
        updateTable(decryptedData);
      } else {
          // Handle case where no data is found
          console.error(response.message);
          tableBody.innerHTML = `
            <tr>
              <td colspan="4" class="text-center">No field details available.</td>
            </tr>
          `;
      }
    },
    error: function (xhr, status, error) {
        console.error("AJAX Error: ", error);
    }
  });
  $('#checkeligibility_modal').on('hidden.bs.modal', function () {
    if(currentModel == 1) {
      $('#check_scheme_eligibility').modal('show');
    }
    if(currentModel == 2) {
      $('#scheme_info').modal('show');
    }
    currentModel = null;
  });
})