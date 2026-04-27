
$(document).on({
  ajaxStart: function () {
    $("#preloader").show();
    $("body").addClass("user_loading");
  },
  ajaxStop: function () {
    $("#preloader").hide();
    $("body").removeClass("user_loading");
  },
});

$(document).ready(function () {
  $(".otp-input").on("input", function () {
    // Allow only one digit in the input
    this.value = this.value.replace(/[^0-9]/g, "").slice(0, 1);

    // Navigate to the next input
    if (this.value.length === 1) {
      $(this).next(".otp-input").removeAttr("disabled").focus();
    }
  });

  $(".otp-input").on("keydown", function (e) {
    // Handle backspace to navigate to the previous input
    if (e.key === "Backspace") {
      if (this.value === "") {
        const prevInput = $(this).prev(".otp-input");
        if (prevInput.length) {
          prevInput.focus().val("");
        }
      } else {
        // Clear the current input field but don't disable it
        this.value = "";
      }
    }
  });

  // Focus on the first input field on page load
  $(".otp-input:first").removeAttr("disabled").focus();

  $(document).on("click", "#refresh", function () {
    $("#refresh_modal").modal("show");
  });
});

function startProgressBar_(
  checkboxId,
  progressBarId,
  progressMessageId,
  apiUrl,
  requestData
)
 { 
  const checkbox = $("#" + checkboxId);
  const progressBar = $("#" + progressBarId);
  const progressMessage = $("#" + progressMessageId);
  const resendButtonId = "resend_" + checkboxId;
  var error_count = 0;
  let progressInterval;
  if (!validateRequestData(requestData)) {
    progressMessage.text("Invalid data format.");
    $("#" + resendButtonId).show(); // Show Resend button on invalid data
    return;
  }
  if (checkbox.prop("checked")) {
    progressBar.parent().show(); // Show the progress bar
    progressBar.css("width", "0%"); // Reset progress bar to 0%
    progressMessage.text("Loading...");
    $("#" + resendButtonId).hide(); // Hide Resend button initially

    let progress = 0;
    const interval = 50;
    const totalDuration = 5000;
    const step = 100 / (totalDuration / interval);

    function updateProgress() {
      progress += step;
      if (progress >= 100) {
        clearInterval(progressInterval);
        progressBar.css("width", "100%");
      } else if (progress >= 80) {
        progressMessage.text("Eligibility Computed!");
      } else if (progress >= 40) {
        progressMessage.text("Data Submitted!");
      }
      progressBar.css("width", progress + "%");
    }

    progressInterval = setInterval(updateProgress, interval);

    // Validation for request data before making the AJAX call
    checkbox.prop("disabled", true);

    // Perform AJAX request
    $.ajax({
      url: apiUrl,
      method: "POST",
      headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
      data: requestData,
      success: function (response) {
        console.log("API Response for " + checkboxId + ": ", response);

        if (response.success == true) {
          try {
            const responseJSON = JSON.parse(response.data);
            console.log(responseJSON);
            if (responseJSON.status === 1) {
              progressBar.css("background-color", "#0d6efd");
              checkbox.prop("disabled", true);
              clearInterval(progressInterval);
              progressBar.css("width", "100%");
              progressMessage.text("Data Updated Successfully!");
            } else if (responseJSON.status === 2) {
              progressBar.css("background-color", "#0d6efd");
              clearInterval(progressInterval);
              progressBar.css("width", "100%");
              progressMessage.text("No Updatation Found in UMIS");
            } else if (responseJSON.status === 3) {
              progressBar.css("background-color", "#0d6efd");
              checkbox.prop("disabled", true);
              clearInterval(progressInterval);
              progressBar.css("width", "100%");
              progressMessage.text("No data Found in UMIS for this section");
            } else {
              clearInterval(progressInterval);
              progressBar.css("background-color", "red");
              progressBar.css("width", "100%");
              progressMessage.text("Updation Failure");
             
              $("#" + resendButtonId).show();
              error_count++;
            }
          } catch (e) {
            progressMessage.text(e);
            error_count++;
            $("#" + resendButtonId).show();
          }
        } else {
          progressMessage.text("Error: " + response.message);
          error_count++;
          $("#" + resendButtonId).show(); // Show Resend button on error
        }
      },

      error: function (xhr) {
        clearInterval(progressInterval);
        progressBar.css("background-color", "red");
        progressBar.css("width", "100%");
        progressMessage.text(`Error: ${xhr.status} - ${xhr.statusText}`);
        error_count++;
        $("#" + resendButtonId).show(); // Show Resend button on error
      },
    });
   
    // Attach click handler to Resend button
    $("#" + resendButtonId)
      .off("click")
      .on("click", function () {
        $("#" + resendButtonId).hide(); // Hide Resend button during retry
        startProgressBar(
          checkboxId,
          progressBarId,
          progressMessageId,
          apiUrl,
          requestData
        );
      });
      if (error_count > 0) {
        return 0;
      } else {
        return 1;
      }

  }
  
}


