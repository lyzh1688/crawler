const puppeteer = require('puppeteer');
var conf = require('./../config/config');
var pool = conf.pool;
var save = require('./../save/save');

(async () => {  

 const browser = await puppeteer.launch({
        executablePath: 'C://Users//Administrator//AppData//Local//Google//Chrome//Application//chrome.exe',
        headless: false
      });



let companyNameList = ['大众','特斯拉','一汽解放','中国重汽','东风商用车'];

for(var z=0;z<companyNameList.length;z++){

	try{
  

		const page = await browser.newPage()  
		await page.goto('http://i.gasgoo.com/login.aspx?return=http://i.gasgoo.com/');  

		/***********************************
		*    登录
		***********************************/
		await login(page);
		await page.waitFor(4000);

		/***********************************
		*    获取所有分页的url
		***********************************/
		let urlList = await getUrlByCompany(page,companyNameList[z]); 
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
		await page.goto('http://i.gasgoo.com/logout.aspx');
		/***********************************
		*    获取每个公司详情
		************************************/
		console.log("==================company size============="+totalCompanyList.length);

		const companySearchResultObjectList = new Array();
		for(var n=0;n<totalCompanyList.length;n++){
			let companyBrief = totalCompanyList[n].split("####@@@@")[0];
			let companyUrl = totalCompanyList[n].split("####@@@@")[1];
			let businessInfo = await getCompanyBusinessInfo(page,companyUrl);
			let companyObject = new Object();
			companyObject.brief = companyBrief;
			companyObject.detailUrl = companyUrl;
			companyObject.businessInfo = businessInfo;
			companySearchResultObjectList.push(companyObject);
			//console.log(businessInfo);
		}

		console.log('companySearchResultObjectList: {}' + JSON.stringify(companySearchResultObjectList));
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
*    获取所有分页的url
***********************************/
async function getUrlByCompany(page,companyName){
	await page.goto("http://i.gasgoo.com/supplier/search.aspx?skey=&tc="+companyName+"&export=-1");

	let resultList = page.evaluate(async (companyName)=>{
		var baseUrl = "http://i.gasgoo.com/supplier/search.aspx?skey=&tc="+companyName+"&export=-1&page=";
		//判断是否有分页
		var pageSize = document.querySelectorAll("#rpSearchResultList a").length;
		console.log("分页"+pageSize);
		//获取所有分页的Url
		var urlList = new Array();
		for(var i=1;i<pageSize+1;i++){
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
		return  document.querySelector(".newBussiness").innerText;		
	});

	console.log(businessInfo);
	return businessInfo;

}
//await page.waitFor(1000);
//browser.close();
})();