import permissions from "../assets/js/permissions.js";
class Headerr extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
        <header id="header" class="header fixed-top d-flex flex-column">
          <div class="gigw d-flex flex-row">
            <div class="controls">
                <button class="btn btn-sm btn-increase">A+</button>
                <button class="btn btn-sm btn-orig">A</button>
                <button class="btn btn-sm btn-decrease">A-</button>
            </div>
            <div class="btn btn-sm">
              <i class="bi bi-translate mx-3" id="langToggle" onclick="switchLang()"> தமிழ்</i>
            </div>
          </div>
          <div class="d-flex flex-row align-items-center w-100">
            <div class="d-flex align-items-center justify-content-between">
              <i class="bi bi-list toggle-sidebar-btn"></i>
              <a href="index.html" class="logo d-flex align-items-center mx-2 aos-init aos-animate" data-aos="fade-down">
                <img src="../assets/img/tn_logo.png" alt="logo" class="logo_header">
                <span class="no-web">Unified State Scholarship Portal</span>
                
              </a>
            </div>
            <nav class="header-nav ms-auto mx-2">
         
              <ul class="d-flex align-items-center no-web" style="justify-content: right;">
                <li class="nav-item aos-init aos-animate" data-aos="fade-down">
                  <a class="nav-link mx-2 nav-profile"><span id="nav-institute"></span></a>
                </li>
                <li class="nav-item aos-init aos-animate" data-aos="fade-down">
                  <i class="bi bi-calendar-check"></i>
                  <span id="dateTimeLink"></span>
                </li>
                <li class="nav-item dropdown aos-init aos-animate" data-aos="fade-down">
                  <a href="#" class="btn add-btn goto-btn dropdown-toggle" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false" style="color: #333; background-color: #f8f9fa;">
                    <i class="bi bi-person"></i>
                  </a>
                  <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown" style="background-color: #fff;">
                    <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#changePasswordModal" style="color: #333;"><i class="bi bi-key"></i><span data-i18n="change-password">Change Password</span></a></li>
                    <li><a class="dropdown-item" href="#" id="logout-btn" style="color: #333;"><i class="bi bi-box-arrow-in-right"></i><span data-i18n="logout">Logout</span></a></li>
                  </ul>
                  <style>
                    /* Button hover effect */
                    .goto-btn:hover {
                      background-color: #33208c !important; /* Change this color as desired */
                      color: #007bff !important;
                    }

                    /* Dropdown item hover effect */
                    .dropdown-menu .dropdown-item:hover {
                      background-color: #33208c !important; /* Change this color as desired */
                      color: white !important;
                    }
                      .error {
                          color: red;
                          font-size: 0.9em; /* Optional: adjust font size */
                          margin-top: 5px; /* Optional: add spacing above/below */
                      }

                      /* Optional: style error message for specific fields */
                      #pwd-error, #confirm_pwd-error {
                          display: block; /* Ensures error messages appear on their own line */
                          margin-top: 5px;
                      }
                  </style>
                </li>
              </ul>
                 <header class="pb-0 " id="backtotop">
                <h5 class="text-color d-flex justify-content-between align-items-center">
                    <span class="mb-0 h6" style="margin-left: auto;right: 5px;position: relative;top: 6px;font-size:12px">Data is updated once in a hour; Last updated @
                        <span id="updatedts"></span></span>
                </h5>

            </header>
            </nav>
          </div>
        </header>
        <aside id="sidebar" class="sidebar">
          <ul class="nav nav-pills flex-column mb-auto">
            <ul class="sidebar-nav aos-init aos-animate" id="sidebar-nav" data-aos="fade-left" data-aos-duration="600">
                <!-- <li class="nav-item">
          <a class="nav-link index-link" data-aos="fade-left" data-aos-duration="1000">
            <i class="bi bi-house-fill"></i>
            <span>Home</span>
          </a>
        </li> -->
        
                <li class="nav-item" id="dashboard-details">
                    <a class="nav-link active aos-init aos-animate" href="dashboard.html" data-aos="fade-left"
                        data-aos-duration="600" id="dash-link">
                        <i class="bi bi-speedometer2"></i><span data-i18n="dashboard-link">Dashboard</span></a>
                </li>

                <li class="nav-item" id="scheme-management-details">
                    <a class="nav-link aos-init aos-animate" href="scheme-management.html" data-aos="fade-left"
                        data-aos-duration="600" id="scheme-registration-link">
                        <i class="bi bi-check-square"></i><span data-i18n="scheme-management">Scheme Management</span></a>
                </li>
                <li class="nav-item" id="beneficiary_details">
                    <a class="nav-link aos-init aos-animate" href="index.html" data-aos="fade-left" data-aos-duration="600"
                        id="scheme-registration-link">
                        <i class="bi bi-menu-up"></i><span data-i18n="beneficiary-management">Beneficiary Management</span></a>
                </li>
                <li class="nav-item" id="payment_details">
                    <a class="nav-link aos-init aos-animate"
                        href="pps-tps/ssp-payment-process.html" data-aos="fade-left"
                        data-aos-duration="600" id="payment">
                        <i class="bi bi-person-check"></i><span data-i18n="payment">Payment</span></a>
                </li>
                <li class="nav-item" id="payment_dashboard_details">
                    <a class="nav-link aos-init aos-animate" href="payment-dashboard.html" data-aos="fade-left" data-aos-duration="1000" id="payment-dashboard-link">
                        <i class="bi bi-cash"></i><span data-i18n="payment-dashboard">Payment Dashboard</span></a>
                </li>
                <li class="nav-item" id="institute-eligibility-report">
                
                </li>
                
                <li class="nav-item" id="addmin-report-id">
               
                  
                </li>
                
        <li class="nav-item fee-details-menu" >
         <a class="nav-link aos-init aos-animate" href="complaint.html">
                        <i class="bi bi-cash"></i><span data-i18n="payment-dashboard">Fees complaint report</span></a>
        </li>
        <li class="nav-item fee-details-menu">
            
        </li>
              <li class="nav-item fee-details-menu" >
        
        </li>
           
        

        

