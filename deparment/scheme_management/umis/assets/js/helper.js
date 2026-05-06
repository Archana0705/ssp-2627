const NOT_APPLICABLE = '-1';
const SELECT_ALL = 'select_all';
const DESELECT_ALL = 'deselect_all';
let mode = 'add';
const dropdowns = [
    '#eincreligion', '#eexcreligion', '#einccaste', '#eexccaste', '#eligibilityCriteriaList',
    '#sincreligion', '#sexcreligion','#eincinstituteownership','#eincuniversitytype','#eincuniversity',
    '#eincinstitutecategory','#eincinstitutename','#eexcinstituteownership','#eexcuniversitytype','#eexcuniversity',
    '#eexcinstitutecategory','#eexcinstitutename','#eincstream','#einccoursetype','#einccoursecategory',
    '#einccourse','#einccoursebranch','#einccourseyear','#eexcstream','#eexccoursetype','#eexccoursecategory',
    '#eexccourse','#eexccoursebranch','#eexccourseyear','#sinccast','#sexccast','#sincinstituteownership','#sincuniversitytype',
    '#sincuniversity','#sincinstitutecategory','#sincinstitutename','#sexcinstituteownership','#sexcuniversitytype',
    '#sexcuniversity','#sexcinstitutecategory','#sexcinstitutename','#sincstream','#sinccoursetype','#sinccoursecategory',
    '#sinccourse','#sinccoursebranch','#sinccourseyear','#sexcstream','#sexccoursetype','#sexccoursecategory',
    '#sexccourse','#sexccoursebranch','#sexccourseyear', 'mhosteltype', 'mdisabilitycategory'
];
function getActiveMainTab() {
    return $('.tab-btn.active').data('tab');
}
function applyInputValidation(inputId, rules = []) {
// Rule	            Description
//  1	            Allow only digits (0-9) — removes everything else.
//  2	            Limit input length to 10 characters.
//  3	            Starts with 6-9 and limits to 10 characters (like a mobile number).
//  4	            Allow only alphanumeric characters (a-z, A-Z, 0-9).
//  5	            Disable copy, cut, paste actions.
//  6	            Remove all special characters (allow only word characters and spaces).
//  7	            Validate Gmail format on blur (focus-out). Shows alert if not a Gmail address.
    const inputField = $('#' + inputId);
    inputField.off('input').on('input', function () {
        let value = this.value;
        if (rules.includes(1)) {
            value = value.replace(/[^0-9]/g, '');
        }
        if (rules.includes(4)) {
            value = value.replace(/[^a-zA-Z0-9]/g, '');
        }
        if (rules.includes(6)) {
            value = value.replace(/[^\w\s]/gi, '');
        }

        if (rules.includes(2) && value.length > 10) {
            value = value.substring(0, 10);
        }

        if (rules.includes(3)) {
            if (!/^[6-9]/.test(value)) {
                value = value.replace(/^[^6-9]*/, '');
            }
            value = value.substring(0, 10);
        }
        if (rules.includes(7)) {
            // do nothing in input; will validate on blur
        }

        this.value = value;
    });
    if (rules.includes(5)) {
        inputField.on('paste', function (e) {
            e.preventDefault();
        });
        inputField.on('copy cut', function (e) {
            e.preventDefault();
        });
    }
    if (rules.includes(7)) {
        inputField.on('blur', function () {
            const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
            if (!gmailRegex.test(this.value)) {
                alert('Please enter a valid Gmail address');
                this.focus();
            }
        });
    }
}
function updateButtons() {
    $('#addNewScheme').prop('disabled', mode === 'add');      
    $('#editExistingScheme').prop('disabled', mode === 'edit'); 
}
$('#addNewScheme').on('click', function (e) {
    e.preventDefault();
    mode = 'add';  
    updateButtons();
});
$('#editExistingScheme').on('click', function (e) {
    e.preventDefault();
    mode = 'edit'; 
    updateButtons();
});
updateButtons();
function handleChange(selector) {
    const $select = $(selector);
    let isUpdating = false;
    const getRegularOptions = ($el) => {
        return $el.find('option').map(function () {
            return this.value;
        }).get().filter(v =>
            v !== NOT_APPLICABLE &&
            v !== SELECT_ALL &&
            v !== DESELECT_ALL
        );
    };
    const updateDropdown = ($el, values) => {
        isUpdating = true;
        $el.val(values).trigger('change.select2');
        isUpdating = false;
    };
    $select.on('change', function () {
        if (isUpdating) return;
        const $this = $(this);
        let selectedValues = $this.val();
        if (!selectedValues) selectedValues = [];
        if (!Array.isArray(selectedValues)) selectedValues = [selectedValues];
        const regularOptions = getRegularOptions($this);
        const hasNA = selectedValues.includes(NOT_APPLICABLE);
        const hasSA = selectedValues.includes(SELECT_ALL);
        const hasDA = selectedValues.includes(DESELECT_ALL);
        let newValues = [];
        if (hasSA) {
            newValues = [...regularOptions];
        }
        else if (hasDA) {
            newValues = [NOT_APPLICABLE];
        }
        else if (hasNA) {
            if (selectedValues.length === 1) {
                newValues = [NOT_APPLICABLE];
            } else {
                newValues = selectedValues.filter(v => v !== NOT_APPLICABLE);
            }
        }
        else {
            newValues = selectedValues;
            if (newValues.length === 0) {
                newValues = [NOT_APPLICABLE];
            }
        }
        if (JSON.stringify([...selectedValues].sort()) !== JSON.stringify([...newValues].sort())) {
            updateDropdown($this, newValues);
            selectedValues = newValues;
        }
        const $deselectOption = $this.find(`option[value="${DESELECT_ALL}"]`);
        const $selectAllOption = $this.find(`option[value="${SELECT_ALL}"]`);
        const regularSelectedCount = selectedValues.filter(v =>
            v !== NOT_APPLICABLE &&
            v !== SELECT_ALL &&
            v !== DESELECT_ALL
        ).length;
        if (regularSelectedCount > 1 && $deselectOption.length === 0) {
            $selectAllOption.after(new Option('Deselect All', DESELECT_ALL));
            $this.trigger('change.select2');
        }
        if (regularSelectedCount <= 1 && $deselectOption.length > 0) {
            $deselectOption.remove();
            $this.trigger('change.select2');
        }
    });
}