$("#submitBtn__").click(function () {
  const isAnyCheckboxChecked =
    $(".form-check-input:checked:not(:disabled)").length > 0;

  if (!isAnyCheckboxChecked) {
    swal({
      title: "No Selection!",
      text: "Please select at least one enabled option to proceed.",
      icon: "warning",
      button: "Ok",
    });
    return;
  }

  const student_id_ssp = student_id;
  const checkboxes = [
    {
      id: "StudentDetailsCheckbox",
      progressId: "progressStudentDetails",
      messageId: "progressStudentDetails_message",
      dropdown: "student",
    },
    {
      id: "StudentContactDetailsCheckbox",
      progressId: "progressStudentContactDetails",
      messageId: "progressStudentContactDetails_message",
      dropdown: "studentcontact",
    },
    {
      id: "income_checkbox",
      progressId: "progressIncome",
      messageId: "progressIncome_message",
      dropdown: "studentesevaiinfo",
    },
    {
      id: "studentfamilyinfo_checkbox",
      progressId: "progressFamilyInfo",
      messageId: "progressFamilyInfo_message",
      dropdown: "studentfamilyinfo",
    },
    {
      id: "current_academic_info",
      progressId: "progressAcademicInfo",
      messageId: "progressAcademicInfo_message",
      dropdown: "studentcurrentacademicinfo",
    },
    {
      id: "student_bank_account_details",
      progressId: "progressBankDetails",
      messageId: "progressBankDetails_message",
      dropdown: "bankaccount",
    },
    {
      id: "student_category_details",
      progressId: "progressstudent_category_details",
      messageId: "progressstudent_category_message",
      dropdown: "studentsplcategory",
    },
  ];
  let error_check_count = 0;
  checkboxes.forEach(({ id, progressId, messageId, dropdown }) => {
    const checkbox = $(`#${id}`);
    if (checkbox.prop("checked") && !checkbox.prop("disabled")) {
      error_check = startProgressBar(
        id,
        progressId,
        messageId,
        config.home_api_url + '/student_detail_refresh',
        { student_id: student_id_ssp, dropdown }
      );
      if (error_check == 0) {
        return 0;
      } else {
        return 1;
      }
    }
  });

  if (error_check_count > 0) {
    swal({
      title: "Error!",
      text: "There was an issue with some processes. Please retry or reload the page.",
      icon: "error",
      buttons: {
        retry: {
          text: "Retry",
          value: "retry",
        },
        reload: {
          text: "Reload",
          value: "reload",
        },
      },
    }).then((value) => {
      if (value === "reload") {
        location.reload();
      }
    });
  } else {
    swal({
      title: "Success!",
      text: "All processes completed successfully. The page will now reload.",
      icon: "success",
      buttons: false,
      timer: 3000,
    }).then(() => {
      location.reload();
    });
  }
});

