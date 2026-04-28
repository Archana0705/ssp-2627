
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

// $(document).on('click', '.chip', function () {
//     // Check if the chip is inside a disabled section
//     const $section = $(this).closest('.incl-excl');
//     if ($section.hasClass('disabled-section')) {
//         return; // Prevent selection when section is disabled
//     }

//     const $chip = $(this);
//     const $container = $chip.closest('.chip-select');

//     const group = $container.data('group');
//     const type  = $container.data('type');

//     const NOT_APPLICABLE = '-1';

//     const $checkbox = $chip.find('input');
//     const value = $checkbox.val();

//     // const $currentGroup = $(`.chip-select[data-group="${group}"][data-type="${type}"]`);
//     const isCurrentlyChecked = $checkbox.prop('checked');

//     if (value === NOT_APPLICABLE) {
//         // Prevent unchecking NA
//         if (isCurrentlyChecked) {
//             return; // do nothing
//         }

//         // Select NA and clear others
//         $currentGroup.find('input')
//             .prop('checked', false)
//             .closest('.chip').removeClass('active');

//         $checkbox.prop('checked', true);
//         $chip.addClass('active');

//         return;
//     }

//     // ============================
//     // CASE 2: OTHER OPTIONS CLICKED
//     // ============================

//     // Toggle current
//     const newState = !isCurrentlyChecked;
//     $checkbox.prop('checked', newState);
//     $chip.toggleClass('active', newState);

//     // If any normal option selected → remove NA
//     if (newState) {
//         $currentGroup.find(`input[value="${NOT_APPLICABLE}"]`)
//             .prop('checked', false)
//             .closest('.chip').removeClass('active');
//     }

//     // If NO options selected → fallback to NA
//     const anySelected = $currentGroup.find('input:checked').length;

//     if (!anySelected) {
//         const $na = $currentGroup.find(`input[value="${NOT_APPLICABLE}"]`);
//         $na.prop('checked', true)
//            .closest('.chip').addClass('active');
//     }
// });
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

$(document).on('change', '.exclusive-toggle', function () {
    const isEnabled = $(this).is(':checked');
    const $section = $(this).closest('.incl-excl');

    const $allInputs = $section.find('input, select, .chip');
    const $inputsToControl = $allInputs.not(this);

    if (isEnabled) {
        // Enable section
        $section.removeClass('disabled-section');
        $inputsToControl.prop('disabled', false);
        $section.find('.chip').removeClass('disabled-chip');
        
        // Set default "Not Applicable" for all chip groups when toggling ON
        $section.find('.chip-select').each(function() {
            const $naChip = $(this).find('input[value="-1"]').closest('.chip');
            const $naCheckbox = $naChip.find('input');
            
            // Clear all selections in this group
            $(this).find('input').prop('checked', false).closest('.chip').removeClass('active');
            
            // Select Not Applicable
            $naCheckbox.prop('checked', true);
            $naChip.addClass('active');
        });
    } else {
        // When toggling OFF: First set "Not Applicable" WITHOUT disabling
        $section.find('.chip-select').each(function() {
            const $naChip = $(this).find('input[value="-1"]').closest('.chip');
            const $naCheckbox = $naChip.find('input');
            
            // Clear all selections in this group
            $(this).find('input').prop('checked', false).closest('.chip').removeClass('active');
            
            // Select Not Applicable
            $naCheckbox.prop('checked', true);
            $naChip.addClass('active');
        });
        
        // Now disable the section (but "Not Applicable" remains selected)
        $section.addClass('disabled-section');
        $inputsToControl.prop('disabled', true);
        $section.find('.chip').addClass('disabled-chip');
    }
});

function getAllParameterValues() {
    return {
        student: getStudentParameters(),
        institute: getInstituteParameters(),
        course: getCourseParameters()
    };
}

