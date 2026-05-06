let criteriaList = [];let activeCardId = null; 
const ExclusiveAPIMap = {
  eligibility: {
    student: async ($section) => {
      console.log('Call Eligibility → Student API');
      // 👉 your API call here
    },
    institute: async ($section) => {
      console.log('Call Eligibility → Institute API');
    },
    course: async ($section) => {
      console.log('Call Eligibility → Course API');
    }
  },
  scholarship: {
    student: async ($section) => {
      console.log('Call Scholarship → Student API');
    },
    institute: async ($section) => {
      console.log('Call Scholarship → Institute API');
    },
    course: async ($section) => {
      console.log('Call Scholarship → Course API');
    }
  }
};
$(document).ready(function() {
    $('.exclusive-toggle').each(function() {
        const isEnabled = $(this).is(':checked');
        const $section = $(this).closest('.incl-excl');
        
        if (!isEnabled) {
            // Toggle is OFF - set "Not Applicable" and disable
            // First, set "Not Applicable" for all chip groups
            $section.find('.chip-select').each(function() {
                const $naChip = $(this).find('input[value="-1"]').closest('.chip');
                const $naCheckbox = $naChip.find('input');
                
                // Clear all selections in this group
                $(this).find('input').prop('checked', false).closest('.chip').removeClass('active');
                
                // Select Not Applicable
                $naCheckbox.prop('checked', true);
                $naChip.addClass('active');
            });
            
            // Then disable all inputs (but keep the "Not Applicable" selection visible)
            const $allInputs = $section.find('input, select, .chip');
            const $inputsToControl = $allInputs.not(this);
            
            $section.addClass('disabled-section');
            $inputsToControl.prop('disabled', true);
            $section.find('.chip').addClass('disabled-chip');
        } else {
            // Toggle is ON - enable and set "Not Applicable"
            $section.removeClass('disabled-section');
            $section.find('.chip').removeClass('disabled-chip');
            
            // Set "Not Applicable" for all chip groups
            $section.find('.chip-select').each(function() {
                const $naChip = $(this).find('input[value="-1"]').closest('.chip');
                const $naCheckbox = $naChip.find('input');
                
                // Clear all selections in this group
                $(this).find('input').prop('checked', false).closest('.chip').removeClass('active');
                
                // Select Not Applicable
                $naCheckbox.prop('checked', true);
                $naChip.addClass('active');
            });
            
            // Enable all inputs
            $section.find('input, select, .chip').not(this).prop('disabled', false);
        }
    });
});

function resetSelectToNA(selector) {
    const $el = $(selector);

    try {
        if ($el.data('select2')) {
            $el.select2('destroy');
        }
    } catch (e) {}

    // FULL RESET
    $el.empty();

    // Add only NA
    $el.append(new Option('Not Applicable', '-1', true, true));

    // Force value
    $el.val(['-1']);

    // Reinitialize
    $el.prop('multiple', true).select2({
        width: '100%',
        placeholder: '--Select--'
    });

    // Sync UI
    $el.trigger('change');
}
$(document).on('click', '.chip', function () {

    const $chip = $(this);
    const $container = $chip.closest('.chip-select'); // ✅ scoped container

    const NOT_APPLICABLE = '-1';

    const $checkbox = $chip.find('input');
    const value = $checkbox.val();

    const isChecked = $checkbox.prop('checked');

    // ============================
    // NOT APPLICABLE
    // ============================
    if (value === NOT_APPLICABLE) {

        if (isChecked) return;

        $container.find('input')
            .prop('checked', false)
            .closest('.chip').removeClass('active');

        $checkbox.prop('checked', true);
        $chip.addClass('active');

        return;
    }

    // ============================
    // NORMAL OPTIONS
    // ============================
    const newState = !isChecked;
    $checkbox.prop('checked', newState);
    $chip.toggleClass('active', newState);

    if (newState) {
        $container.find(`input[value="${NOT_APPLICABLE}"]`)
            .prop('checked', false)
            .closest('.chip').removeClass('active');
    }

    const anySelected = $container.find('input:checked').length;

    if (!anySelected) {
        const $na = $container.find(`input[value="${NOT_APPLICABLE}"]`);
        $na.prop('checked', true)
           .closest('.chip').addClass('active');
    }
});

