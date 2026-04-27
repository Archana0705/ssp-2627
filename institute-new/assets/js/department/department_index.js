// Initialize AOS (if used for animations)
AOS.init();

// Configuration variables (assumed to be defined in a config object)
var umis_fees_api_url = config.umis_fees_api_url;
var ssp_api_url = config.ssp_api_url;
var department_api_url = config.department_api_url;
var student_api_url = config.student_api_url;

// Global variables
var institute_id;
var userId = '';
var user_role_id = null;
var role_id = localStorage.getItem("roleId");
var queryString = window.location.search;
var queryParams = queryString.split('?details=');
var queryParamss = queryParams[1].split('&');
var urlKey = queryParamss[0];
let instituteId = '';
let is_submitted = false;
// Ajax global event handlers
$(document).on({
    ajaxStart: function () {
        $('#preloader').show();
        $("body").addClass("user_loading");
    },
    ajaxStop: function () {
        $('#preloader').hide();
        $("body").removeClass("user_loading");
    }
});

// Loader functions
function showLoader() {
    $('#preloader').show();
    $("body").addClass("user_loading");
}

function hideLoader() {
    $('#preloader').hide();
    $("body").removeClass("user_loading");
}

function showFilterLoader() {
    $('#filterLoader').show();
}

function hideFilterLoader() {
    $('#filterLoader').hide();
}

let filterMap = {
        stream_id: {
            selected_columns: ['stream_name', 'sspstreamid'],
            dependsOn: [
                'institution_ownership_id',
                'university_type',
                'university_id',
                'institution_id',
                'course_type_id',
                'course_category_id',
                'course_id',
                'course_branch_id',
                'studying_year'
            ],
            valueField: 'sspstreamid',
            labelField: 'stream_name'
      },
      course_type_id: {
        selected_columns: ['course_type', 'sspcoursetypeid'],
        dependsOn: [
            'institution_ownership_id',
            'university_type',
            'university_id',
            'institution_id',
            'stream_id',
            'course_category_id',
            'course_id',
            'course_branch_id',
            'studying_year'
        ],
        valueField: 'sspcoursetypeid',
        labelField: 'course_type'
      },
      course_category_id: {
        selected_columns: ['course_category_name', 'sspcoursecatgeoryid'],
        dependsOn: [
            'institution_ownership_id',
            'university_type',
            'university_id',
            'institution_id',
            'stream_id',
            'course_type_id',
            'course_id',
            'course_branch_id',
            'studying_year'
        ],
        valueField: 'sspcoursecatgeoryid',
        labelField: 'course_category_name'
      },
      course_id: {
        selected_columns: ['course_name', 'sspcourseid'],
        dependsOn: [
            'institution_ownership_id',
            'university_type',
            'university_id',
            'institution_id',
            'stream_id',
            'course_type_id',
            'course_category_id',
            'course_branch_id',
            'studying_year'
        ],
        valueField: 'sspcourseid',
        labelField: 'course_name'
      },
      course_branch_id: {
        selected_columns: ['course_branch_name', 'sspbranchid'],
        dependsOn: [
            'institution_ownership_id',
            'university_type',
            'university_id',
            'institution_id',
            'stream_id',
            'course_type_id',
            'course_category_id',
            'course_id',
            'studying_year'
        ],
        valueField: 'sspbranchid',
        labelField: 'course_branch_name'
      },
      studying_year: {
        selected_columns: ['courseyear', 'courseyear'],
        dependsOn: [
            'institution_ownership_id',
            'university_type',
            'university_id',
            'institution_id',
            'stream_id',
            'course_type_id',
            'course_category_id',
            'course_id',

        ],
        valueField: 'courseyear',
        labelField: 'courseyear'
      }

};

// Document ready
$(document).ready(function () {
    // Initialize Select2 for filter dropdowns
    $('.filter-select').select2({
        placeholder: 'Select...',
        allowClear: true,
        width: '100%'
    });

    // Fetch institute details
    $.ajax({
        type: 'POST',
        headers: { 'X-APP-KEY': 'te$t', 'X-APP-NAME': 'te$t' },
        url: ssp_api_url + '/get_institute_details',
        data: { instituteDetails: urlKey },
        dataType: 'json',
        success: function (response) {
            var data = response.data[0];
            var institution_id = response.data[1]['institution_id'];
            var decryptedData_details = response.decryptedData;
            var parse_institute_id = JSON.parse(decryptedData_details);

            institute_id = institution_id;
            instituteId = institution_id;
            user_role_id = parse_institute_id.user_role_id;
            userId = parse_institute_id.user_id;
            var user_role = parse_institute_id.user_role;

            // Populate UI with institute details
            $('#nav-university').text(user_role);
            $("#nav-institute").text(data.institution_name);
            $("#insti_id").val(institution_id);
            $("#user_id").val(userId);
            $("#UniversityType").val(data.university_type_name);
            $("#UniversityName").val(data.university_name);
            $("#InstituteType").val(data.institution_type_name);
            $("#InsituteCategory").val(data.institution_category_name);
            $("#InsituteOwnership").val(data.institution_ownership_name);
            $("#InstituteName").val(data.institution_name);
            $("#district_name").val(data.district_name);

            // Show/hide UI elements based on user role
            if (user_role_id == 4 || user_role_id == 8) {
                $("#add_fees_amount").show();
            }

            // Populate report submenus (if applicable)
            document.querySelector('custom-header-sidebar').populateReportSubmenus(userId);

            // Session timeout check
            const umisLoginedTime = parse_institute_id.generated_time;
            const initialTime = new Date(umisLoginedTime).getTime();
            const logoutAfterMillis = 120 * 60 * 1000; // 120 minutes
            const logoutTime = initialTime + logoutAfterMillis;

            function checkLogoutTime() {
                const currentTime = Date.now();
                if (currentTime > logoutTime) {
                    Swal.fire({
                        icon: "info",
                        title: 'Session expired. Please log in again.',
                        showConfirmButton: true,
                    }).then(function () {
                        window.location.href = "https://umis.tn.gov.in/";
                    });
                }
            }
            checkLogoutTime();

            // Initialize dropdowns
            initializeDropdowns(institution_id);
        },
        error: function (errorThrown) {
            console.error('Error fetching institute details:', errorThrown);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch institute details. Please try again.'
            });
        }
    });

    // Initialize dropdowns
    function initializeDropdowns(instituteId) {
        
        get_department();
        get_scholarship_schemename();
        getDashboardSummaryStatistics();
        totalStudentCounts();
    }

    

    $("#scheme_departmentid").on("change", function () {
        var departmentCode = $(this).val();
        get_scholarship_schemename();
    });

    // Fetch department data
    function get_department() {
        var deptInfo = {
            user_id: 53,
            department_id: 1,
        };
        $.ajax({
            url: ssp_api_url + "/get_scholarship_department",
            type: "POST",
            headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
            data: {
                data: encryptData(deptInfo)
            },
            beforeSend: function () {
                $("#scheme_departmentid").empty();
            },
            success: function (response) {
                var decrypt_data = decryptData(response.data);
                decrypt_data.forEach(function (department) {
                    $("#scheme_departmentid").append(
                        `<option value="${department.id}">${department.department_name}</option>`
                    );
                });
            },
            error: function () {
                console.error("Failed to load department data");
            },
        });
    }

    // Fetch scholarship scheme names
    function get_scholarship_schemename() {
        const department_id = $("#scheme_departmentid").val();
        const payload = {
            department_id: department_id
        };

        $.ajax({
            url: ssp_api_url + '/get_filter_schemes',
            type: 'POST',
            headers: {
                'X-APP-KEY': 'te$t',
                'X-APP-NAME': 'te$t'
            },
            data: {
                data: encryptData(payload)
            },
            dataType: 'json',
            success: function (response) {
                if(response.status !=0){
                
                    const decrypted = decryptData(response.data || '[]');
                    $("#scheme_id").empty().append('<option value="">Select Scheme</option>');
                    if (Array.isArray(decrypted) && decrypted.length > 0) {
                        decrypted.forEach(scheme => {
                            $("#scheme_id").append(
                                `<option value="${scheme.id}">${scheme.scheme_name}</option>`
                            );
                        });
                        $("#schemecount").html(decrypted.length || 0);
                    } else {
                        $("#scheme_id").append('<option value="">No schemes found</option>');
                    }
                }else{
                 $("#scheme_id").empty().append('<option value="">Select Scheme</option>');
                }
            },
            error: function () {
                $("#scheme_id").empty().append('<option value="">Failed to load</option>');
            }
        });
    }

    $('.filter-select').select2();
    $('.filter-select').on('change', function () {
        const changedId = $(this).attr('id');

        // Find all fields that depend on this changed field
        Object.keys(filterMap).forEach(targetId => {
            const targetConfig = filterMap[targetId];
            if (targetConfig.dependsOn && targetConfig.dependsOn.includes(changedId)) {
                $('#' + targetId).data('options-loaded', false); // Reset cache
            }
        });
    });


    $('.filter-select').select2();

    // 🔁 Reset dependent dropdowns when a parent changes
    $('.filter-select').on('change', function () {
        const changedId = $(this).attr('id');

        Object.keys(filterMap).forEach(targetId => {
            const targetConfig = filterMap[targetId];
            if (targetConfig.dependsOn && targetConfig.dependsOn.includes(changedId)) {
                const $target = $('#' + targetId);
                $target.data('options-loaded', false); // Force reload on next open
                // Optional: Clear child value if needed
                // $target.val(null).trigger('change');
            }
        });
    });


    $('.filter-select').on('select2:opening', function (e) {
        const $select = $(this);
        const selectId = $select.attr('id');
        const config = filterMap[selectId];
        if (!config) return;

        // ✅ If already loaded, allow normal opening
        if ($select.data('options-loaded')) return;

        // ❌ Prevent dropdown from opening until data is fetched
        e.preventDefault();

        const loader = $select.closest('.select-wrapper').find('.select-loader');
        loader.show();

        const filter_conditions = {};
        (config.dependsOn || []).forEach(parentId => {
            const parentConfig = filterMap[parentId];
            const valueField = parentConfig?.valueField || parentId;
            const val = $('#' + parentId).val();
            if (val && val.length > 0) {
                filter_conditions[valueField] = val;
            }

            filter_conditions['sspinstitutionid'] = instituteId;
        });

        const payload = {
            selected_columns: config.selected_columns,
            filter_conditions:filter_conditions,
            group_by_columns: [],
            sort_columns: {},
            count_columns: [],
            sum_columns: [],
            limit_rows: 0,
            offset_rows: 0
        };

        $.ajax({
            url: ssp_api_url + '/get_filters_dependent',
            type: 'POST',
            headers: {
                'X-APP-KEY': 'te$t',
                'X-APP-NAME': 'te$t'
            },
            data: {
                data: encryptData(payload)
            },
            dataType: 'json',
            success: function (response) {

                if (response.success == 1) {
                    const decrypted = decryptData(response.data || '[]');
                    const currentValue = $select.val();
                    $select.find('option').not(':selected').remove();

                    if (Array.isArray(decrypted) && decrypted.length > 0) {
                    decrypted.forEach(item => {
                            const label = item[config.labelField]?.toString().trim();
                            const value = item[config.valueField]?.toString().trim();

                            if (label && value && $select.find(`option[value="${value}"]`).length === 0) {
                                const $option = $('<option></option>').val(value).text(label);
                                $select.append($option);
                            }
                        });

                        // Restore selection if value still exists
                        if (currentValue && $select.find(`option[value="${currentValue}"]`).length > 0) {
                            $select.val(currentValue).trigger('change.select2');
                        }
                        setTimeout(() => {
                            $select.select2('open');
                        }, 0);
                    } else {
                        $select.empty().append('<option value="">No data</option>');
                    }
                } else {
                    $select.empty().append('<option value="">No data</option>');
                }
                $select.data('options-loaded', true);
            },

            error: function () {
                $select.empty().append('<option value="">Failed to load</option>');
            },
            complete: function () {
                loader.hide();
            }
        });
    });

    $('.filter-select').select2({
        placeholder: 'Select...',
        allowClear: true,
        width: '100%'
    });
});


