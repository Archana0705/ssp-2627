class Headers extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `
      <div class="modal fade" id="refresh_modal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" role="dialog" aria-labelledby="modalTitleId" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content shadow-lg rounded-3">
      <div class="modal-header border-bottom-0">
        <h5 class="modal-title title" id="modalTitleId">
          <i class="bi bi-arrow-clockwise"></i> Refresh Student Data for the Following Parameters
        </h5>
        <div class="">
          <button type="button" class="btn btn-success btn-sm px-3" id="submitBtn">Submit</button>
           <button type="button" class="btn btn-warning btn-sm px-3 btn-sm" onclick="window.location.reload()" id="reloadbtn" >Reload</button>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeModal"></button>
        </div>
      
      </div>
      <div class="modal-body px-2 py-2">
        
        <!-- Student Details Section -->
        <div class="form-check custom-checkbox p-2 border rounded-3 shadow-sm hover-shadow-lg" style="background-color: #f8f9fa;">
          <strong>Student Details:</strong>
          <div class="form-check mb-1">
            <input class="form-check-input" type="checkbox" value="0" id="StudentDetailsCheckbox" data-id=1 />
            <label class="form-check-label" for="StudentDetailsCheckbox">
              Name, Date of Birth, Nationality, Religion, Community, Caste, Aadhaar Number, First Graduate, Disability, Gender, UMIS, Medium.

            </label>
            <div class="progress" style="display: none;">
              <div id="progressStudentDetails" class="progress-bar" role="progressbar"></div>
            </div>
            <span id="progressStudentDetails_message"></span>
          </div>
        </div>

        <!-- Student Contact Details Section -->
        <div class="form-check custom-checkbox p-2 border rounded-3 shadow-sm hover-shadow-lg" style="background-color: #f8f9fa;">
          <strong>Student Contact Details:</strong>
          <div class="form-check mb-1">
            <input class="form-check-input" type="checkbox" value="1" id="StudentContactDetailsCheckbox" data-id=1 />
            <label class="form-check-label" for="StudentContactDetailsCheckbox">
              Mobile Number, Email ID, Permanent Address, State, District, Pincode.
            </label>
            <div class="progress" style="display: none;">
              <div id="progressStudentContactDetails" class="progress-bar" role="progressbar"></div>
            </div>
            <span id="progressStudentContactDetails_message"></span>
          </div>
        </div>

        <!-- E-Sevai Information Section 
        <div class="form-check custom-checkbox p-2 border rounded-3 shadow-sm hover-shadow-lg" style="background-color: #f8f9fa;">
          <strong>E-Sevai Information:</strong>
          <div class="form-check mb-1">
            <input class="form-check-input" type="checkbox" value="1" id="income_checkbox" data-id=1 />
            <label class="form-check-label" for="income_checkbox">
              Community Verified, First Graduate Verified, Income Verified, Family Annual Income, Nativity Verified, Disability Verified.
            </label>
            <div class="progress" style="display: none;">
              <div id="progressIncome" class="progress-bar" role="progressbar"></div>
            </div>
            <span id="progressIncome_message"></span>
          </div>
        </div>-->

        <!-- Family Information Section -->
        <div class="form-check custom-checkbox p-2 border rounded-3 shadow-sm hover-shadow-lg" style="background-color: #f8f9fa;">
          <strong>Student Family Information:</strong>
          <div class="form-check mb-1">
            <input class="form-check-input" type="checkbox" value="1" id="studentfamilyinfo_checkbox" data-id=1 />
            <label class="form-check-label" for="studentfamilyinfo_checkbox">
              Father Name, Mother Name, Guardian Name, Parent Mobile No, Parent Email ID, Family Card Number, Family Annual Income.

            </label>
            <div class="progress" style="display: none;">
              <div id="progressFamilyInfo" class="progress-bar" role="progressbar"></div>
            </div>
            <span id="progressFamilyInfo_message"></span>
          </div>
        </div>

        <!-- Academic Information Section -->
        <div class="form-check custom-checkbox p-2 border rounded-3 shadow-sm hover-shadow-lg" style="background-color: #f8f9fa;">
          <strong>Academic Information:</strong>
          <div class="form-check mb-1">
            <input class="form-check-input" type="checkbox" value="1" id="current_academic_info" data-id=1 />
            <label class="form-check-label" for="current_academic_info">
              Course Name, Course, Date of Admission, Registration Number, Lateral Entry, Hosteler, Institute Name, Mode of Study, Academic Year.

            </label>
            <div class="progress" style="display: none;">
              <div id="progressAcademicInfo" class="progress-bar" role="progressbar"></div>
            </div>
            <span id="progressAcademicInfo_message"></span>
          </div>
        </div>

        <!-- Bank Account Details Section -->
        <div class="form-check custom-checkbox p-2 border rounded-3 shadow-sm hover-shadow-lg" style="background-color: #f8f9fa;">
          <strong>Student Bank Account Information:</strong>
          <div class="form-check mb-1">
            <input class="form-check-input" type="checkbox" value="1" id="student_bank_account_details"data-id=1 />
            <label class="form-check-label" for="student_bank_account_details">
              Bank, Branch, Account Number, Account Verified.

            </label>
            <div class="progress" style="display: none;">
              <div id="progressBankDetails" class="progress-bar" role="progressbar"></div>
            </div>
            <span id="progressBankDetails_message"></span>
          </div>
        </div>
        <div class="form-check custom-checkbox p-2 border rounded-3 shadow-sm hover-shadow-lg" style="background-color: #f8f9fa;">
          <strong>Student Category Details:</strong>
          <div class="form-check mb-1">
            <input class="form-check-input" type="checkbox" value="1" id="student_category_details" data-id=1 />
            <label class="form-check-label" for="student_category_details">
              Special Category
            </label>
            <div class="progress" style="display: none;">
              <div id="progressstudent_category_details" class="progress-bar" role="progressbar"></div>
            </div>
            <span id="progressstudent_category_message"></span>
          </div>
        </div>
      </div>
      <!-- <div class="modal-footer border-top-0 py-1">
        
        <button type="button" class="btn btn-secondary px-3" data-bs-dismiss="modal">Cancel</button>
      </div> -->
    </div>
  </div>
</div>`;
  }
}

