
class HeaderSidebar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
        <!-- Header -->
        <header id="header" class="header fixed-top d-flex align-items-center">
          <!--<div class="gigw d-flex flex-row">
            <div class="btn btn-sm">
              <i class="bi bi-translate mx-3" id="langToggle" onclick="switchLang()">&nbsp;தமிழ்</i>
            </div>
          </div>-->
          <div class="d-flex align-items-center justify-content-between">
            <i class="bi bi-list toggle-sidebar-btn"></i>
            <a href="" class="logo d-flex align-items-center mx-2">
              <img src="../institute/assets/img/tn_logo.png" alt="logo" class="logo_header">
              <span class="fs-4 title">Tamil Nadu Integrated State Scholarship Portal</span>
            </a>
          </div>
          <nav class="header-nav ms-auto mx-2" style="width:68%;">
            <ul class="d-flex align-items-center justify-content-end">
              <li class="nav-item">
                <a class="nav-link mx-2 nav-profile"><i class="bi bi-person"></i> <span id='nav-hod'>HOD Name</span></a>
              </li>
              <li class="nav-item">
                <i class="bi bi-calendar-check"></i>
                <span class="" id="dateTimeLink">-</span>
              </li>
            </ul>
            <div class="marquee-container">
          <!--<div class="marquee-text">
            The last date to apply for the AY 2024-2025 Post Matric Scholarship Scheme for SC/SCC/ST has been extended to 10-06-2025. No further applications will be accepted after this date. <span style="color: blue;">The last date to apply for PM YASASVI 2024-2025 Post Matric Scholarship Scheme for OBC's/EBC's/DNT's is on 31-05-2025. No further applications will be received.</span>
          </div>-->
        </div>
          </nav>
        </header>
  
     
        <aside id="sidebar" class="sidebar">
          <ul class="nav nav-pills flex-column mb-auto sidebar-nav" id="sidebar-nav">
            <li class="nav-item">
              <a class="nav-link" href="dashboard.html" id="dashboard-link">
                <i class="bi bi-house-fill"></i>
                <span data-i18n='dashboard-link'>Dashboard</span>
              </a>
            </li>
           
                  
            
            <li class="nav-item">
              <a class="nav-link" href="fees_generic_report.html" id="report-link">
                <i class="bi bi-card-checklist"></i>
                <span data-i18n='fee-report'>Fees Report</span>
              </a>
            </li>
             <li class="nav-item sub_menu_wrap">
            <a class="nav-link collapsed" data-bs-toggle="collapse" data-bs-target="#fixed-reports-submenu" aria-expanded="false">
              <i class="bi bi-bookmark-star"></i>
              <span>Scholarship Reports</span>
              <i class="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul id="fixed-reports-submenu" class="collapse list-unstyled">
              <!-- Fixed preferences (type: 1) will be dynamically populated here -->
            </ul>
          </li>
          <li class="nav-item sub_menu_wrap">
            <a class="nav-link collapsed" data-bs-toggle="collapse" data-bs-target="#custom-reports-submenu" aria-expanded="false">
              <i class="bi bi-bookmark-heart"></i>
              <span>Custom Reports</span>
              <i class="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul id="custom-reports-submenu" class="collapse list-unstyled">
              <!-- Custom preferences (type: 4) will be dynamically populated here -->
            </ul>
          </li>
          <li class="nav-item" id="download_reports">
                    <a class="nav-link aos-init aos-animate" href="download_report.html" data-aos="fade-left" data-aos-duration="600" id="download_report-link">
                        <i class="bi bi-check-square"></i><span data-i18n="scheme-management">Download Report</span></a>
                </li>
            <!-- ADMIN REPORT NAV MENU -->
            <li class="nav-item sub_menu_wraps" >
            <a class="nav-link collapsed" data-bs-toggle="collapse" data-bs-target="#ppstps-submenu" aria-expanded="false">
              <i class="bi bi-card-list"></i>
              <span data-i18n='admin-report-text'>PPSTPS Details</span>
              <i class="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul id="ppstps-submenu" class="collapse list-unstyled">
              <li class="nav-item">
                <a class="nav-link" href="pps-tps-summary.html" id="ppstps-summary-link">
                  <i class="bi bi-columns"></i>PPS/TPS Dashboard
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="pps-tps-reports.html" id="ppstps-reports-link">
                  <i class="bi bi-card-list"></i>
                  Reports
                </a>
              </li>
               <li class="nav-item">
                    <a class="nav-link" href="pps-tps-download-report.html" id="ppstps-download-report-link">
                        <i class="bi bi-file-earmark-text"></i>Download Reports
                    </a>
                </li>

            </ul>
          </li>
          </ul>
        </aside>
  
        <style>
          /* Active link styles */
          .nav-link.active {
            color: #33208c;
            font-weight: bold;
          }
  
          /* Background color for active submenu items */
          .sidebar .nav-item.active > .nav-link {
            background-color: #33208c; /* Background color for active link */
            color: white; /* Text color when active */
          }
  
          /* Background color for the submenu when expanded */
          .sidebar .collapse.show {
           background-color: #d9dfff;
                border-radius: 4px;
          }
                ul#report-submenu {
    margin-left: 25px;
}
    .sub_menu_wrap li a {
    font-size: 13px !important;
     padding: 5px 15px;
}
    .sub_menu_wrap li  {
    border-bottom: 1px solid #ffffff;
    }
  
          /* Change background when hovering over submenu links */
          .sidebar .nav-item .nav-link:hover {
            background-color: #33208c; /* Background color on hover */
            color: white; /* Text color on hover */
          }
  
          /* Background color for collapsed submenu link */
          
        </style>
      `;

    this.setActiveLink();
    this.addLinkEventListeners(); // Initialize event listeners for links
  }

  // Method to handle active link selection
  setActiveLink() {
    const currentUrl = window.location.href;
    const urlParams = new URLSearchParams(window.location.search);
    const prefId = urlParams.get('id');
    const prefType = urlParams.get('type');
    const details = this.getUrlKey();

    // Handle generic_report.html with id and type (saved preference)
    if (currentUrl.includes("generic_report.html") && prefId && prefType) {
      // Find the correct submenu
      const submenuId = prefType === 'fixed' ? 'fixed-reports-submenu' : 'custom-reports-submenu';
      // Try both id selectors for backward compatibility
      let prefLink = document.querySelector(`#bkmark-${prefId}`);
      if (!prefLink) {
        prefLink = document.querySelector(`#saved-view-${prefId}`);
      }
      if (prefLink) {
        prefLink.classList.add("active");
        // Expand the submenu
        const submenu = prefLink.closest(`#${submenuId}`);
        if (submenu) submenu.classList.add("show");
        // Remove collapsed from parent
        const parentLink = submenu.closest("li.nav-item").querySelector(".nav-link.collapsed");
        if (parentLink) parentLink.classList.remove("collapsed");
      }
    }

    // Handle generic_report.html with only details param (default)
    if (
      currentUrl.includes("generic_report.html") &&
      !prefId &&
      !prefType
    ) {
      // Mark the default link as active
      // Find the default link in both submenus
      const defaultLinks = [
        document.querySelector('#fixed-reports-submenu .nav-link[href="generic_report.html"]:not([data-pref-id])'),
        document.querySelector('#custom-reports-submenu .nav-link[href="generic_report.html"]:not([data-pref-id])')
      ];
      defaultLinks.forEach(link => {
        if (link) {
          link.classList.add("active");
          // Expand the submenu
          const submenu = link.closest(".collapse");
          if (submenu) submenu.classList.add("show");
          // Remove collapsed from parent
          const parentLink = submenu.closest("li.nav-item").querySelector(".nav-link.collapsed");
          if (parentLink) parentLink.classList.remove("collapsed");
        }
      });
    }

    // Map for other nav links
    const urlToNavMap = {
      "dashboard.html": "dashboard-link",
      "approve-list.html": "approve-list-link",
      "student_apply.html": "student-apply-link",
      "download_report.html": "download_report-link",
      "all_schemes.html": "all-schemes-link",
      "student-eligibility-reports.html": "student-eligibility-reports-html",
      "institute-eligibility-report.html": "institute-eligibility-report-link",
      "ineligible_student_list.html": "ineligible-student-list-link",
      "student-reports.html": "student-reports-link",
      "student-linelist.html": "student-linelist-link",
      "institute_download_reports_all.html": "institute-download-reports-link",
      "search.html": "search-link",
      "fees_generic_report.html": "report-link",
      "fees.html": "fees-link",
      "view_eligible_scholarship_report.html": "fee-component-report-link",
      "view_institute_schemewise_report.html": "scholarship-report-link",
      "view_institute_fee_summary.html": "fee-summary-reports-link",
      "rejected-student-list.html": "rejected-student-link",
      "payment_dashboard_report.html": "payments",
      "overall-scholarship-list.html": "overall-scholarship-link",
      'download_reports.html': 'download_reports',
      'grievance-reports.html': 'grievance-link',
      'pps-tps-reports.html': 'ppstps-reports-link',
      'pps-tps-summary.html': 'ppstps-summary-link',
      'pps-tps-download-report.html' : 'ppstps-download-report-link',
    };

    Object.keys(urlToNavMap).forEach((page) => {
      if (currentUrl.includes(page)) {
        const linkId = urlToNavMap[page];
        const linkElement = document.getElementById(linkId);
        if (linkElement) {
          linkElement.classList.add("active");
          // Expand the submenu if necessary
          const submenu = linkElement.closest(".collapse");
          if (submenu) submenu.classList.add("show");
          const parentLink = linkElement
            .closest("li.nav-item")
            .querySelector(".nav-link.collapsed");
          if (parentLink) parentLink.classList.remove("collapsed");
        }
      }
    });
  }

  // Method to handle link redirection on click
  addLinkEventListeners() {
    const links = document.querySelectorAll('.nav-link');
    const urlKey = this.getUrlKey();

    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href) return;

        e.preventDefault(); // Prevent default navigation

        let fullUrl;
        const baseUrl = window.location.origin;
        const pathName = window.location.pathname;
        const currentDir = pathName.substring(0, pathName.lastIndexOf('/'));

        // Handle absolute paths (starting with '/')
        if (href.startsWith('/')) {
          fullUrl = baseUrl + href;
        }
        // Handle relative URLs
        else {
          // If href starts with '../', resolve it relative to the current directory
          if (href.startsWith('../')) {
            const parentDir = currentDir.substring(0, currentDir.lastIndexOf('/')) || '';
            fullUrl = baseUrl + parentDir + '/' + href.substring(3);
          } else {
            // Handle simple relative paths like 'index.html'
            fullUrl = baseUrl + currentDir + '/' + href.split('/').pop();
          }
        }

        // Always append details param for generic_report.html (default and saved)
        if (href === "generic_report.html") {
          fullUrl += fullUrl.includes('?') ? `&details=${urlKey}` : `?details=${urlKey}`;
        } else {
          // Append details param for other links if not already present
          if (urlKey && !fullUrl.includes('details=')) {
            fullUrl += fullUrl.includes('?') ? `&details=${urlKey}` : `?details=${urlKey}`;
          }
        }

        // Append id/type for saved preferences
        const prefId = link.getAttribute('data-pref-id');
        const prefType = link.getAttribute('data-pref-type');
        if (prefId && prefType) {
          fullUrl += `&id=${encodeURIComponent(prefId)}&type=${encodeURIComponent(prefType)}`;
        }

        // Navigate to the constructed URL
        window.location.href = fullUrl;
      });
    });

    // Handle delete preference buttons
    this.querySelectorAll('.delete-pref').forEach(btn => {
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const prefId = btn.getAttribute('data-pref-id');
        this.deletePreference(prefId);
      });
    });
  }

  getUrlKey() {
    const queryString = window.location.search;
    // Extract the raw details parameter to avoid decoding
    const detailsMatch = queryString.match(/[?&]details=([^&]*)/);
    let details = detailsMatch ? detailsMatch[1] : '';
    // Ensure no spaces or invalid characters
    details = details.replace(/\s+/g, ''); // Remove unexpected spaces
    // console.log('Received encrypted (details):', details);
    return details;
  }

  deletePreference(prefId) {
    Swal.fire({
      title: 'Delete Preference?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          url: config.ssp_api_url + '/delete_user_preference',
          headers: { 'X-APP-KEY': 'te$t', 'X-APP-NAME': 'te$t' },
          type: 'POST',
          data: {
            data: encryptData({
              user_id: userId,
              preference_id: prefId
            })
          },
          success: (response) => {
            if (response.success) {
              Swal.fire(
                'Deleted!',
                'Preference has been deleted.',
                'success'
              );
              const headerSidebar = document.querySelector('custom-header-sidebar');
              if (headerSidebar && typeof headerSidebar.populateReportSubmenus === 'function') {
                headerSidebar.populateReportSubmenus(userId);
              }
            } else {
              Swal.fire(
                'Error!',
                'Failed to delete preference.',
                'error'
              );
            }
          },
          error: (xhr, status, error) => {
            console.error('Error deleting preference:', error);
            Swal.fire(
              'Error!',
              'Failed to delete preference.',
              'error'
            );
          }
        });
      }
    });
  }

  populateReportSubmenus(userId) {
    const submenus = [
      { id: 'fixed-reports-submenu', type: 3, typeName: 'fixed' },
      { id: 'custom-reports-submenu', type: 4, typeName: 'custom' }
    ];

    submenus.forEach(submenu => {
      const submenuElement = document.getElementById(submenu.id);
      submenuElement.innerHTML = `
        <li class="nav-item">
          <div class="text-center py-2">
            <div class="spinner-border spinner-border-sm text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </li>
      `;

      $.ajax({
        url: config.ssp_api_url + '/get_user_preference',
        headers: { 'X-APP-KEY': 'te$t', 'X-APP-NAME': 'te$t' },
        type: 'POST',
        data: {
          data: encryptData({ user_id: userId, type: submenu.type })
        },
        success: (response) => {
          if (!response.success || !response.data) {
            submenuElement.innerHTML = `
              <li class="nav-item">
                <div class="text-center py-2 text-muted">
                  <i class="bi bi-bookmark fs-5"></i>
                  <p class="mb-0">No ${submenu.typeName} reports</p>
                </div>
              </li>
            `;
            return;
          }

          try {
            const preferences = decryptData(response.data);
            submenuElement.innerHTML = '';

            if (!preferences.length) {
              submenuElement.innerHTML = `
               <li class="nav-item d-flex align-items-center">
                  <a class="nav-link flex-grow-1" href="generic_report.html">
                    <i class="bi bi-bookmark-check"></i>
                    <span>Default</span>
                  </a>
                </li> 
              `;
            }

            preferences.forEach(pref => {
              submenuElement.innerHTML += `
                <li class="nav-item d-flex align-items-center">
                  <a class="nav-link flex-grow-1" href="generic_report.html" id="bkmark-${pref.id}" data-pref-id="${pref.id}" data-pref-type="${submenu.typeName}">
                    <i class="bi bi-bookmark-check"></i>
                    <span>${pref.preference_name}</span>
                  </a>
                  
                </li>
              `;
            });

            this.setActiveLink();
            this.addLinkEventListeners();
          } catch (e) {
            console.error(`Error processing ${submenu.typeName} preferences:`, e);
            submenuElement.innerHTML = `
              <li class="nav-item">
                <div class="text-center py-2 text-danger">
                  <i class="bi bi-exclamation-triangle fs-5"></i>
                  <p class="mb-0">Error loading ${submenu.typeName} reports</p>
                </div>
              </li>
            `;
          }
        },
        error: (xhr, status, error) => {
          console.error(`Error fetching ${submenu.typeName} preferences:`, error);
          submenuElement.innerHTML = `
            <li class="nav-item">
              <div class="text-center py-2 text-danger">
                <i class="bi bi-exclamation-triangle fs-5"></i>
                <p class="mb-0">Error loading ${submenu.typeName} reports</p>
              </div>
            </li>
          `;
        }
      });
    });
  }
}

customElements.define("custom-header-sidebar", HeaderSidebar);