$(document).on('change', '.exclusive-toggle', async function () {

    const isEnabled = $(this).is(':checked');
    const $section = $(this).closest('.incl-excl');

    const tab  = $section.data('tab');   // eligibility / scholarship
    const step = $section.data('step');  // student / institute / course

    const $allInputs = $section.find('input, select, .chip');
    const $inputsToControl = $allInputs.not(this);

    if (isEnabled) {

        // =========================
        // ENABLE SECTION
        // =========================
        $section.removeClass('disabled-section');
        $inputsToControl.prop('disabled', false);
        $section.find('.chip').removeClass('disabled-chip');

        // Reset to Not Applicable
        $section.find('.chip-select').each(function () {
            const $na = $(this).find('input[value="-1"]');

            $(this).find('input')
                .prop('checked', false)
                .closest('.chip').removeClass('active');

            $na.prop('checked', true)
               .closest('.chip').addClass('active');
        });

        // =========================
        // 🔥 CALL API ONLY ONCE
        // =========================
        if (!$section.data('apiLoaded')) {

            if (ExclusiveAPIMap?.[tab]?.[step]) {
                await ExclusiveAPIMap[tab][step]($section);
            }

            $section.data('apiLoaded', true); // ✅ prevent duplicate
        }

    } else {

        // =========================
        // RESET → NA FIRST
        // =========================
        $section.find('.chip-select').each(function () {
            const $na = $(this).find('input[value="-1"]');

            $(this).find('input')
                .prop('checked', false)
                .closest('.chip').removeClass('active');

            $na.prop('checked', true)
               .closest('.chip').addClass('active');
        });

        // =========================
        // DISABLE
        // =========================
        $section.addClass('disabled-section');
        $inputsToControl.prop('disabled', true);
        $section.find('.chip').addClass('disabled-chip');

        // ❗ OPTIONAL: reset API flag if you want re-fetch on next ON
        // $section.removeData('apiLoaded');
    }
});