customElements.define('student-refresh', Headers);
// $('#reloadbtn').hide();

// function startProgressBar(
//   checkboxId,
//   progressBarId,
//   progressMessageId,
//   apiUrl,
//   requestData
// ) {

//   $('#submitBtn').prop('disabled', true);
//   return new Promise((resolve) => {
//     const checkbox = $("#" + checkboxId);
//     const progressBar = $("#" + progressBarId);
//     const progressMessage = $("#" + progressMessageId);
//     const resendButtonId = "resend_" + checkboxId;
//     let errorOccurred = false;
//     let progressInterval;

//     if (!validateRequestData(requestData)) {
//       progressMessage.text("Invalid data format.");
//       $("#" + resendButtonId).show(); // Show Resend button on invalid data
//       resolve(0); // Resolve with error
//       return;
//     }

//     if (checkbox.prop("checked")) {
//       progressBar.css("background-color", "#0d6efd");
//       progressBar.parent().show(); // Show the progress bar
//       progressBar.css("width", "0%"); // Reset progress bar to 0%
//       progressMessage.text("Loading...");
//       $("#" + resendButtonId).hide(); // Hide Resend button initially

//       let progress = 0;
//       const interval = 50;
//       const totalDuration = 5000;
//       const step = 100 / (totalDuration / interval);

//       checkbox.prop("disabled", true);

//       // Perform AJAX request
//       $.ajax({
//         url: apiUrl,
//         method: "POST",
//         headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
//         data: requestData,
//         success: function (response) {
//           console.log("API Response for " + checkboxId + ": ", response);
//           if (response.success === true) {

//             pollApiAndUpdateProgress(
//               checkboxId,
//               progressBarId,
//               progressMessageId,
//               student_api_url + "/student_detail_refresh_by_track_id",
//               response.log_id // Replace with actual track ID,
//             );        

//           } else {
//             clearInterval(progressInterval);
//             progressBar.css("background-color", "red");
//             progressBar.css("width", "100%");
//             progressMessage.text("Error : "+ response.message);
//             errorOccurred = true;

//             $('#reloadbtn').show();
//             $("#" + resendButtonId).show(); // Show Resend button on error
//           }
//            // Resolve based on error occurrence
//         },
//         error: function (xhr) {
//           console.error("Error for " + checkboxId + ": " + xhr.status);