$("#submitFilters").on("click", function () {
        getDashboardSummaryStatistics();
        let departmentId = $("#scheme_departmentid").val() || 0;
        if(departmentId.length == 0){
          $("#total_community_students").text('Total');
        }else{
          var departmentMapping = {
            "1": "ADTW",
            "2": "BCWD"
        };
        
        var departmentText = $("#scheme_departmentid").val();
        var departmentShortCode = departmentMapping[departmentText] || "All"; // Default to "All" if not found
        $("#total_community_students").text('Total (' + departmentShortCode+')');
        
        }

        totalStudentCounts();
        setTimeout(() => {
            $('#offcanvas_close').click();
        }, 2000);

      });
    function totalStudentCounts(){
      let departmentId = $("#scheme_departmentid").val() || 0;
      const filterData = {
          department_id: departmentId,
          instituteid:instituteId,
      };
      $.ajax({
          url: ssp_api_url + '/totalStudentCounts',
          headers: { 'X-APP-KEY': 'te$t', 'X-APP-NAME': 'te$t' },
          type: 'POST',
          data: { data: encryptData(filterData) },
          success: function (response) {
            if(response.success == 1){
              let totalDeptStudentCount = response.total_students;
              $("#studentcount").html(formatIndianNumber(totalDeptStudentCount) || 0);

            }
          },
          error: function (xhr, status, error) {
              
          }
      });
    }

      function getDashboardEligibleCount() {
        let userFilters = getAllFilterValues();
        var filterData = {
          typeid: 1,
        selected_columns: [
          'eligible_count', 
          'not_applied_count',
          'unique_student_count',
          'unique_notinterest_count',
          'notinterest_count',
        ],
        filter_conditions: {
          ...userFilters,
          "institution_id":institute_id,
        },
        group_by_columns: null,
        sort_columns: null,
        limit_rows: null,
        offset_rows: null,
        count_columns: null,
        sum_columns: null,
        distinct_count_columns: null,
        count_conditions: {
          "eligible_count": "is_eligible = true",
          "not_applied_count": "is_applied = false and is_eligible = true and scheme_id IS not NULL",
           "notinterest_count":"is_eligible = true and notinsterested_toapply = true and is_applied = false", 
        },
        sum_condition:{},
        distinct_count_conditions:{
          "unique_student_count": "is_eligible = 'true'",
          "unique_notinterest_count":"is_eligible = true and notinsterested_toapply = true and is_applied = false",
        }
      };
    //   console.log(filterData);
      $.ajax({
        url: ssp_api_url + '/student_dashboard_report',
        headers: { 'X-APP-KEY': 'te$t', 'X-APP-NAME': 'te$t' },
        type: 'POST',
        data: { data: encryptData(filterData) },
        success: function (response) {
          if (response.success == 1) {
            const decryptedData = decryptData(response.data);
            let results = decryptedData[0];
            let OverallStudentCount = response.overall_total_students;
            // overall counts
            
            $("#OverallStudentCount").html(formatIndianNumber(OverallStudentCount) || 0);
            let uniqueAndEligibile = formatIndianNumber(results.eligible_count || 0) + "<strong> / </strong><br>"+ formatIndianNumber(results.unique_student_count || 0) + " (U)";

            $("#eligiblestudentcount").html(uniqueAndEligibile || 0);

            let uniqueAndNotInterested = formatIndianNumber(results.notinterest_count || 0) + "<strong> / </strong><br>"+ formatIndianNumber(results.unique_notinterest_count || 0) + " (U)";
            $("#notinterestedstudentcount").html(uniqueAndNotInterested || 0);
            

            let appliedCounts = parseInt($("#applied_count_div").text().replace(/,/g, ''), 10) || 0;
            let eligibleCount = parseInt(results.eligible_count, 10) || 0;

            
            let uniqueAppliedCounts = parseInt($("#unique_applied_count_div").text().replace(/,/g, ''), 10) || 0;
            let uniqueEligibleCount = parseInt(results.unique_student_count, 10) || 0;

            let notAppliedCount = eligibleCount - results.notinterest_count -appliedCounts;
            let uniqueNotAppliedCount = uniqueEligibleCount - results.unique_notinterest_count -uniqueAppliedCounts;

            let notAppliedEligibleAndUniqueCount = formatIndianNumber(notAppliedCount || 0) +"<strong> / </strong><br>" + formatIndianNumber(uniqueNotAppliedCount || 0) + " (U)";
            $("#notappliedstudentcount").html(notAppliedEligibleAndUniqueCount || 0);

            
          } else {
            console.warn("Dashboard API returned success = 0");
          }
        },
        complete: function(){
          
        },
        error: function (xhr, status, error) {
          console.error("Error fetching dashboard stats:", error);
        }
      });
    }
