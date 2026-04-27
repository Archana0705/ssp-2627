var umis_fees_api_url = config.umis_fees_api_url;
var institute_api_url = config.institute_api_url;
var ssp_api_url = config.ssp_api_url;
var university_id_decode = "";
var department_api_url = config.ssp_api_url;

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
let departmentName = localStorage.getItem("departmentName");
//let departmentCode = localStorage.getItem("departmentCode");
user_id = localStorage.getItem("userId");
role_id = localStorage.getItem("roleId");
// Fetch Department Details

var departmentCode = $("#department-filter").val() || 0;
var sub_department_id = $("#sub-department-filter").val() || 0;

let userId = localStorage.getItem("userId");
$(document).ready(function () {
  var departmentCode = $("#department-filter").val() || 0;
  var sub_department_id = $("#sub-department-filter").val() || 0;
  $.ajax({
    type: "POST",
    headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
    url: umis_fees_api_url + "/get_fees_academic_year",
    data: { id: 0 },
    beforeSend: function () {
      $("#academic-year-filter").empty();
    },
    success: function (response, textStatus, http) {
      var responsedata1 = response.data;
      var option1 = "";
      responsedata1.forEach(function (select) {
        option1 += `<option value='${select.id}'>${select.accadamic_year}</option>`;
      });
      $("#academic-year-filter").append(option1);
    },
    complete: function () {
      var hiddenInstituteId = $("#institute_id").val(); // Get the selected institute ID
      var selectedAcademicYear = $("#academic-year-filter").val(); // Get the selected academic year
      var district_code = $("#district-name-filter").val(); // Get the selected district code
      var selectedTalukId = $("#taluk-name-filter").val();
      var departmentCode = $("#department-filter").val() || 0;
      var sub_department_id = $("#sub-department-filter").val() || 0;
    },
    error: function (errorThrown) {},
  });
  get_scholarship_department = {
    user_id: localStorage.getItem("userId"),
    department_id: 1,
  };
  $.ajax({
    url: config.ssp_api_url + "/get_scholarship_department",
    type: "POST",
    headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
    data: { data: encryptData(get_scholarship_department) },
    success: function (response) {
      if (response.status === 1) {
        //alert(user_id);
        response.data = decryptData(response.data);
        if (role_id != "2" && role_id != "3") {
          $("#department-filter").empty();
          response.data.forEach(function (department) {
            $("#department-filter").append(
              `<option value="${department.id}">${department.department_name}</option>`
            );
            academic_year = $("#academic-year-filter").val() || 30;

            get_ownership(
              (selectedAcademicYear = academic_year || 30),
              (district_code = 0),
              (selectedTalukId = 0),
              (schemeId = 0),
              (subSchemeId = 0),
              response.data[0]["id"],
              0
            );
            get_district(30, response.data[0]["id"], sub_department_id);
            //initializeDataTableSchemeCount();
            get_scholarship_schemename(response.data[0]["id"], userId);
          });
        } else {
          // Check for success
          // Clear the previous options before adding new items
          $("#department-filter").empty();

          // Add default option
          $("#department-filter").append('<option value="0">All</option>');

          // Populate the district dropdown
          response.data.forEach(function (department) {
            $("#department-filter").append(
              `<option value="${department.id}">${department.department_name}</option>`
            );
          });
          // get_dept_summary(
          //   (academic_year = $("#academic-year-filter").val() || 30),
          //   (state = 0),
          //   (district = district_code),
          //   (taluk = selectedTalukId),
          //   (institution_id = selectedInstituteId),
          //   (ownership = selectedownership),
          //   (stream_id = streamId),
          //   (course_type = courseType),
          //   (course_year = 0),
          //   (course_branch = 0),
          //   (course_category = 0),
          //   (course = 0),
          //   (scheme_id = 0),
          //   (gender = 0),
          //   (university = 0),
          //   (user_id = userId),
          //   (department = 0),
          //   (sub_department = sub_department_id),
          //   (subscheme_id = 0)
          // );
          get_ownership(
            (selectedAcademicYear = $("#academic-year-filter").val() || 30),
            (district_code = 0),
            (selectedTalukId = 0),
            (schemeId = 0),
            (subSchemeId = 0),
            0,
            0
          );
          get_district(selectedAcademicYear, 0, sub_department_id);
          //initializeDataTableSchemeCount();
          get_scholarship_schemename(0, userId);
        }
      } else {
        console.log("No department found or invalid response.");
      }
    },
    error: function () {
      console.log("Error Fetch Department Details Failed.");
    },
  });

  $("#academic-year-filter").on("change", function () {
    var hiddenInstituteId = $("#institute_id").val();
    var selectedAcademicYear = $("#academic-year-filter").val();
    console.log("acedemicyearid", selectedAcademicYear);
    // get_scholarship_schemename(hiddenInstituteId, selectedAcademicYear);
    //initializeDataTableSchemeCount();
    get_district(hiddenInstituteId);
    // get_taluk(district_code, hiddenInstituteId);
  });
  var departmentCode = $("#department-filter").val();

  var sub_department_id = $("#sub-department-filter").val();
  var selectedAcademicYear = $("#academic-year-filter").val();
  var district_code = $("#district-name-filter").val();
  var selectedTalukId = $("#taluk-name-filter").val();
  var schemeId = $("#scheme-name-filter").val();
  var subSchemeId = $("#sub-scheme-name-filter").val();
  var selectedownership = $("#ownership-name-filter").val();
  var selecteduniversitytype = $("#university-type-name-filter").val();
  var selecteduniversity = $("#university-name-filter").val();
  var selectedInstituteId = $("#institute-name-filter").val(); // Get the selected institute ID
  var streamId = $("#stream-id-filter").val(); // Get the selected stream ID
  var courseType = $("#course-type").val();
  var courseCategory = $("#course-category-list").val();
  var course_id = $("#course-list").val();
  var branch_id = $(this).val();
  var departmentCode = $("#department-filter").val();
  var sub_department_id = $("#sub-department-filter").val();

  $(".ins").hide();
  function get_dept_summary(
    academic_year = 30,
    state = 0,
    district = 0,
    taluk = 0,
    institution_id = 0,
    ownership = 0,
    stream_id = 0,
    course_type = 0,
    course_year = 0,
    course_branch = 0,
    course_category = 0,
    course = 0,
    scheme_id = 0,
    gender = 0,
    university = 0,
    user_id = userId,
    department = departmentCode || 0,
    sub_department = 0,
    subscheme_id = 0,
    university_type = 0
  ) {
    if ($.fn.DataTable.isDataTable("#student_report_table")) {
      // Destroy the existing DataTable instance if it exists
      $("#student_report_table").DataTable().destroy();
    }

    var table = $("#student_report_table").DataTable({
      paging: true,
      lengthMenu: [50, "All"],
      ordering: true,
      info: true,
      responsive: true,
      // order: [[1, 'asc']],
      order: [[0, "asc"]],
      dom: "Bfrtlip", // Add the buttons to the DOM
      buttons: [
        {
          extend: "excelHtml5",
          text: '<i class="bi bi-file-earmark-spreadsheet btn-sm"> Excel</i>',
          titleAttr: "EXCEL",
          className: "btn btn-success",
          exportOptions: {
            columns: ":visible",
          },
          customize: function (xlsx) {
            // Get the sheet data from the Excel XML
            var sheet = xlsx.xl.worksheets["sheet1.xml"];
            var sheetData = $(sheet).find("sheetData");

            // Get selected text from each dropdown
            var academicYear = $(
              "#academic-year-filter option:selected"
            ).text();
            var districtText = $(
              "#district-name-filter option:selected"
            ).text();
            var talukText = $("#taluk-name-filter option:selected").text();
            var schemeText = $("#scheme-name-filter option:selected").text();
            var ownershipText = $(
              "#ownership-name-filter option:selected"
            ).text();
            var universityTypeText = $(
              "#university-type-name-filter option:selected"
            ).text();
            var universityText = $(
              "#university-name-filter option:selected"
            ).text();
            var instituteText = $(
              "#institute-name-filter option:selected"
            ).text();
            var departmentText = $("#department-filter option:selected").text();
            var subDepartmentText = $(
              "#sub-department-filter option:selected"
            ).text();

            // Get static values
            var userId = user_id;

            // Concatenate all the filter text into a custom format
            var filterData =
              `Academic Year: ${academicYear}   District: ${districtText}   Taluk: ${talukText}&#10;&#10;` +
              `Scheme: ${schemeText}   Ownership: ${ownershipText}   University Type: ${universityTypeText}   ` +
              `University: ${universityText}   Institute: ${instituteText}&#10;&#10;` +
              `Department: ${departmentText}   Sub Department: ${subDepartmentText}&#10;` +
              `User ID: ${userId}`;

            // Define the first row (r="1") with all filter data in column A1
            var filterDataRow = `
                            <row r="1" ht="80" customHeight="80">
                                <c t="inlineStr" s="51" r="A1">
                                    <is><t>${filterData}</t></is>
                                </c>
                            </row>
                        `;

            // Prepend the filter data row to the sheet
            sheetData.prepend(filterDataRow);

            // Ensure cell styling is correctly defined for center alignment and text wrapping
            var styles = xlsx.xl["styles.xml"];
            var cellStyles = $(styles).find("cellXfs");

            // Define a new style with center alignment and wrap text (line break support)
            var centerAlignedWrapStyle = `
                            <xf xfId="0" applyAlignment="1">
                                <alignment horizontal="center" vertical="center" wrapText="1"/>
                            </xf>
                        `;

            cellStyles.append(centerAlignedWrapStyle);
          },
        },
        {
          extend: "pdfHtml5",
          orientation: "landscape",
          pageSize: "A4",
          text: '<i class="bi bi-filetype-pdf"> PDF</i>',
          titleAttr: "PDF",
          className: "btn btn-danger btn-sm",
          exportOptions: {
            columns: ":visible",
          },
        },
        {
          extend: "print",
          text: '<i class="bi bi-printer"> Print</i>',
          titleAttr: "Print",
          exportOptions: {
            columns: ":visible",
          },
        },
        {
          extend: "colvis", // Add column visibility button
          text: '<i class="bi bi-eye"> Column Visibility</i>',
          className: "btn btn-info",
          columns: ":not(.noVis)", // Exclude columns with the class `noVis`
        },
      ],
      columnDefs: [
        { className: "dt-center", targets: "_all" }, // Center align all columns
      ],
      ajax: {
        url: department_api_url + "/department/get_department_studentreport",
        type: "POST",
        headers: {
          "X-APP-KEY": "te$t",
          "X-APP-NAME": "te$t",
        },
        data: {
          district_id: district,
          taluk_id: taluk,
          institution_id: institution_id,
          ownership_id: ownership,
          stream_id: stream_id,
          course_type_id: course_type,
          course_year: course_year,
          course_branch_id: course_branch,
          course_category_id: course_category,
          course_id: course,
          scheme_id: scheme_id,
          gender_id: gender,
          university_id: university,
          user_id: user_id,
          departmentid: department,
          // sub_department: sub_department,
          subscheme_id: subscheme_id,
          university_type_id: university_type,
        },
        dataSrc: function (response) {
          return response.data;
        },
      },

      columns: [
        {
          data: "id",
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1; // Row numbering
          },
        },
        {
          data: "aisheid",
          render: function (data) {
            $("#institution_id").val(data ? data : "0");

            // Optionally, you can return the data or the default value for display purposes in your table cell
            return data;
          },
        },
        {
          data: "institutionumisid",
          render: function (data) {
            $("#institution_aishce").val(data ? data : "0");

            // Optionally, you can return the data or the default value for display purposes in your table cell
            return data;
          },
        },
        {
          data: "institution_name",
          render: function (data) {
            $("#institution_name").val(data ? data : "0");

            // Optionally, you can return the data or the default value for display purposes in your table cell
            return data ? data : "0";
          },
        },
        {
          data: "student_name",
          render: function (data, row) {
            $("#institution_name").text(row.institution_name);
            if (row.institution_code) {
              $(".ins").show();
            } else {
              $(".ins").hide();
            }
            $("#institution_aishce").text(row.institutionumisid);
            $("#institution_id").text(row.institution_code ?? "no data found");
            return data ? data : "0";
          },
        },
        {
          data: "umis_no",
          render: function (data) {
            return data ? data : "0";
          },
        },
        {
          data: "scheme_name",
          render: function (data) {
            return data ? data : "0";
          },
        },
        {
          data: "subscheme_name",
          render: function (data) {
            return data ? data : "0";
          },
        },
        {
          data: "stream_name",
          render: function (data) {
            return data ? data : "0";
          },
        },
        {
          data: "course_name",
          render: function (data) {
            return data ? data : "0";
          },
        },
        {
          data: "course_branch_name",
          render: function (data) {
            return data ? data : "0";
          },
        },
        {
          data: "studing_year",
          render: function (data) {
            return data ? data : "0";
          },
        },
        {
          data: "gender",
          render: function (data) {
            return data ? data : "0";
          },
        },
        // {
        //   data: "maintenance_amount",
        //   render: function (data) {
        //     return "0";
        //   },
        // },
        {
          data: "maintenance_amount",
          render: function (data) {
            return "0";
          },
        },
        {
          data: "maintenance_amount",
          render: function (data) {
            return data ? data : "0";
          },
        },
        {
          data: "scholarship_amount",
          render: function (data) {
            return data ? data : "0";
          },
        },
        {
          data: "totalpaidamount",
          render: function (data) {
            return data ? data : "0";
          },
        },
        {
          data: "applicationholder",
          render: function (data) {
            return data ? data : "0";
          },
        },
        {
          data: "applicationstatus",
          render: function (data) {
            return data ? data : "0";
          },
        },
        {
          data: "installment1_paidamount",
          render: function (data) {
            return data ? data : "0";
          },
        },
        {
          data: "installment1_status",
          render: function (data) {
            return data ? data : "0";
          },
        },
        {
          data: "installment2_paidamount",
          render: function (data) {
            return data ? data : "0";
          },
        },
        {
          data: "installment2_status",
          render: function (data) {
            return data ? data : "0";
          },
        },
        {
          data: "installment3_paidamount",
          render: function (data) {
            return data ? data : "0";
          },
        },
        {
          data: "installment3_status",
          render: function (data) {
            return data ? data : "0";
          },
        },
      ],
    });
  }

  console.log("departmentCode", departmentCode);

  $("#department-filter").on("change", function () {
    var departmentCode = $(this).val();
    (get_scholarship_subdepartment = {
      department_id: departmentCode,
      user_id: userId,
      sub_department_id: 1,
    }),
      $.ajax({
        type: "POST",
        headers: {
          "X-APP-KEY": "te$t",
          "X-APP-NAME": "te$t",
        },
        url: ssp_api_url + "/get_scholarship_subdepartment",
        data: { data: encryptData(get_scholarship_subdepartment) },
        // Passing district_code and institute_id
        dataType: "json",
        success: function (response) {
          if (response.success === 1) {
            // Clear the previous list before adding new items
            $("#sub-department-filter").empty();
            var responsedata1 = decryptData(response.data);
            // Add default option
            $("#sub-department-filter").append(
              '<option value="0">All</option>'
            );
            responsedata1.forEach(function (sub_department) {
              $("#sub-department-filter").append(
                `<option value="${sub_department.subdepartment_id}">${sub_department.subdepartment_name}</option>`
              );
            });
          } else {
            console.log("No Sub-Department found or invalid response.");
          }
        },
        error: function (error) {
          console.log("Error fetching Sub-Department:", error);
        },
      });
  });

  function get_district(
    selectedAcademicYear,
    departmentCode,
    sub_department_id
  ) {
    get_district = {
      academic_year: selectedAcademicYear,
      state: 0,
      department: departmentCode,
      sub_department: sub_department_id,
      user_id: userId,
    };
    $.ajax({
      type: "POST",
      url: department_api_url + "/department/get_district",
      headers: {
        "X-APP-KEY": "te$t",
        "X-APP-NAME": "te$t",
      },
      data: {
        data: encryptData(get_district),
      },
      dataType: "json",
      success: function (response) {
        if (response.status === 1) {
          var role_id = localStorage.getItem("roleId");
          if (role_id == 9) {
            $("#district-name-filter").empty();

            // Populate the district dropdown
            decryptData(response.data).forEach(function (district) {
              $("#district-name-filter").append(
                `<option value="${district.districtid}">${district.districtname}</option>`
              );
            });
            get_taluk(
              response.data[0]["districtid"],
              selectedAcademicYear,
              departmentCode,
              sub_department_id
            );
          } else {
            // Clear the previous options before adding new items
            $("#district-name-filter").empty();

            // Add default option
            $("#district-name-filter").append('<option value="0">All</option>');

            // Populate the district dropdown
            decryptData(response.data).forEach(function (district) {
              $("#district-name-filter").append(
                `<option value="${district.districtid}">${district.districtname}</option>`
              );
            });
          }
        }
      },
      error: function (error) {
        console.log("Error fetching districts:", error);
      },
    });
  }

  $(document).on("change", "#district-name-filter", function () {
    var department_id = $("#department-filter").val();
    var sub_department_id = $("#sub-department-filter").val();
    var selectedAcademicYear = $("#academic-year-filter").val();
    var district_code = $("#district-name-filter").val();
    var selectedTalukId = $("#taluk-name-filter").val();
    var schemeId = $("#scheme-name-filter").val();
    var subSchemeId = $("#sub-scheme-name-filter").val(); // Get selected sub-scheme ID
    console.log(subSchemeId);
    // Call get_institute with the necessary parameters
    // get_institute(selectedAcademicYear, district_code, selectedTalukId, schemeId, subSchemeId);
    get_ownership(
      selectedAcademicYear,
      district_code,
      selectedTalukId,
      schemeId,
      subSchemeId,
      department_id,
      sub_department_id
    );
    get_taluk(
      district_code,
      selectedAcademicYear,
      department_id,
      sub_department_id
    ); // Fetch taluks based on selected district
    // get_scholarship_schemename(hiddenInstituteId, selectedAcademicYear);
    // //initializeDataTableSchemeCount();
    $("#taluk-name-filter").prop("selectedIndex", 0);
    // $('#scheme-name-filter').prop('selectedIndex', 0);
    // $('#sub-scheme-name-filter').prop('selectedIndex', 0);
    // $('#ownership-name-filter').prop('selectedIndex', 0);
    // $('#university-type-name-filter').prop('selectedIndex', 0);
    // $('#university-name-filter').prop('selectedIndex', 0);
    // $('#sub-scheme-name-filter').prop('selectedIndex', 0);
    // $('#institute-name-filter').prop('selectedIndex', 0);
    // $('#stream-id-filter').prop('selectedIndex', 0);
    // $('#course-type').prop('selectedIndex', 0);
    // $('#course-category-list').prop('selectedIndex', 0);
    // $('#course-list').prop('selectedIndex', 0);
    // $('#branch-list').prop('selectedIndex', 0);
    // $('#course-year').prop('selectedIndex', 0);
    // $('#gender-list').prop('selectedIndex', 0);
  });

  function get_taluk(
    district_code,
    selectedAcademicYear,
    departmentCode,
    sub_department_id
  ) {
    get_taluk = {
      academic_year: selectedAcademicYear,
      state: 0,
      district: district_code,
      department: departmentCode,
      sub_department: sub_department_id,
      user_id: userId,
    };
    $.ajax({
      type: "POST",
      headers: {
        "X-APP-KEY": "te$t",
        "X-APP-NAME": "te$t",
      },
      url: ssp_api_url + "/department/get_taluk",
      data: {
        data: encryptData(get_taluk),
      },
      // Passing district_code and institute_id
      dataType: "json",
      success: function (response) {
        if (response.status === 1) {
          // Clear the previous list before adding new items
          $("#taluk-name-filter").empty();
          response.data = decryptData(response.data);
          // Add default option
          $("#taluk-name-filter").append('<option value="0">All</option>');
          response.data.forEach(function (taluk) {
            $("#taluk-name-filter").append(
              `<option value="${taluk.talukid}">${taluk.talukname}</option>`
            );
          });
        } else {
          console.log("No taluks found or invalid response.");
        }
      },
      error: function (error) {
        console.log("Error fetching taluks:", error);
      },
    });
  }

  // Trigger when the taluk changes
  $("#taluk-name-filter").on("change", function () {
    var department_id = $("#department-filter").val();
    var sub_department_id = $("#sub-department-filter").val();
    var selectedAcademicYear = $("#academic-year-filter").val();
    var district_code = $("#district-name-filter").val();
    var selectedTalukId = $(this).val();
    // get_scholarship_schemename(selectedAcademicYear, district_code, selectedTalukId);
    // //initializeDataTableSchemeCount();
    var schemeId = $("#scheme-name-filter").val();
    var subSchemeId = $("#sub-scheme-name-filter").val(); // Get selected sub-scheme ID
    console.log(subSchemeId);
    // Call get_institute with the necessary parameters
    // get_institute(selectedAcademicYear, district_code, selectedTalukId, schemeId, subSchemeId);
    get_ownership(
      selectedAcademicYear,
      district_code,
      selectedTalukId,
      schemeId,
      subSchemeId,
      department_id,
      sub_department_id
    );
    $("#scheme-name-filter").prop("selectedIndex", 0);
    $("#sub-scheme-name-filter").prop("selectedIndex", 0);
    // $('#ownership-name-filter').prop('selectedIndex', 0);
    // $('#university-type-name-filter').prop('selectedIndex', 0);
    // $('#university-name-filter').prop('selectedIndex', 0);
    // $('#sub-scheme-name-filter').prop('selectedIndex', 0);
    // $('#institute-name-filter').prop('selectedIndex', 0);
    // $('#stream-id-filter').prop('selectedIndex', 0);
    // $('#course-type').prop('selectedIndex', 0);
    // $('#course-category-list').prop('selectedIndex', 0);
    // $('#course-list').prop('selectedIndex', 0);
    // $('#branch-list').prop('selectedIndex', 0);
    // $('#course-year').prop('selectedIndex', 0);
    // $('#gender-list').prop('selectedIndex', 0);
  });
  function updateSubmitButtonState() {
    let anySelected = $(".form-select")
      .toArray()
      .some((select) => $(select).val() !== "");
    $("#submit").prop("disabled", !anySelected);
  }

  $(".form-select").change(function () {
    updateSubmitButtonState();
  });

  updateSubmitButtonState();
  $("#submit").prop("disabled", true);
  $(document).on("click", "#submit", function () {
    // $(this).prop("disabled", true);
    var selectedAcademicYear = $("#academic-year-filter").val();
    var district_code = $("#district-name-filter").val();
    var selectedTalukId = $("#taluk-name-filter").val();
    var schemeId = $("#scheme-name-filter").val();
    var subSchemeId = $("#sub-scheme-name-filter").val();
    var selectedownership = $("#ownership-name-filter").val();
    var selecteduniversitytype = $("#university-type-name-filter").val();
    var selecteduniversity = $("#university-name-filter").val();
    var selectedInstituteId = $("#institute-name-filter").val(); // Get the selected institute ID
    var streamId = $("#stream-id-filter").val(); // Get the selected stream ID
    var courseType = $("#course-type").val();
    var courseCategory = $("#course-category-list").val();
    var department_id = $("#department-filter").val();
    var sub_department_id = $("#sub-department-filter").val();
    var course_year = $("#course-year").val();
    var course_list = $("#course-list").val();
    var gender = $("#gender-list").val();
    var course_branch = $("#branch-list").val();
    get_dept_summary(
      selectedAcademicYear,
      (state = 0),
      district_code,
      selectedTalukId,
      selectedInstituteId,
      selectedownership,
      streamId,
      courseType,
      course_year,
      course_branch,
      courseCategory,
      course_list,
      schemeId,
      gender,
      selecteduniversity,
      userId,
      department_id,
      (sub_department = sub_department_id),
      subSchemeId
    );
    // if (selectedInstituteId != 0) {

    // } else {
    //   Swal.fire({
    //     icon: "info",
    //     title: "Please select institute name",
    //     showConfirmButton: true,
    //   });
    // }
    $(this).prop("disabled", true);

    // get_total_students_count(
    //   district_code,
    //   selectedTalukId,
    //   selectedownership,
    //   selecteduniversitytype,
    //   selectedInstituteId,
    //   selecteduniversity
    // );
  });

  function get_scholarship_schemename(departmentCode, userId) {
    get_dept_scheme = {
      department_id: departmentCode,
      user_id: userId,
    };
    $.ajax({
      type: "POST",
      headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
      url: department_api_url + "/department/get_dept_scheme",
      data: {
        data: encryptData(get_dept_scheme),
      },
      dataType: "json",
      success: function (response) {
        if (response.status === 1) {
          // Clear the previous list before adding new items
          $("#scheme-name-filter").empty();

          // Add default option
          $("#scheme-name-filter").append('<option value="0">All</option>');
          count = 0;
          response.data = decryptData(response.data);
          response.data.forEach(function (select) {
            $("#scheme-name-filter").append(
              `<option value="${select.schemeid}">${select.scheme_name}</option>`
            );
            count++;
          });
          $("#scheme_count").text(count);
        } else {
          console.log("No scheme found or invalid response.");
        }
      },
      error: function (errorThrown) {
        console.log("Error in fetching schemes: ", errorThrown);
      },
    });
  }

  $("#scheme-name-filter").on("change", function () {
    var hiddenInstituteId = $("#institute_id").val();
    var selectedAcademicYear = $("#academic-year-filter").val();
    var district_code = $("#district-name-filter").val();
    var selectedTalukId = $("#taluk-name-filter").val();
    var schemeId = $(this).val(); // Getting the scheme ID
    var department_id = $("#department-filter").val();
    var sub_department_id = $("#sub-department-filter").val();
    // Check if schemeId is being retrieved correctly
    console.log("Selected Scheme ID:", schemeId);
    // Call get_sub_scheme with all the required parameters
    get_sub_scheme(
      selectedAcademicYear,
      district_code,
      selectedTalukId,
      schemeId,
      department_id,
      sub_department_id
    );

    // Additional functions
    // get_streams(hiddenInstituteId, selectedAcademicYear, schemeId);
    // //initializeDataTableSchemeCount();

    // Reset filters
    $("#sub-scheme-name-filter").prop("selectedIndex", 0);
    // $('#university-type-name-filter').prop('selectedIndex', 0);
    // $('#university-name-filter').prop('selectedIndex', 0);
    // $('#institute-name-filter').prop('selectedIndex', 0);
    // $('#stream-id-filter').prop('selectedIndex', 0);
    // $('#course-type').prop('selectedIndex', 0);
    // $('#course-category-list').prop('selectedIndex', 0);
    // $('#course-list').prop('selectedIndex', 0);
    // $('#branch-list').prop('selectedIndex', 0);
    // $('#course-year').prop('selectedIndex', 0);
    // $('#gender-list').prop('selectedIndex', 0);
  });

  function get_sub_scheme(
    selectedAcademicYear,
    district_code,
    talukcode,
    schemeId,
    departmentCode,
    sub_department_id
  ) {
    var get_sub_scheme_list = {
      district_id: district_code,
      academic_year_id: selectedAcademicYear,
      department_id: departmentCode,
      sub_department_id: sub_department_id,
      user_id: userId,
      taluk_id: talukcode,
      scheme_id: schemeId,
    };

    $.ajax({
      type: "POST",
      url: department_api_url + "/get_sub_scheme_list",
      headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
      data: { data: encryptData(get_sub_scheme_list) },
      dataType: "json",
      success: function (response) {
        if (response.success == 1) {
          response.data = decryptData(response.data);
          console.log($("#sub-scheme-name-filter"));
          // Clear previous sub-scheme options
          $("#sub-scheme-name-filter").empty();

          // Append new sub-scheme options
          var subSchemeOptions = '   <option value="0">All</option>';
          response.data.forEach(function (subScheme) {
            subSchemeOptions += `<option value='${subScheme.subscheme_id}'>${subScheme.subscheme_name}</option>`;
          });
          console.log("subSchemeOptions", subSchemeOptions);
          $("#sub-scheme-name-filter").append(subSchemeOptions);
        } else {
          console.log("No sub-schemes found.");
        }
      },
      error: function (error) {
        console.log("Error fetching sub-schemes:", error);
      },
    });
  }

  $("#sub-scheme-name-filter").on("change", function () {
    var department_id = $("#department-filter").val();
    var sub_department_id = $("#sub-department-filter").val();
    var selectedAcademicYear = $("#academic-year-filter").val();
    var district_code = $("#district-name-filter").val();
    var selectedTalukId = $("#taluk-name-filter").val();
    var schemeId = $("#scheme-name-filter").val();
    var subSchemeId = $("#sub-scheme-name-filter").val(); // Get selected sub-scheme ID
    console.log(subSchemeId);
    // Call get_institute with the necessary parameters
    // get_institute(selectedAcademicYear, district_code, selectedTalukId, schemeId, subSchemeId);

    // $('#ownership-name-filter').prop('selectedIndex', 0);
    // $('#university-type-name-filter').prop('selectedIndex', 0);
    // $('#university-name-filter').prop('selectedIndex', 0);
    // $('#institute-name-filter').prop('selectedIndex', 0);
    // $('#stream-id-filter').prop('selectedIndex', 0);
    // $('#course-type').prop('selectedIndex', 0);
    // $('#course-category-list').prop('selectedIndex', 0);
    // $('#course-list').prop('selectedIndex', 0);
    // $('#branch-list').prop('selectedIndex', 0);
    // $('#course-year').prop('selectedIndex', 0);
    // $('#gender-list').prop('selectedIndex', 0);
    // //initializeDataTableSchemeCount();
  });

  function get_ownership(
    selectedAcademicYear,
    district_code,
    selectedTalukId,
    schemeId,
    subSchemeId = 0,
    departmentCode,
    sub_department_id
  ) {
    get_university_ownership = {
      district: district_code,
      state: 0,
      academic_year: selectedAcademicYear,
      department: departmentCode,
      sub_department: sub_department_id,
      user_id: userId,
      taluk: selectedTalukId,
      scheme: schemeId,
      sub_scheme: subSchemeId,
    };

    $.ajax({
      type: "POST",
      url: department_api_url + "/department/get_university_ownership",
      headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
      data: {
        data: encryptData(get_university_ownership),
      },

      dataType: "json",
      success: function (response) {
        console.log(response); // Debug: Check the actual response

        if (response.status === 1) {
          console.log($("#ownership-name-filter"));
          // Clear previous institute options
          $("#ownership-name-filter").empty();

          // Check if response.data exists and is not empty
          if (response.data && response.data.length > 0) {
            // Append default "All" option
            var ownershipOptions = '   <option value="0">All</option>';
            response.data = decryptData(response.data);
            // Append new ownership options
            response.data.forEach(function (ownership) {
              ownershipOptions += `<option value="${ownership.ownershipid}">${ownership.ownershipname}</option>`;
            });
            console.log("ownershipdata", ownershipOptions);

            // Append to dropdown
            $("#ownership-name-filter").append(ownershipOptions);
          } else {
            console.log("No ownership data found in response.");
          }
        } else {
          console.log("Error: " + response.message); // Log error message
        }
      },
      error: function (error) {
        console.log("Error fetching ownership:", error); // Log error in console
      },
    });
  }

  $("#ownership-name-filter").on("change", function () {
    var department_id = $("#department-filter").val();
    var sub_department_id = $("#sub-department-filter").val();
    var selectedAcademicYear = $("#academic-year-filter").val();
    var district_code = $("#district-name-filter").val();
    var selectedTalukId = $("#taluk-name-filter").val();
    var schemeId = $("#scheme-name-filter").val();
    var subSchemeId = $("#sub-scheme-name-filter").val();
    var selectedownership = $(this).val(); // Get the selected institute ID

    // Call get_streams with the necessary parameters
    get_university_type(
      selectedAcademicYear,
      district_code,
      selectedTalukId,
      schemeId,
      subSchemeId,
      selectedownership,
      department_id,
      sub_department_id
    );
    $("#university-type-name-filter").prop("selectedIndex", 0);
    $("#university-name-filter").prop("selectedIndex", 0);
    $("#institute-name-filter").prop("selectedIndex", 0);
    $("#stream-id-filter").prop("selectedIndex", 0);
    $("#course-type").prop("selectedIndex", 0);
    $("#course-category-list").prop("selectedIndex", 0);
    $("#course-list").prop("selectedIndex", 0);
    $("#branch-list").prop("selectedIndex", 0);
    $("#course-year").prop("selectedIndex", 0);
    $("#gender-list").prop("selectedIndex", 0);
    // //initializeDataTableSchemeCount();
  });

  function get_university_type(
    selectedAcademicYear,
    district_code,
    selectedTalukId,
    schemeId,
    subSchemeId,
    selectedownership,
    departmentCode,
    sub_department_id
  ) {
    selectedownership = selectedownership === "All" ? "0" : selectedownership;
    // academic_year=30&state=0&district=610&taluk=0&ownership=5&university_type=0&department=1&sub_department=1&user_id=1
    // district=610&academic_year=30&department=1&sub_department=0&user_id=1&taluk=5719&scheme_id=0&sub_scheme_id=0&ownership=2&state=0&university_type=0
    // academic_year=30&state=0&district=569&taluk=0&ownership=4&university_type=0&department=1&sub_department=1&user_id=1

    get_dept_university_type = {
      district: district_code,
      academic_year: selectedAcademicYear,
      department: departmentCode,
      sub_department: sub_department_id,
      user_id: userId,
      taluk: selectedTalukId,
      ownership: selectedownership,
      state: 0,
      university_type: 0,
    };

    $.ajax({
      type: "POST",
      url: department_api_url + "/department/get_dept_university_type",
      headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
      data: {
        data: encryptData(get_dept_university_type),
      },
      dataType: "json",
      success: function (response) {
        if (response.status == 1) {
          // Clear previous institute options
          $("#university-type-name-filter").empty();
          response.data = decryptData(response.data);
          // Append new institute options
          var universitytypeOptions = '<option value="0">All</option>';
          response.data.forEach(function (universitytype) {
            universitytypeOptions += `<option value='${universitytype.university_typeid}'>${universitytype.university_type}</option>`;
          });
          $("#university-type-name-filter").append(universitytypeOptions);
        } else {
          console.log("No universitytype found.");
        }
      },
      error: function (error) {
        console.log("Error fetching universitytype:", error);
      },
    });
  }

  $("#university-type-name-filter").on("change", function () {
    var selectedAcademicYear = $("#academic-year-filter").val();
    var district_code = $("#district-name-filter").val();
    var selectedTalukId = $("#taluk-name-filter").val();
    var schemeId = $("#scheme-name-filter").val();
    var subSchemeId = $("#sub-scheme-name-filter").val();
    var selectedownership = $("#ownership-name-filter").val();
    var selecteduniversitytype = $(this).val();
    var department_id = $("#department-filter").val();
    var sub_department_id = $("#sub-department-filter").val();

    // Call get_streams with the necessary parameters
    get_university(
      selectedAcademicYear,
      district_code,
      selectedTalukId,
      schemeId,
      subSchemeId,
      selectedownership,
      selecteduniversitytype,
      department_id,
      sub_department_id
    );
    $("#university-name-filter").prop("selectedIndex", 0);
    $("#institute-name-filter").prop("selectedIndex", 0);
    $("#stream-id-filter").prop("selectedIndex", 0);
    $("#course-type").prop("selectedIndex", 0);
    $("#course-category-list").prop("selectedIndex", 0);
    $("#course-list").prop("selectedIndex", 0);
    $("#branch-list").prop("selectedIndex", 0);
    $("#course-year").prop("selectedIndex", 0);
    $("#gender-list").prop("selectedIndex", 0);
    // //initializeDataTableSchemeCount();
  });

  function get_university(
    selectedAcademicYear,
    district_code,
    selectedTalukId,
    schemeId,
    subSchemeId,
    selectedownership,
    selecteduniversitytype,
    department_id,
    sub_department_id
  ) {
    selectedownership = selectedownership === "All" ? "0" : selectedownership;
    selecteduniversitytype =
      selecteduniversitytype === "All" ? "0" : selecteduniversitytype;
    // district=0&academic_year=30&department=1&sub_department=0&user_id=1&taluk=0&scheme=7&sub_scheme=169&ownership=4&university_type=22&state=0;
    //   /  district=730&academic_year=30&department=1&sub_department=0&user_id=1&taluk=0&scheme=7&sub_scheme=169&ownership=4&university_type=20&state=0
    // academic_year=30&state=0&district=610&taluk=0&ownership=1&university_type=20&department=1&sub_department=1&user_id=1
    get_dept_universities = {
      district: district_code,
      academic_year: selectedAcademicYear,
      department: department_id,
      sub_department: sub_department_id,
      user_id: userId,
      taluk: selectedTalukId,
      // scheme: schemeId,
      // sub_scheme: subSchemeId,
      ownership: selectedownership,
      university_type: selecteduniversitytype,
      state: 0,
    };
    $.ajax({
      type: "POST",
      url: department_api_url + "/department/get_dept_universities",
      headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
      data: {
        data: encryptData(get_dept_universities),
      },
      dataType: "json",
      success: function (response) {
        if (response.status === 1) {
          // Clear previous institute options
          $("#university-name-filter").empty();
          response.data = decryptData(response.data);
          // Append new institute options
          var universityOptions = '   <option value="0">All</option>';
          response.data.forEach(function (university) {
            universityOptions += `<option value='${university.universityid}'>${university.university_name}</option>`;
          });
          $("#university-name-filter").append(universityOptions);
        } else {
          console.log("No university found.");
        }
      },
      error: function (error) {
        console.log("Error fetching university:", error);
      },
    });
  }

  $("#university-name-filter").on("change", function () {
    var selectedAcademicYear = $("#academic-year-filter").val();
    var district_code = $("#district-name-filter").val();
    var selectedTalukId = $("#taluk-name-filter").val();
    var schemeId = $("#scheme-name-filter").val();
    var subSchemeId = $("#sub-scheme-name-filter").val();
    var selectedownership = $("#ownership-name-filter").val();
    var department_id = $("#department-filter").val();
    var sub_department_id = $("#sub-department-filter").val();
    var selecteduniversitytype = $("#university-type-name-filter").val();
    var selecteduniversity = $(this).val();

    // Call get_streams with the necessary parameters
    get_institute(
      selectedAcademicYear,
      district_code,
      selectedTalukId,
      schemeId,
      subSchemeId,
      selectedownership,
      selecteduniversitytype,
      selecteduniversity,
      department_id,
      sub_department_id
    );
    // //initializeDataTableSchemeCount();
    $("#institute-name-filter").prop("selectedIndex", 0);
    $("#stream-id-filter").prop("selectedIndex", 0);
    $("#course-type").prop("selectedIndex", 0);
    $("#course-category-list").prop("selectedIndex", 0);
    $("#course-list").prop("selectedIndex", 0);
    $("#branch-list").prop("selectedIndex", 0);
    $("#course-year").prop("selectedIndex", 0);
    $("#gender-list").prop("selectedIndex", 0);
  });

  function get_institute(
    selectedAcademicYear,
    district_code,
    selectedTalukId,
    schemeId,
    subSchemeId,
    selectedownership,
    selecteduniversitytype,
    selecteduniversity,
    department_id,
    sub_department_id
  ) {
    selectedownership = selectedownership === "All" ? "0" : selectedownership;
    selecteduniversitytype =
      selecteduniversitytype === "All" ? "0" : selecteduniversitytype;
    selecteduniversity =
      selecteduniversity === "All" ? "0" : selecteduniversity;

    department_institute = {
      district_id: district_code,
      academic_year_id: selectedAcademicYear,
      department: department_id,
      sub_department: sub_department_id,
      user_id: userId,
      taluk_id: selectedTalukId,
      scheme: 0,
      sub_scheme: 0,
      ownership_id: selectedownership,
      university_type_id: selecteduniversitytype,
      university_id: selecteduniversity,
      state_id: 0,
    };
    $.ajax({
      type: "POST",
      url: department_api_url + "/department/department_institute",
      headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
      data: {
        // academic_year_id=30&state_id=0&district_id=569&taluk_id=0&ownership_id=4&university_type_id=22&university_id=29&department=1&sub_department=1&user_id=1&scheme=0&sub_scheme=0
        data: encryptData(department_institute),
      },
      dataType: "json",
      success: function (response) {
        if (response.success === 1) {
          // Clear previous institute options
          $("#institute-name-filter").empty();
          response.data = decryptData(response.data);
          // Append new institute options
          var instituteOptions = '   <option value="0">All</option>';
          response.data.forEach(function (institute) {
            instituteOptions += `<option value='${institute.institutionid}'>${institute.institution_name}</option>`;
          });
          $("#institute-name-filter").append(instituteOptions);
        } else {
          console.log("No institutes found.");
        }
      },
      error: function (error) {
        console.log("Error fetching institutes:", error);
      },
    });
  }

  $("#institute-name-filter").on("change", function () {
    var selectedAcademicYear = $("#academic-year-filter").val();
    var district_code = $("#district-name-filter").val();
    var selectedTalukId = $("#taluk-name-filter").val();
    var schemeId = $("#scheme-name-filter").val();
    var subSchemeId = $("#sub-scheme-name-filter").val();
    var selectedownership = $("#ownership-name-filter").val();
    var department_id = $("#department-filter").val();
    var sub_department_id = $("#sub-department-filter").val();
    var selecteduniversitytype = $("#university-type-name-filter").val();
    var selecteduniversity = $("#university-name-filter").val();
    var selectedInstituteId = $(this).val(); // Get the selected institute ID

    // Call get_streams with the necessary parameters
    get_streams(
      selectedAcademicYear,
      district_code,
      selectedTalukId,
      schemeId,
      subSchemeId,
      selectedownership,
      selecteduniversitytype,
      selecteduniversity,
      selectedInstituteId,
      department_id,
      sub_department_id
    );
    // //initializeDataTableSchemeCount();
    $("#stream-id-filter").prop("selectedIndex", 0);
    $("#course-type").prop("selectedIndex", 0);
    $("#course-category-list").prop("selectedIndex", 0);
    $("#course-list").prop("selectedIndex", 0);
    $("#branch-list").prop("selectedIndex", 0);
    $("#course-year").prop("selectedIndex", 0);
    $("#gender-list").prop("selectedIndex", 0);
    var selectedOption = $(this).find("option:selected");
    var selectedName = selectedOption.text();

    $("#institution_name").text(selectedName);
    $("#institution_id").text(selectedOption.val());
    if (selectedOption.val == "0") {
      $(".institute_card").hide();
    } else {
      $(".institute_card").show();
    }
  });
  $(".institute_card").hide();
  function get_streams(
    selectedAcademicYear,
    district_code,
    selectedTalukId,
    schemeId,
    subSchemeId,
    selectedownership,
    selecteduniversitytype,
    selecteduniversity,
    selectedInstituteId,
    department_id,
    sub_department_id
  ) {
    department_stream = {
      state_id: 0,
      district_id: district_code,
      academic_year_id: selectedAcademicYear,
      department: department_id,
      sub_department: sub_department_id,
      user_id: userId,
      taluk_id: selectedTalukId,
      scheme: 0,
      sub_scheme: 0,
      ownership_id: selectedownership,
      university_type_id: selecteduniversitytype,
      university_id: selecteduniversity,
      institution_id: selectedInstituteId,
    };
    $.ajax({
      type: "POST",
      headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
      url: department_api_url + "/department/department_stream",
      data: {
        data: encryptData(department_stream),
      },
      beforeSend: function () {
        $("#stream-id-filter").empty();
        $("#stream-id-filter").html('<option value = "0">All</option>');
      },
      success: function (response, textStatus, http) {
        var get_stream_data = decryptData(response.data);
        var stream_option = "";
        get_stream_data.forEach(function (select) {
          stream_option += `<option value='${select.streamid}'>${select.stream_name}</option>`;
        });
        $("#stream-id-filter").append(stream_option);
      },
      complete: function () {},
      error: function (errorThrown) {},
    });
  }

  $("#stream-id-filter").on("change", function () {
    var selectedAcademicYear = $("#academic-year-filter").val();
    var district_code = $("#district-name-filter").val();
    var selectedTalukId = $("#taluk-name-filter").val();
    var schemeId = $("#scheme-name-filter").val();
    var subSchemeId = $("#sub-scheme-name-filter").val();
    var selectedownership = $("#ownership-name-filter").val();
    var selecteduniversitytype = $("#university-type-name-filter").val();
    var selecteduniversity = $("#university-name-filter").val();
    var selectedInstituteId = $("#institute-name-filter").val(); // Get the selected institute ID
    var streamId = $(this).val(); // Get the selected stream ID
    var department_id = $("#department-filter").val();
    var sub_department_id = $("#sub-department-filter").val();
    // Call the function with all required parameters
    get_scholarship_coursetype(
      selectedAcademicYear,
      district_code,
      selectedTalukId,
      schemeId,
      subSchemeId,
      selectedownership,
      selecteduniversitytype,
      selecteduniversity,
      selectedInstituteId,
      streamId,
      department_id,
      sub_department_id
    );

    // Re-initialize the DataTable and reset filters
    // //initializeDataTableSchemeCount();
    resetDropdownFilters();
  });

  function resetDropdownFilters() {
    $("#course-type").prop("selectedIndex", 0);
    $("#course-category-list").prop("selectedIndex", 0);
    $("#course-list").prop("selectedIndex", 0);
    $("#branch-list").prop("selectedIndex", 0);
    $("#course-year").prop("selectedIndex", 0);
    $("#gender-list").prop("selectedIndex", 0);
  }

  function get_scholarship_coursetype(
    selectedAcademicYear,
    district_code,
    selectedTalukId,
    schemeId,
    subSchemeId,
    selectedownership,
    selecteduniversitytype,
    selecteduniversity,
    selectedInstituteId,
    streamId,
    department_id,
    sub_department_id
  ) {
    department_coursetype = {
      state_id: 0,
      district_id: district_code,
      academic_year_id: selectedAcademicYear,
      department: department_id,
      sub_department: sub_department_id,
      user_id: userId,
      taluk_id: selectedTalukId,
      scheme: 0,
      sub_scheme: 0,
      ownership_id: selectedownership,
      university_type_id: selecteduniversitytype,
      university_id: selecteduniversity,
      institution_id: selectedInstituteId,
      stream_id: streamId,
    };
    $.ajax({
      type: "POST",
      headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
      url: department_api_url + "/department/department_coursetype",
      data: {
        data: encryptData(department_coursetype),
      },
      beforeSend: function () {
        $("#course-type").empty();
        $("#course-type").html('<option value = "0">All</option>');
      },
      success: function (response, textStatus, http) {
        var get_stream_data = decryptData(response.data);
        var stream_option = "";
        get_stream_data.forEach(function (select) {
          stream_option += `<option value='${select.coursetypeid}'>${select.course_type}</option>`;
        });
        $("#course-type").append(stream_option);
      },
      complete: function () {},
      error: function (errorThrown) {},
    });
  }
  $("#course-type").on("change", function () {
    var selectedAcademicYear = $("#academic-year-filter").val();
    var district_code = $("#district-name-filter").val();
    var selectedTalukId = $("#taluk-name-filter").val();
    var schemeId = $("#scheme-name-filter").val();
    var subSchemeId = $("#sub-scheme-name-filter").val();
    var selectedownership = $("#ownership-name-filter").val();
    var selecteduniversitytype = $("#university-type-name-filter").val();
    var selecteduniversity = $("#university-name-filter").val();
    var selectedInstituteId = $("#institute-name-filter").val(); // Get the selected institute ID
    var streamId = $("#stream-id-filter").val(); // Get the selected stream ID
    var courseType = $(this).val();
    var department_id = $("#department-filter").val();
    var sub_department_id = $("#sub-department-filter").val();
    get_scholarship_course_category(
      selectedAcademicYear,
      district_code,
      selectedTalukId,
      schemeId,
      subSchemeId,
      selectedownership,
      selecteduniversitytype,
      selecteduniversity,
      selectedInstituteId,
      streamId,
      courseType,
      department_id,
      sub_department_id
    );
    // //initializeDataTableSchemeCount();

    $("#course-category-list").prop("selectedIndex", 0);
    $("#course-list").prop("selectedIndex", 0);
    $("#branch-list").prop("selectedIndex", 0);
    $("#course-year").prop("selectedIndex", 0);
    $("#gender-list").prop("selectedIndex", 0);
  });

  function get_scholarship_course_category(
    selectedAcademicYear,
    district_code,
    selectedTalukId,
    schemeId,
    subSchemeId,
    selectedownership,
    selecteduniversitytype,
    selecteduniversity,
    selectedInstituteId,
    streamId,
    courseType,
    department_id,
    sub_department_id
  ) {
    department_course_category = {
      state_id: 0,
      district_id: district_code,
      academic_year_id: selectedAcademicYear,
      department: department_id,
      sub_department: sub_department_id,
      user_id: userId,
      taluk_id: selectedTalukId,
      scheme: 0,
      sub_scheme: 0,
      ownership_id: selectedownership,
      university_type_id: selecteduniversitytype,
      university_id: selecteduniversity,
      institution_id: selectedInstituteId,
      stream_id: streamId,
      course_type_id: courseType,
    };
    $.ajax({
      type: "POST",
      headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
      url: department_api_url + "/department/department_course_category",
      data: {
        data: encryptData(department_course_category),
      },
      beforeSend: function () {
        $("#course-category-list").empty();
        $("#course-category-list").html('<option value = "0">All</option>');
      },
      success: function (response, textStatus, http) {
        var get_stream_data = decryptData(response.data);
        var stream_option = "";
        get_stream_data.forEach(function (select) {
          stream_option += `<option value='${select.coursecategoryid}'>${select.course_category_name}</option>`;
        });
        $("#course-category-list").append(stream_option);
      },
      complete: function () {},
      error: function (errorThrown) {},
    });
  }

  $("#course-category-list").on("change", function () {
    var selectedAcademicYear = $("#academic-year-filter").val();
    var district_code = $("#district-name-filter").val();
    var selectedTalukId = $("#taluk-name-filter").val();
    var schemeId = $("#scheme-name-filter").val();
    var subSchemeId = $("#sub-scheme-name-filter").val();
    var selectedownership = $("#ownership-name-filter").val();
    var selecteduniversitytype = $("#university-type-name-filter").val();
    var selecteduniversity = $("#university-name-filter").val();
    var selectedInstituteId = $("#institute-name-filter").val(); // Get the selected institute ID
    var streamId = $("#stream-id-filter").val(); // Get the selected stream ID
    var courseType = $("#course-type").val();
    var courseCategory = $(this).val();
    var department_id = $("#department-filter").val();
    var sub_department_id = $("#sub-department-filter").val();
    get_courses(
      selectedAcademicYear,
      district_code,
      selectedTalukId,
      schemeId,
      subSchemeId,
      selectedownership,
      selecteduniversitytype,
      selecteduniversity,
      selectedInstituteId,
      streamId,
      courseType,
      courseCategory,
      department_id,
      sub_department_id
    );
    // //initializeDataTableSchemeCount();
    $("#course-list").prop("selectedIndex", 0);
    $("#branch-list").prop("selectedIndex", 0);
    $("#course-year").prop("selectedIndex", 0);
    $("#gender-list").prop("selectedIndex", 0);
  });

  function get_courses(
    selectedAcademicYear,
    district_code,
    selectedTalukId,
    schemeId,
    subSchemeId,
    selectedownership,
    selecteduniversitytype,
    selecteduniversity,
    selectedInstituteId,
    streamId,
    courseType,
    courseCategory,
    department_id,
    sub_department_id
  ) {
    department_courses = {
      state_id: 0,
      district_id: district_code,
      academic_year_id: selectedAcademicYear,
      department: department_id,
      sub_department: sub_department_id,
      user_id: userId,
      taluk_id: selectedTalukId,
      scheme: 0,
      sub_scheme: 0,
      ownership_id: selectedownership,
      university_type_id: selecteduniversitytype,
      university_id: selecteduniversity,
      institution_id: selectedInstituteId,
      stream_id: streamId,
      course_type_id: courseType,
      course_category_id: courseCategory,
    };
    $.ajax({
      type: "POST",
      headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
      url: department_api_url + "/department/department_courses",
      data: {
        data: encryptData(department_courses),
      },
      beforeSend: function () {
        $("#course-list").empty();
        $("#course-list").html('<option value = "0">All</option>');
      },
      success: function (response, textStatus, http) {
        var get_stream_data = decryptData(response.data);
        var stream_option = "";
        get_stream_data.forEach(function (select) {
          stream_option += `<option value='${select.coursesid}'>${select.course_name}</option>`;
        });
        $("#course-list").append(stream_option);
      },
      complete: function () {},
      error: function (errorThrown) {},
    });
  }
  $(document).on("change", "#course-list", function () {
    // Use $(this).val() to get the selected value
    if ($(this).val() === "all") {
      $(".student_filters").css("display", "none");
    } else {
      $(".student_filters").css("display", "block");
    }
  });
  $("#course-list").on("change", function () {
    var selectedAcademicYear = $("#academic-year-filter").val();
    var district_code = $("#district-name-filter").val();
    var selectedTalukId = $("#taluk-name-filter").val();
    var schemeId = $("#scheme-name-filter").val();
    var subSchemeId = $("#sub-scheme-name-filter").val();
    var selectedownership = $("#ownership-name-filter").val();
    var selecteduniversitytype = $("#university-type-name-filter").val();
    var selecteduniversity = $("#university-name-filter").val();
    var selectedInstituteId = $("#institute-name-filter").val(); // Get the selected institute ID
    var streamId = $("#stream-id-filter").val(); // Get the selected stream ID
    var courseType = $("#course-type").val();
    var courseCategory = $("#course-category-list").val();
    var branch_id = $("#branch-list").val();
    var course_year = $("#course-year").val();
    var course = $(this).val();
    var department_id = $("#department-filter").val();
    var sub_department_id = $("#sub-department-filter").val();
    get_gender(
      selectedAcademicYear,
      district_code,
      selectedTalukId,
      schemeId,
      subSchemeId,
      selectedownership,
      selecteduniversitytype,
      selecteduniversity,
      selectedInstituteId,
      streamId,
      courseType,
      courseCategory,
      course,
      branch_id,
      course_year,
      department_id,
      sub_department_id
    );

    get_scholarship_course_branch(
      selectedAcademicYear,
      district_code,
      selectedTalukId,
      schemeId,
      subSchemeId,
      selectedownership,
      selecteduniversitytype,
      selecteduniversity,
      selectedInstituteId,
      streamId,
      courseType,
      courseCategory,
      course,
      department_id,
      sub_department_id
    );
    // initializeDataTable();

    $("#branch-list").prop("selectedIndex", 0);
    $("#course-year").prop("selectedIndex", 0);
    $("#gender-list").prop("selectedIndex", 0);
  });

  function get_scholarship_course_branch(
    selectedAcademicYear,
    district_code,
    selectedTalukId,
    schemeId,
    subSchemeId,
    selectedownership,
    selecteduniversitytype,
    selecteduniversity,
    selectedInstituteId,
    streamId,
    courseType,
    courseCategory,
    course,
    department_id,
    sub_department_id
  ) {
    get_dept_coursebranch = {
      ownership_id: selectedownership,
      university_type_id: selecteduniversitytype,
      university_id: selecteduniversity,
      institution_id: selectedInstituteId,
      stream_id: streamId,
      course_type_id: courseType,
      course_category_id: courseCategory,
      course_id: course,
      district_id: district_code,
      academic_year_id: selectedAcademicYear,
      department: department_id,
      sub_department: sub_department_id,
      user_id: userId,
      taluk_id: selectedTalukId,
      scheme: 0,
      sub_scheme: 0,
      state_id: 0,
    };
    $.ajax({
      type: "POST",
      headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
      url: department_api_url + "/department/get_dept_coursebranch",
      data: {
        data: encryptData(get_dept_coursebranch),
      },
      beforeSend: function () {
        $("#branch-list").empty();
        $("#branch-list").html('<option value = "0">All</option>');
      },
      success: function (response, textStatus, http) {
        var get_stream_data = decryptData(response.data);
        var stream_option = "";
        get_stream_data.forEach(function (select) {
          stream_option += `<option value='${select.coursebranchid}'>${select.course_branch_name}</option>`;
        });
        $("#branch-list").append(stream_option);
      },
      complete: function () {},
      error: function (errorThrown) {},
    });
  }
  var departmentCode = $("#department-filter").val();
  var sub_department_id = $("#sub-department-filter").val();
  $("#branch-list").on("change", function () {
    var selectedAcademicYear = $("#academic-year-filter").val();
    var district_code = $("#district-name-filter").val();
    var selectedTalukId = $("#taluk-name-filter").val();
    var schemeId = $("#scheme-name-filter").val();
    var subSchemeId = $("#sub-scheme-name-filter").val();
    var selectedownership = $("#ownership-name-filter").val();
    var selecteduniversitytype = $("#university-type-name-filter").val();
    var selecteduniversity = $("#university-name-filter").val();
    var selectedInstituteId = $("#institute-name-filter").val(); // Get the selected institute ID
    var streamId = $("#stream-id-filter").val(); // Get the selected stream ID
    var courseType = $("#course-type").val();
    var courseCategory = $("#course-category-list").val();
    var course_id = $("#course-list").val();
    var branch_id = $(this).val();
    var departmentCode = $("#department-filter").val();
    var sub_department_id = $("#sub-department-filter").val();
    get_course_year(
      selectedAcademicYear,
      district_code,
      selectedTalukId,
      schemeId,
      subSchemeId,
      selectedownership,
      selecteduniversitytype,
      selecteduniversity,
      selectedInstituteId,
      streamId,
      courseType,
      courseCategory,
      course_id,
      branch_id,
      departmentCode,
      sub_department_id
    );
    // initializeDataTable();
    $("#course-year").prop("selectedIndex", 0);
    $("#gender-list").prop("selectedIndex", 0);
  });

  function get_course_year(
    selectedAcademicYear,
    district_code,
    selectedTalukId,
    schemeId,
    subSchemeId,
    selectedownership,
    selecteduniversitytype,
    selecteduniversity,
    selectedInstituteId,
    streamId,
    courseType,
    courseCategory,
    course_id,
    branch_id,
    departmentCode,
    sub_department_id
  ) {get_dept_courseyear = {
    ownership_id: selectedownership,
    university_type_id: selecteduniversitytype,
    university_id: selecteduniversity,
    institution_id: selectedInstituteId,
    stream_id: streamId,
    course_type_id: courseType,
    course_category_id: courseCategory,
    course_id: course_id,
    course_branch_id: branch_id,
    district_id: district_code,
    academic_year_id: selectedAcademicYear,
    department: departmentCode,
    sub_department: sub_department_id,
    user_id: userId,
    taluk_id: selectedTalukId,
    scheme: 0,
    sub_scheme: 0,
    state_id: 0,
  }

    $.ajax({
      type: "POST",
      headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
      url: department_api_url + "/department/get_dept_courseyear",
      data: {
        data: encryptData(get_dept_courseyear),
      },
      beforeSend: function () {
        $("#course-year").empty();
        $("#course-year").html('<option value ="0">All</option>');
      },
      success: function (response, textStatus, http) {
        var responsedata1 =  decryptData(response.data);
        var option1 = "";
        responsedata1.forEach(function (select) {
          if (select.year_id != 0) {
            option1 += `<option value='${select.year_id}'>${select.year_value}</option>`;
          } else {
            $("#course-year").empty();
            $("#course-year").html('<option value ="0">All</option>');
          }
        });
        $("#course-year").append(option1);
      },
      error: function (errorThrown) {},
    });
  }

  $("#course-year").on("change", function () {
    var selectedAcademicYear = $("#academic-year-filter").val();
    var district_code = $("#district-name-filter").val();
    var selectedTalukId = $("#taluk-name-filter").val();
    var schemeId = $("#scheme-name-filter").val();
    var subSchemeId = $("#sub-scheme-name-filter").val();
    var selectedownership = $("#ownership-name-filter").val();
    var selecteduniversitytype = $("#university-type-name-filter").val();
    var selecteduniversity = $("#university-name-filter").val();
    var selectedInstituteId = $("#institute-name-filter").val(); // Get the selected institute ID
    var streamId = $("#stream-id-filter").val(); // Get the selected stream ID
    var courseType = $("#course-type").val();
    var courseCategory = $("#course-category-list").val();
    var course_id = $("#course-list").val();
    var branch_id = $("#branch-list").val();
    var course_year = $(this).val();
    //  get_gender(selectedAcademicYear, district_code, selectedTalukId, schemeId, subSchemeId, selectedownership, selecteduniversitytype, selecteduniversity, selectedInstituteId, streamId, courseType, courseCategory, course_id, branch_id, course_year);
    // $('#gender-list').prop('selectedIndex', 0);
    // initializeDataTable();

    $("#gender-list").prop("selectedIndex", 0);
  });

  function get_gender(
    selectedAcademicYear,
    district_code,
    selectedTalukId,
    schemeId,
    subSchemeId,
    selectedownership,
    selecteduniversitytype,
    selecteduniversity,
    selectedInstituteId,
    streamId,
    courseType,
    courseCategory,
    course_id,
    branch_id,
    course_year,
    departmentCode,
    sub_department_id
  ) {
    department_gender = {
      ownership_id: selectedownership,
      university_type_id: selecteduniversitytype,
      university_id: selecteduniversity,
      institution_id: selectedInstituteId,
      stream_id: streamId,
      course_type_id: courseType,
      course_category_id: courseCategory,
      course_id: course_id,
      course_branch_id: branch_id,
      course_year_id: course_year,
      district_id: district_code,
      academic_year_id: selectedAcademicYear,
      department: departmentCode,
      sub_department: sub_department_id,
      user_id: userId,
      taluk_id: selectedTalukId,
      scheme: 0,
      sub_scheme: 0,
      state_id: 0,
    }

    $.ajax({
      type: "POST",
      headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
      url: department_api_url + "/department/department_gender",
      data: {
        data: encryptData(department_gender),
      },
      beforeSend: function () {
        $("#gender-list").empty();
        $("#gender-list").html('<option value ="0">All</option>');
      },
      success: function (response, textStatus, http) {
        var responsedata1 = decryptData(response.data);
        var option1 = "";
        responsedata1.forEach(function (select) {
          option1 += `<option value='${select.genderid}'>${select.gender_name}</option>`;
        });
        $("#gender-list").append(option1);
      },
      error: function (errorThrown) {},
    });
  }

  $("#gender-list").on("change", function () {
    // initializeDataTable();
  });
});