//           clearInterval(progressInterval);
//           progressBar.css("background-color", "red");
//           progressBar.css("width", "100%");

//           progressMessage.text("Updation Failure");
//           $('#reloadbtn').show();
//           // progressMessage.text(`Error: ${xhr.status} - ${xhr.statusText}`);
//           errorOccurred = true;
//           $("#" + resendButtonId).show(); // Show Resend button on error
//           resolve(0); // Resolve with error
//         },
//       });

//       // Attach click handler to Resend button
//       $("#" + resendButtonId)
//         .off("click")
//         .on("click", function () {
//           $("#" + resendButtonId).hide();

//            // Hide Resend button during retry
//           startProgressBar(
//             checkboxId,
//             progressBarId,
//             progressMessageId,
//             apiUrl,
//             requestData
//           ).then((result) => {
//             if (result === 0) {
//               errorOccurred = true;
//             }
//             resolve(result);
//           });
//         });
//     } else {
//       resolve(1); // Resolve as success if checkbox is not checked
//     }

//     function pollApiAndUpdateProgress(checkboxId, progressBarId, progressMessageId, apiUrl, trackId) {
//       const checkbox = $("#" + checkboxId);
//       const progressBar = $("#" + progressBarId);
//       const progressMessage = $("#" + progressMessageId);
//       const resendButtonId = "resend_" + checkboxId;
//       let progress = 0;
//       const progressIncrement = 25; // Each step represents 25% progress
//       const pollingInterval = 4000; // 2 seconds
//       let polling;

//       checkbox.prop("disabled", true); // Disable the checkbox

//       progressBar.parent().show(); // Show progress bar container
//       progressBar.css("width", "0%"); // Reset progress bar
//       progressMessage.text("Starting the process...");

//       let requestCount = 0;
//       const maxRequests = 10;

//       polling = setInterval(() => {

//         // Check if the request count has reached the max
//         if (requestCount >= maxRequests) {
//           progressBar.css("background-color", "red");
//           progressBar.css("width", "100%");
//           progressMessage.text(`Maximum Request Reached`);
//           // clearInterval(polling);
//           $("#" + resendButtonId).show(); // Show Resend button on error
//           resolve(0); // Resolve with error
//           clearInterval(polling); // Stop polling after 10 requests
//           errorOccurred = true;
//           return;
//         }

//         $.ajax({
//           url: apiUrl,
//           method: "POST",
//           headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
//           data: { id: trackId },
//           dataType: "json",
//           success: function (response) {
//             if (response.success && response.data) {
//               const { is_update, is_import, is_consolidate, is_rule_engine, status_code, error } = response.data;

//               // Update progress based on the response
//               if (is_update && progress < 25) progress += progressIncrement;
//               if (is_import && progress < 50) progress += progressIncrement;
//               if (is_consolidate && progress < 75) progress += progressIncrement;
//               if (is_rule_engine && progress < 100) progress += progressIncrement;

//               progressBar.css("width", progress + "%");
//               $('#reloadbtn').show();
//               $("#closeModal").hide();
//               // Update progress message
//               if (progress >= 100) {

//                 progressMessage.text("Completed: Data Updated Successfully!");
//                 clearInterval(polling); // Stop polling
//                 checkbox.prop("disabled", true); // Disable checkbox
//                 $('#reloadbtn').show();
//                 $("#closeModal").hide();
//               } else if (progress >= 75) {
//                 progressMessage.text("Processing: Eligibility Computing...");
//               } else if (progress >= 50) {
//                 progressMessage.text("Processing: Consolidating data...");
//               } else if (progress >= 25) {
//                 progressMessage.text("Processing: Importing data...");
//               } else {
//                 progressMessage.text("Processing: Updating data...");
//               }

