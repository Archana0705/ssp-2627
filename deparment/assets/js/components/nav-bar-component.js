class Header extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {

  this.innerHTML = `
  <header id="header" class="app-header fixed-top">
    <div class="header-left d-flex align-items-center gap-2">
      <div class="sidebar-toggle" id="sidebarToggle">
        <i class="bi bi-list"></i>
      </div>
      <a href="#" class="logo d-flex align-items-center">
        <img src="../../assets/img/tn_logo.png" class="logo_header">
        <div class="ms-2">
          <div class="title">Tamil Nadu Integrated State Scholarship Portal</div>
          <small class="subtitle">Government of Tamil Nadu</small>
        </div>
      </a>
    </div>
    <div class="header-right">
      <div class="header-tools">
        <div class="header-time">
          <i class="bi bi-clock"></i><span id="dateTimeLink">13/03/2026 14:31:15</span>
        </div>
        <div class="profile-menu">
          <div class="profile-trigger">
            <div class="avatar">
              <i class="bi bi-person"></i>
            </div>
            <span id="stud_name">M SAM</span>
            <a href="#"><i class="bi bi-box-arrow-right"></i> Logout</a>
          </div>
        </div>
      </div>
    </div>
  </header>
<!-- ======================================================== -->
  <aside id="sidebar" class="app-sidebar">
    <ul class="sidebar-nav">
      <li class="nav-item">
        <a class="nav-link active" href="scheme-register.html" id="applied-schemes-link">
          <i class="bi bi-plus-square"></i>
          <span>Add Scheme</span>
        </a>
      </li>

      <li class="nav-item">
        <a class="nav-link" href="schemes.html" id="all-schemes-link">
          <i class="bi bi-journal-text"></i>
          <span>Schemes List</span>
        </a>
      </li>

    </ul>
  </aside>  

`;
    }
  }  
  customElements.define('ssp-header', Header);
  