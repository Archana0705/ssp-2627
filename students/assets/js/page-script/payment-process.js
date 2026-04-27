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

$(document).ready(function () {
    AOS.init();

    
    // Get the current year
    const currentYear = new Date().getFullYear();

    // Populate the select with years (e.g., from current year to 2024)
    for (let year = currentYear; year <= 2024; year++) {
        $('#year').append(`<option value="${year}">${year}</option>`);
    }

    // Set the current year as selected
    $('#year').val(currentYear);
});