//               // Check for success or error
//               if (status_code === 2) {
//                 progressMessage.text("Completed: Data Updated Successfully!");
//                 progressBar.css("width", "100%"); // Ensure full progress
//                 clearInterval(polling);
//               } else if (status_code === 0) {
//                 is_update, is_import, is_consolidate, is_rule_engine; 
//                 if (is_update == null) {
//                   progressMessage.text(`Error Occurred while Syncing from UMIS`);
//                 } else if (is_update && is_import == null) {
//                   progressMessage.text(`Error Occurred while Importing Data`);
//                 } else if (is_update && is_import && is_consolidate == null) {
//                   progressMessage.text(`Error Occurred while Consolidating Data`);
//                 } else if (is_update && is_import && is_consolidate && is_rule_engine == null) {
//                   progressMessage.text(`Error Occurred while Eligibility Computing`);
//                 }
//                 progressBar.css("background-color", "red");
//                 progressBar.css("width", "100%");
//                 // progressMessage.text(`Error: ${error || "Unknown error occurred."}`);
//                 clearInterval(polling);
//                 $("#" + resendButtonId).show(); // Show Resend button on error
//                 resolve(0); // Resolve with error
//                 errorOccurred = true;
//               }
//             } else {
//               progressBar.css("background-color", "red");
//               progressBar.css("width", "100%");
//               progressMessage.text("Error: Invalid response from the server.");
//               clearInterval(polling);
//               $("#" + resendButtonId).show(); // Show Resend button on error
//               resolve(0); // Resolve with error
//               errorOccurred = true;
//             }
//             // resolve(errorOccurred ? 0 : 1);
//           },
//           error: function (xhr) {
//             progressBar.css("background-color", "red");
//             progressBar.css("width", "100%");
//             progressMessage.text(`Error: ${xhr.status} - ${xhr.statusText}`);
//             clearInterval(polling);
//             errorOccurred = true;
//           },
//           // After each successful request, increment the request count
//           complete: function() {

//           }
//         });
//         requestCount++;
//       }, pollingInterval);

//     }
//   });
// }

// Function to validate the requestData

function startProgressBar(
  checkboxId,
  progressBarId,
  progressMessageId,
  apiUrl,
  requestData
) {
  const checkbox = $("#" + checkboxId);
  const progressBar = $("#" + progressBarId);
  const progressMessage = $("#" + progressMessageId);
  const resendButtonId = "resend_" + checkboxId;
  let progressInterval;

  // Disable the submit button initially
  $('#submitBtn').hide();
  $('#submitBtn').prop('disabled', true);

  // Hide resend button initially
  $("#" + resendButtonId).hide();

  return new Promise((resolve) => {
    // Validate request data
    // if (!validateRequestData(requestData)) {
    //   updateUIOnError("Invalid data format.", progressBar, progressMessage, resendButtonId);
    //   resolve(0);
    //   return;
    // }

    if (checkbox.prop("checked")) {
      initializeProgressBar(progressBar, progressMessage, resendButtonId);

      checkbox.prop("disabled", true);

      // Perform initial API request
      sendApiRequest(apiUrl, requestData)
        .then((response) => {
          if (response.success) {
            pollApiAndUpdateProgress(
              checkboxId,
              progressBarId,
              progressMessageId,
              `${student_api_url}/student_detail_refresh_by_track_id`,
              response.log_id
            ).then(resolve);
          } else {
            updateUIOnError(`Error: ${response.message}`, progressBar, progressMessage, resendButtonId);
            resolve(0);
          }
        })
        .catch((xhr) => {
          updateUIOnError(`Error: ${xhr.status} - ${xhr.statusText}`, progressBar, progressMessage, resendButtonId);
          resolve(0);
        });

      // Attach resend button click handler
      // $("#" + resendButtonId).off("click").on("click", () => {
      //   $("#" + resendButtonId).hide();
      //   // alert(checkboxId);
      //   $('#'+checkboxId).prop("disabled", false);
      //   $('#'+checkboxId).data("id", 1);
      //   $('#submitBtn').prop("disabled",false);

      //   // startProgressBar(checkboxId, progressBarId, progressMessageId, apiUrl, requestData).then(resolve);
      // });
    } else {
      resolve(1); // Checkbox not checked, resolve as success
    }
  });
}

// Helper Functions
function validateRequestData(data) {
  // Add your data validation logic here
  return data && typeof data === "object";
}

function initializeProgressBar(progressBar, progressMessage, resendButtonId) {
  progressBar.css({ "background-color": "#0d6efd", width: "0%" });
  progressBar.parent().show();
  progressMessage.text("Loading...");
  $("#" + resendButtonId).hide();
}

