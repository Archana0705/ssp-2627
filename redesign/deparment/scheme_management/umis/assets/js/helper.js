const NOT_APPLICABLE = '-1';
const SELECT_ALL = 'select_all';
const DESELECT_ALL = 'deselect_all';
const dropdowns = [
    '#eincreligion', '#eexcreligion', '#einccast', '#eexccast', '#eligibilityCriteriaList',
    '#sincreligion', '#sexcreligion'

];
function applyInputValidation(inputId, rules = []) {
// Rule	           Description
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