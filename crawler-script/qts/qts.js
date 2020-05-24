const puppeteer = require('puppeteer');

;(async()=> {
    
    let browser = await puppeteer.launch({
        headless: false,
        executablePath: 'C://Users//Administrator//AppData//Local//Google//Chrome//Application//chrome.exe'
    })
	
	const page = await browser.newPage();
	
	page.setDefaultNavigationTimeout(0)
	
	await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'})
	  
	//await page.goto('https://www.qts-railway.com.cn:8443/procer/voluntarilylist.htm');


  
	
	console.log('start');
	
	//1、设置页数，点击翻页
	//2、解析页面
	
	//let val = $(".pagination-num").val(10);
	//await page.keyboard.press('Enter');
	await queryPageUrlPost(page,'https://www.qts-railway.com.cn:8443/procer/voluntarilylist.htm');
	
	
 

	console.log('end')
	//await browser.close();

})()
/**********************************
*    翻页
***********************************/
async function queryPageUrl(page) {
	
	return await page.evaluate(async ()=>{
		var itemLength = $('.datagrid-pager.pagination table tbody tr td').length;
		console.log(itemLength)
		var tdUrl = $('.datagrid-pager.pagination table tbody tr td').eq[8]
		for( var i = 0;i<itemLength;i++){
			console.log('--------: ' + JSON.stringify($('.datagrid-pager.pagination table tbody tr td').eq[i]))
		}
		console.log('url: ' + JSON.stringify(tdUrl))
		
		var s = $('.l-btn.l-btn-small.l-btn-plain');
		console.log('sssssssssss: ' + JSON.stringify(s))
		return tdUrl;
	});
}

async function queryPageUrlPost(page,url) {
	await page.setRequestInterception(true);
    page.once('request', interceptedRequest => {

        var data = {
            'method': 'POST',
            'postData': 'page=691&rows=20&sort=SN&order=asc'
        };

        interceptedRequest.continue(data);
		page.setRequestInterception(false);
    });
    const response = await page.goto('https://www.qts-railway.com.cn:8443/procer/voluntarilydata.html');     
    let responseBody = await response.text();
	console.log('responseBody: ' + responseBody)
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
		return items;
	});
	}catch(err){
		console.log(err)
	}

	console.log('result: ' + JSON.stringify(res))
	return res;
}
