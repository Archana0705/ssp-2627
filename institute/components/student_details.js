class StudentDetailsComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.studentDetailsModalInstance = null;
    this.applyModalInstance = null;
    this.otpModalInstance = null;
    this.eventListeners = []; // Store event listeners for cleanup
    this.countdown = null; // Move countdown to class level
    this.pdf_data = null;
  }

  // Helper function to format currency with rupee symbol and comma separation
  formatCurrency(amount) {
    if (amount == null || amount == undefined || amount == '') {
      return '-';
    }

    // Convert to number and check if it's valid
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      return '-';
    }

    // Format with comma separation and add rupee symbol
    return '₹' + numAmount.toLocaleString('en-IN');
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
      </style>
    `;

    // Only append modal HTML if it doesn't already exist
    if (!document.getElementById('studentDetailsModal')) {
      document.body.insertAdjacentHTML('beforeend', this.getModalHTML());
    }

    // Initialize modal instances
    const studentDetailsModalElement = document.getElementById('studentDetailsModal');
    const applyModalElement = document.getElementById('applyModal');
    const otpModalElement = document.getElementById('opt_modal');

    if (studentDetailsModalElement && !this.studentDetailsModalInstance) {
      this.studentDetailsModalInstance = new bootstrap.Modal(studentDetailsModalElement);
    }
    if (applyModalElement && !this.applyModalInstance) {
      this.applyModalInstance = new bootstrap.Modal(applyModalElement);
    }
    if (otpModalElement && !this.otpModalInstance) {
      this.otpModalInstance = new bootstrap.Modal(otpModalElement);
    }

    // Initialize event listeners
    this.initializeEventListeners();

    console.log('StudentDetailsComponent connected');
  }

  initializeEventListeners() {
    const addListener = (element, event, handler) => {
      element.addEventListener(event, handler);
      this.eventListeners.push({ element, event, handler });
    };

    // Application Decision Radio Buttons
    document.querySelectorAll('input[name="applicationDecision"]').forEach((radio) => {
      const handler = this.handleApplicationDecision.bind(this);
      addListener(radio, 'change', handler);
    });

    // OTP Modal Focus
    const otpModal = document.getElementById('opt_modal');
    const otp1 = document.getElementById('otp_input_1');
    if (otpModal && otp1) {
      const handler = () => otp1.focus();
      addListener(otpModal, 'shown.bs.modal', handler);
    }

    // Apply Button Consent
    const applyButton = document.getElementById('get_opt');
    const consentCheckbox = document.getElementById('applySchemeVerification');
    if (applyButton && consentCheckbox) {
      const handler = () => {
        applyButton.disabled = !consentCheckbox.checked;
      };
      addListener(consentCheckbox, 'change', handler);
    }

    // OTP Verify Button
    $(document).off('click', '#otp_verify').on('click', '#otp_verify', () => {
      this.handleOtpVerification();
    });

    // Applied Application PDF View
    $(document).off('click', '.applied_application').on('click', '.applied_application', function (event) {
      event.preventDefault();
      var pdfUrl = $(this).attr('data-filepath');
      var pdfUrl2 = pdfUrl;
      window.open(pdfUrl2, '_blank');
    });

    // Resend OTP
    $(document).off('click', '#requestAgain').on('click', '#requestAgain', () => {
      this.handleResendOtp();
    });

    // OTP Input Navigation
    const otpInputs = document.querySelectorAll('.otp-input');
    otpInputs.forEach((input, index) => {
      const inputHandler = (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 1);
        if (e.target.value.length == 1 && index < otpInputs.length - 1) {
          otpInputs[index + 1].removeAttribute('disabled');
          otpInputs[index + 1].focus();
        }
      };
      addListener(input, 'input', inputHandler);

      const keydownHandler = (e) => {
        if (e.key == 'Backspace' && e.target.value == '' && index > 0) {
          e.target.setAttribute('disabled', 'true');
          otpInputs[index - 1].focus();
          otpInputs[index - 1].value = '';
        }
      };
      addListener(input, 'keydown', keydownHandler);
    });

    $(document).off('click', '#about_scheme').on('click', '#about_scheme', function (event) {
      event.preventDefault();
      var schemeId = $(this).data('scheme-id');
      var scheme = schemesData.find(s => s.scheme_id == schemeId);
      var sub_scheme_id = $(this).data('sub-scheme-id');
      if (scheme) {
        var subscheme_id = scheme.scheme_rule_id;
        // Populate the modal with scheme details
        $('#scheme_info').find('#form-scheme_name').text(scheme.scheme_name || 'N/A');
        $('#scheme_info').find('#form-frequency').text(scheme.frequency || 'N/A');
        $('#scheme_info').find('#form-department_name').text(scheme.department_name || 'N/A');
        $('#scheme_info').find('#form-subdepartment_name').text(scheme.subdepartment_name || 'N/A');
        $('#scheme_info').find('#form-scheme_code').text(scheme.scheme_code || 'N/A');
        $('#scheme_info').find('#form-scheme_category').text(scheme.scheme_category || 'N/A');
        $('#scheme_info').find('#form-freezed').text(scheme.freezed ? 'Yes' : 'No');
        let id;
        if (typeof userId !== 'undefined' && userId) {
          id = userId;
        } else if (typeof stud_id !== 'undefined') {
          id = $('#sspstud_id').val();
        } else {
          // Handle the case where neither userId nor stud_id is defined
          id = null; // or some default value
        }
        const data = {
          scheme_id: schemeId,
          userId: id
        };
        encry_data = encryptData(data);
        // Make an API call to fetch additional details
        $.ajax({
          url: config.ssp_api_url + '/get_sub_scheme_list',
          type: 'POST',
          headers: {
            'X-APP-KEY': 'te$t',
            'X-APP-NAME': 'te$t'
          },
          data: {
            data: encry_data
          },
          success: function (response) {
            var decrypt_data = decryptData(response.data);
            response.data = decrypt_data;
            if (response.success == 1) {
              var filteredData = response.data.find(item => item.subscheme_id == subscheme_id);
              if (filteredData) {
                // Update the modal with sub-department details
                $('#scheme_info').find('#form-subscheme_name').text(filteredData.subscheme_name || 'N/A');
                $('#scheme_info').find('#form-scholarship_fee_type').text(filteredData.scholarship_fee_type || 'N/A');
                $('#scheme_info').find('#form-scholarhip_fee_amount').text(scheme.scholarship_amount || 'N/A');
                $('#scheme_info').find('#form-scholarhip_fee_percent').text(filteredData.scholarhip_fee_percent || 'N/A');
              }
              // You can update other fields similarly based on the API response
              var sub_scheme_id = subscheme_id;
              // Define a mapping of field names to their corresponding DOM element IDs
              const fieldMapping = {
                "Education": "#form-education",
                "InstituteOwnership": "#form-institute_ownership",
                "Institute": "#form-institute",
                "University": "#form-university",
                "Stream": "#form-stream",
                "CourseType": "#form-course_type",
                "MediumofInstruction": "#form-MediumofInstruction",
                "CourseGrp": "#form-CourseGrp",
                "Course": "#form-Course",
                "CourseCategory": "#form-CourseCategory",
                "CourseBr": "#form-CourseBr",
                "CourseYear": "#form-CourseYear",
                "AccrediationStatus": "#form-AccrediationStatus",
                "Caste": "#form-Caste",
                "Gender": "#form-Gender",
                "Income": "#form-Income",
                "IncomeValue": "#form-IncomeValue",
                "Quota": "#form-Quota",
                "SplCtg": "#form-SplCtg",
                "ModeOfStudy": "#form-ModeOfStudy",
                "ResidentalStatus": "#form-ResidentalStatus",
                "MaintanenceGrp": "#form-MaintanenceGrp",
                "DisabilityStatus": "#form-DisabilityStatus",
                "Religion": "#form-Religion",
                "Community": "#form-Community"
              };
              // Show all sections initially
              $('.mt-2.card').show();
              // Make an API call to fetch additional details
              const data = {
                scheme_id: schemeId,
                sub_scheme_id: sub_scheme_id
              };
              encry_data = encryptData(data);
              $.ajax({
                url: config.ssp_api_url + '/get_rule_condition',
                type: 'POST',
                headers: {
                  'X-APP-KEY': 'te$t',
                  'X-APP-NAME': 'te$t'
                },
                data: {
                  data: encry_data
                },
                success: function (ruleResponse1) {
                  const ruleResponse = decryptData(ruleResponse1.data);
                  if (ruleResponse.status == 1) {
                    // Track if any parameters in the section are populated
                    let sectionHasValues = {
                      "Institute Parameters": false,
                      "Course Parameters": false,
                      "Student Eligibility Parameters": false,
                      "Maintenance Parameters": false,
                      "Socio Economic Parameters": false
                    };

                    ruleResponse.fielddetails.forEach(function (field) {
                      if (fieldMapping[field.fieldname]) {
                        var $list = $('<ul class="parameter-list"></ul>'); // Create a new unordered list
                        field.fieldvalues.forEach(function (value) {
                          if (value.value !== "All" && value.text !== "All" && !(value.text == "-1" && value.value == "Not Applicable")) {
                            var listItem = $('<li class="parameter-items"></li>').text(value.value || value.text); // Create list items
                            $list.append(listItem); // Append the list item to the list
                          }
                        });

                        var $fieldContainer = $('#scheme_info').find(fieldMapping[field.fieldname]).closest('.mb-1'); // Get the parent container

                        // Check if the list is empty
                        if ($list.children().length == 0) {
                          $fieldContainer.hide(); // Hide the entire container (label + field)
                        } else {
                          $fieldContainer.show(); // Show the container if there are values
                          $fieldContainer.find('.parameters').html($list); // Update the content
                          sectionHasValues[getSectionTitle(field.fieldname)] = true; // Mark section as having values
                        }
                      }
                    });

                    // Hide sections if they don't have any values
                    for (const section in sectionHasValues) {
                      if (!sectionHasValues[section]) {
                        $('.mt-2.card:has(h6:contains("' + section + '"))').hide();
                      }
                    }
                  } else {
                    Object.keys(fieldMapping).forEach(function (fieldname) {
                      var $fieldContainer = $('#scheme_info').find(fieldMapping[fieldname]).closest('.mb-1');
                      $fieldContainer.hide(); // Hide all fields if there's an error
                    });
                  }
                }
              });
            } else {
              $('#scheme_info').find('#form-subscheme_name').text('-');
              $('#scheme_info').find('#form-scholarship_fee_type').text('-');
              $('#scheme_info').find('#form-scholarhip_fee_amount').text('-');
              $('#scheme_info').find('#form-scholarhip_fee_percent').text('-');
            }
          },
          error: function (xhr, status, error) {
            // Handle errors
            console.error('Failed to fetch sub-department details:', error);
            $('#scheme_info').find('#form-subscheme_name').text('Error fetching details');
          }
        });
        $('#scheme_info').modal('show'); // Show the modal
      } else {
        alert('Scheme details not found.');
      }
    });

    // Reset OTP inputs on modal open
    // if (otpInputs.length >1) {
    //   const handler = () => {
    //     otpInputs.forEach((input, idx) => {
    //       input.value = '';
    //       input.setAttribute('disabled', idx !== 0 ? 'true' : 'false');
    //     });
    //     otpInputs[0].focus();
    //   };
    //   addListener(otpModal, 'shown.bs.modal', handler);
    // }
  }

  handleApplicationDecision(event) {
    const consentText = document.getElementById('consentText');
    const notificationText = document.getElementById('notificationText');
    const button = document.getElementById('get_opt');
    const reasonContainer = document.getElementById('reasonContainer');

    if (event.target.value == 'notApply') {
      consentText.innerHTML = `
        I don't want to take the scholarship, even though I am eligible.
        <b>I confirm that I will not claim the benefit for this scheme.</b>
      `;
      notificationText.textContent = `
        I voluntarily agree to receive alerts and notifications via SMS and WhatsApp with my Aadhaar-based mobile number.
      `;
      button.textContent = `Submit`;
      reasonContainer.style.display = 'block';
    } else {
      consentText.innerHTML = `
          I have read and understood the eligibility and other conditions of award of Scholarship as per the scheme guidelines.
                            I understand that my application is liable to be rejected if I provide wrong Aadhaar number or Aadhaar number of someone else’s.
                            I understand that if more than one application is found to be made on-line, all my applications are liable to be rejected.
                            I understand that for any wrong entry of Bank-account details, the State Government will not be responsible for mis-credit and I will be held responsible for diversion of public money on this ground.
                            I have read the above statements & agree with the conditions. Further, I hereby state that I have no objection in authenticating myself with Demographic Aadhaar authentication system for the purpose of availing benefit of Scholarship.</b>
      `;
      notificationText.textContent = `
        I voluntarily agree to receive alerts and notifications via SMS and WhatsApp.
      `;
      button.textContent = `Apply`;
      reasonContainer.style.display = 'none';
    }
  }

  getModalHTML() {
    return `
      <style>
        :root {
          --primary-color: rgb(34, 25, 109);
          --text-color: #333;
          --value-color: #666;
          --background-color: #f0f2f5;
          --neumorphic-shadow: 3px 3px 6px rgba(0, 0, 0, 0.2), -3px -3px 6px rgba(255, 255, 255, 0.8);
        }

        #studentDetailsModal .modal.fade .modal-dialog {
          transform: translateY(-30px);
          opacity: 0;
          transition: transform 0.3s ease-out, opacity 0.3s ease;
        }
        #studentDetailsModal .modal.show .modal-dialog {
          transform: translateY(0);
          opacity: 1;
        }
        #studentDetailsModal .modal-content {
          border: none;
          border-radius: 12px;
          background: var(--background-color);
          box-shadow: var(--neumorphic-shadow);
          overflow: hidden;
        }
        #studentDetailsModal .modal-header {
          background: var(--primary-color);
          color: white;
          border-bottom: none;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        #studentDetailsModal .modal-title {
          font-size: 1.4rem;
          font-weight: 700;
        }
        #studentDetailsModal .btn-close {
          background: none;
          filter: brightness(0) invert(1);
          opacity: 0.7;
          transition: opacity 0.2s ease;
        }
        #studentDetailsModal .btn-close:hover {
          opacity: 1;
        }
        #studentDetailsModal .modal-body {
          padding: 1rem;
        }
        #studentDetailsModal .section-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--primary-color);
          margin: 1rem 0 0.5rem;
          border-bottom: 2px solid var(--primary-color);
          padding-bottom: 0.3rem;
        }
        #studentDetailsModal .detail-card {
          background: white;
          border-radius: 8px;
          padding: 0.5rem;
          margin-bottom: 0.5rem;
          box-shadow: var(--neumorphic-shadow);
        }
        #studentDetailsModal .student-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
        }
        @media (max-width: 768px) {
          #studentDetailsModal .student-details-grid {
            grid-template-columns: 1fr;
          }
        }
        #studentDetailsModal .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 0.3rem 0;
        }
        #studentDetailsModal .detail-label {
          font-weight: 600;
          color: var(--text-color);
          flex: 0 0 40%;
        }
        #studentDetailsModal .detail-value {
          color: var(--value-color);
          flex: 1;
          text-align: right;
        }
        #studentDetailsModal .modal-footer {
          border-top: none;
          padding: 1rem;
          background: var(--background-color);
          display: flex;
          gap: 0.4rem;
        }
        #studentDetailsModal .btn {
          padding: 0.4rem 1rem;
          border-radius: 5px;
          font-weight: 600;
          transition: transform 0.2s, box-shadow 0.2s;
          border: none;
        }
        #studentDetailsModal .btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--neumorphic-shadow);
        }
        #studentDetailsModal .btn-primary {
          background: var(--primary-color);
          color: white;
        }
        #studentDetailsModal .btn-info {
          background: #17a2b8;
          color: white;
        }
        #studentDetailsModal .btn-secondary {
          background: #6c757d;
          color: white;
        }

        #applyModal .modal.fade .modal-dialog {
          transform: translateY(-30px);
          opacity: 0;
          transition: transform 0.3s ease-out, opacity 0.3s ease;
        }
        #applyModal .modal.show .modal-dialog {
          transform: translateY(0);
          opacity: 1;
        }
        #applyModal .modal-content {
          border: none;
          border-radius: 12px;
          background: var(--background-color);
          box-shadow: var(--neumorphic-shadow);
          overflow: hidden;
        }
        #applyModal .modal-header {
          background: var(--primary-color);
          color: white;
          border-bottom: none;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        #applyModal .modal-title {
          font-size: 1.4rem;
          font-weight: 700;
        }
        #applyModal .btn-close {
          background: none;
          filter: brightness(0) invert(1);
          opacity: 0.7;
          transition: opacity 0.2s ease;
        }
        #applyModal .btn-close:hover {
          opacity: 1;
        }
        #applyModal .modal-body {
          padding: 1rem;
        }
        #applyModal .section-header {
          background: var(--primary-color);
          color: white;
          padding: 0.5rem;
          border-radius: 5px 5px 0 0;
          margin-bottom: 0.5rem;
        }
        #applyModal .section-content {
          background: white;
          border-radius: 0 0 5px 5px;
          padding: 0.5rem;
          box-shadow: var(--neumorphic-shadow);
          margin-bottom: 1rem;
        }
        #applyModal .detail-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          padding: 0.3rem 0;
        }
        #applyModal .detail-label {
          font-weight: 600;
          color: var(--text-color);
        }
        #applyModal .detail-value {
          color: var(--value-color);
          text-align: right;
        }
        #applyModal .form-group {
          margin-bottom: 0.5rem;
        }
        #applyModal .form-control {
          border-radius: 5px;
          padding: 0.4rem;
          font-size: 0.9rem;
          border: 1px solid #ccc;
        }
        #applyModal .btn {
          padding: 0.4rem 1rem;
          border-radius: 5px;
          font-weight: 600;
          transition: transform 0.2s, box-shadow 0.2s;
          border: none;
        }
        #applyModal .btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--neumorphic-shadow);
        }
        #applyModal .btn-primary {
          background: var(--primary-color);
          color: white;
        }
        #applyModal .radio-group {
          display: flex;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }
        #applyModal .consent-text {
          font-size: 0.9rem;
          color: var(--text-color);
          margin-bottom: 0.5rem;
        }
        #applyModal .form-check {
          margin: 0.5rem 0;
        }
        #applyModal .sectionSeparate {
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: white;
          border-radius: 8px;
          box-shadow: var(--neumorphic-shadow);
        }
        #applyModal h6 {
          
          font-weight: 600;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        #applyModal .form-group ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        #applyModal .form-group li {
          margin-bottom: 0.3rem;
        }
        @media (max-width: 768px) {
          #applyModal .detail-row {
            grid-template-columns: 1fr;
          }
          #applyModal .col-lg-3,
          #applyModal .col-lg-4 {
            width: 100% !important;
            float: none !important;
          }
        }

        #opt_modal .modal-content {
          border: none;
          border-radius: 12px;
          background: var(--background-color);
          box-shadow: var(--neumorphic-shadow);
        }
        #opt_modal .modal-header {
          background: var(--primary-color);
          color: white !important;
          border-bottom: none;
          padding: 1rem;
        }
        #opt_modal .modal-title {
          font-size: 1.4rem;
          font-weight: 700;
        }
        #opt_modal .btn-close {
          filter: brightness(0) invert(1);
          opacity: 0.7;
        }
        #opt_modal .btn-close:hover {
          opacity: 1;
        }
        #opt_modal .modal-body {
          padding: 1rem;
          text-align: center;
        }
        #opt_modal .otp-input {
          width: 40px;
          text-align: center;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 5px;
          margin: 0 5px;
        }
        #opt_modal .resend {
          margin-top: 1rem;
          font-size: 0.9rem;
        }
        #opt_modal .modal-footer {
          border-top: none;
          padding: 1rem;
          justify-content: center;
        }


       .swal2-html-container{


        display : flex;
        flex-wrap : nowrap;
        overflow-x :auto
        }

      /* LOADER OVERLAY */
