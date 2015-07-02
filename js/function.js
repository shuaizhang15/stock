// send request to the server & get stock code array back
function getStock(){
    $.ajax({
        url: 'GetStock.py',
        crossDomain: true,
        success: function(data){

        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            alert('股票数据返回错误，找张帅问问');
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
}


// 切割过长数组
function cutArray(arr) {
    if(arr.length > 800) {
        allStockCodeArray.push(arr.splice(0, 800));
        cutArray(arr);
    } else {
        allStockCodeArray.push(arr);
    }
}

//根据股票行情数组来创建126股票数据接口的url请求
function urlMake(arr) {
    var url = "http://api.money.126.net/data/feed/";
    for(var i=0; i<arr.length; i++) {
        url = url + arr[i] + ",";
    }
    url += "money.api";
    console.log(url);
    return url;
}

// 获取涨停股的数据
function getStockData(stockUrl, buy1StockTotal, sell1StockTotal){
    $.ajax({
        url: stockUrl,
        dataType: 'jsonp',
        crossDomain: true,
        async: false,
        success: function(data){
            for(index in data){
                thisBuy1StockData = new Array();
                // 买一库存
                if(data[index].askvol1 == 0 && data[index].bidvol1 != 0) {
                    thisBuy1StockData.push(data[index].code);
                    var bidvol1 = "" + data[index].bidvol1;
                    if(bidvol1.length > 2) {
                        thisBuy1StockData.push(bidvol1.substr(0, bidvol1.length-2));
                    } else {
                        thisBuy1StockData.push("不到1");
                    }
                    buy1StockTotal.push(thisBuy1StockData);
                    upCount++;
                }
                thisSell1StockData = new Array();
                // 卖一库存
                if(data[index].bidvol1 == 0 && data[index].askvol1 != 0) {
                    thisSell1StockData.push(data[index].code);
                    var askvol1 = "" + data[index].askvol1;
                    if(askvol1.length > 2) {
                        thisSell1StockData.push(askvol1.substr(0, askvol1.length-2));
                    } else {
                        thisSell1StockData.push("不到1");
                    }
                    sell1StockTotal.push(thisSell1StockData);
                    downCount++;
                }
            }
            $("#limit_up_count").text(upCount);
            $("#limit_down_count").text(downCount);
            stockArrayCount++;
            console.log("stockArraylengt: " + stockArrayLength);
            if(stockArrayCount == 4) {
                tableMake(buy1StockTotal, sell1StockTotal);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            alert('股票数据返回错误，找张帅问问');
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
}

// function processStockArray(buy1StockData, sell1StockData) {
//     buy1StockTotal = new Array();
//     sell1StockTotal = new Array();
//     if(buy1StockData != null && buy1StockData.length) {
//         for(var i=0; i<buy1StockData.length; i++) {
//             buy1StockTotal.push(buy1StockData[i]);
//         }
//     }
//     if (sell1StockData != null && sell1StockData.length) {
//         for(var i=0; i<sell1StockData.length; i++) {
//             sell1StockTotal.push(sell1StockData[i]);
//         }
//     }
//     tableMake(buy1StockTotal, sell1StockTotal);
// }

//更新表格中的行情数据
function tableMake(buy1StockTotal, sell1StockTotal) { 
    var trNodes, trNode, buy1Id, buy1Vol, sell1Id, sell1Vol;
    var main_table = $('#main_table');
    trNodes = "";
    if((buy1StockTotal != null && buy1StockTotal.length)
            || (sell1StockTotal != null && sell1StockTotal.length))
    {
        long_length = (buy1StockTotal.length>sell1StockTotal.length) ? buy1StockTotal.length : sell1StockTotal.length;
        for(var i=0; i<long_length; i++) {
            buy1Id = (buy1StockTotal[i] != null) ? buy1StockTotal[i][0] : "-1";
            buy1Vol = (buy1StockTotal[i] != null) ? buy1StockTotal[i][1] : "-1";
            sell1Id = (sell1StockTotal[i] != null) ? sell1StockTotal[i][0] : "-1";
            sell1Vol = (sell1StockTotal[i] != null) ? sell1StockTotal[i][1] : "-1";
            // 页面展示
            buy1_html_id = (buy1Id != "-1")
                    ? "<div class='col-md-3' style='text-align: right'><a href='" + stock163Url + buy1Id + ".html'>" + buy1Id.substr(1) + "</a></div>"
                    : "<div class='col-md-3' style='text-align: right'>" + buy1Id + "</div>";
            buy1_html_vol = "<div class='col-md-3' style='text-align: left; color: red;'>" + buy1Vol + "</div>";
            sell1_html_id = (sell1Id != "-1")
                    ? "<div class='col-md-3' style='text-align: right'><a href='" + stock163Url + sell1Id + ".html'>" + sell1Id.substr(1) + "</a></div>"
                    : "<div class='col-md-3' style='text-align: right'>" + sell1Id + "</div>";
            sell1_html_vol = "<div class='col-md-3' style='text-align: left; color: green;'>" + sell1Vol + "</div>";
            trNode = "<div class='row stockData'>" + buy1_html_id + buy1_html_vol + sell1_html_id + sell1_html_vol + "</div>";
            trNodes += trNode;
            // 表格添加数据
            input_stock_pair = "<input name='buy1_stock_data[" + ((buy1Id != "-1") ? buy1Id.substr(1) : buy1Id) + "]' value='" + buy1Vol + "'/>";
            input_stock_pair += "<input name='sell1_stock_data[" + ((sell1Id != "-1") ? sell1Id.substr(1) : sell1Id) + "]' value='" + sell1Vol + "'/>";
            $('#hidden_form form').append(input_stock_pair);
        }
        main_table.append(trNodes);
    } else {
        $("#hidden_notice").appendTo("#main_table");
        $(".hidden_data").empty();
        $("#btn_reload").css({"visibility": "visible"}).click(function(){
            $("#no_stock_notice h2").text("还是没有");
            $("#btn_goto_163").css({"visibility": "visible"});
            $(this).unbind().click(function(){
                $("#btn_reload").css({"display": "none"});
                $("#no_stock_notice h2").text("依然没有，去163看看吧");
            });
        });
    }
    historyMake();
}

// 存储文件
function historyMake() {
    $('#form_date').val($('#date').text());
    $.post("StoreData.php", $('#hidden_form form').serialize(), function(result){
        console.log(result);
    });
}


// 对Date的扩展，将 Date 转化为指定格式的String 
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function(fmt) 
{ //author: meizz 
  var o = { 
    "M+" : this.getMonth()+1,                 //月份 
    "d+" : this.getDate(),                    //日 
    "h+" : this.getHours(),                   //小时 
    "m+" : this.getMinutes(),                 //分 
    "s+" : this.getSeconds(),                 //秒 
    "q+" : Math.floor((this.getMonth()+3)/3), //季度 
    "S"  : this.getMilliseconds()            //毫秒 
  }; 
  if(/(y+)/.test(fmt)) 
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
  for(var k in o) 
    if(new RegExp("("+ k +")").test(fmt)) 
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length))); 
  return fmt; 
}

// 获取当日周几
function getWeekDay() {
  var weekDays = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
  return weekDays[new Date().getDay()];
}

/*
http://img1.quotes.ws.126.net/chart/timechart/1000001.png    分时图
http://img1.quotes.ws.126.net/chart/kchart/30/1000001.png    30天日K线
http://img1.quotes.ws.126.net/chart/kchart/90/1000001.png    90天日K线
http://img1.quotes.ws.126.net/chart/kchart/180/1000001.png   180天日K线
http://img1.quotes.ws.126.net/chart/kchart/week/1000001.png  周线
http://img1.quotes.ws.126.net/chart/kchart/month/1000001.png 月线
http://img1.quotes.ws.126.net/chart/kchart/180/1000001.png   半年线

*/

