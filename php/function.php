<?php
header("Content-Type:text/html;charset=utf-8");

// Adding new stock to the stock list
function addNewStock($new_stock_code, $setting) {
    
    $environment = $setting["environment"];
    $list_folder = $setting["list_folder"];
    $deliminator = $setting["deliminator"];

    $path = "";
    $content = "";

    $stock_lists = array(
        "0" => "sz",
        "3" => "sz",
        "6" => "sh",
        "9" => "as",
        );
    $pattern = "/^[0|3|6|9]\d{5}/";
    $result = array(
        "000" => "已成功添加 ".$new_stock_code,
        "100" => "股票已存在，自动跳过。",
        "101" => "暂不支持美股功能，请勿添加。",
        "400" => "出错，请尝试手动添加。",
        "401" => "出错，未检测到股票代号输入。",
        "402" => "出错，检测到股票代号格式不正确。",
        "403" => "出错，股票列表文件不存在，请尝试手动添加。",
        );
    $result_code = "000";
    
    if(!empty($new_stock_code) || $new_stock_code == "0") {   // code-null-validation
        if(preg_match($pattern, $new_stock_code)) {   // code-format-validation
            if($new_stock_code[0] != "9") {
                $stock_list = $stock_lists[$new_stock_code[0]];
                $list_path = $list_folder.$stock_list.".txt";
                if(file_exists($list_path)) {  // path validation
                    $content = file_get_contents($list_path);
                    if(strpos($content, $new_stock_code) === false) {   // code-exist-validation
                        if($environment == "mac" || $environment == "win") {
                            $content = $new_stock_code . $deliminator[$environment] . $content;
                            file_put_contents($list_path, $content);
                        } else {
                            $result_code = "400";
                        }
                    } else {
                        $result_code = "100";
                    }
                } else {
                    $result_code = "403";
                }
            } else {
                $result_code = "101";
            }
        } else {
            $result_code = "402";
        }
    } else {
        $result_code = "401";
    }
    return array("code" => $result_code, "text" => $result[$result_code]);
}

// Storing the latest stock data in local file.
function storeStock($post, $setting) {
    $environment = $setting["environment"];
    $data_folder = $setting["data_folder"];
    $deliminator = $setting["deliminator"];

    $file_date = $post["file_date"];
    $buy1_stock_data = $post["buy1_stock_data"];
    $sell1_stock_data = $post["sell1_stock_data"];

    $result = "成功！文件已生成！";

    if(!file_exists($data_folder)) {
        $result = "出错，文件夹不存在，找张帅或管理员看一下";
        exit($result);
    }
    if(empty($file_date)) {
        $result = "出错，文件日期有问题，找管理员看一下";
        exit($result);
    }
    $buy1_pair_array = array();
    $sell1_pair_array = array();

    // Initiallize file name and file path.
    $file_name = iconv('utf-8','gb2312', $file_date.'.txt');
    $file_path = $data_folder.'/'.$file_name;
    $content = $file_date;
    $content .= $deliminator[$environment] . "今日涨停" . count($buy1_stock_data) . "支股票";
    $content .= "\t\t今日跌停" . count($sell1_stock_data) . "支股票";
    $content .= $deliminator[$environment] . "涨停股 - 买一库存\t\t跌停股 - 卖一库存";

    foreach($buy1_stock_data as $buy1_stock_code => $buy1_value) {
        array_push($buy1_pair_array, [$buy1_stock_code, $buy1_value]);
    }
    foreach($sell1_stock_data as $sell1_stock_code => $sell1_value) {
        array_push($sell1_pair_array, [$sell1_stock_code, $sell1_value]);
    }
    $long_length = count($buy1_pair_array) > count($sell1_pair_array) ? count($buy1_pair_array) : count($sell1_pair_array);

    for($i=0; $i<$long_length; $i++) {
        $content .= $deliminator[$environment];
        if(!empty($buy1_pair_array[$i][0]) && $buy1_pair_array[$i][0] != "" && $buy1_pair_array[$i][0] != "-1") {
            $content .= $buy1_pair_array[$i][0] . " - " . $buy1_pair_array[$i][1];
        }
        $content .= "\t\t\t";
        if(!empty($sell1_pair_array[$i][0]) && $sell1_pair_array[$i][0] != "" && $sell1_pair_array[$i][0] != "-1") {
            $content .= $sell1_pair_array[$i][0] . " - " . $sell1_pair_array[$i][1];
        }
    }

    file_put_contents($file_path, $content);

    // $data_file = fopen($file_path, "a");
    // fwrite($data_file, $content);
    // fclose($data_file);

    return $result;
}

// Getting the latest stock data from 126
function getStockCodeArray($setting) {
    $environment = $setting["environment"];
    $list_folder = $setting["list_folder"];
    $deliminator = $setting["deliminator"];

    $name = array("sh", "sz");
    $result = array();
    $sh_stock_code = array();
    $sz_stock_code = array();
    if(!file_exists($list_folder)) {
        $error = "出错，文件夹不存在";
        exit($error);
    }
    foreach($name as $this_name) {
        $path = $list_folder.$this_name.".txt";
        $content = file_get_contents($path);
        if($environment == "mac" || $environment == "win") {
            $stock_code_array = explode($deliminator[$environment], $content);
        } else {
            $stock_code_array = $environment . ": 错误的运行环境";
        }
        $result[$this_name] = $stock_code_array;
    }
    return $result;
}