$("#submitBtn_").click(function () {
  const isAnyCheckboxChecked = $(".form-check-input:checked").length > 0;

  if (!isAnyCheckboxChecked) {
    swal({
      title: "No Selection!",
      text: "Please select at least one option to proceed.",
      icon: "warning",
      button: "Ok",
    });
    return;
  }

  student_id_ssp = student_id;
  if ($("#StudentDetailsCheckbox").prop("checked")) {
    startProgressBar(
      "StudentDetailsCheckbox",
      "progressStudentDetails",
      "progressStudentDetails_message",
      config.home_api_url + '/student_detail_refresh',
      { student_id: student_id_ssp, dropdown: "student" }
    );
  }

  if ($("#StudentContactDetailsCheckbox").prop("checked")) {
    startProgressBar(
      "StudentContactDetailsCheckbox",
      "progressStudentContactDetails",
      "progressStudentContactDetails_message",
      config.home_api_url + '/student_detail_refresh',
      { student_id: student_id_ssp, dropdown: "studentcontact" }
    );
  }

  if ($("#income_checkbox").prop("checked")) {
    startProgressBar(
      "income_checkbox",
      "progressIncome",
      "progressIncome_message",
      config.home_api_url + '/student_detail_refresh',
      { student_id: student_id_ssp, dropdown: "studentesevaiinfo" }
    );
  }

  if ($("#studentfamilyinfo_checkbox").prop("checked")) {
    startProgressBar(
      "studentfamilyinfo_checkbox",
      "progressFamilyInfo",
      "progressFamilyInfo_message",
      config.home_api_url + '/student_detail_refresh',
      { student_id: student_id_ssp, dropdown: "studentfamilyinfo" }
    );
  }

  if ($("#current_academic_info").prop("checked")) {
    startProgressBar(
      "current_academic_info",
      "progressAcademicInfo",
      "progressAcademicInfo_message",
      config.home_api_url + '/student_detail_refresh',
      { student_id: student_id_ssp, dropdown: "studentcurrentacademicinfo" }
    );
  }

  if ($("#student_bank_account_details").prop("checked")) {
    startProgressBar(
      "student_bank_account_details",
      "progressBankDetails",
      "progressBankDetails_message",
      config.home_api_url + '/student_detail_refresh',
      { student_id: student_id_ssp, dropdown: "bankaccount" }
    );
  }

  if ($("#student_category_details").prop("checked")) {
    startProgressBar(
      "student_category_details",
      "progressstudent_category_details",
      "progressstudent_category_message",
      config.home_api_url + '/student_detail_refresh',
      { student_id: student_id_ssp, dropdown: "studentsplcategory" }
    );
  }



  
});