function updateUIOnError(message, progressBar, progressMessage, resendButtonId) {
  progressBar.css({ "background-color": "red", width: "100%" });
  progressMessage.text(message);
  $("#" + resendButtonId).show();
}

function sendApiRequest(apiUrl, requestData) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: apiUrl,
      method: "POST",
      headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
      data: requestData,
      success: resolve,
      error: reject,
    });
  });
}

function pollApiAndUpdateProgress(
  checkboxId,
  progressBarId,
  progressMessageId,
  apiUrl,
  trackId
) {
  return new Promise((resolve) => {
    const progressBar = $("#" + progressBarId);
    const progressMessage = $("#" + progressMessageId);
    const resendButtonId = "resend_" + checkboxId;

    let progress = 0;
    const progressIncrement = 25;
    const pollingInterval = 4000;
    const maxRequests = 10;
    let requestCount = 0;
    let polling = true;  // Control flag for polling

    const poll = () => {
      if (!polling) return;  // If polling is stopped, exit early

      // Check if the maximum request count is reached
      if (requestCount >= maxRequests) {
        updateUIOnError("Maximum response reached, Please try again later.", progressBar, progressMessage, resendButtonId);
        resolve(0); // Resolve with an error state
        polling = false; // Stop polling
        return; // Stop further polling
      }

      // Make an AJAX call to check the process status
      sendApiRequest(apiUrl, { id: trackId })
        .then((response) => {
          if (response.success && response.data) {
            const { is_update, is_import, is_consolidate, is_rule_engine, status_code } = response.data;

            // If status_code is 2, stop polling immediately and exit the loop
            if (status_code === 2) {
              progressMessage.text("Completed: Data Updated Successfully!");
              progressBar.css("width", "100%"); // Ensure full progress bar
              resolve(1); // Resolve as success
              polling = false; // Stop polling
              return; // Exit early, stop further polling
            }

            // Update progress based on response
            if (is_update && progress < 25) progress += progressIncrement;
            if (is_import && progress < 50) progress += progressIncrement;
            if (is_consolidate && progress < 75) progress += progressIncrement;
            if (is_rule_engine && progress < 100) progress += progressIncrement;

            progressBar.css("width", `${progress}%`);

            // Update progress message based on the stage
            if (progress >= 100) {
              progressMessage.text("Completed: Data Updated Successfully!");
              resolve(1); // Resolve as success
              polling = false; // Stop polling
              return; // Exit early, stop further polling
            } else if (progress >= 75) {
              progressMessage.text("Processing: Eligibility Computing...");
            } else if (progress >= 50) {
              progressMessage.text("Processing: Consolidating data...");
            } else if (progress >= 25) {
              progressMessage.text("Processing: Importing data...");
            } else {
              progressMessage.text("Processing: Updating data...");
            }

            // Handle specific error scenarios
            if (status_code === 0) {
              let errorMessage = response?.data?.error || "Synchronization Error Please Try again Later.";

              // Check if it contains "DETAIL:"
              if (errorMessage.includes("DETAIL:")) {
                // Extract the part after "DETAIL:"
                const detail = errorMessage.split("DETAIL:")[1].trim();
                console.log("Detail:", detail);
                updateUIOnError("Error: " + detail, progressBar, progressMessage, resendButtonId);
              } else {
                // Just show the full error message
                updateUIOnError("Error: " + errorMessage, progressBar, progressMessage, resendButtonId);
              }
              resolve(0); // Resolve with an error state
              polling = false; // Stop polling
              return; // Stop further polling
            }
          } else {
            updateUIOnError("Invalid response from the server.", progressBar, progressMessage, resendButtonId);
            resolve(0); // Resolve with an error state
            polling = false; // Stop polling
            return; // Stop further polling
          }
        })
        .catch((xhr) => {
          updateUIOnError(`Error: ${xhr.status} - ${xhr.statusText}`, progressBar, progressMessage, resendButtonId);
          resolve(0); // Resolve with an error state
          polling = false; // Stop polling
          return; // Stop further polling
        });

      // Only continue polling if the process is not complete and polling is allowed
      requestCount++;
      if (polling && progress < 100) {
        setTimeout(poll, pollingInterval); // Continue polling after the interval
      }
    };

    poll(); // Start polling
  });
}


