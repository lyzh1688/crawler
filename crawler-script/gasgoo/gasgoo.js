const puppeteer = require('puppeteer');
var conf = require('./../config/config');
var pool = conf.pool;
var save = require('./../save/save');

(async () => {  

    //const browser = await puppeteer.launch({
    //    executablePath: '/opt/haier/crawler-script/node_modules/_puppeteer@3.1.0@puppeteer/.local-chromium/linux-756035/chrome-linux/chrome',
    //    headless: false
    //  });
	
	  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});




let companyNameList = ['特斯拉','大众','一汽解放','中国重汽','东风商用车'];

let pageList = [10,100,500,1000,10000];


	const page = await browser.newPage()  
		await page.addScriptTag({path: '/opt/haier/crawler-script/jquery-3.2.1/jquery-3.2.1.min.js'})
		await page.goto('http://i.gasgoo.com/login.aspx?return=http://i.gasgoo.com/');  

		/***********************************
		*    登录
		***********************************/
		await login(page);
		await page.waitFor(4000);
		

for(var z=0;z<companyNameList.length;z++){

	try{

	
		let maxPageNum = 0;
		for(var a=0;a<pageList.length;a++){
			
			maxPageNum = await getPageNum(page,companyNameList[z],pageList[a])
			
			if(maxPageNum == null){
				continue; 
			}else{
				break;
			}
			
		}
		
		console.log("companyName: " + companyNameList[z] + "  " + maxPageNum)
		
		
		
		/***********************************
		*    获取所有分页的url
		***********************************/
		var baseUrl = "http://i.gasgoo.com/supplier/search.aspx?skey=&tc="+companyNameList[z]+"&export=-1&page=";
		
		var urlList = new Array();
		for(var i=1;i<=maxPageNum;i++){
			console.log("maxPageNum: " + maxPageNum + " i: " + i);
			urlList.push(baseUrl+i);
		}
		
		console.log(urlList);

		/**********************************
		*    获取每个分页的公司列表及详情url
		***********************************/
		let totalCompanyList = new Array();
		for(var k=0;k<urlList.length;k++){
			let companyList = await getCompanyListByUrl(page,urlList[k]);
			//console.log(companyList);
			totalCompanyList= totalCompanyList.concat(companyList);
		}
		/***********************************
		*    退出登录
		************************************/
		//await page.goto('http://i.gasgoo.com/logout.aspx');
		/***********************************
		*    获取每个公司详情
		************************************/
		console.log("==================company size============="+totalCompanyList.length);

		const companySearchResultObjectList = new Array();
		for(var n=0;n<totalCompanyList.length;n++){
			let companyBrief = totalCompanyList[n].split("####@@@@")[0];
			let companyUrl = totalCompanyList[n].split("####@@@@")[1];
			let businessInfo = await getCompanyBusinessInfo(page,companyUrl);
			let array = []
			
			for(var p=0;p<businessInfo.attr.length;p++){
				let item = {}
				item.search_target = companyNameList[z]
				item.company = businessInfo.company
				item.attribute =  businessInfo.attr[p].key
				item.attr_value =  businessInfo.attr[p].value
				array.push(item)
			}
			
			
			
			
			await  pool.getConnection(function (err, connection) {
                  save.gasgoo({"connection": connection, "res": array}, function () {
                       console.log('insert success')
                    })
                })
		
			//console.log(businessInfo);
		}

		
	}catch(err){
	  console.log(err)
	  console.log(err.message);
	}

}


/***********************************
*    登录
***********************************/
async function login(page){

	page.evaluate(async ()=>{
		document.querySelector("#loginUser").click();
		//document.querySelector("#txtUserName").value="13818254058";
		//document.querySelector("#txtPassword").value="qwer1234";

		// document.querySelector("#txtUserName").value="18016224617";
		// document.querySelector("#txtPassword").value="lyzh1688";


		document.querySelector("#txtUserName").value="19145525646";
		document.querySelector("#txtPassword").value="y2iaciej";

		// document.querySelector("#txtUserName").value="13020239152";
		// document.querySelector("#txtPassword").value="Deng6028784";
		document.querySelector("#btnLogin").click();	
	});
}

/***********************************
*    获取配套企业页数
***********************************/
async function getPageNum(page,companyName,pageNum){
	await page.goto("http://i.gasgoo.com/supplier/search.aspx?skey=&tc="+companyName+"&export=-1&page=" + pageNum);
	let maxPageNum = page.evaluate(async ()=>{
		let next = $('.next').text()
		
		if( next == '>>' ){
			return null;
		}
		
		return  $('.current').text();
				
	})
	return maxPageNum;
}	


/***********************************
*    获取所有分页的url
***********************************/
async function getUrlByCompany(page,companyName,maxPageNum){
	await page.goto("http://i.gasgoo.com/supplier/search.aspx?skey=&tc="+companyName+"&export=-1");

	let resultList = page.evaluate(async (companyName,maxPageNum)=>{
		var baseUrl = "http://i.gasgoo.com/supplier/search.aspx?skey=&tc="+companyName+"&export=-1&page=";
		
		var urlList = new Array();
		for(var i=1;i<maxPageNum+1;i++){
			urlList.push(baseUrl+i);
		}
		//console.log(urlList);	
		return urlList;	
	},companyName);
	//console.log(resultList);
	return resultList;

}

/**********************************
*    获取每个分页的公司列表及详情url
***********************************/
async function getCompanyListByUrl(page,url){
	await page.goto(url);
	const companyResultList=page.evaluate(async ()=>{
		var companyList = new Array(); 
		//获取当前页所有公司的列表
		var companyListLength = document.querySelectorAll("table[class='neiwid']").length;
		//console.log("判断当前页所有公司的列表"+companyListLength);
		for(var j=0;j<companyListLength;j++){
			companyList.push(document.querySelectorAll("table[class='neiwid']")[j].innerText+"####@@@@"+document.querySelectorAll("table[class='neiwid'] a")[j].href);
		}
		//console.log(companyList);
		return companyList;
	});
	//console.log(companyResultList);
	return companyResultList;
}

/***********************************
*    获取每个公司详情
************************************/
async function getCompanyBusinessInfo(page,url){

	await page.goto(url);
	const businessInfo=page.evaluate(async ()=>{
		let businessInfo = {};
		let atts = [];
		let company = $(".companyName").eq(0).text();
		let idx = company.indexOf(':');
		let companyName = company.substr(idx+1,company.length)
		
		
		let trLength = $(".newBussiness").eq(0).find("table tbody tr").length
		console.log("trLength: " + trLength);
		for(var i=0;i<trLength;i++){
			
			let tdLength =  $(".newBussiness").eq(0).find("table tbody tr").eq(i).find("td").length;
			let halfTdLength = tdLength/2;
			for(var j=0;j<halfTdLength;j++){
				let attr = {}
				let ix = j*2;
				let tdKey = $(".newBussiness").eq(0).find("table tbody tr").eq(i).find("td").eq(ix).text();
				let tdValue =  $(".newBussiness").eq(0).find("table tbody tr").eq(i).find("td").eq(ix + 1).text();
				attr.key = tdKey;
				attr.value = tdValue;
				atts.push(attr)
			}


			
			
		}
		
		businessInfo.company = companyName;
		businessInfo.attr = atts;
		
		console.log("businessInfo: " + JSON.stringify(businessInfo))
		
		
		
		return  businessInfo;		
	});

	//console.log(businessInfo);
	return businessInfo;

}
//await page.waitFor(1000);
//browser.close();
})();