function fn_scheme_details(urlKey){
  if ($.fn.DataTable.isDataTable("#scheme_details")) {
    // Destroy the DataTable instance
    $("#scheme_details").DataTable().destroy();
  }

  var encryptDatas = {
    student_id: urlKey,
    status: false,
  };
  $("#scheme_details").DataTable({
    paging: true,
    lengthMenu: [10, 15, 20, 30],
    ordering: true,
    info: true,
    responsive: true,
    dom: "Bfrtlip", // Add buttons to DOM

    buttons: [
      {
        extend: "excelHtml5",
        text: '<i class="bi bi-file-earmark-spreadsheet"> Excel</i>',
        titleAttr: "EXCEL",
        className: "btn btn-success",
        exportOptions: {
          columns: ":visible", // Only export visible columns
        },
      },
      {
        extend: "pdfHtml5",
        orientation: "Portrait",
        pageSize: "A4",
        text: '<i class="bi bi-filetype-pdf"> PDF</i>',
        titleAttr: "PDF",
        className: "btn btn-danger",
        exportOptions: {
          columns: ":visible",
        },
        customize: function (doc) {
          doc.defaultStyle = {
            font: "Roboto", // Use Roboto as the default font
          };
        },
      },
      {
        extend: "print",
        text: '<i class="bi bi-printer"> Print</i>',
        titleAttr: "Print",
        className: "btn btn-secondary",
        exportOptions: {
          columns: ":visible", // Only export visible columns
        },
      },
      {
        extend: "colvis", // Add column visibility button
        text: '<i class="bi bi-eye"> Column Visibility</i>',
        className: "btn btn-info",
        columns: ":not(.noVis)", // Exclude columns with the class `noVis`
      },
    ],

    // columnDefs: [
    //   { className: "dt-center", targets: "_all" }, // Center align all columns
    // ],

    ajax: {
      url: student_api_url + "/get_scheme_details",
      type: "POST",
      headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
      data: { encry_data: encryptData(encryptDatas) },

      dataSrc: function (response) {
        schemesData = {};
        const tbody = $("#scheme_details_body");
        let row = "";
        if (response.success == 1) {
          const decryptedData = decryptData(response.data);
          decryptedData.forEach(function (select, index) {
            row += `<tr>
                          <td>${select.scheme_name}</td>
                              <td>${select.action}</td>`;
          });

          tbody.html(row); // Populate table body
          $.each(decryptedData, function (index, scheme) {
            schemesData[scheme.schemeid] = scheme; // Store scheme details by ID
          });
          return decryptedData;
        } else {
          if(response.message == 'No Data Found')
          {            
            document.getElementById('eligibility_schemes').style.display = 'none';            
              $(".scheme_eligibility_div").hide();  
              $('#table_header').hide();
              Swal.fire({
                  title: "Not Eligible for any scholarship",
                  icon: "info",
                  html: `<p style="font-size: 0.85rem; color: #555;">Try the <strong>Check Eligibility</strong> option to know the reasons for ineligibility.</p>`,
                  showConfirmButton: false,
                  timer: 1500,
              });
              const inputData = {
                  scheme_id    : 1,
                  student_id   : student_id,
                  institute_id : institutionId,
                  university_id: 0,
                  hod_id       : 0,
                  type         : 1
              };
              var studInstituteName = $('#current_institute').text();
              var studCourseName = $('#course').text();
              var studCourseBranchName = $('#course_branch').text();
              var studCommunityName = $('#community').text();
              var studIncomeName = $('#familyincome').text();
              encry_data = encryptData(inputData);
              $.ajax({
                  url: config.ssp_api_url + '/student/get_eligible_schemes',
                  type: 'POST',
                  headers: { 'X-APP-KEY': 'te$t', 'X-APP-NAME': 'te$t' },
                      data: { data: encry_data },
                      // data:{ scheme_id: scheme_id, rule_id: sub_scheme_id, student_id: emis_umis_id, aadhaar_no: aadhar_number_encode },
                  success: function (response) {
                      if (response.status == 1) {
                          const result = decryptData(response.data);
                              var eligibilityMessage = '';

                              if (result && result.length > 0) {
                                const instituteDetails = result['0']['institution_course_json'];
                                const parsedInstituteDetails = JSON.parse(instituteDetails);
                                  eligibilityMessage += `
                                      <p>Following schemes are considered for the institute <strong>${studInstituteName || ''}</strong> (<strong>${parsedInstituteDetails.ownership || ''}</strong>) studying in course <strong>${studCourseName || ''}</strong> and branch <strong>${studCourseBranchName || ''}</strong> (<strong>${parsedInstituteDetails.course_category_name || ''}</strong>), belonging to the <strong>${studCommunityName || ''}</strong> community, and with an income of <strong>${studIncomeName || ''}</strong>.</p>
                                      <ol>`;

                                          result.forEach(scheme => {
                                      eligibilityMessage += `
                                          <li>
                                          <strong>${scheme.scheme_name || ''}</strong>
                                          <a id="check_scheme" data-scheme-name="${scheme.scheme_name}" data-scheme-id="${scheme.scheme_id}" data-student-id="${student_id}" data-current-modal="0" href="#">(Check)</a>
                                          </li>`;
                                  });
                                  eligibilityMessage += `</ol>`;
                              }
                                  eligibilityMessage += `
                                      <p>Sorry, you are <strong>not eligible</strong> for any of the above schemes. Use Check option to check reasons for ineligibility of individual scheme. <br>The reasons for ineligibility are given below</p>
                                  `;
                              $('#eligibilityMessage').html(eligibilityMessage);
                              $(".student_info_div").show();
                              $('#check_scheme_eligibility').show();
                              function updateTable(result) {
                                  const schemeTableBody = document.getElementById('schemeTableBody'); // Get the table body
                                  schemeTableBody.innerHTML = ''; // Clear the existing table rows before adding new ones
                                  const seenFields = new Set(); // Set to track already seen field names
                              
                                  // Step 1: Create a map to track the count of each fieldname across all schemes
                                  const fieldnameCount = new Map();
                              
                                  // Loop through the schemes and count occurrences of each fieldname
                                  result.forEach((scheme) => {
                                      const data = JSON.parse(scheme.fielddetails); // Parse the field details for each scheme
                                      const fieldDetails = data.fielddetails; // Extract the field details array
                              
                                      if (!data.Eligible) {
                                          fieldDetails.forEach((item) => {
                                              const fieldName = item.fieldname.replace(/ /g, '_').toLowerCase(); // Normalize field names
                                              // Increment the count for this fieldName
                                              fieldnameCount.set(fieldName, (fieldnameCount.get(fieldName) || 0) + 1);
                                          });
                                      }
                                  });
                              
                                  // Step 2: Identify common fieldnames that appear in every scheme
                                  const commonFieldNames = Array.from(fieldnameCount.keys()).filter(fieldName => fieldnameCount.get(fieldName) === result.length);
                              
                                  // Step 3: Loop through the schemes again and create rows for either common fieldnames or all fieldnames if none are common
                                  result.forEach((scheme) => {
                                      const data = JSON.parse(scheme.fielddetails); // Parse the field details for each scheme
                                      const fieldDetails = data.fielddetails; // Extract the field details array
                              
                                      if (!data.Eligible) {
                                          fieldDetails.forEach((item) => {
                                              const fieldName = item.fieldname.replace(/ /g, '_').toLowerCase(); // Normalize field names
                              
                                              // If there are common fieldnames, show only those; otherwise, show all
                                              const shouldDisplay = commonFieldNames.length > 0 ? commonFieldNames.includes(fieldName) : true;
                              
                                              if ((item.schemefieldvalues || item.studentfieldvalues) && shouldDisplay && !seenFields.has(fieldName)) {
                                                  const newRow = document.createElement('tr');
                                                  newRow.innerHTML = `
                                                      <td>${item.fieldname}</td>
                                                      <td id="scheme_check_${fieldName}" class="long-text">${item.schemefieldvalues || '-'}</td>
                                                      <td id="student_check_${fieldName}" class="long-text">${item.studentfieldvalues || '-'}</td>
                                                      <td id="status_check_${fieldName}" class="text-center">
                                                          ${item.status ? '<i class="bi bi-patch-check-fill text-success" style="font-size: 24px;"></i>' : '<i class="bi bi-x-circle-fill text-danger" style="font-size: 24px;"></i>'}
                                                      </td>
                                                  `;
                                                  schemeTableBody.appendChild(newRow);
                                                  seenFields.add(fieldName); // Mark this field as seen
                                              }
                                          });
                                      }
                                  });
                              }
                              updateTable(result);
                              $('#table_header').show();
                              window.scrollTo({
                                  top: document.body.scrollHeight,  // Scroll to the bottom of the page
                                  behavior: 'smooth'  // Optional: smooth scroll effect
                              });
                      } else {
                          if (response.message == "No scheme available for the given student and institution") {
                            var eligibilityMessage = '';
                            eligibilityMessage += `
                                <div class="alert alert-danger" role="alert">
                                                        Your current Institution <strong>${studInstituteName || ''}</strong>, Course <strong>${studCourseName || ''}</strong> and Branch <strong>${studCourseBranchName || ''}</strong> does not meet the criteria for any schemes in <strong>BC</strong> under <strong>BC Welfare Department</strong>.
                                                    </div>
                            `;
                        $('#eligibilityMessage').html(eligibilityMessage);
                        $(".student_info_div").show();
                        $('#check_scheme_eligibility').show();
                          } else {
                            $('#check_scheme_eligibility').hide();
                              Swal.fire({
                                  title: "Schemes Not Available ",
                                  icon: "info",
                                  html: `<p style="font-size: 0.85rem; color: #555;">Try the <strong>Refresh</strong> option to sync data from UMIS.</p>`,
                                  showConfirmButton: true
                              });
                          }
                      }
                  },
                  error: function (xhr, status, error) {
                      console.error("AJAX Error: ", error);
                      if (response.message.includes("No scheme available for the given student and institution")) {
                        var eligibilityMessage = '';
                        eligibilityMessage += `
                            <div class="alert alert-danger" role="alert">
                                                    Your current Institution <strong>${studInstituteName || ''}</strong>, Course <strong>${studCourseName || ''}</strong> and Branch <strong>${studCourseBranchName || ''}</strong> does not meet the criteria for any schemes in <strong>BC</strong> under <strong>BC Welfare Department</strong>.
                                                </div>
                        `;
                    $('#eligibilityMessage').html(eligibilityMessage);
                    $(".student_info_div").show();
                    $('#check_scheme_eligibility').show();
                      } else {
                        $('#check_scheme_eligibility').hide();
                          Swal.fire({
                              icon: "error",
                              title: 'Something Went Wrong',
                              showConfirmButton: true,
                          })
                      }
                  }
              });

          return response.data;
        }
        }
      },
      error: function (xhr, error, thrown) {
        let message;
        if (xhr.status === 400) {
          message = "Login is required. Please log in to continue.";
        } else if (xhr.status === 500) {
          message =
            "Something went wrong on the server. Please try again later.";
        } else {
          message =
            "An unexpected error occurred: " +
            xhr.status +
            " " +
            xhr.statusText;
        }
        Swal.fire({
          text: message,
          icon: "info",
          showConfirmButton: true,
      });
         // Show the appropriate error message
        //console.error('Error details:', xhr); // Log error details to //console
      },
    },
    columns: [
      {
        data: "id",
        render: function (data, type, row, meta) {
          return meta.row + meta.settings._iDisplayStart + 1;
        },
      },

      {
        data: "scheme_name",
        title: "Scheme Name",
        render: function (data, type, row) {
          if (data) {
            return (
              data +
              '<input type="hidden" id="studentschemeid" value="' +
              row.studentschemeid +
              '">' +
              '<input type="hidden" id="scheme_rule_id" value="' +
              row.scheme_rule_id +
              '">' +
              '<input type="hidden" id="selected_scheme_name" value="' +
              row.scheme_name +
              '">'
            );
          } else {
            return "-";
          }
        },
      },
      {
        data: "is_applied",
        title: "Details",
        render: function (data, type, row) {
          var schemeid = row.schemeid;
          // if (row.scholarship_amount === 0) {
          //   $('.not-qualified_scholoarship').show();
          //   $('.not-qualified').hide();
          //   return `
          //     <div class="">
          //       <a 
          //         class="btn add-btn view-scheme info" 
          //         href="#" 
          //         data-scheme-id="${schemeid}"
          //       >
          //         <i class="bi bi-eye"></i> View
          //       </a>
          //       <a 
          //         class="btn btn-danger btn-sm" 
          //         href="#"
          //       >
          //         <i class="bi bi-x-circle-fill"></i> Not Qualified
          //       </a>
          //     </div>
          //   `;
          // } else 
          if (data === true) {
            $('.not-qualified').hide();
         
            return (
              '<div class="">' +
              '<a class="btn add-btn view-scheme info" href="#" data-scheme-id="' +
              schemeid +
              '">' +
              '<i class="bi bi-eye"></i> View</a>' +
              '<a class="btn btn-success btn-sm applied_application" href="#"  data-filepath="' +
              row.filepath +
              '" style="pointer-events: none; cursor: default;">' +
              '<i class="bi bi-file-earmark-check-fill"></i> Applied</a>' +
              "</div>"
            );
          } else {
            $('.not-qualified').hide();
            $('.not-qualified_scholoarship').hide();
            return (
              '<div class="">' +
              '<a class="btn add-btn view-scheme info" href="#" data-scheme-id="' +
              schemeid +
              '">' +
              '<i class="bi bi-eye"></i> View</a>' +
              '<a class="btn btn-primary apply_link btn-sm" href="#">' +
              '<i class="bi bi-file-earmark-arrow-up-fill"></i>Apply</a>' +
              "</div>"
            );
          }
        },
      },
    ],
    language: {          
      emptyTable: "No Schemes available in this table.",
    },
    drawCallback: function () {
      // Show or hide '.not-qualified' based on table content
      const tableData = this.api().rows().data().length;
      if (tableData === 0) {
          $('.not-qualified').show();
          $('.not-qualified_scholoarship').hide();
      } 
   
  },
  });
}
// Function to generate table rows and ensure all valid components exist
function generateFeeRows(data) {
  // Predefined valid fee components
  const validComponents = [
    "Tuition Fee", "Alumini Fee", "Computer Fee", "Library Fee", "Lab Fee",
    "Application Fee", "Registration Fee", "Caution Deposit Fee", "Others",
    "Special Fee", "Sports Fee", "Enrollment Fee", "Examination Fee",
    "Hostel Fee", "Book Money"
  ];

  // Find missing components
  let missingComponents = validComponents
    .filter(component => !data.some(fee => fee.component_name === component))
    .map(component => ({
      component_name: component,
      fixed_ceiling_amount: "-" // Default value for missing components
    }));

  // Combine existing data with missing components (missing ones at the end)
  let finalData = [...data, ...missingComponents];

  return finalData
    .map(
      (fee) => `
      <tr>
        <td>${fee.component_name}</td>
        <td>${isNaN(parseFloat(fee.fixed_ceiling_amount)) ? fee.fixed_ceiling_amount : parseFloat(fee.fixed_ceiling_amount).toFixed(2)}</td>
      </tr>`
    )
    .join('');
}