function initializeDropdown(bindElement, options = []) {
    if (bindElement && bindElement.length) {
        try {
            if (bindElement.data('select2')) {
                bindElement.select2('destroy');
            }
        } catch (e) {
            console.warn("Select2 destroy skipped:", e);
        }

        bindElement.empty();
        bindElement.append(new Option('Not Applicable', '-1', true, true));

        options.forEach(opt => {
            bindElement.append(new Option(opt.label, opt.value, false, false));
        });

        bindElement.select2({
            width: '100%'
        });
    }
}

function removeError(inputId, errorId) {
    $(`#${inputId}`).on('input', function () {
        if ($(this).val().trim() !== '') {
            $(`#${errorId}`).text('');
        }
    });
}
function resetInput(inputIds) {
    inputIds.forEach(id => {
        $('#' + id).val('');
    });
}

function resetDropdown(dropdownId, defaultValue = '') {
    const $dropdown = $(`#${dropdownId}`);
    if ($dropdown.length) {
        $dropdown.val(defaultValue).trigger('change'); 
    }
}

// Common utility functions for number formatting
const NumberUtils = {
    // Format number with Indian numbering system
    formatIndianNumber: (num) => {
        if (!num || isNaN(num)) return num;
        
        const numStr = parseFloat(num).toString();
        const parts = numStr.split('.');
        let integerPart = parts[0];
        const decimalPart = parts[1] ? '.' + parts[1] : '';
        
        // Indian numbering system: 1,00,00,000 format
        const lastThree = integerPart.slice(-3);
        const otherNumbers = integerPart.slice(0, -3);
        
        if (otherNumbers !== '') {
            const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
            return formatted + decimalPart;
        }
        
        return integerPart + decimalPart;
    },

    // Remove commas from formatted number (for payload)
    removeCommasFromNumber: (formattedNum) => {
        if (!formattedNum) return formattedNum;
        return formattedNum.toString().replace(/,/g, '');
    },

    // Format currency with Rs. and /-
    formatCurrency: (num) => {
        if (!num || isNaN(num)) return num;
        return `Rs. ${NumberUtils.formatIndianNumber(num)}/-`;
    },

    // Get raw number from formatted input field
    getRawNumberFromInput: (inputId) => {
        const formattedValue = $(inputId).val();
        return NumberUtils.removeCommasFromNumber(formattedValue);
    }
};

