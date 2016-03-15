<?php
// by Shuai Zhang
// Store the stock-buy1 data.
header("Content-Type:text/html;charset=utf-8");
include("function.php");
if(!empty($_POST['request_stock_code_array']) && $_POST['request_stock_code_array'] == "1") {
    $stockCodeArray = getStockCodeArray();
    echo json_encode($stockCodeArray);
    exit();
}