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
    if (amount === null || amount === undefined || amount === '') {
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

    if (!document.getElementById('studentDetailsModal')) {
      document.body.insertAdjacentHTML('beforeend', this.getModalHTML());
      this.initializeEventListeners();
    }

    console.log('StudentDetailsComponent connected');
  }

  disconnectedCallback() {
    console.log('StudentDetailsComponent disconnected');
    this.eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.eventListeners = [];

    if (this.studentDetailsModalInstance) {
      this.studentDetailsModalInstance.dispose();
      this.studentDetailsModalInstance = null;
    }
    if (this.applyModalInstance) {
      this.applyModalInstance.dispose();
      this.applyModalInstance = null;
    }
    if (this.otpModalInstance) {
      this.otpModalInstance.dispose();
      this.otpModalInstance = null;
    }
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

    // Resend OTP
    $(document).off('click', '#requestAgain').on('click', '#requestAgain', () => {
      this.handleResendOtp();
    });

    $(document).on('click', '#closeModal', function () {
      $('#studentDetailsModal').modal('show');

    })

    $(document).on('click', '#closeModal', function () {
      $('#studentDetailsModal').modal('show');

    })

    // OTP Input Navigation
    const otpInputs = document.querySelectorAll('.otp-input');

    otpInputs.forEach((input, index) => {
      const inputHandler = (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 1);
        if (e.target.value.length === 1 && index < otpInputs.length - 1) {
          otpInputs[index + 1].removeAttribute('disabled');
          otpInputs[index + 1].focus();
        }
      };
      addListener(input, 'input', inputHandler);

      const keydownHandler = (e) => {
        if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
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
        const data = {
          scheme_id: schemeId,
          user_id: 1
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
                          if (value.value !== "All" && value.text !== "All" && !(value.text === "-1" && value.value === "Not Applicable")) {
                            var listItem = $('<li class="parameter-items"></li>').text(value.value || value.text); // Create list items
                            $list.append(listItem); // Append the list item to the list
                          }
                        });

                        var $fieldContainer = $('#scheme_info').find(fieldMapping[field.fieldname]).closest('.mb-1'); // Get the parent container

                        // Check if the list is empty
                        if ($list.children().length === 0) {
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

    if (event.target.value === 'notApply') {
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
        I confirm that I fully understand the benefits and conditions of the scholarship. I assure you that the
        information provided above is accurate. I wish to apply for this scholarship,
        <b>as I meet the eligibility criteria for this scheme.</b>
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
      </style>

      <div class="modal fade" id="studentDetailsModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" role="dialog" aria-labelledby="studentDetailsModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
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
                <div class="detail-row"><span class="detail-label">Scheme Name:</span><span class="detail-value" id="modal_scheme_name">-</span></div>
                <div class="detail-row"><span class="detail-label">Scholarship Amount:</span><span class="detail-value" id="modal_scholarship_amount">-</span></div>
                <div class="detail-row eligible_card d-none"><span class="detail-label">Eligibility:</span><span class="detail-value" id="modal_eligibility">-</span></div>
                <div class="detail-row eligible_card d-none"><span class="detail-label">Message:</span><span class="detail-value" id="modal_eligibility_message">-</span></div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" id="modal_apply_button" style="display: none;">Apply</button>
           <button type="button" class="btn btn-info" id="modal_sync_button" style="display: none;">Refresh</button> 
            </div>
          </div>
        </div>
      </div>

      <div class="modal fade" id="applyModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" role="dialog" aria-labelledby="modalTitleId" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-xl" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" style="color: white !important;">Unified State Scholarship Portal Application</h5>
              <button type="button" class="btn-close applymodal_close" data-bs-dismiss="modal" aria-label="Close" style="color: white !important;">X</button>
            </div>
            <div class="modal-body">
              <div class="applyScreen">
                <div class="container" style="max-width: 1320px;">
                  <div class="row" style="display: flex; justify-content: center; align-items: center;">
                    <div class="tnLogo col-lg-12" style="text-align: center;">
                      <img src="../assets/img/tn_logo.png" alt="tnLogo" style="display: block; margin: 0 auto; width: 50px;">
                      <h5>Unified State Scholarship Portal Application</h5>
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
                    <h6>SCHEME DETAILS</h6>
                    <div class="col-lg-4" style="width: 33.33%; float: left;">
                      <form class="">
                        <div class="form-group marBtm">
                          <ul>
                            <li><label for="dept">Scheme Name:</label></li>
                            <li><label for="dept"><b id="apply_schemename">-</b></label></li>
                          </ul>
                        </div>
                      </form>
                    </div>
               
                     <div class="col-lg-4" style="width: 33.33%; float: left;">
                      <form class="">
                        <div class="form-group marBtm">
                          <ul>
                            <li><label for="dept">Scholarship Amount:</label></li>
                            <li><label for="dept"><b id="apply_scheme_amount">-</b></label></li>
                          
                          </ul>
                        </div>
                      </form>
                    </div>
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
                              I confirm that I fully understand the benefits and conditions of the scholarship. I assure you that the
                              information provided above is accurate. I wish to apply for this scholarship,
                              <b>as I meet the eligibility criteria for this scheme.</b>
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
      const encryptDatas = { student_id: umis_no, scheme_ruleid: scheme_ruleid };
      const response = await $.ajax({
        url: config.ssp_api_url + '/get_student_details',
        type: 'POST',
        headers: { 'X-APP-KEY': 'te$t', 'X-APP-NAME': 'te$t' },
        data: { data: encryptData(encryptDatas) },
      });

      if (response.success === 1) {
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

  showStudentDetailsModal(data, type) {
    console.log("sds", data);

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
      // { id: 'modal_sub_scheme_name', key: 'sub_scheme_name' },
      { id: 'modal_scholarship_amount', key: 'scholarshipamount', format: (val) => this.formatCurrency(val) },
      { id: 'modal_eligibility', key: 'fn_check_studentapply_eligibility', format: (val) => val ? 'Eligible' : 'Not Eligible' },
      { id: 'modal_eligibility_message', key: 'message' },
    ];

    const missingElements = [];

    // Populate student fields
    studentFields.forEach(({ id, key, format }) => {
      const element = document.getElementById(id);
      if (element) {
        const value = data?.student_details?.[key];
        element.textContent = value != null ? (format ? format(value) : value.toString()) : '-';
      } else {
        missingElements.push(id);
      }
    });

    // Populate scheme fields
    schemeFields.forEach(({ id, key, format }) => {
      const element = document.getElementById(id);


      if (element) {

        const value = data?.student_details?.[key] ?? data?.eligibility?.[key];
        element.textContent = value != null ? (format ? format(value) : value.toString()) : '-';

        if (value == 'Not Eligible') {
          $('.eligible_card').show();
        }
      } else {
        missingElements.push(id);
      }
    });

    $('#about_scheme').data('scheme-id', data.student_details.scheme_id);
    $('#about_scheme').data('sub-scheme-id', data.student_details.scheme_ruleid);
    $('#sspstud_id').val(data.student_details.student_id);

    if (data.student_details.community_certificate_verified == true) {
      $("#community_verify")
        .removeClass('bi-x-circle-fill text-danger') // Remove the cancel icon classes if present
        .addClass('bi bi-patch-check-fill text-success'); // Add the verified icon class
    } else {
      $("#community_verify")
        .removeClass('bi-patch-check-fill text-success') // Remove the verified icon class if present
        .addClass('bi bi-x-circle-fill text-danger'); // Add the cancel icon classes
    }
    if (data.student_details.income_certificate_verified == true) {
      $("#income_verify")
        .removeClass('bi-x-circle-fill text-danger') // Remove the cancel icon classes if present
        .addClass('bi bi-patch-check-fill text-success'); // Add the verified icon class
    } else {
      $("#income_verify")
        .removeClass('bi-patch-check-fill text-success') // Remove the verified icon class if present
        .addClass('bi bi-x-circle-fill text-danger'); // Add the cancel icon classes
    }
    if (data.student_details.aadhaar_verified == true) {
      $("#aadhar_verify")
        .removeClass('bi-x-circle-fill text-danger') // Remove the cancel icon classes if present
        .addClass('bi bi-patch-check-fill text-success'); // Add the verified icon class
    } else {
      $("#aadhar_verify")
        .removeClass('bi-patch-check-fill text-success') // Remove the verified icon class if present
        .addClass('bi bi-x-circle-fill text-danger'); // Add the cancel icon classes
    }


    if (missingElements.length > 0) {
      console.error(`Missing apply modal elements: ${missingElements.join(', ')}`);
    }

    const applyButton = document.getElementById('modal_apply_button');
    const syncButton = document.getElementById('modal_sync_button');
    console.log("dat", data);
    console.log(data.student_details.scholarshipamount, 234567);

    if (type === 'apply') {

      $('.scheme_details_card').show();

      // if (
      //   !data.student_details.aadhaar_verified ||
      //   !data.student_details.community_certificate_verified ||
      //   !data.student_details.income_certificate_verified
      // ) {
      //   let missing = [];
      //   if (!data.student_details.aadhaar_verified) missing.push("Aadhaar");
      //   if (!data.student_details.community_certificate_verified) missing.push("Community Certificate");
      //   if (!data.student_details.income_certificate_verified) missing.push("Income Certificate");

      //   Swal.fire({
      //     title: 'Verification Required',
      //     text: `Please verify: ${missing.join(', ')}`,
      //     icon: 'info',
      //     showConfirmButton: true,
      //   });

      //   if (applyButton) applyButton.style.display = 'none';
      //   if (syncButton) syncButton.style.display = 'inline-block';
      //   if (syncButton) {

      //     syncButton.style.display = 'inline-block';
      //     syncButton.onclick = () => {

      //       $('#studentDetailsModal').modal('hide');
      //       $("#refresh_modal").modal("show");
      //     };
      //   }


      // } else 
      
      if (data?.eligibility?.fn_check_studentapply_eligibility) {
        if (applyButton) {
          applyButton.style.display = 'inline-block';
          applyButton.textContent = 'Apply';
          applyButton.onclick = () => this.showApplyModal(data, type);
        }
        if (syncButton) {

          syncButton.style.display = 'inline-block';
          syncButton.onclick = () => {

            $('#studentDetailsModal').modal('hide');
            // $("#refresh_modal").modal("show");
            Swal.fire({
            title: "Please Wait",
            text: "Temporarily this feature is disabled. Please try again later.",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
          };
          syncButton.onclick = () => {

            $('#studentDetailsModal').modal('hide');
            // $("#refresh_modal").modal("show");
            Swal.fire({
            title: "Please Wait",
            text: "Temporarily this feature is disabled. Please try again later.",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
          };
        }
        if (!data?.student_details || data.student_details.scholarshipamount == 0 || data.student_details.scholarshipamount == null) {
          Swal.fire({
            title: 'Info',
            text: "Scholarship amount not available or zero. Kindly check if the fees for the course are updated.",
            icon: 'info',
            showConfirmButton: true,
          });
          if (applyButton) {
            applyButton.style.display = 'none';
          } else {
            console.warn('Apply button not found in DOM');
          }
          if (syncButton) {
            syncButton.style.display = 'inline-block';
            syncButton.onclick = () => {
              $('#studentDetailsModal').modal('hide');
              $("#refresh_modal").modal("show");
              $('#studentDetailsModal').modal('hide');
              $("#refresh_modal").modal("show");
            };
          } else {
            console.warn('Refresh button not found in DOM');
          }
        }

      }

      else {
        if (applyButton) {
          applyButton.style.display = 'none';
        }
        if (syncButton) {
          syncButton.style.display = 'inline-block';
          syncButton.onclick = () => {
            $('#studentDetailsModal').modal('hide');
            $("#refresh_modal").modal("show");
          };
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
        applyButton.onclick = () => this.showCheckEligibilityModal(data, type);
      }
      if (syncButton) {
        syncButton.style.display = 'inline-block';
        syncButton.onclick = () => {
          $('#studentDetailsModal').modal('hide');
          $("#refresh_modal").modal("show");
        };
        syncButton.onclick = () => {
          $('#studentDetailsModal').modal('hide');
          $("#refresh_modal").modal("show");
        };
      }
    }

    const modalElement = document.getElementById('studentDetailsModal');
    if (modalElement) {
      this.studentDetailsModalInstance = new bootstrap.Modal(modalElement);
      this.studentDetailsModalInstance.show();
    } else {
      console.error('Modal element with ID "studentDetailsModal" not found in DOM');
      Swal.fire({
        title: 'Error',
        text: 'Failed to display student details modal.',
        icon: 'error',
        showConfirmButton: true,
      });
    }
  }

  showApplyModal(data, type) {
    console.log("data", data);
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
        const value = data?.student_details?.[key] ?? data?.eligibility?.[key];
        element.textContent = value != null ? (format ? format(value) : value.toString()) : '-';
      } else {
        missingElements.push(id);
      }
    });
    $('#about_scheme').data('scheme-id', data.student_details.scheme_id);

    if (missingElements.length > 0) {
      console.error(`Missing apply modal elements: ${missingElements.join(', ')}`);
    }

    const applyModalElement = document.getElementById('applyModal');
    if (applyModalElement) {
      this.applyModalInstance = new bootstrap.Modal(applyModalElement);
      this.applyModalInstance.show();

      // Set default state when modal opens
      this.setApplyModalDefaultState();

      $('#applyModal').off('click', '#get_opt').on('click', '#get_opt', () => {
        this.handleApplyButton(data, type);
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
    $('input[name="applicationDecision"]').off('change').on('change', function() {
      const selectedValue = $(this).val();
      const applyButton = $('#get_opt');
      const reasonContainer = $('#reasonContainer');
      const consentCheckbox = $('#applySchemeVerification');
      
      if (selectedValue === 'apply') {
        // Show reason container for "apply" selection
        reasonContainer.hide();
        // Enable button only if consent is checked
        applyButton.prop('disabled', !consentCheckbox.is(':checked'));
      } else if (selectedValue === 'notApply') {
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
    $('#applySchemeVerification').off('change').on('change', function() {
      const isChecked = $(this).is(':checked');
      const selectedDecision = $('input[name="applicationDecision"]:checked').val();
      const applyButton = $('#get_opt');
      
      if (selectedDecision === 'apply') {
        applyButton.prop('disabled', !isChecked);
      } else if (selectedDecision === 'notApply') {
        const reason = $('#notApplyReason').val();
        applyButton.prop('disabled', !isChecked || !reason);
      } else {
        applyButton.prop('disabled', true);
      }
    });
    
    // Add event listener for reason selection
    $('#notApplyReason').off('change').on('change', function() {
      const reason = $(this).val();
      const consentChecked = $('#applySchemeVerification').is(':checked');
      const selectedDecision = $('input[name="applicationDecision"]:checked').val();
      const applyButton = $('#get_opt');
      
      if (selectedDecision === 'notApply') {
        applyButton.prop('disabled', !consentChecked || !reason);
      }
    });
  }

  async showCheckEligibilityModal(data, type) {
    console.log(data);

    const encryptDatas = {
        umis_no: data.student_details.umis_no
    };

    try {
        const response = await $.ajax({
            url: `${config.ssp_api_url}/check_student_eligibility`,
            type: 'POST',
            headers: { 'X-APP-KEY': 'te$t', 'X-APP-NAME': 'te$t' },
            data: { data: encryptData(encryptDatas) }
        });

        if (response.success === 1) {
            const decryptedData = decryptData(response.data);
            console.log('Decrypted Data:', decryptedData);

            // Validate decryptedData structure
            if (!Array.isArray(decryptedData) || decryptedData.length === 0) {
                throw new Error('Invalid or empty decrypted data format');
            }

            // Check if any status is the specific message
            const specificStatus = 'Student must be eligible. Please try Refresh option.';
            const hasSpecificStatus = decryptedData.some(item => item.rule_type === specificStatus);

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
                const allNoScheme = decryptedData.every(item => item.rule_type === noSchemeStatus);

                // Build HTML for the modal
                let tableHtml = `
                    <table style="width:100%; border-collapse: collapse; text-align: left; font-size: 14px;">
                        <thead>
                            <tr>
                                <th style="border: 1px solid #ddd; padding: 8px;">Field</th>
                                <th style="border: 1px solid #ddd; padding: 8px;">Student Value</th>
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
                    ? `<div style="font-weight: bold; margin-bottom: 10px;">The student's data does not match the required scheme parameters. Please update your data in UMIS accordingly and verify your eligibility again.</div>${tableHtml}`
                    : tableHtml;

                // Determine modal title and icon based on eligibility
                const hasIneligible = decryptedData.some(item => item.rule_type === 'exclusive' || item.rule_type === 'inclusive');
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
            Swal.fire({
                icon: 'error',
                title: 'Check Eligibility',
                text: response.data && typeof response.data === 'string' ? response.data : 'Unknown error occurred.'
            });
        }
    } catch (error) {
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

  async handleApplyButton(data, type) {
    console.log('handleApplyButton data:', JSON.stringify(data, null, 2));
    const subssid = data.student_details.scheme_ruleid || '';
    const stud_id = data.student_details?.student_id || '';
    const schemeName = $('#apply_schemename').text();
    const selectedDecision = $('input[name="applicationDecision"]:checked').val();
    const scheme_id = data.student_details.scheme_id || '';
    const umis_id = data.student_details?.umis_no || '';

    $('.error-text').remove();

    if (selectedDecision === 'notApply') {
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

      await this.triggerOTPApi(data, subssid, scheme_id, stud_id, umis_id, schemeName, type);
    } else {
    

      $.ajax({
        url: config.ssp_api_url + "/student/student_verify_flag",
        type: "POST",
        headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
        data: {
          studentid:stud_id,
          subschemeid: subssid,
        },
        success: async (response) => {
          await this.triggerOTPApi(data, subssid, scheme_id, stud_id, umis_id, schemeName, type);
        },
        error: function (xhr, status, error) {
          let errorMessage = xhr.responseJSON && xhr.responseJSON.message 
                ? xhr.responseJSON.message 
                : "An unexpected error occurred";
          let textMessage = xhr.responseJSON && xhr.responseJSON.text 
                ? xhr.responseJSON.text 
                : "";
          Swal.fire({
            title: schemeName,
            text: textMessage,
            icon: "error",
            showConfirmButton: true
          });
        }
      });
     
    }
  }

  //  // Place this outside the function, globally or at class level

  async  triggerOTPApi(data, studsub_Id, scheme_id, stud_id, umis_id, schemeName, type) {
    $('#preloader1').show();
  
    try {

        

        
      const response = await $.ajax({
        url: config.ssp_api_url + '/student/otp_v2',
        type: 'POST',
        headers: { 'X-APP-KEY': 'te$t', 'X-APP-NAME': 'te$t' },
        data: {
          type: 'send',
          isubschemeid: studsub_Id,
          ischemeid: scheme_id,
          istudentid: umis_id,
          umis_id: umis_id,
          scheme_name: schemeName,
          iinterval: 5,
        },
      });
  
      if (response[0]?.success == 1) {
        $('#preloader1').hide();
        $('#applyModal').modal('hide');
        
        const mobileno = response[0].data.mobileno || $('#apply_phone').text();
  
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
          
          const sanitizeDir = (dir) => {
            if (dir == null || typeof dir === 'undefined') return 'unknown';
            return String(dir).replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
          };

          const studentDetails = data.student_details || {};
          console.log(data);
          console.log('sanitizeDir inputs:', {
            student_name: studentDetails.student_name,
            accademic_year_id: studentDetails.accademic_year_id,
            institution_name: studentDetails.institution_name,
            scheme_name: studentDetails.scheme_name,
            sub_scheme_name: studentDetails.sub_scheme_name,
          });

          const student_name = sanitizeDir(studentDetails.student_name || 'unknown_student');
          const pdfDir = sanitizeDir(studentDetails.accademic_year_id || 'unknown_year');
          const pdfDir1 = sanitizeDir(studentDetails.institution_name || 'unknown_institution');
          const pdfDir2 = sanitizeDir(studentDetails.scheme_name || 'unknown_scheme');
          const pdfDir3 = sanitizeDir(studentDetails.sub_scheme_name || 'unknown_subscheme');

          const pdfFileName = `${student_name}.pdf`;
          const pdfPath = `public/${pdfDir}/${pdfDir1}/${pdfDir2}/${pdfDir3}/${pdfFileName}`;

          this.pdf_data = {
            pdfPath,
            dir: pdfDir,
            student_name,
            studentName: studentDetails.student_name || '',
            institutionName: studentDetails.institution_name || '',
            universityName: studentDetails.university_typename || '',
            schemeName: studentDetails.scheme_name || '',
            subschemeName: studentDetails.subscheme_name || '',
            scheme_id,
            stud_id: studentDetails.student_id,
            umis_id,
            subschemeid: studsub_Id,
          };

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
        error.responseJSON[0] &&
        error.responseJSON[0].success === 0 &&
        error.responseJSON[0].message
      ) {
        if (error.responseJSON[0].message.includes('Already OTP Sent')) {
          errorMessage = 'An OTP has already been sent. Please check your phone or wait before requesting a new one.';
          shouldShowOTPModal = true;
          
          // If we have mobile number in the error response, use it
          const mobileno = $('#apply_phone').text();
          $('.otp_mobile_number').text(mobileno);
        } else {
          errorMessage = error.responseJSON[0].message.split('\n')[0];
        }
      } else if (error.message && error.message.includes('Already OTP Sent')) {
        errorMessage = 'An OTP has already been sent. Please check your phone or wait before requesting a new one.';
        shouldShowOTPModal = true;
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
          const sanitizeDir = (dir) => {
            if (dir == null || typeof dir === 'undefined') return 'unknown';
            return String(dir).replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
          };

          const studentDetails = data.student_details || {};
          console.log(data);
          console.log('sanitizeDir inputs:', {
            student_name: studentDetails.student_name,
            accademic_year_id: studentDetails.accademic_year_id,
            institution_name: studentDetails.institution_name,
            scheme_name: studentDetails.scheme_name,
            sub_scheme_name: studentDetails.sub_scheme_name,
          });

          const student_name = sanitizeDir(studentDetails.student_name || 'unknown_student');
          const pdfDir = sanitizeDir(studentDetails.accademic_year_id || 'unknown_year');
          const pdfDir1 = sanitizeDir(studentDetails.institution_name || 'unknown_institution');
          const pdfDir2 = sanitizeDir(studentDetails.scheme_name || 'unknown_scheme');
          const pdfDir3 = sanitizeDir(studentDetails.sub_scheme_name || 'unknown_subscheme');

          const pdfFileName = `${student_name}.pdf`;
          const pdfPath = `public/${pdfDir}/${pdfDir1}/${pdfDir2}/${pdfDir3}/${pdfFileName}`;

          this.pdf_data = {
            pdfPath,
            dir: pdfDir,
            student_name,
            studentName: studentDetails.student_name || '',
            institutionName: studentDetails.institution_name || '',
            universityName: studentDetails.university_typename || '',
            schemeName: studentDetails.scheme_name || '',
            subschemeName: studentDetails.subscheme_name || '',
            scheme_id,
            stud_id: studentDetails.student_id,
            umis_id,
            subschemeid: studsub_Id,
          };
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
    const subssid = this.pdf_data?.subschemeid || '';
    const stud_id = this.pdf_data?.umis_id || '';
    const scheme_id = this.pdf_data?.scheme_id || '';
    const fields = {
      iid: subssid,
      iappliedby: localStorage.getItem('userId'), // Assuming student applies
    };

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
      $('#preloader1').show();
      const response = await $.ajax({
        url: config.ssp_api_url + '/student/otp_v2',
        type: 'POST',
        headers: { 'X-APP-KEY': 'te$t', 'X-APP-NAME': 'te$t' },
        data: {
          type: 'check',
          isubschemeid: subssid,
          ischemeid: scheme_id,
          istudentid: stud_id,
          iotp: otpValue,
          field: fields,
          pdf_data: this.pdf_data,
          scheme_name: schemeName,
          sspstud_id: this.pdf_data?.stud_id,
          reason: $('#notApplyReason').val() || null,
          descriptions: $('#notApplyDescription').val() || null,
          iinterval: 5,
          iappliedby: localStorage.getItem('userId'),

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
          $('#studentDetailsModal').modal('hide');
          fetchReportData();
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
      const errorMessage = error.responseJSON?.message || 'An unexpected error occurred';
      Swal.fire({
        title: errorMessage,
        icon: 'error',
        showConfirmButton: false,
        timer: 3000,
      }).then(() => {
        $('.otp-input').val('');
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
        const mobileno = response[0].data.mobileno || '9791XXXX20';
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
}

customElements.define('student-details-component', StudentDetailsComponent);