function getDashboardSummaryStatistics() {
      let userFilters = getAllFilterValues();
      var filterData = {
        typeid: 3,
      selected_columns: [
        'applied_count','unique_applied_count','dse_approvedstatus','dse_rejectedstatus','dse_pendingstatus','institute_approved_count','institute_rejected_count','institute_pending_count',
        'district_approved_count','district_rejected_count','district_pending_count',
        'state_approved_count','state_rejected_count','state_pending_count',

        'applied_benificiaryregistration_totalcount','applied_benificiaryregistration_pending','applied_benificiaryregistration_failure','applied_benificiaryregistration_success',

        'benificiaryregistration_success',
        'benificiaryregistration_failure',
        'benificiaryregistration_pending',
        'benificiaryregistration_totalcount',

        'benificiaryregistration_yettoregister_stateapproved',
        'benificiaryregistration_yettoregister_applied',        

        'installment1_approved_count', 
        'installment1_approved_amount',
        'installment1_rejected_count',
        'installment1_rejected_amount',
        'installment1_pending_count',
        'installment1_pending_amount',
        'installment2_approved_count', 
        'installment2_approved_amount',
        'installment2_rejected_count',
        'installment2_rejected_amount',
        'installment2_pending_count',
        'installment2_pending_amount',
        'hold_installment1_count',
        'hold_installment1_amount',
        'total_installment1_count',
        'total_installment1_amount',
        'total_installment2_count',
        'total_nsp_submission_amount',
        'nsp_submission_rejection_count',
        'nsp_submission_rejection_amount',
        'applied_benificiaryregistration_yettoregister',
        
      ],
      filter_conditions: {
        "institution_id":institute_id,
        ...userFilters,
      },
      group_by_columns: null,
      sort_columns: null,
      limit_rows: null,
      offset_rows: null,
      count_columns: null,
      sum_columns: null,
      distinct_count_columns: null,
      count_conditions: {
        
          "applied_count": "is_applied = true AND is_eligible = true",
          "dse_approvedstatus":"dse_approvedstatus = 'true' AND installment1_status='Pending'",
          "dse_rejectedstatus":"dse_approvedstatus = 'false' AND installment1_status='Pending'",
          "dse_pendingstatus":"dse_approvedstatus IS NULL AND installment1_status='Pending' ",
          
          "institute_approved_count": "institute_approval_status = 'Approved'",
          "institute_rejected_count": "institute_approval_status = 'Rejected'",
          "institute_pending_count": "institute_approval_status = 'Pending' or institute_approval_status='Hold' ",
          "district_approved_count": "department_verification_status = 'Approved'",
          "district_rejected_count": "department_verification_status = 'Rejected'",
          "district_pending_count": "department_verification_status = 'Pending' or department_verification_status='Hold' ",
          "state_approved_count": "department_approval_status = 'Approved'",
          "state_rejected_count": "department_approval_status = 'Rejected'",
          "state_pending_count": "department_approval_status = 'Pending' or department_approval_status='Hold' ",
          
          "benificiaryregistration_success": "benificiaryregistration = 'Approved' AND department_approval_status = 'Approved'",
          "benificiaryregistration_failure": "benificiaryregistration = 'Rejected' AND department_approval_status = 'Approved'",
          "benificiaryregistration_pending": "benificiaryregistration = 'Inprogress' AND department_approval_status = 'Approved'",
          "benificiaryregistration_totalcount": "benificiaryregistration IS NOT NULL AND department_approval_status = 'Approved'",

          
          "applied_benificiaryregistration_success": "benificiaryregistration = 'Approved' AND is_applied = 'true'",
          "applied_benificiaryregistration_failure": "benificiaryregistration = 'Rejected' AND is_applied = 'true'",
          "applied_benificiaryregistration_pending": "benificiaryregistration = 'Inprogress' AND is_applied = 'true'",
          "applied_benificiaryregistration_totalcount": "benificiaryregistration IS NOT NULL AND is_applied = 'true'",
          "applied_benificiaryregistration_yettoregister": "benificiaryregistration IS NULL AND is_applied = 'true'",
          
          "benificiaryregistration_yettoregister_stateapproved":"benificiaryregistration IS NULL AND department_approval_status = 'Approved'",
          "benificiaryregistration_yettoregister_applied":"benificiaryregistration IS NULL AND is_applied = 'true'",
          "installment1_approved_count": "installment1_status='Approved'",
          "installment1_rejected_count": "installment1_status='Rejected'",
          "installment1_pending_count": "installment1_status='Pending'",
          "installment2_approved_count": "installment2_status='Approved'",
          "installment2_rejected_count": "installment2_status='Rejected'",
          "installment2_pending_count": "installment2_status='Pending'",
            "hold_installment1_count": "(installment1_status ='Approval Pending' OR installment1_status ='Hold' OR installment1_status ='Approval Approved') AND department_approval_status  ='Approved'",
            "total_installment1_count": "installment1_status <>'Approval Approved' AND installment1_status <>'Approval Pending' AND installment1_status <>'Hold'",
            "total_installment2_count": "nsp_submission_status in('Approved', 'Rejected', 'Pending' )",
          "nsp_submission_rejection_count" : "nsp_submission_status = 'Rejected'"
      },
      sum_condition:{
        "installment1_approved_amount": "installment1_status='Approved'",
        "installment1_rejected_amount": "installment1_status='Rejected'",
        "installment1_pending_amount": "installment1_status='Pending'",
        "installment2_approved_amount": "installment2_status='Approved'",
        "installment2_rejected_amount": "installment2_status='Rejected'",
        "installment2_pending_amount": "installment2_status='Pending'",
        "hold_installment1_amount": "(installment1_status ='Approval Pending' OR installment1_status ='Hold' OR installment1_status ='Approval Approved') AND department_approval_status  ='Approved'",
        "total_installment1_amount": "installment1_status <>'Approval Approved' AND installment1_status <>'Approval Pending' AND installment1_status <>'Hold'",
        "total_nsp_submission_amount": "nsp_submission_status in('Approved', 'Rejected', 'Pending' )",
        "nsp_submission_rejection_amount" : "nsp_submission_status = 'Rejected'"
      },
      distinct_count_conditions:{
        "unique_applied_count": "is_applied = true AND is_eligible = true",
      }
    };
    $.ajax({
      url: ssp_api_url + '/student_dashboard_report',
      headers: { 'X-APP-KEY': 'te$t', 'X-APP-NAME': 'te$t' },
      type: 'POST',
      data: { data: encryptData(filterData) },
      success: function (response) {
        if (response.success == 1) {
          const decryptedData = decryptData(response.data);
          let results = decryptedData[0];
          let OverallStudentCount = response.overall_total_students;
          // overall counts
          
          $("#OverallStudentCount").html(formatIndianNumber(OverallStudentCount) || 0);
          let uniqueAppliedCount = '<span id="applied_count_div">'+formatIndianNumber(results.applied_count || 0) + "</span><strong> / </strong><br>"+ '<span id="unique_applied_count_div">'+formatIndianNumber(results.unique_applied_count || 0) + "</span> (U)";
          $("#appliedstudentcount").html(uniqueAppliedCount || 0);

          // institute
          $("#instituteapprovedcount").html(formatIndianNumber(results.institute_approved_count) || 0);
          $("#instituterejectedcount").html(formatIndianNumber(results.institute_rejected_count) || 0);
          $("#institutependingcount").html(formatIndianNumber(results.institute_pending_count) || 0);

          // district
          $("#department_district_approvedcount").html(formatIndianNumber(results.district_approved_count) || 0);
          $("#department_district_rejectedcount").html(formatIndianNumber(results.district_rejected_count) || 0);
          $("#department_district_pendingcount").html(formatIndianNumber(results.district_pending_count) || 0);

          // state
          $("#department_stateapprovedcount").html(formatIndianNumber(results.state_approved_count) || 0);
          $("#department_staterejectedcount").html(formatIndianNumber(results.state_rejected_count) || 0);
          $("#department_state_pendingcount").html(formatIndianNumber(results.state_pending_count) || 0);

          // ✅ beneficiary registration
          
          $("#applied_pfms_approvedstudentcount").html(formatIndianNumber(results.applied_benificiaryregistration_success) || 0);
          $("#applied_pfms_rejectedstudentcount").html(formatIndianNumber(results.applied_benificiaryregistration_failure) || 0);
          $("#applied_pfms_pendingstudentcount").html(formatIndianNumber(results.applied_benificiaryregistration_pending) || 0);
          $("#applied_pfms_registeration_total").html(formatIndianNumber(results.applied_benificiaryregistration_totalcount) || 0);

          $("#pfms_approvedstudentcount").html(formatIndianNumber(results.benificiaryregistration_success) || 0);
          $("#pfms_rejectedstudentcount").html(formatIndianNumber(results.benificiaryregistration_failure) || 0);
          $("#pfms_pendingstudentcount").html(formatIndianNumber(results.benificiaryregistration_pending) || 0);
          $("#pfms_registeration_total").html(formatIndianNumber(results.benificiaryregistration_totalcount) || 0);
          


          $("#applied_benificiaryregistration_yettoregister").html(formatIndianNumber(results.applied_benificiaryregistration_yettoregister) || 0);
          $("#pfms_applied_yettoprocessstudentcount").html(formatIndianNumber(results.benificiaryregistration_yettoregister_stateapproved) || 0);


          //Installment: 1
          //Count
          $("#hold_installment1_count").html(formatIndianNumber(results.hold_installment1_count) || 0);
          $("#installment1_studentcount").html(formatIndianNumber(results.total_installment1_count) || 0);
          $("#installment1_success_studentcount").html(formatIndianNumber(results.installment1_approved_count) || 0);
          $("#installment1_rejected_studentcount").html(formatIndianNumber(results.installment1_rejected_count) || 0);
          $("#installment1_inprogress_studentcount").html(formatIndianNumber(results.installment1_pending_count) || 0);

          // Amount
          $("#hold_installment1_amount").html(formatIndianNumber(results.hold_installment1_amount) || 0);
          $("#installment1_payment").html(formatIndianNumber(results.total_installment1_amount) || 0);
          $("#installment1_successpayment").html(formatIndianNumber(results.installment1_approved_amount) || 0);
          $("#installment1_rejectedpayment").html(formatIndianNumber(results.installment1_rejected_amount) || 0);
          $("#installment1_inprogresspayment").html(formatIndianNumber(results.installment1_pending_amount) || 0);


          //Installment: 2
          // Count
          $("#installment2_studentcount").html(formatIndianNumber(results.total_installment2_count) || 0);
          $("#nsp_rejectedstudentcount").html(formatIndianNumber(results.nsp_submission_rejection_count) || 0);
          $("#installment2_success_studentcount").html(formatIndianNumber(results.installment2_approved_count) || 0);
          $("#installment2_rejected_studentcount").html(formatIndianNumber(results.installment2_rejected_count) || 0);
          $("#installment2_inprogress_studentcount").html(formatIndianNumber(results.installment2_pending_count) || 0);

          //Amount
          $("#installment2_payment").html(formatIndianNumber(results.total_nsp_submission_amount) || 0);
          $("#nsp_rejectedstudent_payment").html(formatIndianNumber(results.nsp_submission_rejection_amount) || 0);
          $("#installment2_successpayment").html(formatIndianNumber(results.installment2_approved_amount) || 0);
          $("#installment2_rejectedpayment").html(formatIndianNumber(results.installment2_rejected_amount) || 0);
          $("#installment2_inprogresspayment").html(formatIndianNumber(results.installment2_pending_amount) || 0);


          

            $("#dse_pendingstatus").html(formatIndianNumber(results.dse_pendingstatus) || 0);
            $("#dse_rejectedstatus").html(formatIndianNumber(results.dse_rejectedstatus) || 0);
            $("#dse_approvedstatus").html(formatIndianNumber(results.dse_approvedstatus) || 0);

          let OveralPaymentSuccess = results.installment1_approved_count + results.installment2_approved_count;
          $("#total_payment_success").html(formatIndianNumber(OveralPaymentSuccess) || 0);
          let OveralPaymentInprogress = results.installment1_pending_count + results.installment2_pending_count;
          $("#total_payment_inprogress").html(formatIndianNumber(OveralPaymentInprogress) || 0);
        } else {
          console.warn("Dashboard API returned success = 0");
        }
      },
      complete: function(){
        getDashboardEligibleCount();
      },
      error: function (xhr, status, error) {
        console.error("Error fetching dashboard stats:", error);
      }
    });
  }

  function formatIndianNumber(number) {
    return new Intl.NumberFormat('en-IN').format(number);
  }

  // -------------------- INSTITUTE --------------------