// Function to sort the fee table
function sortFeeTable(key, sortOrder, type) {
  // Toggle sorting order
  sortOrder[type] = sortOrder[type] === 'asc' ? 'desc' : 'asc';

  // Sort the array based on the given key
  feeData.sort((a, b) => {
    let valA = key === 'fixed_ceiling_amount' ? parseFloat(a[key]) : a[key].toLowerCase();
    let valB = key === 'fixed_ceiling_amount' ? parseFloat(b[key]) : b[key].toLowerCase();

    return sortOrder[type] === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
  });

  // Update the table content
  document.getElementById('feeTableBody').innerHTML = generateFeeRows(feeData);
}
$(document).on('click', '#check_scheme', function () {
  var scheme_id = $(this).data('scheme-id');
  var schemeName = $(this).data('scheme-name');
  var student_id = $(this).data('student-id') ?? student_id;
  const inputData = {
      scheme_id    : scheme_id,
      student_id   : student_id,
      institute_id : institutionId || 0,
      university_id: 0,
      hod_id       : 0,
      type         : 1
  };
  encry_data = encryptData(inputData);
  let tableRows = '';
  $.ajax({
      url: config.ssp_api_url + '/student/get_scheme_eligibility',
      type: 'POST',
      headers: { 'X-APP-KEY': 'te$t', 'X-APP-NAME': 'te$t' },
          data: { data: encry_data },
          // data:{ scheme_id: scheme_id, rule_id: sub_scheme_id, student_id: emis_umis_id, aadhaar_no: aadhar_number_encode },
      success: function (response) {
          if (response.status == 1) {
              const result = decryptData(response.data);
              const data = JSON.parse(result[0].fielddetails);
              const instituteData = JSON.parse(result[0].institution_course_json);
              const subSchemeData = JSON.parse(result[0].scheme_subscheme_json);
              isEligible = data.Eligible;
              if (isEligible) {
                  eligibilityMessage = `
                      <div class="alert alert-success" role="alert">
                          <p>Congratulations! You are eligible to apply for the scheme.</p>
                      <ul>
                      <li>
                          <p><strong>${schemeName || ''}</strong> : ${data.schemename || ''}</p>
                      </li>
                      </ul>
                      <p>Please proceed with the application process to avail the benefits of this scheme.</p>
                      </div>
                  `;
                  $('#tableHeader').hide();
                  // Append the message before opening the modal
                  tableRows = '';
                              
                  $('#schemeEligibilityMessage').html(eligibilityMessage);
                  $('#schemeTable').html(tableRows);

                  // Show the modal
                  $('#eligibilityModal').modal('show');
              } else {
                  const fieldDetails = data.fielddetails;
                  $('#tableHeader').show();
                  var eligibilityMessage = `
                      <p>Sorry you're not eligible, for scheme <strong>${data.schemename || ''}</strong> in the institute <strong>${instituteData.institution_name || ''}</strong> studying in course <strong>${instituteData.course_name || ''}</strong> and branch <strong>${instituteData.course_branch_name || ''}</strong> and course category <strong>${instituteData.course_category_name || ''}</strong>.</p>
                  `;

                  if (subSchemeData && subSchemeData.length > 0) {
                      eligibilityMessage += `
                          <p>Following sub schemes are considered for the above institute and course, Use Check option to check reasons for ineligibility of individual subscheme.</p>
                          <ol>`;

                      subSchemeData.forEach(subscheme => {
                          eligibilityMessage += `
                              <li>
                              <strong>${subscheme.subscheme_name || ''}</strong>
                              <a id="check_eligibility" data-scheme-name="${data.schemename} "data-sub-scheme-name="${subscheme.subscheme_name}" data-scheme-id="${scheme_id}" data-sub-scheme-id="${subscheme.subscheme_id}" data-current-modal="0" href="#">(Check)</a>
                              </li>`;
                      });

                      eligibilityMessage += `</ol>
                                              <p>Consolidated reasons for ineligibility for the above subschemes are as below:</p>`;
                  }
                  if (!fieldDetails || fieldDetails.length === 0) {
                      // If fieldDetails is empty, display a message in the table
                      $('#schemeTable').html(`
                      <tr>
                          <td colspan="4" class="text-center">No field details available.</td>
                      </tr>
                      `);
                  } else {
                      fieldDetails.forEach(field => {
                          const statusIcon = field.status ? 
                              '<i class="bi bi-patch-check-fill text-success" style="font-size: 24px;"></i>' :
                              '<i class="bi bi-x-circle-fill text-danger" style="font-size: 24px;"></i>';

                          // Create a new table row for each fielddetail
                          tableRows += `
                              <tr>
                              <td class="text-center long-text">${field.fieldname}</td>
                              <td class="text-center long-text">${field.schemefieldvalues}</td>
                              <td class="text-center long-text">${field.studentfieldvalues}</td>
                              <td class="text-center">${statusIcon}</td>
                              </tr>
                          `;
                          // Check if the field name is 'Institution/Course/Branch Combination'
                          if (field.fieldname === "Institution/Course/Branch Combination" && !field.status) {
                              // Show the eligibility message if the field is not eligible
                              eligibilityMessage = `
                              <div class="alert alert-danger" role="alert">
                                  Your current <strong>Institution, Course, or Branch</strong> does not meet the criteria(Sub Schemes) for this <strong>${schemeName || ''}</strong> scheme.
                              </div>
                              `;
                              // Append the message before opening the modal
                              $('#tableHeader').hide();
                              tableRows = '';
                          }
                      });
                      $('#schemeEligibilityMessage').html(eligibilityMessage);
                      $('#schemeTable').html(tableRows);
                  }

                  // Show the modal
                  $('#eligibilityModal').modal('show');
              }
          } else {
              console.error("response", response);
              if (response && response.data && response.data == 12) {
                  eligibilityMessage = `
                          <div class="alert alert-danger" role="alert">
                              Maintenance Group Code is mandatory for this institute.
                          </div>
                          `;
                              // Append the message before opening the modal
                              $('#tableHeader').hide();
                  $('#schemeEligibilityMessage').html(eligibilityMessage);
                  $('#schemeTable').html(tableRows);
                  $('#eligibilityModal').modal('show');
              } else {
                  Swal.fire({
                      icon: "error",
                      title: 'Sorry data not found in database!',
                      text: 'Please use the refresh option for this student. If the issue still persists, contact TNeGA.',
                      showConfirmButton: true,
                  })
              }
          }
      },
      error: function (xhr, status, error) {
          console.error("AJAX Error: ", error);
          Swal.fire({
              icon: "error",
              title: 'Something Went Wrong',
              showConfirmButton: true,
          })
      }
  });
});
function closeSchemeEligibility() {
  document.getElementById('scheme_eligibility').style.display = 'none';
}
$(document).on('click', '#check_eligibility', function () {
    $('#eligibilityModal').modal('hide');
});
$('#checkeligibility_modal').on('hidden.bs.modal', function () {
    $('#eligibilityModal').modal('show');
});