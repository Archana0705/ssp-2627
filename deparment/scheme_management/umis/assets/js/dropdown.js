function getReligion(bindElement) {

    bindElement = $(bindElement); // ✅ ensure jQuery

    return new Promise((resolve) => {

        // ✅ Initialize dropdown with default options
        initializeDropdown(bindElement, [
            { label: 'Select All', value: 'select_all' },
            { label: 'Deselect All', value: 'deselect_all' }
        ]);

        $.ajax({
            url: config.dropdownAPI + 'dropdown/dropdown.php',
            type: 'POST',
            dataType: 'json',
            data: {field: 'religion'},
            success: function (response) {

                const results = response?.data

                if (Array.isArray(results)) {

                    results.forEach(item => {
                        bindElement.append(new Option(item.text, item.id, false, false));
                    });

                    bindElement.trigger('change');
                }

                resolve();
            },

            error: function () {
                console.error("Dropdown API failed");
                resolve();
            }
        });
    });
}
function getIncomeRange(bindElement) {
    $.ajax({
        url: `${config.dropdownAPI}dropdown/dropdown.php`,
        type: 'POST',
        dataType: 'json',
        data: { field: 'income_range' },
        success: function(response) {
            const results = response?.data;
            bindElement.empty();
            
            if (Array.isArray(results)) {
                results.forEach(item => {
                    bindElement.append(new Option(item.text, item.id));
                });
            }
        },
        error: function(xhr, status, error) {
            console.error('Dropdown API failed:', error);
        }
    });
}


function renderChipDropdown({ field, selector, constraint }) {

    $.ajax({
        url: config.dropdownAPI + 'dropdown/dropdown.php',
        type: 'POST',
        dataType: 'json',
        data: { field },

        success: function (response) {

            const results = response?.data;

            let html = `
                <div class="chip-select multi-select" 
                     data-group="${constraint}" 
                     data-type="${field}">
            `;

            if (Array.isArray(results)) {

                results.forEach(item => {

                    const isNA = item.id === '-1';

                    html += `
                        <label class="chip ${isNA ? 'active' : ''}">
                            <input type="checkbox" 
                                   value="${item.id}" 
                                   ${isNA ? 'checked' : ''} 
                                   hidden>
                            <span>${item.text}</span>
                        </label>
                    `;
                });
            }

            html += `</div>`;

            $(selector).html(html);
        },

        error: function () {
            console.error(`Dropdown API failed for ${field}`);
        }
    });
}