$('#intitutePendingCount').click(function() {
    getDashboardPopup("Pending", "institute_approval_status", "Institute Pending Approval Count");
});
$('#intituteApprovedCount').click(function() {
    getDashboardPopup("Approved", "institute_approval_status", "Institute Approved Count");
});
$('#rejectionCategories').click(function() {
    getDashboardPopup("Rejected", "institute_approval_status", "Institute Rejected Count");
});

// -------------------- DISTRICT --------------------
$('#departmentDistrictPendingcount').click(function() {
    getDashboardPopup("Pending", "department_verification_status", "District Pending Approval Count");
});
$('#departmentDistrictApprovedCount').click(function() {
    getDashboardPopup("Approved", "department_verification_status", "District Approved Count");
});
$('#districtRejectionCategories').click(function() {
    getDashboardPopup("Rejected", "department_verification_status", "District Rejected Count");
});

// -------------------- STATE --------------------
$('#departmentStatePendingcount').click(function() {
    getDashboardPopup("Pending", "department_approval_status", "State Pending Approval Count");
});
$('#departmentStateApprovedcount').click(function() {
    getDashboardPopup("Approved", "department_approval_status", "State Approved Count");
});
$('#stateRejectionCategories').click(function() {
    getDashboardPopup("Rejected", "department_approval_status", "State Rejected Count");
});

$('#dbtRejectionCategories').click(function() {
    getDBTDashboardPopup();
});

$('#dbtStateRejectionCategories').click(function() {
    getDBTStateDashboardPopup();
});

$('#submissionRejected').click(function() {
    getNSPDashboardPopup();
});
$('#installment1InprogressStudentCount').click(function() {
    $("#inprogressModal").modal('show');
  });
$("#installmentPaymentHold").click(function() {
        paymentSuccessList('hold');
    });
    $("#installmentPaymentSubmitToBank").click(function() {
        paymentSuccessList('submit');
  });
    $("#installmentPaymentSuccess").click(function() {
        paymentSuccessList('success');
    });

    $("#installment2PaymentPending").click(function() {
        nspPaymentSuccessList('pending');
    });
    $("#installment2PaymentSubmitToBank").click(function() {
        nspPaymentSuccessList('submit');
    });
    $("#installment2PaymentSuccess").click(function() {
        nspPaymentSuccessList('success');
    });
