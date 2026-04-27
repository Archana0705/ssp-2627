  class Header extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.innerHTML = `  <!-- Modal -->
    <div class="modal fade" id="scheme_info" tabindex="-1" role="dialog" aria-labelledby="modalTitleId"
      aria-hidden="true">
      <div class="modal-dialog modal-xl modal-fullscreen-xl-down modal-dialog-centered modal-dialog-scrollable"
        role="document">
        <div class="modal-content">
          <div class="modal-header border-bottom-0 text-center">
            <h5 class="head-label w-100">Scheme's with Sub Schemes Details</h5>
            <button type="button" class="btn-close scheme_info-close" data-bs-dismiss="modal"
              aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="applyScreen">
              <div class="container">
                <div class="justify-content-center row">
                  <div class="">
                    <form class="">
                      <div class="card">
                        <div class="card-body">

                          <div class="row">
                            <div class="mb-2 col-md-4">
                              <div>
                                <label class="d-block form-label" for="form-scheme_name">Scheme Name :</label>
                                <strong class="d-block" id="form-scheme_name">-</strong>
                              </div>
                            </div>
                            <div class="mb-2 col-md-4">
                              <div>
                                <label class="d-block form-label" for="form-frequency">Frequency :</label>
                                <strong class="d-block" id="form-frequency">-</strong>
                              </div>
                            </div>
                            <div class="mb-2 col-md-4">
                              <div>
                                <label class="d-block form-label" for="form-department_name">Department Name
                                  :</label>
                                <strong class="d-block" id="form-department_name">-</strong>
                              </div>
                            </div>
                            <div class="mb-2 col-md-4">
                              <div>
                                <label class="d-block form-label" for="form-subdepartment_name">Subdepartment Name
                                  :</label>
                                <strong class="d-block" id="form-subdepartment_name">-</strong>
                              </div>
                            </div>
                            <div class="mb-2 col-md-4">
                              <div>
                                <label class="d-block form-label" for="form-scheme_code">Scheme Code :</label>
                                <strong class="d-block" id="form-scheme_code">-</strong>
                              </div>
                            </div>
                            <div class="mb-2 col-md-4">
                              <div>
                                <label class="d-block form-label" for="form-scheme_category">Scheme Category
                                  :</label>
                                <strong class="d-block" id="form-scheme_category">-</strong>
                              </div>
                            </div>
                            <div class="mb-2 col-md-4">
                              <div>
                                <label class="d-block form-label" for="form-scheme-exceptions">Scheme Exceptions
                                  :</label>
                                <strong class="d-block" id="form-scheme-exceptions">-</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="mt-2 card">
                        <div class="card-body">
                          <div class="row">
                            <div class="mb-2 col-md-4">
                              <div>
                                <label class="d-block form-label" for="form-subscheme_name">Subscheme Name :</label>
                                <strong class="d-block" id="form-subscheme_name">-</strong>
                              </div>
                            </div>
                            <div class="mb-2 col-md-4">
                              <div>
                                <label class="d-block form-label" for="form-scholarship_fee_type">Scholarship Fee
                                  Type :</label>
                                <strong class="d-block" id="form-scholarship_fee_type">-</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="col-lg-12 mb-2">
                        <div class="py-1">
                          <div class="mt-2 card">
                            <div class="card-body">
                              <div class="row">
                                <h6 class="tab-title p-2 mr-2"><b>Institute Parameters</b>
                                </h6>
                                <div class="mb-1 col-lg-4 col-md-6 col-sm-12 col-12">
                                  <label for="educationType" class="form-label lbl-color w-100 mb-0">Education</label>
                                  <strong>
                                    <div class="parameters over-scroll-down" id="form-education">-</div>
                                  </strong>
                                </div>
                                <div class="mb-1 col-lg-4 col-md-6 col-sm-12 col-12">
                                  <label for="instituteOwnership" class="form-label lbl-color w-100 mb-0">Institute
                                    Ownership</label>
                                  <strong>
                                    <div class="parameters over-scroll-down" id="form-institute_ownership">-</div>
                                  </strong>
                                </div>
                                <div class="mb-1 col-lg-4 col-md-6 col-sm-12 col-12">
                                  <label for="instituteName" class="form-label lbl-color w-100 mb-0">Institute</label>
                                  <strong>
                                    <div class="parameters over-scroll-down" id="form-institute">-</div>
                                  </strong>
                                </div>
                                <div class="mb-1 col-lg-4 col-md-6 col-sm-12 col-12">
                                  <label for="university" class="form-label lbl-color w-100 mb-0">University</label>
                                  <strong>
                                    <div class="parameters over-scroll-down" id="form-university">-</div>
                                  </strong>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="mt-2 card">
                          <div class="card-body">
                            <div class="row">
                              <h6 class="tab-title p-2 mr-2"><b>Course Parameters</b></h6>
                              <div class="mb-1 col-lg-4 col-md-12 col-sm-12 col-12">
                                <label for="stream" class="form-label lbl-color w-100 mb-0">Stream</label>
                                <strong>
                                  <div class="parameters over-scroll-down" id="form-stream">-</div>
                                </strong>
                              </div>
                              <div class="mb-1 col-lg-4 col-md-6 col-sm-12 col-12">
                                <label for="courseType" class="form-label lbl-color w-100 mb-0">Course Type</label>
                                <strong>
                                  <div class="parameters over-scroll-down" id="form-course_type">-</div>
                                </strong>
                              </div>
                              <div class="mb-1 col-lg-4 col-md-6 col-sm-12 col-12">
                                <label for="mediumOfInstruction" class="form-label lbl-color w-100 mb-0">Medium of
                                  Instruction</label>
                                <strong>
                                  <div class="parameters over-scroll-down" id="form-MediumofInstruction">-</div>
                                </strong>
                              </div>
                              <div class="mb-1 col-lg-4 col-md-6 col-sm-12 col-12">
                                <label for="courseGrp" class="form-label lbl-color w-100 mb-0">Course Group</label>
                                <strong>
                                  <div class="parameters over-scroll-down" id="form-CourseGrp">-</div>
                                </strong>
                              </div>
                              <div class="mb-1 col-lg-4 col-md-6 col-sm-12 col-12">
                                <label for="course" class="form-label lbl-color w-100 mb-0">Course</label>
                                <strong>
                                  <div class="parameters over-scroll-down" id="form-Course">-</div>
                                </strong>
                              </div>
                              <div class="mb-1 col-lg-4 col-md-6 col-sm-12 col-12">
                                <label for="courseCategory" class="form-label lbl-color w-100 mb-0">Course
                                  Category</label>
                                <strong>
                                  <div class="parameters over-scroll-down" id="form-CourseCategory">-</div>
                                </strong>
                              </div>
                              <div class="mb-1 col-lg-4 col-md-6 col-sm-12 col-12">
                                <label for="courseBranch" class="form-label lbl-color w-100 mb-0">Course
                                  Branch</label>
                                <strong>
                                  <div class="parameters over-scroll-down" id="form-CourseBr">-</div>
                                </strong>
                              </div>
                              <div class="mb-1 col-lg-4 col-md-6 col-sm-12 col-12">
                                <label for="courseYear" class="form-label lbl-color w-100 mb-0">Course Year</label>
                                <strong>
                                  <div class="parameters over-scroll-down" id="form-CourseYear">-</div>
                                </strong>
                              </div>
                              <div class="mb-1 col-lg-4 col-md-6 col-sm-12 col-12">
                                <label for="accreditationStatus" class="form-label lbl-color w-100 mb-0">Accreditation
                                  Status</label>
                                <strong>
                                  <div class="parameters over-scroll-down" id="form-AccrediationStatus">-</div>
                                </strong>
                              </div>
                              <div class="mb-1 col-lg-4 col-md-6 col-sm-12 col-12">
                                <label for="caste" class="form-label lbl-color w-100 mb-0">Caste</label>
                                <strong>
                                  <div class="parameters over-scroll-down" id="form-Caste">-</div>
                                </strong>
                              </div>
                              <div class="mb-1 col-lg-4 col-md-6 col-sm-12 col-12">
                                <label for="gender" class="form-label lbl-color w-100 mb-0">Gender</label>
                                <strong>
                                  <div class="parameters over-scroll-down" id="form-Gender">-</div>
                                </strong>
                              </div>
                              <div class="mb-1 col-lg-4 col-md-6 col-sm-12 col-12">
                                <label for="income" class="form-label lbl-color w-100 mb-0">Income</label>
                                <strong>
                                  <div class="parameters over-scroll-down" id="form-Income">-</div>
                                </strong>
                              </div>
                              <div class="mb-1 col-lg-4 col-md-6 col-sm-12 col-12">
                                <label for="incomeValue" class="form-label lbl-color w-100 mb-0">Income
                                  Value</label>
                                <strong>
                                  <div class="parameters over-scroll-down" id="form-IncomeValue">-</div>
                                </strong>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="mt-2 card">
                          <div class="card-body">
                            <div class="viewmore-wrap show row">
                              <h6 class="tab-title p-2 mr-2"><b>Student Eligibility Parameters</b></h6>
                              <div class="mb-1 col-lg-4 col-md-6 col-sm-12 col-12">
                                <label for="quota" class="form-label lbl-color w-100 mb-0">Quota</label>
                                <strong>
                                  <div class="parameters over-scroll-down" id="form-Quota">-</div>
                                </strong>
                              </div>
                              <div class="mb-1 col-lg-4 col-md-6 col-sm-12 col-12">
                                <label for="specialCategory" class="form-label lbl-color w-100 mb-0">Special
                                  Category</label>
                                <strong>
                                  <div class="parameters over-scroll-down" id="form-SplCtg">-</div>
                                </strong>
                              </div>
                              <div class="mb-1 col-lg-4 col-md-6 col-sm-12 col-12">
                                <label for="modeOfStudy" class="form-label lbl-color w-100 mb-0">Mode of
                                  Study</label>
                                <strong>
                                  <div class="parameters over-scroll-down" id="form-ModeOfStudy">-</div>
                                </strong>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="mt-2 card">
                          <div class="card-body">
                            <div class="viewmore-wrap show row">
                              <h6 class="tab-title p-2 mr-2"><b>Maintenance Parameters</b>
                              </h6>
                              <div class="mb-1 col-lg-4 col-md-6 col-sm-12 col-12">
                                <label for="residentialStatus" class="form-label lbl-color w-100 mb-0">Residential
                                  Status</label>
                                <strong>
                                  <div class="parameters over-scroll-down" id="form-ResidentalStatus">-</div>
                                </strong>
                              </div>
                              <div class="mb-1 col-lg-4 col-md-6 col-sm-12 col-12">
                                <label for="maintainanceCourseGroup" class="form-label lbl-color w-100 mb-0">Maintenance
                                  Course Group</label>
                                <strong>
                                  <div class="parameters over-scroll-down" id="form-MaintanenceGrp">-</div>
                                </strong>
                              </div>
                              <div class="mb-1 col-lg-4 col-md-6 col-sm-12 col-12">
                                <label for="disabilityStatus" class="form-label lbl-color w-100 mb-0">Disability
                                  Status</label>
                                <strong>
                                  <div class="parameters over-scroll-down" id="form-DisabilityStatus">-</div>
                                </strong>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="mt-2 card">
                          <div class="card-body">
                            <div class="viewmore-wrap show row">
                              <h6 class="tab-title p-2 mr-2"><b>Socio Economic Parameters</b></h6>
                              <div class="mb-1 col-lg-4 col-md-6 col-sm-12 col-12">
                                <label for="religion" class="form-label lbl-color w-100 mb-0">Religion</label>
                                <strong>
                                  <div class="parameters over-scroll-down" id="form-Religion">-</div>
                                </strong>
                              </div>
                              <div class="mb-1 col-lg-4 col-md-6 col-sm-12 col-12">
                                <label for="community" class="form-label lbl-color w-100 mb-0">Community</label>
                                <strong>
                                  <div class="parameters over-scroll-down" id="form-Community">-</div>
                                </strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal End --> `;
    }
  } 

  customElements.define('view-scheme-component', Header);