// You can also export as individual functions if preferred
const formatIndianNumber = (num) => NumberUtils.formatIndianNumber(num);
const removeCommasFromNumber = (formattedNum) => NumberUtils.removeCommasFromNumber(formattedNum);
const formatCurrency = (num) => NumberUtils.formatCurrency(num);
const getRawNumberFromInput = (inputId) => NumberUtils.getRawNumberFromInput(inputId);


dropdowns.forEach(selector => {
    $(selector).select2({
        placeholder: "Select options",
        width: '100%'
    });
    handleChange(selector);
    $(selector).val([NOT_APPLICABLE]).trigger('change.select2');
});





function hasSectionValues(type) {

    const $section = $(`.step-divider > div[data-type="${type}"]`);

    let hasValue = false;

    $section.find('input, select, textarea').each(function () {

        // ❌ ignore hidden fields
        if (!$(this).is(':visible')) return;

        const tag = this.tagName.toLowerCase();
        const typeAttr = $(this).attr('type');
        const val = $(this).val();

        // ✅ input text/number
        if (tag === 'input' && (typeAttr === 'text' || typeAttr === 'number')) {
            if (val && val.trim() !== '') {
                hasValue = true;
                return false;
            }
        }

        // ✅ select (ignore default first option)
        if (tag === 'select') {
            if (this.selectedIndex > 0) {
                hasValue = true;
                return false;
            }
        }

        // ✅ checkbox
        if (typeAttr === 'checkbox' && $(this).is(':checked')) {
            hasValue = true;
            return false;
        }

    });

    return hasValue;
}

function resetSection(type) {

    const $section = $(`.step-divider > div[data-type="${type}"]`);

    $section.find('input[type="text"], input[type="number"]').val('');
    $section.find('select').prop('selectedIndex', 0);
    $section.find('input[type="checkbox"]').prop('checked', false);

}


function inputShowHide(selectElement, inputElement) {
    const selectedValue = selectElement.val();
    const selectedText = selectElement.find('option:selected').text();
    
    // Check if 'Not Applicable' is selected (by value or text)
    const isNotApplicable = selectedValue === '-1' || selectedText === 'Not Applicable';
    
    // Toggle the d-none class
    inputElement.toggleClass('d-none', isNotApplicable);
    
    // Optional: Clear input value when hidden
    if (isNotApplicable) {
        inputElement.val('');
    }
}
// ***************************************************
// SCHEME SETUP TAB INPUT FIELD ID's
// ***************************************************
function getValueSchemeSetUpTab(){
    // let dept = localStorage.getItem('department');
    return {
        // department: dept,
        subdepartment : $('#sub_department').val(),
        schemename : $('#scheme_name').val(),
        schemecode : $('#scheme_code').val(),
        benifits : $('#benefits').val(),
        schemetype : $('#scheme_type').val(),
        schemecategory : $('#scheme_category').val(),
        academicyear : $('#accademic_year').val(),
        goreferenceno : $('#go_reference_no').val(),
        gofilename : $('#go_file_name_display').val(),
        gofileupload: $('#go_file_upload')[0]?.files[0] || null,
        pfmsschemeid : $('#pfms_schemeid').val(),
        pfmscenterauthid : $('#pfms_center_authorityid').val(),
        dbtschemeid : $('#dbt_schemeid').val(),
        gbmid : $('#gbm_id').val(),
        ftoid : $('#fto_id').val(),
        headaccount : $('#head_account').val(),
        budgetcode : $('#budget_code').val(),
    }
}
// ***************************************************
// SCHEME ELIGIBILITY TAB INPUT FIELD ID's
// ***************************************************
function eligibilityTab(){
    return {
        eligibilitycriterianame : $('#eligibleCriteriaName').val(),
        eligibilityreferencecopy : $('#eligibleRefCopy').val(),
    }
}