function getDashboardPopup(statusMsg, statusField, titleLabel) {
    let userFilters = getAllFilterValues();

    // ---------------------- CASE 1: REJECTED ----------------------
    if (statusMsg === "Rejected") {
        let filterData = {
            typeid: 3,
            selected_columns: [],
        filter_conditions: {
            ...userFilters,
            [statusField]: statusMsg,
            "institution_id":institute_id,
            },
            group_by_columns: [],
            sort_columns: {},
            limit_rows: 200,
            offset_rows: 0,
            count_columns: ["umis_no"],
            sum_columns: [],
            distinct_count_columns: null,
            count_conditions: null,
            sum_condition: null,
            distinct_count_conditions: null,
        };
        let rejectedReasons = '';
        let approvalRemarks = '';
        // Case 1: Institute Approval
        if (statusField === "institute_approval_status") {
            filterData.selected_columns = [
                "institute_approval_reason",
                "actionresponsibility",
                "action_needtotake",
                "umis_no"
            ];
            filterData.group_by_columns = [
                "institute_approval_reason",
                "actionresponsibility",
                "action_needtotake"
            ];
            filterData.count_columns = [
                "umis_no",
            ];
            
        rejectedReasons = 'institute_approval_reason';
        approvalRemarks = 'institute_approval_remarks';
        // Case 2: Department Verification
        } else if (statusField === "department_verification_status") {
            filterData.selected_columns = ["department_verification_reason","umis_no"];
            filterData.group_by_columns = ["department_verification_reason"];
            filterData.count_columns = [
                "umis_no",
            ];

            rejectedReasons = 'department_verification_reason';
            approvalRemarks = 'department_verification_remarks';
        // Case 3: Department Approval
        } else if (statusField === "department_approval_status") {
            filterData.selected_columns = ["department_approval_reason","umis_no"];
            filterData.group_by_columns = ["department_approval_reason"];
            filterData.count_columns = [
                "umis_no",
            ];
            rejectedReasons = 'department_approval_reason';
            approvalRemarks = 'department_approval_remarks';
        }

        // 👉 Use rejectionCategoryList table for rejected reasons
        let modalBody = $('#rejectionCategoryList');
        modalBody.empty();
        let totalCount = 0;
        $.ajax({
            url: ssp_api_url + '/student_dashboard_popup_report',
            headers: { 'X-APP-KEY': 'te$t', 'X-APP-NAME': 'te$t' },
            type: 'POST',
            data: { data: encryptData(filterData) },
            success: function (response) {
                if (response.success == 1) {
                    const rejectionData = decryptData(response.data);
                    modalBody.empty();

                    if (!rejectionData || rejectionData.length === 0) {
                        modalBody.append('<tr><td colspan="2" class="text-center">No rejected reasons available</td></tr>');
                    } else {
                        if (statusField === 'institute_approval_status') {
                            // ✅ Group by Action By
                            let grouped = {};
                            rejectionData.forEach(item => {
                                const actionBy = item.actionresponsibility || "Action By: ";
                                if (!grouped[actionBy]) grouped[actionBy] = [];
                                grouped[actionBy].push({
                                    reason: item.institute_approval_reason || "-",
                                    count: item.umis_no || 0,
                                    action_needtotake: item.action_needtotake || "-"
                                });
                                totalCount += (item.umis_no || 0);
                            });

                            // ✅ Render grouped rows
                            Object.keys(grouped).forEach(actionBy => {
                                modalBody.append(`
                                    <tr class="table-dark">
                                        <td colspan="2"><strong>${actionBy}</strong></td>
                                    </tr>
                                `);

                                grouped[actionBy].forEach((r, idx) => {
                                    // Generate unique id for tooltip/icon
                                    const iconId = `infoIcon_${actionBy.replace(/\s+/g, '_')}_${idx}`;

                                    const infoIcon = (r.action_needtotake && r.action_needtotake !== '-')
                                        ? `<i id="${iconId}" 
                                                class="bi bi-info-circle text-primary ms-2" 
                                                style="cursor:pointer;"
                                                title="${r.action_needtotake}" 
                                                data-message="${r.action_needtotake}">
                                        </i>`
                                        : "";

                                    modalBody.append(`
                                        <tr>
                                            <td>${r.reason} ${infoIcon}</td>
                                            <td class="text-end">${r.count}</td>
                                        </tr>
                                    `);
                                });
                            });
                        } else {
                            // Department / Verification / Approval → flat list
                            totalCount= 0;
                            rejectionData.forEach(item => {
                                const reason = 
                                            item.department_verification_reason || 
                                            item.department_approval_reason || "-";
                                const count = item.umis_no || 0;

                                if (reason !== "-" && reason !== null) {
                                    modalBody.append(`
                                        <tr>
                                            <td>${reason}</td>
                                            <td class="text-end">${count}</td>
                                        </tr>
                                    `);
                                    totalCount += count;
                                }
                            });
                        }
                    }

                    // Build payload for "more details"
                    const payload = {
                        typeid: 3,
                        selected_columns: [
                            'subdepartment_name',
                            'ownership',
                            'university_typename',
                            'university_name',
                            'institution_categoryname',
                            'institution_name',
                            'umis_no',
                            'student_name',
                            'aadhaar_no',
                            'gender',
                            'religion',
                            'community',
                            'quota',
                            'isdifferentlyabled',
                            'disabilityname',
                            'is_hosteler',
                            'hostel_type',
                            'is_first_graduate',
                            'income',
                            'studying_year',
                            'course_duration',
                            'stream_name',
                            'course_type',
                            'course_category_name',
                            'course_name',
                            'course_branch_name',
                            'is_accredited',
                            'scheme_name',
                            'scheme_amount',
                            'maintenanceamount',
                            'disabilityamout',
                            'scholarshipamount',
                            'application_id',
                            'is_eligible',
                            'is_applied',
                            'applied_ts',
                            'aadhaar_verified',
                            'community_certificate_verified',
                            'income_certificate_verified',
                            statusField,
                            rejectedReasons,
                            approvalRemarks,
                        ],
                        filter_conditions: {
                            ...userFilters,
                            [statusField]: statusMsg,
                            "institution_id":institute_id,
                        },
                        group_by_columns: [],
                        sort_columns: {},
                        count_columns: ["umis_no"],
                        sum_columns: [],
                        limit_rows: 200,
                        offset_rows: 0
                    };

                    const detailsParam = btoa(JSON.stringify(payload));

                    // Footer
                    const footerContent = `
                        <div class="d-flex justify-content-between align-items-center w-100">
                            <span style="font-size:14px;"><strong>Total Count:</strong> <span id=totalcount>${totalCount}</span> </span>
                            <a href="https://ssp25-26.tnega.org/institute/generic_report.html?details=${urlKey}&keys=${detailsParam}" target="_blank" class="btn btn-link">(Click here for more details)</a>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    `;
                    $('#rejectionModal .modal-footer').empty().html(footerContent);

                } else {
                    modalBody.empty()
                        .append(`<tr><td colspan="2" class="text-center">No data available</td></tr>`);
                        const footerContent = `
                        <div class="d-flex justify-content-between align-items-center w-100">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    `;
                        $("#totalcount").text(0);
                        $('#rejectionModal .modal-footer').empty().html(footerContent);

                }

                // Show rejection modal
                $('#rejectionModal').modal('show');
                $('#rejectionModalLabel').text(titleLabel + ' - ' + statusMsg);
            },
            error: function (xhr, status, error) {
                console.error("Error fetching rejection data:", error);
                modalBody.empty()
                    .append(`<tr><td colspan="2" class="text-center text-danger">Failed to fetch data</td></tr>`);
            }
        });


    }

    // ---------------------- CASE 2: ALL OTHER STATUSES ----------------------
    else {
        let filterData = {
            typeid: 3,
            selected_columns: ['scheme_name', 'umis_no', 'scheme_id'],
            filter_conditions: {
                ...userFilters,
                [statusField]: statusMsg,
                "institution_id":institute_id,
            },
            group_by_columns: ['scheme_name', 'scheme_id', statusField],
        sort_columns: null,
        limit_rows: null,
        offset_rows: null,
        count_columns: ['umis_no'],
        sum_columns: null,
        distinct_count_columns: null,
        count_conditions: null,
        sum_condition: null,
        distinct_count_conditions:null
    };

    let ApprovalStatus = '';
    if(statusField == 'institute_approval_status'){
        ApprovalStatus = 'institute_approval_status';
    }else if(statusField == 'department_verification_status'){
        ApprovalStatus = 'department_verification_status';
    }
    else if(statusField == 'department_approval_status'){
        ApprovalStatus = 'department_approval_status';
    }
    const tableBody = $('#departmentStateApprovalCountTable');
    tableBody.empty();
    $.ajax({
        url: ssp_api_url + '/student_dashboard_popup_report',
        headers: { 'X-APP-KEY': 'te$t', 'X-APP-NAME': 'te$t' },
        type: 'POST',
        data: { data: encryptData(filterData) },
        success: function (response) {
            if (response.success == 1) {
                try {
                    const decryptedData = decryptData(response.data);
                    const parsedData = Array.isArray(decryptedData) ? decryptedData :
                                       (typeof decryptedData === "string" ? JSON.parse(decryptedData) : []);

                    if (!Array.isArray(parsedData) || parsedData.length === 0) {
                        tableBody.append(`<tr><td colspan="4" class="text-center">No records found</td></tr>`);
                        return;
                    }

                    parsedData.forEach((item, index) => {
                        // Build payload for this row
                        const payload = {
                                typeid: 3,
                            selected_columns: [
                                    'subdepartment_name',
                                    'ownership',
                                    'university_typename',
                                    'university_name',
                                    'institution_categoryname',
                                    'institution_name',
                                    'umis_no',
                                    'student_name',
                                    'aadhaar_no',
                                    'gender',
                                    'religion',
                                    'community',
                                    'quota',
                                    'isdifferentlyabled',
                                    'disabilityname',
                                    'is_hosteler',
                                    'hostel_type',
                                    'is_first_graduate',
                                    'income',
                                    'studying_year',
                                    'course_duration',
                                    'stream_name',
                                    'course_type',
                                    'course_category_name',
                                    'course_name',
                                    'course_branch_name',
                                    'is_accredited',
                                    'scheme_name',
                                    'scheme_amount',
                                    'maintenanceamount',
                                    'disabilityamout',
                                    'scholarshipamount',
                                    'application_id',
                                    'is_eligible',
                                    'is_applied',
                                    'applied_ts',
                                    'aadhaar_verified',
                                    'community_certificate_verified',
                                    'income_certificate_verified',
                                    ApprovalStatus
                            ],
                            filter_conditions: {
                                [statusField]: statusMsg,
                                ['scheme_id']: item.scheme_id,
                                ['institution_id']:institute_id,
                            },    
                            group_by_columns: [],
                            sort_columns: {},
                            count_columns: ["umis_no"],
                            sum_columns: [],
                            limit_rows: 200,
                            offset_rows: 0
                        };

                        const detailsParam = btoa(JSON.stringify(payload));

                        tableBody.append(`
                            <tr>
                                <td>${index + 1}</td>
                                <td>${item.scheme_name || '-'}</td>
                                <td>${item.umis_no || 0}</td>
                                <td style="font-size:20px;">
                                    <a href="https://ssp25-26.tnega.org/institute/generic_report.html?details=${urlKey}&keys=${detailsParam}" 
                                    title="View & Download">
                                    <i class="bi bi-eye"></i>
                                    </a>
                                </td>
                            </tr>
                        `);
                    });
                } catch (err) {
                    console.error("Error handling decrypted data:", err);
                    $('#departmentStateApprovalCountTable').empty()
                        .append(`<tr><td colspan="4" class="text-center text-danger">Error loading data</td></tr>`);
                }
            } else {
                $('#departmentStateApprovalCountTable').empty()
                    .append(`<tr><td colspan="4" class="text-center">No data available</td></tr>`);
            }
        },
        error: function (xhr, status, error) {
            console.error("Error fetching dashboard stats:", error);
            $('#departmentStateApprovalCountTable').empty()
                .append(`<tr><td colspan="4" class="text-center text-danger">Failed to fetch data</td></tr>`);
        }
    });
    $("#dept_user").text(titleLabel);
    $("#departmentApprovalStatus").text(statusMsg + ' Count');
    $('#departmentStateApprovalModal').modal('show');
    }
}

