class HeaderNav extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {

  this.innerHTML = `
 
  <div class="header">
          <!-- LEFT -->
          <div class="header-left">
            <div class="logo">
              <span class="logo-icon"><img src="assets/img/tn_logo.png" class="logo_header"></span>
            </div>
            <div class="title-group">
              <span class="title-full">Tamil Nadu Integrated <span class="highlight">State Scholarship Portal</span></span>
              <span class="subtitle">Dashboard</span>
              <span class="title-short">TNSSP</span>
            </div>
          </div>
          <!-- RIGHT -->
          <div class="header-right">
            
            <!-- TIME -->
            <div class="header-item header-time">
              <i class="bi bi-clock"></i>
              <span id="dateTimeLink"></span>
            </div>
            <!-- DIVIDER -->
            <div class="divider"></div>
            <!-- USER -->
            <div class="header-item user" id="userMenu">
              <span><i class="bi bi-power"></i> Log Out</span>
            </div>
          </div>
        </div>

`;
    }
  }  
  customElements.define('ssp-header-nav', HeaderNav);
  