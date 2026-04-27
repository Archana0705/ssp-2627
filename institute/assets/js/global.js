// window.location.href = 'under_maintenance.html';


var config = {
    umis_fees_api_url: 'http://192.168.4.251/ssp_institute_v2_api/api/v2/Fees',
    institute_api_url: 'http://192.168.4.251/ssp_institute_v2_api/api/v2/institute',
    ssp_api_url: 'http://192.168.4.251/ssp_institute_v2_api/api/v2',
    student_api_url: 'http://192.168.4.251/ssp_institute_v2_api/api/v2/institute',
    students_api_url: 'http://192.168.4.251/ssp_institute_v2_api/api/v2/student',
    department_api_url: 'http://192.168.4.251/ssp_institute_v2_api/api/v2',
    hod_api_url: 'http://192.168.4.251/ssp_institute_v2_api/api/v2/hod',
    app_key: 'l!$',
}

const APIURL = 'http://192.168.4.251/ssp_institute_v2_api/api/v2/institute/ppstps/';
const HODAPIURL = 'http://192.168.4.251/ssp_institute_v2_api/api/v2/hod/ppstps/';


// var config = {
//     umis_fees_api_url: 'https://umisfees.tnega.org/backend/api/v1/Fees',
//     institute_api_url: 'https://umisfees.tnega.org/backend/api/v1/institute',
//     ssp_api_url: 'https://umisfees.tnega.org/backend/api/v1',
//     student_api_url: 'https://umisfees.tnega.org/backend/api/v1/institute',
//     students_api_url: 'https://umisfees.tnega.org/backend/api/v1/student',
//     student_applied_pdf_path: 'https://ssp-pdf.s3.ap-south-1.amazonaws.com/',
//     department_api_url: 'https://umisfees.tnega.org/backend/api/v1',
//     hod_api_url: 'https://umisfees.tnega.org/backend/api/v1/hod',
//     app_key: 'l!$',
// }

function encryptData(data) {
    const secretKey = "xmcK|fbngp@!71L$";
    const key = CryptoJS.enc.Hex.parse(CryptoJS.SHA256(secretKey).toString()); // Derive 256-bit key
    const iv = CryptoJS.lib.WordArray.random(16); // Generate random IV

    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7, // Ensure PKCS7 padding
    });

    // Combine IV and ciphertext
    const combinedData = iv.concat(encrypted.ciphertext);

    // Return Base64 encoded result
    return CryptoJS.enc.Base64.stringify(combinedData);
}

// Decryption Function

function decryptData(encryptedData) {
    const secretKey = "xmcK|fbngp@!71L$"; // Same secret key
    const key = CryptoJS.enc.Hex.parse(CryptoJS.SHA256(secretKey).toString()); // Derive 256-bit key

    // Decode Base64 and split IV and ciphertext
    const decodedData = CryptoJS.enc.Base64.parse(encryptedData).toString(CryptoJS.enc.Hex);
    const ivHex = decodedData.slice(0, 32); // First 16 bytes (IV)
    const cipherHex = decodedData.slice(32); // Remaining bytes (Ciphertext)

    const iv = CryptoJS.enc.Hex.parse(ivHex); // Parse IV
    const ciphertext = CryptoJS.enc.Hex.parse(cipherHex); // Parse Ciphertext

    // Decrypt using AES-256-CBC
    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: ciphertext },
        key,
        {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7, // Default padding
        }
    );

    // Convert decrypted data to a string
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
}

function formatIndianNumber(number) {
    if (isNaN(number) || number == null) {
        return "0"; // Return "0" or some default value if it's invalid
    }
    return new Intl.NumberFormat('en-IN').format(number);
}