<!-- Dropdown 2 (New) -->
<li class="nav-item hid" id="report-id-2">
    <a class="nav-link" href="#">
        <i class="bi bi-columns"></i><span>Institute Reports</span>
    </a>
</li>

<!-- Dropdown 2 items -->
<li class="nav-item d-drops pt-2" data-dropdown="2">
   
       <a class="nav-link aos-init aos-animate" href="student-eligibility-reports.html">
                <i class="bi bi-columns"></i><span data-i18n="Institute-fee-details">Institute-wise Student Report</span>
            </a>
</li>
<li class="nav-item d-drops pt-2" data-dropdown="2">
 <a class="nav-link aos-init aos-animate" href="institute-eligibility-report.html" data-aos="fade-left" data-aos-duration="600">

                    <i class="bi bi-file-earmark-text"></i><span data-i18n="institute-eligibility-report">Students Eligibility Report</span>
                  </a>
</li>
<li class="nav-item d-drops pt-2" data-dropdown="2">
 <a class="nav-link aos-init aos-animate" href="ineligible_student_list.html" data-aos="fade-left" data-aos-duration="600">

                    <i class="bi bi-file-earmark-text"></i><span data-i18n="institute-eligibility-report">Students In Eligibility Report</span>
                  </a>
</li>
<li class="nav-item d-drops pt-2" data-dropdown="2">
     <a class="nav-link aos-init aos-animate" href="student-reports.html" >
                <i class="bi bi-columns"></i><span data-i18n="Institute-fee-details">Eligible Student Status Report</span>
            </a>
</li>
<li class="nav-item d-drops pt-2" data-dropdown="2">
     <a class="nav-link aos-init aos-animate" href="student-linelist.html" >
                <i class="bi bi-columns"></i><span data-i18n="Institute-fee-details">Students Report </span>
            </a>
</li>
<li class="nav-item d-drops pt-2"  data-dropdown="2">
            <a class="nav-link " href="institute_download_reports_all.html" >
                <i class="bi bi-columns"></i><span >Download Reports</span>
            </a>
        </li>

<!-- Dropdown 3 (New) -->
<li class="nav-item hid pt-1" id="report-id-3">
    <a class="nav-link" href="#">
        <i class="bi bi-columns"></i><span>Admin Reports</span>
    </a>
</li>

<!-- Dropdown 3 items -->
<li class="nav-item d-drops pt-1" data-dropdown="3" id="scheme-wise-report-details">
  <a class="nav-link aos-init aos-animate" href="admin-report.html" data-aos="fade-left" data-aos-duration="1000">
                        <i class="bi bi-columns"></i><span data-i18n="admin-report">Scheme-wise Report</span></a>
    
</li>
<li class="nav-item d-drops" data-dropdown="3" id="institute-wise-scheme-report-details">
    <a class="nav-link aos-init aos-animate" href="institute-report.html">
                <i class="bi bi-columns"></i><span data-i18n="institute-report">Institute-wise Scheme Report</span>
            </a>
           
