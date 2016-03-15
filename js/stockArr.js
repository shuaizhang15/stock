// this list collects the request-url for all the stock
stock_url_list = new Array();

// the amount of zhangting stock and the amount of dieting stock
upCount = 0;
downCount = 0;

// the state of initillization of date value.
isDateInit = false;
initDate = "";

// API url from Baidu / 126 money
stockUrl = "";

// the length of the sub-arraies within all the stock code and which have been processed
stockArrayLength = 0;
stockArrayCount = 0;

// buy1 data | buy1StockTotal[i][0] = stock_code | buy1StockTotal[i][1] = buy1_val
buy1StockTotal = new Array();

// sell1 data | sell1StockTotal[i][0] = stock_code | sell1StockTotal[i][1] = sell1_val
sell1StockTotal = new Array();

// stock 163 url
stock163Url = "http://quotes.money.163.com/";

// the main array of all the stock code which has been collected
allArr = new Array();
