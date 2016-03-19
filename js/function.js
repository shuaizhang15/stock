// bind adding stock event
function bindAddingEvent() {
    var code_class = {
        "000" : "alert-success",
        "100" : "alert-warning",
        "101" : "alert-warning",
        "400" : "alert-danger",
        "401" : "alert-danger",
        "402" : "alert-danger",
        "403" : "alert-danger",
        };
    $('#addNewStock').bind('click', function(){
        var new_stock_code = $('#newStockCode').val();
        $.ajax({
            type: "POST",
            url: "php/AddNewStock.php",
            data: {add_new_stock: new_stock_code},
            crossDomain: true,
            success: function(result_json) {
                var result = eval("[" + result_json + "]");
                $('#addNotice').hide().empty().removeAttr('class').addClass('alert').addClass(code_class[result[0]["code"]]).append(result[0]["text"]).show('slow');
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
                alert('添加股票返回错误，找张帅问问');
                console.log(XMLHttpRequest.status);
                console.log(XMLHttpRequest.readyState);
                console.log(textStatus);
                $('#addNotice').hide().empty().append("添加失败，请尝试手动添加。").show('slow');
            }
        });
    });
}

// click or not
function pickADate() {
    alert('大盘最后更新时间。如遇异常有可能碰到夏令时或冬令时，请根据情况自行加减一小时。');
}

