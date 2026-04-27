class SSPHeaderr extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
        <header id="header" class="header fixed-top d-flex flex-column">

          <div class="d-flex flex-row align-items-center w-100">
            <div class="d-flex align-items-center justify-content-between">
              <i class="bi bi-list toggle-sidebar-btn"></i>
              <a href="#" class="logo d-flex align-items-center mx-2 aos-init aos-animate" data-aos="fade-down">
                <img src="../../assets/img/tn_logo.png" alt="logo" class="logo_header">
                <span class="no-web">Unified State Scholarship & Benefit Portal</span>
                
              </a>
            </div>
            <nav class="header-nav ms-auto mx-2">
         
              <ul class="d-flex align-items-end no-web" style="justify-content: right;">
               
                <li class="nav-item aos-init aos-animate" data-aos="fade-down">
                  <span id="dateTimeLink"></span>
                </li>
                  
                
                <li class="nav-item dropdown d-flex align-items-start pt-2">
                  <a href="#" class="btn add-btn1 goto-btn1 dropdown-toggle" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="bi bi-person"></i> <span class="ms-1" id="official_username">Jayachandran Mani</span>
                  </a>
                  <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown" style="background-color: #fff !important; color: #33208c;">
                    <li style="border-bottom: 1px solid #ccc;"><a class="dropdown-item" data-bs-toggle="modal" href="#" data-bs-target="#changePasswordModal"><i class="bi bi-key-fill"></i> <span > Change password</span></a></li>
                    <li><a class="dropdown-item" id="logout-btn" href="#"><i class="bi bi-box-arrow-right"></i> <span> Logout</span></a></li>
                  </ul>
                </li>
              </ul>
                 <header class="pb-0 " id="backtotop">
                <h5 class="text-color d-flex justify-content-between align-items-center">
           
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
        
                
          <li class="nav-item" id="scheme-management-details">
              <a class="nav-link aos-init aos-animate" href="scheme-management.html" data-aos="fade-left"
                  data-aos-duration="600" id="scheme-registration-link">
                  <i class="bi bi-check-square"></i><span data-i18n="scheme-management">Scheme List</span></a>
          </li>
          <li class="nav-item" id="add-scheme">
              <a class="nav-link aos-init aos-animate" href="add-scheme.html" data-aos="fade-left"
                  data-aos-duration="600" id="add-scheme-link">
                  <i class="bi bi-menu-up"></i><span data-i18n="scheme-management">Add Scheme</span></a>
          </li>
          <li class="nav-item" id="reference-cource">
              <a class="nav-link aos-init aos-animate" href="download_reports.html" data-aos="fade-left"
                  data-aos-duration="600" id="reference-cource-link">
                  <i class="bi bi-columns"></i><span data-i18n="scheme-management">Download Reference Data</span></a>
          </li>
          <li class="nav-item d-none" id="customize_table_view">
              <a class="nav-link aos-init aos-animate" href="customize_table_view.html" data-aos="fade-left"
                  data-aos-duration="600" id="reference-cource-link">
                  <i class="bi bi-columns"></i><span data-i18n="scheme-management">Fixed Fee Tables</span></a>
          </li>
          <li class="nav-item d-none" id="minmax_bcmbc">
              <a class="nav-link aos-init aos-animate" href="minmax_bcmbc.html" data-aos="fade-left"
                  data-aos-duration="600" id="reference-cource-link">
                  <i class="bi bi-columns"></i><span data-i18n="scheme-management">Customize Fee Table</span></a>
          </li>
          <li class="nav-item d-none" id="dote_customise">
              <a class="nav-link aos-init aos-animate" href="dote_customise_table.html" data-aos="fade-left"
                  data-aos-duration="600" id="reference-cource-link">
                  <i class="bi bi-columns"></i><span data-i18n="scheme-management">Customize Fee Tables</span></a>
          </li>
          <li class="nav-item" id="reference-cource">
              <a class="nav-link aos-init aos-animate" href="download_report.html" data-aos="fade-left" data-aos-duration="600" id="reference-cource-link">
              <i class="bi bi-columns"></i><span data-i18n="scheme-management">Download Report</span></a>
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

  }
}
  customElements.define("header-component", SSPHeaderr);
 