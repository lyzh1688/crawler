const puppeteer = require('puppeteer');

;(async()=> {
    
    let browser = await puppeteer.launch({
        headless: false,
        executablePath: 'C://Program Files (x86)//Google//Chrome//Application//chrome.exe'
    })
	
	const page = await browser.newPage();
	
	await page.goto('http://jgjc.ndrc.gov.cn/list.aspx?clmId=708');
    //await page.waitForNavigation();


   // await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'})
	
	console.log('start');
	
    let res = await page.evaluate(async ()=>{
		var items = []
		var itemLength = document.querySelectorAll("table[class='list_02 clearfix']").length;
		console.log(itemLength)
		for( var i = 0;i<itemLength;i++){
			var url = document.querySelectorAll("table[class='list_02 clearfix'] li a")[i].href;
			items.push(url)
		}
		
		return items;
		
		
	});
    console.log(res);

	console.log('end')
	await browser.close();

})()


/**********************************
*    获取主页面的url
***********************************/
async function queryUrl(page) {

	let res = await page.$$eval('.list_02 clearfix li a.href',el => {
		console.log(el)
	
	for( var i = 0;i<el.length;i++){
		console.info(el[i])
	}
	
	})

}