class Header extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.innerHTML = `
      <div class="modal fade" id="checkeligibility_modal" tabindex="-1" data-bs-backdrop="static"
              data-bs-keyboard="false" role="dialog" aria-labelledby="checkeligibility_modal" aria-hidden="true">
              <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-xl" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="checkeligibility_modal">
                      Check Eligibility
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <div class="">
                      <div class="card-body">
                        <div class="table-responsive">
                          <table class="table table-bordered table-striped  ">
                            <thead>
                              <tr>
                                <th scope="col">Parameters</th>
                                <th>Scheme Parameters</th>
                                <th>Student Parameters</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody id="studentTableBody">
                              <tr>
                                <td>Religion</td>
  
                                <td id="scheme_check_religion">-</td>
                                <td id="student_check_religion"></td>
                                <td id="status_check_religion"></td>
                              </tr>
                              <tr>
                                <td>Community</td>
  
                                <td id="scheme_check_community_name">-</td>
                                <td id="student_check_community_name"></td>
                                <td id="status_check_community_name"></td>
                              </tr>
                              <tr>
                                <td>Caste</td>
  
                                <td id="scheme_check_caste_name">-</td>
                                <td id="student_check_caste_name"></td>
                                <td id="status_check_caste_name"></td>
                              </tr>
                              <tr>
                                <td>Gender</td>
  
                                <td id="scheme_check_gender">-</td>
                                <td id="student_check_gender"></td>
                                <td id="status_check_gender"></td>
                              </tr>
                              <tr>
                                <td>Income</td>
  
                                <td id="scheme_check_income">-</td>
                                <td id="student_check_income"></td>
                                <td id="status_check_income"></td>
                              </tr>
                              <tr>
                                <td>Education Type</td>
  
                                <td id="scheme_check_educationtype">-</td>
                                <td id="student_check_educationtype"></td>
                                <td id="status_check_educationtype"></td>
                              </tr>
                              <tr>
                                <td>Ownership</td>
  
                                <td id="scheme_check_ownership">-</td>
                                <td id="student_check_ownership"></td>
                                <td id="status_check_ownership"></td>
                              </tr>
                              <tr>
                                <td>University Type</td>
  
                                <td id="scheme_check_universitytype">-</td>
                                <td id="student_check_universitytype"></td>
                                <td id="status_check_universitytype"></td>
                              </tr>
                              <tr>
                                <td>University Name</td>
  
                                <td id="scheme_check_universityname">-</td>
                                <td id="student_check_universityname"></td>
                                <td id="status_check_universityname"></td>
                              </tr>
                              <tr>
                                <td>Institution Name</td>
  
                                <td id="scheme_check_institution_name">-</td>
                                <td id="student_check_institution_name"></td>
                                <td id="status_check_institution_name"></td>
                              </tr>
                              <tr>
                                <td>Stream Name</td>
  
                                <td id="scheme_check_stream_name">-</td>
                                <td id="student_check_stream_name"></td>
                                <td id="status_check_stream_name"></td>
                              </tr>
                              <tr>
                                <td>Course Type</td>
  
                                <td id="scheme_check_course_type">-</td>
                                <td id="student_check_course_type"></td>
                                <td id="status_check_course_type"></td>
                              </tr>
                              <tr>
                                <td>Course Category Name</td>
  
                                <td id="scheme_check_coursecategoryname">-</td>
                                <td id="student_check_coursecategoryname"></td>
                                <td id="status_check_coursecategoryname"></td>
                              </tr>
                              <tr>
                                <td>Course Name</td>
  
                                <td id="scheme_check_course_name">-</td>
                                <td id="student_check_course_name"></td>
                                <td id="status_check_course_name"></td>
                              </tr>
                              <tr>
                                <td>Course Branch Name</td>
  
                                <td id="scheme_check_coursebranchname">-</td>
                                <td id="student_check_coursebranchname"></td>
                                <td id="status_check_coursebranchname"></td>
                              </tr>
                              <tr>
                                <td>Studying Year</td>
  
                                <td id="scheme_check_studingyear">-</td>
                                <td id="student_check_studingyear"></td>
                                <td id="status_check_studingyear"></td>
                              </tr>
                              <tr>
                                <td>Medium</td>
                                <td id="scheme_check_medium">-</td>
                                <td id="student_check_medium"></td>
                                <td id="status_check_medium"></td>
                              </tr>
                              <tr>
                                <td>Quota</td>
  
                                <td id="scheme_check_quota">-</td>
                                <td id="student_check_quota"></td>
                                <td id="status_check_quota"></td>
                              </tr>
                              <tr>
                                <td>Special Category</td>
  
                                <td id="scheme_check_specialcategory">-</td>
                                <td id="student_check_specialcategory"></td>
                                <td id="status_check_specialcategory"></td>
                              </tr>
                              <tr>
                                <td>Mode of Study</td>
  
                                <td id="scheme_check_mode_of_study">-</td>
                                <td id="student_check_mode_of_study"></td>
                                <td id="status_check_mode_of_study"></td>
                              </tr>
                              <tr>
                                <td>Is Hosteler</td>
  
                                <td id="scheme_check_is_hosteler">-</td>
                                <td id="student_check_is_hosteler"></td>
                                <td id="status_check_is_hosteler"></td>
                              </tr>
                              <tr>
                                <td>Disability Status</td>
  
                                <td id="scheme_check_disability_status">-</td>
                                <td id="student_check_disability_status"></td>
                                <td id="status_check_disability_status"></td>
                              </tr>
                              <tr>
                                <td>Disability Name</td>
  
                                <td id="scheme_check_disability_name">-</td>
                                <td id="student_check_disability_name"></td>
                                <td id="status_check_disability_name"></td>
                              </tr>
                              <tr>
                                <td>Nationality</td>
  
                                <td id="scheme_check_nationality">-</td>
                                <td id="student_check_nationality"></td>
                                <td id="status_check_nationality"></td>
                              </tr>
                              <tr>
                                <td>Date of Admission</td>
  
                                <td id="scheme_check_date_of_admission">-</td>
                                <td id="student_check_date_of_admission"></td>
                                <td id="status_check_date_of_admission"></td>
                              </tr>
                              <tr>
                                <td>First Graduate</td>
  
                                <td id="scheme_check_isfirstgraduate">-</td>
                                <td id="student_check_isfirstgraduate"></td>
                                <td id="status_check_isfirstgraduate"></td>
                              </tr>
                            </tbody>
  
                          </table>
                        </div>
  
                      </div>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>`;
    }
  }
  
  customElements.define('check-eligibility-component', Header);