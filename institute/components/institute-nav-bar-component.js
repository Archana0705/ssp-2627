class HeaderSidebar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <!-- Header -->
      <header id="header" class="header fixed-top d-flex align-items-center">
        <div class="d-flex align-items-center justify-content-between">
          <i class="bi bi-list toggle-sidebar-btn"></i>
          <a href="index.html" class="logo d-flex align-items-center mx-2">
            <img src="assets/img/tn_logo.png" alt="logo" class="logo_header">
            <span class="fs-4 title">Tamil Nadu Integrated State Scholarship Portal</span>
          </a>
        </div>
        <nav class="header-nav ms-auto mx-2" style="width:68%;">
          <ul class="d-flex align-items-center justify-content-end">
            <li class="nav-item">
              <a class="nav-link mx-2 nav-profile"><span id='nav-institute'>User role</span></a>
            </li>
            <li class="nav-item">
              <a class="nav-link mx-2 nav-profile"><i class="bi bi-person"></i> <span id='nav-university'>User role</span></a>
            </li>
            <li class="nav-item">
              <i class="bi bi-calendar-check"></i>
              <span class="" id="dateTimeLink">-</span>
            </li>
          </ul>
         <div class="notice-wrapper">
    <div class="notice-text">
        📢 <b>Important Announcement:</b>
        The last date to apply for the
        <b>PM YASASVI 2025–2026 Post Matric Scholarship Scheme (BCs / MBCs / DNCs)</b>
        has been extended to
        <span class="date">21-01-2026</span>.
        ❗ No further applications will be accepted after this date.
    </div>
</div>

  </nav>
      </header>

      <!-- Sidebar -->
      <aside id="sidebar" class="sidebar">
        <ul class="nav nav-pills flex-column mb-auto sidebar-nav" id="sidebar-nav">
          <li class="nav-item">
            <a class="nav-link" href="dashboard.html" id="dashboard-link">
              <i class="bi bi-house-fill"></i>
              <span data-i18n='dashboard-link'>Dashboard</span>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link index-link" href="../index.html" id="fees-link">
              <i class="bi bi-pencil-square"></i> 
              <span data-i18n='fee-list'>Fees Entry</span>
            </a>
          </li>
           <li class="nav-item">
            <a class="nav-link index-link" href="special_scheme_fee.html" id="special-scheme-fees-link">
              <i class="bi bi-pencil-square"></i> 
              <span data-i18n='fee-list'>Transport Fees Entry</span>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="beneficiary_management.html" id="approve-list-link">
              <i class="bi bi-graph-up"></i>
              <span data-i18n='student-management'>Scholarship Management</span>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="search.html" id="search-link">
              <i class="bi bi-search"></i>
              <span data-i18n='search-text'>Search</span>
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
              <span style="">Reports</span>
              <i class="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul id="fixed-reports-submenu" class="collapse list-unstyled">
              <!-- Fixed preferences (type: 2) will be dynamically populated here -->
            </ul>
          </li>
          <li class="nav-item sub_menu_wrap">
            <a class="nav-link collapsed" data-bs-toggle="collapse" data-bs-target="#custom-reports-submenu" aria-expanded="false">
              <i class="bi bi-bookmark-heart"></i>
              <span style="">Custom Reports</span>
              <i class="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul id="custom-reports-submenu" class="collapse list-unstyled">
              <!-- Custom preferences (type: 4) will be dynamically populated here -->
            </ul>
          </li>
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
            </ul>
          </li>
        </ul>
      </aside> 

      <style>
      .notice-wrapper {
    width: 100%;
    overflow: hidden;
    background: #fff3f3;
    // border-top: 1px solid #f44336;
    // border-bottom: 1px solid #f44336;
}

.notice-text {
    display: inline-block;
    white-space: nowrap;
    padding-left: 100%;
    font-size: 13px;
    color: #b71c1c;
    animation: scroll-left 30s linear infinite;
}

/* Stop animation on hover */
.notice-wrapper:hover .notice-text {
    animation-play-state: paused;
}

.date {
    background: #ffeb3b;
    padding: 2px 6px;
    font-weight: bold;
    color: #000;
    border-radius: 3px;
}