.modal-loader{
  position:absolute;
  inset:0;
  background:rgba(255,255,255,0.85);
  backdrop-filter: blur(4px);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:10;

  opacity:0;
  pointer-events:none;
  transition:all .3s ease;
}

.modal-loader.active{
  opacity:1;
  pointer-events:auto;
}

/* loader card */
.loader-card{
  background:#fff;
  padding:24px 30px;
  border-radius:14px;
  box-shadow:0 20px 50px rgba(0,0,0,0.1);
  text-align:center;
  width:260px;
}

/* spinning icon */
.loader-icon{
  font-size:26px;
  color:#5b5fc7;
  animation:spin 1s linear infinite;
}

@keyframes spin{
  100%{ transform:rotate(360deg); }
}

/* progress bar */
.progress{
  height:8px;
  border-radius:10px;
  background:#eef1f6;
}

.progress-bar{
  background:linear-gradient(90deg,#6366f1,#8b5cf6);
  font-size:11px;
  line-height:8px;
  text-align:center;
  transition:width .2s ease;
}

/* SUCCESS TOAST */
.modal-success{
  position:absolute;
  bottom:20px;
  right:20px;

  background:#10b981;
  color:#fff;
  padding:10px 16px;
  border-radius:8px;
  display:flex;
  align-items:center;
  gap:8px;

  box-shadow:0 10px 25px rgba(0,0,0,0.15);

  opacity:0;
  transform:translateY(10px);
  transition:all .3s ease;
}

.modal-success.show{
  opacity:1;
  transform:translateY(0);
}


      </style>

      <div class="modal fade" id="studentDetailsModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" role="dialog" aria-labelledby="studentDetailsModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="studentDetailsModalLabel" style="color: white !important;">Student Profile</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" style="color: white !important;">X</button>
            </div>
            <div class="modal-body">
              <div class="section-title">Student Details</div>
              <div class="detail-card student-details-grid">
              <input type="text" id="sspstud_id" value="" hidden>
                <div class="detail-row"><span class="detail-label">Name:</span><span class="detail-value" id="modal_student_name">-</span></div>
                <div class="detail-row"><span class="detail-label">Gender:</span><span class="detail-value" id="modal_gender">-</span></div>
                <div class="detail-row"><span class="detail-label">Religion:</span><span class="detail-value" id="modal_religion">-</span></div>
                <div class="detail-row"><span class="detail-label">Community <i class="" id="community_verify"></i>:</span><span class="detail-value" id="modal_community">-</span></div>
                <div class="detail-row"><span class="detail-label">Caste:</span><span class="detail-value" id="modal_caste">-</span></div>
                <div class="detail-row"><span class="detail-label">First Graduate:</span><span class="detail-value" id="modal_first_graduate">-</span></div>
                <div class="detail-row"><span class="detail-label">Family Income <i class="" id="income_verify"></i> :</span><span class="detail-value" id="modal_income">-</span></div>
                <div class="detail-row"><span class="detail-label">Disability:</span><span class="detail-value" id="modal_isdifferentlyabled">-</span></div>
                <div class="detail-row"><span class="detail-label">Aadhaar No <i class="" id="aadhar_verify"></i> :</span><span class="detail-value" id="modal_aadhaar_no">-</span></div>
                <div class="detail-row"><span class="detail-label">EMIS No:</span><span class="detail-value" id="modal_emis_no">-</span></div>
                <div class="detail-row"><span class="detail-label">UMIS No:</span><span class="detail-value" id="modal_umis_no">-</span></div>
                <div class="detail-row"><span class="detail-label">Institute Name:</span><span class="detail-value" id="modal_institution_name">-</span></div>
                <div class="detail-row"><span class="detail-label">Course Name:</span><span class="detail-value" id="modal_course_name">-</span></div>
                <div class="detail-row"><span class="detail-label">Course Branch:</span><span class="detail-value" id="modal_course_branch_name">-</span></div>
                <div class="detail-row"><span class="detail-label">Course Year:</span><span class="detail-value" id="modal_studying_year">-</span></div>
                <div class="detail-row"><span class="detail-label">Academic Year:</span><span class="detail-value" id="modal_accademic_year_id"></span></div>
              </div>
              <div class="section-title scheme_details_card">Scheme Details</div>
              <div class="detail-card scheme_details_card" id="scheme_details_card">
                <table class="table table-bordered" id="scheme_table">
                  <thead>
                    <tr>
                      <th style="width:40px;text-align:center;"><input type="checkbox" id="select_all_schemes"></th>
                      <th>Scheme Name</th>
                      <th>Scholarship Amount</th>
                      <th>Maintainance Amount</th>
                      <th>Disability Amount</th>
                      <th>Scheme Type</th>
                   
                    </tr>
                  </thead>
                  <tbody id="scheme_table_body">
                    <!-- Scheme rows will be injected here -->
                  </tbody>
                </table>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" id="modal_apply_button">Apply</button>
              <button type="button" class="btn btn-info" id="modal_sync_button">Refresh</button> 
            </div>
          </div>
        </div>
      </div>

      <div class="modal fade" id="applyModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" role="dialog" aria-labelledby="modalTitleId" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-xl" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" style="color: white !important;">Tamil Nadu Integrated State Scholarship Portal</h5>
              <button type="button" class="btn-close applymodal_close" data-bs-dismiss="modal" aria-label="Close" style="color: white !important;">X</button>
            </div>
            <div class="modal-body">
              <div class="applyScreen">
                <div class="container" style="max-width: 1320px;">
                  <div class="row" style="display: flex; justify-content: center; align-items: center;">
                    <div class="tnLogo col-lg-12" style="text-align: center;">
                      <img src="../assets/img/tn_logo.png" alt="tnLogo" style="display: block; margin: 0 auto; width: 50px;">
                      <h5>Tamil Nadu Integrated State Scholarship Portal</h5>
                    </div>
                  </div>
                  <div class="sectionSeparate row">
                    <h6><i class="bi bi-person-circle"></i> STUDENT DETAILS</h6>
                    <div class="col-lg-3" style="width: 25%; float: left;">
                      <form class="">
                        <div class="form-group marBtm">
                          <ul>
                            <li><label for="dept">Student Name:</label></li>
                            <li><label for="dept"><b id="apply_studentName">-</b></label></li>
                          </ul>
                        </div>
                      </form>
                    </div>
                    <div class="col-lg-3" style="width: 25%; float: left;">
                      <form class="">
                        <div class="form-group marBtm">
                          <ul>
                            <li><label for="dept">Emis Id:</label></li>
                            <li><label for="dept"><b id="apply_emis_id">-</b></label></li>
                          </ul>
                        </div>
                      </form>
                    </div>
                    <div class="col-lg-3" style="width: 25%; float: left;">
                      <form class="">
                        <div class="form-group marBtm">
                          <ul>
                            <li><label for="dept">Umis Id:</label></li>
                            <li><label for="dept"><b id="apply_umis_id">-</b></label></li>
                          </ul>
                        </div>
                      </form>
                    </div>
                    <div class="col-lg-3" style="width: 25%; float: left;">
                      <form class="">
                        <div class="form-group marBtm">
                          <ul>
                            <li><label for="dept">Nationality:</label></li>
                            <li><label for="dept"><b id="apply_nationality">Indian</b></label></li>
                          </ul>
                        </div>
                      </form>
                    </div>
                    <div class="col-lg-3" style="width: 25%; float: left;">
                      <form class="">
                        <div class="form-group marBtm">
                          <ul>
                            <li><label for="dept">Religion:</label></li>
                            <li><label for="dept"><b id="apply_religion">-</b></label></li>
                          </ul>
                        </div>
                      </form>
                    </div>
                    <div class="col-lg-3" style="width: 25%; float: left;">
                      <form class="">
                        <div class="form-group marBtm">
                          <ul>
                            <li><label for="dept">Community:</label></li>
                            <li><label for="dept"><b id="apply_community">-</b></label></li>
                          </ul>
                        </div>
                      </form>
                    </div>
                    <div class="col-lg-3" style="width: 25%; float: left;">
                      <form class="">
                        <div class="form-group marBtm">
                          <ul>
                            <li><label for="dept">Caste:</label></li>
                            <li><label for="dept"><b id="apply_caste">-</b></label></li>
                          </ul>
                        </div>
                      </form>
                    </div>
                    <div class="col-lg-3" style="width: 25%; float: left;">
                      <form class="">
                        <div class="form-group marBtm">
                          <ul>
                            <li><label for="dept">Phone no:</label></li>
                            <li><label for="dept"><b id="apply_phone">-</b></label></li>
                          </ul>
                        </div>
                      </form>
                    </div>
                    <div class="col-lg-3" style="width: 25%; float: left;">
                      <form class="">
                        <div class="form-group marBtm">
                          <ul>
                            <li><label for="dept">Aadhar no:</label></li>
                            <li><label for="dept"><b id="apply_aadhar">-</b></label></li>
                          </ul>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div class="sectionSeparate row">
                    <h6>SELECTED SCHEME DETAILS</h6>
                    <div id="apply_scheme_details"></div>
                  </div>
                  <div class="sectionSeparate row">
                    <h6><i class="bi bi-building"></i> ACADEMIC DETAILS</h6>
                    <div class="col-lg-3" style="width: 25%; float: left;">
                      <form class="">
                        <div class="form-group marBtm">
                          <ul>
                            <li><label for="dept">Academic Year:</label></li>
                            <li><label for="dept"><b id="apply_academic_year">-</b></label></li>
                          </ul>
                        </div>
                      </form>
                    </div>
                    <div class="col-lg-3" style="width: 25%; float: left;">
                      <form class="">
                        <div class="form-group marBtm">
                          <ul>
                            <li><label for="dept">Course:</label></li>
                            <li><label for="dept"><b id="apply_course">-</b></label></li>
                          </ul>
                        </div>
                      </form>
                    </div>
                    <div class="col-lg-3" style="width: 25%; float: left;">
                      <form class="">
                        <div class="form-group marBtm">
                          <ul>
                            <li><label for="dept">Course Branch:</label></li>
                            <li><label for="dept"><b id="apply_course_branch">-</b></label></li>
                          </ul>
                        </div>
                      </form>
                    </div>
                    <div class="col-lg-3" style="width: 25%; float: left;">
                      <form class="">
                        <div class="form-group marBtm">
                          <ul>
                            <li><label for="dept">Course Year:</label></li>
                            <li><label for="dept"><b id="apply_year">-</b></label></li>
                          </ul>
                        </div>
                      </form>
                    </div>
                    <div class="col-lg-3" style="width: 25%; float: left;">
                      <form class="">
                        <div class="form-group marBtm">
                          <ul>
                            <li><label for="dept">Medium Of Instruction:</label></li>
                            <li><label for="dept"><b id="apply_moi">-</b></label></li>
                          </ul>
                        </div>
                      </form>
                    </div>
                    <div class="col-lg-3" style="width: 25%; float: left;">
                      <form class="">
                        <div class="form-group marBtm">
                          <ul>
                            <li><label for="dept">Mode Of Study:</label></li>
                            <li><label for="dept"><b id="apply_mos">-</b></label></li>
                          </ul>
                        </div>
                      </form>
                    </div>
                    
                    <div class="col-lg-3" style="width: 25%; float: left;">
                      <form class="">
                        <div class="form-group marBtm">
                          <ul>
                            <li><label for="dept">Hosteller:</label></li>
                            <li><label for="dept"><b id="apply_hosteller">-</b></label></li>
                          </ul>
                        </div>
                      </form>
                    </div>
                    <div class="col-lg-3" style="width: 25%; float: left;">
                      <form class="">
                        <div class="form-group marBtm">
                          <ul>
                            <li><label for="dept">Current Status Of The Student:</label></li>
                            <li><label for="dept"><b id="apply_studentsts">Studying in this institute</b></label></li>
                          </ul>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div class="sectionSeparate row">
                    <h6><i class="bi bi-file-earmark-text"></i> APPLICATION CONFIRMATION</h6>
                    <div class="col-lg-12">
                      <form class="">
                        <div class="form-group text-center">
                          <ul>
                            <label class="me-3">
                              <input type="radio" name="applicationDecision" value="apply" checked />
                              Yes, I want to apply
                            </label>
                            <label class="me-3">
                              <input type="radio" name="applicationDecision" value="notApply" />
                              No, I don't want to apply
                            </label>
                          </ul>
                        </div>
                      </form>
                    </div>
                    <div id="reasonContainer" style="display: none; margin-top: 10px;">
                      <div class="row mb-3">
                        <div class="col-lg-6">
                          <div class="form-group">
                            <label for="notApplyReason">Reason</label>
                            <select class="form-control" id="notApplyReason">
                              <option value="" selected disabled>Select a reason</option>
                              <option value="Getting Other Scheme">Getting Other Scheme</option>
                              <option value="Other Social Reason">Other Social Reason</option>
                              <option value="Income is Greater">Income is Greater</option>
                              <option value="Not Interested">Not Interested</option>
                            </select>
                          </div>
                        </div>
                        <div class="col-lg-6">
                          <div class="form-group">
                            <label for="notApplyDescription">Description</label>
                            <input type="text" class="form-control" id="notApplyDescription" placeholder="Describe your reason in detail" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-2"></div>
                    <div class="consentDec col-lg-8">
                      <h5 class="text-center">CONSENT DECLARATION</h5>
                      <div class="card sectionSeparate">
                        <div class="card-body">
                          <div class="declaration">
                            <p id="consentText">
                            I have read and understood the eligibility and other conditions of award of Scholarship as per the scheme guidelines.
                            I understand that my application is liable to be rejected if I provide wrong Aadhaar number or Aadhaar number of someone else’s.
                            I understand that if more than one application is found to be made on-line, all my applications are liable to be rejected.
                            I understand that for any wrong entry of Bank-account details, the State Government will not be responsible for mis-credit and I will be held responsible for diversion of public money on this ground.
                            I have read the above statements & agree with the conditions. Further, I hereby state that I have no objection in authenticating myself with Demographic Aadhaar authentication system for the purpose of availing benefit of Scholarship.
                            </p>
                            <p id="notificationText">
                              I voluntarily agree to receive alerts and notifications via SMS and WhatsApp.
                            </p>
                            <div class="text-center">
                              <div class="form-check">
                                <label class="form-check-label" for="applySchemeVerification">
                                  <input class="form-check-input" type="checkbox" value="1" id="applySchemeVerification" />
                                  I Agree to these conditions
                                </label>
                              </div>
                            </div>
                            <div class="applyCancleCta text-center">
                              <button class="btn btn-primary" id="get_opt" disabled>Apply</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-2"></div>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal fade" id="opt_modal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" role="dialog" aria-labelledby="otpModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="otpModalLabel" style="color: white !important;">Enter OTP</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>Enter the OTP sent to your registered mobile number (<span class="otp_mobile_number">-</span>)</label>
                <div class="d-flex gap-2 justify-content-center">
                  <input type="text" class="form-control text-center otp-input" id="otp_input_1" maxlength="1" style="width: 40px;" autocomplete="off">
                  <input type="text" class="form-control text-center otp-input" id="otp_input_2" maxlength="1" style="width: 40px;" autocomplete="off" disabled>
                  <input type="text" class="form-control text-center otp-input" id="otp_input_3" maxlength="1" style="width: 40px;" autocomplete="off" disabled>
                  <input type="text" class="form-control text-center otp-input" id="otp_input_4" maxlength="1" style="width: 40px;" autocomplete="off" disabled>
                  <input type="text" class="form-control text-center otp-input" id="otp_input_5" maxlength="1" style="width: 40px;" autocomplete="off" disabled>
                  <input type="text" class="form-control text-center otp-input" id="otp_input_6" maxlength="1" style="width: 40px;" autocomplete="off" disabled>
                </div>
                <p class="resend text-muted mb-0">
                  Didn't receive code? <span id="resendTimer">3:00</span> <a href="#" id="requestAgain" style="display: none;">Resend OTP</a>
                </p>
              </div>
            </div>
            <input type="hidden" id="page_type" value='institute'>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" id="otp_verify">Verify</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async getStudentDetails(umis_no, student_id, scheme_ruleid, type) {
    $('#preloader1').show();
    try {
      let encryptDatas = { student_id: umis_no, scheme_ruleid: scheme_ruleid };
      if (type == 'check_eligibility') {
        encryptDatas = { student_id: umis_no, scheme_ruleid: scheme_ruleid, iseligibile: false };
      }

      const response = await $.ajax({
        url: config.ssp_api_url + '/get_student_details',
        type: 'POST',
        headers: { 'X-APP-KEY': 'te$t', 'X-APP-NAME': 'te$t' },
        data: { data: encryptData(encryptDatas) },
      });

      if (response.success == 1) {
        const decryptedData = decryptData(response.data);
        this.showStudentDetailsModal(decryptedData, type);
        $('#preloader1').hide();
        return decryptedData;
      } else {
        $('#preloader1').hide();
        this.showStudentDetailsModal(response.data, type);
        return response.data;
      }

    } catch (error) {
      $('#preloader1').hide();
      console.error('Error fetching student details:', error);
      Swal.fire({
        title: 'Error',
        text: 'Unable to fetch student details. Please try again later.',
        icon: 'error',
        showConfirmButton: true,
      });
    }
  }


  showApplyModal(data, type, checkboxClass) {
    console.log("data", data);
    // Use the first selected scheme for student details
    const schemes = data.selected_schemes || [data.student_details];
    const firstScheme = Array.isArray(schemes) ? schemes[0] : schemes;

    // Student details fields (use first selected scheme)
    const applyFields = [
      { id: 'apply_studentName', key: 'student_name' },
      { id: 'apply_emis_id', key: 'emis_no' },
      { id: 'apply_umis_id', key: 'umis_no' },
      { id: 'apply_religion', key: 'religion' },
      { id: 'apply_community', key: 'community' },
      { id: 'apply_caste', key: 'caste' },
      { id: 'apply_aadhar', key: 'aadhaar_no', format: (val) => val ? `********${val.slice(-4)}` : '-' },
      { id: 'apply_phone', key: 'mobile_no' },
      { id: 'apply_schemename', key: 'scheme_name' },
      // { id: 'apply_sub_schemename', key: 'sub_scheme_name' },
      { id: 'apply_academic_year', key: 'academicyear' },
      { id: 'apply_course', key: 'course_name' },
      { id: 'apply_course_branch', key: 'course_branch_name' },
      { id: 'apply_year', key: 'studying_year' },
      { id: 'apply_moi', key: 'mediumname' },
      { id: 'apply_mos', key: 'modeofstudy' },
      // { id: 'apply_doa', key: 'date_of_admission' },
      { id: 'apply_scheme_amount', key: 'scholarshipamount', format: (val) => this.formatCurrency(val) },
      { id: 'apply_hosteller', key: 'is_hosteler', format: (val) => val ? 'Yes' : 'No' },
    ];

    const missingElements = [];

    applyFields.forEach(({ id, key, format }) => {
      const element = document.getElementById(id);
      if (element) {
        // Use first scheme for student details
        const value = firstScheme?.student_details?.[key] ?? firstScheme?.eligibility?.[key] ?? firstScheme[key];
        element.textContent = value != null ? (format ? format(value) : value.toString()) : '-';
      } else {
        missingElements.push(id);
      }
    });
    $('#about_scheme').data('scheme-id', firstScheme.student_details?.scheme_id || firstScheme.scheme_id);

    if (missingElements.length > 0) {
      console.error(`Missing apply modal elements: ${missingElements.join(', ')}`);
    }

    // Render selected schemes as a table
    const schemeDetailsHtml = schemes.map(scheme => `
      <tr>
        <td>${scheme.scheme_name || '-'}</td>
        <td>${this.formatCurrency(scheme.scholarshipamount)}</td>
        <td>${this.formatCurrency(scheme.maintenanceamount)}</td>
        <td>${this.formatCurrency(scheme.disabilityamout)}</td>
        <td>${scheme.schemetype || '-'}</td>
      </tr>
    `).join('');

    const schemeTableHtml = `
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Scheme Name</th>
            <th>Scholarship Amount</th>
            <th>Maintenance Amount</th>
            <th>Disability Amount</th>
            <th>Scheme Type</th>
          
          </tr>
        </thead>
        <tbody>
          ${schemeDetailsHtml}
        </tbody>
      </table>
    `;

    // Insert into the modal (find a suitable place in the modal HTML)
    const schemeDetailsDiv = document.getElementById('apply_scheme_details');
    if (schemeDetailsDiv) {
      schemeDetailsDiv.innerHTML = schemeTableHtml;
    }

    const applyModalElement = document.getElementById('applyModal');
    if (applyModalElement) {
      this.applyModalInstance = new bootstrap.Modal(applyModalElement);
      this.applyModalInstance.show();

      // Set default state when modal opens
      this.setApplyModalDefaultState();

      $('#applyModal').off('click', '#get_opt').on('click', '#get_opt', () => {
        this.handleApplyButton(data, type, checkboxClass);
      });
    } else {
      console.error('Apply modal element with ID "applyModal" not found in DOM');
      Swal.fire({
        title: 'Error',
        text: 'Error opening application form.',
        icon: 'error',
        showConfirmButton: true,
      });
    }
  }

  showStudentDetailsModal(data, type) {
    console.log('Showing student details modal:', data);

    if (!data?.student_details || !Array.isArray(data.student_details) || data.student_details.length == 0) {
      console.error('Invalid or empty student_details data');
      Swal.fire({
        title: 'Error',
        text: 'No student details available.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    // Define fields for student and scheme details
    const studentFields = [
      { id: 'modal_student_name', key: 'student_name' },
      { id: 'modal_gender', key: 'gender' },
      { id: 'modal_religion', key: 'religion' },
      { id: 'modal_community', key: 'community' },
      { id: 'modal_caste', key: 'caste' },
      { id: 'modal_first_graduate', key: 'is_first_graduate', format: (val) => val ? 'Yes' : 'No' },
      { id: 'modal_income', key: 'income' },
      { id: 'modal_isdifferentlyabled', key: 'isdifferentlyabled', format: (val) => val ? 'Yes' : 'No' },
      { id: 'modal_aadhaar_no', key: 'aadhaar_no', format: (val) => val ? `********${val.slice(-4)}` : '-' },
      { id: 'modal_emis_no', key: 'emis_no' },
      { id: 'modal_umis_no', key: 'umis_no' },
      { id: 'modal_institution_name', key: 'institution_name' },
      { id: 'modal_course_name', key: 'course_name' },
      { id: 'modal_course_branch_name', key: 'course_branch_name' },
      { id: 'modal_studying_year', key: 'studying_year' },
      { id: 'modal_accademic_year_id', key: 'academicyear' },
    ];

    const schemeFields = [
      { id: 'modal_scheme_name', key: 'scheme_name' },
      {
        id: 'modal_scholarship_amount',
        key: 'scholarshipamount',
        format: (val) => (this.formatCurrency ? this.formatCurrency(val) : val.toString())
      },
      { id: 'modal_eligibility', key: 'fn_check_studentapply_eligibility', format: (val) => val ? 'Eligible' : 'Not Eligible' },
      { id: 'modal_eligibility_message', key: 'message' },
    ];

    const missingElements = [];

    // Populate student fields
    studentFields.forEach(({ id, key, format }) => {
      const element = document.getElementById(id);
      if (element) {
        const value = data.student_details[0][key];
        element.textContent = value != null ? (format ? format(value) : value.toString()) : '-';
      } else {
        missingElements.push(id);
      }
    });

    // Populate scheme fields
    schemeFields.forEach(({ id, key, format }) => {
      const element = document.getElementById(id);
      if (element) {
        const value = data.student_details[0][key] ?? data.eligibility?.[key];
        element.textContent = value != null ? (format ? format(value) : value.toString()) : '-';
        if (value == 'Not Eligible') {
          $('.eligible_card').show();
        }
      } else {
        missingElements.push(id);
      }
    });

    // Set data attributes and student ID
    $('#about_scheme').data('scheme-id', data.student_details[0].scheme_id || '');
    $('#about_scheme').data('sub-scheme-id', data.student_details[0].scheme_ruleid || '');
    $('#sspstud_id').val(data.student_details[0].student_id || '');

    // Handle certificate verification icons
    const updateVerificationIcon = (elementId, isVerified) => {
      const element = $(`#${elementId}`);
      element.removeClass('bi-x-circle-fill text-danger bi-patch-check-fill text-success');
      element.addClass(isVerified ? 'bi bi-patch-check-fill text-success' : 'bi bi-x-circle-fill text-danger');
    };
    updateVerificationIcon('community_verify', data.student_details[0].community_certificate_verified);
    updateVerificationIcon('income_verify', data.student_details[0].income_certificate_verified);
    updateVerificationIcon('aadhar_verify', data.student_details[0].aadhaar_verified);

    // Log missing elements
    if (missingElements.length > 0) {
      console.error(`Missing apply modal elements: ${missingElements.join(', ')}`);
    }

    const applyButton = document.getElementById('modal_apply_button');
    const syncButton = document.getElementById('modal_sync_button');
    const schemeTableBody = document.getElementById('scheme_table_body');

    if (!applyButton) {
      console.error('Apply button (#modal_apply_button) not found in DOM');
    }
    if (!schemeTableBody) {
      console.error('Scheme table body (#scheme_table_body) not found in DOM');
    }

    // Render schemes in the table
    if (schemeTableBody) {
      schemeTableBody.innerHTML = '';
      data.student_details.forEach((scheme, idx) => {
        const isApplied = scheme.is_applied === true || scheme.is_applied === 'true';
        const row = document.createElement('tr');
        row.setAttribute('data-scheme-id', scheme.scheme_id || '');
        row.innerHTML = `
          <td style="text-align:center;">
            <input type="checkbox" class="scheme_inclusive_checkbox" data-idx="${idx}" data-scheme-id="${scheme.scheme_id || ''}" data-scheme-ruleid="${scheme.scheme_ruleid || ''}" ${isApplied ? 'disabled' : ''}>
          </td>
          <td>${scheme.scheme_name || '-'}</td>
          <td>${this.formatCurrency ? this.formatCurrency(scheme.scholarshipamount) : scheme.scholarshipamount || '-'}</td>
          <td>${this.formatCurrency ? this.formatCurrency(scheme.maintenanceamount) : scheme.maintenanceamount || '-'}</td>
          <td>${this.formatCurrency ? this.formatCurrency(scheme.disabilityamout) : scheme.disabilityamout || '-'}</td>
          <td>${scheme.schemetype || '-'}</td>
         
        `;
        schemeTableBody.appendChild(row);
      });
    }

    // Determine the most restrictive scheme type
    const types = data.student_details
      .map(s => (s.schemetype || '').toLowerCase())
      .filter(Boolean);
    let schemeType = 'inclusive';
    if (types.includes('exclusive')) {
      schemeType = 'exclusive';
    } else if (types.includes('exclusive with exceptions')) {
      schemeType = 'exclusive with exceptions';
    } else if (types.length > 0 && types.every(t => t == 'inclusive')) {
      schemeType = 'inclusive';
    } else if (types.length > 0) {
      console.warn('Mixed or invalid scheme types detected, defaulting to inclusive');
    }

    // Handle checkbox behavior
    const checkboxes = document.querySelectorAll('.scheme_inclusive_checkbox');
    const selectAll = document.getElementById('select_all_schemes');

    // Update button states
    const updateButtonState = () => {
      const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
      if (applyButton) applyButton.disabled = !anyChecked;
    };

    // Remove existing event listeners to prevent duplicates
    checkboxes.forEach(cb => {
      const newCb = cb.cloneNode(true);
      cb.replaceWith(newCb);
    });

    // Re-query checkboxes after cloning
    const newCheckboxes = document.querySelectorAll('.scheme_inclusive_checkbox');

    // Handle "Select All" logic
    if (selectAll) {
      selectAll.onclick = () => {
        if (schemeType == 'exclusive' || schemeType == 'exclusive with exceptions') {
          selectAll.checked = false;
          Swal.fire({
            title: 'Restricted Selection',
            text: `Only one ${schemeType} scheme can be selected.`,
            icon: 'warning',
            confirmButtonText: 'OK',
          });
        } else {
          newCheckboxes.forEach(cb => {
            const schemeId = cb.getAttribute('data-scheme-id');
            const scheme = data.student_details.find(s => s.scheme_id == schemeId);
            if (scheme && (scheme.scheme_amount === null || scheme.scheme_amount === undefined || scheme.scholarshipamount === null || scheme.scholarshipamount == 0)) {
              cb.checked = false;
            } else {
              cb.checked = selectAll.checked;
            }
          });
          updateButtonState();
        }
      };
    }

    // Checkbox behavior based on schemetype
    newCheckboxes.forEach((cb, index) => {
      cb.addEventListener('change', () => {
        const schemeId = cb.getAttribute('data-scheme-id');
        const scheme = data.student_details.find(s => s.scheme_id == schemeId);

        // Check if scheme has null amounts (allow 0 for scheme_amount, only restrict null)
        if (scheme && (scheme.scheme_amount === null || scheme.scheme_amount === undefined || scheme.scholarshipamount === null || scheme.scholarshipamount == 0)) {
          cb.checked = false;
          Swal.fire({
            title: 'Invalid Selection',
            text: `Cannot select "${scheme.scheme_name}" - scheme amount or scholarship amount is null.`,
            icon: 'warning',
            confirmButtonText: 'OK',
          });
          this.updateApplyButtonState();
          return;
        }

        const schemeType = scheme?.schemetype?.toLowerCase() || 'inclusive';
        const excludedSchemeIds = scheme?.exclusion_schemes?.map(ex => ex.exclusion_scheme_id.toString()) || [];

        if (schemeType == 'exclusive' && cb.checked) {
          newCheckboxes.forEach((otherCb, otherIndex) => {
            if (otherIndex !== index) {
              otherCb.checked = false;
              otherCb.disabled = true;
            }
          });
          if (selectAll) selectAll.checked = false;
        } else if (schemeType == 'exclusive with exceptions' && cb.checked) {
          newCheckboxes.forEach((otherCb, otherIndex) => {
            if (otherIndex !== index) {
              const otherSchemeId = otherCb.getAttribute('data-scheme-id');
              const otherScheme = data.student_details.find(s => s.scheme_id == otherSchemeId);
              const otherSchemeType = otherScheme?.schemetype?.toLowerCase() || 'inclusive';

              if (excludedSchemeIds.includes(otherSchemeId)) {
                otherCb.checked = false;
                otherCb.disabled = true;
              }
              else {
                otherCb.checked = false;
                otherCb.disabled = true;
              }
            }
          });
          if (selectAll) selectAll.checked = false;
        } else if (schemeType == 'inclusive' && cb.checked) {
          newCheckboxes.forEach((otherCb, otherIndex) => {
            if (otherIndex !== index) {
              const otherSchemeId = otherCb.getAttribute('data-scheme-id');
              const otherScheme = data.student_details.find(s => s.scheme_id == otherSchemeId);
              const otherSchemeType = otherScheme?.schemetype?.toLowerCase() || 'inclusive';

              if (otherSchemeType == 'exclusive') {
                otherCb.checked = false;
                otherCb.disabled = true;
              } else {
                otherCb.disabled = false;
              }
            }
          });
        } else if (!cb.checked) {
          newCheckboxes.forEach((otherCb, otherIndex) => {
            const otherSchemeId = otherCb.getAttribute('data-scheme-id');
            const otherScheme = data.student_details.find(s => s.scheme_id == otherSchemeId);
            const otherSchemeType = otherScheme?.schemetype?.toLowerCase() || 'inclusive';

            const checkedSchemes = Array.from(newCheckboxes).filter(c => c.checked);
            const hasExclusive = checkedSchemes.some(c => {
              const sId = c.getAttribute('data-scheme-id');
              const s = data.student_details.find(s => s.scheme_id == sId);
              return s?.schemetype?.toLowerCase() == 'exclusive';
            });
            const hasExclusiveWithExceptions = checkedSchemes.some(c => {
              const sId = c.getAttribute('data-scheme-id');
              const s = data.student_details.find(s => s.scheme_id == sId);
              return s?.schemetype?.toLowerCase() == 'exclusive with exceptions';
            });

            if (hasExclusive) {
              otherCb.disabled = true;
              otherCb.checked = false;
            } else if (hasExclusiveWithExceptions) {
              const exclusiveWithExceptionsScheme = checkedSchemes.find(c => {
                const sId = c.getAttribute('data-scheme-id');
                const s = data.student_details.find(s => s.scheme_id == sId);
                return s?.schemetype?.toLowerCase() == 'exclusive with exceptions';
              });
              const sId = exclusiveWithExceptionsScheme?.getAttribute('data-scheme-id');
              const s = data.student_details.find(s => s.scheme_id == sId);
              const excludedIds = s?.exclusion_schemes?.map(ex => ex.exclusion_scheme_id.toString()) || [];

              if (excludedIds.includes(otherSchemeId)) {
                otherCb.disabled = true;
                otherCb.checked = false;
              } else if (otherSchemeType == 'inclusive') {
                otherCb.disabled = false;
              } else {
                otherCb.disabled = true;
                otherCb.checked = false;
              }
            } else {
              otherCb.disabled = false;
            }
          });
        }

        // Highlight the selected row
        newCheckboxes.forEach((checkbox, idx) => {
          const row = checkbox.closest('tr');
          if (checkbox.checked) {
            row.style.backgroundColor = '#e6f3ff';
          } else {
            row.style.backgroundColor = '';
          }
        });

        // Always validate and update the apply button state after any checkbox change
        this.updateApplyButtonState();
      });

      if (syncButton) {
        syncButton.style.display = 'inline-block';
        syncButton.onclick = () => {
          $('#studentDetailsModal').modal('hide');
          $("#refresh_modal").modal("show");
        };
      }
    });

    // Initial button state
    updateButtonState();

    if (type == 'apply') {
      $('.scheme_details_card').show();

      if (data?.eligibility?.fn_check_studentapply_eligibility) {
        if (applyButton) {
          applyButton.style.display = 'inline-block';
          applyButton.textContent = 'Apply';
          applyButton.onclick = () => {
            const selectedCheckboxes = Array.from(document.querySelectorAll('.scheme_inclusive_checkbox:checked'));
            const selectedSchemeIds = selectedCheckboxes.map(cb => cb.getAttribute('data-scheme-id'));
            const selectedSchemes = data.student_details.filter(s => selectedSchemeIds.includes(String(s.scheme_id)));

            if (selectedSchemeIds.length == 0) {
              Swal.fire({
                title: 'No Scheme Selected',
                text: 'Please select a scheme to apply.',
                icon: 'warning',
                confirmButtonText: 'OK',
              });
              return;
            }


            if (!this.validateSchemeSelection(data)) {
              return;
            }

            // Pass all selected schemes
            this.showApplyModal({ ...data, selected_schemes: selectedSchemes }, type);
          };
        }
        if (syncButton) {
          syncButton.style.display = 'inline-block';
          syncButton.onclick = () => {
            $('#studentDetailsModal').modal('hide');
            $("#refresh_modal").modal("show");
          };
        }
      } else {
        if (applyButton) {
          applyButton.style.display = 'none';
          console.log('Apply button hidden: Student is not eligible for any scheme (fn_check_studentapply_eligibility is falsy).');
        }
        if (syncButton) {
          syncButton.style.display = 'inline-block';
          syncButton.onclick = () => {
            $('#studentDetailsModal').modal('hide');
            $("#refresh_modal").modal("show");
          };
        }
      }
    } else {
      $('.scheme_details_card').hide();
      if (applyButton) {
        applyButton.style.display = 'inline-block';
        applyButton.textContent = 'Check Eligibility';
        applyButton.disabled = false;
        applyButton.onclick = () => this.showCheckEligibilityModal(data, type);
      }
      if (syncButton) {
        syncButton.style.display = 'inline-block';
        syncButton.onclick = () => {
          $('#studentDetailsModal').modal('hide');
          $("#refresh_modal").modal("show");
        };
      }
    }

    // Pre-select and highlight scheme based on scheme_id from URL or data
    const urlParams = new URLSearchParams(window.location.search);
    const clickedSchemeId = urlParams.get('scheme_id') || data.student_details[0].scheme_id;
    if (clickedSchemeId) {
      const checkbox = document.querySelector(`.scheme_inclusive_checkbox[data-scheme-id="${clickedSchemeId}"]`);
      if (checkbox) {
        checkbox.checked = true;
        const row = checkbox.closest('tr');
        if (row) row.style.backgroundColor = '#e6f3ff';

        const scheme = data.student_details.find(s => s.scheme_id == clickedSchemeId);
        const schemeType = scheme?.schemetype?.toLowerCase() || 'inclusive';
        const excludedSchemeIds = scheme?.exclusion_schemes?.map(ex => ex.exclusion_scheme_id.toString()) || [];

        if (schemeType == 'exclusive') {
          newCheckboxes.forEach((otherCb, otherIndex) => {
            if (otherCb !== checkbox) {
              otherCb.disabled = true;
            }
          });
        } else if (schemeType == 'exclusive with exceptions') {
          newCheckboxes.forEach((otherCb, otherIndex) => {
            const otherSchemeId = otherCb.getAttribute('data-scheme-id');
            const otherScheme = data.student_details.find(s => s.scheme_id == otherSchemeId);
            const otherSchemeType = otherScheme?.schemetype?.toLowerCase() || 'inclusive';

            if (excludedSchemeIds.includes(otherSchemeId)) {
              otherCb.checked = false;
              otherCb.disabled = true;
            } else if (otherSchemeType == 'inclusive') {
              otherCb.disabled = false;
            } else {
              otherCb.checked = false;
              otherCb.disabled = true;
            }
          });
        }
        updateButtonState();
      }
    }

    // For 'apply' type, set up checkboxes based on scheme_rule_id
    if (type == 'apply') {
      setTimeout(() => {
        this.setupCheckboxesBySchemeRuleId(data);
      }, 100);
    }

    const modalElement = document.getElementById('studentDetailsModal');
    if (modalElement) {
      if (!this.studentDetailsModalInstance) {
        this.studentDetailsModalInstance = new bootstrap.Modal(modalElement);
      }
      this.studentDetailsModalInstance.show();
    } else {
      console.error('Modal element with ID "studentDetailsModal" not found in DOM');
      Swal.fire({
        title: 'Error',
        text: 'Failed to display student details modal.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  }
  // Validate scheme selection based on scheme types and amounts
  validateSchemeSelection(data, type = null) {
    // Get all selected checkboxes
    let checkboxes;
    if (type == 'inline_scheme_inclusive_checkbox') {
      checkboxes = document.querySelectorAll('.inline_scheme_inclusive_checkbox');
    } else {
      checkboxes = document.querySelectorAll('.scheme_inclusive_checkbox');
    }

    console.log(checkboxes, type)

    const selectedCheckboxes = Array.from(checkboxes).filter(cb => cb.checked);
    const selectedSchemeIds = selectedCheckboxes.map(cb => cb.getAttribute('data-scheme-id'));

    // Get all schemes data
    // If no schemes are selected, prevent proceeding
    if (selectedCheckboxes.length == 0) {
      Swal.fire({
        title: 'No Scheme Selected',
        text: 'Please select at least one schessme to apply.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return false;
    }

    const schemes = data.student_details || [];

    // Check if any selected scheme has null amounts (allow 0 for scheme_amount, only restrict null)
    const nullAmountSchemes = selectedCheckboxes.filter(cb => {
      const schemeId = cb.getAttribute('data-scheme-id');
      const scheme = schemes.find(s => s.scheme_id == schemeId);
      return scheme && (scheme.scheme_amount === null || scheme.scheme_amount === undefined || scheme.scholarshipamount === null || scheme.scholarshipamount == 0);
    });

    if (nullAmountSchemes.length > 0) {
      const schemeNames = nullAmountSchemes.map(cb => {
        const schemeId = cb.getAttribute('data-scheme-id');
        const scheme = schemes.find(s => s.scheme_id == schemeId);
        return scheme ? scheme.scheme_name : 'Unknown Scheme';
      }).join(', ');

      Swal.fire({
        title: 'Invalid Selection',
        text: `Cannot apply schemes with null amounts: ${schemeNames}`,
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return false;
    }

    // Categorize selected schemes by type
    const exclusiveSchemes = selectedCheckboxes.filter(cb => {
      const schemeId = cb.getAttribute('data-scheme-id');
      const scheme = schemes.find(s => s.scheme_id == schemeId);
      return scheme && scheme.schemetype?.toLowerCase() == 'exclusive';
    });

    const inclusiveSchemes = selectedCheckboxes.filter(cb => {
      const schemeId = cb.getAttribute('data-scheme-id');
      const scheme = schemes.find(s => s.scheme_id == schemeId);
      return scheme && scheme.schemetype?.toLowerCase() == 'inclusive';
    });

    const exclusiveWithExceptionsSchemes = selectedCheckboxes.filter(cb => {
      const schemeId = cb.getAttribute('data-scheme-id');
      const scheme = schemes.find(s => s.scheme_id == schemeId);
      return scheme && scheme.schemetype?.toLowerCase() == 'exclusive with exceptions';
    });

    // Validation rules
    // Rule 1: Only one exclusive scheme can be selected, and it cannot be combined with other types
    if (exclusiveSchemes.length > 1) {
      Swal.fire({
        title: 'Invalid Selection',
        text: 'You can only select one exclusive scheme at a time.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return false;
    }

    if (exclusiveSchemes.length == 1 && (inclusiveSchemes.length > 0 || exclusiveWithExceptionsSchemes.length > 0)) {
      Swal.fire({
        title: 'Invalid Selection',
        text: 'Exclusive schemes cannot be combined with other scheme types.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return false;
    }

    // Rule 2: Only one "Exclusive With Exceptions" scheme can be selected
    if (exclusiveWithExceptionsSchemes.length > 1) {
      Swal.fire({
        title: 'Invalid Selection',
        text: 'You can only select one "Exclusive With Exceptions" scheme at a time.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return false;
    }

    // Rule 3: Check exclusion_schemes for "Exclusive With Exceptions"
    if (exclusiveWithExceptionsSchemes.length == 1) {
      const selectedSchemeId = exclusiveWithExceptionsSchemes[0].getAttribute('data-scheme-id');
      const selectedScheme = schemes.find(s => s.scheme_id == selectedSchemeId);

      if (selectedScheme && selectedScheme.exclusion_schemes && Array.isArray(selectedScheme.exclusion_schemes)) {
        const excludedSchemeIds = selectedScheme.exclusion_schemes.map(ex => ex.exclusion_scheme_id.toString());

        // Check if any selected scheme (other than the "Exclusive With Exceptions" scheme) is in the exclusion list
        const invalidSchemes = selectedCheckboxes
          .filter(cb => cb.getAttribute('data-scheme-id') != selectedSchemeId)
          .filter(cb => {
            const schemeId = cb.getAttribute('data-scheme-id');
            return excludedSchemeIds.includes(schemeId);
          });

        if (invalidSchemes.length > 0) {
          const invalidSchemeNames = invalidSchemes.map(cb => {
            const schemeId = cb.getAttribute('data-scheme-id');
            const scheme = schemes.find(s => s.scheme_id == schemeId);
            return scheme ? scheme.scheme_name : 'Unknown Scheme';
          }).join(', ');

          Swal.fire({
            title: 'Invalid Selection',
            text: `The scheme "${selectedScheme.scheme_name}" cannot be combined with: ${invalidSchemeNames}.`,
            icon: 'warning',
            confirmButtonText: 'OK',
          });
          return false;
        }
      }
    }

    // Rule 4: Inclusive schemes can be selected together
    if (inclusiveSchemes.length > 0 && exclusiveSchemes.length == 0 && exclusiveWithExceptionsSchemes.length == 0) {
      return true;
    }

    // Rule 5: "Exclusive With Exceptions" can be combined with inclusive schemes, subject to exclusion_schemes check
    if (exclusiveWithExceptionsSchemes.length == 1 && inclusiveSchemes.length > 0) {
      return true;
    }

    // If no schemes are selected, prevent proceeding
    if (selectedCheckboxes.length == 0) {
      Swal.fire({
        title: 'No Scheme Selected',
        text: 'Please select at least one scheme to apply.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return false;
    }

    return true;
  }

  // New method to set up checkboxes based on scheme_rule_id matching

  setupCheckboxesBySchemeRuleId(data) {
    if (!data || !data.student_details || !Array.isArray(data.student_details)) {
      console.error('Invalid data structure for checkbox setup');
      return;
    }

    const targetSchemeRuleId = data.student_details[0]?.scheme_ruleid;

    if (!targetSchemeRuleId) {
      console.warn('No scheme_rule_id found in student details');
      return;
    }

    console.log('Setting up checkboxes for scheme_rule_id:', targetSchemeRuleId);

    const checkboxes = document.querySelectorAll('.scheme_inclusive_checkbox');
    let foundMatch = false;

    checkboxes.forEach((checkbox, index) => {
      const schemeRuleId = checkbox.getAttribute('data-scheme-ruleid');
      const schemeId = checkbox.getAttribute('data-scheme-id');
      const scheme = data.student_details.find(s => s.scheme_id == schemeId);

      // Check if scheme has null amounts and disable if so (allow 0 for scheme_amount, only restrict null)
      if (scheme && (scheme.scheme_amount === null || scheme.scheme_amount === undefined || scheme.scholarshipamount === null || scheme.scholarshipamount == 0)) {
        checkbox.disabled = true;
        checkbox.checked = false;
        console.log(`Disabled checkbox for scheme "${scheme.scheme_name}" - null amounts`);
        return;
      }

      // Only check the scheme that matches the applied scheme_ruleid, uncheck all others
      if (schemeRuleId == targetSchemeRuleId) {
        checkbox.checked = true;
        checkbox.disabled = false;
        foundMatch = true;

        // Highlight the row
        const row = checkbox.closest('tr');
        if (row) {
          row.style.backgroundColor = '#e6f3ff';
        }

        const schemeType = scheme?.schemetype?.toLowerCase() || 'inclusive';

        // Apply restrictions based on scheme type
        if (schemeType == 'exclusive') {
          checkboxes.forEach((otherCb, otherIndex) => {
            if (otherIndex !== index) {
              otherCb.checked = false;
              otherCb.disabled = true;
            }
          });
        } else if (schemeType == 'exclusive with exceptions') {
          const excludedSchemeIds = scheme.exclusion_schemes?.map(ex => ex.exclusion_scheme_id.toString()) || [];
          checkboxes.forEach((otherCb, otherIndex) => {
            if (otherIndex !== index) {
              const otherSchemeId = otherCb.getAttribute('data-scheme-id');
              const otherScheme = data.student_details.find(s => s.scheme_id == otherSchemeId);
              const otherSchemeType = otherScheme?.schemetype?.toLowerCase() || 'inclusive';

              if (excludedSchemeIds.includes(otherSchemeId)) {
                otherCb.checked = false;
                otherCb.disabled = true;
              } else if (otherSchemeType == 'inclusive') {
                otherCb.disabled = false;
              } else {
                otherCb.checked = false;
                otherCb.disabled = true;
              }
            }
          });
        } else if (schemeType == 'inclusive') {
          checkboxes.forEach((otherCb, otherIndex) => {
            if (otherIndex !== index) {
              const otherSchemeId = otherCb.getAttribute('data-scheme-id');
              const otherScheme = data.student_details.find(s => s.scheme_id == otherSchemeId);
              const otherSchemeType = otherScheme?.schemetype?.toLowerCase();

              if (otherSchemeType == 'exclusive') {
                otherCb.checked = false;
                otherCb.disabled = true;
              } else {
                otherCb.checked = false;
                otherCb.disabled = false;
              }
            }
          });
        }

        console.log(`Checked checkbox for scheme: ${scheme?.scheme_name || 'Unknown'} (ID: ${scheme?.scheme_id || 'Unknown'}, Rule ID: ${schemeRuleId})`);
      } else {
        checkbox.checked = false;
        checkbox.disabled = false;
        // Remove highlight from non-selected rows
        const row = checkbox.closest('tr');
        if (row) {
          row.style.backgroundColor = '';
        }
      }
    });

    if (!foundMatch) {
      console.warn(`No scheme found matching scheme_rule_id: ${targetSchemeRuleId}`);
    }

    this.updateApplyButtonState();
  }

  // Method to update apply button state based on checkbox selections
  updateApplyButtonState() {
    const checkboxes = document.querySelectorAll('.scheme_inclusive_checkbox');
    const applyButton = document.getElementById('modal_apply_button');
    const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
    if (applyButton) {
      applyButton.disabled = !anyChecked;
      if (!anyChecked) {
        // Check for reasons
        const allDisabled = Array.from(checkboxes).every(cb => cb.disabled);
        if (allDisabled) {
          console.log('Apply button disabled: All schemes are either zero amount or not selectable.');
        } else {
          console.log('Apply button disabled: No scheme selected.');
        }
      } else {
        console.log('Apply button enabled: At least one scheme selected.');
      }
    } else {
      console.log('Apply button not found in DOM.');
    }
  }

  // Function to set default state for apply modal
  setApplyModalDefaultState() {
    // Uncheck all radio buttons first
    $('input[name="applicationDecision"]').prop('checked', false);

    // Hide the reason container
    $('#reasonContainer').hide();
    $('#notApplyReason').val('');
    $('#notApplyDescription').val('');

    // Uncheck the consent checkbox
    $('#applySchemeVerification').prop('checked', false);

    // Disable the Apply button
    $('#get_opt').prop('disabled', true);

    // Add event listeners for radio button changes
    $('input[name="applicationDecision"]').off('change').on('change', function () {
      const selectedValue = $(this).val();
      const applyButton = $('#get_opt');
      const reasonContainer = $('#reasonContainer');
      const consentCheckbox = $('#applySchemeVerification');

      if (selectedValue == 'apply') {
        // Show reason container for "apply" selection
        reasonContainer.hide();
        // Enable button only if consent is checked
        applyButton.prop('disabled', !consentCheckbox.is(':checked'));
      } else if (selectedValue == 'notApply') {
        // Show reason container for "not apply" selection
        reasonContainer.show();
        // Enable button only if consent is checked and reason is selected
        const reason = $('#notApplyReason').val();
        applyButton.prop('disabled', !consentCheckbox.is(':checked') || !reason);
      } else {
        // No selection - keep button disabled
        reasonContainer.hide();
        applyButton.prop('disabled', true);
      }
    });

    // Add event listener for consent checkbox
    $('#applySchemeVerification').off('change').on('change', function () {
      const isChecked = $(this).is(':checked');
      const selectedDecision = $('input[name="applicationDecision"]:checked').val();
      const applyButton = $('#get_opt');

      if (selectedDecision == 'apply') {
        applyButton.prop('disabled', !isChecked);
      } else if (selectedDecision == 'notApply') {
        const reason = $('#notApplyReason').val();
        applyButton.prop('disabled', !isChecked || !reason);
      } else {
        applyButton.prop('disabled', true);
      }
    });

    // Add event listener for reason selection
    $('#notApplyReason').off('change').on('change', function () {
      const reason = $(this).val();
      const consentChecked = $('#applySchemeVerification').is(':checked');
      const selectedDecision = $('input[name="applicationDecision"]:checked').val();
      const applyButton = $('#get_opt');

      if (selectedDecision == 'notApply') {
        applyButton.prop('disabled', !consentChecked || !reason);
      }
    });
  }

  async showCheckEligibilityModal(data, type) {
    console.log(data);

    const encryptDatas = {
      umis_no: data.student_details[0].umis_no
    };

    try {
      $('#preloader').show();
      const response = await $.ajax({
        url: `${config.ssp_api_url}/check_student_eligibility`,
        type: 'POST',
        headers: { 'X-APP-KEY': 'te$t', 'X-APP-NAME': 'te$t' },
        data: { data: encryptData(encryptDatas) }
      });

      if (response.success == 1) {
        const decryptedData = decryptData(response.data);
        console.log('Decrypted Data:', decryptedData);
        $('#preloader').hide();
        // Validate decryptedData structure
        if (!Array.isArray(decryptedData) || decryptedData.length == 0) {
          $('#preloader').hide();
          throw new Error('Invalid or empty decrypted data format');
        }

        // Check if any status is the specific message
        const specificStatus = 'Student must be eligible. Please try Refresh option.';
        const hasSpecificStatus = decryptedData.some(item => item.rule_type == specificStatus);

        if (hasSpecificStatus) {
          Swal.fire({
            icon: 'info',
            title: 'Check Eligibility',
            text: specificStatus,
            confirmButtonText: 'OK'
          });
        } else {
          // Check if all items have status 'No scheme found for this student'
          const noSchemeStatus = 'No scheme found for this student';
          const allNoScheme = decryptedData.every(item => item.rule_type == noSchemeStatus);

          // Build HTML for the modal
          let tableHtml = `
                    <table style="width:100%; border-collapse: collapse; text-align: left; font-size: 14px;">
                        <thead>
                            <tr>
                                <th style="border: 1px solid #ddd; padding: 8px;">Scheme Parameters</th>
                                <th style="border: 1px solid #ddd; padding: 8px;">Student Parameters</th>
                                ${allNoScheme ? '' : `
                                    <th style="border: 1px solid #ddd; padding: 8px;">Scheme</th>
                                    <th style="border: 1px solid #ddd; padding: 8px;">Rule Value</th>
                                     <th style="border: 1px solid #ddd; padding: 8px;">Status</th>
                                `}
                               
                            </tr>
                        </thead>
                        <tbody>
                `;

          decryptedData.forEach(item => {
            const { rule_type: status, schemename, field_name, rule_value, student_value } = item;
            const scheme_name = schemename || 'N/A';
            const rule_val = rule_value || 'N/A';
            const student_val = student_value || 'N/A';
            const field = field_name || 'Unknown Field';
            const displayStatus = status || 'No scheme found';

            tableHtml += `
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 8px;">${field}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${student_val}</td>
                            ${allNoScheme ? '' : `
                                <td style="border: 1px solid #ddd; padding: 8px;">${scheme_name}</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">${rule_val}</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">${displayStatus}</td>
                            `}
                            
                        </tr>
                    `;
          });

          tableHtml += `
                        </tbody>
                    </table>
                `;

          // Add bold message at the top if all items have 'No scheme found for this student'
          const htmlContent = allNoScheme
            ? `<div style="font-weight: bold; margin-bottom: 10px;">The student's data does not match the required scheme parameters. Please update your data in UMIS accordingly and verify your eligibility again.</div>${tableHtml}`
            : tableHtml;

          // Determine modal title and icon based on eligibility
          const hasIneligible = decryptedData.some(item => item.rule_type == 'exclusive' || item.rule_type == 'inclusive');
          const title = 'Check Eligibility';


          Swal.fire({

            title: title,
            html: htmlContent,
            confirmButtonText: 'OK',
            width: '800px',
            customClass: {
              popup: 'swal-wide'
            }
          });
        }
      } else {
        $('#preloader').hide();
        Swal.fire({
          icon: 'error',
          title: 'Check Eligibility',
          text: response.data && typeof response.data == 'string' ? response.data : 'Unknown error occurred.'
        });
      }
    } catch (error) {
      $('#preloader').hide();
      console.error('Eligibility Check Error:', {
        message: error.message,
        stack: error.stack
      });
      Swal.fire({
        icon: 'error',
        title: 'Request Error',
        text: 'Something went wrong while checking eligibility. Please try again later.'
      });
    }
  }

  async handleApplyButton(data, type, checkboxClass) {
    console.log('handleApplyButton data:', JSON.stringify(data, null, 2));
    // Support multiple selected schemes
    const selectedSchemes = data.selected_schemes || [data.student_details];
    const subssidArr = selectedSchemes.map(s => s.scheme_ruleid || s.subschemeid || s.sub_scheme_id).filter(Boolean);
    const schemeIdArr = selectedSchemes.map(s => s.scheme_id).filter(Boolean);
    const stud_id = selectedSchemes[0]?.student_id || '';
    const schemeName = $('#apply_schemename').text();
    const selectedDecision = $('input[name="applicationDecision"]:checked').val();
    const umis_id = selectedSchemes[0]?.umis_no || '';
    const student_education = selectedSchemes[0]?.student_education_id || '';
    const stdying_year = selectedSchemes[0]?.studying_year || '';

    $('.error-text').remove();

    if (selectedDecision == 'notApply') {
      const reason = $('#notApplyReason').val();
      const description = $('#notApplyDescription').val();
      let hasError = false;

      if (!reason) {
        $('#notApplyReason').after('<div class="error-text text-danger mt-1">Please select a reason.</div>');
        hasError = true;
      }

      if (!description.trim()) {
        $('#notApplyDescription').after('<div class="error-text text-danger mt-1">Please enter a description.</div>');
        hasError = true;
      }

      if (hasError) {
        return;
      }

      await this.triggerOTPApi(data, subssidArr, schemeIdArr, stud_id, umis_id, schemeName, type, checkboxClass);
    } else {

      $.ajax({
        url: config.ssp_api_url + "/student/student_verify_flag",
        type: "POST",
        headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
        data: {
          studentid: stud_id,
          subschemeid: JSON.stringify(subssidArr),
          schemeid: JSON.stringify(schemeIdArr),
          student_education: student_education,
          studying_year: stdying_year
        },
        success: async (response) => {
          await this.triggerOTPApi(data, subssidArr, schemeIdArr, stud_id, umis_id, schemeName, type, checkboxClass);
        },
        error: function (xhr, status, error) {
          // Default error message
          let errorMessage = 'An unexpected error occurred';
          let detailedErrors = '';

          // Check if responseJSON exists and has the expected structure
          if (xhr.responseJSON) {
            // Use the main message if available
            errorMessage = xhr.responseJSON.message || errorMessage;

            // Extract specific errors from the errors object
            if (xhr.responseJSON.errors && typeof xhr.responseJSON.errors === 'object') {
              detailedErrors = Object.values(xhr.responseJSON.errors).join('\n');
            }
          }

          // Display the error using Swal.fire
          Swal.fire({
            title: schemeName || 'Error',
            text: detailedErrors || errorMessage,
            icon: 'error',
            showConfirmButton: true
          });
        }
      });

    }
  }

  //  // Place this outside the function, globally or at class level

  async triggerOTPApi(data, studsub_IdArr, scheme_idArr, stud_id, umis_id, schemeName, type, checkboxClass) {
    $('#preloader1').show();
    let selectedCheckboxes;
    try {
      if (checkboxClass == 'inline_scheme_inclusive_checkbox') {
        selectedCheckboxes = document.querySelectorAll(`.inline_scheme_inclusive_checkbox:checked`);
        $('#page_type').val('student');
      } else {
        selectedCheckboxes = document.querySelectorAll(`.scheme_inclusive_checkbox:checked`);
        $('#page_type').val('institute');
      }

      const selectedSchemes = Array.from(selectedCheckboxes).map(cb => ({
        scheme_id: cb.getAttribute('data-scheme-id'),
        sub_scheme_id: cb.getAttribute('data-scheme-ruleid'),
        student_id: $('#sspstud_id').val(),
      }));

      if (!selectedSchemes.length) {
        $('#preloader1').hide();
        Swal.fire({
          title: 'No Scheme Selected',
          text: 'Please select at least one scheme to proceed.',
          icon: 'warning',
          confirmButtonText: 'OK',
        });
        return;
      }

      // Prepare arrays for scheme IDs and subscheme IDs
      const schemeIdArr = selectedSchemes.map(s => s.scheme_id);
      const subSchemeIdArr = selectedSchemes.map(s => s.sub_scheme_id);
      const stud_id = selectedSchemes[0]?.student_id || '';

      // Store selected schemes in pdf_data for use in OTP verification (if needed elsewhere)
      this.pdf_data = {
        isubschemeid: JSON.stringify(studsub_IdArr),
        ischemeid: JSON.stringify(scheme_idArr),
        student_id: stud_id,
        umis_id,
        apply_type: type,
      };

      console.log("pdf", this.pdf_data);
      const response = await $.ajax({
        url: config.ssp_api_url + '/student/otp_v2',
        type: 'POST',
        headers: { 'X-APP-KEY': 'te$t', 'X-APP-NAME': 'te$t' },
        data: {
          type: 'send',
          isubschemeid: JSON.stringify(studsub_IdArr),
          ischemeid: JSON.stringify(scheme_idArr),
          istudentid: umis_id,
          umis_id: umis_id,

          iinterval: 5,

        },
      });

      if (response.success == 1) {
        $('#preloader1').hide();
        $('#applyModal').modal('hide');

        const mobileno = response.data[0].mobileno || $('#apply_phone').text();

        Swal.fire({
          title: 'OTP Sent Successfully',
          icon: 'success',
          showConfirmButton: false,
          timer: 3000,
        }).then(() => {
          $('.otp-input').val('');
          $('.otp_mobile_number').text(mobileno);

          // Clear previous timer if exists
          if (this.countdown) {
            clearInterval(this.countdown);
            this.countdown = null;
          }



          let timeLeft = 180;
          const timerElement = document.getElementById('resendTimer');
          const requestAgainLink = document.getElementById('requestAgain');

          timerElement.style.display = 'inline-block';
          requestAgainLink.style.display = 'none';

          this.countdown = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            timeLeft--;
            if (timeLeft < 0) {
              clearInterval(this.countdown);
              this.countdown = null;
              timerElement.style.display = 'none';
              requestAgainLink.style.display = 'inline-block';
            }
          }, 1000);

          // Open OTP modal
          const otpModalElement = document.getElementById('opt_modal');

          if (otpModalElement) {
            if (!this.otpModalInstance) {
              this.otpModalInstance = new bootstrap.Modal(otpModalElement);
            }
            this.otpModalInstance.show();
          }
        });
      } else if (response.success == 2) {
        $('#preloader1').hide();

        const mobileno = response.data?.[0]?.mobileno || $('#apply_phone').text();

        Swal.fire({
          title: 'OTP Already Sent Successfully',
          icon: 'success',
          showConfirmButton: false,
          timer: 3000,
        }).then(() => {
          $('.otp-input').val('');
          $('.otp_mobile_number').text(mobileno);

          // Clear previous timer if exists
          if (this.countdown) {
            clearInterval(this.countdown);
            this.countdown = null;
          }

          let timeLeft = 180;
          const timerElement = document.getElementById('resendTimer');
          const requestAgainLink = document.getElementById('requestAgain');

          if (timerElement && requestAgainLink) {
            timerElement.style.display = 'inline-block';
            requestAgainLink.style.display = 'none';

            this.countdown = setInterval(() => {
              const minutes = Math.floor(timeLeft / 60);
              const seconds = timeLeft % 60;
              timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
              timeLeft--;
              if (timeLeft < 0) {
                clearInterval(this.countdown);
                this.countdown = null;
                timerElement.style.display = 'none';
                requestAgainLink.style.display = 'inline-block';
              }
            }, 1000);
          }

          // Open OTP modal
          const otpModalElement = document.getElementById('opt_modal');
          if (otpModalElement) {
            if (!this.otpModalInstance) {
              this.otpModalInstance = new bootstrap.Modal(otpModalElement);
            }
            this.otpModalInstance.show();
          }
        });
      } else {
        $('#preloader1').hide();
        Swal.fire({
          title: 'OTP Failed',
          icon: 'error',
          showConfirmButton: true,
          timer: 3000,
        });
      }
    } catch (error) {
      $('#preloader1').hide();

      console.error('triggerOTPApi error:', error);

      let errorMessage = 'Error sending OTP';
      let shouldShowOTPModal = false;

      if (
        error.responseJSON &&
        Array.isArray(error.responseJSON) &&
        error.responseJSON &&
        error.responseJSON.success == 0 &&
        error.responseJSON.message
      ) {
        if (error.responseJSON.message.includes('Already OTP Sent')) {
          errorMessage = 'An OTP has already been sent. Please check your phone or wait before requesting a new one.';
          shouldShowOTPModal = true;

          // If we have mobile number in the error response, use it
          const mobileno = $('#apply_phone').text();
          $('.otp_mobile_number').text(mobileno);
        } else {
          errorMessage = error.responseJSON.message.split('\n')[0];
        }
      } else if (error.message && error.message.includes('Already OTP Sent')) {
        errorMessage = 'An OTP has already been sent. Please check your phone or wait before requesting a new one.';
        shouldShowOTPModal = true;
      } else {
        errorMessage = error.responseJSON.message.split('\n')[0];
      }

      if (shouldShowOTPModal) {
        // Show success message and then open OTP modal
        Swal.fire({
          title: 'OTP Already Sent Successfully',
          icon: 'success',
          showConfirmButton: false,
          timer: 3000,
        }).then(() => {
          $('.otp-input').val('');

          // Clear previous timer if exists
          if (this.countdown) {
            clearInterval(this.countdown);
            this.countdown = null;
          }

          let timeLeft = 180;
          const timerElement = document.getElementById('resendTimer');
          const requestAgainLink = document.getElementById('requestAgain');

          if (timerElement && requestAgainLink) {
            timerElement.style.display = 'inline-block';
            requestAgainLink.style.display = 'none';

            this.countdown = setInterval(() => {
              const minutes = Math.floor(timeLeft / 60);
              const seconds = timeLeft % 60;
              timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
              timeLeft--;
              if (timeLeft < 0) {
                clearInterval(this.countdown);
                this.countdown = null;
                timerElement.style.display = 'none';
                requestAgainLink.style.display = 'inline-block';
              }
            }, 1000);
          }

          // Open OTP modal
          const otpModalElement = document.getElementById('opt_modal');
          if (otpModalElement) {
            if (!this.otpModalInstance) {
              this.otpModalInstance = new bootstrap.Modal(otpModalElement);
            }
            this.otpModalInstance.show();
          }
        });
      } else {
        // Show error message
        Swal.fire({
          title: errorMessage,
          icon: 'error',
          showConfirmButton: true,
          timer: 3000,
        });
      }
    }
  }


  async handleOtpVerification() {
    const inputs = $('.otp-input');
    const schemeName = $('#apply_schemename').text();
    const subssid = this.pdf_data?.isubschemeid || '';
    const stud_id = this.pdf_data?.umis_id || '';
    const scheme_id = this.pdf_data?.scheme_id || '';
    let id;
    if (typeof userId !== 'undefined' && userId) {
      id = userId;
    } else if (typeof stud_id !== 'undefined') {
      id = stud_id;
    } else {
      // Handle the case where neither userId nor stud_id is defined
      id = null; // or some default value
    }
    const fields = {
      iid: subssid,
      iappliedby: id // Assuming student applies
    };

    // Prepare pdf_data array for all selected schemes


    let otpValue = '';
    inputs.each(function () {
      otpValue += $(this).val();
    });

    if (otpValue.length !== 6) {
      Swal.fire({
        title: 'Invalid OTP',
        text: 'Please enter a 6-digit OTP',
        icon: 'error',
        showConfirmButton: true,
        timer: 3000,
      });
      return;
    }

    try {

      const selectedCheckboxes = document.querySelectorAll('.scheme_inclusive_checkbox:checked');
      const selectedSchemes = Array.from(selectedCheckboxes).map(cb => ({
        scheme_id: cb.getAttribute('data-scheme-id'),
        sub_scheme_id: cb.getAttribute('data-scheme-ruleid'),
        student_id: $('#sspstud_id').val(),
      }));
      var page_type = $('#page_type').val();
      console.log("pdfch", this.pdf_data);
      $('#preloader1').show();
      let id;
      if (typeof userId !== 'undefined' && userId) {
        id = userId;
      } else if (typeof stud_id !== 'undefined') {
        id = $('#sspstud_id').val();
      } else {
        // Handle the case where neither userId nor stud_id is defined
        id = null; // or some default value
      }
      const response = await $.ajax({
        url: config.ssp_api_url + '/student/otp_v2',
        type: 'POST',
        headers: { 'X-APP-KEY': 'te$t', 'X-APP-NAME': 'te$t' },
        data: {
          type: 'check',

          ischemeid: this.pdf_data.ischemeid,
          isubschemeid: this.pdf_data.isubschemeid,


          istudentid: this.pdf_data.umis_id || '',
          iotp: otpValue,
          field: fields,


          sspstud_id: this.pdf_data.student_id || '',
          reason: $('#notApplyReason').val() || null,
          descriptions: $('#notApplyDescription').val() || null,
          iinterval: 5,
          iappliedby: id,
        },
      });

      $('#opt_modal').modal('hide');
      if (response.success == '1') {
        $('#preloader1').hide();
        Swal.fire({
          title: response.message,
          icon: 'success',
          showConfirmButton: false,
          timer: 3000,
        }).then(() => {
          if (page_type == 'student') {
            location.reload();
          } else {
            $('#studentDetailsModal').modal('hide');
            fetchReportData();
          }

        });
      } else {
        $('#preloader1').hide();
        Swal.fire({
          title: response.message || 'Invalid OTP',
          icon: 'error',
          showConfirmButton: false,
          timer: 3000,
        });
      }
    } catch (error) {
      $('#preloader1').hide();

      const data = error?.responseJSON || {};
      const results = data.results || [];
      const defaultMessage = data.message || 'An unexpected error occurred';

      // Check for invalid OTP case
      if (defaultMessage.toLowerCase().includes('invalid otp')) {
        Swal.fire({
          title: 'Invalid OTP',
          icon: 'error',
          showConfirmButton: false,
          timer: 3000
        });
        return;
      }

      let htmlContent = '';

      if (results.length === 1) {
        // Single scheme error
        const r = results[0];
        htmlContent = `
              <p><strong>Scheme ID:</strong> ${r.scheme_id}</p>
              <p><strong>Sub-scheme ID:</strong> ${r.sub_scheme_id}</p>
              <p><strong>Reason:</strong> ${r.message}</p>
          `;
      } else if (results.length > 1) {
        // Multiple errors - display as table
        htmlContent = `
              <p>${defaultMessage}</p>
              <table style="width:100%; text-align:left; font-size:14px; border-collapse: collapse;">
                  <thead>
                      <tr>
                          <th style="border-bottom:1px solid #ccc;">Scheme ID</th>
                          <th style="border-bottom:1px solid #ccc;">Sub-scheme ID</th>
                          <th style="border-bottom:1px solid #ccc;">Message</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${results.map(r => `
                          <tr>
                              <td>${r.scheme_id}</td>
                              <td>${r.sub_scheme_id}</td>
                              <td>${r.message}</td>
                          </tr>
                      `).join('')}
                  </tbody>
              </table>
          `;
      } else {
        // No result array
        htmlContent = `<p>${defaultMessage}</p>`;
      }

      Swal.fire({
        title: 'Submission Failed',
        html: htmlContent,
        icon: 'error',
        confirmButtonText: 'Close',
        width: 700
      }).then(() => {
        $('.otp-input').val('');
        if (page_type == 'student') {
          location.reload();
        } else {
          $('.btn-close').click();
          fetchReportData();
        }
      });
    }

  }

  async handleResendOtp() {
    const schemeName = $('#apply_schemename').text();
    const subssid = this.pdf_data?.subschemeid || '';
    const stud_id = this.pdf_data?.stud_id || '';
    const scheme_id = this.pdf_data?.scheme_id || '';
    const umis_id = this.pdf_data?.umis_id || '';
    const requestAgainLink = document.getElementById('requestAgain');
    requestAgainLink.style.pointerEvents = 'none';

    try {
      const response = await $.ajax({
        url: config.ssp_api_url + '/student/otp',
        type: 'POST',
        headers: { 'X-APP-KEY': 'te$t', 'X-APP-NAME': 'te$t' },
        data: {
          type: 'resend',
          isubschemeid: subssid,
          ischemeid: scheme_id,
          istudentid: stud_id,
          umis_id: umis_id,
          iinterval: 5,
          scheme_name: schemeName,
        },
      });

      if (response[0]?.success == 1) {
        Swal.fire({
          title: 'OTP Resent Successfully',
          icon: 'success',
          showConfirmButton: false,
          timer: 3000,
        });

        $('.otp-input').val('');
        const mobileno = response[0].data.mobileno || '9791XXX520';
        $('.otp_mobile_number').text(mobileno);

        // Clear previous timer if exists
        if (this.countdown) {
          clearInterval(this.countdown);
          this.countdown = null;
        }

        let timeLeft = 180;
        const timerElement = document.getElementById('resendTimer');
        const requestAgainLink = document.getElementById('requestAgain');
        timerElement.style.display = 'inline';
        requestAgainLink.style.display = 'none';

        this.countdown = setInterval(() => {
          const minutes = Math.floor(timeLeft / 60);
          const seconds = timeLeft % 60;
          timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
          timeLeft--;
          if (timeLeft < 0) {
            clearInterval(this.countdown);
            this.countdown = null;
            timerElement.style.display = 'none';
            requestAgainLink.style.display = 'inline';
          }
        }, 1000);
      } else {
        Swal.fire({
          title: 'OTP Resend Failed',
          icon: 'error',
          showConfirmButton: true,
          timer: 3000,
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error Resending OTP',
        icon: 'error',
        showConfirmButton: true,
        timer: 3000,
      });
    } finally {
      requestAgainLink.style.pointerEvents = 'auto';
    }
  }

  showStudentDetailsInline(data, type) {
    if (!data?.student_details || !Array.isArray(data.student_details) || data.student_details.length == 0) {
      document.getElementById('studentDetailsInline').innerHTML = '<div class="alert alert-warning">No student details available.</div>';
      return;
    }
    var student = data.student_details[0];
    $('#sspstud_id').val(data.student_details[0].student_id || '');
    // Modern, creative inline card UI
    $('#stud_name').text(student.student_name);
    localStorage.setItem('student_name', student.student_name);
    const initials = (student.student_name || '-').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const avatarColor = '#33208c';
    const detailsHtml = `
      <style>
        body, #studentDetailsInline {
              background: radial-gradient(circle at 15% 10%, rgba(79, 70, 229, 0.07), transparent 40%), radial-gradient(circle at 85% 20%, rgba(99, 102, 241, 0.05), transparent 45%), #f6f8fb !important;
        }
        .student-section, .scheme-section {
          background: #fff;
          border-radius: 0.8rem;
          box-shadow: 0 2px 12px 0 rgba(31, 38, 135, 0.07);
          border: none;
          margin-bottom: 15px;
          width: 100%;
          
          margin-left: auto;
          margin-right: auto;
          padding: 15px;
        } 
        .student-section {
          margin-bottom: 1.5rem;
        }
        .student-section .profile-header {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
      border-bottom: 1px solid #e3e3ff;
                padding-bottom: 15px;
        }
        .student-section .profile-avatar {
                  width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #eef2ff;
    color: #33208c;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 700;
    box-shadow: 0 2px 8px rgb(51 32 140 / 27%);
        }
        .student-section .profile-info {
          flex: 1;
        }
        .student-section .profile-info h4 {
          margin: 0;
          font-weight: 800;
          color: #2a2a72;
          letter-spacing: 0.5px;
        }
        .student-section .profile-info .badge {
          font-size: 1.1rem;
      background: #fff;
         
        }
        .student-section .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 0.7rem 2.5rem;
        }
        .student-section .details-label {
          font-weight: 600;
          color: #6859b0;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 16px; 
        }
        .student-section .details-value {
          color: #333;
          font-weight: 500; 
        }
        .section-title {
          font-size: 1.3rem;
          font-weight: 900;
          color: #2a2a72;
          margin-bottom: 12px;
          letter-spacing: 0.5px;
          border-left: 5px solid #33208c;
          padding-left: 0.7rem;
        }
        .scheme-section .scheme-table th { 
          background: #f4f6fa;
              color: #6859b0; 
          font-weight: 600;
          font-size: 14px;
          border: none;
        }
        .scheme-section .scheme-table td, .scheme-section .scheme-table th {
          vertical-align: middle;
          border: none;
        }
        .scheme-section .scheme-badge {
          padding: 0.25em 0.7em;
          border-radius: 12px;
          font-size: 1em;
          font-weight: 600;
          color: #fff;
          background: #33208c;
        }
        
        .scheme-section .scheme-badge.inclusive {
            border: 1px dotted #188251 !important;
            background: transparent !important;
            color: #188251;
            border-radius: 4px 7px !important;
        }  

        .scheme-section .scheme-badge.exclusive { background: #e83e8c; }
        .scheme-section .scheme-badge[aria-label*="exceptions"] { background: #fd7e14; }
        // .scheme-section .status-chip {
        //   display: inline-block;
        //   padding: 0.2em 0.8em;
        //   border-radius: 10px;
        //   font-size: 1em;
        //   font-weight: 600;
        //   color: #fff;
        // }
        .scheme-section .status-chip.applied { background: #28a745; }
        
        .scheme-section .action-btn {
              min-width: 120px;
    font-size: 16px;
    border-radius: 8px;
    margin-right: 0.7rem;
    box-shadow: 0 2px 8px rgba(51, 32, 140, 0.08);
        }
        .scheme-section .action-btn i {
          margin-right: 0.4em;
        }
        .scheme-section .table-responsive {
          border-radius: 12px;
          overflow-x: auto;
        }
        @media (max-width: 1200px) {
          .student-section, .scheme-section {
            padding: 1.2rem 0.5rem 1rem 0.5rem;
          }
        }
        @media (max-width: 900px) {
          .student-section, .scheme-section {
            padding: 1rem 0.2rem 1rem 0.2rem;
          }
          .student-section .details-grid {
            grid-template-columns: 1fr 1fr;
            gap: 0.7rem 1.2rem;
          }
        }
        @media (max-width: 700px) {
          .student-section .details-grid {
            grid-template-columns: 1fr;
            gap: 0.5rem 0;
          }
        }
        @media (max-width: 600px) {
          .student-section, .scheme-section {
            padding: 0.5rem 0.1rem 0.5rem 0.1rem;
            border-radius: 0;
            box-shadow: none;
          }
          .student-section .profile-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.7rem;
                border-bottom: 1px solid #e3e3ff;
                padding-bottom: 15px;
          }
          .student-section .profile-avatar {
            width: 56px;
            height: 56px;
            font-size: 1.5rem;
            margin-right: 0;
            margin-bottom: 0.5rem;
          }
          .student-section .profile-info h4 {
            font-size: 1.1rem;
          }
          .section-title {
            font-size: 1.2rem;
            padding-left: 0.4rem;
            margin-bottom: 1rem;
          }
        }

      // new css
      /* MAIN CARD */

.student-premium-card{
background: linear-gradient(145deg,#ffffff,#f4f6fb);
border-radius:16px;
padding:28px;
box-shadow:0 10px 35px rgba(0,0,0,0.08);
transition:all .3s ease;
border:1px solid rgba(0,0,0,0.04);
}
  


/* SECTION TITLE */

.section-title{
font-size:20px;
font-weight:600;
color:#2c3e70;
display:flex;
align-items:center;
gap:10px;
margin-bottom:12px;
border-left:4px solid #5b6cff;
padding-left:12px;
}

.section-title i{
font-size:22px;
color:#5b6cff;
}


/* PROFILE HEADER */

.profile-header{
display:flex;
align-items:center;
gap:18px;
margin-bottom:25px;
}


/* AVATAR */

.profile-avatar{
width:65px;
height:65px;
border-radius:50%;
display:flex;
align-items:center;
justify-content:center;
font-size:24px;
font-weight:600;
color:white;
background:linear-gradient(135deg,#5b6cff,#7a8cff);
box-shadow:0 6px 18px rgba(91,108,255,0.4);
}


/* PROFILE NAME */

.profile-info h4{
margin:0;
font-size:22px;
font-weight:600;
color:#2b2f4b;
margin-bottom:6px;
}


/* BADGES */

.profile-info .badge{
font-size:12px;
padding:6px 10px;
border-radius:6px;
margin-right:4px;
letter-spacing:.3px;
}


/* DETAILS GRID */

.details-grid{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
gap:18px;
margin-top:15px;
}


/* DETAIL ITEM */

.details-grid div{
background:white;
border-radius:10px;
padding:8px 14px;
border:1px solid #e4ebff; 
transition:all .25s ease;
display:flex;
align-items:center;
justify-content:space-between;
flex-wrap:wrap;
}


.details-grid div:hover{
background:#f9faff;
transform:translateY(-2px);
box-shadow:0 6px 16px rgba(0,0,0,0.05);
}


/* LABEL */

.details-label{
font-weight:600;
color:#4a4f6d;
font-size:14px;
display:flex;
align-items:center;
gap:6px;
}


/* ICON */

.details-label i{
color:#5b6cff;
font-size:15px;
}


/* VALUE */

.details-value{
font-weight:500;
color:#2b2f4b;
font-size:14px;
margin-left:6px;
}


/* VERIFIED ICON */

.bi-patch-check-fill{
font-size:16px;
}

.bi-x-circle-fill{
font-size:16px;
}


/* MOBILE RESPONSIVE */

@media(max-width:768px){

.profile-header{
flex-direction:column;
align-items:flex-start;
}

.profile-avatar{
width:55px;
height:55px;
font-size:20px;
}

.details-grid{
grid-template-columns:1fr;
}

}.student-premium-card{
animation:fadeStudent .5s ease;
}

@keyframes fadeStudent{

from{
opacity:0;
transform:translateY(8px);
}

to{
opacity:1;
transform:translateY(0);
}

}
      /* HEADER ALIGNMENT */

.profile-header{
display:flex;
align-items:center;
gap:18px;
margin-bottom:22px;
}


/* NAME */

.student-name-row h4{
font-size:19px;
font-weight:600;
margin-bottom:6px;
color:#2c3553;
} 


/* META ROW */

.student-meta{
display:flex;
flex-wrap:wrap;
gap:8px;
}


/* BADGE IMPROVEMENTS */

.student-meta .badge{
font-size:13px;
padding:6px 10px;
border-radius:6px;
display:flex;
align-items:center;
font-weight:500;
}


/* PHONE BADGE */

.badge-phone{
background:#eef2ff;
color:#3949ab;
border:1px solid #e0e6ff;
}


/* ICON INSIDE BADGE */

.student-meta i{
font-size:13px;
}


/* AVATAR IMPROVEMENT */

.profile-avatar{
width:60px;
height:60px;
border-radius:50%;
display:flex;
align-items:center;
justify-content:center;
font-size:22px;
font-weight:600;
color:white;
background:linear-gradient(135deg,#4f46e5,#6366f1);
box-shadow:0 6px 15px rgba(79,70,229,.35);
}
      .badge-phone i:last-child{
font-size:14px;
margin-left:3px;
}
      ul#student_info_update {
    border-bottom: 0;
}
      #student_info_update button.nav-link.active {
    border-radius: 4px 7px;
    box-shadow: 1px 5px 10px rgb(0 0 0 / 20%) !important;
}

#student_info_update button.nav-link {
    border: 1px solid #6859b0; 
    border-radius: 4px 7px;
    color: #33208c;
          font-size: 14px;
}

      #student_info_update button.nav-link:hover { 
    background: #6859b0;
    color: #fff;
      transition: 0.3 all;
} 
.text-view {
          font-size: 12px;
    font-weight: 600;
}

      .details-label i{
color:#6859b0 !important; 
margin-right:6px; 
}

      /* modal surface */
.custom-modal .modal-content{
  border-radius:16px;
  border:none;
  box-shadow:0 20px 60px rgba(0,0,0,0.15);
  padding:10px;
}

/* cards */
.refresh-card{
  background:#fff;
  border:1px solid #eef1f6;
  border-radius:12px;
  padding:16px;
  transition:all .25s ease;
}

.refresh-card:hover{
  transform:translateY(-3px);
  box-shadow:0 12px 28px rgba(0,0,0,0.08);
  border-color:#dbe2ff;
}

/* header inside card */
.refresh-card .card-header{
  display:flex;
  gap:12px;
  align-items:center;
}

.refresh-card .card-header i{
  font-size:20px;
  color:#5b5fc7;
  background:#eef0ff;
  padding:10px;
  border-radius:10px;
}

/* title */
.refresh-card h6{
  margin:0;
  font-weight:600;
}

/* subtitle */
.refresh-card p{
  margin:0;
  font-size:12px;
  color:#6b7280;
}

/* checkbox spacing */
.form-check{
  cursor:pointer;
}

      .modal.fade .modal-dialog{
  transform:translateY(20px) scale(.98);
  transition:all .25s ease;
}

.modal.show .modal-dialog{
  transform:translateY(0) scale(1);
}

      // new css
      </style>
      <div class="student-premium-card row mx-0 mt-4">
      <div class="student-section col-lg-12"> 
        <ul class="nav nav-tabs" id="student_info_update" role="tablist">

  <li class="nav-item" role="presentation">
    <button class="nav-link ripple active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab">
      <i class="bi bi-person me-1"></i>
      Student Details
    </button>
  </li>

  <li class="nav-item mx-2" role="presentation">
    <button class="nav-link ripple" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab">
      <i class="bi bi-telephone-fill me-1"></i>
      Contact Details
    </button>
  </li>

  <li class="nav-item" role="presentation">
    <button class="nav-link ripple" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact-tab-pane" type="button" role="tab">
      <i class="bi bi-people-fill me-1"></i>
      Family Information
    </button>
  </li>

  <li class="nav-item mx-2" role="presentation">
    <button class="nav-link ripple" id="disabled-tab" data-bs-toggle="tab" data-bs-target="#disabled-tab-pane" type="button" role="tab">
      <i class="bi bi-mortarboard-fill me-1"></i>
      Academic Information
    </button>
  </li>

  <li class="nav-item" role="presentation">
    <button class="nav-link ripple" id="disabled-tab1" data-bs-toggle="tab" data-bs-target="#disabled-tab-pane1" type="button" role="tab">
      <i class="bi bi-bank2 me-1"></i>
      Bank Account Information
    </button>
  </li>

  <li class="nav-item mx-2" role="presentation">
    <button class="nav-link ripple" id="disabled-tab2" data-bs-toggle="tab" data-bs-target="#disabled-tab-pane2" type="button" role="tab">
      <i class="bi bi-tags-fill me-1"></i>
      Category Details
    </button>
  </li>

</ul>

<div class="tab-content" id="myTabContent">


  <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">

    <div class="details-grid">

  <div>
    <span class="details-label"><i class="bi bi-person-fill"></i> Name:</span>
    <span class="details-value">Kumar</span>
  </div>

  <div>
    <span class="details-label">
      <i class="bi bi-cake2-fill"></i> Date of Birth:
    </span>
    <span class="details-value">
      ${student.dob || '12/03/2001'}
    </span>
  </div>

  <div>
    <span class="details-label">
      <i class="bi bi-gender-${student.gender === 'Male' ? 'male' : 'female'}"></i> Gender:
    </span>
    <span class="details-value">
      ${student.gender || '-'}
    </span>
  </div>

  <div>
    <span class="details-label"><i class="bi bi-globe2"></i> Nationality:</span>
    <span class="details-value">Indian</span>
  </div>

  <div>
    <span class="details-label"><i class="bi bi-book-half"></i> Religion:</span>
    <span class="details-value">Hindu</span>
  </div>

  <div>
    <span class="details-label"><i class="bi bi-diagram-3-fill"></i> Community:</span>
    <span class="details-value">${student.community || '-'}</span>
  </div>

  <div>
    <span class="details-label"><i class="bi bi-people-fill"></i> Caste:</span>
    <span class="details-value">${student.caste || '-'}</span>
  </div>

  <div>
    <span class="details-label"><i class="bi bi-credit-card-2-front-fill"></i> Aadhaar Number:</span>
    <span class="details-value">${student.aadhaar_no || '-'}</span>
  </div>

  <div>
    <span class="details-label"><i class="bi bi-award-fill"></i> First Graduate:</span>
    <span class="details-value">Yes</span>
  </div>

  <div>
    <span class="details-label"><i class="bi bi-universal-access-circle"></i> Disability:</span>
    <span class="details-value">No</span>
  </div>

  <div>
    <span class="details-label"><i class="bi bi-hash"></i> UMIS:</span>
    <span class="details-value">${student.umis_no || '-'}</span>
  </div>

  <div>
    <span class="details-label"><i class="bi bi-translate"></i> Medium:</span>
    <span class="details-value">English</span>
  </div>

  <div>
    <span class="details-label"><i class="bi bi-person-badge-fill"></i> GBM ID:</span>
    <span class="details-value">985623</span>
  </div>

  <div>
    <span class="details-label"><i class="bi bi-bank2"></i> PFMS Code:</span>
    <span class="details-value">9865</span>
  </div>

</div>

      <div class="mt-2 alert alert-info d-flex align-items-center justify-content-between py-1 px-3 mb-0">
    <span class="text-view">
      If your UMIS data is not reflected in SSP, click the refresh button to update your information instantly.
    </span>
    <a data-bs-toggle="modal" data-bs-target=".refreshModal" class="ripple btn btn-primary btn-sm cpointer">
      <i class="bi bi-arrow-clockwise"></i> Refresh
    </a>
  </div>

  </div>
  <div class="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">

    <div class="details-grid">

  <div>
    <span class="details-label">
      <i class="bi bi-phone-fill"></i> Mobile No:
    </span>

    <span class="details-value">
      8148809858
    </span>

    <i class="bi bi-patch-check-fill text-success" title="Mobile Verified" style="margin-left:4px;"></i>
  </div>

  <div>
    <span class="details-label">
      <i class="bi bi-envelope-fill"></i> Email ID:
    </span>
    <span class="details-value">student@gmail.com</span>
  </div>

  <div>
    <span class="details-label">
      <i class="bi bi-house-door-fill"></i> Permanent Address:
    </span>
    <span class="details-value">No:3, test road, Anna Salai.</span>
  </div>

  <div>
    <span class="details-label">
      <i class="bi bi-geo-alt-fill"></i> State:
    </span>
    <span class="details-value">Tamil Nadu</span>
  </div>

  <div>
    <span class="details-label">
      <i class="bi bi-map-fill"></i> District:
    </span>
    <span class="details-value">Chennai</span>
  </div>

  <div>
    <span class="details-label">
      <i class="bi bi-mailbox2"></i> Pincode:
    </span>
    <span class="details-value">600058</span>
  </div>

</div>
      <div class="mt-2 alert alert-info d-flex align-items-center justify-content-between py-1 px-3 mb-0">
    <span class="text-view">
      If your UMIS data is not reflected in SSP, click the refresh button to update your information instantly.
    </span>
    <a href="#" class="btn btn-primary btn-sm">
      <i class="bi bi-arrow-clockwise"></i> Refresh
    </a>
  </div>
  </div>

  <div class="tab-pane fade" id="contact-tab-pane" role="tabpanel" aria-labelledby="contact-tab" tabindex="0">
    <div class="details-grid">

  <div>
    <span class="details-label"><i class="bi bi-person-fill"></i> Father Name:</span>
    <span class="details-value">Kumar</span>
  </div>

  <div>
    <span class="details-label"><i class="bi bi-person-heart"></i> Mother Name:</span>
    <span class="details-value">Priya</span>
  </div>

  <div>
    <span class="details-label"><i class="bi bi-person-badge-fill"></i> Guardian Name:</span>
    <span class="details-value">Ramesh</span>
  </div>

  <div>
    <span class="details-label"><i class="bi bi-phone-fill"></i> Parent Mobile No:</span>
    <span class="details-value">9865321487</span>
  </div>

  <div>
    <span class="details-label"><i class="bi bi-envelope-fill"></i> Parent Email ID:</span>
    <span class="details-value">parent@gmail.com</span>
  </div>

  <div>
    <span class="details-label"><i class="bi bi-credit-card-2-front-fill"></i> Family Card Number:</span>
    <span class="details-value">987456231245</span>
  </div>

  <div>
    <span class="details-label"><i class="bi bi-cash-stack"></i> Family Annual Income:</span>
    <span class="details-value">30,0000</span>
  </div>

</div>
      <div class="mt-2 alert alert-info d-flex align-items-center justify-content-between py-1 px-3 mb-0">
    <span class="text-view">
      If your UMIS data is not reflected in SSP, click the refresh button to update your information instantly.
    </span>
    <a data-bs-toggle="modal" data-bs-target=".refreshModal" class="ripple btn btn-primary btn-sm cpointer">
      <i class="bi bi-arrow-clockwise"></i> Refresh
    </a>
  </div>
  </div>

  <div class="tab-pane fade" id="disabled-tab-pane" role="tabpanel" aria-labelledby="disabled-tab" tabindex="0">

    <div class="details-grid">

  <div>
    <span class="details-label"><i class="bi bi-diagram-3-fill"></i> Course Branch:</span>
    <span class="details-value">CSE</span>
  </div>

  <div>
    <span class="details-label"><i class="bi bi-mortarboard-fill"></i> Course:</span>
    <span class="details-value">BE</span>
  </div>

  <div>
    <span class="details-label"><i class="bi bi-calendar-event-fill"></i> Date of Admission:</span>
    <span class="details-value">13/03/2024</span>
  </div>

  <div>
    <span class="details-label"><i class="bi bi-card-text"></i> Registration Number:</span>
    <span class="details-value">568923475869</span>
  </div>

  <div>
    <span class="details-label"><i class="bi bi-arrow-left-right"></i> Lateral Entry:</span>
    <span class="details-value">Yes</span>
  </div>

  <div>
    <span class="details-label"><i class="bi bi-house-door-fill"></i> Hosteler:</span>
    <span class="details-value">Yes</span>
  </div>

  <div>
    <span class="details-label"><i class="bi bi-building"></i> Hosteler Type:</span>
    <span class="details-value">Inside Campus</span>
  </div>

  <div>
    <span class="details-label"><i class="bi bi-building-fill"></i> Institute Name:</span>
    <span class="details-value">AGNI COLLEGE OF TECHNOLOGY</span>
  </div>

  <div>
    <span class="details-label"><i class="bi bi-journal-bookmark-fill"></i> Mode of Study:</span>
    <span class="details-value">Regular</span>
  </div>

  <div>
    <span class="details-label"><i class="bi bi-calendar3"></i> Academic Year:</span>
    <span class="details-value">2026</span>
  </div>

  <div>
    <span class="details-label"><i class="bi bi-award-fill"></i> Studying Year:</span>
    <span class="details-value">2026</span>
  </div>

</div>


      <div class="mt-2 alert alert-info d-flex align-items-center justify-content-between py-1 px-3 mb-0">
    <span class="text-view">
      If your UMIS data is not reflected in SSP, click the refresh button to update your information instantly.
    </span>
    <a data-bs-toggle="modal" data-bs-target=".refreshModal" class="ripple btn btn-primary btn-sm cpointer">
      <i class="bi bi-arrow-clockwise"></i> Refresh
    </a>
  </div>

  </div>

  <div class="tab-pane fade" id="disabled-tab-pane1" role="tabpanel" aria-labelledby="disabled-tab" tabindex="0">

    <div class="details-grid">

  <div>
    <span class="details-label"><i class="bi bi-bank2"></i> Bank:</span>
    <span class="details-value">Bank</span>
  </div>

  <div>
    <span class="details-label"><i class="bi bi-diagram-3"></i> Branch:</span>
    <span class="details-value">Branch</span>
  </div>

  <div>
    <span class="details-label"><i class="bi bi-credit-card-2-front"></i> Account Number:</span>
    <span class="details-value">896532874512</span>
  </div>

  <div>
    <span class="details-label"><i class="bi bi-patch-check-fill"></i> Account Verified:</span>
    <span class="details-value">Verified</span>
  </div>

</div>


      <div class="mt-2 alert alert-info d-flex align-items-center justify-content-between py-1 px-3 mb-0">
    <span class="text-view">
      If your UMIS data is not reflected in SSP, click the refresh button to update your information instantly.
    </span>
    <a data-bs-toggle="modal" data-bs-target=".refreshModal" class="ripple btn btn-primary btn-sm cpointer">
      <i class="bi bi-arrow-clockwise"></i> Refresh
    </a>
  </div>

  </div>

<div class="tab-pane fade" id="disabled-tab-pane2" role="tabpanel" aria-labelledby="disabled-tab" tabindex="0">

  <div class="details-grid">

  <div>
    <span class="details-label"><i class="bi bi-tags-fill"></i> Special Category:</span>
    <span class="details-value">Yes</span>
  </div>

</div>

  <div class="mt-2 alert alert-info d-flex align-items-center justify-content-between py-1 px-3 mb-0">
    <span class="text-view">
      If your UMIS data is not reflected in SSP, click the refresh button to update your information instantly.
    </span>
    <a data-bs-toggle="modal" data-bs-target=".refreshModal" class="ripple btn btn-primary btn-sm cpointer">
      <i class="bi bi-arrow-clockwise"></i> Refresh
    </a>
  </div>

</div>
</div>

</div>

      <div class="scheme-section">
        
       <div class="section-header-card mt-2 mb-3">

        <div class="section-header-left">
          <div class="section-icon">
            <i class="bi bi-award"></i>
          </div>

          <div>
            <h5>Scheme Details</h5>
            <span class="section-subtitle">
              Available scholarship schemes for the student
            </span>
          </div>
        </div>

      </div>  



      


        ${(() => {
        // Filter schemes to only include eligible ones
        const eligibleSchemes = data.student_details.filter(s => s.is_eligible === true || s.is_eligible === 1);

        if (eligibleSchemes.length > 0) {
          return `
            <div class="table-responsive">
              <table class="table table-bordered scheme-table" id="inline_scheme_table">
                <thead>
                  <tr>
                    <th style="width:40px;text-align:center;"><input type="checkbox" id="inline_select_all_schemes" aria-label="Select all schemes"></th>
                    <th>Scheme Name</th>
                    <th>Scholarship Amount</th>
                    <th>Maintenance  Amount</th>
                    <th>Disability Amount</th>
                    <th>Scheme Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody id="inline_scheme_table_body">
                  ${eligibleSchemes.map((s, idx) => `
                                  <tr data-scheme-id="${s.scheme_id || ''}">
                                    <td style="text-align:center;">
                                      <input type="checkbox" class="inline_scheme_inclusive_checkbox" 
                                            ${s.is_applied == true ? '' : `data-idx="${idx}" data-scheme-id="${s.scheme_id || ''}" data-scheme-ruleid="${s.scheme_ruleid || ''}"`} 
                                            ${s.is_applied == true ? 'disabled' : ''} 
                                            aria-label="Select scheme">
                                    </td>
                                    <td>${s.scheme_name || '-'}</td>
                                    <td>${this.formatCurrency ? this.formatCurrency(s.scholarshipamount) : (s.scholarshipamount || '-')}</td>
                                            <td>${this.formatCurrency(s.maintenanceamount)}</td>
        <td>${this.formatCurrency(s.disabilityamout)}</td>
                                    <td><span class="scheme-badge ${s.schemetype ? s.schemetype.toLowerCase().replace(/\s/g, '-') : ''}" aria-label="${s.schemetype || '-'}">${s.schemetype || '-'}</span></td>
                                  <td>
                    <span class="status-chip ${s.is_applied ? 'applied' : 'not-applied'}">
                      ${s.is_applied ?
              `<button class="btn btn-success btn-sm applied_application" data-filepath="${s.filepath}">Applied</button>` :
              'Not Applied'}
                    </span>
                  </td>
                    </tr>
                  `).join('')}
              
                </tbody>
              </table>
            </div>
            <div class="mt-3 d-flex flex-wrap align-items-center">
              <button type="button" class="btn btn-primary action-btn btn-sm" id="inline_apply_button" disabled title="Apply for selected scheme(s)"><i class="bi bi-check-circle"></i>Apply</button>
              <!-- <button type="button" class="btn btn-primary action-btn btn-sm" id="inline_sync_button"><i class="bi bi-check-circle"></i>Refresh</button>  --> 
           
                        
              </div>
            `;
        } else {
          return `
            <div class="alert alert-warning" role="alert">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              <strong>No schemes available.</strong> Student is not eligible for any schemes at this time.
            </div>
            `;
        }
      })()}
      </div>
    `;
    document.getElementById('studentDetailsInline').innerHTML = detailsHtml;

    // --- Interactivity logic (clone of modal logic, but for inline IDs/classes) ---
    // Only set up interactivity if eligible schemes are available
    const eligibleSchemes = data.student_details.filter(s => s.is_eligible === true || s.is_eligible === 1);
    if (eligibleSchemes.length > 0) {
      const checkboxes = document.querySelectorAll('.inline_scheme_inclusive_checkbox');
      const selectAll = document.getElementById('inline_select_all_schemes');
      const applyButton = document.getElementById('inline_apply_button');
      const syncButton = document.getElementById('inline_sync_button');
      // Determine the most restrictive scheme type
      const types = eligibleSchemes.map(s => (s.schemetype || '').toLowerCase()).filter(Boolean);
      let schemeType = 'inclusive';
      if (types.includes('exclusive')) {
        schemeType = 'exclusive';
      } else if (types.includes('exclusive with exceptions')) {
        schemeType = 'exclusive with exceptions';
      } else if (types.length > 0 && types.every(t => t == 'inclusive')) {
        schemeType = 'inclusive';
      }
      // Update button state
      const updateButtonState = () => {
        const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
        if (applyButton) applyButton.disabled = !anyChecked;
      };
      // Select All logic
      if (selectAll) {
        selectAll.onclick = () => {
          if (schemeType == 'exclusive' || schemeType == 'exclusive with exceptions') {
            selectAll.checked = false;
            Swal.fire({
              title: 'Restricted Selection',
              text: `Only one ${schemeType} scheme can be selected.`,
              icon: 'warning',
              confirmButtonText: 'OK',
            });
          } else {
            checkboxes.forEach(cb => {
              const schemeId = cb.getAttribute('data-scheme-id');
              const scheme = eligibleSchemes.find(s => s.scheme_id == schemeId);
              if (scheme && (scheme.scheme_amount === null || scheme.scheme_amount === undefined || scheme.scholarshipamount === null || scheme.scholarshipamount == 0)) {
                cb.checked = false;
              } else {
                cb.checked = selectAll.checked;
              }
            });
            updateButtonState();
          }
        };
      }
      // Checkbox logic (clone of modal)
      checkboxes.forEach((cb, index) => {
        cb.addEventListener('change', () => {
          const schemeId = cb.getAttribute('data-scheme-id');
          const scheme = eligibleSchemes.find(s => s.scheme_id == schemeId);
          if (scheme && (scheme.scheme_amount === null || scheme.scheme_amount === undefined || scheme.scholarshipamount == 0 || scheme.scholarshipamount == null)) {
            cb.checked = false;
            Swal.fire({
              title: 'Invalid Selection',
              text: `Cannot select "${scheme.scheme_name}" - scheme amount or scholarship amount is null.`,
              icon: 'warning',
              confirmButtonText: 'OK',
            });
            updateButtonState();
            return;
          }
          const schemeType = scheme?.schemetype?.toLowerCase() || 'inclusive';
          const excludedSchemeIds = scheme?.exclusion_schemes?.map(ex => ex.exclusion_scheme_id.toString()) || [];
          if (schemeType == 'exclusive' && cb.checked) {
            checkboxes.forEach((otherCb, otherIndex) => {
              if (otherIndex !== index) {
                otherCb.checked = false;
                otherCb.disabled = true;
              }
            });
            if (selectAll) selectAll.checked = false;
          } else if (schemeType == 'exclusive with exceptions' && cb.checked) {
            checkboxes.forEach((otherCb, otherIndex) => {
              if (otherIndex !== index) {
                const otherSchemeId = otherCb.getAttribute('data-scheme-id');
                const otherScheme = eligibleSchemes.find(s => s.scheme_id == otherSchemeId);
                const otherSchemeType = otherScheme?.schemetype?.toLowerCase() || 'inclusive';
                if (excludedSchemeIds.includes(otherSchemeId)) {
                  otherCb.checked = false;
                  otherCb.disabled = true;
                } else {
                  otherCb.checked = false;
                  otherCb.disabled = true;
                }
              }
            });
            if (selectAll) selectAll.checked = false;
          } else if (schemeType == 'inclusive' && cb.checked) {
            checkboxes.forEach((otherCb, otherIndex) => {
              if (otherIndex !== index) {
                const otherSchemeId = otherCb.getAttribute('data-scheme-id');
                const otherScheme = eligibleSchemes.find(s => s.scheme_id == otherSchemeId);
                const otherSchemeType = otherScheme?.schemetype?.toLowerCase() || 'inclusive';
                if (otherSchemeType == 'exclusive') {
                  otherCb.checked = false;
                  otherCb.disabled = true;
                } else {
                  otherCb.disabled = false;
                }
              }
            });
          } else if (!cb.checked) {
            checkboxes.forEach((otherCb, otherIndex) => {
              const otherSchemeId = otherCb.getAttribute('data-scheme-id');
              const otherScheme = eligibleSchemes.find(s => s.scheme_id == otherSchemeId);
              const otherSchemeType = otherScheme?.schemetype?.toLowerCase() || 'inclusive';
              const checkedSchemes = Array.from(checkboxes).filter(c => c.checked);
              const hasExclusive = checkedSchemes.some(c => {
                const sId = c.getAttribute('data-scheme-id');
                const s = eligibleSchemes.find(s => s.scheme_id == sId);
                return s?.schemetype?.toLowerCase() == 'exclusive';
              });
              const hasExclusiveWithExceptions = checkedSchemes.some(c => {
                const sId = c.getAttribute('data-scheme-id');
                const s = eligibleSchemes.find(s => s.scheme_id == sId);
                return s?.schemetype?.toLowerCase() == 'exclusive with exceptions';
              });
              if (hasExclusive) {
                otherCb.disabled = true;
                otherCb.checked = false;
              } else if (hasExclusiveWithExceptions) {
                const exclusiveWithExceptionsScheme = checkedSchemes.find(c => {
                  const sId = c.getAttribute('data-scheme-id');
                  const s = eligibleSchemes.find(s => s.scheme_id == sId);
                  return s?.schemetype?.toLowerCase() == 'exclusive with exceptions';
                });
                const sId = exclusiveWithExceptionsScheme?.getAttribute('data-scheme-id');
                const s = eligibleSchemes.find(s => s.scheme_id == sId);
                const excludedIds = s?.exclusion_schemes?.map(ex => ex.exclusion_scheme_id.toString()) || [];
                if (excludedIds.includes(otherSchemeId)) {
                  otherCb.disabled = true;
                  otherCb.checked = false;
                } else if (otherSchemeType == 'inclusive') {
                  otherCb.disabled = false;
                } else {
                  otherCb.disabled = true;
                  otherCb.checked = false;
                }
              } else {
                otherCb.disabled = false;
              }
            });
          }
          // Highlight the selected row
          checkboxes.forEach((checkbox, idx) => {
            const row = checkbox.closest('tr');
            if (checkbox.checked) {
              row.style.backgroundColor = '#e6f3ff';
            } else {
              row.style.backgroundColor = '';
            }
          });
          updateButtonState();
        });
      });
      // Initial button state
      updateButtonState();
      // Apply button logic
      if (applyButton) {
        applyButton.onclick = () => {
          const selectedCheckboxes = Array.from(document.querySelectorAll('.inline_scheme_inclusive_checkbox:checked'));
          const selectedSchemeIds = selectedCheckboxes.map(cb => cb.getAttribute('data-scheme-id'));
          const selectedSchemes = eligibleSchemes.filter(s => selectedSchemeIds.includes(String(s.scheme_id)));

          if (selectedSchemeIds.length == 0) {
            Swal.fire({
              title: 'No Scheme Selected',
              text: 'Please select a scheme to apply.',
              icon: 'warning',
              confirmButtonText: 'OK',
            });
            return;
          }




          // Use the same validation as modal
          if (!this.validateSchemeSelection({ ...data, student_details: eligibleSchemes }, 'inline_scheme_inclusive_checkbox')) {
            return;
          }
          // You can call showApplyModal or any other logic here
          this.showApplyModal({ ...data, selected_schemes: selectedSchemes }, type, 'inline_scheme_inclusive_checkbox');
        };
      }
      // Sync/refresh button logic (optional, can reload data or trigger a callback)

    } // End of if (data.is_eligible === true || data.is_eligible === 1)
  }


}

customElements.define('student-details-component', StudentDetailsComponent);