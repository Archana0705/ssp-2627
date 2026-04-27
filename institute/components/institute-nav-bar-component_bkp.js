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
            <span class="fs-4 title">Unified State Scholarship Portal</span>
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
          <div class="marquee-container"></div>
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
            <a class="nav-link" href="all_schemes.html" id="all-schemes-link">
              <i class="bi bi-grid-fill"></i>
              <span data-i18n='all-scheme-text'>Scheme Overview</span>
            </a>
          </li>

         
          <li class="nav-item">
                <a class="nav-link" href="../report.html" id="report-link">
                  <i class="bi bi-card-checklist"></i>
                  <span data-i18n='fee-report'>Fees Report</span>
                </a>
              </li>
         
         
          <li class="nav-item sub_menu_wrap">
            <a class="nav-link collapsed" data-bs-toggle="collapse" data-bs-target="#fixed-reports-submenu" aria-expanded="false">
              <i class="bi bi-bookmark-star"></i>
              <span>Reports</span>
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
        </ul>
      </aside>

      <style>
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
          background-color: transparent;
          color: #333;
        }
      </style>
    `;

    this.setActiveLink();
    this.addLinkEventListeners();
    this.populateReportSubmenus();
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
      "../report.html": "report-link",
      "../index.html": "fees-link"
    };

    // Handle generic_report.html with id and type
    if (currentUrl.includes("generic_report.html") && prefId && prefType && details) {
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
        e.preventDefault();

        const href = link.getAttribute('href');
        if (!href) return;

        // Handle absolute URLs
        if (href.includes('://')) {
          window.location.href = href;
          return;
        }

        // Construct base URL
        const pathName = window.location.pathname;
        const baseUrl = window.location.origin + pathName.substring(0, pathName.lastIndexOf('/'));

        // Handle relative URLs
        let fullUrl;
        if (href.startsWith('../')) {
          fullUrl = baseUrl + '/' + href.substring(3);
        } else {
          fullUrl = baseUrl + '/' + href.split('/').pop();
        }

        // Add details parameter
        fullUrl += fullUrl.includes('?') ? `&details=${urlKey}` : `?details=${urlKey}`;

        // Add id and type for preference links
        const prefId = link.getAttribute('data-pref-id');
        const prefType = link.getAttribute('data-pref-type');
        if (prefId && prefType) {
          fullUrl += `&id=${prefId}&type=${prefType}`;
        }

        window.location.href = fullUrl;
      });
    });
  }

  getUrlKey() {
    const departmentInfo = JSON.parse(localStorage.getItem('departmentInfo') || '{}');
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('details') || departmentInfo.urlKey || '';
  }

  populateReportSubmenus() {
    console.trace("populateReportSubmenus called");
    const userId = JSON.parse(localStorage.getItem('departmentInfo') || '{}').userId || 1;
    const submenus = [
      { id: 'fixed-reports-submenu', type: 1, typeName: 'fixed' },
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
                <li class="nav-item">
                  <div class="text-center py-2 text-muted">
                    <i class="bi bi-bookmark fs-5"></i>
                    <p class="mb-0">No ${submenu.typeName} reports</p>
                  </div>
                </li>
              `;
              return;
            }

            preferences.forEach(pref => {
              submenuElement.innerHTML += `
  <li class="nav-item">
    <a class="nav-link" href="generic_report.html" id="saved-view-${pref.id}" data-pref-id="${pref.id}" data-pref-type="${submenu.typeName}">
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