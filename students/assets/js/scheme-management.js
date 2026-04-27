AOS.init();

$(document).on({
    ajaxStart: function () {
        $('#preloader').show();
        $("body").addClass("user_loading");
    },
    ajaxStop: function () {
        $('#preloader').hide();
        $("body").removeClass("user_loading");
    }
});
let departmentName = localStorage.getItem('departmentName');
let departmentCode = localStorage.getItem('departmentCode');
if (!departmentName && !departmentCode) {
    var encrypt_data = {
        user_id:  localStorage.getItem('userId'),
        department_id: 1,
    };
    // Fetch Department Details
    $.ajax({
        url: config.ssp_api_url + '/get_scholarship_department',
        type: 'POST',
        headers: { 'X-APP-KEY': 'te$t', 'X-APP-NAME': 'te$t' },
        data: { data: encryptData(encrypt_data) },
        success: function(response) {
            if (response.status) {
                var results = decryptData(response.data);
                // Set localStorage items based on response data
                let departmentCodes = results.map(deptData => deptData.id).join(',');
                localStorage.setItem('departmentCode', departmentCodes);
                
                // Store department names
                results.forEach((deptData, index) => {
                    let key = index === 0 ? 'departmentName' : `departmentName${index}`;
                    localStorage.setItem(key, deptData.department_name);
                });
            } else {
                console.log('Fetch Department Details Failed.');
            }
        },
        error: function() {
            console.log('Error Fetch Department Details Failed.');
        }
    });
}
import permissions from '../js/permissions.js';
// Get the user role from localStorage
let roleId = localStorage.getItem('roleId');

