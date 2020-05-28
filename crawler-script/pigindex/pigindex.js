const puppeteer = require('puppeteer');
var conf = require('./../config/config');
var pool = conf.pool;
var save = require('./../save/save')

;(async()=> {
    
   // let browser = await puppeteer.launch({
   //     headless: false,
    //    executablePath: '/opt/haier/crawler-script/node_modules/_puppeteer@3.1.0@puppeteer/.local-chromium/linux-756035/chrome-linux/chrome'
   // })
     const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});

	
	const page = await browser.newPage();
	page.setDefaultNavigationTimeout(0)
	
	
	console.log('start')
	
	let array = []
	for( var id = 0;id<8;id++){
	 let data =await queryPageUrlPost(page,id);
	 
	 array.push(data)
	 
	 
	 
	  pool.getConnection(function (err, connection) {
                    save.pigIndex({"connection": connection, "res": array}, function () {
                       console.log('insert success')
                    })
                })
	 
	 
	}
	
	console.log('array: ' + JSON.stringify(array))

	console.log('end')
	await browser.close();

})()

async function queryPageUrlPost(page,id) {
	
		console.log("id:  " + id)

		let body = await page.goto('https://hqb.nxin.com/pigindex/getPigIndex.shtml?regionId=' + id);
			await page.addScriptTag({path: '/opt/haier/crawler-script/jquery-3.2.1/jquery-3.2.1.min.js'})
		
		
				
		let data = await page.evaluate(async ()=>{
			let data = {}
			
			var dateData =  $(".f18.white.arial.p_sj.fl").text();			
			var dateDataHtml =  $(".f18.white.arial.p_sj.fl").html()
			var y=dateDataHtml.indexOf('>'); 
			var date = dateDataHtml.substr(y + 1,12).replace('-','').replace('-','')
			
			
			console.log('dateData: ' + date)
			data.data_date = date
			
			
			var indexData =  $(".f72.red.clear").text();			
			var indexDataHtml =  $(".f72.red.clear").html()
			
			if(indexDataHtml == undefined){
				indexDataHtml = $(".f72.green.clear").html()
			}
			
			console.log('indexDataHtml: ' + indexDataHtml)
			
			var x=indexDataHtml.indexOf('<'); 
			var inx = indexDataHtml.substr(0,15)
			var index = inx.substr(9,inx.length)
			
			
			console.log('index: ' + index)
			
			var changeData = $(".f18.fr.s_zs p");
			data.index = index
			data.change = changeData.eq(0).html();
			data.change_rate = changeData.eq(1).html();
			
				var td0 = $("table").find("tr").find("td").eq(0).find("p").eq(1).text();
				var td1 = $("table").find("tr").find("td").eq(1).find("p").eq(1).text();
				var td2 = $("table").find("tr").find("td").eq(2).find("p").eq(1).text();
				var td3 = $("table").find("tr").find("td").eq(3).find("p").eq(1).text();
				data.booking_price = td1
				data.trade_price = td2
				data.avg_trade_weight = td3
				
						console.log('td: ' + td0)
						console.log('td: ' + td1)
						console.log('td: ' + td2)
						console.log('td: ' + td3)
						
				var region = $(".change_area span").text().replace('（','').replace('）','');			
				data.region = region
			
			console.log('data: ' + JSON.stringify(data))
			
					return data;
					
		})
				return data	
					
					
				
		
		
		
		
}
