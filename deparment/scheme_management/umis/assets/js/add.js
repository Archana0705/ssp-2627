function tabToggle(){

  const buttons = document.querySelectorAll(".tab-btn");
  const tabs = document.querySelectorAll(".tab-section");

  buttons.forEach((btn,index) => {

    btn.addEventListener("click", function(){

      // reset
      buttons.forEach(b=>{
        b.classList.remove("active","completed");
      });

      // set active
      this.classList.add("active");

      // mark previous steps completed
      buttons.forEach((b,i)=>{
        if(i < index){
          b.classList.add("completed");
        }
      });

      // hide tabs
      tabs.forEach(tab => tab.classList.add("d-none"));

      // show selected
      const id = this.getAttribute("data-tab");
      document.getElementById(id).classList.remove("d-none");
      getSchemeIdentityRegisterReference(saveParams)
    });

  });

}

function innerTabToggle(){

  const buttons = document.querySelectorAll(".inner-tab-btn");
  const tabs = document.querySelectorAll(".inner-tab-section");

  buttons.forEach(btn => {
    btn.addEventListener("click", function(){

      buttons.forEach(b => b.classList.remove("active"));
      this.classList.add("active");

      tabs.forEach(tab => tab.classList.add("d-none"));

      const id = this.getAttribute("data-tab");
      document.getElementById(id).classList.remove("d-none");

    });
  });

}

// ── Collapsible sections ───────────────────────────────────────
function toggleCollapsible(header) {
  header.parentElement.classList.toggle('open');
}


function toggleDropdown(el){

  const dropdown = el.closest(".chip-dropdown");
  const menu = dropdown.querySelector(".chip-dropdown-menu");

  menu.classList.toggle("d-none");

}




// ── Instalment rows ────────────────────────────────────────────
function renderInstalments() {
  const n = parseInt(document.getElementById('instSelect').value);
  const container = document.getElementById('instalmentRows');
  let html = '<div class="section-label">Instalment Payment Details</div>';
  for (let i = 1; i <= n; i++) {
    html += `<div class="instalment-row">

      <div class="inst-label">Instalment ${i}</div>
      <div class="row">
      <div class="form-group col-sm-2">
                <label class="form-label" style="font-size:11px;">Payment % <span class="req">*</span></label>
                <input class="form-input" type="number" value="${Math.round(100/n)}" style="width:100px;">
            </div>
            <div class="form-group col-sm-4">
                <label class="form-label" style="font-size:11px;">Payment Mode <span class="req">*</span></label>
                <select class="form-select">
                    <option>NSP</option>
                    <option>DBT</option>
                    <option>PFMS</option>
                </select>
            </div>
            <div class="form-group col-sm-4">
                <label class="form-label" style="font-size:11px;">Bank Name<span class="req">*</span></label>
                <select class="form-select">
                    <option>Bank of India</option>
                    <option>State Bank of India</option>
                    <option>Indian Bank</option>
                </select>
            </div>
             <div class="form-group col-sm-2">
              <label class="form-label" style="font-size:11px;">
              File Transfer mode<span class="req">*</span>
              </label>

              <select class="form-select" onchange="toggleFTM(this)">
              <option value="">Select</option>
              <option value="FTP">FTP</option>
              <option value="API">API Gateway</option>
              </select>
              </div>

        
<div class="FTM_container col-sm-12"></div>
</div>

    </div>
    `;
  }
  container.innerHTML = html;
}

