(function ($) {
  $.fn.index_model_component = function () {
    const headerHTML = `
                      
    
    <!-- Modal -->
    <div class="modal fade" id="opt_modal" tabindex="-1" role="dialog" aria-labelledby="modalTitleId"
      aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">

            <button type="button" class="btn-close otp_modal_cancel" data-bs-dismiss="modal"
              aria-label="Close"></button>
          </div>
          <div class="modal-body ">
            <div class="row justify-content-center">
              <div class="col-12 col-md-6 col-lg-4" style="min-width: 500px;">
                <div class="card bg-white" style="box-shadow: 0 12px 15px rgba(0, 0, 0, 0.02);">

                  <div class="card-body  text-center">
                    <h4>Verify</h4>
                    <p>Your code was sent to you via Mobile number</p>

                    <div class="otp-field mb-4">
                      <input type="number" />
                      <input type="number" disabled />
                      <input type="number" disabled />
                      <input type="number" disabled />
                      <input type="number" disabled />
                      <input type="number" disabled />
                    </div>

                    <button class="btn btn-primary mb-3 verify">
                      Verify
                    </button>
                    <input type="hidden" name="otp_val" id="otp_val">
                    <p class="resend text-muted mb-0">
                      Didn't receive code? <span id="resendTimer">3:00</span> <a href="#" id="requestAgain"
                        style="display: none;">Resend OTP</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    <!-- Standard modal content -->
    <div id="confirmationModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="confirmationModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="confirmationModalLabel">Are You Sure!</h4>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <input type="hidden" name="opt_modal_studentschemeid" id="opt_modal_studentschemeid">
            <input type="hidden" name="opt_modal_studentsubschemeid" id="opt_modal_studentsubschemeid">

            <p>The benefit of this scheme cannot be combined with the following schemes:</p>
            <ul class="schemesList">
              <!-- List items will be injected here -->
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Re-Consider!</button>
            <button type="button" id="proceedButton" class=" proceedButton btn btn-primary">Proceed</button>
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->

    <!-- Modal trigger button -->

    <div id="exceptionModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="exceptionModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="exceptionModalLabel">Exceptions</h4>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <input type="hidden" name="opt_modal_studentschemeid" id="opt_modal_studentschemeid">
            <input type="hidden" name="opt_modal_studentsubschemeid" id="opt_modal_studentsubschemeid">

            <p>
              Once this scheme is availed, the student may apply for the following scheme only.</p>
            <ul class="schemesList">
              <!-- List items will be injected here -->
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" id="proceedButton" class=" proceedButton btn btn-primary">Proceed</button>
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div>

    <div id="exclusiveModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="exclusiveModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="exclusiveModalLabel">Exceptions</h4>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <input type="hidden" name="opt_modal_studentschemeid" id="opt_modal_studentschemeid">
            <input type="hidden" name="opt_modal_studentsubschemeid" id="opt_modal_studentsubschemeid">

            <p id="exclusiveModalMsg">
              If you apply for this scheme, you will not be eligible for any other schemes.</p>
            <ul class="schemesList">
              <!-- List items will be injected here -->
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div>
    <div id="exclusiveModalfalse" class="modal fade" tabindex="-1" role="dialog"
      aria-labelledby="exclusiveModalfalseLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="exclusiveModalfalseLabel">Are You Sure</h4>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <input type="hidden" name="opt_modal_studentschemeid" id="opt_modal_studentschemeid">
            <input type="hidden" name="opt_modal_studentsubschemeid" id="opt_modal_studentsubschemeid">

            <p id="exclusiveModalfalseMsg">
              If you apply for this scheme, you will not be eligible for any other schemes.</p>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" id="proceedButton" class=" proceedButton btn btn-primary">Proceed</button>

          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div>
     <div class="modal fade" id="applyModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false"
      role="dialog" aria-labelledby="modalTitleId" aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">

            <button type="button" class="btn-close applymodal_close" data-bs-dismiss="modal"
              aria-label="Close"></button>
          </div>
          <style>
            /* .table-header {
              background-color: #e3f2fd;
              font-weight: bold;
            }

            h2 {
              color: #3f51b5;
              text-align: center;
              font-weight: 600;
              margin-bottom: 20px;
            }

            .table-bordered th,
            .table-bordered td {
              text-align: center;
              vertical-align: middle;
            }

            .section-title {
              background-color: #d1e7ff;
              font-weight: bold;
              text-align: center;
            } */
            /* #collapseCard .card-body .row {
              display: flex;
              overflow-wrap: normal;
              
            }
              flex-wrap: nowrap;
            } */
          </style>

          <div class="modal-body">

            <div class="applyScreen">
              <div class="container" style="max-width: 1320px;">
                <div class="row" style="display: flex; justify-content: center; align-items: center;">
                  <div class="tnLogo col-lg-12" style="text-align: center;">
                     
                    <img src="assets/img/tn_logo.png" alt="logo" class="logo_header">
                    <h5>Unified State Scholarship Portal Application</h5>
                  </div>
                </div>
                <div class="sectionSeparate row">
                  <h6><i class="bi bi-person-circle"></i> STUDENT DETAILS</h6>
                  <div class="col-lg-3" style="width: 25%; float: left;">
                    <form class="">
                      <div class="form-group marBtm">
                        <ul>
                          <li><label for="dept">Student Name:</label></li>
                          <li><label for="dept"><b id="apply_studentName"></b></label></li>
                        </ul>
                      </div>
                    </form>
                  </div>
                  <div class="col-lg-3" style="width: 25%; float: left;">
                    <form class="">
                      <div class="form-group marBtm">
                        <ul>
                          <li><label for="dept">Emis Id:</label></li>
                          <li><label for="dept"><b id="apply_emis_id"></b></label></li>
                        </ul>
                      </div>
                    </form>
                  </div>
                  <div class="col-lg-3" style="width: 25%; float: left;">
                    <form class="">
                      <div class="form-group marBtm">
                        <ul>
                          <li><label for="dept">Umis Id:</label></li>
                          <li><label for="dept"><b id="apply_umis_id"></b></label></li>
                        </ul>
                      </div>
                    </form>
                  </div>
                  <div class="col-lg-3" style="width: 25%; float: left;">
                    <form class="">
                      <div class="form-group marBtm">
                        <ul>
                          <li><label for="dept">Nationality:</label></li>
                          <li><label for="dept"><b id="apply_nationality"></b></label></li>
                        </ul>
                      </div>
                    </form>
                  </div>
                  <div class="col-lg-3" style="width: 25%; float: left;">
                    <form class="">
                      <div class="form-group marBtm">
                        <ul>
                          <li><label for="dept">Religion:</label></li>
                          <li><label for="dept"><b id="apply_religion"></b></label></li>
                        </ul>
                      </div>
                    </form>
                  </div>
                  <div class="col-lg-3" style="width: 25%; float: left;">
                    <form class="">
                      <div class="form-group marBtm">
                        <ul>
                          <li><label for="dept">Community:</label></li>
                          <li><label for="dept"><b id="apply_community"></b></label></li>
                        </ul>
                      </div>
                    </form>
                  </div>
                  <div class="col-lg-3" style="width: 25%; float: left;">
                    <form class="">
                      <div class="form-group marBtm">
                        <ul>
                          <li><label for="dept">Caste:</label></li>
                          <li><label for="dept"><b id="apply_caste"></b></label></li>
                        </ul>
                      </div>
                    </form>
                  </div>
                  <div class="col-lg-3" style="width: 25%; float: left;">
                    <form class="">
                      <div class="form-group marBtm">
                        <ul>
                          <li><label for="dept">Phone no</label></li>
                          <li><label for="dept"><b id="apply_phone">-</b></label></li>
                        </ul>
                      </div>
                    </form>
                  </div>
                  <div class="col-lg-3" style="width: 25%; float: left;">
                    <form class="">
                      <div class="form-group marBtm">
                        <ul>
                          <li><label for="dept">Aadhar no:</label></li>
                          <li><label for="dept"><b id="apply_aadhar">-</b></label></li>
                        </ul>
                      </div>
                    </form>
                  </div>
                </div>
                <div class="sectionSeparate row">

                  <h6>SCHEME DETAILS <i class="bi bi-info-circle-fill" id="about_scheme" data-bs-toggle="tooltip"
                      data-bs-placement="top" title=""></i></h6>

                  <!-- <div class="col-lg-3">
                    <form class="">
                      <div class="form-group marBtm">
                        <ul>
                          <li><label for="dept">Application No:</label></li>
                          <li><label for="dept"><b id="apply_application_no">1</b></label></li>
                        </ul>
                      </div>
                    </form>
                  </div> -->
                  <div class="col-lg-4" style="width: 33.33%; float: left;">
                    <form class="">
                      <div class="form-group marBtm">
                        <ul>
                          <li><label for="dept">Scheme Name:</label></li>
                          <li><label for="dept"><b id="apply_schemename"> - </b></label></li>
                        </ul>
                      </div>
                    </form>
                  </div>
                  <div class="col-lg-4" style="width: 33.33%; float: left;">
                    <form class="">
                      <div class="form-group marBtm">
                        <ul>
                          <li><label for="dept">Sub-Scheme Name:</label></li>
                          <li><label for="dept"><b id="apply_sub_schemename">-</b></label></li>
                        </ul>
                      </div>
                    </form>
                  </div>

                  <div class="col-lg-4" style="width: 33.33%; float: left;">
                    <form class="">
                      <div class="form-group marBtm">
                        <ul>
                          <li><label for="dept">Scheme Amount:</label></li>
                          <li><label for="dept"><b id="apply_schemeamount"></b></label></li>
                        </ul>
                      </div>
                    </form>
                  </div>
                </div>

                <div class="sectionSeparate row">
                  <h6><i class="bi bi-building"></i> ACADEMIC DETAILS</h6>
                  <div class="col-lg-3" style="width: 25%; float: left;">
                    <form class="">
                      <div class="form-group marBtm">
                        <ul>
                          <li><label for="dept">Academic Year:</label></li>
                          <li><label for="dept"><b id="apply_academic_year">-</b></label></li>
                        </ul>
                      </div>
                    </form>
                  </div>
                  <div class="col-lg-3" style="width: 25%; float: left;">
                    <form class="">
                      <div class="form-group marBtm">
                        <ul>
                          <li><label for="dept">Course:</label></li>
                          <li><label for="dept"><b id="apply_course">PG</b></label></li>
                        </ul>
                      </div>
                    </form>
                  </div>
                  <div class="col-lg-3" style="width: 25%; float: left;">
                    <form class="">
                      <div class="form-group marBtm">
                        <ul>
                          <li><label for="dept">Course Branch:</label></li>
                          <li><label for="dept"><b id="apply_course_branch">-</b></label></li>
                        </ul>
                      </div>
                    </form>
                  </div>
                  <div class="col-lg-3" style="width: 25%; float: left;">
                    <form class="">
                      <div class="form-group marBtm">
                        <ul>
                          <li><label for="dept">Course Year:</label></li>
                          <li><label for="dept"><b id="apply_year">-</b></label></li>
                        </ul>
                      </div>
                    </form>
                  </div>
                  <div class="col-lg-3" style="width: 25%; float: left;">
                    <form class="">
                      <div class="form-group marBtm">
                        <ul>
                          <li><label for="dept">Medium Of Instruction:</label></li>
                          <li><label for="dept"><b id="apply_moi"></b></label></li>
                        </ul>
                      </div>
                    </form>
                  </div>
                  <div class="col-lg-3" style="width: 25%; float: left;">
                    <form class="">
                      <div class="form-group marBtm">
                        <ul>
                          <li><label for="dept">Mode Of Study:</label></li>
                          <li><label for="dept"><b id="apply_mos"></b></label></li>
                        </ul>
                      </div>
                    </form>
                  </div>
                  <div class="col-lg-3" style="width: 25%; float: left;">
                    <form class="">
                      <div class="form-group marBtm">
                        <ul>
                          <li><label for="dept">Date Of Admission:</label></li>
                          <li><label for="dept"><b id="apply_doa">-</b></label></li>
                        </ul>
                      </div>
                    </form>
                  </div>
                  <!-- <div class="col-lg-3">
                    <form class="">
                      <div class="form-group marBtm">
                        <ul>
                          <li><label for="dept">Roll Number:</label></li>
                          <li><label for="dept"><b id="apply_rollnumber">34567</b></label></li>
                        </ul>
                      </div>
                    </form>
                  </div> -->
                  <div class="col-lg-3" style="width: 25%; float: left;">
                    <form class="">
                      <div class="form-group marBtm">
                        <ul>
                          <li><label for="dept">Hosteller:</label></li>
                          <li><label for="dept"><b id="apply_hosteller"></b></label></li>
                        </ul>
                      </div>
                    </form>
                  </div>
                  <div class="col-lg-3" style="width: 25%; float: left;">
                    <form class="">
                      <div class="form-group marBtm">
                        <ul>
                          <li><label for="dept">Current Status Of The Student:</label></li>
                          <li><label for="dept"><b id="apply_studentsts">-</b></label></li>
                        </ul>
                      </div>
                    </form>
                  </div>

                </div>
                <div class="sectionSeparate row">
                  <h6><i class="bi bi-person-badge"></i> AADHAR SEEDED BANK DETAILS</h6>
                  <div class="col">
                    <form class="">
                      <div class="form-group">
                        <ul>
                          <li><label for="dept">Bank Name:</label> <b id="apply_bank"></b></li>
                          <li></li>
                        </ul>
                      </div>
                    </form>
                  </div>
                  <!-- <div class="col-lg-3">
                    <form class="">
                      <div class="form-group marBtm">
                        <ul>
                          <li><label for="dept">Branch:</label></li>
                          <li><label for="dept"><b id="apply_branch">Chennai, Egmore</b></label></li>
                        </ul>
                      </div>
                    </form>
                  </div> -->
                  <!-- <div class="col-lg-3">
                    <form class="">
                      <div class="form-group marBtm">
                        <ul>
                          <li><label for="dept">Account Number:</label></li>
                          <li><label for="dept"><b id="apply_acno">009045654654</b></label></li>
                        </ul>
                      </div>
                    </form>
                  </div>
                  <div class="col-lg-3">
                    <form class="">
                      <div class="form-group marBtm">
                        <ul>
                          <li><label for="dept">Ifsc Code:</label></li>
                          <li><label for="dept"><b id="apply_ifsc">OOOTN345345</b></label></li>
                        </ul>
                      </div>
                    </form>
                  </div> -->

                </div>
                <div class="row">
                  <div class="col-lg-2"></div>
                  <div class="consentDec col-lg-8">
                    <h5 class="text-center">
                      CONSENT DECLARATION</h5>
                    <div class="card sectionSeparate">
                      <div class="card-body">
                        <div class="declaration">
                          <p>I confirm that I fully understand the benefits and conditions of the scholarship. I assure
                            you that the information provided above is accurate. I wish to apply for this scholarship,
                            <b>as I meet the eligibility criteria for this schemes.</b>
                          </p>

                          <p> I voluntarily agree to receive alerts and notifications via SMS and WhatsApp.</p>
                          <div class="text-center">
                            <div class="form-check">

                              <label class="form-check-label" for="applySchemeVerification">
                                <input class="form-check-input" type="checkbox" value="1"
                                  id="applySchemeVerification" /> I Agree to these conditions</label>
                              <!-- <i class="bi bi-info-circle padLft" data-bs-toggle="tooltip" data-bs-placement="right"
                                title="Please agree to continue"></i> -->
                            </div>
                          </div>

                          <div class="applyCancleCta text-center">
                            <button class="btn btn-primary " id="get_opt" disabled>Apply</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-2"></div>
                </div>
              </div>
            </div>


          </div>

        </div>
      </div>
    </div>
      `;
    this.html(headerHTML);
    return this;
  };
})(jQuery);

$(document).ready(function () {
  $('#index_model_component').index_model_component();
});