</li>
<li class="nav-item d-drops" data-dropdown="3">
    <a class="nav-link aos-init aos-animate" href="fee-details.html" data-aos="fade-left" data-aos-duration="1000" >
                <i class="bi bi-columns"></i><span data-i18n="fee-details">Fee Details Report</span></a>
</li>
<li class="nav-item d-drops" data-dropdown="3">
    <a class="nav-link aos-init aos-animate" href="institute-fee-status.html" >
                <i class="bi bi-columns"></i><span data-i18n="fee-details">Institute Fee Status Report</span></a>
</li>


<!-- Dropdown 1 (Existing) -->
<li class="nav-item hid pt-1" id="report-id">
    <a class="nav-link" href="#">
        <i class="bi bi-columns"></i><span>Anomalies Report</span>
    </a>
</li>

     <!-- d-none button1 -->
        <li class="nav-item d-drops " data-dropdown="1">
            <a class="nav-link " href="institute-not-eligibile-reports.html">
                <i class="bi bi-columns"></i><span >Institute not eligible in any schemes</span>
            </a>
        </li>
         <!-- d-none button2 -->
        <li class="nav-item d-drops"  data-dropdown="1">
            <a class="nav-link " href="report_2.html" >
                <i class="bi bi-columns"></i><span >Institue atleast
                    entered one schemes</span>
            </a>
        </li>
         <!-- d-none button3 -->
        <li class="nav-item d-drops pb-2"  data-dropdown="1">
            <a class="nav-link " href="report_3.html" >
                <i class="bi bi-columns"></i><span >Colleges which
                    are having not even one student</span>
            </a>
        </li>
           <li class="nav-item d-drops pb-2"  data-dropdown="1">
            <a class="nav-link " href="report_4.html" >
                <i class="bi bi-columns"></i><span >List of Students
                        (with inst details) who had availed benefits in a specific scheme</span>
            </a>
        </li>
        <li class="nav-item d-drops pb-2"  data-dropdown="1">
            <a class="nav-link " href="community_verification_flag.html" >
                <i class="bi bi-columns"></i><span >Community Verification</span>
            </a>
        </li>
        <li class="nav-item d-drops pb-2"  data-dropdown="1">
            <a class="nav-link " href="income_category_cout.html" >
                <i class="bi bi-columns"></i><span >Income Category Count</span>
            </a>
        </li>
        <li class="nav-item d-drops pb-2"  data-dropdown="1">
            <a class="nav-link " href="download_reports.html" >
                <i class="bi bi-columns"></i><span >Download Reports</span>
            </a>
        </li>
            </ul>
        </ul>
    </aside>

    <!-- change password -->
    <div class="modal fade change-password" id="changePasswordModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content"> 
          <div class="modal-header py-2">
            <p class="modal-title mb-0 card-title py-0"><i class="bi bi-key"></i> Change Password</p>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body py-2">
          <div id="password-error" class="error" style="display: none;"></div>
            <form id="change_password_form" novalidate="novalidate">
              <div class="mb-2">
                <label for="old-pwd" class="form-label">Current Password</label>
                <input type="password" id="old-pwd" name="old_pwd" class="form-control form-control w-100" placeholder="Enter Current Password">
              </div>
              <div class="mb-2">
                <label for="pwd" class="form-label">New Password</label>
                <input type="password" id="pwd" name="pwd" class="form-control form-control w-100" placeholder="Enter New Password">
              </div>
              <div class="mb-2">
                <label for="confirm-pwd" class="form-label">Confirm New Password</label>
                <input type="password" id="confirm-pwd" name="confirm_pwd" class="form-control form-control" placeholder="Enter Confirmation Password">
              </div>
            </form>
          </div>
          <div class="modal-footer py-2">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal"><i class="bi bi-x"></i> Close</button>
            <a class="btn btn-success pwd-submit" id="submit_password"><i class="bi bi-check2-circle"></i> Update</a>
          </div>
        </div>
      </div>
    </div>
    <!-- End change password -->
    
   `;

    // // Select the report-id element
    // const reportIdElement = document.getElementById("report-id");

    // // Get the current page URL
    // const currentPageUrl = window.location.pathname; // Use pathname for cleaner comparison

    // // Select all elements with class 'd-drops'
    // const dropsElements = document.querySelectorAll(".d-drops");

    // // Check if any link inside d-drops has an href that matches the current page
    // let anyMatch = false; // Flag to check if any link matches
    // dropsElements.forEach(function (drop) {
    //   const link = drop.querySelector("a");
    //   if (link && currentPageUrl.endsWith(link.getAttribute("href"))) {
    //     anyMatch = true; // Set the flag if there's a match
    //   }
    // });
    // // Get the current page URL path
    // // const currentPageUrl = window.location.pathname;

    // // Select all nav links within your sidebar
    
    // // If any link matches, show all d-drops
    // if (anyMatch) {
    //   dropsElements.forEach(function (drop) {
    //     drop.style.display = "block"; // Show all d-drops elements
    //   });
    // }
   
    // // Add a click event listener to the report-id element
    // reportIdElement.addEventListener("click", function (event) {
    //   // Prevent default link behavior (optional)
    //   event.preventDefault();

    //   // Toggle the display style of each 'd-drops' element
    //   dropsElements.forEach(function (drop) {
    //     if (drop.style.display === "block") {
    //       drop.style.display = "none"; // Hide the element if it's currently displayed
    //     } else {
    //       drop.style.display = "block"; // Show the element if it's currently hidden
    //     }
    //   });
    // });

    // const dropsElement = document.querySelector(".d-drops");

    // // Check if the element is displayed as block
    // if (dropsElement && getComputedStyle(dropsElement).display === "block") {
    //   // Get the element with id 'report-id'
    //   const reportElement = document.getElementById("report-id");

    //   // Find the anchor tag inside the element with id 'report-id'
    //   const navLink = reportElement.querySelector("a.nav-link");

    //   // Check if navLink exists and add the class 'enable'
    //   if (navLink) {
    //     navLink.classList.add("enable");
    //   }
    // }


    document.addEventListener("DOMContentLoaded", function () {
      // Define the dropdowns
      const dropdowns = [
        { id: 'report-id', dropdownClass: '.d-drops[data-dropdown="1"]' },
        { id: 'report-id-2', dropdownClass: '.d-drops[data-dropdown="2"]' },
        { id: 'report-id-3', dropdownClass: '.d-drops[data-dropdown="3"]' }
      ];
    
      // Handle each dropdown independently
      dropdowns.forEach(function(dropdown) {
        const reportIdElement = document.getElementById(dropdown.id);
        const dropsElements = document.querySelectorAll(dropdown.dropdownClass);
    
        // Get the current page URL path
        const currentPageUrl = window.location.pathname;
    
        // Check if any link inside .d-drops matches the current page URL
        const anyMatch = Array.from(dropsElements).some((drop) => {
          const link = drop.querySelector("a");
          return link && currentPageUrl.endsWith(link.getAttribute("href"));
        });
    
        // Show all .d-drops elements if any link matches
        if (anyMatch) {
          dropsElements.forEach((drop) => {
            drop.style.display = "block";
          });
        }
    
        // Add click event listener to toggle visibility of .d-drops for this dropdown
        if (reportIdElement) {
          reportIdElement.addEventListener("click", function (event) {
            event.preventDefault();
    
            // Toggle visibility for each .d-drops element in this dropdown
            dropsElements.forEach((drop) => {
              drop.style.display = drop.style.display === "block" ? "none" : "block";
            });
    
            // Handle active class
            const firstDropVisible =
              dropsElements.length > 0 &&
              getComputedStyle(dropsElements[0]).display === "block";
    
            // Toggle 'enable' class on the nav-link inside #report-id
            const navLink = reportIdElement.querySelector("a.nav-link");
            if (navLink) {
              if (firstDropVisible) {
                navLink.classList.add("enable");
              } else {
                navLink.classList.remove("enable");
              }
            }
          });
        }
    
        // Add 'enable' class to the link inside #report-id if any .d-drops is visible
        const dropsElement = document.querySelector(dropdown.dropdownClass);
        if (dropsElement && getComputedStyle(dropsElement).display === "block") {
          const navLink = reportIdElement.querySelector("a.nav-link");
          if (navLink) {
            navLink.classList.add("enable");
          }
        }
      });
    
      // Handle active state for links based on the current page URL
      const links = document.querySelectorAll('.nav-link');
      // links.forEach((link) => {
      //   const href = link.getAttribute('href');
      //   if (currentPageUrl.endsWith(href)) {
      //     link.classList.add('active');
      //   } else {
      //     link.classList.remove('active');
      //   }
      // });
    });

    AOS.init();
    this.updateInstituteName();
    this.initializeDateTime();
    this.setupLogout();
    this.setActiveLink();
    let roleId = localStorage.getItem("roleId");
    let userId1 = localStorage.getItem("userId");
    if(userId1==null){
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "login.html";
    }
    if (
      roleId == 1 ||
      roleId == 2 ||
      roleId == 3 ||
      roleId == 4 ||
      roleId == 9
    ) {
      $("#institute-eligibility-report").show();
    } else {
      $("#institute-eligibility-report").hide();
    }
    if(roleId == 11){
      $("#payment_dashboard_details,#payment_details,#beneficiary_details,#report-id,#report-id-2,#scheme-management-details").hide();
      // setTimeout(() => {
      //   $("#institute-wise-scheme-report-details,#scheme-wise-report-details").hide();
        
      // }, 100);
    }
    if(roleId == 12){
      $("#payment_dashboard_details,#payment_details,#beneficiary_details,#report-id,#report-id-2,#scheme-management-details").hide();
      $("#addmin-report-id,#institute-report-id,#dashboard-details,#report-id-3").hide();
    }
let roleName = ''; // Variable to store the role name
console.log("rr",roleId);
// Determine role name based on userRole
let  roleId1 = Number(roleId);
switch (roleId1) {
  
  case 1:
    roleName = 'root';
    break;
  case 2:
    roleName = 'State Admin';
    break;
  case 3:
    roleName = 'State User';
    break;
  case 4:
    roleName = 'Department State User';
    break;
  case 5:
    roleName = 'Department Head';
    break;
  case 6:
    roleName = 'Institute';
    break;
  case 7:
    roleName = 'Student';
    break;
  case 8:
    roleName = 'Department User';
    break;
  case 9:
    roleName = 'Department District User';
    break;
  case 10:
    roleName = 'Department State Admin';
    break;
    case 11:
    roleName = 'EDM User';
    break;
    case 12:
    roleName = 'UMIS Complaint';
    break;
  default:
    roleName = 'Unknown role';
    break;
}

// Set the role name as text in #nav-institute
$('#nav-institute').text(roleName);

  }


  async updateInstituteName() {
    const userId = localStorage.getItem("userId");

    let roleId = localStorage.getItem("roleId");
    if (roleId = 3 || roleId == 2) {
      $(".hid").show();
      // $(".hid").hide();
    } else {
      // $(".hid").show();
      $(".hid").hide();
    }
    if (roleId == 2 || roleId == 3 || roleId == 4) {
      $("#addmin-report-id,#institute-report-id").show();
    } else {
      $("#addmin-report-id,#institute-report-id").hide();
    }
    
    if (roleId == 2 || roleId == 3 || roleId == 9 || roleId == 4) {
      $(".fee-details-menu").show();
    } else {
      $(".fee-details-menu").hide();
    }
    
    const userPermissions =
      permissions.roles[roleId] || permissions.roles.default;
    if (!userId) return;
    // try {
    //   const response = await $.ajax({
    //     url: config.ssp_api_url + "/get_scholarship_department",
    //     type: "POST",
    //     headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
    //     data: { user_id: userId, department_id: 1 },
    //   });

    //   if (response.status) {
    //     const departmentName = response.data[0]?.department_name;
    //     const navInstitute = document.getElementById("nav-institute");

    //     if (departmentName) {
    //       //navInstitute.textContent = departmentName;
    //      // navInstitute.title = "Department Name";
    //     }
    //     // if (roleId != 4 && roleId != 5 && roleId != 8) {
    //     //   navInstitute.textContent = userPermissions.name;
    //     //  // navInstitute.title = "User Role";
    //     // }
    //   } else {
    //     console.log(
    //       "Fetch Department Details Failed:",
    //       response.message || "No additional details provided."
    //     );
    //   }
    // } catch (error) {
    //   console.log("Error Fetching Department Details:", error);
    // }
  }


  initializeDateTime() {
    setInterval(() => {
      const now = new Date();
      const options = {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const formattedDate = now
        .toLocaleString("en-IN", options)
        .replace(",", "");
      document.getElementById("dateTimeLink").textContent = formattedDate;
    }, 1000);
  }

  setupLogout() {
    document.getElementById("logout-btn").addEventListener("click", (event) => {
      event.preventDefault();
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "login.html";
    });
  }

  setActiveLink() {
    const currentPath = window.location.pathname.split("/").pop(); // Get the last segment of the path

    // Select links from both .sidebar-nav and #side-menu-drop
    const navLinks = this.querySelectorAll(
      "#side-menu-drop ul li.nav-item .nav-link, .sidebar-nav .nav-link"
    );

    navLinks.forEach((link) => {
      const linkPath = link.getAttribute("href").split("/").pop(); // Get the last segment of the link href
      if (linkPath === currentPath) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }
}

customElements.define("header-component", Headerr);
 var timestamp={ user_id: 1, table_id: 1 };
$.ajax({
  type: "POST",
  headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
  url: "https://umisfees.tnega.org/backend/api/v1/institute/get_summary_updated_ts",
  data: { data: encryptData(timestamp)},
  dataType: "json",
  success: function (response) {
    response.data=  decryptData(response.data);
    var updated_time = response.data[0].updatedts;
    // Split date and time
    var parts = updated_time.split(" ");
    var datePart = parts[0];
    var timePart = parts[1];

    var dateArray = datePart.split("-");
    var reversedDate = dateArray.reverse().join("/");
    function extractTime(timePart) {
      const timeParts = timePart.split(".")[0];
      return timeParts;
    }
    const formattedTime = extractTime(timePart);
    var formattedTimestamp = reversedDate + " " + formattedTime;
    $("#updatedts").html(formattedTimestamp);
  },
  error: function (error) {},
});
$("#submit_password").click(function (e) {
  e.preventDefault();

  // Custom validation methods
  $.validator.addMethod(
    "passwordMatch",
    function (value, element) {
      return this.optional(element) || $("#pwd").val() === value;
    },
    "Passwords do not match."
  );

  $.validator.addMethod(
    "passwordComplexity",
    function (value, element) {
      return (
        this.optional(element) ||
        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(
          value
        )
      );
    },
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
  );

  // Custom validation to check that old and new passwords are not the same
  $.validator.addMethod(
    "passwordNotSame",
    function (value, element) {
      return this.optional(element) || $("#old-pwd").val() !== value;
    },
    "New password cannot be the same as the old password."
  );

  // Initialize form validation
  $("#change_password_form").validate({
    rules: {
      old_pwd: {
        required: true,
      },
      pwd: {
        required: true,
        minlength: 8,
        passwordComplexity: true,
        passwordNotSame: true, // Apply custom validation
      },
      confirm_pwd: {
        required: true,
        minlength: 8,
        passwordMatch: true,
      },
    },
    messages: {
      old_pwd: {
        required: "Please enter your current password.",
      },
      pwd: {
        required: "Please enter your new password.",
        minlength: "Your password must be at least 8 characters long.",
        passwordComplexity:
          "Your password must include at least one uppercase letter, one lowercase letter, one numeric digit, and one special character.",
        passwordNotSame: "New password cannot be the same as the old password.",
      },
      confirm_pwd: {
        required: "Please confirm your new password.",
        minlength:
          "Your confirmation password must be at least 8 characters long.",
        passwordMatch: "Passwords do not match.",
      },
    },
    submitHandler: function (form) {
      var new_password = $("#pwd").val();
      var old_password = $("#old-pwd").val();

      // AJAX call to server
      $.ajax({
        url: config.ssp_api_url + "/department/change_password",
        type: "POST",
        headers: { "X-APP-KEY": "te$t", "X-APP-NAME": "te$t" },
        data: {
          user_id: localStorage.getItem("userId"),
          old_password: old_password,
          new_password: new_password,
        },
        success: function (response) {
          if (response.success == 1) {
            $("#changePasswordModal").modal("hide");
            $("#change_password_form")[0].reset(); // Reset all form fields
            $("#change_password_form").validate().resetForm(); // Reset validation messages
            Swal.fire({
              icon: "success",
              title: "Password Updated Successfully",
              showConfirmButton: false,
              timer: 1000,
              timerProgressBar: false,
            });
          } else {
            $("#password-error").text(response.message).show();
            setTimeout(function () {
              $("#password-error").hide();
            }, 3000);
          }
        },
        error: function (xhr, status, error) {
          let errorMessage = "Password Updation Failed!";
          if (xhr.status === 0) {
            errorMessage =
              "Network error. Please check your connection and try again.";
          } else if (xhr.status >= 500) {
            errorMessage = "Server error. Please try again later.";
          } else if (xhr.status >= 400) {
            errorMessage = xhr.responseJSON
              ? xhr.responseJSON.message
              : "Request error.";
          }
          Swal.fire({
            icon: "success",
            title: "Password Updation Failed!",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: false,
          });
          console.log("Error:", errorMessage);
        },
      });
    },
  });

  // Trigger validation
  $("#change_password_form").submit();
});