function toggleFTM(select){

    const container = select.closest('.row').querySelector(".FTM_container");
    container.innerHTML = "";

    if(select.value === "FTP"){

        const ftpHTML = `
        <div class="row p-2 step-divider">
        <h5 class="card-title pb-1 mb-0">
        <i class="bi bi-check2-circle"></i> UAT FTP Config
        </h5>

        <div class="col-md-4"> <label class="form-label">FTP Host</label> <input type="text" class="form-control" name="uat_ftp_host"> </div> <div class="col-md-4"> <label class="form-label">FTP Port</label> <input type="text" class="form-control" name="uat_ftp_port"> </div> <div class="col-md-4"> <label class="form-label">FTP User Name</label> <input type="text" class="form-control" name="uat_ftp_username"> </div> <div class="col-md-4"> <label class="form-label">FTP Password</label> <input type="text" class="form-control" name="uat_ftp_password"> </div> <div class="col-md-4"> <label class="form-label">FTP Request Path</label> <input type="text" class="form-control" name="uat_ftp_request_path"> </div> <div class="col-md-4"> <label class="form-label">FTP Response Path</label> <input type="text" class="form-control" name="uat_ftp_response_path"> </div> <div class="col-md-4"> <label class="form-label">FTP Response Acknowledgement File Path</label> <input type="text" class="form-control" name="uat_ftp_response_ack_path"> </div> <div class="col-md-4"> <label class="form-label">FTP Response Full Complete Path</label> <input type="text" class="form-control" name="uat_ftp_response_fl_path"> </div>
        </div>
        `;

        container.insertAdjacentHTML("beforeend", ftpHTML);
    }

    if(select.value === "API"){

        const apiHTML = `
        <div class="row p-2 step-divider">
        <h5 class="card-title pb-1 mb-0">
        <i class="bi bi-check2-circle"></i> UAT API Config
        </h5>

        <div class="col-md-4">
        <label class="form-label">API Base URL</label>
        <input type="text" class="form-control" name="uat_api_base_url">
        </div>

        <div class="col-md-4">
        <label class="form-label">API Key</label>
        <input type="text" class="form-control" name="uat_api_key">
        </div>

        <div class="col-md-4">
        <label class="form-label">API Secret</label>
        <input type="text" class="form-control" name="uat_api_secret">
        </div>
        </div>
        `;

        container.insertAdjacentHTML("beforeend", apiHTML);
    }
}

// document.addEventListener("DOMContentLoaded", function () {

//   const buttons = document.querySelectorAll(".sub-scheme-card");

//   const fixed = document.getElementById("fixed_fee");
//   const custom = document.getElementById("custom_fee");
//   const component = document.getElementById("component_fee");

//   buttons.forEach(btn => {
//     btn.addEventListener("click", function () {

//       // 🔸 toggle active button
//       buttons.forEach(b => b.classList.remove("active"));
//       this.classList.add("active");

//       // 🔸 hide all sections
//       fixed.classList.add("d-none");
//       custom.classList.add("d-none");
//       component.classList.add("d-none");

//       // 🔸 show based on clicked
//       const type = this.dataset.type;

//       if (type === "fixed") {
//         fixed.classList.remove("d-none");
//       } 
//       else if (type === "component") {
//         component.classList.remove("d-none");
//       } 
//       else if (type === "custom") {
//         custom.classList.remove("d-none");
//       }

//     });
//   });

// });






document.addEventListener("DOMContentLoaded", function () {

  /* ================================
     SIDEBAR TOGGLE
  ================================= */

//   const sidebarToggle = document.getElementById("sidebarToggle");
//   const sidebarIcon = sidebarToggle?.querySelector("i");

//   if (sidebarToggle) {
//     sidebarToggle.addEventListener("click", function () {

//       console.log("clicked"); // ✅ debug

//       document.body.classList.toggle("sidebar-expanded");

//       sidebarIcon?.classList.toggle("bi-list");
//       sidebarIcon?.classList.toggle("bi-x-lg");

//     });
//   }


  /* ================================
     PROFILE DROPDOWN
  ================================= */

  const trigger = document.getElementById("profileTrigger");
  const dropdown = document.getElementById("profileDropdown");

  trigger?.addEventListener("click", function (e) {
    e.stopPropagation();
    dropdown.classList.toggle("show");
  });

  dropdown?.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  document.addEventListener("click", function () {
    dropdown?.classList.remove("show");
  });

});





