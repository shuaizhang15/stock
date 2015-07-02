<?php
header("Content-Type:text/html;charset=utf-8");
// by Shuai Zhang
// Store the stock-buy1 data.
if(!empty($_POST['from_index']) && $_POST['from_index'] == "true") {
    // Initiallize folders and check their status.
    $file_folder = '../data';
    if(!file_exists($file_folder)) {
        $error = "出错，文件夹不存在<br />
                  找张帅或管理员看一下";
        exit($error);
    }
    // Initiallize file name and file path.
    $file_name = iconv('utf-8','gb2312', $_POST['date'].'.txt');
    $file_path = $file_folder.'/'.$file_name;
    $content = $_POST['date'];
    $content .= "\r\n今日涨停" . count($_POST['buy1_stock_data']) . "支股票";
    $content .= "\t\t今日跌停" . count($_POST['sell1_stock_data']) . "支股票";
    $content .= "\r\n涨停股票 - 买一库存\t\t跌停股票 - 卖一库存";
    
    $buy1_pair_array = array();
    $sell1_pair_array = array();

    foreach($_POST['buy1_stock_data'] as $buy1_stock_code => $buy1_value) {
        array_push($buy1_pair_array, [$buy1_stock_code, $buy1_value]);
    }
    foreach($_POST['sell1_stock_data'] as $sell1_stock_code => $sell1_value) {
        array_push($sell1_pair_array, [$sell1_stock_code, $sell1_value]);
    }
    $long_length = count($buy1_pair_array) > count($sell1_pair_array) ? count($buy1_pair_array) : count($sell1_pair_array);

    for($i=0; $i<$long_length; $i++) {
        $content .= "\r\n";
        if($buy1_pair_array[$i][0] != "-1" || $buy1_pair_array[$i][0] != "") {
            $content .= $buy1_pair_array[$i][0] . " - " . $buy1_pair_array[$i][1];
        }
        $content .= "\t\t\t";
        if($sell1_pair_array[$i][0] != "-1" || $sell1_pair_array[$i][0] != "") {
            $content .= $sell1_pair_array[$i][0] . " - " . $sell1_pair_array[$i][1];
        }
    }    
    // For debug using.
    // echo $content;

    $data_file = fopen($file_path, "w");
    fwrite($data_file, $content);
    fclose($data_file);

    echo "成功！文件已生成！";
}

?>