function getDBTStateDashboardPopup() {
    let userFilters = getAllFilterValues();

    var filterData = {
        typeid: 3,
        selected_columns: ['umis_no', 'failurereason'],
        filter_conditions: {
            ...userFilters,
            'benificiaryregistration':['Rejected'],
            'department_approval_status':['Approved'],
            "institution_id":institute_id,
            
        },
        group_by_columns: ['failurereason'],
        sort_columns: null,
        limit_rows: null,
        offset_rows: null,
        count_columns: ['umis_no'],
        sum_columns: null,
        distinct_count_columns: null,
        count_conditions: null,
        sum_condition: null,
        distinct_count_conditions:null
    };
    const modalBody = $('#rejectionCategoryList');

    $.ajax({
        url: ssp_api_url + '/student_dashboard_popup_report',
        headers: { 'X-APP-KEY': 'te$t', 'X-APP-NAME': 'te$t' },
        type: 'POST',
        data: { data: encryptData(filterData) },
        success: function (response) {
            if (response.success == 1) {
                const rejectionData = decryptData(response.data);

                modalBody.empty();

                let totalCount = 0;

                if (!rejectionData || rejectionData.length === 0) {
                    modalBody.append('<tr><td colspan="2" class="text-center">No rejected reasons available</td></tr>');
                } else {
                    // API already returns grouped reasons with counts
                    rejectionData.forEach(item => {
                        const reason = item.failurereason ? item.failurereason.trim() : "-";
                        const count = item.umis_no || 0; // umis_no contains the grouped count

                        if (reason !== "-" && reason !== null) {
                            modalBody.append(`
                                <tr>
                                    <td>${reason}</td>
                                    <td class="text-end">${count}</td>
                                </tr>
                            `);
                            totalCount += count;
                        }
                    });

                    if (totalCount === 0) {
                        modalBody.append('<tr><td colspan="2" class="text-center">No rejected reasons available</td></tr>');
                    }
                }

                const payload = {
                            typeid: 3,
                            selected_columns: [
                                'subdepartment_name',
                                'ownership',
                                'university_typename',
                                'university_name',
                                'institution_categoryname',
                                'institution_name',
                                'umis_no',
                                'student_name',
                                'aadhaar_no',
                                'gender',
                                'religion',
                                'community',
                                'quota',
                                'isdifferentlyabled',
                                'disabilityname',
                                'is_hosteler',
                                'hostel_type',
                                'is_first_graduate',
                                'income',
                                'studying_year',
                                'course_duration',
                                'stream_name',
                                'course_type',
                                'course_category_name',
                                'course_name',
                                'course_branch_name',
                                'is_accredited',
                                'scheme_name',
                                'scheme_amount',
                                'maintenanceamount',
                                'disabilityamout',
                                'scholarshipamount',
                                'application_id',
                                'is_eligible',
                                'is_applied',
                                'applied_ts',
                                'aadhaar_verified',
                                'community_certificate_verified',
                                'income_certificate_verified',
                                'benificiaryregistration',
                                'failurereason'
                            ],
                            filter_conditions: {
                                ...userFilters,
                                'benificiaryregistration':['Rejected'],
                                'department_approval_status':['Approved'],
                                "institution_id":institute_id,
                            },    
                            group_by_columns: [],
                            sort_columns: {},
                            count_columns: ["umis_no"],
                            sum_columns: [],
                            limit_rows: 200,
                            offset_rows: 0
                        };

                        // Encode payload as query param
                        const detailsParam = btoa(JSON.stringify(payload));

                // Footer always
                const footerContent = `
                    <div class="d-flex justify-content-between align-items-center w-100">
                        <span style="font-size:14px;"><strong>Total Count:</strong> ${totalCount}</span>
                        <a href="https://ssp25-26.tnega.org/institute/generic_report.html?details=${urlKey}&keys=${detailsParam}" target="_blank" class="btn btn-link">(Click here for more details)</a>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                `;
                $('#rejectionModal .modal-footer').empty().html(footerContent);
                

                    } else {
                modalBody.empty()
                    .append(`<tr><td colspan="4" class="text-center">No data available</td></tr>`);
            }
            $('#rejectionModal').modal('show');
            $('#rejectionModalLabel').text('DBT Rejected Student Reasons');
        },
        error: function (xhr, status, error) {
            console.error("Error fetching dashboard stats:", error);
            modalBody.empty()
                .append(`<tr><td colspan="4" class="text-center text-danger">Failed to fetch data</td></tr>`);
        }
    });
}