// Get the user's permissions based on their role
const userPermissions = permissions.roles[roleId] || permissions.roles.default;
var schemesData = {};
let userId         = localStorage.getItem('userId');
const navInstitute = document.getElementById('nav-institute');
if (departmentName) {
    // navInstitute.textContent = departmentName;
    // navInstitute.title = "Department Name";
}
if (roleId != 4 && roleId != 5 && roleId != 8) {
    // navInstitute.textContent = userPermissions.name;
    // navInstitute.title = "User Role";
}
if (!userId) {
    localStorage.clear();
    sessionStorage.clear();
    // Get the current URL
    const currentUrl = window.location.href;
    // Modify the URL to point to the new file
    const newUrl = currentUrl.replace(/[^\/]*$/, 'login.html'); // Replace the last part of the URL
    // Redirect to the new URL
    window.location.href = newUrl;
}
$('#submit').prop('disabled', true);
let originalDepartmentOptions = [];
let originalSubDepartmentOptions = [];
let originalSchemeCategoryOptions = [];
let originalFrequencyOptions = [];
// Function to initialize DataTable
function initializeDataTable() {
    if ($.fn.DataTable.isDataTable('#scheme_list')) {
        // Destroy the existing DataTable instance
        $('#scheme_list').DataTable().destroy();
    }

    // Role-based logic for the "Add Scheme" button
    let addSchemeButton = '';
    if (userPermissions.canAddScheme) {
        addSchemeButton = `
            <a href="add-scheme.html" class="btn add-btn goto-btn">
                <i class="bi bi-file-earmark-plus"></i> <span data-i18n="add-scheme">Add Scheme</span>
            </a>
        `;
    }

    // Append the button to the designated area
    document.getElementById('addSchemeButtonArea').innerHTML = addSchemeButton;
    var encrypt_data = {
        department_id   : 0,
        department      : $('#department_filter').val() || 0,
        sub_department  : $('#sub_department_filter').val() || 0,
        scheme_category : $('#scheme_category_filter').val() || 0,
        scheme_frequency: $('#scheme_frequency_filter').val() || 0,
        user_id         : userId,
    };
    $('#scheme_list').DataTable({
        "paging": true,
        "lengthMenu": [10, 15, 20, 30],
        "ordering": true,
        "info": true,
        "responsive": true,
        "dom": 'Bfrtlip',
        "buttons": [
            {
                extend: 'excelHtml5',
                text: '<i class="bi bi-file-earmark-spreadsheet"> Excel</i>',
                titleAttr: 'EXCEL',
                className: 'btn btn-success',
                exportOptions: {
                    columns: ':visible'
                },
                customize: function(xlsx) {
                    // Get the sheet data from the Excel XML
                    var sheet = xlsx.xl.worksheets['sheet1.xml'];
                    var sheetData = $(sheet).find('sheetData');

                    // Get selected text from each dropdown
                    var academicYear = $("#academic-year-filter option:selected").text();
                    var districtText = $("#district-name-filter option:selected").text();
                    var talukText = $("#taluk-name-filter option:selected").text();
                    var schemeText = $("#scheme-name-filter option:selected").text();
                    var ownershipText = $("#ownership-name-filter option:selected").text();
                    var universityTypeText = $("#university-type-name-filter option:selected").text();
                    var universityText = $("#university-name-filter option:selected").text();
                    var instituteText = $("#institute-name-filter option:selected").text();
                    var departmentText = $("#department-filter option:selected").text();
                    var subDepartmentText = $("#sub-department-filter option:selected").text();
                    
                    // Get static values
                    var userId = userId;

                    // Concatenate all the filter text into a custom format
                    var filterData = `
                    Academic Year: ${academicYear}   District: ${districtText}   Taluk: ${talukText}
                
                    Scheme: ${schemeText}   Ownership: ${ownershipText}   University Type: ${universityTypeText} 
                    University: ${universityText}   Institute: ${instituteText}
                
                    Department: ${departmentText}   Sub Department: ${subDepartmentText}  
                    User ID: ${userId};
                `;
                

                    // Define the first row (r="1") with all filter data in column A1
                    var filterDataRow = `
                        <row r="1" ht="80" customHeight="80">
                            <c t="inlineStr" s="51" r="A1">
                                <is><t>${filterData}</t></is>
                            </c>
                        </row>
                    `;

                    // Prepend the filter data row to the sheet
                    sheetData.prepend(filterDataRow);

                    // Ensure cell styling is correctly defined for center alignment and text wrapping
                    var styles = xlsx.xl['styles.xml'];
                    var cellStyles = $(styles).find('cellXfs');

                    // Define a new style with center alignment and wrap text (line break support)
                    var centerAlignedWrapStyle = `
                        <xf xfId="0" applyAlignment="1">
                            <alignment horizontal="center" vertical="center" wrapText="1"/>
                        </xf>
                    `;

                    cellStyles.append(centerAlignedWrapStyle);
                }
            },
        

{
                    extend: 'pdfHtml5',
                    orientation: 'landscape',
                    pageSize: 'A4',
                    text: '<i class="bi bi-filetype-pdf"> PDF</i>',
                    titleAttr: 'PDF',
                    className: 'btn btn-danger',
                    exportOptions: {
                        columns: ':visible'
                    },
                    customize: function (doc) {
                        // Title for the PDF
                        var title = {
                            text: 'SSP/UMIS Institute Report',
                            style: 'header', 
                            alignment: 'center', 
                            margin: [0, 0, 0, 20] // Add space below the title
                        };
                        
                        // External filter content
                        var filters = {
                            "Institute": $("#institute-name-filter option:selected").text(),
                            "Department": $("#department-filter option:selected").text(),
                            "Sub Department": $("#sub-department-filter option:selected").text(),
                            "User ID": userId
                        };
                        
                        // Prepare formatted filters with highlighted keys
                        var formattedFilters = Object.entries(filters).map(([key, value]) => {
                            return {
                                text: [
                                    { text: key + ': ', bold: true }, // Key in bold
                                    value // Value
                                ],
                                margin: [0, 0, 0, 5] // Margin for spacing between each filter
                            };
                        });
                        
                        // Add the title and formatted filters to the PDF content
                        doc.content.splice(0, 0, title); // Add title at the beginning
                        doc.content.splice(1, 0, ...formattedFilters); // Insert filters after the title
                    
                        // Optional: Define custom styles if needed
                        doc.styles = {
                            header: {
                                fontSize: 18,
                                bold: true
                            }
                        };
                    }
                    
                },
            {
                extend: 'print',
                text: '<i class="bi bi-printer"> Print</i>',
                titleAttr: 'Print',
                exportOptions: {
                    columns: ':visible' // Only export visible columns
                }
            },
            {
                extend: 'colvis',  // Add column visibility button
                text: '<i class="bi bi-eye"> Column Visibility</i>',
                className: 'btn btn-info',
                columns: ':not(.noVis)'  // Exclude columns with the class `noVis`
            }
        ],
        "ajax": {
            "url": config.ssp_api_url + '/get_scheme_list',
            "type": "POST",
            "headers": { 'X-APP-KEY': 'te$t', 'X-APP-NAME': 'te$t' },
            "data": { data: encryptData(encrypt_data) },
            "dataSrc": function (response) {                
                var decryptedResponse = response.status === 1 ? decryptData(response.data) : response.data;
                schemesData = {};
                $.each(decryptedResponse, function (index, scheme) {
                    schemesData[scheme.scheme_id] = scheme;
                });
                if (originalDepartmentOptions.length === 0) {
                    originalDepartmentOptions = Array.from(new Set(decryptedResponse.map(scheme => scheme.department_name)));
                    originalSubDepartmentOptions = Array.from(new Set(decryptedResponse.map(scheme => scheme.subdepartment_name)));
                    originalSchemeCategoryOptions = Array.from(new Set(decryptedResponse.map(scheme => scheme.scheme_category)));
                    originalFrequencyOptions = Array.from(new Set(decryptedResponse.map(scheme => scheme.frequency)));
                    
                    // Populate the dropdowns with original options
                    populateDropdown($('#department_filter'), originalDepartmentOptions);
                    populateDropdown($('#sub_department_filter'), originalSubDepartmentOptions);
                    populateDropdown($('#scheme_category_filter'), originalSchemeCategoryOptions);
                    populateDropdown($('#scheme_frequency_filter'), originalFrequencyOptions);
                }
                return decryptedResponse;
            },
            "error": function (xhr, error, thrown) {
                let message;
                if (xhr.status === 400) {
                    message = 'Login is required. Please log in to continue.';
                } else if (xhr.status === 500) {
                    message = 'Something went wrong on the server. Please try again later.';
                } else {
                    message = 'An unexpected error occurred: ' + xhr.status + ' ' + xhr.statusText;
                }
                alert(message); // Show the appropriate error message
                console.error('Error details:', xhr); // Log error details to console
            }
        },
        "columns": [
            {
                "data": "id", render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            {
                "data": "department_name",
                render: function(data) {
                    return escapeHtml(data); // Escape HTML for department_name
                },
                visible: roleId != 4 && roleId != 5 && roleId != 8
            },
            {
                "data": "subdepartment_name",
                render: function(data) {
                    return escapeHtml(data); // Escape HTML for department_name
                },
                visible: roleId != 4 && roleId != 5 && roleId != 8
            },
            {
                "data": "scheme_name",
                render: function(data) {
                    return escapeHtml(data); // Escape HTML for department_name
                }
            },
            {
                "data": "scheme_code",
                render: function(data) {
                    return escapeHtml(data); // Escape HTML for department_name
                }
            },
            {
                "data": "scheme_category",
                render: function(data) {
                    return escapeHtml(data); // Escape HTML for department_name
                }
            },
            {
                "data": "frequency",
                render: function(data) {
                    return escapeHtml(data); // Escape HTML for department_name
                }
            },
            {
                "data": "inactive",
                render: function(data) {
                    const validData = escapeHtml(data);
                    return validData != 'true' ? "Active" : "In-Active";
                }
            },
            {
                data: 'scheme_id',
                render: function (data, type, row) {
                    let buttons = '';
                    var schemeEncodeInfo = btoa(JSON.stringify(row));

                    // If the scheme is frozen, only allow viewing
                    if (row.freezed) {
                        if (userPermissions.canViewScheme) {
                            buttons += `<a class="btn add-btn view-scheme" data-scheme-id="${data}" href="#" title="View"><i class="bi bi-eye"></i></a>`;
                        }
                        if (userPermissions.canApproveScheme) {
                            buttons += `<a class="btn add-btn freeze-scheme" data-scheme-id="${data}" data-is-freeze="false" href="#" title="Un-Freeze"><i class="bi bi-snow3"></i></a>`;
                        }
                    } else {
                        // Use user permissions instead of role checks
                        if (userPermissions.canViewScheme) {
                            buttons += `<a class="btn add-btn view-scheme" data-scheme-id="${data}" href="#" title="View"><i class="bi bi-eye"></i></a>`;
                        }
                        if (userPermissions.canEditScheme) {
                            buttons += `<a class="btn add-btn edit-scheme" data-scheme-id="${data}" href="add-scheme.html?scheme-edit=true&encodeinfo=${schemeEncodeInfo}" title="Edit"><i class="bi bi-pencil"></i></a>`;
                        }
                        if (userPermissions.canDeleteScheme) {
                            buttons += `<a class="btn add-btn delete-scheme" data-scheme-id="${data}" href="#" title="Delete"><i class="bi bi-trash"></i></a>`;
                        }
                        if (userPermissions.canApproveScheme) {
                            if (row.freezed) {
                                buttons += `<a class="btn add-btn freeze-scheme" data-scheme-id="${data}" data-is-freeze="false" href="#" title="Un-Freeze"><i class="bi bi-snow3"></i></a>`;
                            } else {
                                buttons += `<a class="btn add-btn freeze-scheme" data-scheme-id="${data}" data-is-freeze="true" href="#" title="Freeze"><i class="bi bi-snow3"></i></a>`;
                            }
                            if (row.inactive) {
                                buttons += `<a class="btn add-btn activate-scheme" data-scheme-id="${data}" href="#" title="Activate"><i class="bi bi-check-circle"></i></a>`;
                            } else {
                                buttons += `<a class="btn add-btn de-activate-scheme" data-scheme-id="${data}" href="#" title="De-Activate"><i class="bi bi-x-circle"></i></a>`;
                            }
                        }
                        if (userPermissions.canAddSubScheme) {
                            buttons += `<a class="btn add-btn add-sub-scheme" data-scheme-id="${data}" href="sub-scheme-form.html?details=${schemeEncodeInfo}" title="Add Sub-Scheme"><i class="bi bi-plus-circle"></i></a>`;
                        }
                    }

                    return `<div class="action-buttons">${buttons}</div>`;
                }
            }
        ],
        "language": {
        "emptyTable": "No Schemes available in this table."
        }
    });
}

// Initialize the DataTable with the default academic year
initializeDataTable();
$(document).on('click', '.view-scheme', function (event) {
    event.preventDefault(); // Prevent default anchor behavior
    const button = $(this); // Get the clicked button
    const schemeId = button.data('scheme-id'); // Get the scheme ID
    const row = button.closest('tr'); // Get the closest row
    const subTable = row.next('.sub-table'); // Get the next sibling sub-table
    var scheme = schemesData[schemeId];
    if (scheme) {
        // Populate the modal with scheme details
        $('#scheme_info').find('#form-scheme_name').text(scheme.scheme_name || 'N/A');
        $('#scheme_info').find('#form-frequency').text(scheme.frequency || 'N/A');
        $('#scheme_info').find('#form-department_name').text(scheme.department_name || 'N/A');
        $('#scheme_info').find('#form-subdepartment_name').text(scheme.subdepartment_name || 'N/A');
        $('#scheme_info').find('#form-scheme_code').text(scheme.scheme_code || 'N/A');
        $('#scheme_info').find('#form-scheme_category').text(scheme.scheme_category || 'N/A');
        $('#scheme_info').find('#form-freezed').text(scheme.freezed ? 'Yes' : 'No');
    }

    // Close any other open sub-tables
    $('.sub-table').not(subTable).hide(); // Hide other open sub-tables

    // Check if the sub-table already exists
    if (subTable.length) {
        // Toggle visibility
        subTable.toggle(); // Show or hide the existing sub-table
    } else {
        var encrypt_data = {scheme_id: schemeId, user_id:userId};
        // Fetch data via AJAX and create sub-table
        $.ajax({
            url: config.ssp_api_url + '/get_sub_scheme_list',
            type: 'POST',
            headers: { 'X-APP-KEY': 'te$t', 'X-APP-NAME': 'te$t' },
            data: { data: encryptData(encrypt_data) },
            success: function(response) {
                var results = response.success === 1 ? decryptData(response.data) : response.data;
                // Remove any existing sub-tables or messages
                row.next('.sub-table, .no-schemes-message').remove();
                const newSubTable = createSubTable(results);
                row.after(newSubTable); // Insert new sub-table after the current row
                newSubTable.show(); // Show new sub-table
            },
            error: function() {
                alert('An error occurred while fetching the data.'); // Handle AJAX error
            }
        });
    }
});
$(document).on('click', '.delete-scheme', function (event) {
    event.preventDefault(); // Prevent default anchor behavior
    const schemeId = $(this).data('scheme-id'); // Get the scheme ID

    // Show confirmation dialog
    Swal.fire({
        title: 'Are you sure?',
        text: "This will delete the scheme!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
    }).then((result) => {
        if (result.isConfirmed) {
            var encrypt_data = {scheme_id: schemeId};
            // Fetch data via AJAX and create sub-table
            $.ajax({
                url: config.ssp_api_url + '/delete_scheme',
                type: 'POST',
                headers: { 'X-APP-KEY': 'te$t', 'X-APP-NAME': 'te$t' },
                data: { data: encryptData(encrypt_data) },
                success: function(response) {
                    if (response.success === 1) {
                        Swal.fire({
                            icon: "success",
                            title: 'Scheme Deleted successfully',
                            showConfirmButton: false,
                            timer: 1000,
                            timerProgressBar: false,
                        }).then(function () {
                            window.location.href = "scheme-management.html";
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Scheme Deletion Failed",
                            showConfirmButton: false,
                            timer: 1000,
                            timerProgressBar: false,
                        });
                    }
                },
                error: function() {
                    $('#preloader').hide();
                    Swal.fire({
                        icon: "error",
                        title: "Something went wrong!",
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: false,
                    });
                }
            });
        }
    });
});$(document).on('click', '.delete-sub-scheme', function (event) {
    event.preventDefault(); // Prevent default anchor behavior
    const schemeId = $(this).data('scheme-id'); // Get the scheme ID
    const subscheme_id = $(this).data('sub-scheme-id'); // Get the sub-scheme ID

    // Show confirmation dialog
    Swal.fire({
        title: 'Are you sure?',
        text: "This will delete the sub-scheme!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
    }).then((result) => {
        if (result.isConfirmed) {
            var encrypt_data = {scheme_id: schemeId, subscheme_id: subscheme_id,};
            // Fetch data via AJAX and create sub-table
            $.ajax({
                url: config.ssp_api_url + '/delete_subscheme',
                type: 'POST',
                headers: { 'X-APP-KEY': 'te$t', 'X-APP-NAME': 'te$t' },
                data: { data: encryptData(encrypt_data) },
                success: function(response) {
                    if (response.success === 1) {
                        Swal.fire({
                            icon: "success",
                            title: 'Sub-Scheme Deleted successfully',
                            showConfirmButton: false,
                            timer: 1000,
                            timerProgressBar: false,
                        }).then(function () {
                            window.location.href = "scheme-management.html";
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Sub-Scheme Deletion Failed",
                            showConfirmButton: false,
                            timer: 1000,
                            timerProgressBar: false,
                        });
                    }
                },
                error: function() {
                    $('#preloader').hide();
                    Swal.fire({
                        icon: "error",
                        title: "Something went wrong!",
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: false,
                    });
                }
            });
        }
    });
});
$(document).on('click', '.de-activate-scheme', function (event) {
    event.preventDefault(); // Prevent default anchor behavior
    const schemeId = $(this).data('scheme-id'); // Get the scheme ID
    var encrypt_data = {
        scheme_id: schemeId,
        is_delete: true,
        delete_by: localStorage.getItem('userId'),
    };
    // Fetch data via AJAX and create sub-table
    $.ajax({
        url: config.ssp_api_url + '/scheme_inactive',
        type: 'POST',
        headers: { 'X-APP-KEY': 'te$t', 'X-APP-NAME': 'te$t' },
        data: { data: encryptData(encrypt_data) },
        success: function(response) {
            if (response.success === 1) {
                Swal.fire({
                    icon: "success",
                    title: 'Scheme De-Activated successfully',
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: false,
                }).then(function () {
                    window.location.href = "scheme-management.html";
                })
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Scheme De-Activation Failed",
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: false,
                });
            }
        },
        error: function() {
            $('#preloader').hide();
            Swal.fire({
                icon: "error",
                title: "Something went wrong!",
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: false,
            });
        }
    });
});

