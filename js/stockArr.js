// the amount of zhangting stock
upCount = 0;

// the amount of dieting stock
downCount = 0;

// API url from Baidu / 126 money
stockUrl = "";

// the length of the sub-arraies within all the stock code
stockArrayLength = 0;

// the counts of the sub-arraies which has been processed
stockArrayCount = 0;

// buy1 data | buy1StockTotal[i][0] = stock_code | buy1StockTotal[i][1] = buy1_val
buy1StockTotal = new Array();

// sell1 data | sell1StockTotal[i][0] = stock_code | sell1StockTotal[i][1] = sell1_val
sell1StockTotal = new Array();

// stock 163 url
stock163Url = "http://quotes.money.163.com/";

// the main array of all the stock code which has been collected
allArr = new Array();

// the array collecting all the sub-array of the stock code - length <= 800
allStockCodeArray = new Array();