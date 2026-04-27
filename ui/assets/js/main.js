 $(document).ready(function () {
      
        const $sidebar = $("#sidebar");
        const $main = $("#main");
        const $toggle = $("#toggleSidebar");
        const $userMenu = $("#userMenu");
      
        /* ===== SIDEBAR TOGGLE ===== */
        $toggle.on("click", function () {
      
          const isMobile = window.innerWidth < 768;
      
          if (isMobile) {
            // Mobile → overlay sidebar
            $sidebar.toggleClass("show");
          } else {
            // Desktop → collapse sidebar
            $sidebar.toggleClass("collapsed");
            $main.toggleClass("expanded");
          }
      
        });
      
        /* ===== CLOSE SIDEBAR ON OUTSIDE CLICK (MOBILE UX) ===== */
        $(document).on("click", function (e) {
          const isMobile = window.innerWidth < 768;
      
          if (
            isMobile &&
            !$sidebar.is(e.target) &&
            $sidebar.has(e.target).length === 0 &&
            !$toggle.is(e.target)
          ) {
            $sidebar.removeClass("show");
          }
        });
      
        /* ===== USER DROPDOWN ===== */
        $userMenu.on("mouseenter", function () {
          $(this).find(".dropdown-menu-custom").stop(true, true).fadeIn(150);
        });
      
        $userMenu.on("mouseleave", function () {
          $(this).find(".dropdown-menu-custom").stop(true, true).fadeOut(150);
        });
      
        /* ===== RESPONSIVE RESET ===== */
        $(window).on("resize", function () {
          if (window.innerWidth >= 768) {
            // Reset mobile state when switching to desktop
            $sidebar.removeClass("show");
          }
        });
      
      });
      
      
      // live time
      
      /* LIVE CLOCK */
      function updateTime() {
        const now = new Date();
        const formatted = now.toLocaleString();
        $("#dateTimeLink").text(formatted);
      }
      setInterval(updateTime, 1000);
      updateTime();
      
      /* DROPDOWN */
      $("#userMenu").hover(function () {
        $(this).find(".dropdown-menu-custom").stop(true, true).fadeToggle(150);
      });
      
      // tab
      $(".tab-item").click(function () {
      
        const tab = $(this).data("tab");
      
        // active tab
        $(".tab-item").removeClass("active");
        $(this).addClass("active");
      
        // content switch
        $(".tab-content").removeClass("active");
        $("#" + tab).addClass("active");
      
      });
      
      
      // modal
      
      
      // OPEN MODAL
      $("#openRefreshModal").click(function () {
        $("#refreshModal").modal("show");
      });
      
      // RESET STATE WHEN MODAL OPENS
      $("#refreshModal").on("show.bs.modal", function () {
        $("#modalLoader").removeClass("active");
        $("#modalToast").removeClass("show");
        $("#progressFill").css("width", "0%");
        $("#progressText").text("0%");
      });
      
      // SUBMIT BUTTON
      $("#updateDetails").click(function (e) {
      
        e.preventDefault(); // 🔥 important
      
        $("#modalLoader").addClass("active");
      
        let progress = 0;
      
        const interval = setInterval(() => {
          progress += 5;
      
          $("#progressFill").css("width", progress + "%");
          $("#progressText").text(progress + "%");
      
          if (progress >= 100) {
            clearInterval(interval);
      
            $("#modalLoader").removeClass("active");
            $("#modalToast").addClass("show");
      
            setTimeout(() => {
              $("#modalToast").removeClass("show");
            }, 2000);
          }
      
        }, 100);
      
      });
      
      
      // checkbox interactive
      
      // ROW CLICK SELECT
      $(".custom-table tbody tr").click(function (e) {
      
        if (!$(e.target).is("input")) {
          const checkbox = $(this).find("input[type='checkbox']");
          checkbox.prop("checked", !checkbox.prop("checked"));
        }
      
        $(this).toggleClass("selected");
      
      });
      
      // SELECTED STYLE
      
      // apply button interaction
      
      const applyBtn = $(".btn-apply");
      
      function updateApplyButton() {
      const checked = $(".custom-table tbody input:checked").length;
      
      if (checked > 0) {
      applyBtn.removeClass("disabled");
      } else {
      applyBtn.addClass("disabled");
      }
      }
      
      // trigger
      $(".custom-table input").on("change", updateApplyButton);
      


      // page navigation
      document.querySelectorAll(".sidebar-menu li").forEach(item => {
  item.addEventListener("click", function () {

    const link = this.getAttribute("data-link");
    if (link) {
      window.location.href = link;
    }

  });
});