$(document).on('click', '.activate-scheme', function (event) {
    event.preventDefault(); // Prevent default anchor behavior
    const schemeId = $(this).data('scheme-id'); // Get the scheme ID
    var encrypt_data = {
        scheme_id: schemeId,
        is_delete: false,
        delete_by: localStorage.getItem('userId'),
    };
    // Fetch data via AJAX and create sub-table
    $.ajax({
        url: config.ssp_api_url + '/scheme_inactive',
        type: 'POST',
        headers: { 'X-APP-KEY': 'te$t', 'X-APP-NAME': 'te$t' },
        data: { data: encryptData(encrypt_data) },
        success: function(response) {
            if (response.success === 1) {
                Swal.fire({
                    icon: "success",
                    title: 'Scheme Activated successfully',
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: false,
                }).then(function () {
                    window.location.href = "scheme-management.html";
                })
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Scheme Activation Failed",
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: false,
                });
            }
        },
        error: function() {
            $('#preloader').hide();
            Swal.fire({
                icon: "error",
                title: "Something went wrong!",
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: false,
            });
        }
    });
});
$(document).on('click', '.deactivate-sub-scheme', function (event) {
    event.preventDefault(); // Prevent default anchor behavior
    const schemeId = $(this).data('scheme-id'); // Get the scheme ID
    const subscheme_id = $(this).data('sub-scheme-id'); // Get the scheme ID
    var encrypt_data = {
        scheme_id: schemeId,
        sub_scheme_id:subscheme_id,
        is_delete: true,
        user_id: localStorage.getItem('userId'),
    };
    // Fetch data via AJAX and create sub-table
    $.ajax({
        url: config.ssp_api_url + '/sub_scheme_inactive',
        type: 'POST',
        headers: { 'X-APP-KEY': 'te$t', 'X-APP-NAME': 'te$t' },
        data: { data: encryptData(encrypt_data) },
        success: function(response) {
            if (response.success === 1) {
                Swal.fire({
                    icon: "success",
                    title: 'Sub Scheme De-Activated successfully',
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: false,
                }).then(function () {
                    window.location.href = "scheme-management.html";
                })
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Sub Scheme De-Activation Failed",
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: false,
                });
            }
        },
        error: function() {
            $('#preloader').hide();
            Swal.fire({
                icon: "error",
                title: "Something went wrong!",
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: false,
            });
        }
    });
});
$(document).on('click', '.activate-sub-scheme', function (event) {
    event.preventDefault(); // Prevent default anchor behavior
    const schemeId = $(this).data('scheme-id'); // Get the scheme ID
    const subscheme_id = $(this).data('sub-scheme-id'); // Get the scheme ID
    var encrypt_data = {
        scheme_id: schemeId,
        sub_scheme_id:subscheme_id,
        is_delete: false,
        user_id: localStorage.getItem('userId'),
    };
    // Fetch data via AJAX and create sub-table
    $.ajax({
        url: config.ssp_api_url + '/sub_scheme_inactive',
        type: 'POST',
        headers: { 'X-APP-KEY': 'te$t', 'X-APP-NAME': 'te$t' },
        data: { data: encryptData(encrypt_data) },
        success: function(response) {
            if (response.success === 1) {
                Swal.fire({
                    icon: "success",
                    title: 'Sub Scheme Activated successfully',
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: false,
                }).then(function () {
                    window.location.href = "scheme-management.html";
                })
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Sub Scheme Activation Failed",
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: false,
                });
            }
        },
        error: function() {
            $('#preloader').hide();
            Swal.fire({
                icon: "error",
                title: "Something went wrong!",
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: false,
            });
        }
    });
});
$(document).on('click', '.freeze-scheme', function (event) {
    event.preventDefault(); // Prevent default anchor behavior
    const schemeId = $(this).data('scheme-id'); // Get the scheme ID
    const is_freeze = $(this).data('is-freeze');
    var encrypt_data = {
        ischemeid: schemeId,
        iisfreezed: is_freeze,
        ifreezedby: localStorage.getItem('userId'),
    };
    // Fetch data via AJAX and create sub-table
    $.ajax({
        url: config.ssp_api_url + '/update_scheme_scheme_freezed',
        type: 'POST',
        headers: { 'X-APP-KEY': 'te$t', 'X-APP-NAME': 'te$t' },
        data: { data: encryptData(encrypt_data) },
        success: function(response) {
            if (response.success === 1) {
                Swal.fire({
                    icon: "success",
                    title: 'Scheme Updated successfully',
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: false,
                }).then(function () {
                    window.location.href = "scheme-management.html";
                })
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Scheme Updation Failed",
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: false,
                });
            }
        },
        error: function() {
            $('#preloader').hide();
            Swal.fire({
                icon: "error",
                title: "Something went wrong!",
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: false,
            });
        }
    });
});
$(document).on('click', '.freeze-sub-scheme', function (event) {
    event.preventDefault(); // Prevent default anchor behavior
    const schemeId = $(this).data('scheme-id'); // Get the scheme ID
    const subscheme_id = $(this).data('sub-scheme-id'); // Get the scheme ID
    const is_freeze = $(this).data('is-freeze');
    var encrypt_data = {
        ischemeid: schemeId,
        isubschemeid: subscheme_id,
        ifreezed: is_freeze,
        iuserdid: localStorage.getItem('userId'),
    };
    // Fetch data via AJAX and create sub-table
    $.ajax({
        url: config.ssp_api_url + '/update_sp_scheme_subscheme_freezed',
        type: 'POST',
        headers: { 'X-APP-KEY': 'te$t', 'X-APP-NAME': 'te$t' },
        data: { data: encryptData(encrypt_data) },
        success: function(response) {
            if (response.success === 1) {
                Swal.fire({
                    icon: "success",
                    title: 'Sub Scheme Updated successfully',
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: false,
                }).then(function () {
                    window.location.href = "scheme-management.html";
                })
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Sub Scheme Updated Failed",
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: false,
                });
            }
        },
        error: function() {
            $('#preloader').hide();
            Swal.fire({
                icon: "error",
                title: "Something went wrong!",
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: false,
            });
        }
    });
});
function populateDropdown(selectElement, options) {
    selectElement.empty(); // Clear existing options
    selectElement.append('<option value="">All</option>'); // Default option
    options.forEach(option => {
        selectElement.append(`<option value="${option}">${option}</option>`);
    });
}
let currentPage = 0; // Track the currently active page
function createSubTable(subSchemes) {
    const rowsPerPage = 5;
    let currentPage = 0; // Initialize current page
    let filteredSchemes = subSchemes; // Store filtered schemes initially

    const subTableRow = $('<tr class="sub-table"></tr>');
    const subTableCell = $('<td colspan="8"></td>');

    // Check if subSchemes is empty
    if (subSchemes.length === 0) {
        subTableCell.append('<div style="text-align: center;">No sub-scheme available</div>');
        subTableRow.append(subTableCell);
        return subTableRow; // Return early if no schemes are available
    }

    subTableCell.append(`
        <div class="pagination-container">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th style="width: 30%; max-width: 150px;">Sub-Scheme Name</th>
                        <th style="width: 15%; max-width: 100px;">Scholarship Amount</th>
                        <th style="width: 30%; max-width: 150px;">Fee Type</th>
                        <th style="width: 20%; max-width: 100px;">Action</th>
                    </tr>
                </thead>
                <tbody id="sub-scheme-body">
                    ${getPageRows(filteredSchemes, currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage)}
                </tbody>
            </table>
            ${Math.ceil(filteredSchemes.length / rowsPerPage) > 1 ? `
            <div class="d-flex justify-content-between align-items-center">
                <input type="text" id="sub-scheme-search" placeholder="Search..." class="form-control mb-2" style="width: 150px;" />
                <div class="pagination">
                    ${renderPagination(Math.ceil(filteredSchemes.length / rowsPerPage), currentPage)}
                </div>
            </div>
            ` : ''}
        </div>
    `);

    subTableRow.append(subTableCell);

    // Pagination event handler
    subTableCell.on('click', '.page-button', function() {
        currentPage = $(this).data('page'); // Update current page
        const start = currentPage * rowsPerPage;
        const end = start + rowsPerPage;

        // Update table body with the current page rows
        $('#sub-scheme-body').html(getPageRows(filteredSchemes, start, end));
        
        // Update pagination buttons
        subTableCell.find('.pagination').html(renderPagination(Math.ceil(filteredSchemes.length / rowsPerPage), currentPage));
    });

    subTableCell.on('input', '#sub-scheme-search', function() {
        const searchTerm = $(this).val().toLowerCase();
        filteredSchemes = subSchemes.filter(scheme => {
            return (
                scheme.subscheme_name.toLowerCase().includes(searchTerm) ||
                scheme.scholarship_fee_type.toLowerCase().includes(searchTerm)
            );
        });

        // Reset pagination and render the filtered results
        currentPage = 0; // Reset to first page
        $('#sub-scheme-body').html(getPageRows(filteredSchemes, currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage));

        // Update pagination buttons
        if (filteredSchemes.length > 0) {
            subTableCell.find('.pagination').html(renderPagination(Math.ceil(filteredSchemes.length / rowsPerPage), currentPage));
        } else {
            subTableCell.find('.pagination').empty(); // Remove pagination if there are no results
            $('#sub-scheme-body').html('<tr><td colspan="4"  style="text-align: center;">No results found</td></tr>'); // Show no results message
        }
    });

    return subTableRow;
}

