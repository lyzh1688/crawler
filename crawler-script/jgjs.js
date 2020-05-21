const puppeteer = require('puppeteer');

;(async()=> {
    
    let browser = await puppeteer.launch({
        headless: false,
        executablePath: 'C://Users//Administrator//AppData//Local//Google//Chrome//Application//chrome.exe'
    })
	
	const page = await browser.newPage();
	
	await page.goto('http://jgjc.ndrc.gov.cn/list.aspx?clmId=708');
    //await page.waitForNavigation();


    await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'})
	
	console.log('start');
	
	let urlItems = await queryUrl(page);
	
	
	//for( var i = 0;i<urlItems.length;i++){	
	await gotoUrl(page,urlItems[0]);
	//}
	
    
    console.log(urlItems);

	console.log('end')
	//await browser.close();

})()


/**********************************
*    获取主页面的url
***********************************/
async function queryUrl(page) {

	let res = await page.evaluate(async ()=>{
		var items = []
		var itemLength = $('.list_02.clearfix li a').length;
		for( var i = 0;i<itemLength;i++){			
			var url = $('.list_02.clearfix li a')[i].href;
			items.push(url)
		}
		
		return items;
	});
	return res;
}


/**********************************
*    解析主页面跳转的页面
***********************************/
async function gotoUrl(page,url) {
	console.log(url)
	let res;
	try{
	await page.goto(url); 
	 res = await page.evaluate(async ()=>{
		var items = []
		var tableArr = $("table");
		for( var i = 0;i<tableArr.length;i++){
			var data = {};
			var date = {};
			
			if(i == 0){
				data.pork = date
			}
			if(i == 1){
				data.chicken = date
			}
			if(i == 2){
				data.egg = date
			}
			var tdLength = $("table").eq(i).find("tr").length;
			console.log('-----' + tdLength)
			for( var j = 0;j<tdLength;j++){	
				var tr = $("table").eq(i).find("tr");
				var tdArr = tr.eq(j);
				var price = {};
				var data_date = tdArr.find("td").eq(0).find('p').find('span').text();
				console.log('-----' + data_date)
				if(data_date == '日期'){
					continue;
				}
				
				if(data_date == '本周'){
					date.curWeek = price
				}
				if(data_date == '上周'){
					date.lastWeek = price
				}
				if(data_date == '环比'){
					date.mom = price
				}
				
				
				
				var raw_price = tdArr.find("td").eq(1).find('p').find('span').text();//活禽价格
				var fodder_price = tdArr.find("td").eq(2).find('p').find('span').text();//饲料价格
				var rate = tdArr.find("td").eq(3).find('p').find('span').text();//猪料比价
				var balance = tdArr.find("td").eq(4).find('p').find('span').text();//猪料比价平衡点
				var profit_count = tdArr.find("td").eq(5).find('p').find('span').text();//预期盈利
				
				price.raw_price = raw_price
				price.fodder_price = fodder_price
				price.rate = rate
				price.balance = balance
				price.profit_count = profit_count
				items.push(data)
			}
			
		}
	
		
		return items;
	});
	}catch(err){
		console.log(err)
	}

	console.log(JSON.stringify(res))
}



