function getValueSchemeEligibilityStudentInclusive(){
    return {
        caste : $('#einccast').val(),
        religion : $('#eincreligion').val(),
        incomeRange : $('#eligibleincincomeRange').val(),
        incomeAmount : $('#inincomeValue').val(),
    }
}
function getValueSchemeEligibilityStudentExclusive(){
    return {
        caste : $('#eexccast').val(),
        religion : $('#eexcreligion').val(),
        incomeRange : $('#eligibleexcincomeRange').val(),
        incomeAmount : $('#exincomeValue').val(),
    }
}

function getValueSchemeEligibilityInstituteInclusive(){
    return {
        instituteownership : $('#eincinstituteownership').val(),
        universitytype : $('#eincuniversitytype').val(),
        university : $('#eincuniversity').val(),
        institutecategory : $('#eincinstitutecategory').val(),
        institutename : $('#eincinstitutename').val(),
    }
}
function getValueSchemeEligibilityInstituteExclusive(){
    return {
        instituteownership : $('#eexcinstituteownership').val(),
        universitytype : $('#eexcuniversitytype').val(),
        university : $('#eexcuniversity').val(),
        institutecategory : $('#eexcinstitutecategory').val(),
        institutename : $('#eexcinstitutename').val(),
    }
}

function getValueSchemeEligibilityCourseInclusive(){
    return {
        stream : $('#eincstream').val(),
        coursetype : $('#einccoursetype').val(),
        coursecategory : $('#einccoursecategory').val(),
        course : $('#einccourse').val(),
        coursebranch : $('#einccoursebranch').val(),
        courseyear : $('#einccourseyear').val(),
    }
}
function getValueSchemeEligibilityCourseExclusive(){
    return {
        stream : $('#eexcstream').val(),
        coursetype : $('#eexccoursetype').val(),
        coursecategory : $('#eexccoursecategory').val(),
        course : $('#eexccourse').val(),
        coursebranch : $('#eexccoursebranch').val(),
        courseyear : $('#eexccourseyear').val(),
    }
}

// ***************************************************
// SCHEME SCHLOARSHIP-FEE TAB INPUT FIELD ID's
// ***************************************************

function scholarshipFeeTab(){
    return {
        eligibilitycriterianame : $('#scholarshipFeeName').val(),
        eligibilitycriterialist : $('#eligibilityCriteriaList').val(),
    }
}
function componentBasedFeeEnter(params) {
    const container = $('#componentBasedFeeInput');
    container.empty();
    
    params.components.forEach((component, idx) => {
        const id = `fee_${idx}`;
        const html = `
            <div class="row pt-2 pb-1 px-2 mt-3 bg-wrap-blue" data-id="${component.id}">
                <div class="col-md-3 mb-2">
                    <div class="${id}Form">
                        <label class="form-label lbl-font">${component.component_name}</label>
                    </div>
                </div>
                <div class="col-md-3 mb-2">
                    <div class="${id}Form">
                        <label class="form-label lbl-font">Scholarship Fee Type Selection</label>
                        <select class="form-select fee_type_${id}">
                            <option value="">As fee paid</option>
                            <option value="fixed">Fixed Ceiling amount</option>
                            <option value="not_include">Not include</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-3 mb-2">
                    <div class="${id}Form fixed_amount_${id}" style="display: none;">
                        <label class="form-label lbl-font">Enter Fixed Ceiling Amount</label>
                        <input type="text" class="celing_amount_${id} form-control" placeholder="Enter Amount" />
                    </div>
                </div>
            </div>`;
        
        container.append(html);
        
        // Handle dropdown change
        $(`.fee_type_${id}`).on('change', function() {
            const fixedDiv = $(`.fixed_amount_${id}`);
            if ($(this).val() === 'fixed') {
                fixedDiv.show();
            } else {
                fixedDiv.hide();
                $(`.celing_amount_${id}`).val('');
            }
        });
    });
}
function collectComponentBasedFeeData() {
    const result = [];

    $('#componentBasedFeeInput .row').each(function () {
        const componentId = $(this).data('id');

        const feeType = $(this).find('select').val();
        const amountInput = $(this).find('input');
        const amount = amountInput.length ? amountInput.val() : '';

        result.push({
            component_id: componentId,
            fee_type: feeType || 'as_fee_paid',
            ceiling_amount: feeType === 'fixed' ? amount : null
        });
    });

    return result;
}


