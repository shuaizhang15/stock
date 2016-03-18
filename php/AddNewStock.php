<?php
// by Shuai Zhang
// Add a new stock.
header("Content-Type:text/html;charset=utf-8");
include("../Setting.php");
include("function.php");

if(isset($_POST['add_new_stock'])) {
    $new_stock_code = $_POST['add_new_stock'];
    $result_array = addNewStock($new_stock_code, $setting);
    echo json_encode($result_array);
    exit();
}