// function updateDateTime() {
//     const now = new Date();
//     const options = {
//         timeZone: 'Asia/Kolkata', // Use Asia/Kolkata for Indian time zone
//         year: 'numeric',
//         month: '2-digit',
//         day: '2-digit',
//         hour: '2-digit',
//         minute: '2-digit',
//         second: '2-digit',
//         hour12: false // Use 24-hour format
//     };
//     const formattedDate = now.toLocaleString('en-IN', options).replace(',', ''); // Format: DD/MM/YYYY HH:mm:ss
//     document.getElementById('dateTimeLink').textContent = formattedDate;
// }

// setInterval(updateDateTime, 1000);
// updateDateTime();
// document.getElementById('logout-btn').addEventListener('click', function(event) {
//     event.preventDefault();
//     localStorage.clear();
//     sessionStorage.clear();
//     // Get the current URL
//     const currentUrl = window.location.href;
//     // Modify the URL to point to the new file
//     const newUrl = currentUrl.replace(/[^\/]*$/, 'login.html'); // Replace the last part of the URL
//     // Redirect to the new URL
//     window.location.href = newUrl;
// });

function get_total_students_count(
  district_id = 0,
  taluk_id = 0,
  ownership_id = 0,
  university_type_id = 0,
  institute_id = 0,
  university_id = 0
) {
  student_gettotalstudentcount_institutionwise = {
    district_id: district_id,
    taluk_id: taluk_id,
    ownership_id: ownership_id,
    university_type_id: university_id,
    university_id: university_type_id,
    institute_id: institute_id, 
  };

  $.ajax({
    type: "post",
    headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
    url:
      department_api_url +
      "/department/student_gettotalstudentcount_institutionwise ",
    data: {
     data: encryptData(student_gettotalstudentcount_institutionwise),
    },
    success: function (response, textStatus, http) {
      response.data = decryptData(response.data);
      var responsedata = response.data[0];
      var totalStudentCount = responsedata.totalstudentcount.toLocaleString();
      $("#studentcounts").text(totalStudentCount);
    },
    complete: function () {},
    error: function (errorThrown) {},
  });
}
$(".hide").hide();
$(document).on("change", "#education-filter", function () {
  if ($(this).val() == "1") {
    $(".school_section").show();
    $(".college_section").hide();
  } else if ($(this).val() == "2") {
    $(".school_section").hide();
    $(".college_section").show();
  } else {
    $(".school_section").hide();
    $(".college_section").hide();
  }
});
