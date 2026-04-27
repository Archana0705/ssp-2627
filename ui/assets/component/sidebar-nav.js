class SidebarNav extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {

    this.innerHTML = `
      <div class="sidebar" id="sidebar">

        <div class="sidebar-header pb-0">
          <div class="toggle-wrapper">
            <i class="bi bi-arrow-left-right txt-blue" id="toggleSidebar"></i>
          </div>
        </div>

        <div class="header-item user" id="userMenu">
          <div class="avatar">U</div>
        </div>

        <div class="text-center shortName">
          <span class="d-block font14">Welcome User</span>
        </div>

        <ul class="sidebar-menu">

          <li data-title="Dashboard" data-link="dashboard.html">
            <i class="bi bi-grid"></i>
            <span class="menu-text">Dashboard</span>
          </li>

          <li data-title="Applied Schemes" data-link="applied-schemes.html">
            <i class="bi bi-file-earmark-text"></i>
            <span class="menu-text">Applied Schemes</span>
          </li>

          <li data-title="All Schemes" data-link="schemes-list.html">
            <i class="bi bi-folder"></i>
            <span class="menu-text">All Schemes</span>
          </li>

        </ul>

      </div>
    `;

    this.initSidebar();
  }

  initSidebar() {
    const currentPage = window.location.pathname.split("/").pop();

    document.querySelectorAll(".sidebar-menu li").forEach(item => {

      const link = item.getAttribute("data-link");

      // ✅ SET ACTIVE CLASS
      if (link === currentPage) {
        item.classList.add("active");
      }

      // ✅ CLICK NAVIGATION
      item.addEventListener("click", function () {
        window.location.href = link;
      });

    });
  }
}

customElements.define('ssp-sidebar-nav', SidebarNav);