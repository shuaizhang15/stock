<?php

function getStockCodeArray() {
    $result = array();
    $folder = "stock_code/";
    $name = array("sh", "sz");
    $sh_stock_code = array();
    $sz_stock_code = array();
    if(!file_exists($folder)) {
        $error = "出错，文件夹不存在<br />找张帅看一下";
        exit($error);
    }
    foreach($name as $this_name) {
        $path = $folder.$this_name.".txt";
        $content = file_get_contents($path);
        $stock_code_array = explode("\r\n", $content);
        $result[$this_name] = $stock_code_array;
    }
    return $result;
}

// function getStockInfo() {
//     $ch = curl_init();
//     $url = 'http://qt.gtimg.cn/q=sz000858';
//     // $header = array(
//     //     'apikey: '.$baidu_api_key,
//     // );
//     // 添加apikey到header
//     // curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
//     curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
//     // 执行HTTP请求
//     curl_setopt($ch , CURLOPT_URL , $url);
//     $res = curl_exec($ch);
//     $res_json = explode("~", $res);
//     print_r($res_json);
//     // if(!isset($res['errMsg']) && $res['errMsg'] = "success") {
//     //     print_r($res['retData']);
//     // }
// }