function getDBTDashboardPopup() {
    let userFilters = getAllFilterValues();

    var filterData = {
        typeid: 3,
        selected_columns: ['umis_no', 'failurereason'],
        filter_conditions: {
            ...userFilters,
            "institution_id":institute_id,
            'benificiaryregistration':['Rejected']
        },
        group_by_columns: ['failurereason'],
        sort_columns: null,
        limit_rows: null,
        offset_rows: null,
        count_columns: ['umis_no'],
        sum_columns: null,
        distinct_count_columns: null,
        count_conditions: null,
        sum_condition: null,
        distinct_count_conditions:null
    };
    const modalBody = $('#rejectionCategoryList');

    $.ajax({
        url: ssp_api_url + '/student_dashboard_popup_report',
        headers: { 'X-APP-KEY': 'te$t', 'X-APP-NAME': 'te$t' },
        type: 'POST',
        data: { data: encryptData(filterData) },
        success: function (response) {
            if (response.success == 1) {
                const rejectionData = decryptData(response.data);

                modalBody.empty();

                let totalCount = 0;

                if (!rejectionData || rejectionData.length === 0) {
                    modalBody.append('<tr><td colspan="2" class="text-center">No rejected reasons available</td></tr>');
                } else {
                    // API already returns grouped reasons with counts
                    rejectionData.forEach(item => {
                        const reason = item.failurereason ? item.failurereason.trim() : "-";
                        const count = item.umis_no || 0; // umis_no contains the grouped count

                        if (reason !== "-" && reason !== null) {
                            modalBody.append(`
                                <tr>
                                    <td>${reason}</td>
                                    <td class="text-end">${count}</td>
                                </tr>
                            `);
                            totalCount += count;
                        }
                    });

                    if (totalCount === 0) {
                        modalBody.append('<tr><td colspan="2" class="text-center">No rejected reasons available</td></tr>');
                    }
                }

                const payload = {
                            typeid: 3,
                            selected_columns: [
                                'subdepartment_name',
                                'ownership',
                                'university_typename',
                                'university_name',
                                'institution_categoryname',
                                'institution_name',
                                'umis_no',
                                'student_name',
                                'aadhaar_no',
                                'gender',
                                'religion',
                                'community',
                                'quota',
                                'isdifferentlyabled',
                                'disabilityname',
                                'is_hosteler',
                                'hostel_type',
                                'is_first_graduate',
                                'income',
                                'studying_year',
                                'course_duration',
                                'stream_name',
                                'course_type',
                                'course_category_name',
                                'course_name',
                                'course_branch_name',
                                'is_accredited',
                                'scheme_name',
                                'scheme_amount',
                                'maintenanceamount',
                                'disabilityamout',
                                'scholarshipamount',
                                'application_id',
                                'is_eligible',
                                'is_applied',
                                'applied_ts',
                                'aadhaar_verified',
                                'community_certificate_verified',
                                'income_certificate_verified',
                                'benificiaryregistration',
                                'failurereason'
                            ],
                            filter_conditions: {
                                ...userFilters,
                               'benificiaryregistration':['Rejected'],
                               "institution_id":institute_id,
                            },    
                            group_by_columns: [],
                            sort_columns: {},
                            count_columns: ["umis_no"],
                            sum_columns: [],
                            limit_rows: 200,
                            offset_rows: 0
                        };

                        // Encode payload as query param
                        const detailsParam = btoa(JSON.stringify(payload));

                // Footer always
                const footerContent = `
                    <div class="d-flex justify-content-between align-items-center w-100">
                        <span style="font-size:14px;"><strong>Total Count:</strong> ${totalCount}</span>
                        <a href="https://ssp25-26.tnega.org/institute/generic_report.html?details=${urlKey}&keys=${detailsParam}" target="_blank" class="btn btn-link">(Click here for more details)</a>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                `;
                $('#rejectionModal .modal-footer').empty().html(footerContent);
                

            } else {
                modalBody.empty()
                    .append(`<tr><td colspan="4" class="text-center">No data available</td></tr>`);
            }
                $('#rejectionModal').modal('show');
            $('#rejectionModalLabel').text('DBT Rejected Student Reasons');
        },
        error: function (xhr, status, error) {
            console.error("Error fetching dashboard stats:", error);
            modalBody.empty()
                .append(`<tr><td colspan="4" class="text-center text-danger">Failed to fetch data</td></tr>`);
        }
    });
}
function getNSPDashboardPopup() {
    let userFilters = getAllFilterValues();

    var filterData = {
        typeid: 3,
        selected_columns: ['umis_no', 'nsp_remarks'],
        filter_conditions: {
            ...userFilters,
            'nsp_submission_status':['Rejected'],
            "institution_id":institute_id,
        },
        group_by_columns: ['nsp_remarks'],
        sort_columns: null,
        limit_rows: null,
        offset_rows: null,
        count_columns: ['umis_no'],
        sum_columns: null,
        distinct_count_columns: null,
        count_conditions: null,
        sum_condition: null,
        distinct_count_conditions:null
    };
    const modalBody = $('#rejectionCategoryList');
    modalBody.empty();
    $.ajax({
        url: ssp_api_url + '/student_dashboard_popup_report',
        headers: { 'X-APP-KEY': 'te$t', 'X-APP-NAME': 'te$t' },
        type: 'POST',
        data: { data: encryptData(filterData) },
        success: function (response) {
            if (response.success == 1) {
                const rejectionData = decryptData(response.data);

                
                

                let totalCount = 0;

                if (!rejectionData || rejectionData.length === 0) {
                    modalBody.append('<tr><td colspan="2" class="text-center">No rejected reasons available</td></tr>');
                } else {
                    // API already returns grouped reasons with counts
                    rejectionData.forEach(item => {
                        const reason = item.nsp_remarks ? item.nsp_remarks.trim() : "-";
                        const count = item.umis_no || 0; // umis_no contains the grouped count

                        if (reason !== "-" && reason !== null) {
                            modalBody.append(`
                                <tr>
                                    <td>${reason}</td>
                                    <td class="text-end">${count}</td>
                                </tr>
                            `);
                            totalCount += count;
                        }
                    });

                    if (totalCount === 0) {
                        modalBody.append('<tr><td colspan="2" class="text-center">No rejected reasons available</td></tr>');
                    }
                }

                const payload = {
                            typeid: 3,
                            selected_columns: [
                                'subdepartment_name',
                                'ownership',
                                'university_typename',
                                'university_name',
                                'institution_categoryname',
                                'institution_name',
                                'umis_no',
                                'student_name',
                                'aadhaar_no',
                                'gender',
                                'religion',
                                'community',
                                'quota',
                                'isdifferentlyabled',
                                'disabilityname',
                                'is_hosteler',
                                'hostel_type',
                                'is_first_graduate',
                                'income',
                                'studying_year',
                                'course_duration',
                                'stream_name',
                                'course_type',
                                'course_category_name',
                                'course_name',
                                'course_branch_name',
                                'is_accredited',
                                'scheme_name',
                                'scheme_amount',
                                'maintenanceamount',
                                'disabilityamout',
                                'scholarshipamount',
                                'application_id',
                                'is_eligible',
                                'is_applied',
                                'applied_ts',
                                'aadhaar_verified',
                                'community_certificate_verified',
                                'income_certificate_verified',
                                "installment1_status",
                                "installment1_amount",
                                "installment1_remarks",
                                "nsp_submission_status",
                                "nsp_remarks",
                                "installment2_status",
                                "nsp_remarks"
                            ],
                            filter_conditions: {
                                ...userFilters,
                               'nsp_submission_status':['Rejected'],
                               "institution_id":institute_id,
                            },    
                            group_by_columns: [],
                            sort_columns: {},
                            count_columns: ["umis_no"],
                            sum_columns: [],
                            limit_rows: 200,
                            offset_rows: 0
                        };

                        // Encode payload as query param
                        const detailsParam = btoa(JSON.stringify(payload));

                // Footer always
                const footerContent = `
                    <div class="d-flex justify-content-between align-items-center w-100">
                        <span style="font-size:14px;"><strong>Total Count:</strong> ${totalCount}</span>
                        <a href="https://ssp25-26.tnega.org/institute/generic_report.html?details=${urlKey}&keys=${detailsParam}" target="_blank" class="btn btn-link">(Click here for more details)</a>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                `;
                $('#rejectionModal .modal-footer').empty().html(footerContent);
                

                // 🔑 Always show modal
                

            } else {
                modalBody.empty()
                        .append(`<tr><td colspan="2" class="text-center">No data available</td></tr>`);
                        const footerContent = `
                        <div class="d-flex justify-content-between align-items-center w-100">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    `;
                        $("#totalcount").text(0);
                        $('#rejectionModal .modal-footer').empty().html(footerContent);
            }
            $('#rejectionModal').modal('show');
            $('#rejectionModalLabel').text('NSP Rejected Reasons');
        },
        error: function (xhr, status, error) {
            console.error("Error fetching dashboard stats:", error);
            $('#departmentStateApprovalCountTable').empty()
                .append(`<tr><td colspan="4" class="text-center text-danger">Failed to fetch data</td></tr>`);
        }
    });
}

// ✅ attach click handlers with unique IDs
$('#installmentOneFailureReason').click(function() {
    fetchPaymentRejectionData("Rejected", "installment1_remarks", "installment1_status", 1);
});
$('#installmentTwoFailureReason').click(function() {
    fetchPaymentRejectionData("Rejected", "installment2_remarks", "installment2_status", 2);
});
$('#installmentThreeFailureReason').click(function() {
    fetchPaymentRejectionData("Rejected", "installment3_remarks", "installment3_status", 3);
});