// send request to the server & get stock code list back
// sub-list's length = 800
function getStockList() {
    var url = "http://api.money.126.net/data/feed/";
    var stock_code_string = "";
    $.ajax({
        type: "POST",
        url: "php/GetStoreCodeArray.php",
        data: {request_stock_code_array: "1"},
        crossDomain: true,
        success: function(data_json_str) {
            var data_json_obj = eval("[" + data_json_str + "]");
            $(data_json_obj[0].sh).each(function(index, value) {
                stock_code_string += "0" + value + ",";
                if((index+1) % 800 == 0 || (index+1) == data_json_obj[0].sh.length) {
                    stock_url_list.push(url + stock_code_string + "money.api");
                    stock_code_string = "";
                }
            });
            $(data_json_obj[0].sz).each(function(index, value) {
                stock_code_string += "1" + value + ",";
                if((index+1) % 800 == 0 || (index+1) == data_json_obj[0].sz.length) {
                    stock_url_list.push(url + stock_code_string + "money.api");
                    stock_code_string = "";
                }
            });
            $.each(stock_url_list, function(index, value){
                getStockData(value, buy1StockTotal, sell1StockTotal);
                // console.log(value);
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            alert('股票数据返回错误，找张帅问问');
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
}

// // request stock data
// function requestStock(){
//     $.each(stock_url_list, function(index, value){
//         getStockData(value, buy1StockTotal, sell1StockTotal);
//         // console.log(value);
//     });
// }

// 获取涨停股及跌停股的数据
function getStockData(stockUrl, buy1StockTotal, sell1StockTotal){
    $.ajax({
        url: stockUrl,
        dataType: 'jsonp',
        crossDomain: true,
        async: false,
        success: function(data){
            for(index in data){
                thisBuy1StockData = new Array();
                thisSell1StockData = new Array();
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
            if(!isDateInit){
                isDateInit = true;
                for(i in data){
                    var initDate = data[i].time;
                    // console.log(data[i]);
                    var readableDateTime = initDate.replace('/', '-').replace('/', '-');//.replace(' ', '日 ');
                    var readableTimeArr = {
                        "hh":initDate.substr(11, 2),
                        "mm":initDate.substr(14, 2),
                        "ss":initDate.substr(17, 2)
                    };
                    $("#date").text(readableDateTime);
                    drawClock(readableTimeArr);
                    break;
                }
            }
            stockArrayCount++;
            // console.log("stockArraylength: " + stock_url_list.length);
            // console.log("stockUrlList:" + stock_url_list);
            if(stockArrayCount == stock_url_list.length) {
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

//更新表格中的行情数据
function tableMake(buy1StockTotal, sell1StockTotal) { 
    var tr_node, buy1_code, buy1_value, sell1_code, sell1_value;
    var tr_nodes = "";
    var input_data = "";
    if((buy1StockTotal != null && buy1StockTotal.length)
            || (sell1StockTotal != null && sell1StockTotal.length))
    {
        long_length = (buy1StockTotal.length>sell1StockTotal.length) ? buy1StockTotal.length : sell1StockTotal.length;
        for(var i=0; i<long_length; i++) {

            // Collect stock-id, stock-val for buying & selling stocks.
            if(buy1StockTotal[i] != null) {
                buy1_code = buy1StockTotal[i][0];
                buy1_value = buy1StockTotal[i][1];
                buy1_html_id = "<div class='col-md-3 stock-code'><a target='_blank' href='" + stock163Url + buy1_code + ".html'>" + buy1_code.substr(1) + "</a></div>";
                buy1_html_vol = "<div class='col-md-3 stock-value stock-buy'>" + buy1_value + "</div>";
                input_data += "<input name='buy1_stock_data[" + buy1_code.substr(1) + "]' value='" + buy1_value + "'/>";
            } else {
                buy1_code = "-1";
                buy1_value = "-1";
                buy1_html_id = "<div class='col-md-3 stock-code'>-1</div>";
                buy1_html_vol = "<div class='col-md-3 stock-value'>-1</div>";
                // input_data += "<input name='buy1_stock_data[" + buy1_code.substr(1) + "]' value='" + buy1_value + "'/>";
            }
            if(sell1StockTotal[i] != null) {
                sell1_code = sell1StockTotal[i][0];
                sell1_value = sell1StockTotal[i][1];
                sell1_html_id = "<div class='col-md-3 stock-code'><a target='_blank' href='" + stock163Url + sell1_code + ".html'>" + sell1_code.substr(1) + "</a></div>";
                sell1_html_vol = "<div class='col-md-3 stock-value stock-sell'>" + sell1_value + "</div>";
                input_data += "<input name='sell1_stock_data[" + sell1_code.substr(1) + "]' value='" + sell1_value + "'/>";
            } else {
                sell1_code = "-1";
                sell1_value = "-1";
                sell1_html_id = "<div class='col-md-3 stock-code'>-1</div>";
                sell1_html_vol = "<div class='col-md-3 stock-value'>-1</div>";
                // input_data += "<input name='sell1_stock_data[" + sell1_code.substr(1) + "]' value='" + sell1_value + "'/>";
            }

            // Add into a new tr node.
            tr_node = "<div class='row stockData'>" + buy1_html_id + buy1_html_vol + sell1_html_id + sell1_html_vol + "</div>";
            tr_nodes += tr_node;
        }
        $('#main_table').append(tr_nodes);
        $('#hidden_form form').append(input_data);
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
    var stock_date = $('#date').text();
    var this_date = new Date();
    this_date.setFullYear(
        stock_date.substr(0, 4),
        parseInt(stock_date.substr(5, 2)) - 1,
        stock_date.substr(8, 2)
    );
    date_file_name = stock_date.substr(0, 11) + getWeekDay(this_date);

    $('#form_date').val(date_file_name);
    $.post("php/StoreData.php", $('#hidden_form form').serialize(), function(result){
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
function getWeekDay(thisDate) {
  var weekDays = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
  return weekDays[thisDate.getDay()];
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

// Draw a clock
function drawClock(readableTimeArr) {

    hh = parseInt(readableTimeArr.hh.length ? readableTimeArr.hh : "0");
    mm = parseInt(readableTimeArr.mm.length ? readableTimeArr.mm : "0");
    ss = parseInt(readableTimeArr.ss.length ? readableTimeArr.ss : "0");
    var hours = (hh % 12) * 2 * Math.PI/12;
    var m = mm * 2 * Math.PI/60;
    var s = ss * Math.PI/60;

    // Ready to go.
    var deg = 2*Math.PI/12; 
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext("2d");

    ctx.save();
    ctx.fillStyle="#F1F1F1";
    ctx.fillRect(0,0,400,400);
    ctx.beginPath();
    ctx.moveTo(10,10);
    ctx.lineTo(400,10);
    ctx.lineTo(400,200);
    ctx.lineTo(10,200);
    ctx.closePath();
    var x=20;
    var y=20;
    var w=360;
    var h=360;
    var r=100;
    
    //圆角矩形
    ctx.save();
    ctx.shadowBlur=5;
    ctx.shadowColor="#656565";
    ctx.shadowOffsetX=0;
    ctx.shadowOffsetY=4;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    var f_jb = ctx.createRadialGradient(200,200,0,200,200,200);
    f_jb.addColorStop("0.5","#ffffff");
    f_jb.addColorStop("1","#ededed");
    ctx.strokeStyle="#f8f8f8";
    ctx.closePath();
    ctx.fillStyle=f_jb;
    ctx.stroke();
    ctx.fill();
    ctx.restore();
    
    //内阴影
    ctx.shadowBlur=8;
    ctx.shadowColor="#414141";
    ctx.shadowOffsetX=0;
    ctx.shadowOffsetY=-6;
    ctx.beginPath();
    ctx.moveTo(w+x,h-r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.lineWidth=1;
    var x_jb=ctx.createLinearGradient(0,300,0,360);
    x_jb.addColorStop("0","#c3b3b3");
    x_jb.addColorStop("1","#f2f2f2");
    ctx.strokeStyle=x_jb;
    ctx.lineCap="round";
    ctx.stroke();
    
    //内圆
    ctx.shadowBlur=10;
    ctx.shadowColor="#8f8f8f";
    ctx.shadowOffsetX=0;
    ctx.shadowOffsetY=0;
    ctx.strokeStyle="#ffffff";
    var yjb=ctx.createLinearGradient(0,0,0,150);
    yjb.addColorStop("0","#636363");
    yjb.addColorStop("1.0","#414141");
    ctx.beginPath();
    ctx.arc(200,200,150,0,2*Math.PI);
    ctx.stroke();
    ctx.fillStyle=yjb;
    ctx.fill();
    ctx.closePath();
    
    //圆内阴影
    ctx.globalAlpha=0.1;
    var yjb=ctx.createRadialGradient(200,200,0,200,200,200);
    yjb.addColorStop("0","#ffffff");
    yjb.addColorStop("1.0","#000000");
    ctx.beginPath();
    ctx.arc(200,200,150,0,2*Math.PI);
    ctx.stroke();
    ctx.fillStyle=yjb;
    ctx.fill();
    ctx.closePath();
    ctx.globalAlpha=1;
    
    //数字
    ctx.translate(200,200);
    ctx.beginPath();
    for(var i=1;i<13;i++) {
        var x1=Math.sin(i*deg);
        var y1=-Math.cos(i*deg);
        ctx.fillStyle="#fff";
        ctx.font="bold 20px Arial";
        ctx.textAlign='center';
        ctx.textBaseline='middle';
        ctx.fillText(i,x1*130,y1*130);    
    }
    ctx.restore();
    
    //转针开始
    ctx.strokeStyle="#f8f8f8";

    //时针
    x=-10;
    y=-70;
    w=20;
    h=80;
    r=10;
    //h + m/12 + s/720
    ctx.translate(200,200);
    ctx.save();
    ctx.rotate(hours + m/12 + s/720);
    ctx.shadowBlur=5;
    ctx.shadowColor="#313131";
    ctx.shadowOffsetX=2;
    ctx.shadowOffsetY=2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.stroke();
    ctx.closePath();
    ctx.fillStyle="#ffffff";
    ctx.fill();
    ctx.restore(); 
    
    //分针
    x=-10;
    y=-100;
    w=20;
    h=100;
    r=10;
    //ctx.translate(200,200);m+s/60
    ctx.save();
    ctx.rotate(m+s/60);
    ctx.shadowBlur=5;
    ctx.shadowColor="#313131";
    ctx.shadowOffsetX=2;
    ctx.shadowOffsetY=2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.stroke();
    ctx.closePath();
    ctx.fillStyle="#ffffff";
    ctx.fill();
    ctx.restore();
    
    //针上小圆
    ctx.save();
    ctx.shadowBlur=5;
    ctx.shadowColor="#313131";
    ctx.shadowOffsetX=0;
    ctx.shadowOffsetY=0;
    ctx.beginPath();
    ctx.arc(0,0,15,0,2*Math.PI);
    ctx.stroke();
    ctx.fillStyle="#fff";
    ctx.fill();
    ctx.closePath();
    ctx.restore();

    //秒针
    x=-30;
    y=-2;
    w=140;
    h=4;
    r=1;
    ctx.save();
    ctx.rotate(s);
    ctx.shadowBlur=5;
    ctx.shadowColor="#313131";
    ctx.shadowOffsetX=2;
    ctx.shadowOffsetY=2;
    ctx.beginPath();
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.stroke();
    ctx.closePath();
    ctx.fillStyle="#c15b4f";
    ctx.fill();
    ctx.restore();
    
    //小红圆
    ctx.save();
    ctx.shadowBlur=3;
    ctx.shadowColor="#313131";
    ctx.shadowOffsetX=2;
    ctx.shadowOffsetY=2;
    ctx.beginPath();
    ctx.arc(0,0,7,0,2*Math.PI);
    ctx.stroke();
    ctx.fillStyle="#c15b4f";
    ctx.fill();
    ctx.closePath();
    ctx.restore();

    ctx.restore();
    
    // setTimeout(drawClock,1000);
}