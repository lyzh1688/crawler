const puppeteer = require('puppeteer');
var conf = require('./../config/config');
var pool = conf.pool;
var save = require('./../save/save');

(async () => {  

   const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});


let companyNameList = ['吉利','长城','奇瑞'];

let pageList = [10,100,500,1000,10000];

const page = await browser.newPage()  
		await page.addScriptTag({path: '/opt/haier/crawler-script/jquery-3.2.1/jquery-3.2.1.min.js'})
		

		
		

	for(var z=0;z<companyNameList.length;z++){

		try{
			
			
			let startLog = []
			let log = {}
			log.crawler_type = 'gasgoo-4';
			log.step = 'start';
			log.message = 'start crawler gasgoo-4' + companyNameList[z];
			startLog.push(log)
			pool.getConnection(function (err, connection) {
							save.log({"connection": connection, "res": startLog}, function () {
								console.log('start insert gasgoo-4 log success')
							})
						})
			

			/***********************************
				*    登录
			***********************************/
			await page.goto('http://i.gasgoo.com/login.aspx?return=http://i.gasgoo.com/');  
			await login(page);
			await page.waitFor(5000);
	
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
		
		//let urlPartLength = urlList.length/5;
		let urlPartLength = (urlList.length % 5 == 0) ? (urlList.length / 5) : (urlList.length / 5 + 1);
		
		
		for(var u=0;u<urlPartLength;u++){
			console.log('urlPartLength: ' +urlPartLength);
			let partStart = u*5;
			let partEnd = (u + 1)*5;
			if(partEnd > urlList.length){
				partEnd = urlList.length
			}
			
			for(var k=partStart;k<partEnd;k++){
				console.log('K: ' + k + " urlList[k]: " + urlList[k]);
			let companyList = await getCompanyListByUrl(page,urlList[k]);
				
				totalCompanyList= totalCompanyList.concat(companyList);
			}
									
			/***********************************
			*    退出登录
			************************************/
			await page.goto('http://i.gasgoo.com/logout.aspx');
			
			/***********************************
					*    登录
					***********************************/
					
					//page = await browser.newPage()  
			await page.goto('http://i.gasgoo.com/login.aspx?return=http://i.gasgoo.com/');  

			/***********************************
				*    登录
			***********************************/
			await login(page);
			await page.waitFor(4000);
	
		}
		
		/***********************************
		*    退出登录
		************************************/
		await page.goto('http://i.gasgoo.com/logout.aspx');
		
		
		/***********************************
		
		*    获取每个公司详情
		************************************/
		console.log("==================company size============="+totalCompanyList.length);

		const companySearchResultObjectList = new Array();
		
			
		
		for(var w=0;w<totalCompanyList.length;w++){
			
			
				
				
				let companyBrief = totalCompanyList[w].split("####@@@@")[0];
				let companyUrl = totalCompanyList[w].split("####@@@@")[1];
				let businessInfo = await getCompanyBusinessInfo(page,companyUrl);
				if(businessInfo == null){
					console.log("businessInfo: " + businessInfo)
					continue
				}
				
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
				console.log("totalCompanyList.length : " + totalCompanyList.length + " w: " + w )
				console.log("totalCompanyList[w] : " + totalCompanyList[w])
				console.log(businessInfo);
				
			
			
			
		}
		
		
		let endLog = []
		log.step = 'end';
		log.message = 'end crawler  gasgoo-4' + companyNameList[z];
		endLog.push(log)
		pool.getConnection(function (err, connection) {
						save.log({"connection": connection, "res": endLog}, function () {
							console.log('end insert gasgoo-4 log success')
						})
					})
		
		
		

		
	}catch(err){
	  console.log(err)
	  console.log(err.message);
	  await browser.close();
	}
}


/***********************************
*    登录
***********************************/
async function login(page){

	page.evaluate(async ()=>{
		
		var date=new Date();
                date.setTime(date.getTime()-10000);
                var keys=document.cookie.match(/[^ =;]+(?=\=)/g);
                console.log("需要删除的cookie名字："+keys);
                if (keys) {
                    for (var i =  keys.length; i--;)
                      document.cookie=keys[i]+"=0; expire="+date.toGMTString()+"; path=/";
                }
		
		document.querySelector("#loginUser").click();
		
		//document.querySelector("#txtUserName").value="17502172636";
		//document.querySelector("#txtPassword").value="Deng6028784";

		//document.querySelector("#txtUserName").value="13818254058";
		//document.querySelector("#txtPassword").value="qwer1234";


		// document.querySelector("#txtUserName").value="18016224617";
		// document.querySelector("#txtPassword").value="lyzh1688";


		//document.querySelector("#txtUserName").value="19145525646";
		//document.querySelector("#txtPassword").value="y2iaciej";

		 document.querySelector("#txtUserName").value="13020239152";
		 document.querySelector("#txtPassword").value="Deng6028784";
		
		
		
		
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
	await page.waitFor(5000);
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
	
	//await page.waitForNavigation()
	let companyResultList = []
	try{
	await page.goto(url);
	await page.waitFor(5000);
	companyResultList=page.evaluate(async ()=>{
		
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
	}catch(err){
		console.log(err);
		return new Array();
	}
	//console.log(companyResultList);
	return companyResultList;
}

/***********************************
*    获取每个公司详情
************************************/
async function getCompanyBusinessInfo(page,url){
	let businessInfo = ''
	try{
		await page.goto(url);
		//await page.waitForNavigation(0);
		await page.waitFor(5000);
		businessInfo=page.evaluate(async ()=>{
		let businessInfo = {};
		try{
				
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
		
		}catch(err){
			console.log('err: ' + err)
			return null
		}
		
		return  businessInfo;		
	});
}
	catch(err){
		console.log(err);
		return null
	}

	//console.log(businessInfo);
	return businessInfo;

}
await page.waitFor(1000);
browser.close();
})();