function fetchPaymentRejectionData(statusMsg, remarksField, statusField, installment) {
    let userFilters = getAllFilterValues();

    // Prepare filterData dynamically
    var filterData = {
        typeid: 3,
        selected_columns: [remarksField, 'umis_no'],
        filter_conditions: {
            ...userFilters,
            [statusField]: statusMsg,
            "institution_id":institute_id,   // ✅ dynamic key & value
        },
        group_by_columns: [remarksField], // ✅ dynamic grouping
        sort_columns: null,
        limit_rows: null,
        offset_rows: null,
        count_columns: ['umis_no'],
        sum_columns: null,
        distinct_count_columns: null,
        count_conditions: null,
        sum_condition: null,
        distinct_count_conditions:null
    };
    const modalBody = $('#rejectionCategoryList');
    modalBody.empty();
    $.ajax({
        type: "POST",
        url: ssp_api_url + "/student_dashboard_popup_report",
        headers: {
            'X-APP-KEY': 'te$t',
            'X-APP-NAME': 'te$t'
        },
        data: { data: encryptData(filterData)},
        success: function (response) {
            if(response.success ==1){

            // ✅ handle API "no data" response
            if (!response || response.success === 0 || !response.data || response.data.length === 0) {
                modalBody.append('<tr><td colspan="2" class="text-center">No data available</td></tr>');

                $('#rejectionModal .modal-footer').empty().html(`
                    <div class="d-flex justify-content-end w-100">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                `);

                const titles = {
                    1: 'Payment Process Installment 1 Rejected Reasons',
                    2: 'Payment Process Installment 2 Rejected Reasons',
                    3: 'Payment Process Installment 3 Rejected Reasons'
                };
                $('#rejectionModalLabel').text(titles[installment] || 'Rejected Reasons');
                $('#rejectionModal').modal('show');
                return; // stop further execution
            }

            // decrypt & process rows if data exists
            let results = decryptData(response.data);
            const rows = Array.isArray(results) ? results : [];

            // collect categorized reasons with umis_no counts
            const categorizedReasons = {};
                    let totalCount = 0;

            rows.forEach(row => {
                let reason = row[remarksField];
                const count = parseInt(row["umis_no"], 10) || 0;

                if (reason && typeof reason === 'string') {
                    reason = reason.trim();
                    if (reason.length > 0) {
                        categorizedReasons[reason] = (categorizedReasons[reason] || 0) + count;
                        totalCount += count;
                    }
                }
            });


            if (Object.keys(categorizedReasons).length === 0) {
                            modalBody.append('<tr><td colspan="2" class="text-center">No rejected reasons available</td></tr>');
                        } else {
                // sort by highest count first
                Object.entries(categorizedReasons)
                    .sort((a, b) => b[1] - a[1])
                    .forEach(([reason, count]) => {
                                modalBody.append(`
                                    <tr>
                                        <td>${reason}</td>
                                        <td class="text-end">${count}</td>
                                    </tr>
                                `);
                    });
            }

            const payload = {
                typeid: 3,
                selected_columns: [
                    'subdepartment_name',
                    'ownership',
                    'university_typename',
                    'university_name',
                    'institution_categoryname',
                    'institution_name',
                    'umis_no',
                    'student_name',
                    'aadhaar_no',
                    'gender',
                    'religion',
                    'community',
                    'quota',
                    'isdifferentlyabled',
                    'disabilityname',
                    'is_hosteler',
                    'hostel_type',
                    'is_first_graduate',
                    'income',
                    'studying_year',
                    'course_duration',
                    'stream_name',
                    'course_type',
                    'course_category_name',
                    'course_name',
                    'course_branch_name',
                    'is_accredited',
                    'scheme_name',
                    'scheme_amount',
                    'maintenanceamount',
                    'disabilityamout',
                    'scholarshipamount',
                    'application_id',
                    'is_eligible',
                    'is_applied',
                    'applied_ts',
                    'aadhaar_verified',
                    'community_certificate_verified',
                    'income_certificate_verified',
                    statusField,
                    remarksField,
                ],
                filter_conditions: {
                    ...userFilters,
                    [statusField]: statusMsg,
                    "institution_id":institute_id,
                },    
                group_by_columns: [],
                sort_columns: {},
                count_columns: ["umis_no"],
                sum_columns: [],
                limit_rows: 200,
                offset_rows: 0
            };

            // Encode payload as query param
            const detailsParam = btoa(JSON.stringify(payload));
                    const footerContent = `
                        <div class="d-flex justify-content-between align-items-center w-100">
                            <span style="font-size:14px;"><strong>Total Count:</strong> ${totalCount}</span>
                    <a href="https://ssp25-26.tnega.org/institute/generic_report.html?details=${urlKey}&keys=${detailsParam}" target="_blank" class="btn btn-link">(Click here for more details)</a>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    `;
            $('#rejectionModal .modal-footer').empty().html(footerContent);

            const titles = {
                1: 'Payment Process Installment 1 Rejected Reasons',
                2: 'Payment Process Installment 2 Rejected Reasons',
                3: 'Payment Process Installment 3 Rejected Reasons'
            };
            $('#rejectionModalLabel').text(titles[installment] || 'Rejected Reasons');
                
            }else{
                modalBody.empty()
                        .append(`<tr><td colspan="2" class="text-center">No data available</td></tr>`);
                        const footerContent = `
                        <div class="d-flex justify-content-between align-items-center w-100">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    `;
                        $("#totalcount").text(0);
                        $('#rejectionModal .modal-footer').empty().html(footerContent);
            }
                    $('#rejectionModal').modal('show');
        },
        error: function(errorThrown) {
            console.log("Error Fetching Payment Details, API Response ", errorThrown);
        }
    });
}

function getAllFilterValues() {
      // Ensure jQuery is available
      if (typeof $ === 'undefined') {
          console.error('jQuery is not loaded');
          return null;
      }

      // Initialize filter_conditions object
      let filter_conditions = {};

      // Collect filter values from .filter-select elements
      $('.filter-select').each(function () {
          const id = $(this).attr('id');
          const values = $(this).val();
          if (id && values && Array.isArray(values) && values.length > 0 && !values.includes("0")) {
              filter_conditions[id] = values;
          }
      });

      return filter_conditions;
  }

   

  function paymentSuccessList(mode) {
    const userFilters = getAllFilterValues();

    // decide status filters and any extra filter(s)
    let statusValues = null;
    const extraFilters = {}; // extra filter key/values (e.g. department_approval_status)

    if (mode === 'submit') {
        // when submitting to bank: include these statuses
        statusValues = ['Approved', 'Pending', 'Rejected'];
    } else if (mode === 'hold') {
        // hold: statuses that indicate pending/hold/approved plus department must be approved
        statusValues = ['Approval Pending', 'Hold', 'Approval Approved'];
        extraFilters['department_approval_status'] = 'Approved';
    } else if (mode === 'success') {
        // fully successful
        statusValues = ['Approved'];
    }

    // Build filter_conditions consistently as an object
    const filterConditions = {
        ...userFilters,
        "institution_id":institute_id,
    };

    if (statusValues !== null) {
        filterConditions['installment1_status'] = statusValues;
    }

    // merge any additional filters (like department_approval_status)
    Object.assign(filterConditions, extraFilters);

    const payload = {
        typeid: 3,
        selected_columns: [
            'subdepartment_name',
            'ownership',
            'university_typename',
            'university_name',
            'institution_categoryname',
            'institution_name',
            'umis_no',
            'student_name',
            'aadhaar_no',
            'gender',
            'religion',
            'community',
            'quota',
            'isdifferentlyabled',
            'disabilityname',
            'is_hosteler',
            'hostel_type',
            'is_first_graduate',
            'income',
            'studying_year',
            'course_duration',
            'stream_name',
            'course_type',
            'course_category_name',
            'course_name',
            'course_branch_name',
            'is_accredited',
            'scheme_name',
            'scheme_amount',
            'maintenanceamount',
            'disabilityamout',
            'scholarshipamount',
            'application_id',
            'is_eligible',
            'is_applied',
            'applied_ts',
            'aadhaar_verified',
            'community_certificate_verified',
            'income_certificate_verified',
            'benificiaryregistration',
            'installment1_status',
            'installment1_amount',
            'installment1_remarks'
        ],
        filter_conditions: filterConditions,
        group_by_columns: [],
        sort_columns: {},
        count_columns: ["umis_no"],
        sum_columns: [],
        limit_rows: 200,
        offset_rows: 0
    };

    
    const detailsParam = btoa(JSON.stringify(payload));
    const redirectUrl = `https://ssp25-26.tnega.org/institute/generic_report.html?details=${urlKey}&keys=${detailsParam}`;

    window.open(redirectUrl, '_blank');
}

function nspPaymentSuccessList(mode) {
    const userFilters = getAllFilterValues();

    let statusValues = null;
    const extraFilters = {};

    if (mode === 'submit') {
        statusValues = ['Approved', 'Pending', 'Rejected'];
        extraFilters['installment1_status'] = 'Approved';
    } else if (mode === 'pending') {
        statusValues = ['Pending'];
        extraFilters['installment1_status'] = 'Approved';
    } else if (mode === 'success') {
        statusValues = ['Approved'];
        extraFilters['installment1_status'] = 'Approved';
    }

    const filterConditions = {
        ...userFilters,
        "institution_id":institute_id,
    };

    if(statusValues !== null && mode === 'submit'){
        filterConditions['nsp_submission_status'] = statusValues;
    }else if (statusValues !== null) {
        filterConditions['installment2_status'] = statusValues;
    }

    Object.assign(filterConditions, extraFilters);

    const payload = {
        typeid: 3,
        selected_columns: [
            'subdepartment_name',
            'ownership',
            'university_typename',
            'university_name',
            'institution_categoryname',
            'institution_name',
            'umis_no',
            'student_name',
            'aadhaar_no',
            'gender',
            'religion',
            'community',
            'quota',
            'isdifferentlyabled',
            'disabilityname',
            'is_hosteler',
            'hostel_type',
            'is_first_graduate',
            'income',
            'studying_year',
            'course_duration',
            'stream_name',
            'course_type',
            'course_category_name',
            'course_name',
            'course_branch_name',
            'is_accredited',
            'scheme_name',
            'scheme_amount',
            'maintenanceamount',
            'disabilityamout',
            'scholarshipamount',
            'application_id',
            'is_eligible',
            'is_applied',
            'applied_ts',
            'aadhaar_verified',
            'community_certificate_verified',
            'income_certificate_verified',
            'benificiaryregistration',
            'installment1_status',
            'installment1_amount',
            'installment1_remarks',
            'nsp_submission_status',
            'nsp_remarks',
            'installment2_status',
            'installment2_amount',
            'installment2_remarks'
        ],
        filter_conditions: filterConditions,
        group_by_columns: [],
        sort_columns: {},
        count_columns: ["umis_no"],
        sum_columns: [],
        limit_rows: 200,
        offset_rows: 0
    };

    const detailsParam = btoa(JSON.stringify(payload));
    const redirectUrl = `https://ssp25-26.tnega.org/institute/generic_report.html?details=${urlKey}&keys=${detailsParam}`;

    window.open(redirectUrl, '_blank');
}

function updateDateTime() {
  const now = new Date();
  const options = {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };
  const formattedDate = now.toLocaleString('en-IN', options).replace(',', '');
  document.getElementById('dateTimeLink').textContent = "" + formattedDate;
}

setInterval(updateDateTime, 1000);
updateDateTime();