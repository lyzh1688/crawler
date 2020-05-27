const puppeteer = require('puppeteer');
var conf = require('./../config/config');
var pool = conf.pool;
var save = require('./../save/save')

;(async()=> {
    
    let browser = await puppeteer.launch({
        headless: false,
        executablePath: 'C://Users//Administrator//AppData//Local//Google//Chrome//Application//chrome.exe'
    })
	
	const page = await browser.newPage();
	
	page.setDefaultNavigationTimeout(0)
	
	await page.goto('https://www.qts-railway.com.cn:8443/procer/voluntarilylist.htm');
		await page.addScriptTag({path: 'D://项目//爬虫//crawler-script//jquery-3.2.1/jquery-3.2.1.min.js'})


  
	
	console.log('start');
	
	//1、设置页数，点击翻页
	//2、解析页面
	
	
	let pageNum = await queryPageNum(page)
	console.log('pageNum: ' + pageNum);

	for( var i = 0;i<692;i++){
		//console.log('page index: ' + i);
		let array = await parseUI(page);	
		
	 
	 
	  pool.getConnection(function (err, connection) {
                  save.qts({"connection": connection, "res": array}, function () {
                       console.log('insert success')
                    })
                })
		
	}
	
 

	console.log('end')
	//await browser.close();

})()
/**********************************
*    查询页数
***********************************/
async function queryPageNum(page) {
	
	return await page.evaluate(async ()=>{
		var pageNum = $('.datagrid-pager.pagination table tbody tr td').eq(7).find("span").text().replace('共','').replace('页','')	
		return pageNum;
	});
}


/**********************************
*    解析页面数据
***********************************/
async function parseUI(page) {
	let res;
	try{
	res = await page.evaluate(async ()=>{
		var items = []
		var tableArr = $(".datagrid-btable");
		var trLength = tableArr.find("tr").length;
		for( var i = 0;i<trLength;i++){	
			var tdArr = tableArr.find("tr").eq(i).find("td");
			if(tdArr.length < 9){
				continue;
			}
			var data = {}
			for( var j = 0;j<tdArr.length;j++){
				var td = tdArr.eq(j).find('div').find('div').text();
				if(j == 0){
					data.company = td
				}
				if(j == 1){
					data.prodType = td
				}
				if(j == 2){
					data.rule = td
				}
				if(j == 3){
					data.unit = td
				}
				if(j == 4){
					data.specs = td
				}
				if(j == 5){
					data.certificationID = td
				}
				if(j == 6){
					data.certDate = td
				}
				if(j == 7){
					data.expireDate = td
				}
				if(j == 8){
					data.status = td
				}
				if(j == 9){
					data.isCancled = td
				}
			}	
			items.push(data)			
			
		}
		
		$('.datagrid-pager.pagination table tbody tr td a')[2].click()
			
		console.log('click')
		
		return items;
	});
	}catch(err){
		console.log(err)
	}

	//console.log('result: ' + JSON.stringify(res))
	return res;
}
