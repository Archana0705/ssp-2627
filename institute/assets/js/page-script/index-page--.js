AOS.init();

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
function transButtonComponent() {
  return {
    changeLang() {
      var currentLang = AlpineI18n.locale;
      if (currentLang == "en") {
        AlpineI18n.locale = "ta";
        window.localStorage.setItem("language", "ta");
      } else {
        AlpineI18n.locale = "en";
        window.localStorage.setItem("language", "en");
      }
    },
  };
}
function updateDateTime() {
  const now = new Date();
  const options = {
    timeZone: "Asia/Kolkata", // Use Asia/Kolkata for Indian time zone
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Use 24-hour format
  };
  const formattedDate = now.toLocaleString("en-IN", options).replace(",", ""); // Format: DD/MM/YYYY HH:mm:ss
  document.getElementById("dateTimeLink").textContent = formattedDate;
}
setInterval(updateDateTime, 1000);
updateDateTime();

$(document).on("click", ".applied_application", function () {
  var pdfUrl = config.ssp_api_url + "/student/" + $(this).data("filepath");
  // var pdfUrl = config.ssp_api_url +'/student/public/AJAY_P/' + 526 + '.pdf';
  window.open(pdfUrl, "_blank");
});
var schemesData = {};
var student_api_url = config.student_api_url;
console.log(student_api_url);
var queryString = window.location.search;
var queryParams = queryString.split("?details");
var urlKey = queryParams[1];
var dashboardHref = `index.html?details${urlKey}`;
var appliedHref = `applied_schemes.html?details${urlKey}`;
var allHref = `all_schemes.html?details${urlKey}`;
let stud_Id;
let pdf_data;
let studentId = "";
let aadhaarNo = "";
let academic_year;
let institution_name;
document.addEventListener("DOMContentLoaded", function () {
  var dashboardLink = document.getElementById("dashboard-link");
  if (dashboardLink) {
    dashboardLink.href = dashboardHref; // Update the href for Dashboard
  }

  var appliedLink = document.getElementById("applied-schemes-link");
  if (appliedLink) {
    appliedLink.href = appliedHref; // Update the href for Applied Schemes
  }

  var allLink = document.getElementById("all-schemes-link");
  if (allLink) {
    allLink.href = allHref; // Update the href for All Schemes
  }
});
$(document).ready(function () {
  // Function to fetch customer details from the API
  student_id = "";
  $.ajax({
    url: student_api_url + "/get_student_detail",
    method: "POST",
    headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
    data: { student_details: urlKey },
    dataType: "json",
    success: function (response) {
      if (response.success == 1) {
        data = response.data[0];
        aadhaarNo = data.aadhaar_no;
        studentId = response.student_id;
        data.aadhaar_no = atob(data.aadhaar_no);
        data.aadhaar_no =
          data.aadhaar_no.slice(0, 2) + "******" + data.aadhaar_no.slice(8);
        stud_mobileno = data.mobile_no;
        academic_year = data.academic_year;
        institution_name = data.institution_name;
        $("#stud_name").text(data.student_name || "-");
        var studentIdentifier = data.umis_no || data.emis_no;
        if (studentIdentifier) {
          $("#stud_name").append(" / " + studentIdentifier);
        }
        $("#stud_year").text(data.academic_year || "-");
        $("#name").text(data.student_name || "-");
        $("#gender").text(data.gender || "-");
        $("#caste").text(data.caste_name || "-");
        $("#community").text(data.community_name || "-");
        $("#academic_year").text(data.academic_year || "-");
        $("#fees_paid").text(data.fees_paid || "-");
        $("#umis_id").text(data.umis_no || "-");
        $("#emis_id").text(data.emis_no || "-");
        $("#current_institute").text(data.institution_name || "-");
        $("#phone_no").text(data.mobile_no || "-");
        $("#aadhar_no").text(data.aadhaar_no || "-");
        $("#religion").text(data.religion || "-");
        $("#course").text(data.course_name || "-");
        $("#familyincome").text(data.income || "-");
        $("#course_branch").text(data.coursebranchname || "-");
        $("#courseyear").text(data.studingyear || "-");
        if (data.isfirstgraduate) {
          $("#firstgraduate").text("Yes");
        } else {
          $("#firstgraduate").text("No");
        }
        if (data.disability_status) {
          $("#disability").text("Yes");
        } else {
          $("#disability").text("No");
        }
        $(".umis").hide();
        $(".umis-add").addClass("col-lg-2");
        if (data.umis_no) {
          $(".umis").show();
          $(".umis-add").removeClass("col-lg-2");
        } else {
          $(".umis-add").addClass("col-lg-2");
        }
        if (data.is_hosteler) {
          $("#residentialstatus").text("Hosteller");
        } else {
          $("#residentialstatus").text("Day Scholar");
        }

        $("#stud_id").val(response.student_id);
        academic_year_data = data.academic_year;
        coursebranchname_data = data.coursebranchname;
        course_year_data = data.studingyear;
        aadhaar_no_data = data.aadhaar_no;
        student_id = $("#stud_id").val();

        if ($.fn.DataTable.isDataTable("#scheme_details")) {
          // Destroy the DataTable instance
          $("#scheme_details").DataTable().destroy();
        }

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

          columnDefs: [
            { className: "dt-center", targets: "_all" }, // Center align all columns
          ],

          ajax: {
            url: student_api_url + "/get_scheme_details",
            type: "POST",
            headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
            data: { student_id: urlKey },

            dataSrc: function (response) {
              schemesData = {};
              const tbody = $("#scheme_details_body");
              let row = "";
              response.data.forEach(function (select, index) {
                row += `<tr>
                              <td></td>
                               <td>${select.scheme_name}</td>
                                <td>${select.scholarship_amount}</td>
                                <td>${select.action}</td>`;
              });

              tbody.html(row); // Populate table body
              $.each(response.data, function (index, scheme) {
                schemesData[scheme.schemeid] = scheme; // Store scheme details by ID
              });
              return response.data;
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
              alert(message); // Show the appropriate error message
              console.error("Error details:", xhr); // Log error details to console
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
                // var schemeid = row.schemeid; // Ensure schemeid is available in row
                return data;
              },
            },
            {
              data: "subscheme_name",
              title: "Sub-Scheme Name",
              render: function (data, type, row) {
                if (data) {
                  return (
                    data +
                    '<input type="hidden" id="studentschemeid" value="' +
                    row.studentschemeid +
                    '">' +
                    '<input type="hidden" id="scheme_rule_id" value="' +
                    row.scheme_rule_id +
                    '">'
                  );
                } else {
                  return "-";
                }
              },
            },

            { data: "scholarship_amount" },

            {
              data: "is_applied",
              title: "Details",
              render: function (data, type, row) {
                var schemeid = row.schemeid;
                if (data === true) {
                  return (
                    '<div class="action-buttons">' +
                    '<a class="btn add-btn view-scheme info" href="#" data-scheme-id="' +
                    schemeid +
                    '">' +
                    '<i class="bi bi-eye"></i> View</a>' +
                    '<a class="btn btn-success btn-sm applied_application" href="#"  data-filepath="' +
                    row.filepath +
                    '">' +
                    '<i class="bi bi-file-earmark-check-fill"></i> Applied</a>' +
                    "</div>"
                  );
                } else {
                  return (
                    '<div class="action-buttons">' +
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
        });
      } else {
        Swal.fire({
          title: response.message,
          icon: "error",
          showConfirmButton: true,
        });
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching data:", error);
    },
    complete: function () {
      /////////// for apply

      $(".progress").hide();
      $(document).on("click", "#refresh", function () {
        $.ajax({
          url: config.ssp_api_url + "/get_sub_scheme_list",
          type: "POST",
          headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
          data: { umis_id: studentIdentifier },
          success: function (response) {
            if (response.status == "success") {
              location.reload();
            }

            // You can update other fields similarly based on the API response
          },
          error: function (xhr, status, error) {
            // Handle errors
            console.error("Failed to fetch sub-department details:", error);
            $("#scheme_info")
              .find("#form-subscheme_name")
              .text("Error fetching details");
          },
        });

        $(".progress").show();
        // Animate the progress bar to 100%
        let progressBar = $(".progress-bar");
        let percentage = 0;

        // Clear previous animation
        progressBar.stop();

        // Set initial text
        progressBar.text("Fetching Data...");

        // Animate the progress bar
        progressBar.animate(
          { width: "100%" },
          {
            duration: 5000,
            step: function (now) {
              percentage = Math.round(now);
              $(this).text("Fetching Data Please wait... " + percentage + "%");
              $(".progress").attr("aria-valuenow", percentage);
            },
            complete: function () {
              $(this).text("Completed 100%");
            },
          }
        );
      });

      $(document).on("click", ".apply_link", function (event) {
        event.preventDefault(); // Pre
        // Use .closest() instead of .closet()
        stud_Id = $(this).closest("tr").find("#studentschemeid").val();
        var studsub_Id = $(this).closest("tr").find("#scheme_rule_id").val();

        console.log("Student Scheme ID:", stud_Id);
        $("#opt_modal_studentschemeid").val(stud_Id);
        $("#opt_modal_studentsubschemeid").val(studsub_Id);

        $.ajax({
          url: student_api_url + "/get_schemedetailsbyid",
          method: "POST",
          headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
          data: { studentschemeid: stud_Id },
          dataType: "json",
          success: function (response) {
            data = response.data[0];
            subscheme_name = data.subscheme_name;
            umis_id = data["umis_no"];

            // new changes
            if (data.pass == true) {
              $.ajax({
                url: student_api_url + "/get_scheme_details",
                type: "POST",
                headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
                data: { student_id: urlKey },
                success: function (response) {
                  data_scheme = response.data;
                },
                complete: function () {
                  if (data.scheme_category == "Exclusive") {
                    $(".schemesList").text("");
                    $.each(data_scheme, function (index, scheme) {
                      if (scheme.is_applied === true) {
                        // Build the HTML list with the correct scheme data
                        let schemesList = `<li>${scheme.scheme_name} <i class="bi bi-info-circle padLft info-exclustion-1" data-scheme-id="${scheme.schemeid}"></i></li>`;

                        // Append the scheme list item to the modal
                        $(".schemesList").append(schemesList);

                        console.log(scheme.scheme_name); // Log the scheme name to the console
                      }
                    });
                    $("#exclusiveModalMsg").text(
                      "The Below Schemes are already applied: "
                    );
                    $("#exclusiveModalLabel").css("color", "red");
                    $("#exclusiveModalLabel").text(
                      "You are not eligible for this scheme"
                    );
                    $("#exclusiveModal").modal("show");
                  } else if (
                    data.scheme_category == "Exclusive With Exceptions"
                  ) {
                    $(".schemesList").text("");
                    exclusiveSchemes = JSON.parse(data.exclusiondetail);

                    var filteredSchemes = data_scheme.filter(function (scheme) {
                      return (
                        scheme.is_applied === true &&
                        !exclusiveSchemes.some(function (exception) {
                          return (
                            exception.ExclusiveSchemeId === scheme.schemeid
                          );
                        })
                      );
                    });

                    // Extract and display the scheme names
                    var schemeNames = filteredSchemes.map(function (scheme) {
                      let schemeItem = `<li>${scheme.scheme_name} <i class="bi bi-info-circle padLft info-exclustion-1" data-scheme-id="${scheme.schemeid}"></i></li>`;

                      // Append the list item to the HTML element with class .schemesList
                      $(".schemesList").append(schemeItem);
                    });

                    $("#exclusiveModalMsg").text(
                      "The Below Schemes are already applied: "
                    );
                    $("#exclusiveModalLabel").css("color", "red");
                    $("#exclusiveModalLabel").text(
                      "You are not eligible for this scheme"
                    );
                    $("#exclusiveModal").modal("show");
                  }
                },
              });
            } else {
              $.ajax({
                url: student_api_url + "/get_scheme_details",
                type: "POST",
                headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
                data: { student_id: urlKey },
                success: function (response) {
                  data_scheme = response.data;
                },
                complete: function () {
                  if (data.scheme_category == "Exclusive") {
                    $("#exclusiveModalfalse").modal("show");
                  } else if (data.exclusiondetail !== null) {
                    const jsonString = data.exclusiondetail;
                    $(".schemesList").text("");
                    // Parse the JSON string into a JavaScript object

                    exclusiveSchemes = JSON.parse(data.exclusiondetail);

                    var filteredSchemes = data_scheme.filter(function (scheme) {
                      return exclusiveSchemes.some(function (exception) {
                        return exception.ExclusiveSchemeId !== scheme.schemeid;
                      });
                    });

                    var schemeNames = filteredSchemes.map(function (scheme) {
                      let schemeItem = `<li>${scheme.scheme_name} <i class="bi bi-info-circle padLft info-exclustion" data-scheme-id="${scheme.schemeid}"></i></li>`;

                      // Append the list item to the HTML element with class .schemesList
                      $(".schemesList").append(schemeItem);
                    });

                    // const schemesList = schemes.map(scheme => `<li>${scheme.ExclusiveSchemeName} <i class="bi bi-info-circle padLft info-exclustion" data-scheme-id="${scheme.ExclusiveSchemeId}"></i></li>`).join('');
                    // // Inject the list items into the modal
                    // console.log(schemesList);
                    // $('.schemesList').html(schemesList);
                    // Show the modal
                    $("#confirmationModal").modal("show");
                    $(".proceedButton").show();
                  } else {
                    $("#apply_schemename").text(data.scheme_name ?? "-");
                    $("#apply_academic_year").text(academic_year_data ?? "-");
                    $("#apply_schemeamount").text(
                      data.scholarship_amount ?? "-"
                    );
                    $("#apply_studentName").text(data.student_name ?? "-");
                    $("#apply_emis_id").text(data.emis_no ?? "-");
                    $("#apply_umis_id").text(data.umis_no ?? "-");
                    $("#apply_nationality").text(data.nationality ?? "-");
                    $("#apply_religion").text(data.religion ?? "-");
                    $("#apply_community").text(data.community_name ?? "-");
                    $("#apply_caste").text(data.caste_name ?? "-");
                    $("#apply_stream").text(data.stream_name ?? "-");
                    $("#apply_course").text(data.course_name ?? "-");
                    $("#apply_moi").text(data.medium ?? "-");
                    $("#apply_mos").text(data.mode_of_study ?? "-");
                    $("#apply_doa").text(data.date_of_admission ?? "-");
                    $("#apply_rollnumber").text(data.course_name ?? "-");
                    $("#apply_phone").text(stud_mobileno ?? "-");
                    $("#apply_course_branch").text(coursebranchname_data ?? "");
                    $("#apply_year").text(course_year_data ?? "-");
                    $("#apply_sub_schemename").text(data.subschemename ?? "-");

                    if (data.is_hosteler) {
                      $("#apply_hosteller").text("YES");
                    } else {
                      $("#apply_hosteller").text("NO");
                    }

                    $("#apply_bank").text(data.bank_name ?? "-");
                    $("#apply_branch").text(data.branch_name ?? "-");
                    $("#apply_acno").text(data.account_no ?? "-");
                    $("#apply_ifsc").text(data.ifsc_code ?? "-");
                    $("#apply_aadhar").text(aadhaar_no_data ?? "-");
                    $("#apply_studentsts").text(data.academics_status ?? "-");
                    $("#applyModal").modal("show");

                    pdf_data = {
                      emisId: data.emis_no,
                      umisId: data.umis_no,
                      nationality: data.nationality,
                      religion: data.religion,
                      community: data.community_name,
                      caste: data.caste_name,
                      phone: stud_mobileno,
                      aadhar: aadhaar_no_data,
                      academicYear: academic_year_data,
                      course: data.course_name,
                      courseBranch: coursebranchname_data,
                      courseYear: course_year_data,
                      mediumOfInstruction: data.medium,
                      modeOfStudy: data.mode_of_study,
                      dateOfAdmission: data.date_of_admission,
                      hosteller: data.is_hosteler ? "Yes" : "No",
                      currentStatus: data.academics_status,
                      bankName: data.bank_name,

                      schemeName: data.scheme_name,
                      subSchemeName: data.subschemename,
                      schemeAmount: data.scholarship_amount,
                    };
                  }
                },
              });
            }
          },
          complete: function () {
            $(document).on("click", ".proceedButton", function (e) {
              e.preventDefault();

              // var ssid = $('#opt_modal_studentschemeid').val();
              // var subssid = $('#opt_modal_studentsubschemeid').val();
              // var ssid = $('#opt_modal_studentschemeid').val();
              // var subssid = $('#opt_modal_studentsubschemeid').val();

              $("#exclusiveModal").modal("hide");
              $("#exceptionModal").modal("hide");
              $("#exclusiveModalfalse").modal("hide");
              $("#confirmationModal").modal("hide");
              // alert(scheme_name);
              $("#apply_schemename").text(data.scheme_name ?? "-");
              $("#apply_academic_year").text(academic_year_data ?? "-");
              $("#apply_schemeamount").text(data.scholarship_amount ?? "-");
              $("#apply_studentName").text(data.student_name ?? "-");
              $("#apply_emis_id").text(data.emis_no ?? "-");
              $("#apply_umis_id").text(data.umis_no ?? "-");
              $("#apply_nationality").text(data.nationality ?? "-");
              $("#apply_religion").text(data.religion ?? "-");
              $("#apply_community").text(data.community_name ?? "-");
              $("#apply_caste").text(data.caste_name ?? "-");
              $("#apply_stream").text(data.stream_name ?? "-");
              $("#apply_course").text(data.course_name ?? "-");
              $("#apply_moi").text(data.medium ?? "-");
              $("#apply_mos").text(data.mode_of_study ?? "-");
              $("#apply_doa").text(data.date_of_admission ?? "-");
              $("#apply_rollnumber").text(data.course_name ?? "-");
              $("#apply_phone").text(stud_mobileno ?? "-");
              $("#apply_course_branch").text(coursebranchname_data ?? "");
              $("#apply_year").text(course_year_data ?? "-");
              $("#apply_sub_schemename").text(data.subschemename ?? "-");
              $("#apply_aadhar").text(aadhaar_no_data ?? "-");
              $("#apply_studentsts").text(data.academics_status ?? "-");
              if (data.is_hosteler) {
                $("#apply_hosteller").text("YES");
              } else {
                $("#apply_hosteller").text("NO");
              }

              $("#apply_bank").text(data.bank_name ?? "-");
              $("#apply_branch").text(data.branch_name ?? "-");
              $("#apply_acno").text(data.account_no ?? "-");
              $("#apply_ifsc").text(data.ifsc_code ?? "-");
              $("#applyModal").modal("show");

              pdf_data = {
                emisId: data.emis_no,
                umisId: data.umis_no,
                nationality: data.nationality,
                religion: data.religion,
                community: data.community_name,
                caste: data.caste_name,
                phone: stud_mobileno,
                aadhar: aadhaar_no_data,
                academicYear: academic_year_data,
                course: data.course_name,
                courseBranch: coursebranchname_data,
                courseYear: course_year_data,
                mediumOfInstruction: data.medium,
                modeOfStudy: data.mode_of_study,
                dateOfAdmission: data.date_of_admission,
                hosteller: data.is_hosteler ? "Yes" : "No",
                currentStatus: data.academics_status,
                bankName: data.bank_name,

                schemeName: data.scheme_name,
                subSchemeName: data.subschemename,
                schemeAmount: data.scholarship_amount,
              };
            });
            $(document).on("click", "#about_scheme", function (event) {
              event.preventDefault();
              var schemeId = data.schemeid;
              console.log(schemeId);
              var scheme = schemesData[schemeId];
              if (scheme) {
                // Populate the modal with scheme details
                $("#scheme_info")
                  .find("#form-scheme_name")
                  .text(scheme.scheme_name || "N/A");
                $("#scheme_info")
                  .find("#form-frequency")
                  .text(scheme.frequency || "N/A");
                $("#scheme_info")
                  .find("#form-department_name")
                  .text(scheme.department_name || "N/A");
                $("#scheme_info")
                  .find("#form-subdepartment_name")
                  .text(scheme.subdepartment_name || "N/A");
                $("#scheme_info")
                  .find("#form-scheme_code")
                  .text(scheme.scheme_code || "N/A");
                $("#scheme_info")
                  .find("#form-scheme_category")
                  .text(scheme.scheme_category || "N/A");
                $("#scheme_info")
                  .find("#form-freezed")
                  .text(scheme.freezed ? "Yes" : "No");

                // Make an API call to fetch additional details
                $.ajax({
                  url: config.ssp_api_url + "/get_sub_scheme_list",
                  type: "POST",
                  headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
                  data: { data: encryptData({ scheme_id: schemeId }) },
                  success: function (response) {
                    if (response.success == 1) {
                      response.data = decryptData(response.data);
                      // Update the modal with sub-department details
                      $("#scheme_info")
                        .find("#form-subscheme_name")
                        .text(response.data[0].subscheme_name || "N/A");
                      $("#scheme_info")
                        .find("#form-scholarship_fee_type")
                        .text(response.data[0].scholarship_fee_type || "N/A");
                      $("#scheme_info")
                        .find("#form-scholarhip_fee_amount")
                        .text(scheme.scholarship_amount || "N/A");
                      $("#scheme_info")
                        .find("#form-scholarhip_fee_percent")
                        .text(response.data[0].scholarhip_fee_percent || "N/A");
                      // You can update other fields similarly based on the API response
                      var sub_scheme_id = response.data[0].subscheme_id;
                      // Define a mapping of field names to their corresponding DOM element IDs
                      const fieldMapping = {
                        Education: "#form-education",
                        InstituteOwnership: "#form-institute_ownership",
                        Institute: "#form-institute",
                        University: "#form-university",
                        Stream: "#form-stream",
                        CourseType: "#form-course_type",
                        MediumofInstruction: "#form-MediumofInstruction",
                        CourseGrp: "#form-CourseGrp",
                        Course: "#form-Course",
                        CourseCategory: "#form-CourseCategory",
                        CourseBr: "#form-CourseBr",
                        CourseYear: "#form-CourseYear",
                        AccrediationStatus: "#form-AccrediationStatus",
                        Caste: "#form-Caste",
                        Gender: "#form-Gender",
                        Income: "#form-Income",
                        IncomeValue: "#form-IncomeValue",
                        Quota: "#form-Quota",
                        SplCtg: "#form-SplCtg",
                        ModeOfStudy: "#form-ModeOfStudy",
                        ResidentalStatus: "#form-ResidentalStatus",
                        MaintanenceGrp: "#form-MaintanenceGrp",
                        DisabilityStatus: "#form-DisabilityStatus",
                        Religion: "#form-Religion",
                        Community: "#form-Community",
                      };
                      // Show all sections initially
                      $(".mt-2.card").show();
                      // Make an API call to fetch additional details
                      $.ajax({
                        url: config.ssp_api_url + "/get_rule_condition",
                        type: "POST",
                        headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
                        data: {
                          data: encryptData({
                            scheme_id: schemeId,
                            sub_scheme_id: sub_scheme_id,
                          }),
                        },
                        success: function (ruleResponse) {
                          if (ruleResponse.status == 1) {
                            // Track if any parameters in the section are populated
                            let sectionHasValues = {
                              "Institute Parameters": false,
                              "Course Parameters": false,
                              "Student Eligibility Parameters": false,
                              "Maintenance Parameters": false,
                              "Socio Economic Parameters": false,
                            };

                            ruleResponse.fielddetails.forEach(function (field) {
                              if (fieldMapping[field.fieldname]) {
                                var $list = $(
                                  '<ul class="parameter-list"></ul>'
                                ); // Create a new unordered list

                                // Check if field.fieldvalues is an array and has elements
                                if (
                                  Array.isArray(field.fieldvalues) &&
                                  field.fieldvalues.length > 0
                                ) {
                                  field.fieldvalues.forEach(function (value) {
                                    if (
                                      value.value !== "All" &&
                                      value.text !== "All" &&
                                      !(
                                        value.text === "-1" &&
                                        value.value === "Not Applicable"
                                      )
                                    ) {
                                      var listItem = $(
                                        '<li class="parameter-items"></li>'
                                      ).text(value.value || value.text); // Create list items
                                      $list.append(listItem); // Append the list item to the list
                                    }
                                  });
                                }

                                var $fieldContainer = $("#scheme_info")
                                  .find(fieldMapping[field.fieldname])
                                  .closest(".mb-1"); // Get the parent container

                                // Check if the list is empty
                                if ($list.children().length === 0) {
                                  $fieldContainer.hide(); // Hide the entire container (label + field)
                                } else {
                                  $fieldContainer.show(); // Show the container if there are values
                                  $fieldContainer
                                    .find(".parameters")
                                    .html($list); // Update the content
                                  sectionHasValues[
                                    getSectionTitle(field.fieldname)
                                  ] = true; // Mark section as having values
                                }
                              }
                            });
                            // Hide sections if they don't have any values
                            for (const section in sectionHasValues) {
                              if (!sectionHasValues[section]) {
                                $(
                                  '.mt-2.card:has(h6:contains("' +
                                    section +
                                    '"))'
                                ).hide();
                              }
                            }
                          } else {
                            Object.keys(fieldMapping).forEach(function (
                              fieldname
                            ) {
                              var $fieldContainer = $("#scheme_info")
                                .find(fieldMapping[fieldname])
                                .closest(".mb-1");
                              $fieldContainer.hide(); // Hide all fields if there's an error
                            });
                          }
                        },
                      });
                    } else {
                      $("#scheme_info").find("#form-subscheme_name").text("-");
                      $("#scheme_info")
                        .find("#form-scholarship_fee_type")
                        .text("-");
                      $("#scheme_info")
                        .find("#form-scholarhip_fee_amount")
                        .text("-");
                      $("#scheme_info")
                        .find("#form-scholarhip_fee_percent")
                        .text("-");
                    }
                  },
                  error: function (xhr, status, error) {
                    // Handle errors
                    console.error(
                      "Failed to fetch sub-department details:",
                      error
                    );
                    $("#scheme_info")
                      .find("#form-subscheme_name")
                      .text("Error fetching details");
                  },
                });
                $("#scheme_info").modal("show"); // Show the modal
              } else {
                alert("Scheme details not found.");
              }
            });
            $(document).on("click", "#get_opt", () => {
              var subssid = $("#opt_modal_studentsubschemeid").val();
              var stud_id = $("#stud_id").val();

              console.log(data);
              scheme_id = data.schemeid;
              sub_scheme_id = subssid;
              var fields = {
                iid: subssid,
                iappliedby: stud_id,
              };
              $.ajax({
                url: config.ssp_api_url + "/student/otp",
                type: "POST",
                headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
                data: {
                  type: "send",
                  isubschemeid: studsub_Id,
                  ischemeid: scheme_id,
                  istudentid: stud_id,
                  umis_id: umis_id,
                },
                success: function (response) {
                  if (response[0]["success"] == 1) {
                    $("#applyModal").modal("hide");
                    mobileno = response[0]["data"]["mobileno"];
                    console.log(data);
                    Swal.fire({
                      title: "OTP Successfully send to " + mobileno,
                      icon: "success",
                      showConfirmButton: false,
                      timer: 3000,
                    }).then(() => {
                      let timeLeft = 30; // 3 minutes in seconds
                      const timerElement =
                        document.getElementById("resendTimer");
                      const requestAgainLink =
                        document.getElementById("requestAgain");

                      const countdown = setInterval(() => {
                        const minutes = Math.floor(timeLeft / 60);
                        const seconds = timeLeft % 60;

                        // Format the time in mm:ss
                        timerElement.textContent = `${minutes}:${
                          seconds < 10 ? "0" : ""
                        }${seconds}`;

                        // Decrease the time left
                        timeLeft--;

                        // Check if the countdown is finished
                        if (timeLeft < 0) {
                          clearInterval(countdown);
                          timerElement.style.display = "none"; // Hide timer
                          requestAgainLink.style.display = "inline"; // Show "Request again" link
                        }
                      }, 1000);
                      $("#opt_modal").modal("show");

                      const sanitizeDir = (dir) => dir.replace(/\s+/g, "_");

                      const student_name = sanitizeDir(data.student_name);
                      const pdfDir = sanitizeDir(academic_year);
                      const pdfDir1 = sanitizeDir(institution_name);
                      const pdfDir2 = sanitizeDir(data.scheme_name);
                      const pdfDir3 = sanitizeDir(data.subschemename);
                      const pdfFileName = `${student_name}.pdf`;
                      const pdfPath = `public/${pdfDir}/${pdfDir1}/${pdfDir2}/${pdfDir3}/${pdfFileName}`;
                      pdf_data = {
                        ...pdf_data,
                        pdfPath: pdfPath,
                        dir: pdfDir,
                        student_name: student_name,
                        studentName: data.student_name,
                        institutionName: institution_name,
                        schemeName: data.scheme_name,
                        subschemeName: data.subschemename,
                      };
                    });
                  }
                },
              });
            });
            // $(document).on('click', '#requestAgain', () => {
            //     Swal.fire({
            //         title: "OTP Resend successfully",
            //         icon: "success",
            //         showConfirmButton: false,
            //         timer: 3000,
            //     }).then(() => {
            //         let timeLeft = 180; // 3 minutes in seconds
            //         const timerElement = document.getElementById("resendTimer");
            //         const requestAgainLink = document.getElementById("requestAgain");
            //         timerElement.style.display = "inline"; // Hide timer
            //         requestAgainLink.style.display = "none";
            //         const countdown = setInterval(() => {
            //             const minutes = Math.floor(timeLeft / 60);
            //             const seconds = timeLeft % 60;

            //             // Format the time in mm:ss
            //             timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

            //             // Decrease the time left
            //             timeLeft--;

            //             // Check if the countdown is finished
            //             if (timeLeft < 0) {
            //                 clearInterval(countdown);
            //                 timerElement.style.display = "none"; // Hide timer
            //                 requestAgainLink.style.display = "inline"; // Show "Request again" link
            //             }
            //         }, 1000);
            //     })
            // })

            $(document).on("click", "#requestAgain", () => {
              $.ajax({
                url: config.ssp_api_url + "/student/otp",
                type: "POST",
                headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
                data: {
                  type: "resend",
                  isubschemeid: studsub_Id,
                  ischemeid: scheme_id,
                  istudentid: stud_id,
                  umis_id: umis_id,
                },
                success: function (response) {
                  Swal.fire({
                    title: "OTP Resend successfully",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 3000,
                  }).then(() => {
                    let timeLeft = 180; // 3 minutes in seconds
                    const timerElement = document.getElementById("resendTimer");
                    const requestAgainLink =
                      document.getElementById("requestAgain");
                    timerElement.style.display = "inline"; // Hide timer
                    requestAgainLink.style.display = "none";
                    const countdown = setInterval(() => {
                      const minutes = Math.floor(timeLeft / 60);
                      const seconds = timeLeft % 60;

                      // Format the time in mm:ss
                      timerElement.textContent = `${minutes}:${
                        seconds < 10 ? "0" : ""
                      }${seconds}`;

                      // Decrease the time left
                      timeLeft--;

                      // Check if the countdown is finished
                      if (timeLeft < 0) {
                        clearInterval(countdown);
                        timerElement.style.display = "none"; // Hide timer
                        requestAgainLink.style.display = "inline"; // Show "Request again" link
                      }
                    }, 1000);
                  });
                },
              });
            });

            $(document).ready(function () {
              const inputs = $(".otp-field > input");
              const button = $(".verify");

              // Focus on the first input when the page loads
              $(inputs[0]).focus();
              button.attr("disabled", "disabled");

              // Handle paste event for the first input
              $(inputs[0]).on("paste", function (event) {
                event.preventDefault();

                const pastedValue = (
                  event.originalEvent.clipboardData || window.clipboardData
                ).getData("text");
                const otpLength = inputs.length;

                for (let i = 0; i < otpLength; i++) {
                  if (i < pastedValue.length) {
                    $(inputs[i]).val(pastedValue[i]);
                    $(inputs[i]).removeAttr("disabled");
                    $(inputs[i]).focus();
                  } else {
                    $(inputs[i]).val(""); // Clear remaining inputs
                    $(inputs[i]).focus();
                  }
                }
              });

              // Handle keyup event for each input
              inputs.each(function (index1) {
                $(this).on("keyup", function (e) {
                  const currentInput = $(this);
                  const nextInput = currentInput.next("input");
                  const prevInput = currentInput.prev("input");

                  // Restrict input to one character
                  if (currentInput.val().length > 1) {
                    currentInput.val("");
                    return;
                  }

                  // Enable the next input and move focus if current input has value
                  if (
                    nextInput.length &&
                    nextInput.is(":disabled") &&
                    currentInput.val() !== ""
                  ) {
                    nextInput.removeAttr("disabled").focus();
                  }

                  // Handle backspace: Disable inputs and clear values if needed
                  if (e.key === "Backspace") {
                    inputs.each(function (index2) {
                      if (index1 <= index2 && prevInput.length) {
                        $(this).attr("disabled", true).val("");
                        prevInput.focus();
                      }
                    });
                  }

                  // Disable the button by default
                  button.removeClass("active");
                  button.attr("disabled", "disabled");

                  // If all inputs are filled, activate the button
                  const inputsNo = inputs.length;
                  if (
                    !$(inputs[inputsNo - 1]).is(":disabled") &&
                    $(inputs[inputsNo - 1]).val() !== ""
                  ) {
                    button.addClass("active otp_verify");
                    button.removeAttr("disabled");

                    return;
                  }
                });
              });
            });

            $(document).on("click", ".otp_verify", () => {
              const inputs = $(".otp-field > input");
              otpValue = "";
              inputs.each(function () {
                otpValue += $(this).val(); // Concatenate each input's value
              });
              $("#otp_val").val(otpValue);
              var subssid = $("#opt_modal_studentschemeid").val();
              var stud_id = $("#stud_id").val();
              scheme_id = data.schemeid;
              sub_scheme_id = subssid;
              var fields = {
                iid: subssid,
                iappliedby: stud_id,
              };
              $.ajax({
                url: config.ssp_api_url + "/student/otp",
                type: "POST",
                headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
                data: {
                  type: "check",
                  isubschemeid: studsub_Id,
                  ischemeid: scheme_id,
                  istudentid: stud_id,
                  iinterval: 3,
                  iotp: otpValue,
                  field: fields,
                  pdf_data: pdf_data,
                },
                success: function (response) {
                  console.log(response);
                  $("#opt_modal").modal("hide");
                  if (response.success == "1") {
                    Swal.fire({
                      title: "Scheme Successfully Applied",
                      icon: "success",
                      showConfirmButton: false,
                      timer: 3000,
                    }).then(() => {
                      location.reload();
                    });
                  } else {
                    Swal.fire({
                      title: "Failed",
                      icon: "error",
                      showConfirmButton: false,
                      timer: 3000,
                    });
                  }
                },
                error: function (xhr, status, error) {
                  Swal.fire({
                    title: "Invalid OTP",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 3000,
                  }).then(() => {
                    $(".otp-field input").val(""); // Clear all input fields
                  });
                },
              });
            });
          },
        });
      });
    },
  });

  $("#button-csv").on("click", function () {
    $("#scheme_details").DataTable().button(".buttons-csv").trigger();
  });
  $(document).on("click", ".info", function (event) {
    event.preventDefault();
    console.log(schemesData);
    studscheme_Id = $(this).closest("tr").find("#studentschemeid").val();
    var schemeId = $(this).data("scheme-id");
    var scheme = schemesData[schemeId];

    if (scheme) {
      // Populate the modal with scheme details
      $("#scheme_info")
        .find("#form-scheme_name")
        .text(scheme.scheme_name || "N/A");
      $("#scheme_info")
        .find("#form-frequency")
        .text(scheme.frequency || "N/A");
      $("#scheme_info")
        .find("#form-department_name")
        .text(scheme.department_name || "N/A");
      $("#scheme_info")
        .find("#form-subdepartment_name")
        .text(scheme.subdepartment_name || "N/A");
      $("#scheme_info")
        .find("#form-scheme_code")
        .text(scheme.scheme_code || "N/A");
      $("#scheme_info")
        .find("#form-scheme_category")
        .text(scheme.scheme_category || "N/A");
      $("#scheme_info")
        .find("#form-freezed")
        .text(scheme.freezed ? "Yes" : "No");

      // Make an API call to fetch additional details
      $.ajax({
        url: config.ssp_api_url + "/get_sub_scheme_list",
        type: "POST",
        headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
        data: { scheme_id: schemeId },
        success: function (response) {
          subscheme_details = response;
          if (response.success == 1) {
            // Update the modal with sub-department details
            $("#scheme_info")
              .find("#form-subscheme_name")
              .text(response.data[0].subscheme_name || "N/A");
            $("#scheme_info")
              .find("#form-scholarship_fee_type")
              .text(response.data[0].scholarship_fee_type || "N/A");
            $("#scheme_info")
              .find("#form-scholarhip_fee_amount")
              .text(scheme.scholarship_amount || "N/A");
            $("#scheme_info")
              .find("#form-scholarhip_fee_percent")
              .text(response.data[0].scholarhip_fee_percent || "N/A");
            // You can update other fields similarly based on the API response
            var sub_scheme_id = response.data[0].subscheme_id;
            // Define a mapping of field names to their corresponding DOM element IDs
            const fieldMapping = {
              Education: "#form-education",
              InstituteOwnership: "#form-institute_ownership",
              Institute: "#form-institute",
              University: "#form-university",
              Stream: "#form-stream",
              CourseType: "#form-course_type",
              MediumofInstruction: "#form-MediumofInstruction",
              CourseGrp: "#form-CourseGrp",
              Course: "#form-Course",
              CourseCategory: "#form-CourseCategory",
              CourseBr: "#form-CourseBr",
              CourseYear: "#form-CourseYear",
              AccrediationStatus: "#form-AccrediationStatus",
              Caste: "#form-Caste",
              Gender: "#form-Gender",
              Income: "#form-Income",
              IncomeValue: "#form-IncomeValue",
              Quota: "#form-Quota",
              SplCtg: "#form-SplCtg",
              ModeOfStudy: "#form-ModeOfStudy",
              ResidentalStatus: "#form-ResidentalStatus",
              MaintanenceGrp: "#form-MaintanenceGrp",
              DisabilityStatus: "#form-DisabilityStatus",
              Religion: "#form-Religion",
              Community: "#form-Community",
            };
            // Show all sections initially
            $(".mt-2.card").show();
            // Make an API call to fetch additional details
            $.ajax({
              url: config.ssp_api_url + "/get_rule_condition",
              type: "POST",
              headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
              data: { scheme_id: schemeId, sub_scheme_id: sub_scheme_id },
              success: function (ruleResponse) {
                if (ruleResponse.status == 1) {
                  // Track if any parameters in the section are populated
                  let sectionHasValues = {
                    "Institute Parameters": false,
                    "Course Parameters": false,
                    "Student Eligibility Parameters": false,
                    "Maintenance Parameters": false,
                    "Socio Economic Parameters": false,
                  };
                  ruleResponse.fielddetails?.forEach(function (field) {
                    if (fieldMapping[field.fieldname]) {
                      var $list = $('<ul class="parameter-list"></ul>'); // Create a new unordered list

                      // Check if field.fieldvalues is an array and has elements
                      if (
                        Array.isArray(field.fieldvalues) &&
                        field.fieldvalues.length > 0
                      ) {
                        field.fieldvalues.forEach(function (value) {
                          if (
                            value.value !== "All" &&
                            value.text !== "All" &&
                            !(
                              value.text === "-1" &&
                              value.value === "Not Applicable"
                            )
                          ) {
                            var listItem = $(
                              '<li class="parameter-items"></li>'
                            ).text(value.value || value.text); // Create list items
                            $list.append(listItem); // Append the list item to the list
                          }
                        });
                      }

                      var $fieldContainer = $("#scheme_info")
                        .find(fieldMapping[field.fieldname])
                        .closest(".mb-1"); // Get the parent container

                      // Check if the list is empty
                      if ($list.children().length === 0) {
                        $fieldContainer.hide(); // Hide the entire container (label + field)
                      } else {
                        $fieldContainer.show(); // Show the container if there are values
                        $fieldContainer.find(".parameters").html($list); // Update the content
                        sectionHasValues[
                          getSectionTitle(field.fieldname)
                        ] = true; // Mark section as having values
                      }
                    }
                  });

                  // Hide sections if they don't have any values
                  for (const section in sectionHasValues) {
                    if (!sectionHasValues[section]) {
                      $(
                        '.mt-2.card:has(h6:contains("' + section + '"))'
                      ).hide();
                    }
                  }
                } else {
                  Object.keys(fieldMapping).forEach(function (fieldname) {
                    var $fieldContainer = $("#scheme_info")
                      .find(fieldMapping[fieldname])
                      .closest(".mb-1");
                    $fieldContainer.hide(); // Hide all fields if there's an error
                  });
                }
              },
            });
          } else {
            $("#scheme_info").find("#form-subscheme_name").text("-");
            $("#scheme_info").find("#form-scholarship_fee_type").text("-");
            $("#scheme_info").find("#form-scholarhip_fee_amount").text("-");
            $("#scheme_info").find("#form-scholarhip_fee_percent").text("-");
          }
        },
        complete: function () {
          data_scheme = subscheme_details;
          console.log(data_scheme);
          $.ajax({
            url: student_api_url + "/get_schemedetailsbyid",
            method: "POST",
            headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
            data: { studentschemeid: studscheme_Id },
            dataType: "json",
            success: function (response) {
              data = response.data[0];
              console.log(data);
              subscheme_name = data.subscheme_name;
              umis_id = data["umis_no"];

              // new changes
              if (data.pass == true) {
                if (data.scheme_category == "Exclusive") {
                  $("#form-institute_ownership").text("");
                  $.each(data_scheme, function (index, scheme) {
                    if (scheme.is_applied === true) {
                      // Build the HTML list with the correct scheme data
                      let schemesList = `<li>${scheme.scheme_name} <i class="bi bi-info-circle padLft info-exclustion-1" data-scheme-id="${scheme.schemeid}"></i></li>`;

                      // Append the scheme list item to the modal
                      $("#form-institute_ownership").append(schemesList);

                      console.log("fff", scheme.scheme_name); // Log the scheme name to the console
                    }
                  });
                } else if (
                  data.scheme_category == "Exclusive With Exceptions"
                ) {
                  $("#form-institute_ownership").text("");
                  exclusiveSchemes = JSON.parse(data.exclusiondetail);

                  var filteredSchemes = data_scheme.filter(function (scheme) {
                    return (
                      scheme.is_applied === true &&
                      !exclusiveSchemes.some(function (exception) {
                        return exception.ExclusiveSchemeId === scheme.schemeid;
                      })
                    );
                  });

                  // Extract and display the scheme names
                  var schemeNames = filteredSchemes.map(function (scheme) {
                    let schemeItem = `<li>${scheme.scheme_name} <i class="bi bi-info-circle padLft info-exclustion-1" data-scheme-id="${scheme.schemeid}"></i></li>`;

                    // Append the list item to the HTML element with class #form-institute_ownership
                    $("#form-institute_ownership").append(schemeItem);
                  });
                }
              } else {
                $.ajax({
                  url: student_api_url + "/get_scheme_details",
                  type: "POST",
                  headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
                  data: { student_id: urlKey },
                  success: function (response) {
                    data_scheme = response.data;
                  },
                  complete: function () {
                    if (data.scheme_category == "Exclusive") {
                      $("#form-scheme-exceptions").text("");
                      // $('#exclusiveModalfalse').modal('show');
                      $("#form-scheme-exceptions").text(
                        "If you apply for this scheme, you will not be eligible for any other schemes."
                      );
                    } else if (data.exclusiondetail !== null) {
                      const jsonString = data.exclusiondetail;
                      $("#form-scheme-exceptions").text("");
                      // Parse the JSON string into a JavaScript object

                      exclusiveSchemes = JSON.parse(data.exclusiondetail);

                      var filteredSchemes = data_scheme.filter(function (
                        scheme
                      ) {
                        return exclusiveSchemes.some(function (exception) {
                          return (
                            exception.ExclusiveSchemeId !== scheme.schemeid
                          );
                        });
                      });

                      var schemeNames = filteredSchemes.map(function (scheme) {
                        let schemeItem = `<li>${scheme.scheme_name} <i class="bi bi-info-circle padLft info-exclustion" data-scheme-id="${scheme.schemeid}"></i></li>`;

                        // Append the list item to the HTML element with class .schemesList
                        $("#form-scheme-exceptions").append(schemeItem);
                      });
                    } else {
                      $("#form-scheme-exceptions").text("");
                      $("#form-scheme-exceptions").text(
                        "In this schemes will not affected any other schemes"
                      );
                    }
                  },
                });
              }
            },
            complete: function () {
              $(document).on("click", ".proceedButton", function (e) {
                e.preventDefault();

                // var ssid = $('#opt_modal_studentschemeid').val();
                // var subssid = $('#opt_modal_studentsubschemeid').val();
                // var ssid = $('#opt_modal_studentschemeid').val();
                // var subssid = $('#opt_modal_studentsubschemeid').val();
                $("#exclusiveModal").modal("hide");
                $("#exceptionModal").modal("hide");
                $("#confirmationModal").modal("hide");
                // alert(scheme_name);
                $("#apply_schemename").text(data.scheme_name ?? "-");
                $("#apply_academic_year").text(academic_year_data ?? "-");
                $("#apply_schemeamount").text(data.scholarship_amount ?? "-");
                $("#apply_studentName").text(data.student_name ?? "-");
                $("#apply_emis_id").text(data.emis_no ?? "-");
                $("#apply_umis_id").text(data.umis_no ?? "-");
                $("#apply_nationality").text(data.nationality ?? "-");
                $("#apply_religion").text(data.religion ?? "-");
                $("#apply_community").text(data.community_name ?? "-");
                $("#apply_caste").text(data.caste_name ?? "-");
                $("#apply_stream").text(data.stream_name ?? "-");
                $("#apply_course").text(data.course_name ?? "-");
                $("#apply_moi").text(data.medium ?? "-");
                $("#apply_mos").text(data.mode_of_study ?? "-");
                $("#apply_doa").text(data.date_of_admission ?? "-");
                $("#apply_rollnumber").text(data.course_name ?? "-");
                $("#apply_phone").text(stud_mobileno ?? "-");
                $("#apply_course_branch").text(coursebranchname_data ?? "");
                $("#apply_year").text(course_year_data ?? "-");
                $("#apply_sub_schemename").text(data.subschemename ?? "-");
                $("#apply_aadhar").text(aadhaar_no_data ?? "-");

                if (data.is_hosteler) {
                  $("#apply_hosteller").text("YES");
                } else {
                  $("#apply_hosteller").text("NO");
                }

                $("#apply_bank").text(data.bank_name ?? "-");
                $("#apply_branch").text(data.branch_name ?? "-");
                $("#apply_acno").text(data.account_no ?? "-");
                $("#apply_ifsc").text(data.ifsc_code ?? "-");
                $("#applyModal").modal("show");

                pdf_data = {
                  emisId: data.emis_no,
                  umisId: data.umis_no,
                  nationality: data.nationality,
                  religion: data.religion,
                  community: data.community_name,
                  caste: data.caste_name,
                  phone: stud_mobileno,
                  aadhar: aadhaar_no_data,
                  academicYear: academic_year_data,
                  course: data.course_name,
                  courseBranch: coursebranchname_data,
                  courseYear: course_year_data,
                  mediumOfInstruction: data.medium,
                  modeOfStudy: data.mode_of_study,
                  dateOfAdmission: data.date_of_admission,
                  hosteller: data.is_hosteler ? "Yes" : "No",
                  currentStatus: data.academics_status,
                  bankName: data.bank_name,

                  schemeName: data.scheme_name,
                  subSchemeName: data.subschemename,
                  schemeAmount: data.scholarship_amount,
                };
              });
              $(document).on("click", "#about_scheme", function (event) {
                event.preventDefault();
                var schemeId = data.schemeid;
                console.log(schemeId);
                var scheme = schemesData[schemeId];
                if (scheme) {
                  // Populate the modal with scheme details
                  $("#scheme_info")
                    .find("#form-scheme_name")
                    .text(scheme.scheme_name || "N/A");
                  $("#scheme_info")
                    .find("#form-frequency")
                    .text(scheme.frequency || "N/A");
                  $("#scheme_info")
                    .find("#form-department_name")
                    .text(scheme.department_name || "N/A");
                  $("#scheme_info")
                    .find("#form-subdepartment_name")
                    .text(scheme.subdepartment_name || "N/A");
                  $("#scheme_info")
                    .find("#form-scheme_code")
                    .text(scheme.scheme_code || "N/A");
                  $("#scheme_info")
                    .find("#form-scheme_category")
                    .text(scheme.scheme_category || "N/A");
                  $("#scheme_info")
                    .find("#form-freezed")
                    .text(scheme.freezed ? "Yes" : "No");

                  // Make an API call to fetch additional details
                  $.ajax({
                    url: config.ssp_api_url + "/get_sub_scheme_list",
                    type: "POST",
                    headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
                    data: { scheme_id: schemeId },
                    success: function (response) {
                      if (response.success == 1) {
                        // Update the modal with sub-department details
                        $("#scheme_info")
                          .find("#form-subscheme_name")
                          .text(response.data[0].subscheme_name || "N/A");
                        $("#scheme_info")
                          .find("#form-scholarship_fee_type")
                          .text(response.data[0].scholarship_fee_type || "N/A");
                        $("#scheme_info")
                          .find("#form-scholarhip_fee_amount")
                          .text(scheme.scholarship_amount || "N/A");
                        $("#scheme_info")
                          .find("#form-scholarhip_fee_percent")
                          .text(
                            response.data[0].scholarhip_fee_percent || "N/A"
                          );
                        // You can update other fields similarly based on the API response
                        var sub_scheme_id = response.data[0].subscheme_id;
                        // Define a mapping of field names to their corresponding DOM element IDs
                        const fieldMapping = {
                          Education: "#form-education",
                          InstituteOwnership: "#form-institute_ownership",
                          Institute: "#form-institute",
                          University: "#form-university",
                          Stream: "#form-stream",
                          CourseType: "#form-course_type",
                          MediumofInstruction: "#form-MediumofInstruction",
                          CourseGrp: "#form-CourseGrp",
                          Course: "#form-Course",
                          CourseCategory: "#form-CourseCategory",
                          CourseBr: "#form-CourseBr",
                          CourseYear: "#form-CourseYear",
                          AccrediationStatus: "#form-AccrediationStatus",
                          Caste: "#form-Caste",
                          Gender: "#form-Gender",
                          Income: "#form-Income",
                          IncomeValue: "#form-IncomeValue",
                          Quota: "#form-Quota",
                          SplCtg: "#form-SplCtg",
                          ModeOfStudy: "#form-ModeOfStudy",
                          ResidentalStatus: "#form-ResidentalStatus",
                          MaintanenceGrp: "#form-MaintanenceGrp",
                          DisabilityStatus: "#form-DisabilityStatus",
                          Religion: "#form-Religion",
                          Community: "#form-Community",
                        };
                        // Show all sections initially
                        $(".mt-2.card").show();
                        // Make an API call to fetch additional details
                        $.ajax({
                          url: config.ssp_api_url + "/get_rule_condition",
                          type: "POST",
                          headers: {
                            "X-APP-KEY": "te$t",
                            "X-APP-NAME": "te$t",
                          },
                          data: {
                            scheme_id: schemeId,
                            sub_scheme_id: sub_scheme_id,
                          },
                          success: function (ruleResponse) {
                            if (ruleResponse.status == 1) {
                              // Track if any parameters in the section are populated
                              let sectionHasValues = {
                                "Institute Parameters": false,
                                "Course Parameters": false,
                                "Student Eligibility Parameters": false,
                                "Maintenance Parameters": false,
                                "Socio Economic Parameters": false,
                              };

                              ruleResponse.fielddetails.forEach(function (
                                field
                              ) {
                                if (fieldMapping[field.fieldname]) {
                                  var $list = $(
                                    '<ul class="parameter-list"></ul>'
                                  ); // Create a new unordered list

                                  // Check if field.fieldvalues is an array and has elements
                                  if (
                                    Array.isArray(field.fieldvalues) &&
                                    field.fieldvalues.length > 0
                                  ) {
                                    field.fieldvalues.forEach(function (value) {
                                      if (
                                        value.value !== "All" &&
                                        value.text !== "All" &&
                                        !(
                                          value.text === "-1" &&
                                          value.value === "Not Applicable"
                                        )
                                      ) {
                                        var listItem = $(
                                          '<li class="parameter-items"></li>'
                                        ).text(value.value || value.text); // Create list items
                                        $list.append(listItem); // Append the list item to the list
                                      }
                                    });
                                  }

                                  var $fieldContainer = $("#scheme_info")
                                    .find(fieldMapping[field.fieldname])
                                    .closest(".mb-1"); // Get the parent container

                                  // Check if the list is empty
                                  if ($list.children().length === 0) {
                                    $fieldContainer.hide(); // Hide the entire container (label + field)
                                  } else {
                                    $fieldContainer.show(); // Show the container if there are values
                                    $fieldContainer
                                      .find(".parameters")
                                      .html($list); // Update the content
                                    sectionHasValues[
                                      getSectionTitle(field.fieldname)
                                    ] = true; // Mark section as having values
                                  }
                                }
                              });
                              // Hide sections if they don't have any values
                              for (const section in sectionHasValues) {
                                if (!sectionHasValues[section]) {
                                  $(
                                    '.mt-2.card:has(h6:contains("' +
                                      section +
                                      '"))'
                                  ).hide();
                                }
                              }
                            } else {
                              Object.keys(fieldMapping).forEach(function (
                                fieldname
                              ) {
                                var $fieldContainer = $("#scheme_info")
                                  .find(fieldMapping[fieldname])
                                  .closest(".mb-1");
                                $fieldContainer.hide(); // Hide all fields if there's an error
                              });
                            }
                          },
                        });
                      } else {
                        $("#scheme_info")
                          .find("#form-subscheme_name")
                          .text("-");
                        $("#scheme_info")
                          .find("#form-scholarship_fee_type")
                          .text("-");
                        $("#scheme_info")
                          .find("#form-scholarhip_fee_amount")
                          .text("-");
                        $("#scheme_info")
                          .find("#form-scholarhip_fee_percent")
                          .text("-");
                      }
                    },
                    error: function (xhr, status, error) {
                      // Handle errors
                      console.error(
                        "Failed to fetch sub-department details:",
                        error
                      );
                      $("#scheme_info")
                        .find("#form-subscheme_name")
                        .text("Error fetching details");
                    },
                  });
                  $("#scheme_info").modal("show"); // Show the modal
                } else {
                  alert("Scheme details not found.");
                }
              });
            },
          });
        },
        error: function (xhr, status, error) {
          // Handle errors
          console.error("Failed to fetch sub-department details:", error);
          $("#scheme_info")
            .find("#form-subscheme_name")
            .text("Error fetching details");
        },
      });

      $("#scheme_info").modal("show"); // Show the modal
    } else {
      alert("Scheme details not found.");
    }
  });
  $(document).on("click", ".info-exclustion", function (event) {
    event.preventDefault();
    $("#exclusiveModal").modal("hide");
    $("#confirmationModal").modal("hide");
    $(".scheme_info-close").addClass("exclution-close");
    $(".scheme_info-close").addClass("");
    event.preventDefault();
    var schemeId = $(this).data("scheme-id");
    var scheme = schemesData[schemeId];
    console.log(schemeId);
    console.log(schemesData);

    console.log(schemesData[388]);

    if (scheme) {
      // Populate the modal with scheme details
      $("#scheme_info")
        .find("#form-scheme_name")
        .text(scheme.scheme_name || "N/A");
      $("#scheme_info")
        .find("#form-frequency")
        .text(scheme.frequency || "N/A");
      $("#scheme_info")
        .find("#form-department_name")
        .text(scheme.department_name || "N/A");
      $("#scheme_info")
        .find("#form-subdepartment_name")
        .text(scheme.subdepartment_name || "N/A");
      $("#scheme_info")
        .find("#form-scheme_code")
        .text(scheme.scheme_code || "N/A");
      $("#scheme_info")
        .find("#form-scheme_category")
        .text(scheme.scheme_category || "N/A");
      $("#scheme_info")
        .find("#form-freezed")
        .text(scheme.freezed ? "Yes" : "No");

      // Make an API call to fetch additional details
      $.ajax({
        url: config.ssp_api_url + "/get_sub_scheme_list",
        type: "POST",
        headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
        data: { scheme_id: schemeId },
        success: function (response) {
          if (response.success == 1) {
            // Update the modal with sub-department details
            $("#scheme_info")
              .find("#form-subscheme_name")
              .text(response.data[0].subscheme_name || "N/A");
            $("#scheme_info")
              .find("#form-scholarship_fee_type")
              .text(response.data[0].scholarship_fee_type || "N/A");
            $("#scheme_info")
              .find("#form-scholarhip_fee_amount")
              .text(scheme.scholarship_amount || "N/A");
            $("#scheme_info")
              .find("#form-scholarhip_fee_percent")
              .text(response.data[0].scholarhip_fee_percent || "N/A");
            // You can update other fields similarly based on the API response
            var sub_scheme_id = response.data[0].subscheme_id;
            // Define a mapping of field names to their corresponding DOM element IDs
            const fieldMapping = {
              Education: "#form-education",
              InstituteOwnership: "#form-institute_ownership",
              Institute: "#form-institute",
              University: "#form-university",
              Stream: "#form-stream",
              CourseType: "#form-course_type",
              MediumofInstruction: "#form-MediumofInstruction",
              CourseGrp: "#form-CourseGrp",
              Course: "#form-Course",
              CourseCategory: "#form-CourseCategory",
              CourseBr: "#form-CourseBr",
              CourseYear: "#form-CourseYear",
              AccrediationStatus: "#form-AccrediationStatus",
              Caste: "#form-Caste",
              Gender: "#form-Gender",
              Income: "#form-Income",
              IncomeValue: "#form-IncomeValue",
              Quota: "#form-Quota",
              SplCtg: "#form-SplCtg",
              ModeOfStudy: "#form-ModeOfStudy",
              ResidentalStatus: "#form-ResidentalStatus",
              MaintanenceGrp: "#form-MaintanenceGrp",
              DisabilityStatus: "#form-DisabilityStatus",
              Religion: "#form-Religion",
              Community: "#form-Community",
            };
            // Show all sections initially
            $(".mt-2.card").show();
            // Make an API call to fetch additional details
            $.ajax({
              url: config.ssp_api_url + "/get_rule_condition",
              type: "POST",
              headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
              data: { scheme_id: schemeId, sub_scheme_id: sub_scheme_id },
              success: function (ruleResponse) {
                if (ruleResponse.status == 1) {
                  // Track if any parameters in the section are populated
                  let sectionHasValues = {
                    "Institute Parameters": false,
                    "Course Parameters": false,
                    "Student Eligibility Parameters": false,
                    "Maintenance Parameters": false,
                    "Socio Economic Parameters": false,
                  };

                  ruleResponse.fielddetails?.forEach(function (field) {
                    if (fieldMapping[field.fieldname]) {
                      var $list = $('<ul class="parameter-list"></ul>'); // Create a new unordered list

                      // Check if field.fieldvalues is an array and has elements
                      if (
                        Array.isArray(field.fieldvalues) &&
                        field.fieldvalues.length > 0
                      ) {
                        field.fieldvalues.forEach(function (value) {
                          if (
                            value.value !== "All" &&
                            value.text !== "All" &&
                            !(
                              value.text === "-1" &&
                              value.value === "Not Applicable"
                            )
                          ) {
                            var listItem = $(
                              '<li class="parameter-items"></li>'
                            ).text(value.value || value.text); // Create list items
                            $list.append(listItem); // Append the list item to the list
                          }
                        });
                      }

                      var $fieldContainer = $("#scheme_info")
                        .find(fieldMapping[field.fieldname])
                        .closest(".mb-1"); // Get the parent container

                      // Check if the list is empty
                      if ($list.children().length === 0) {
                        $fieldContainer.hide(); // Hide the entire container (label + field)
                      } else {
                        $fieldContainer.show(); // Show the container if there are values
                        $fieldContainer.find(".parameters").html($list); // Update the content
                        sectionHasValues[
                          getSectionTitle(field.fieldname)
                        ] = true; // Mark section as having values
                      }
                    }
                  });

                  // Hide sections if they don't have any values
                  for (const section in sectionHasValues) {
                    if (!sectionHasValues[section]) {
                      $(
                        '.mt-2.card:has(h6:contains("' + section + '"))'
                      ).hide();
                    }
                  }
                } else {
                  Object.keys(fieldMapping).forEach(function (fieldname) {
                    var $fieldContainer = $("#scheme_info")
                      .find(fieldMapping[fieldname])
                      .closest(".mb-1");
                    $fieldContainer.hide(); // Hide all fields if there's an error
                  });
                }
              },
            });
          } else {
            $("#scheme_info").find("#form-subscheme_name").text("-");
            $("#scheme_info").find("#form-scholarship_fee_type").text("-");
            $("#scheme_info").find("#form-scholarhip_fee_amount").text("-");
            $("#scheme_info").find("#form-scholarhip_fee_percent").text("-");
          }
        },
        error: function (xhr, status, error) {
          // Handle errors
          console.error("Failed to fetch sub-department details:", error);
          $("#scheme_info")
            .find("#form-subscheme_name")
            .text("Error fetching details");
        },
      });
      $("#scheme_info").modal("show"); // Show the modal
    } else {
      alert("Scheme details not found.");
    }
  });
  $(document).on("click", ".info-exclustion-1", function (event) {
    event.preventDefault();
    $("#exclusiveModal").modal("hide");
    $("#confirmationModal").modal("hide");
    $(".scheme_info-close").addClass("exception11");
    event.preventDefault();
    var schemeId = $(this).data("scheme-id");
    var scheme = schemesData[schemeId];
    console.log(schemeId);
    console.log(schemesData);

    console.log(schemesData[388]);

    if (scheme) {
      // Populate the modal with scheme details
      $("#scheme_info")
        .find("#form-scheme_name")
        .text(scheme.scheme_name || "N/A");
      $("#scheme_info")
        .find("#form-frequency")
        .text(scheme.frequency || "N/A");
      $("#scheme_info")
        .find("#form-department_name")
        .text(scheme.department_name || "N/A");
      $("#scheme_info")
        .find("#form-subdepartment_name")
        .text(scheme.subdepartment_name || "N/A");
      $("#scheme_info")
        .find("#form-scheme_code")
        .text(scheme.scheme_code || "N/A");
      $("#scheme_info")
        .find("#form-scheme_category")
        .text(scheme.scheme_category || "N/A");
      $("#scheme_info")
        .find("#form-freezed")
        .text(scheme.freezed ? "Yes" : "No");

      // Make an API call to fetch additional details
      $.ajax({
        url: config.ssp_api_url + "/get_sub_scheme_list",
        type: "POST",
        headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
        data: { scheme_id: schemeId },
        success: function (response) {
          if (response.success == 1) {
            // Update the modal with sub-department details
            $("#scheme_info")
              .find("#form-subscheme_name")
              .text(response.data[0].subscheme_name || "N/A");
            $("#scheme_info")
              .find("#form-scholarship_fee_type")
              .text(response.data[0].scholarship_fee_type || "N/A");
            $("#scheme_info")
              .find("#form-scholarhip_fee_amount")
              .text(scheme.scholarship_amount || "N/A");
            $("#scheme_info")
              .find("#form-scholarhip_fee_percent")
              .text(response.data[0].scholarhip_fee_percent || "N/A");
            // You can update other fields similarly based on the API response
            var sub_scheme_id = response.data[0].subscheme_id;
            // Define a mapping of field names to their corresponding DOM element IDs
            const fieldMapping = {
              Education: "#form-education",
              InstituteOwnership: "#form-institute_ownership",
              Institute: "#form-institute",
              University: "#form-university",
              Stream: "#form-stream",
              CourseType: "#form-course_type",
              MediumofInstruction: "#form-MediumofInstruction",
              CourseGrp: "#form-CourseGrp",
              Course: "#form-Course",
              CourseCategory: "#form-CourseCategory",
              CourseBr: "#form-CourseBr",
              CourseYear: "#form-CourseYear",
              AccrediationStatus: "#form-AccrediationStatus",
              Caste: "#form-Caste",
              Gender: "#form-Gender",
              Income: "#form-Income",
              IncomeValue: "#form-IncomeValue",
              Quota: "#form-Quota",
              SplCtg: "#form-SplCtg",
              ModeOfStudy: "#form-ModeOfStudy",
              ResidentalStatus: "#form-ResidentalStatus",
              MaintanenceGrp: "#form-MaintanenceGrp",
              DisabilityStatus: "#form-DisabilityStatus",
              Religion: "#form-Religion",
              Community: "#form-Community",
            };
            // Show all sections initially
            $(".mt-2.card").show();
            // Make an API call to fetch additional details
            $.ajax({
              url: config.ssp_api_url + "/get_rule_condition",
              type: "POST",
              headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
              data: { scheme_id: schemeId, sub_scheme_id: sub_scheme_id },
              success: function (ruleResponse) {
                if (ruleResponse.status == 1) {
                  // Track if any parameters in the section are populated
                  let sectionHasValues = {
                    "Institute Parameters": false,
                    "Course Parameters": false,
                    "Student Eligibility Parameters": false,
                    "Maintenance Parameters": false,
                    "Socio Economic Parameters": false,
                  };

                  ruleResponse.fielddetails?.forEach(function (field) {
                    if (fieldMapping[field.fieldname]) {
                      var $list = $('<ul class="parameter-list"></ul>'); // Create a new unordered list

                      // Check if field.fieldvalues is an array and has elements
                      if (
                        Array.isArray(field.fieldvalues) &&
                        field.fieldvalues.length > 0
                      ) {
                        field.fieldvalues.forEach(function (value) {
                          if (
                            value.value !== "All" &&
                            value.text !== "All" &&
                            !(
                              value.text === "-1" &&
                              value.value === "Not Applicable"
                            )
                          ) {
                            var listItem = $(
                              '<li class="parameter-items"></li>'
                            ).text(value.value || value.text); // Create list items
                            $list.append(listItem); // Append the list item to the list
                          }
                        });
                      }

                      var $fieldContainer = $("#scheme_info")
                        .find(fieldMapping[field.fieldname])
                        .closest(".mb-1"); // Get the parent container

                      // Check if the list is empty
                      if ($list.children().length === 0) {
                        $fieldContainer.hide(); // Hide the entire container (label + field)
                      } else {
                        $fieldContainer.show(); // Show the container if there are values
                        $fieldContainer.find(".parameters").html($list); // Update the content
                        sectionHasValues[
                          getSectionTitle(field.fieldname)
                        ] = true; // Mark section as having values
                      }
                    }
                  });

                  // Hide sections if they don't have any values
                  for (const section in sectionHasValues) {
                    if (!sectionHasValues[section]) {
                      $(
                        '.mt-2.card:has(h6:contains("' + section + '"))'
                      ).hide();
                    }
                  }
                } else {
                  Object.keys(fieldMapping).forEach(function (fieldname) {
                    var $fieldContainer = $("#scheme_info")
                      .find(fieldMapping[fieldname])
                      .closest(".mb-1");
                    $fieldContainer.hide(); // Hide all fields if there's an error
                  });
                }
              },
            });
          } else {
            $("#scheme_info").find("#form-subscheme_name").text("-");
            $("#scheme_info").find("#form-scholarship_fee_type").text("-");
            $("#scheme_info").find("#form-scholarhip_fee_amount").text("-");
            $("#scheme_info").find("#form-scholarhip_fee_percent").text("-");
          }
        },
        error: function (xhr, status, error) {
          // Handle errors
          console.error("Failed to fetch sub-department details:", error);
          $("#scheme_info")
            .find("#form-subscheme_name")
            .text("Error fetching details");
        },
      });
      $("#scheme_info").modal("show"); // Show the modal
    } else {
      alert("Scheme details not found.");
    }
  });

  $(document).on("click", ".exclution-close", function (event) {
    $("#scheme_info").modal("hide");
    $("#confirmationModal").modal("show");
    $(".scheme_info-close").removeClass("exclution-close");
  });
  $(document).on("click", ".exception11", function (event) {
    $("#scheme_info").modal("hide");
    $("#exclusiveModal").modal("show");
    $(".scheme_info-close").removeClass("exclution-close");
  });

  $(document).on("click", ".applied_application", function () {
    var applicationId = $(this).data("application-id");
    var pdfUrl = config.ssp_api_url + "/student/public/AJAY_P/" + 526 + ".pdf";
    window.open(pdfUrl, "_blank");
  });

  $(document).on("click", ".otp_modal_cancel", () => {
    $("#applyModal").modal("show");
    $("#opt_modal").modal("hide");
    $(".applymodal_close").addClass("reload");
  });

  $(document).on("click", ".reload", function () {
    location.reload();
  });

  $(document).ready(function () {
    // Function to update the state of the button based on checkbox status
    function updateButtonState() {
      if ($("#applySchemeVerification").is(":checked")) {
        $("#get_opt").prop("disabled", false);
      } else {
        $("#get_opt").prop("disabled", true);
      }
    }

    // Initial check on page load
    updateButtonState();

    // Bind the update function to checkbox change event
    $("#applySchemeVerification").change(function () {
      updateButtonState();
    });
  });
});
function getSectionTitle(fieldname) {
  if (
    ["Education", "InstituteOwnership", "Institute", "University"].includes(
      fieldname
    )
  ) {
    return "Institute Parameters";
  } else if (
    [
      "Stream",
      "CourseType",
      "MediumofInstruction",
      "CourseGrp",
      "Course",
      "CourseCategory",
      "CourseBr",
      "CourseYear",
      "AccrediationStatus",
      "Caste",
      "Gender",
      "Income",
      "IncomeValue",
    ].includes(fieldname)
  ) {
    return "Course Parameters";
  } else if (["Quota", "SplCtg", "ModeOfStudy"].includes(fieldname)) {
    return "Student Eligibility Parameters";
  } else if (
    ["ResidentalStatus", "MaintanenceGrp", "DisabilityStatus"].includes(
      fieldname
    )
  ) {
    return "Maintenance Parameters";
  } else if (["Religion", "Community"].includes(fieldname)) {
    return "Socio Economic Parameters";
  }
  return "";
}
function exportModalToPDF() {
  const modal = document.getElementById("scheme_info");

  // Use html2canvas to take a screenshot of the modal
  html2canvas(modal).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgWidth = 190; // Width of the image in PDF
    const pageHeight = pdf.internal.pageSize.height;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("modal-content.pdf");
  });
}