// /* Scrolling animation */
// @keyframes scroll-left {
//     0% {
//         transform: translateX(0);
//     }
//     100% {
//         transform: translateX(-100%);
//     }
// }



        /* Active link styles */
        .nav-link.active {
          color: #33208c;
          font-weight: bold;
        }

        /* Background color for active top-level menu items */
        .sidebar .nav-item.active > .nav-link {
          background-color: #33208c;
          color: white;
        }

        /* Background color for active submenu items */
        .sidebar .collapse .nav-link.active {
          background-color: #e6e9ff;
          color: #33208c;
        }

        /* Background color for submenu when expanded */
        .sidebar .collapse.show {
          background-color: #d9dfff;
          border-radius: 4px;
        }

        /* Styling for submenu items */
        .sub_menu_wrap li a {
          font-size: 13px !important;
          padding: 5px 15px;
        }

        /* Indentation for submenus */
        ul#report-submenu,
        ul#fixed-reports-submenu,
        ul#custom-reports-submenu {
          margin-left: 25px;
        }

        /* Border for submenu items */
        .sub_menu_wrap li {
          border-bottom: 1px solid #ffffff;
        }

        /* Hover effect for nav links */
        .sidebar .nav-item .nav-link:hover {
          background-color: #33208c;
          color: white;
        }

        /* Style for collapsed submenu link */
        .sidebar .nav-item > .nav-link.collapsed {
          // background-color: transparent;
          color: #33208c;
        }
      </style>
    `;

    this.setActiveLink();
    this.addLinkEventListeners();
  }

  setActiveLink() {
    const currentUrl = window.location.href;
    const urlParams = new URLSearchParams(window.location.search);
    const prefId = urlParams.get('id');
    const prefType = urlParams.get('type');
    const details = this.getUrlKey();

    // Handle generic_report.html with id and type
    if (currentUrl.includes("generic_report.html") && prefId && prefType) {
      const submenuId = prefType === 'fixed' ? 'fixed-reports-submenu' : 'custom-reports-submenu';
      const prefLink = document.querySelector(`#saved-view-${prefId}`);
      if (prefLink) {
        prefLink.classList.add("active");
        const submenu = prefLink.closest(`#${submenuId}`);
        if (submenu) submenu.classList.add("show");
        const parentLink = submenu.closest("li.nav-item").querySelector(".nav-link.collapsed");
        if (parentLink) parentLink.classList.remove("collapsed");
      }
    }

    const urlToNavMap = {
      "dashboard.html": "dashboard-link",
      "beneficiary_management.html": "approve-list-link",
      "student_apply.html": "student-apply-link",
      "report-list.html": "report-list-link",
      "all_schemes.html": "all-schemes-link",
      "student-reports.html": "student-reports-link",
      "rejected-student-list.html": "rejected-student-link",
      "payment_dashboard_report.html": "payments",
      "search.html": "search-link",
      "generic_report.html": "generic_report-link",
      "fees_generic_report.html": "report-link",
      "../index.html": "fees-link",
      "../special_scheme_fee.html": "special-scheme-fees-link",
      'pps-tps-reports.html': 'ppstps-reports-link',
      'pps-tps-summary.html': 'ppstps-summary-link',
    };

    // Handle other pages
    Object.keys(urlToNavMap).forEach((page) => {
      if (currentUrl.includes(page)) {
        const linkId = urlToNavMap[page];
        const linkElement = document.getElementById(linkId);
        if (linkElement) {
          linkElement.classList.add("active");
          const submenu = linkElement.closest(".collapse");
          if (submenu) submenu.classList.add("show");
          const parentLink = linkElement.closest("li.nav-item").querySelector(".nav-link.collapsed");
          if (parentLink) parentLink.classList.remove("collapsed");
        }
      }
    });
  }

  addLinkEventListeners() {
    const links = document.querySelectorAll('.nav-link');
    const urlKey = this.getUrlKey();

    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href) return;

        e.preventDefault(); // Prevent default navigation

        let fullUrl;
        const baseUrl = window.location.origin; // Use the origin as the base
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

        // Append query parameters without re-encoding details
        console.log('Original encrypted (details):', urlKey);
        // Ensure details is appended as-is
        fullUrl += fullUrl.includes('?')
          ? `&details=${urlKey}`
          : `?details=${urlKey}`;
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
  } getUrlKey() {
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
      { id: 'fixed-reports-submenu', type: 2, typeName: 'fixed' },
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
            submenuElement.innerHTML += `
            <li class="nav-item d-flex align-items-center">
              <a class="nav-link flex-grow-1" href="institute/generic_report.html">
                <i class="bi bi-bookmark-check"></i>
                <span >Default</span>
              </a>
             
            </li>
          `;

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
              submenuElement.innerHTML += `
              <li class="nav-item d-flex align-items-center">
                <a class="nav-link flex-grow-1" href="institute/generic_report.html">
                  <i class="bi bi-bookmark-check"></i>
                  <span >Default</span>
                </a>
               
              </li>
            `;
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
            submenuElement.innerHTML += `
                <li class="nav-item d-flex align-items-center">
                  <a class="nav-link flex-grow-1" href="institute/generic_report.html">
                    <i class="bi bi-bookmark-check"></i>
                    <span >Default</span>
                  </a>
                 
                </li>
              `;

            preferences.forEach(pref => {
              submenuElement.innerHTML += `
                <li class="nav-item d-flex align-items-center">
                  <a class="nav-link flex-grow-1" href="generic_report.html" id="bkmark-${pref.id}" data-pref-id="${pref.id}" data-pref-type="${submenu.typeName}">
                    <i class="bi bi-bookmark-check"></i>
                    <span >${pref.preference_name}</span>
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