function getEligibilityFormData(){
    // CORRECTED: Added proper brackets and quotes
    const $inclusiveinstitute = $('.incl-excl.active[data-tab="eligibility"][data-step="institute"]');
    const $exclusiveinstitute = $('.incl-excl[data-tab="eligibility"][data-step="institute"]:not(.active)');
    const $inclusivecourse = $('.incl-excl.active[data-tab="eligibility"][data-step="course"]');
    const $exclusivecourse = $('.incl-excl[data-tab="eligibility"][data-step="course"]:not(.active)');
    
    const eligibleFormData = {
        student:{
            inclusive:{
                community: getChipValues('#eligibleinclusivecommunity'),
                caste: getSelectValues('#eligibleinclusivecaste'),
                religion: getSelectValues('#eincreligion'),
                gender: getChipValues('#eligibleinclusivegender'),
                income: getIncomeValues('.incl-excl.active .form-group'),
                quota: getChipValues('#eligibleinclusivequota'),
                residential_status: getChipValues('#eligibleinclusiveresidential'),
                special_category: getChipValues('#eligibleinclusivespecialcategory'),
                is_first_graduate: getChipValues('#eligibleinclusivefirstgraduate')
            },
            exclusive:{
                enabled: isExclusiveEnabled('student'),
                community: getChipValues('#eligibleexclusivecommunity'), // FIXED: changed from 'communtiy' to 'community'
                caste: getSelectValues('#eligibleexclusivecaste'),
                religion: getSelectValues('#eexcreligion'),
                gender: getChipValues('#eligibleexclusivegender'),
                income: getIncomeValues('.incl-excl[data-tab="eligibility"][data-step="student"]:not(.active) .form-group'), // FIXED: added brackets
                quota: getChipValues('#eligibleexclusivequota'),
                residential_status: getChipValues('#eligibleexclusiveresidential'),
                special_category: getChipValues('#eligibleexclusivespecialcategory'),
                is_first_graduate: getChipValues('#eligibleexclusivefirstgraduate')
            }
        },
        institute:{
            inclusive:{
                institute_ownership: getChipValuesFromSection($inclusiveinstitute, 'Institute Ownership'),
                university_type: getSelectValueFromSection($inclusiveinstitute, 'University Type'),
                university: getSelectValueFromSection($inclusiveinstitute, 'University'),
                institute_category: getSelectValueFromSection($inclusiveinstitute, 'Institute Category'),
                institute_name: getSelectValueFromSection($inclusiveinstitute, 'Institute name')
            },
            exclusive:{
                enabled: isExclusiveEnabled('institute'),
                institute_ownership: getChipValuesFromSection($exclusiveinstitute, 'Institute Ownership'),
                university_type: getSelectValueFromSection($exclusiveinstitute, 'University Type'),
                university: getSelectValueFromSection($exclusiveinstitute, 'University'),
                institute_category: getSelectValueFromSection($exclusiveinstitute, 'Institute Category'),
                institute_name: getSelectValueFromSection($exclusiveinstitute, 'Institute name')
            }
        },
        course:{
            inclusive:{
                stream: getSelectValueFromSection($inclusivecourse, 'Stream'),
                course_type: getChipValuesFromSection($inclusivecourse, 'Course Type'),
                course_category: getSelectValueFromSection($inclusivecourse, 'Course Category'),
                course: getSelectValueFromSection($inclusivecourse, 'Course'),
                course_branch: getSelectValueFromSection($inclusivecourse, 'Course Branch'),
                course_year: getSelectValueFromSection($inclusivecourse, 'Course Year')
            },
            exclusive:{
                enabled: isExclusiveEnabled('course'),
                stream: getSelectValueFromSection($exclusivecourse, 'Stream'),
                course_type: getChipValuesFromSection($exclusivecourse, 'Course Type'),
                course_category: getSelectValueFromSection($exclusivecourse, 'Course Category'),
                course: getSelectValueFromSection($exclusivecourse, 'Course'),
                course_branch: getSelectValueFromSection($exclusivecourse, 'Course Branch'),
                course_year: getSelectValueFromSection($exclusivecourse, 'Course Year')
            }
        }
    };
    return eligibleFormData;
}

// ADD THIS MISSING FUNCTION
function getSelectValueFromSection($section, labelText, includeNotApplicable = true) {
    const values = [];
    const $formGroup = $section.find('.form-group').filter(function() {
        return $(this).find('.form-label').text().trim() === labelText;
    });
    
    $formGroup.find('select option:selected').each(function() {
        const value = $(this).val();
        const text = $(this).text().trim();
        
        if (includeNotApplicable) {
            values.push({ value: value, text: text });
        } else {
            if (value && value !== '-1' && value !== 'Not Applicable') {
                values.push({ value: value, text: text });
            }
        }
    });
    
    // If no values found, return array with Not Applicable
    if (values.length === 0 && includeNotApplicable) {
        values.push({ value: '-1', text: 'Not Applicable' });
    }
    
    return values;
}

// Helper function to check if exclusive is enabled
function isExclusiveEnabled(section) {
    // Adjust this selector based on your actual HTML structure
    return $(`.incl-excl[data-step="${section}"] .exclusive-toggle`).is(':checked');
}

