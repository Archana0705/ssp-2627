//const API_BASE_URL = 'http://localhost/ssp/ssp_3/department/ssp_backend_1/public/api';
const API_BASE_URL = 'http://192.168.4.251/state_scholarship_portal_api/ssp_3/public/api';

let config = {
    ssp_api_url: 'http://192.168.4.251/state_scholarship_portal_api/home_page/api/',
    home_api_url: 'http://192.168.4.251/state_scholarship_portal_api/home_page/api',
    dept_api_url: 'http://192.168.4.251/state_scholarship_portal_api/home_page/api/department/',
    sso_api_url: 'http://192.168.4.251/state_scholarship_portal_api/sso/api'
}

function formatIndianNumber(number) {
    if (isNaN(number) || number == null) {
        return "0"; // Return "0" or some default value if it's invalid
    }
    return new Intl.NumberFormat('en-IN').format(number);
}