function getStudentParameters() {
    return {
        inclusive: {
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
        exclusive: {
            enabled: isExclusiveEnabled('student'),
            community: getChipValues('#eligibleexclusivecommuntiy'),
            caste: getSelectValues('#eligibleexclusivecaste'),
            religion: getSelectValues('#eexcreligion'),
            gender: getChipValues('#eligibleexclusivegender'),
            income: getIncomeValues('.incl-excl[data-step="student"]:not(.active) .form-group'),
            quota: getChipValues('#eligibleexclusivequota'),
            residential_status: getChipValues('#eligibleexclusiveresidential'),
            special_category: getChipValues('#eligibleexclusivespecialcategory'),
            is_first_graduate: getChipValues('#eligibleexclusivefirstgraduate')
        }
    };
}
function getInstituteParameters() {
    const $inclusiveSection = $('.incl-excl.active[data-step="institute"]');
    const $exclusiveSection = $('.incl-excl[data-step="institute"]:not(.active)');
    
    return {
        inclusive: {
            institute_ownership: getChipValuesFromSection($inclusiveSection, 'Institute Ownership'),
            university_type: getSelectValueFromSection($inclusiveSection, 'University Type'),
            university: getSelectValueFromSection($inclusiveSection, 'University'),
            institute_category: getSelectValueFromSection($inclusiveSection, 'Institute Category'),
            institute_name: getSelectValueFromSection($inclusiveSection, 'Institute name')
        },
        exclusive: {
            enabled: isExclusiveEnabled('institute'),
            institute_ownership: getChipValuesFromSection($exclusiveSection, 'Institute Ownership'),
            university_type: getSelectValueFromSection($exclusiveSection, 'University Type'),
            university: getSelectValueFromSection($exclusiveSection, 'University'),
            institute_category: getSelectValueFromSection($exclusiveSection, 'Institute Category'),
            institute_name: getSelectValueFromSection($exclusiveSection, 'Institute name')
        }
    };
}
function getCourseParameters() {
    const $inclusiveSection = $('.incl-excl.active[data-step="course"]');
    const $exclusiveSection = $('.incl-excl[data-step="course"]:not(.active)');
    
    return {
        inclusive: {
            stream: getSelectValueFromSection($inclusiveSection, 'Stream'),
            course_type: getChipValuesFromSection($inclusiveSection, 'Course Type'),
            course_category: getSelectValueFromSection($inclusiveSection, 'Course Category'),
            course: getSelectValueFromSection($inclusiveSection, 'Course'),
            course_branch: getSelectValueFromSection($inclusiveSection, 'Course Branch'),
            course_year: getSelectValueFromSection($inclusiveSection, 'Course Year')
        },
        exclusive: {
            enabled: isExclusiveEnabled('course'),
            stream: getSelectValueFromSection($exclusiveSection, 'Stream'),
            course_type: getChipValuesFromSection($exclusiveSection, 'Course Type'),
            course_category: getSelectValueFromSection($exclusiveSection, 'Course Category'),
            course: getSelectValueFromSection($exclusiveSection, 'Course'),
            course_branch: getSelectValueFromSection($exclusiveSection, 'Course Branch'),
            course_year: getSelectValueFromSection($exclusiveSection, 'Course Year')
        }
    };
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

function getSelectValueFromSection($section, labelText, includeNotApplicable = true) {
    const $formGroup = $section.find('.form-group').filter(function() {
        return $(this).find('.form-label').text().trim() === labelText;
    });
    
    const $select = $formGroup.find('select');
    const selectedValue = $select.val();
    const selectedText = $select.find('option:selected').text();
    
    if (includeNotApplicable) {
        // Include all values including Not Applicable
        if (selectedValue && selectedValue !== 'All University' && selectedValue !== 'All Institutes') {
            return {
                value: selectedValue,
                text: selectedText
            };
        }
        return null;
    } else {
        // Exclude Not Applicable and default options
        if (selectedValue && selectedValue !== '-1' && selectedValue !== 'Not Applicable' && selectedValue !== 'All University' && selectedValue !== 'All Institutes') {
            return {
                value: selectedValue,
                text: selectedText
            };
        }
        return null;
    }
}

function getIncomeValues(container, includeEmpty = true) {
    const $container = $(container);
    const $incomeRange = $container.find('#incomeRange');
    const $incomeValue = $container.find('#incomeValue');
    
    if (includeEmpty) {
        // Return even if empty (will return null values)
        return {
            operator: $incomeRange.val() || null,
            value: $incomeValue.val() || null
        };
    } else {
        // Return only if has value
        if ($incomeValue.val() && $incomeValue.val().trim() !== '') {
            return {
                operator: $incomeRange.val(),
                value: $incomeValue.val()
            };
        }
        return null;
    }
}

// Updated main functions to include Not Applicable
function getStudentParameters(includeNotApplicable = true) {
    return {
        inclusive: {
            community: getChipValues('#eligibleinclusivecommunity', includeNotApplicable),
            religion: getSelectValues('#eincreligion', includeNotApplicable),
            gender: getChipValues('#eligibleinclusivegender', includeNotApplicable),
            income: getIncomeValues('.incl-excl.active .form-group', includeNotApplicable),
            quota: getChipValues('#eligibleinclusivequota', includeNotApplicable),
            residential_status: getChipValues('#eligibleinclusiveresidential', includeNotApplicable),
            special_category: getChipValues('#eligibleinclusivespecialcategory', includeNotApplicable),
            is_first_graduate: getChipValues('#eligibleinclusivefirstgraduate', includeNotApplicable)
        },
        exclusive: {
            enabled: isExclusiveEnabled('student'),
            community: getChipValues('#eligibleexclusivecommuntiy', includeNotApplicable),
            religion: getSelectValues('#eexcreligion', includeNotApplicable),
            gender: getChipValues('#eligibleexclusivegender', includeNotApplicable),
            income: getIncomeValues('.incl-excl[data-step="student"]:not(.active) .form-group', includeNotApplicable),
            quota: getChipValues('#eligibleexclusivequota', includeNotApplicable),
            residential_status: getChipValues('#eligibleexclusiveresidential', includeNotApplicable),
            special_category: getChipValues('#eligibleexclusivespecialcategory', includeNotApplicable),
            is_first_graduate: getChipValues('#eligibleexclusivefirstgraduate', includeNotApplicable)
        }
    };
}

function getInstituteParameters(includeNotApplicable = true) {
    const $inclusiveSection = $('.incl-excl.active[data-step="institute"]');
    const $exclusiveSection = $('.incl-excl[data-step="institute"]:not(.active)');
    
    return {
        inclusive: {
            institute_ownership: getChipValuesFromSection($inclusiveSection, 'Institute Ownership', includeNotApplicable),
            university_type: getSelectValueFromSection($inclusiveSection, 'University Type', includeNotApplicable),
            university: getSelectValueFromSection($inclusiveSection, 'University', includeNotApplicable),
            institute_category: getSelectValueFromSection($inclusiveSection, 'Institute Category', includeNotApplicable),
            institute_name: getSelectValueFromSection($inclusiveSection, 'Institute name', includeNotApplicable)
        },
        exclusive: {
            enabled: isExclusiveEnabled('institute'),
            institute_ownership: getChipValuesFromSection($exclusiveSection, 'Institute Ownership', includeNotApplicable),
            university_type: getSelectValueFromSection($exclusiveSection, 'University Type', includeNotApplicable),
            university: getSelectValueFromSection($exclusiveSection, 'University', includeNotApplicable),
            institute_category: getSelectValueFromSection($exclusiveSection, 'Institute Category', includeNotApplicable),
            institute_name: getSelectValueFromSection($exclusiveSection, 'Institute name', includeNotApplicable)
        }
    };
}

function getCourseParameters(includeNotApplicable = true) {
    const $inclusiveSection = $('.incl-excl.active[data-step="course"]');
    const $exclusiveSection = $('.incl-excl[data-step="course"]:not(.active)');
    
    return {
        inclusive: {
            stream: getSelectValueFromSection($inclusiveSection, 'Stream', includeNotApplicable),
            course_type: getChipValuesFromSection($inclusiveSection, 'Course Type', includeNotApplicable),
            course_category: getSelectValueFromSection($inclusiveSection, 'Course Category', includeNotApplicable),
            course: getSelectValueFromSection($inclusiveSection, 'Course', includeNotApplicable),
            course_branch: getSelectValueFromSection($inclusiveSection, 'Course Branch', includeNotApplicable),
            course_year: getSelectValueFromSection($inclusiveSection, 'Course Year', includeNotApplicable)
        },
        exclusive: {
            enabled: isExclusiveEnabled('course'),
            stream: getSelectValueFromSection($exclusiveSection, 'Stream', includeNotApplicable),
            course_type: getChipValuesFromSection($exclusiveSection, 'Course Type', includeNotApplicable),
            course_category: getSelectValueFromSection($exclusiveSection, 'Course Category', includeNotApplicable),
            course: getSelectValueFromSection($exclusiveSection, 'Course', includeNotApplicable),
            course_branch: getSelectValueFromSection($exclusiveSection, 'Course Branch', includeNotApplicable),
            course_year: getSelectValueFromSection($exclusiveSection, 'Course Year', includeNotApplicable)
        }
    };
}

function getAllParameterValues(includeNotApplicable = true) {
    return {
        student: getStudentParameters(includeNotApplicable),
        institute: getInstituteParameters(includeNotApplicable),
        course: getCourseParameters(includeNotApplicable)
    };
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
function isExclusiveEnabled(step) {
    const $exclusiveSection = $(`.incl-excl[data-step="${step}"]:not(.active)`);
    const $toggle = $exclusiveSection.find('.exclusive-toggle');
    return $toggle.is(':checked');
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


function getEligibilityTabStudentParametersAsCommaSeparated(includeNotApplicable = false) {
    return {
        inclusive: {
            community: getChipValuesAs('#eligibleinclusivecommunity', 'string', includeNotApplicable),
            religion: getSelectValuesAs('#eincreligion', 'string', includeNotApplicable),
            gender: getChipValuesAs('#eligibleinclusivegender', 'string', includeNotApplicable),
            income: getIncomeValueAsString('.incl-excl.active .form-group', includeNotApplicable),
            quota: getChipValuesAs('#eligibleinclusivequota', 'string', includeNotApplicable),
            residential_status: getChipValuesAs('#eligibleinclusiveresidential', 'string', includeNotApplicable),
            special_category: getChipValuesAs('#eligibleinclusivespecialcategory', 'string', includeNotApplicable),
            is_first_graduate: getChipValuesAs('#eligibleinclusivefirstgraduate', 'string', includeNotApplicable)
        },
        exclusive: {
            enabled: isExclusiveEnabled('student'),
            community: getChipValuesAs('#eligibleexclusivecommuntiy', 'string', includeNotApplicable),
            religion: getSelectValuesAs('#eexcreligion', 'string', includeNotApplicable),
            gender: getChipValuesAs('#eligibleexclusivegender', 'string', includeNotApplicable),
            income: getIncomeValueAsString('.incl-excl[data-step="student"]:not(.active) .form-group', includeNotApplicable),
            quota: getChipValuesAs('#eligibleexclusivequota', 'string', includeNotApplicable),
            residential_status: getChipValuesAs('#eligibleexclusiveresidential', 'string', includeNotApplicable),
            special_category: getChipValuesAs('#eligibleexclusivespecialcategory', 'string', includeNotApplicable),
            is_first_graduate: getChipValuesAs('#eligibleexclusivefirstgraduate', 'string', includeNotApplicable)
        }
    };
}


function getAllEligibilityParametersAsFlatObject(includeNotApplicable = false) {
    const student = getEligibilityTabStudentParametersAsCommaSeparated(includeNotApplicable);
    const institute = getEligibilityTabInstituteParametersAsCommaSeparated(includeNotApplicable);
    const course = getEligiblityTabCourseParametersAsCommaSeparated(includeNotApplicable);
    
    return {
        // Student Inclusive
        'student_inclusive_community': student.inclusive.community,
        'student_inclusive_religion': student.inclusive.religion,
        'student_inclusive_gender': student.inclusive.gender,
        'student_inclusive_income': student.inclusive.income,
        'student_inclusive_quota': student.inclusive.quota,
        'student_inclusive_residential_status': student.inclusive.residential_status,
        'student_inclusive_special_category': student.inclusive.special_category,
        'student_inclusive_is_first_graduate': student.inclusive.is_first_graduate,
        
        // Student Exclusive
        'student_exclusive_enabled': student.exclusive.enabled,
        'student_exclusive_community': student.exclusive.community,
        'student_exclusive_religion': student.exclusive.religion,
        'student_exclusive_gender': student.exclusive.gender,
        'student_exclusive_income': student.exclusive.income,
        'student_exclusive_quota': student.exclusive.quota,
        'student_exclusive_residential_status': student.exclusive.residential_status,
        'student_exclusive_special_category': student.exclusive.special_category,
        'student_exclusive_is_first_graduate': student.exclusive.is_first_graduate,
        
        // Institute Inclusive
        'institute_inclusive_ownership': institute.inclusive.institute_ownership,
        'institute_inclusive_university_type': institute.inclusive.university_type,
        'institute_inclusive_university': institute.inclusive.university,
        'institute_inclusive_category': institute.inclusive.institute_category,
        'institute_inclusive_name': institute.inclusive.institute_name,
        
        // Institute Exclusive
        'institute_exclusive_enabled': institute.exclusive.enabled,
        'institute_exclusive_ownership': institute.exclusive.institute_ownership,
        'institute_exclusive_university_type': institute.exclusive.university_type,
        'institute_exclusive_university': institute.exclusive.university,
        'institute_exclusive_category': institute.exclusive.institute_category,
        'institute_exclusive_name': institute.exclusive.institute_name,
        
        // Course Inclusive
        'course_inclusive_stream': course.inclusive.stream,
        'course_inclusive_type': course.inclusive.course_type,
        'course_inclusive_category': course.inclusive.course_category,
        'course_inclusive_course': course.inclusive.course,
        'course_inclusive_branch': course.inclusive.course_branch,
        'course_inclusive_year': course.inclusive.course_year,
        
        // Course Exclusive
        'course_exclusive_enabled': course.exclusive.enabled,
        'course_exclusive_stream': course.exclusive.stream,
        'course_exclusive_type': course.exclusive.course_type,
        'course_exclusive_category': course.exclusive.course_category,
        'course_exclusive_course': course.exclusive.course,
        'course_exclusive_branch': course.exclusive.course_branch,
        'course_exclusive_year': course.exclusive.course_year
    };
}

/**
 * Get institute parameters as comma-separated values
 */
function getEligibilityTabInstituteParametersAsCommaSeparated(includeNotApplicable = false) {
    const $inclusiveSection = $('.incl-excl.active[data-step="institute"]');
    const $exclusiveSection = $('.incl-excl[data-step="institute"]:not(.active)');
    
    return {
        inclusive: {
            institute_ownership: getChipValuesFromSectionAs($inclusiveSection, 'Institute Ownership', 'string', includeNotApplicable),
            university_type: getSelectValueFromSectionAs($inclusiveSection, 'University Type', 'string', includeNotApplicable),
            university: getSelectValueFromSectionAs($inclusiveSection, 'University', 'string', includeNotApplicable),
            institute_category: getSelectValueFromSectionAs($inclusiveSection, 'Institute Category', 'string', includeNotApplicable),
            institute_name: getSelectValueFromSectionAs($inclusiveSection, 'Institute name', 'string', includeNotApplicable)
        },
        exclusive: {
            enabled: isExclusiveEnabled('institute'),
            institute_ownership: getChipValuesFromSectionAs($exclusiveSection, 'Institute Ownership', 'string', includeNotApplicable),
            university_type: getSelectValueFromSectionAs($exclusiveSection, 'University Type', 'string', includeNotApplicable),
            university: getSelectValueFromSectionAs($exclusiveSection, 'University', 'string', includeNotApplicable),
            institute_category: getSelectValueFromSectionAs($exclusiveSection, 'Institute Category', 'string', includeNotApplicable),
            institute_name: getSelectValueFromSectionAs($exclusiveSection, 'Institute name', 'string', includeNotApplicable)
        }
    };
}

/**
 * Get course parameters as comma-separated values
 */
function getEligiblityTabCourseParametersAsCommaSeparated(includeNotApplicable = false) {
    const $inclusiveSection = $('.incl-excl.active[data-step="course"]');
    const $exclusiveSection = $('.incl-excl[data-step="course"]:not(.active)');
    
    return {
        inclusive: {
            stream: getSelectValueFromSectionAs($inclusiveSection, 'Stream', 'string', includeNotApplicable),
            course_type: getChipValuesFromSectionAs($inclusiveSection, 'Course Type', 'string', includeNotApplicable),
            course_category: getSelectValueFromSectionAs($inclusiveSection, 'Course Category', 'string', includeNotApplicable),
            course: getSelectValueFromSectionAs($inclusiveSection, 'Course', 'string', includeNotApplicable),
            course_branch: getSelectValueFromSectionAs($inclusiveSection, 'Course Branch', 'string', includeNotApplicable),
            course_year: getSelectValueFromSectionAs($inclusiveSection, 'Course Year', 'string', includeNotApplicable)
        },
        exclusive: {
            enabled: isExclusiveEnabled('course'),
            stream: getSelectValueFromSectionAs($exclusiveSection, 'Stream', 'string', includeNotApplicable),
            course_type: getChipValuesFromSectionAs($exclusiveSection, 'Course Type', 'string', includeNotApplicable),
            course_category: getSelectValueFromSectionAs($exclusiveSection, 'Course Category', 'string', includeNotApplicable),
            course: getSelectValueFromSectionAs($exclusiveSection, 'Course', 'string', includeNotApplicable),
            course_branch: getSelectValueFromSectionAs($exclusiveSection, 'Course Branch', 'string', includeNotApplicable),
            course_year: getSelectValueFromSectionAs($exclusiveSection, 'Course Year', 'string', includeNotApplicable)
        }
    };
}

/**
 * Get chip values from section as comma-separated or array
 */
function getChipValuesFromSectionAs($section, labelText, returnType = 'string', includeNotApplicable = false) {
    const values = [];
    const $formGroup = $section.find('.form-group').filter(function() {
        return $(this).find('.form-label').text().trim() === labelText;
    });
    
    $formGroup.find('.chip.active input:checked').each(function() {
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
    }
    return values;
}

/**
 * Get select value from section as comma-separated or array
 */
function getSelectValueFromSectionAs($section, labelText, returnType = 'string', includeNotApplicable = false) {
    const $formGroup = $section.find('.form-group').filter(function() {
        return $(this).find('.form-label').text().trim() === labelText;
    });
    
    const $select = $formGroup.find('select');
    const selectedValue = $select.val();
    
    if (includeNotApplicable) {
        if (returnType === 'string') {
            return selectedValue || '';
        }
        return selectedValue || [];
    } else {
        if (selectedValue && selectedValue !== '-1' && selectedValue !== 'Not Applicable' && selectedValue !== 'All University' && selectedValue !== 'All Institutes') {
            if (returnType === 'string') {
                return selectedValue;
            }
            return [selectedValue];
        }
        return returnType === 'string' ? '' : [];
    }
}

















function shcemeRegister(){
  return {
    department: $('#department').val() || '',
    sub_department: $('#sub_department').val() || '',
    scheme_name: $('#scheme_name').val() || '',
    scheme_code: $('#scheme_code').val() || '',
    benefits: $('#benefits').val() || '',
    scheme_type: $('#scheme_type').val() || '',
    scheme_category: $('#scheme_category').val() || '',
    accademic_year: $('#accademic_year').val() || '',
    go_reference_no: $('#go_reference_no').val() || '',
    go_file_name: $('#go_file_name').val() || '',
    pfms_schemeid: $('#pfms_schemeid').val() || '',
    pfms_center_authorityid: $('#pfms_center_authorityid').val() || '',
    dbt_schemeid: $('#dbt_schemeid').val() || '',
    gbm_id: $('#gbm_id').val() || '',
    fto_id: $('#fto_id').val() || '',
    head_account: $('#head_account').val() || '',
    budget_code: $('#budget_code').val() || '',
  };
}
 

function schemeEligible(){
  return {
    eligibleCriteriaName: $('#eligibleCriteriaName').val() || '',
    eligibleRefCopy: $('#eligibleRefCopy').val() || '',
  }
}