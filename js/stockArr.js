upCount = 0;
downCount = 0;
stockUrl = "";
stockArrayLength = 0;
stockArrayCount = 0;

/* 
 * 涨停股列表
 * buy1StockTotal[i][0]股票代码
 * buy1StockTotal[i][1]买一库存量
 * 跌停股列表
 * sell1StockTotal[i][0]股票代码
 * sell1StockTotal[i][1]卖一库存量
 */
buy1StockTotal = new Array();
sell1StockTotal = new Array();

// stock 163 url
stock163Url = "http://quotes.money.163.com/";

// 沪深股列表
allArr = new Array();

// 沪深股列表列表 - 每个列表的长度小于800
allStockCodeArray = new Array();