function validateRequestData(requestData) {
  // Add validation logic based on your specific data structure and requirements.
  // For example, checking that `student_id` is a valid number and `dropdown` is a non-empty string.

  if (
    !requestData ||
    !requestData.student_id ||
    isNaN(requestData.student_id) ||
    !requestData.dropdown ||
    typeof requestData.dropdown !== "string"
  ) {
    return false; // Invalid data
  }

  // Additional checks can be added if needed
  return true; // Valid data
}
// Adding Resend Button logic for all sections
function addResendButtons() {
  const sections = [
    "StudentDetailsCheckbox",
    "StudentContactDetailsCheckbox",
    "income_checkbox",
    "studentfamilyinfo_checkbox",
    "current_academic_info",
    "student_bank_account_details",
  ];

  // sections.forEach((section) => {
  //   const resendButtonId = "resend_" + section;
  //   if (!$("#" + resendButtonId).length) {
  //     $("#" + section).parent().append(`<button
  //   id="${resendButtonId}"
  //   class="resend-button"
  //   style="display: none;"
  // >
  //   <i class="bi bi-arrow-clockwise"></i> Retry
  // </button>`);
  //   }
  // });
}

// Call this function after the modal is loaded
addResendButtons();
const submitButton = $("#submitBtn");
const checkboxes = $(".form-check-input");

// Disable the submit button by default
submitButton.prop("disabled", true);

// Add an event listener for change events on checkboxes
checkboxes.on("change", function () {
  // Check if any checkbox is checked
  const isAnyChecked = checkboxes.is(":checked");

  // Enable or disable the submit button based on the checkbox state
  submitButton.prop("disabled", !isAnyChecked);
});

$("#submitBtn").click(async function () {
  const isAnyCheckboxChecked = $(".form-check-input:checked:not(:disabled)").length > 0;

  if (!isAnyCheckboxChecked) {
    swal({
      title: "No Selection!",
      text: "Please select at least one enabled option to proceed.",
      icon: "warning",
      button: "Ok",
    });
    return;
  }

  $(".form-check-input:checked:not(:disabled)").prop("disabled", true);

  // $('#closeModal').hide();
  // $('#reloadbtn').show();

  const student_id_ssp = $("#sspstud_id").val();
  console.log(student_id_ssp);
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
  const checked_checkbox = [];
  checkboxes.forEach(element => {
    const checkbox = $(`#${element.id}`);
    if (checkbox.prop("checked")) {
      checked_checkbox.push(element);
    }
  });

  if(checked_checkbox.length >1) {

    swal({
      title: "Multiple Selections Detected!",
      text: "To ensure optimal performance and avoid data conflicts, please select only one category at a time. You can refresh other categories after this process completes.",
      icon: "warning",
      button: "Okay, I'll Select One",
    });
    $(".form-check-input:checked").prop("checked", false);
    $(".form-check-input").attr("disabled", false);
    return;
  }

  console.log(checked_checkbox);

  for (const { id, progressId, messageId, dropdown } of checked_checkbox) {
    const checkbox = $(`#${id}`);
    if (checkbox.prop("checked")) {
      $('#submitbtn').hide();
      checkbox.data("id", 2);
      const error_check = await startProgressBar(
        id,
        progressId,
        messageId,
        student_api_url + "/student_detail_refresh",
        { student_id: student_id_ssp, dropdown }
      );
      await new Promise(resolve => setTimeout(resolve, 3000));
      if (error_check === 0) {
        error_check_count++;
      }
    }
  }

  if (error_check_count > 0) {
    // If there are errors, show retry option with the error count
    Swal.fire({
      icon: "error",
      title: `${error_check_count} errors occurred during processing.`,
      showConfirmButton: true,
      confirmButtonText: "Retry"
    })
    $('#submitBtn').show();
    // $('#submitBtn').text('Retry');
    $('#submitBtn').attr('disabled', false);
    $(".form-check-input:checked").prop("checked", false);
    $(".form-check-input").attr("disabled", false);
  } else {
    // If no errors, show confirmation and reload
    Swal.fire({
      icon: "success",
      title: "All tasks completed successfully!",
      confirmButtonText: "OK",
    }).then(() => {
      location.reload();
      
    });
  }

});