// function scholarshipFeeType(feeType){
//     if(feetype === 'fixedfee'){
//         return {
//             scholarshipfixedfee : $('#scholarshipFixedFee').val(),
//         }
//     }else if(feetype === 'componentfee'){
//         return {
//             scholarshipfixedfee : $('#scholarshipFixedFee').val(),
//         }
//     }else if(feetype === 'customizefee'){
//         return {
//             scholarshipfixedfee : $('#scholarshipFixedFee').val(),
//         }
//     }
// }
function getValueSchemeScholarshipStudentInclusive(){
    return {
        caste : $('#einccast').val(),
        religion : $('#eincreligion').val(),
        incomeRange : $('#eligibleincincomeRange').val(),
        incomeAmount : $('#inincomeValue').val(),
    }
}
function getValueSchemeScholarshipStudentExclusive(){
    return {
        caste : $('#eexccast').val(),
        religion : $('#eexcreligion').val(),
        incomeRange : $('#eligibleexcincomeRange').val(),
        incomeAmount : $('#exincomeValue').val(),
    }
}

function getValueSchemeScholarshipInstituteInclusive(){
    return {
        instituteownership : $('#eincinstituteownership').val(),
        universitytype : $('#eincuniversitytype').val(),
        university : $('#eincuniversity').val(),
        institutecategory : $('#eincinstitutecategory').val(),
        institutename : $('#eincinstitutename').val(),
    }
}
function getValueSchemeScholarshipInstituteExclusive(){
    return {
        instituteownership : $('#eexcinstituteownership').val(),
        universitytype : $('#eexcuniversitytype').val(),
        university : $('#eexcuniversity').val(),
        institutecategory : $('#eexcinstitutecategory').val(),
        institutename : $('#eexcinstitutename').val(),
    }
}

function getValueSchemeScholarshipCourseInclusive(){
    return {
        stream : $('#eincstream').val(),
        coursetype : $('#einccoursetype').val(),
        coursecategory : $('#einccoursecategory').val(),
        course : $('#einccourse').val(),
        coursebranch : $('#einccoursebranch').val(),
        courseyear : $('#einccourseyear').val(),
    }
}
function getValueSchemeScholarshipCourseExclusive(){
    return {
        stream : $('#eexcstream').val(),
        coursetype : $('#eexccoursetype').val(),
        coursecategory : $('#eexccoursecategory').val(),
        course : $('#eexccourse').val(),
        coursebranch : $('#eexccoursebranch').val(),
        courseyear : $('#eexccourseyear').val(),
    }
}

function requiredField(fields = [], options = {}) {
    let isValid = true;
    let errorMessage = options.message || 'This field is required';
    
    fields.forEach((field) => {
        if (!field || field === '' || field === null || field === undefined) {
            isValid = false;
            showToast(errorMessage, 'error');
            return false; // Break the loop on first error
        }
    });
    
    return isValid;
}



function showToast(message, type = 'default', duration = 3000) {
    const container = $('#simpleToastContainer');

    const $toast = $('<div class="simple-toast"></div>')
        .addClass(type)
        .text(message);

    container.append($toast);

    setTimeout(() => {
        $toast.fadeOut(300, function () {
            $(this).remove();
        });
    }, duration);
}