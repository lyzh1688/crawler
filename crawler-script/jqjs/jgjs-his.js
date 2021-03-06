const puppeteer = require('puppeteer');
var conf = require('./../config/config');
var pool = conf.pool;
var save = require('./../save/save')

;(async()=> {
    
   // let browser = await puppeteer.launch({
    //    headless: false,
    //    executablePath: '/opt/haier/crawler-script/node_modules/_puppeteer@3.1.0@puppeteer/.local-chromium/linux-756035/chrome-linux/chrome'
    //})
	
	  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
	
	const page = await browser.newPage();
	page.setDefaultNavigationTimeout(0)
	
   	await page.addScriptTag({path: '/opt/haier/crawler-script/jquery-3.2.1/jquery-3.2.1.min.js'})
	
	
	
	console.log('start ； ' + new Date());
	
	let startLog = []
	let log = {}
	log.crawler_type = 'jgjc-his';
	log.step = 'start';
	log.message = 'start crawler jgjc-his';
	startLog.push(log)
	pool.getConnection(function (err, connection) {
                    save.log({"connection": connection, "res": startLog}, function () {
                        console.log('start insert jgjc-his log success')
                    })
                })
	
	
	//提供所有的页码
	for( var i = 0;i<16;i++){	
	let array =	await queryPage(page,0)
		pool.getConnection(function (err, connection) {
                    save.jgjc({"connection": connection, "res": array}, function () {
                        console.log('insert jgjc success')
                    })
                })
	}

	let endLog = []
	log.step = 'end';
	log.message = 'end crawler jgjc-his';
	endLog.push(log)
	pool.getConnection(function (err, connection) {
                    save.log({"connection": connection, "res": endLog}, function () {
                        console.log('end insert jgjc-his log success')
                    })
                })
	
	console.log('end: ' + new Date());
	await browser.close();

})()


async function queryPage(page,j) {
		await page.goto('http://jgjc.ndrc.gov.cn/list.aspx?clmId=708&page=' + j);
		let urlItems = await queryUrl(page);
		let dataList = []
		for( var i = 0;i<urlItems.length;i++){		
			let data=await parsePriceDetail(page,urlItems[i].url);
			let data_date = urlItems[i].date;
			console.log('data_date: ' + data_date)
			
			for( var k = 0;k<data.length;k++){
				let tmpData = data[k];
				tmpData.release_date = data_date
				dataList.push(tmpData)
				console.log('data: ' + JSON.stringify(tmpData))
			}
			
		}
		
		return dataList;
		
}


/**********************************
*    获取主页面的url
***********************************/
async function queryUrl(page) {

	let res = await page.evaluate(async ()=>{
		var items = []
		var itemLength = $('.list_02.clearfix li a').length;
		for( var i = 0;i<itemLength;i++){
			var param = {};
			var url = $('.list_02.clearfix li a')[i].href;
			var font = $('.list_02.clearfix li font').eq(i).text();
			param.url = url;
			param.date = font.replace(/\-/g, "");
			items.push(param)
		}
		
		return items;
	});
	return res;
}


/**********************************
*    解析主页面跳转的页面
***********************************/
async function parsePriceDetail(page,url) {
	console.log(url)
	let res;
	try{
	await page.goto(url); 
	res = await page.evaluate(async ()=>{
		
		let div = $('#zoom');
		
		let p = $('#zoom div p')
		var dataDate =''
		for( var k = 0;k<p.length;k++){	
			var text = $('#zoom div p').eq(k).text();
			var date = new Date(); 
			var year = date.getFullYear();
			var startText = text.substring(0,4)
			if(startText == year){
				//2020年5月20日
				var yearIndex = text.indexOf('年');
				var monthIndex = text.indexOf('月');
				var dayIndex = text.indexOf('日');
				var tmpyear = text.substring(0,yearIndex)
				var tmpmonth = text.substring(yearIndex +1 ,monthIndex)
				if(tmpmonth.length < 2){
					tmpmonth = '0' + tmpmonth;
				}
				var tmpday = text.substring(monthIndex+1,dayIndex)
				if(tmpday.length < 2){
					tmpday = '0' + tmpday;
				}
				
				dataDate =tmpyear + tmpmonth + 	tmpday
							
			}
			
		}
		
		
	//	console.log("dataDate: " + dataDate)
		
		
		
		var items = []
		var tableArr = $("table");
		for( var i = 0;i<tableArr.length;i++){
			var data = {};
			if(i == 0){
				data.product_type = 'pork'
			}
			if(i == 1){
				data.product_type = 'chicken'
			}
			if(i == 2){
				data.product_type = 'egg'
			}
			var tdLength = $("table").eq(i).find("tr").length;
			for( var j = 0;j<tdLength;j++){	
			
			var statData = {};
			statData.product_type = data.product_type
				var tr = $("table").eq(i).find("tr");
				var tdArr = tr.eq(j);
				
				var data_date = tdArr.find("td").eq(0).find('p').find('span').text();
				if(data_date.charAt(0) == '日'){
					continue;
				}				
				var raw_price = tdArr.find("td").eq(1).find('p').find('span').text();//活禽价格
				var fodder_price = tdArr.find("td").eq(2).find('p').find('span').text();//饲料价格
				var rate = tdArr.find("td").eq(3).find('p').find('span').text();//猪料比价
				var balance = tdArr.find("td").eq(4).find('p').find('span').text();//猪料比价平衡点
				var profit_count = tdArr.find("td").eq(5).find('p').find('span').text();//预期盈利
				
				statData.raw_price = raw_price
				statData.fodder_price = fodder_price
				statData.rate = rate
				statData.balance = balance
				statData.profit_count = profit_count
				if(data_date.charAt(0) == '本'){
					statData.stat_type = 'curWeek'
				}
				if(data_date.charAt(0) == '上'){
					statData.stat_type = 'lastWeek'
				}
				if(data_date.charAt(0) == '环'){
					statData.stat_type = 'mom'
				}
				
				statData.data_date = dataDate
				items.push(statData)
			}
			
		}
		return items;
	});
	}catch(err){
		console.log(err)
	}

	//console.log('result: ' + JSON.stringify(res))
	return res;
}

















