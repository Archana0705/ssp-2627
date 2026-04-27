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
  var pdfUrl = $(this).data("filepath");
  // var pdfUrl = config.ssp_api_url +'/student/public/AJAY_P/' + 526 + '.pdf';
  window.open(pdfUrl, "_blank");
});
var schemesData = {};
var student_api_url = config.students_api_url;
//console.log(student_api_url);
var queryString = window.location.search;
var queryParams = queryString.split("?details");
var urlKey = queryParams[1];
var dashboardHref = `index.html?details${urlKey}`;
var appliedHref = `applied_schemes.html?details${urlKey}`;
var allHref = `all_schemes.html?details${urlKey}`;
let stud_Id;
let pdf_data;
let studentId = "";
let studentEducationId = "";
let feeData = "";
let aadhaarNo = "";
let academic_year;
let institution_name;
let institutionId;
let university_name;
let selectedDecision;
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
function checkReasons(){
  location.href=allHref;
}

$('.not-qualified').hide();
$(document).ready(function () {
  $("#check_scheme_eligibility").hide();
  $("#scheme_eligibility").hide();

  // Function to fetch customer details from the API
  student_id = "";
  $.ajax({
    url: student_api_url + "/get_student_detail",
    method: "POST",
    headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
    data: { student_details: urlKey },
    dataType: "json",
    success: function (response) {
      if (!$('#collapseCard').hasClass('show')) {
        var accordionPanel = new bootstrap.Collapse('#collapseCard', {
          toggle: true
        });}
      if (response.success == 1) {
        fn_scheme_details(urlKey);
        if(response.refresh != 'student_refresh'){
        data = response.data[0];
        aadhaarNo = data.aadhaar_no;
        studentId = response.student_id;
        studentEducationId = data.sspeducationid;
        data.aadhaar_no = atob(data.aadhaar_no);
        data.aadhaar_no =
          data.aadhaar_no.slice(0, 2) + "******" + data.aadhaar_no.slice(8);
        stud_mobileno = data.mobile_no;
        academic_year = data.academic_year;
        institution_name = data.institution_name;
        institutionId = data.institute_id;
        university_name = data.universityname;
        $("#sspstud_id").val(data.sspstudentid);
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
        if (data.community_certificate_verified === true) {
          $("#community_verify")
              .removeClass('bi-x-circle-fill text-danger') // Remove the cancel icon classes if present
              .addClass('bi bi-patch-check-fill'); // Add the verified icon class
      } else {
          $("#community_verify")
              .removeClass('bi-patch-check-fill') // Remove the verified icon class if present
              .addClass('bi bi-x-circle-fill text-danger'); // Add the cancel icon classes
      }
          if (data.incomeverification === true) {
              $("#income_verify")
                  .removeClass('bi-x-circle-fill text-danger') // Remove the cancel icon classes if present
                  .addClass('bi bi-patch-check-fill'); // Add the verified icon class
          } else {
              $("#income_verify")
                  .removeClass('bi-patch-check-fill') // Remove the verified icon class if present
                  .addClass('bi bi-x-circle-fill text-danger'); // Add the cancel icon classes
          }
          if (data.aadhaar_verified === true) {
              $("#aadhar_verify")
                  .removeClass('bi-x-circle-fill text-danger') // Remove the cancel icon classes if present
                  .addClass('bi bi-patch-check-fill'); // Add the verified icon class
          } else {
              $("#aadhar_verify")
                  .removeClass('bi-patch-check-fill') // Remove the verified icon class if present
                  .addClass('bi bi-x-circle-fill text-danger'); // Add the cancel icon classes
          }
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

      }else{
        data = response.data[0];
        $("#sspstud_id").val(data.sspstudentid);
      }
      } else {
        if(response.message ==='No Data Found'){
          
          Swal.fire({
            title: "Student Details Not Found",
            icon: "error",
            showConfirmButton: true,
          });
        }else{
          Swal.fire({
            title: response.message,
            icon: "error",
            showConfirmButton: true,
          });
        }
      
      }
    },
    error: function (xhr, status, error) {
      Swal.fire({
          title: "Error!",
          text: `An error occurred: ${error}`,
          icon: "error",
          showConfirmButton: true,
      });
  },
    complete: function () {
      /////////// for apply

      $(".progress").hide();

      $(document).on("click", ".apply_link", function (event) {
        event.preventDefault(); // Pre
        // Use .closest() instead of .closet()
        stud_Id = $(this).closest("tr").find("#studentschemeid").val();
        var studsub_Id = $(this).closest("tr").find("#scheme_rule_id").val();
        var schemeName = $(this).closest("tr").find("#selected_scheme_name").val();
        //console.log('Student Scheme ID:', stud_Id);
        $("#opt_modal_studentschemeid").val(stud_Id);
        $("#opt_modal_studentsubschemeid").val(studsub_Id);
        $.ajax({
          url: student_api_url + "/get_schemedetailsbyid",
          method: "POST",
          headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
          data: { data: encryptData({ studentschemeid: stud_Id }) },
          dataType: "json",
          success: function (response) {
            response.data = decryptData(response.data);
            data = response.data[0];
            subscheme_name = data.subscheme_name;
            umis_id = data["umis_no"];

            var encryptDatas = {
              student_id: urlKey,
              status: true,
            };
            // new changes
            if (data.pass == true) {
              $.ajax({
                url: student_api_url + "/get_scheme_details",
                type: "POST",
                headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
                data: { encry_data: encryptData(encryptDatas) },
                success: function (response) {
                  if (response.success == 1) {
                    const decryptedData = decryptData(response.data);
                    data_scheme = decryptedData;
                  } else {
                    data_scheme = response.data;
                  }
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

                        //console.log(scheme.scheme_name); // Log the scheme name to the //console
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
              var encryptDatas = {
                student_id: urlKey,
                status: true,
              };
              $.ajax({
                url: student_api_url + "/get_scheme_details",
                type: "POST",
                headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
                data: { encry_data: encryptData(encryptDatas) },
                success: function (response) {
                  if (response.success == 1) {
                    const decryptedData = decryptData(response.data);
                    data_scheme = decryptedData;
                  } else {
                    data_scheme = response.data;
                  }
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
                    // //console.log(schemesList);
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
                error: function (xhr, status, error) {
                  // Handle errors
                  if (xhr.status === 404) {
                    console.error('Sub-department not found.');
                } else if (xhr.status === 500) {
                    console.error('Server error. Please try again later.');
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
              //console.log(schemeId);
              var scheme = schemesData[schemeId];
              if (scheme) {
                var subscheme_id = scheme.scheme_rule_id;
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

                          $('#scheme_info').find('#form-subscheme_name').text(scheme.subscheme_name || 'N/A');
                          $('#scheme_info').find('#form-scholarship_fee_type').text(scheme.scholarship_fee_type || 'N/A');
                          $('#scheme_info').find('#form-scholarhip_fee_amount').text(scheme.scholarship_amount || 'N/A');
                          var sub_scheme_id = subscheme_id;

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
                          ruleResponse = decryptData(ruleResponse["data"]);
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
                $("#scheme_info").modal("show"); // Show the modal
              } else {
                Swal.fire({
                text: 'Scheme details not found.',
                icon: "info",
                showConfirmButton: true,
            });
              }
            });
            $(document)
              .off("click", "#get_opt")
              .on("click", "#get_opt", (e) => {
                var subssid = $("#opt_modal_studentsubschemeid").val();
                var stud_id = $("#stud_id").val();
                var schemeName = $("#apply_schemename").text();
                selectedDecision = $('input[name="applicationDecision"]:checked').val();

                // Remove previous errors
                $(".error-text").remove();

                if (selectedDecision === "notApply") {
                  const reason = $("#notApplyReason").val();
                  const description = $("#notApplyDescription").val();
                  let hasError = false;

                  if (!reason) {
                    $("#notApplyReason").after('<div class="error-text text-danger mt-1">Please select a reason.</div>');
                    hasError = true;
                  }

                  if (!description.trim()) {
                    $("#notApplyDescription").after('<div class="error-text text-danger mt-1">Please enter a description.</div>');
                    hasError = true;
                  }

                  if (hasError) {
                    e.preventDefault();
                    return;
                  }
                }

                scheme_id = data.schemeid;
                sub_scheme_id = subssid;
                var fields = {
                  iid: subssid,
                  iappliedby: stud_id,
                };
                $.ajax({
                  url: config.ssp_api_url + "/student/student_verify_flag",
                  type: "POST",
                  headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
                  data: {
                    studentid: $("#sspstud_id").val() || 0,
                    subschemeid: sub_scheme_id || 0,
                  },
                  success: function (response) {
                    $.ajax({
                      url: student_api_url + "/otp",
                      type: "POST",
                      headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
                      data: {
                        type: "send",
                        isubschemeid: studsub_Id,
                        ischemeid: scheme_id,
                        istudentid: stud_id,
                        umis_id: umis_id,
                        scheme_name: schemeName,
                        iinterval: 5,
                      },
                      success: function (response) {
                        if (response[0]["success"] == 1) {
                          $("#applyModal").modal("hide");
                          // $('#otp_input_1').focus();
                          get_mobileno = response[0]["data"]["mobileno"];
                          if (get_mobileno == null) {
                            mobileno = "9791XXXX20";
                          } else {
                            mobileno = get_mobileno;
                          }
                          //console.log(data);
                          Swal.fire({
                            title: "OTP Send Successfully ",
                            icon: "success",
                            showConfirmButton: false,
                            timer: 3000,
                          }).then(() => {
                            $(".otp-input").text("");
                            // $('#otp_input_1').focus();
                            $(".otp_mobile_number").text(mobileno);
                            let timeLeft = 180; // 3 minutes in seconds
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
                            // $('#otp_input_1').focus();
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
                              universityName: university_name,
                              schemeName: data.scheme_name,
                              subschemeName: data.subschemename,
                            };
                          });
                        }
                        else {
                          Swal.fire({
                            title: "OTP Failed",
                            icon: "error",
                            showConfirmButton: true,
                            timer: 3000,
                          });
                        }
                      },
                      error: function (xhr, status, error) {
                        var response_text = JSON.parse(xhr.responseText);
                          Swal.fire({
                          title: response_text[0]['message'],
                          icon: "error",
                          showConfirmButton: true,
                          timer: 3000,
                      });
                      }
                    });
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
              });
            // $(document).off('click', '#requestAgain').on('click', '#requestAgain', () => {
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
            // $(document).on("click", "#requestAgain", function () {
            //   $.ajax({
            //     url: config.ssp_api_url + "/student/otp",
            //     type: "POST",
            //     headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
            //     data: {
            //       type: "resend",
            //       isubschemeid: studsub_Id,
            //       ischemeid: scheme_id,
            //       istudentid: stud_id,
            //       umis_id: umis_id,
            //       iinterval: 5,
            //     },
            //     success: function (response) {
            //       Swal.fire({
            //         title: "OTP Resent successfully",
            //         icon: "success",
            //         showConfirmButton: false,
            //         timer: 3000,
            //       });
            //     },
            //   });
            // });
            $(document).on("click", "#requestAgain", function () {
              var schemeName = $("#apply_schemename").text();

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
                  iinterval: 5,
                  scheme_name: schemeName,
                },
                success: function (response) {
                  if (response[0]["success"] == 1) {
                    $("#applyModal").modal("hide");
                    // $('#otp_input_1').focus();
                    get_mobileno = response[0]["data"]["mobileno"];
                    if (get_mobileno == null) {
                      mobileno = "9791XXXX20";
                    } else {
                      mobileno = get_mobileno;
                    }
                    //console.log(data);
                  Swal.fire({
                      title: "OTP Resend Successfully ",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 3000,
                }).then(() => {
                      $(".otp-input").text("");
                      // $('#otp_input_1').focus();
                      $(".otp_mobile_number").text(mobileno);
                    let timeLeft = 180; // 3 minutes in seconds
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
                      // $('#otp_input_1').focus();
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
                        universityName: university_name,
                        schemeName: data.scheme_name,
                        subschemeName: data.subschemename,
                      };
                    });
                  }
                  else {
                    Swal.fire({
                      title: "OTP Failed",
                      icon: "error",
                      showConfirmButton: true,
                      timer: 3000,
                  });
                  }
                },
              });
            });
            
            $(document)
              .off("click", "#otp_verify")
              .on("click", "#otp_verify", () => {
                const inputs = $(".otp-input");
                var schemeName = $("#apply_schemename").text();
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
                    type: 'POST',
                    headers: { 'X-APP-KEY': 'te$t', 'X-APP-NAME': 'te$t' },
                    data: {
                        'type': 'check',
                        'isubschemeid': studsub_Id,
                        'ischemeid': scheme_id,
                        'istudentid': stud_id,
                        'iinterval': 5,
                        'iotp': otpValue,
                        'field': fields,
                        'pdf_data': pdf_data,
                        "scheme_name" : schemeName,
                        "sspstud_id" : $("#sspstud_id").val() || null,
                        "reason" : $("#notApplyReason").val() || null,
                        "descriptions" : $("#notApplyDescription").val() || null
                    },
                    success: function (response) {
                        //console.log(response);
                        $('#opt_modal').modal('hide');
                        if (response.success == '1') {
                            Swal.fire({
                                title: "Scheme Successfully Applied",
                                icon: "success",
                                showConfirmButton: false,
                                timer: 3000,

                            }).then(() => {
                                location.reload();
                            })
                        } else {
                            Swal.fire({
                                title: response.message,
                                icon: "error",
                                showConfirmButton: false,
                                timer: 3000,
                            });
                        }
                    },error: function (xhr, status, error) {
                      // Extract error message from the server response
                      let errorMessage = xhr.responseJSON && xhr.responseJSON.message 
                            ? xhr.responseJSON.message 
                            : "An unexpected error occurred";
              
                      Swal.fire({
                          title: errorMessage,
                          icon: "error",
                          showConfirmButton: false,
                          timer: 3000,
                      }).then(() => {
                          $('.otp-input input').val(''); // Clear all input fields
                      });
                  }

                });
              });
          },
          error: function (xhr, status, error) {
            Swal.fire({
                title: "Error!",
                text: `An error occurred: ${error}`,
                icon: "error",
                showConfirmButton: true,
            });
        },
        });
      });
      
      var encryptDatas = {
        student_id: studentEducationId ?? 0
      };
      $.ajax({
        url: student_api_url + "/get_fee_details",
        type: "POST",
        headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
        data: { encry_data: encryptData(encryptDatas) },
        success: function (response) {
          if (response.success == 1) {
            const decryptedData = decryptData(response.data);
            feeData = decryptedData;
            const totalNonRefundableAmount = feeData.reduce((total, fee) => {
              return total + parseFloat(fee.fixed_ceiling_amount); // Ensure it's a number
          }, 0);
          
          // Update the non_refundable_fee element with the calculated total
          $("#non_refundable_fee").text(totalNonRefundableAmount.toFixed(2));
          } else {
            feeData = response.data;
          }
        }
      });
    },
  });

  $("#button-csv").on("click", function () {
    $("#scheme_details").DataTable().button(".buttons-csv").trigger();
  });
  $(document).on("click", ".info", function (event) {
    event.preventDefault();
    //console.log(schemesData);
    studscheme_Id = $(this).closest("tr").find("#studentschemeid").val();
    var schemeId = $(this).data("scheme-id");
    var scheme = schemesData[schemeId];

    if (scheme) {
      var subscheme_id = scheme.scheme_rule_id;
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

                $('#scheme_info').find('#form-subscheme_name').text(scheme.subscheme_name || 'N/A');
                $('#scheme_info').find('#form-scholarship_fee_type').text(scheme.scholarship_fee_type || 'N/A');
                $('#scheme_info').find('#form-scholarhip_fee_amount').text(scheme.scholarship_amount || 'N/A');
                var sub_scheme_id = subscheme_id;
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
                //console.log(ruleResponse);
                ruleResponse = decryptData(ruleResponse["data"]);

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
            var encryptDatas = {
              student_id: urlKey,
              status: true,
            };
            $.ajax({
              url: student_api_url + "/get_scheme_details",
              type: "POST",
              headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
              data: { encry_data: encryptData(encryptDatas) },
              success: function (response) {
                if (response.success == 1) {
                  const decryptedData = decryptData(response.data);
                  data_scheme = decryptedData;
                } else {
                  data_scheme = response.data;
                }
              },
              complete: function () {

          $.ajax({
            url: student_api_url + "/get_schemedetailsbyid",
            method: "POST",
            headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
            data: { data: encryptData({ studentschemeid: studscheme_Id }) },
            dataType: "json",
            success: function (response) {
              response.data = decryptData(response.data);

              data = response.data[0];
              //console.log(data);
              subscheme_name = data.subscheme_name;
              umis_id = data["umis_no"];
              console.log("data_scheme", data);
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

                      //console.log("fff",scheme.scheme_name); // Log the scheme name to the //console
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
                var encryptDatas = {
                  student_id: urlKey,
                  status: true,
                };
                $.ajax({
                  url: student_api_url + "/get_scheme_details",
                  type: "POST",
                  headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
                  data: { encry_data: encryptData(encryptDatas) },
                  success: function (response) {
                    if (response.success == 1) {
                      const decryptedData = decryptData(response.data);
                      data_scheme = decryptedData;
                    } else {
                      data_scheme = response.data;
                    }
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
                //console.log(schemeId);
                var scheme = schemesData[schemeId];
                if (scheme) {
                  var subscheme_id = scheme.scheme_rule_id;
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


                            $('#scheme_info').find('#form-subscheme_name').text(scheme.subscheme_name || 'N/A');
                            $('#scheme_info').find('#form-scholarship_fee_type').text(scheme.scholarship_fee_type || 'N/A');
                            $('#scheme_info').find('#form-scholarhip_fee_amount').text(scheme.scholarship_amount || 'N/A');
                            var sub_scheme_id = subscheme_id;
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
                            data: encryptData({
                              scheme_id: schemeId,
                              sub_scheme_id: sub_scheme_id,
                            }),
                          },
                          success: function (ruleResponse) {
                            ruleResponse = decryptData(ruleResponse["data"]);
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
                  $("#scheme_info").modal("show"); // Show the modal
                } else {
              
                  Swal.fire({
                    text: 'Scheme details not found.',
                    icon: "info",
                    showConfirmButton: true,
                });
                }
              });
            },
          });
        },
        error: function (xhr, status, error) {
          // Handle errors
          //console.error('Failed to fetch sub-department details:', error);
          $("#scheme_info")
            .find("#form-subscheme_name")
            .text("Error fetching details");
        },
      });

      $("#scheme_info").modal("show"); // Show the modal
    } else {
      Swal.fire({
        text: 'Scheme details not found.',
        icon: "info",
        showConfirmButton: true,
    });
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
    //console.log(schemeId);
    //console.log(schemesData);

    //console.log(schemesData[388]);

    if (scheme) {
      var subscheme_id = scheme.scheme_rule_id;
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

                $('#scheme_info').find('#form-subscheme_name').text(scheme.subscheme_name || 'N/A');
                $('#scheme_info').find('#form-scholarship_fee_type').text(scheme.scholarship_fee_type || 'N/A');
                $('#scheme_info').find('#form-scholarhip_fee_amount').text(scheme.scholarship_amount || 'N/A');
                var sub_scheme_id = subscheme_id;
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
                ruleResponse = decryptData(ruleResponse["data"]);
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
      $("#scheme_info").modal("show"); // Show the modal
    } else {
      Swal.fire({
        text: 'Scheme details not found.',
        icon: "info",
        showConfirmButton: true,
    });
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
    //console.log(schemeId);
    //console.log(schemesData);

    //console.log(schemesData[388]);

    if (scheme) {
      var subscheme_id = scheme.scheme_rule_id;
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

                $('#scheme_info').find('#form-subscheme_name').text(scheme.subscheme_name || 'N/A');
                $('#scheme_info').find('#form-scholarship_fee_type').text(scheme.scholarship_fee_type || 'N/A');
                $('#scheme_info').find('#form-scholarhip_fee_amount').text(scheme.scholarship_amount || 'N/A');
                var sub_scheme_id = subscheme_id;
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
                ruleResponse = decryptData(ruleResponse["data"]);
                console.log(ruleResponse);
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
      $("#scheme_info").modal("show"); // Show the modal
    } else {
      Swal.fire({
        text: 'Scheme details not found.',
        icon: "info",
        showConfirmButton: true,
    });
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
// $(document).ready(function () {
//     $(".otp-input").on("input", function () {
//         // Allow only one digit in the input
//         this.value = this.value.replace(/[^0-9]/g, '').slice(0, 1);

//         // Navigate to the next input
//         if (this.value.length === 1) {
//             $(this).next(".otp-input").removeAttr("disabled").focus();
//         }
//     });

//     $(".otp-input").on("keydown", function (e) {
//         // Handle backspace to navigate to the previous input
//         if (e.key === "Backspace" && this.value === "") {
//             const prevInput = $(this).prop("disabled", true).prev(".otp-input");
//             if (prevInput.length) {
//                 prevInput.focus().val("");
//             } else {
//                 // Stay focused on the first input if there is no previous input
//                 $(this).focus();
//             }
//         }
//     });

//     // Focus on the first input field on page load
//     $(".otp-input:first").removeAttr("disabled").focus();
// });

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

  const student_id_ssp = $("#sspstud_id").val();
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
        student_api_url + "/student_detail_refresh",
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

  student_id_ssp = $("#sspstud_id").val();
  if ($("#StudentDetailsCheckbox").prop("checked")) {
    startProgressBar(
      "StudentDetailsCheckbox",
      "progressStudentDetails",
      "progressStudentDetails_message",
      student_api_url + "/student_detail_refresh",
      { student_id: student_id_ssp, dropdown: "student" }
    );
  }

  if ($("#StudentContactDetailsCheckbox").prop("checked")) {
    startProgressBar(
      "StudentContactDetailsCheckbox",
      "progressStudentContactDetails",
      "progressStudentContactDetails_message",
      student_api_url + "/student_detail_refresh",
      { student_id: student_id_ssp, dropdown: "studentcontact" }
    );
  }

  if ($("#income_checkbox").prop("checked")) {
    startProgressBar(
      "income_checkbox",
      "progressIncome",
      "progressIncome_message",
      student_api_url + "/student_detail_refresh",
      { student_id: student_id_ssp, dropdown: "studentesevaiinfo" }
    );
  }

  if ($("#studentfamilyinfo_checkbox").prop("checked")) {
    startProgressBar(
      "studentfamilyinfo_checkbox",
      "progressFamilyInfo",
      "progressFamilyInfo_message",
      student_api_url + "/student_detail_refresh",
      { student_id: student_id_ssp, dropdown: "studentfamilyinfo" }
    );
  }

  if ($("#current_academic_info").prop("checked")) {
    startProgressBar(
      "current_academic_info",
      "progressAcademicInfo",
      "progressAcademicInfo_message",
      student_api_url + "/student_detail_refresh",
      { student_id: student_id_ssp, dropdown: "studentcurrentacademicinfo" }
    );
  }

  if ($("#student_bank_account_details").prop("checked")) {
    startProgressBar(
      "student_bank_account_details",
      "progressBankDetails",
      "progressBankDetails_message",
      student_api_url + "/student_detail_refresh",
      { student_id: student_id_ssp, dropdown: "bankaccount" }
    );
  }

  if ($("#student_category_details").prop("checked")) {
    startProgressBar(
      "student_category_details",
      "progressstudent_category_details",
      "progressstudent_category_message",
      student_api_url + "/student_detail_refresh",
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
                  student_id   : studentId,
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
                                          <a id="check_scheme" data-scheme-name="${scheme.scheme_name}" data-scheme-id="${scheme.scheme_id}" data-student-id="${studentId}" data-current-modal="0" href="#">(Check)</a>
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
document.getElementById('fee_details').addEventListener('click', function () {
  // Get the modal content container
  const feeDetailsContent = document.getElementById('feeDetailsContent');

  // Clear any existing content in the modal
  feeDetailsContent.innerHTML = '';

  // Sort feeData alphabetically by `component_name` in ascending order initially
  feeData.sort((a, b) => a.component_name.toLowerCase().localeCompare(b.component_name.toLowerCase()));

  // Create a table to show the fee components with headers
  let feeDetailsHTML = `
    <table class="table table-bordered" id="feeTable">
      <thead>
        <tr>
          <th id="sortByComponent" style="cursor: pointer;">⬍     Fee Component Name</th>
          <th id="sortByAmount" style="cursor: pointer;">⬍      Annual Amount</th>
        </tr>
      </thead>
      <tbody id="feeTableBody">
        ${generateFeeRows(feeData)}
      </tbody>
    </table>
  `;

  // Insert the constructed HTML into the modal
  feeDetailsContent.innerHTML = feeDetailsHTML;

  // Add event listeners for sorting
  let sortOrder = { component: 'asc', amount: 'asc' };

  document.getElementById('sortByComponent').addEventListener('click', function () {
    sortFeeTable('component_name', sortOrder, 'component');
  });

  document.getElementById('sortByAmount').addEventListener('click', function () {
    sortFeeTable('fixed_ceiling_amount', sortOrder, 'amount');
  });

  // Show the modal
  $("#feeDetailsModal").modal("show");
});
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
  var student_id = $(this).data('student-id') ?? studentId;
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