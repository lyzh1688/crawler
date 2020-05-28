const puppeteer = require('puppeteer');
var conf = require('./../config/config');
var pool = conf.pool;
var save = require('./../save/save')

;(async()=> {
    
   // let browser = await puppeteer.launch({
   //     headless: false,
   //     executablePath: '/opt/haier/crawler-script/node_modules/_puppeteer@3.1.0@puppeteer/.local-chromium/linux-756035/chrome-linux/chrome'
   // })
	
	  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
	const page = await browser.newPage();
	page.setDefaultNavigationTimeout(0)
	
    	await page.addScriptTag({path: '/opt/haier/crawler-script/jquery-3.2.1/jquery-3.2.1.min.js'})
	
	
	console.log('start');
	
	//提供所有的页码
	//for( var i = 0;i<16;i++){	
	let array =	await queryPage(page,0)
		pool.getConnection(function (err, connection) {
                    save.jgjc({"connection": connection, "res": array}, function () {
                        console.log('insert jgjc success')
                    })
                })
	//}

	console.log('end')
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
				tmpData.data_date = data_date
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
				
				data.raw_price = raw_price
				data.fodder_price = fodder_price
				data.rate = rate
				data.balance = balance
				data.profit_count = profit_count
				if(data_date.charAt(0) == '本'){
					data.stat_type = 'curWeek'
				}
				if(data_date.charAt(0) == '上'){
					data.stat_type = 'lastWeek'
				}
				if(data_date.charAt(0) == '环'){
					data.stat_type = 'mom'
				}
			}
			items.push(data)
		}
		return items;
	});
	}catch(err){
		console.log(err)
	}

	console.log('result: ' + JSON.stringify(res))
	return res;
}



















