const puppeteer = require('puppeteer');
var conf = require('./../config/config');
var pool = conf.pool;
var save = require('./../save/save')

;(async()=> {
    
   // let browser = await puppeteer.launch({
    //    headless: false,
    //   executablePath: '/opt/haier/crawler-script/node_modules/_puppeteer@3.1.0@puppeteer/.local-chromium/linux-756035/chrome-linux/chrome'
    //})
	  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});

	
	const page = await browser.newPage();
	page.setDefaultNavigationTimeout(0)
	
	console.log('start ； ' + new Date());
	
	let startLog = []
			let log = {}
			log.crawler_type = 'pigIndex-his';
			log.step = 'start';
			log.message = 'start crawler pigIndex-his';
			startLog.push(log)
			pool.getConnection(function (err, connection) {
							save.log({"connection": connection, "res": startLog}, function () {
								console.log('start insert pigIndex-his log success')
							})
						})
	
	
	for( var id = 0;id<8;id++){
	 let array =　await queryPageUrlPost(page,id);
	  pool.getConnection(function (err, connection) {
                    save.pigIndex({"connection": connection, "res": array}, function () {
                        console.log('insert success')
                    })
                })
	 
	 
	}
	
		let endLog = []
		log.step = 'end';
		log.message = 'end crawler  pigIndex-his' + companyNameList[z];
		endLog.push(log)
		pool.getConnection(function (err, connection) {
						save.log({"connection": connection, "res": endLog}, function () {
							console.log('end insert pigIndex-his log success')
						})
					})

	console.log('end ； ' + new Date());
	await browser.close();

})()

async function queryPageUrlPost(page,id) {
	
		console.log("id:  " + id)

		let body = await page.goto('https://hqb.nxin.com/pigindex/getPigIndexChart.shtml?regionId=' + id);

			await page.addScriptTag({path: '/opt/haier/crawler-script/jquery-3.2.1/jquery-3.2.1.min.js'})
		
				
			
		let array = await page.evaluate(async ()=>{
			
				
			var res = jQuery.parseJSON($("body").text());
					
			if(res.data == null || res.data.length == 0 || res.data == undefined ){
			console.log('没有数据')
			return;
			}
			let rst = [];

			for( var i = 0;i<res.data.length;i++){	
		
			if(i==0){
				continue;
			}
			let data = {}
			let tmpData = res.data[i];
			
			
			
				
			data.index = tmpData[1]
				
			//data.change_rate = ((tmpData[1] - res.data[i-1][1])/res.data[i-1][1]).toFixed(3)
				
			//data.change = (tmpData[1]- res.data[i-1][1]).toFixed(3)
				
			data.name = name
				
			data.booking_price = tmpData[5] + '元/公斤'
				
			data.trade_price = tmpData[6] + '元/公斤'
				
			if(tmpData.length==8){
				data.avg_trade_weight = tmpData[7] + 'kg'
			}else{
				data.avg_trade_weight = '--'
			}
				
				
			
			
			var datetimeType = "";  
		    var date = new Date();  
		    date.setTime(tmpData[0]);  
		  
			var month = "";  
		    month = date.getMonth() + 1;   
		    if(month<10){  
		        month = "0" + month;  
		    }  
			var day = "";  
		    day = date.getDate();  
		    if(day<10){  
		        day = "0" + day;  
		    }  
			datetimeType+= date.getFullYear();   //年  
		    datetimeType+= month; //月   
		    datetimeType+= day;   //日  
			data.data_date = datetimeType
		
			rst.push(data)
			
		}

		return rst;
		});
		
		
		for( var i = 0;i<array.length;i++){
			if(id == 0){
				array[i].region = '全国'
			}
			if(id == 1){
				array[i].region = '东北地区'
			}
			if(id == 2){
				array[i].region = '华北地区'
			}
			if(id == 3){
				array[i].region = '西北地区'
			}
			if(id == 4){
				array[i].region = '华中地区'
			}
			if(id == 5){
				array[i].region = '华东地区'
			}
			if(id == 6){
				array[i].region = '华南地区'
			}
			if(id == 7){
				array[i].region = '西南地区'
			}
		
		}
		
		console.log(JSON.stringify(array))
		
		return array;
		
		
		
		
		
}