function getPageRows(subSchemes, start, end) {
    return subSchemes.slice(start, end).map(scheme => `
        <tr>
            <td style="word-wrap: break-word; max-width: 150px; overflow-wrap: break-word; overflow: hidden; white-space: normal;">${escapeHtml(scheme.subscheme_name)}</td>
            <td style="word-wrap: break-word; max-width: 100px; overflow-wrap: break-word; overflow: hidden; white-space: normal;">${scheme.scholarhip_fee_amount ? formatToIndianRupee(scheme.scholarhip_fee_amount) : '-'}</td>
            <td style="word-wrap: break-word; max-width: 150px; overflow-wrap: break-word; overflow: hidden; white-space: normal;">${escapeHtml(scheme.scholarship_fee_type)}</td>
            <td style="width: 20%;">
                <a href="#" class="btn add-btn view-sub-scheme" 
                    data-scheme-id="${escapeHtml(scheme.scheme_id)}" 
                    data-sub-scheme-id="${escapeHtml(scheme.subscheme_id)}" 
                    data-subscheme_name="${escapeHtml(scheme.subscheme_name)}" 
                    data-scholarhip_fee_amount="${escapeHtml(scheme.scholarhip_fee_amount)}" 
                    data-scholarship_fee_type="${escapeHtml(scheme.scholarship_fee_type)}"  
                    data-scholarhip_fee_percent="${escapeHtml(scheme.scholarhip_fee_percent)}"
                ><span data-i18n="view"><i class="bi bi-eye"></i></span></a>
                ${!scheme.is_freezed && userPermissions.canEditScheme ? `
                    <a class="btn add-btn edit-scheme" data-scheme-id="${scheme.scheme_id}" href="sub-scheme-form.html?details=${btoa(JSON.stringify({ scheme_id: scheme.scheme_id, is_edit: true, scheme: scheme }))}" title="Edit Sub-Scheme"><i class="bi bi-pencil"></i></a>
                ` : ''}
                ${!scheme.is_freezed && userPermissions.canDeleteScheme ? `
                    <a class="btn add-btn delete-sub-scheme" data-scheme-id="${scheme.scheme_id}" data-sub-scheme-id="${scheme.subscheme_id}" href="#" title="Delete Sub-Scheme"><i class="bi bi-trash"></i></a>
                ` : ''}
                ${userPermissions.canApproveScheme ? `
                    <a class="btn add-btn freeze-sub-scheme" data-scheme-id="${scheme.scheme_id}" data-is-freeze="${scheme.is_freezed ? 'false' : 'true'}" data-sub-scheme-id="${scheme.subscheme_id}" href="#" title="${scheme.is_freezed ? 'Un-Freeze Sub-Scheme' : 'Freeze Sub-Scheme'}">
                        <i class="bi bi-snow3"></i>
                    </a>
                ` : ''}
                ${!scheme.is_freezed && userPermissions.canApproveScheme ? `
                    <a class="btn add-btn ${scheme.insubactive ? 'activate-sub-scheme' : 'deactivate-sub-scheme'}" data-scheme-id="${scheme.scheme_id}" data-sub-scheme-id="${scheme.subscheme_id}" href="#" title="${scheme.insubactive ? 'Activate Sub-Scheme' : 'Deactivate Sub-Scheme'}">
                        <i class="bi ${scheme.insubactive ? 'bi-check-circle' : 'bi-x-circle'}"></i>
                    </a>
                ` : ''}
            </td>
        </tr>
    `).join('');
}
$(document).on('click', '.view-sub-scheme', function (event) {
    event.preventDefault();
    const schemeId = $(this).data('scheme-id');
    const subSchemeId = $(this).data('sub-scheme-id');
    const subscheme_name = $(this).data('subscheme_name');
    const scholarship_fee_type = $(this).data('scholarship_fee_type');
    const scholarhip_fee_amount = $(this).data('scholarhip_fee_amount');
    const formattedAmount = scholarhip_fee_amount ? formatToIndianRupee(scholarhip_fee_amount) : 'N/A';
    const scholarhip_fee_percent = $(this).data('scholarhip_fee_percent');
    // Update the modal with sub-department details
    $('#scheme_info').find('#form-subscheme_name').text(subscheme_name || 'N/A');
    $('#scheme_info').find('#form-scholarship_fee_type').text(scholarship_fee_type || 'N/A');
    $('#scheme_info').find('#form-scholarhip_fee_amount').text(formattedAmount || 'N/A');
    $('#scheme_info').find('#form-scholarhip_fee_percent').text(scholarhip_fee_percent || 'N/A');
    const fieldMapping = {
        "Education": "#form-education",
        "InstituteOwnership": "#form-institute_ownership",
        "Institute": "#form-institute",
        "University": "#form-university",
        "Stream": "#form-stream",
        "CourseType": "#form-course_type",
        "MediumofInstruction": "#form-MediumofInstruction",
        "CourseGrp": "#form-CourseGrp",
        "Course": "#form-Course",
        "CourseCategory": "#form-CourseCategory",
        "CourseBr": "#form-CourseBr",
        "CourseYear": "#form-CourseYear",
        "AccrediationStatus": "#form-AccrediationStatus",
        "Caste": "#form-Caste",
        "Gender": "#form-Gender",
        "Income": "#form-Income",
        "IncomeValue": "#form-IncomeValue",
        "Quota": "#form-Quota",
        "SplCtg": "#form-SplCtg",
        "ModeOfStudy": "#form-ModeOfStudy",
        "ResidentalStatus": "#form-ResidentalStatus",
        "MaintanenceGrp": "#form-MaintanenceGrp",
        "DisabilityStatus": "#form-DisabilityStatus",
        "Religion": "#form-Religion",
        "Community": "#form-Community"
    };
    var encrypt_data = {scheme_id: schemeId, sub_scheme_id: subSchemeId};
    $.ajax({
        url: config.ssp_api_url + '/get_rule_condition',
        type: 'POST',
        headers: { 'X-APP-KEY': 'te$t', 'X-APP-NAME': 'te$t' },
        data: { data: encryptData(encrypt_data) },
        success: function(ruleResponse) {
            var results = decryptData(ruleResponse.data);
            if (results.status == 1) {
                // Track if any parameters in the section are populated
                let sectionHasValues = {
                    "Institute Parameters": false,
                    "Course Parameters": false,
                    "Student Eligibility Parameters": false,
                    "Maintenance Parameters": false,
                    "Socio Economic Parameters": false
                };
                results.fielddetails?.forEach(function (field) {
                    if (fieldMapping[field.fieldname]) {
                        var $list = $('<ul class="parameter-list"></ul>'); // Create a new unordered list

                        // Check if field.fieldvalues is an array and has elements
                        if (Array.isArray(field.fieldvalues) && field.fieldvalues.length > 0) {
                            field.fieldvalues.forEach(function (value) {
                                if (value.value !== "All" && value.text !== "All" && !(value.text === "-1" && value.value === "Not Applicable")) {
                                    var listItem = $('<li class="parameter-items"></li>').text(value.value || value.text); // Create list items
                                    $list.append(listItem); // Append the list item to the list
                                }
                            });
                        }

                        var $fieldContainer = $('#scheme_info').find(fieldMapping[field.fieldname]).closest('.mb-1'); // Get the parent container

                        // Check if the list is empty
                        if ($list.children().length === 0) {
                            $fieldContainer.hide(); // Hide the entire container (label + field)
                        } else {
                            $fieldContainer.show(); // Show the container if there are values
                            $fieldContainer.find('.parameters').html($list); // Update the content
                            sectionHasValues[getSectionTitle(field.fieldname)] = true; // Mark section as having values
                        }
                    }
                });


                // Hide sections if they don't have any values
                for (const section in sectionHasValues) {
                    if (!sectionHasValues[section]) {
                        $('.mt-2.card:has(h6:contains("' + section + '"))').hide();
                    }
                }
            } else {
                Object.keys(fieldMapping).forEach(function (fieldname) {
                    var $fieldContainer = $('#scheme_info').find(fieldMapping[fieldname]).closest('.mb-1');
                    $fieldContainer.hide(); // Hide all fields if there's an error
                });
            }
        },
        error: function() {
            alert('An error occurred while fetching the data.'); // Handle AJAX error
        }
    });
    $('#scheme_info').modal('show');
});
function getSectionTitle(fieldname) {
    if (["Education", "InstituteOwnership", "Institute", "University"].includes(fieldname)) {
        return "Institute Parameters";
    } else if (["Stream", "CourseType", "MediumofInstruction", "CourseGrp", "Course", "CourseCategory", "CourseBr", "CourseYear", "AccrediationStatus", "Caste", "Gender", "Income", "IncomeValue"].includes(fieldname)) {
        return "Course Parameters";
    } else if (["Quota", "SplCtg", "ModeOfStudy"].includes(fieldname)) {
        return "Student Eligibility Parameters";
    } else if (["ResidentalStatus", "MaintanenceGrp", "DisabilityStatus"].includes(fieldname)) {
        return "Maintenance Parameters";
    } else if (["Religion", "Community"].includes(fieldname)) {
        return "Socio Economic Parameters";
    }
    return "";
}
function renderPagination(totalPages, currentPage) {
    const pageButtons = [];
    const maxVisiblePages = 5; // Maximum number of visible page buttons
    const halfVisible = Math.floor(maxVisiblePages / 2);

    // Calculate startPage and endPage
    let startPage = Math.max(0, currentPage - halfVisible);
    let endPage = Math.min(totalPages - 1, currentPage + halfVisible);

    // Ensure we show the last 2 pages if we are at the end
    if (currentPage >= totalPages - 2) {
        endPage = totalPages - 1;
        startPage = Math.max(0, totalPages - maxVisiblePages);
    }

    // Ensure we show the first 2 pages if we are at the start
    if (currentPage <= 1) {
        startPage = 0;
        endPage = Math.min(maxVisiblePages - 1, totalPages - 1);
    }

    // Add "Previous" button
    if (currentPage > 0) {
        pageButtons.push(`
            <button class="page-button" data-page="${currentPage - 1}" style="border: 1px solid #ccc;">Previous</button>
        `);
    }

    // Add first two pages if necessary
    if (startPage > 0) {
        for (let i = 0; i < Math.min(2, startPage); i++) {
            pageButtons.push(`
                <button class="page-button" data-page="${i}" style="background-color: ${i === currentPage ? '#007bff' : '#f1f1f1'}; color: ${i === currentPage ? '#fff' : '#000'}; border: 1px solid ${i === currentPage ? '#007bff' : '#ccc'};">
                    ${i + 1}
                </button>
            `);
        }
        if (startPage > 2) {
            pageButtons.push(`<span>...</span>`);
        }
    }

    // Add page buttons
    for (let i = startPage; i <= endPage; i++) {
        pageButtons.push(`
            <button class="page-button" data-page="${i}" style="background-color: ${i === currentPage ? '#007bff' : '#f1f1f1'}; color: ${i === currentPage ? '#fff' : '#000'}; border: 1px solid ${i === currentPage ? '#007bff' : '#ccc'};">
                ${i + 1}
            </button>
        `);
    }

    // Add last two pages if necessary
    if (endPage < totalPages - 1) {
        if (endPage < totalPages - 3) {
            pageButtons.push(`<span>...</span>`);
        }
        for (let i = totalPages - 2; i < totalPages; i++) {
            pageButtons.push(`
                <button class="page-button" data-page="${i}" style="background-color: ${i === currentPage ? '#007bff' : '#f1f1f1'}; color: ${i === currentPage ? '#fff' : '#000'}; border: 1px solid ${i === currentPage ? '#007bff' : '#ccc'};">
                    ${i + 1}
                </button>
            `);
        }
    }

    // Add "Next" button
    if (currentPage < totalPages - 1) {
        pageButtons.push(`
            <button class="page-button" data-page="${currentPage + 1}" style="border: 1px solid #ccc;">Next</button>
        `);
    }

    return pageButtons.join('');
}

