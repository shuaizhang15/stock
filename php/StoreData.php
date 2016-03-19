<?php
// by Shuai Zhang
// Store the stock-buy1 data.
header("Content-Type:text/html;charset=utf-8");
include("../Setting.php");
include("function.php");

if(isset($_POST['from_index']) && $_POST['from_index'] == "true") {
    $post = array(
        "file_date" => $_POST['date'],
        "buy1_stock_data" => empty($_POST['buy1_stock_data'])?array():$_POST['buy1_stock_data'],
        "sell1_stock_data" => empty($_POST['sell1_stock_data'])?array():$_POST['sell1_stock_data'],
        );
    echo storeStock($post, $setting);
    exit();
}
