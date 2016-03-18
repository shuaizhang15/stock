<?php
// by Shuai Zhang
// Store the stock-buy1 data.
header("Content-Type:text/html;charset=utf-8");
include("../Setting.php");
include("function.php");

if(isset($_POST['request_stock_code_array']) && $_POST['request_stock_code_array'] == "1") {
    $stockCodeArray = getStockCodeArray($setting);
    echo json_encode($stockCodeArray);
    exit();
}