// Fix getIncomeValues - update the selector names
function getIncomeValues(container, includeEmpty = true) {
    const $container = $(container);
    // Changed from #incomeRange and #incomeValue to match your actual IDs
    const $incomeRange = $container.find('.cond-select.op');
    const $incomeValue = $container.find('.form-input');
    
    if (includeEmpty) {
        return {
            operator: $incomeRange.val() || null,
            value: $incomeValue.val() || null
        };
    } else {
        if ($incomeValue.val() && $incomeValue.val().trim() !== '') {
            return {
                operator: $incomeRange.val(),
                value: $incomeValue.val()
            };
        }
        return null;
    }
}
 function renderCriteriaCards() {
    const container = $('#dynamicCardsWrapper');
    if (!container.length) return;
    
    if (criteriaList.length === 0) {
        container.html('<div class="text-muted text-center py-3">No eligibility criteria added yet</div>');
        $('#criteriaCount').text('0');
        activeCardId = null; // Reset active card when no criteria
        return;
    }
    
    let html = '';
    criteriaList.forEach((criteria, index) => {
        const showIcons = (activeCardId === criteria.id);
        html += `
            <div class="sub-scheme-card" data-criteria-id="${criteria.id}" data-tab="fee-tab${index}">
                <div class="sub-scheme-card-name text-left">${escapeHtml(criteria.name)}
                </div>
                <div class="card-actions" style="display: ${showIcons ? 'flex' : 'none'}">
                    <button class="preview-btn" data-id="${criteria.id}" data-bs-toggle="modal" data-bs-target="#add_fee">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="delete-btn" data-id="${criteria.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    container.html(html);
    $('#criteriaCount').text(criteriaList.length);
    
    // Re-attach all event handlers after HTML is updated
    attachCardEvents();
}

// Separate function to attach all card events
function attachCardEvents() {
    // Card click event to show/hide icons
    $('.sub-scheme-card').off('click.card').on('click.card', function(e) {
        // Don't trigger if clicking on buttons
        if ($(e.target).closest('.preview-btn, .delete-btn').length) {
            return;
        }
        
        const cardId = $(this).data('criteria-id');
        
        // If clicking the same card that's active, hide icons
        if (activeCardId === cardId) {
            activeCardId = null;
        } else {
            // Otherwise, show icons for this card and hide others
            activeCardId = cardId;
        }
        
        // Re-render to update icon visibility
        renderCriteriaCards();
    });
    
    // Delete button event handlers
    $('.delete-btn').off('click.delete').on('click.delete', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const id = $(this).data('id');
        deleteCriteria(id);
    });
    
    // Preview button event handlers
    $('.preview-btn').off('click.preview').on('click.preview', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const id = $(this).data('id');
        const criteria = criteriaList.find(c => c.id === id);
        if (criteria) {
            showPreviewModal(criteria);
        }
    });
}

// Add escapeHtml function to prevent XSS
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Update deleteCriteria function
function deleteCriteria(id) {
    criteriaList = criteriaList.filter(c => c.id !== id);
    if (activeCardId === id) {
        activeCardId = null;
    }
    renderCriteriaCards();
}

function showPreviewModal(criteria) {
        const data = criteria.formData;
        
        // Build preview HTML
        let previewHtml = '<div class="preview-grid">';
        
        // Student Section - Inclusive
        previewHtml += `<div class="preview-section full-width"><strong>🎓 Student Parameters (Inclusive)</strong></div>`;
        previewHtml += `<div class="preview-item"><label>Community:</label><span>${data.student.inclusive.community || 'N/A'}</span></div>`;
        previewHtml += `<div class="preview-item"><label>Caste:</label><span>${data.student.inclusive.caste.filter(c => c !== '-1').join(', ') || 'N/A'}</span></div>`;
        previewHtml += `<div class="preview-item"><label>Religion:</label><span>${data.student.inclusive.religion.filter(r => r !== '-1').join(', ') || 'N/A'}</span></div>`;
        previewHtml += `<div class="preview-item"><label>Gender:</label><span>${data.student.inclusive.gender}</span></div>`;
        previewHtml += `<div class="preview-item"><label>Income:</label><span>${data.student.inclusive.income}</span></div>`;
        previewHtml += `<div class="preview-item"><label>Quota:</label><span>${data.student.inclusive.quota}</span></div>`;
        previewHtml += `<div class="preview-item"><label>Residential Status:</label><span>${data.student.inclusive.residential}</span></div>`;
        previewHtml += `<div class="preview-item"><label>Special Category:</label><span>${data.student.inclusive.specialCategory}</span></div>`;
        previewHtml += `<div class="preview-item"><label>First Graduate:</label><span>${data.student.inclusive.firstGraduate}</span></div>`;
        
        // Student Section - Exclusive
        previewHtml += `<div class="preview-section full-width mt-3"><strong>🎓 Student Parameters (Exclusive)</strong></div>`;
        previewHtml += `<div class="preview-item"><label>Community:</label><span>${data.student.exclusive.community || 'N/A'}</span></div>`;
        previewHtml += `<div class="preview-item"><label>Caste:</label><span>${data.student.exclusive.caste.filter(c => c !== '-1').join(', ') || 'N/A'}</span></div>`;
        previewHtml += `<div class="preview-item"><label>Religion:</label><span>${data.student.exclusive.religion.filter(r => r !== '-1').join(', ') || 'N/A'}</span></div>`;
        previewHtml += `<div class="preview-item"><label>Gender:</label><span>${data.student.exclusive.gender}</span></div>`;
        previewHtml += `<div class="preview-item"><label>Income:</label><span>${data.student.exclusive.income}</span></div>`;
        
        // Institute Section - Inclusive
        previewHtml += `<div class="preview-section full-width mt-3"><strong>🏛️ Institute Parameters (Inclusive)</strong></div>`;
        previewHtml += `<div class="preview-item"><label>Ownership:</label><span>${data.institute.inclusive.ownership.filter(o => o !== '-1').join(', ') || 'N/A'}</span></div>`;
        previewHtml += `<div class="preview-item"><label>University Type:</label><span>${data.institute.inclusive.universityType.filter(u => u !== '-1').join(', ') || 'N/A'}</span></div>`;
        previewHtml += `<div class="preview-item"><label>University:</label><span>${data.institute.inclusive.university.filter(u => u !== '-1').join(', ') || 'N/A'}</span></div>`;
        previewHtml += `<div class="preview-item"><label>Institute Category:</label><span>${data.institute.inclusive.instituteCategory.filter(c => c !== '-1').join(', ') || 'N/A'}</span></div>`;
        previewHtml += `<div class="preview-item"><label>Institute Name:</label><span>${data.institute.inclusive.instituteName.filter(n => n !== '-1').join(', ') || 'N/A'}</span></div>`;
        
        // Institute Section - Exclusive
        previewHtml += `<div class="preview-section full-width mt-3"><strong>🏛️ Institute Parameters (Exclusive)</strong></div>`;
        previewHtml += `<div class="preview-item"><label>Ownership:</label><span>${data.institute.exclusive.ownership.filter(o => o !== '-1').join(', ') || 'N/A'}</span></div>`;
        previewHtml += `<div class="preview-item"><label>University Type:</label><span>${data.institute.exclusive.universityType.filter(u => u !== '-1').join(', ') || 'N/A'}</span></div>`;
        previewHtml += `<div class="preview-item"><label>University:</label><span>${data.institute.exclusive.university.filter(u => u !== '-1').join(', ') || 'N/A'}</span></div>`;
        previewHtml += `<div class="preview-item"><label>Institute Category:</label><span>${data.institute.exclusive.instituteCategory.filter(c => c !== '-1').join(', ') || 'N/A'}</span></div>`;
        previewHtml += `<div class="preview-item"><label>Institute Name:</label><span>${data.institute.exclusive.instituteName.filter(n => n !== '-1').join(', ') || 'N/A'}</span></div>`;
        
        // Course Section - Inclusive
        previewHtml += `<div class="preview-section full-width mt-3"><strong>📘 Course Parameters (Inclusive)</strong></div>`;
        previewHtml += `<div class="preview-item"><label>Stream:</label><span>${data.course.inclusive.stream.filter(s => s !== '-1').join(', ') || 'N/A'}</span></div>`;
        previewHtml += `<div class="preview-item"><label>Course Type:</label><span>${data.course.inclusive.courseType.filter(c => c !== '-1').join(', ') || 'N/A'}</span></div>`;
        previewHtml += `<div class="preview-item"><label>Course Category:</label><span>${data.course.inclusive.courseCategory.filter(c => c !== '-1').join(', ') || 'N/A'}</span></div>`;
        previewHtml += `<div class="preview-item"><label>Course:</label><span>${data.course.inclusive.course.filter(c => c !== '-1').join(', ') || 'N/A'}</span></div>`;
        previewHtml += `<div class="preview-item"><label>Course Branch:</label><span>${data.course.inclusive.courseBranch.filter(b => b !== '-1').join(', ') || 'N/A'}</span></div>`;
        previewHtml += `<div class="preview-item"><label>Course Year:</label><span>${data.course.inclusive.courseYear.filter(y => y !== '-1').join(', ') || 'N/A'}</span></div>`;
        
        // Course Section - Exclusive
        previewHtml += `<div class="preview-section full-width mt-3"><strong>📘 Course Parameters (Exclusive)</strong></div>`;
        previewHtml += `<div class="preview-item"><label>Stream:</label><span>${data.course.exclusive.stream.filter(s => s !== '-1').join(', ') || 'N/A'}</span></div>`;
        previewHtml += `<div class="preview-item"><label>Course Type:</label><span>${data.course.exclusive.courseType.filter(c => c !== '-1').join(', ') || 'N/A'}</span></div>`;
        previewHtml += `<div class="preview-item"><label>Course Category:</label><span>${data.course.exclusive.courseCategory.filter(c => c !== '-1').join(', ') || 'N/A'}</span></div>`;
        previewHtml += `<div class="preview-item"><label>Course:</label><span>${data.course.exclusive.course.filter(c => c !== '-1').join(', ') || 'N/A'}</span></div>`;
        previewHtml += `<div class="preview-item"><label>Course Branch:</label><span>${data.course.exclusive.courseBranch.filter(b => b !== '-1').join(', ') || 'N/A'}</span></div>`;
        previewHtml += `<div class="preview-item"><label>Course Year:</label><span>${data.course.exclusive.courseYear.filter(y => y !== '-1').join(', ') || 'N/A'}</span></div>`;
        
        previewHtml += '</div>';
        
        $('#dynamicPreviewGrid').html(previewHtml);
        $('#add_fee_modalLabel').text(`Eligibility Criteria: ${criteria.name}`);
    }

function getChipValues(containerId, includeNotApplicable = true) {
    const values = [];
    $(`${containerId} .chip.active input:checked`).each(function() {
        const value = $(this).val();
        const text = $(this).closest('.chip').text().trim();
        
        if (includeNotApplicable) {
            // Include all selected values including Not Applicable
            values.push({ value: value, text: text });
        } else {
            // Exclude Not Applicable
            if (value && value !== '-1') {
                values.push({ value: value, text: text });
            }
        }
    });
    return values;
}

function getChipValuesFromSection($section, labelText, includeNotApplicable = true) {
    const values = [];
    const $formGroup = $section.find('.form-group').filter(function() {
        return $(this).find('.form-label').text().trim() === labelText;
    });
    
    $formGroup.find('.chip.active input:checked').each(function() {
        const value = $(this).val();
        const text = $(this).closest('.chip').text().trim();
        
        if (includeNotApplicable) {
            // Include all selected values including Not Applicable
            values.push({ value: value, text: text });
        } else {
            // Exclude Not Applicable
            if (value && value !== '-1') {
                values.push({ value: value, text: text });
            }
        }
    });
    return values;
}

function getSelectValues(selectId, includeNotApplicable = true) {
    const values = [];
    $(`${selectId} option:selected`).each(function() {
        const value = $(this).val();
        const text = $(this).text().trim();
        
        if (includeNotApplicable) {
            // Include all selected values including Not Applicable
            values.push({ value: value, text: text });
        } else {
            // Exclude Not Applicable
            if (value && value !== '-1' && value !== 'Not Applicable') {
                values.push({ value: value, text: text });
            }
        }
    });
    return values;
}

// Function to check if Not Applicable is selected
function isNotApplicableSelected(containerId) {
    let isSelected = false;
    $(`${containerId} .chip.active input:checked`).each(function() {
        if ($(this).val() === '-1') {
            isSelected = true;
        }
    });
    return isSelected;
}

// Function to get only Not Applicable fields
function getNotApplicableFields() {
    const notApplicableFields = {
        student: {
            inclusive: {
                community: isNotApplicableSelected('#eligibleinclusivecommunity'),
                religion: $('#eincreligion').val()?.includes('-1') || false,
                gender: isNotApplicableSelected('#eligibleinclusivegender'),
                quota: isNotApplicableSelected('#eligibleinclusivequota'),
                residential_status: isNotApplicableSelected('#eligibleinclusiveresidential'),
                special_category: isNotApplicableSelected('#eligibleinclusivespecialcategory'),
                is_first_graduate: isNotApplicableSelected('#eligibleinclusivefirstgraduate')
            },
            exclusive: {
                community: isNotApplicableSelected('#eligibleexclusivecommuntiy'),
                religion: $('#eexcreligion').val()?.includes('Not Applicable') || false,
                gender: isNotApplicableSelected('#eligibleexclusivegender'),
                quota: isNotApplicableSelected('#eligibleexclusivequota'),
                residential_status: isNotApplicableSelected('#eligibleexclusiveresidential'),
                special_category: isNotApplicableSelected('#eligibleexclusivespecialcategory'),
                is_first_graduate: isNotApplicableSelected('#eligibleexclusivefirstgraduate')
            }
        }
    };
    return notApplicableFields;

}





function getChipValuesAs(containerId, returnType = 'string', includeNotApplicable = false) {
    const values = [];
    
    $(`${containerId} .chip.active input:checked`).each(function() {
        const value = $(this).val();
        if (includeNotApplicable) {
            values.push(value);
        } else {
            if (value && value !== '-1') {
                values.push(value);
            }
        }
    });
    
    if (returnType === 'string') {
        return values.join(',');
    } else if (returnType === 'array') {
        return values;
    } else if (returnType === 'object') {
        const objects = [];
        $(`${containerId} .chip.active input:checked`).each(function() {
            const value = $(this).val();
            const text = $(this).closest('.chip').text().trim();
            if (includeNotApplicable) {
                objects.push({ value: value, text: text });
            } else {
                if (value && value !== '-1') {
                    objects.push({ value: value, text: text });
                }
            }
        });
        return objects;
    }
}


function getSelectValuesAs(selectId, returnType = 'string', includeNotApplicable = false) {
    const values = [];
    
    $(`${selectId} option:selected`).each(function() {
        const value = $(this).val();
        if (includeNotApplicable) {
            values.push(value);
        } else {
            if (value && value !== '-1' && value !== 'Not Applicable') {
                values.push(value);
            }
        }
    });
    
    if (returnType === 'string') {
        return values.join(',');
    } else if (returnType === 'array') {
        return values;
    } else if (returnType === 'object') {
        const objects = [];
        $(`${selectId} option:selected`).each(function() {
            const value = $(this).val();
            const text = $(this).text().trim();
            if (includeNotApplicable) {
                objects.push({ value: value, text: text });
            } else {
                if (value && value !== '-1' && value !== 'Not Applicable') {
                    objects.push({ value: value, text: text });
                }
            }
        });
        return objects;
    }
}


function getFieldValueAs(fieldId, fieldType, returnType = 'string', includeNotApplicable = false) {
    if (fieldType === 'chip') {
        return getChipValuesAs(fieldId, returnType, includeNotApplicable);
    } else if (fieldType === 'select') {
        return getSelectValuesAs(fieldId, returnType, includeNotApplicable);
    }
    return returnType === 'string' ? '' : [];
}