function updateDateTime() {
    const now = new Date();
    const options = {
      timeZone: 'Asia/Kolkata', // Use Asia/Kolkata for Indian time zone
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false // Use 24-hour format
    };
    const formattedDate = now.toLocaleString('en-IN', options).replace(',', ''); // Format: DD/MM/YYYY HH:mm:ss
    document.getElementById('dateTimeLink').textContent = formattedDate;
}

setInterval(updateDateTime, 1000);
updateDateTime();
document.getElementById('logout-btn').addEventListener('click', function(event) {
    event.preventDefault();
    localStorage.clear();
    sessionStorage.clear();
    // Get the current URL
    const currentUrl = window.location.href;
    // Modify the URL to point to the new file
    const newUrl = currentUrl.replace(/[^\/]*$/, 'login.html'); // Replace the last part of the URL
    // Redirect to the new URL
    window.location.href = newUrl;
});

function escapeHtml(html) {
    const text = document.createTextNode(html);
    const div = document.createElement('div');
    div.appendChild(text);
    return div.innerHTML;
}
$('.filter-drops').on('change', function () {
    // Enable the submit button if any filter is changed
    $('#submit').prop('disabled', false);
});
$('#submit').on('click', function (e) {
    e.preventDefault(); // Prevent default form submission

    // Redraw the DataTable with new filter values
    initializeDataTable();
    $(this).prop('disabled', true);
});