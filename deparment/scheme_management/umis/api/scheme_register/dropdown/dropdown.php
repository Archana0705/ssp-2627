<?php

header('Content-Type: application/json');

// 🔹 Validate input
if (!isset($_POST['field']) || empty($_POST['field'])) {
    echo json_encode([
        "message" => "Field is required",
        "success" => 0,
        "data" => []
    ]);
    exit;
}

$requestedField = $_POST['field'];
$responseData = [];

// 🔹 Common function
function mapToDropdown($values, $texts) {
    $result = [];

    foreach ($values as $index => $value) {
        $result[] = [
            "id" => $value,
            "text" => $texts[$index]
        ];
    }

    return $result;
}

// 🔹 Switch based on field
switch ($requestedField) {

    case 'community':
        $texts  = ['Not Applicable', 'SC', 'SC Arunthathiyar', 'SCC', 'ST'];
        $values = ['-1', '1', '2', '3', '4'];
        $responseData = mapToDropdown($values, $texts);
        break;

    case 'religion':
        $texts  = ["Hindu", "Muslim", "Christian", "Jain"];
        $values = ['13', '24', '36', '48'];
        $responseData = mapToDropdown($values, $texts);
        break;

    case 'residential_type':
        $texts = [
            'Not Applicable',
            "Institution run hostel within Campus",
            "Institution run hostel outside of the Campus",
            "Welfare or Govt Department",
            "Paid private hostel/Accommodation"
        ];
        $values = ['-1','11', '22', '33', '44'];
        $responseData = mapToDropdown($values, $texts);
        break;
    case 'residential_status':
        $texts = [
            'Not Applicable',
            "Hosteller",
            "Days Scholar",
        ];
        $values = ['-1','14', '24'];
        $responseData = mapToDropdown($values, $texts);
        break;

    case 'gender':
        $texts  = ['Not Applicable',"Male", "Female", "Third Gender"];
        $values = ['-1','1', '2', '3'];
        $responseData = mapToDropdown($values, $texts);
        break;
    case 'quota':
        $texts  = ['Not Applicable',"Government", "Management"];
        $values = ['-1','1', '2'];
        $responseData = mapToDropdown($values, $texts);
        break;
    case 'first_graduate':
        $texts  = ['Not Applicable',"Yes", "No"];
        $values = ['-1','111', '222'];
        $responseData = mapToDropdown($values, $texts);
        break;
    case 'special_category':
        $texts  = ['Not Applicable',"Yes", "No"];
        $values = ['-1','111', '222'];
        $responseData = mapToDropdown($values, $texts);
        break;
    case 'income_range':
        $texts = ['Not Applicable','Equal','Not Equal','Greater Than','Lesser Than','Greater Than And Equal','Lesser Than And Equal'];
        $values = ['-1','39', '40','24', '25','29', '30'];
        $responseData = mapToDropdown($values, $texts);
        break;
    default:
        echo json_encode([
            "message" => "Invalid field",
            "success" => 0,
            "data" => []
        ]);
        exit;
}

// 🔹 Final Response
echo json_encode([
    "message" => "Success",
    "success" => 1,
    "data" => $responseData
], JSON_PRETTY_PRINT);