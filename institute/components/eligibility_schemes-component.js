
(function ($) {
    $.fn.eligibility_scheme_component = function () {
      const headerHTML = `
                        <div class="card">
              <div class="card-body">   
                <div class="data-tab table-striped">
                  <table id="scheme_details" class="table table-bordered dataTable no-footer nowrap mt-3">
                    <thead>
                      <tr>
                        <th>S.no</th>
                        <th>Scheme Name</th>
                        
                        <th>Scheme Amount</th>
                        <th>Details </th>
                      </tr>
                    </thead>
                    <tbody id="scheme_details_body">
                      <!-- <tr class="">
                      <td>1</td>
                      <td scope="row">Central Scheme-Post-Matric Scholarship(ST)</td>
                      <td>60000</td>
                      <td><a href="#" target="_blank">Apply here</a></td>
                    </tr>
                    <tr class="">
                      <td>2</td>
                      <td scope="row">State Scheme-Higher Education Special Scholarship(SC,SCC)</td>
                      <td>40000</td>
                      <td><a href="#" target="_blank">Apply here</a></td>
                    </tr>
                    <tr class="">
                      <td>3</td>
                      <td scope="row">State Scheme-Special Post-Matric Scholarship Scheme(SCC)</td>
                      <td>25000</td>
                      <td><a href="#" target="_blank">Apply here</a></td>
                    </tr> -->
                    </tbody>
                  </table>

                </div>

              </div>

            </div>
        `;
      this.html(headerHTML);
      return this;
    };
  })(jQuery);
  
  $(document).ready(function () {
    $('#eligibility_scheme_component').eligibility_scheme_component();
  });
  
 