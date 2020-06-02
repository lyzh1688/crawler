var mysql = require('mysql');
var debug = require('debug')('crawl:save');
var conf = require('./../config/config')
var async = require('async');

//把pigIndex存入数据库
exports.pigIndex = function(list,callback){
    console.log('save pigIndex')
    var connection = list.connection
    list.res.forEach(function(item){
        console.log('save pigIndex',JSON.stringify(item));
		var datetimeType = "";  
		    var date = new Date();   
		  
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
		var batchId = datetimeType
        var data = [batchId,item.index,item.data_date,item.change_rate,item.change,item.region,item.booking_price,item.trade_price,item.avg_trade_weight]				
                connection.query('insert into crawler_pigindex_result(batch_id,`index`,data_date,change_rate,`change`,region,booking_price,trade_price,avg_trade_weight,update_date) values(?,?,?,?,?,?,?,?,?,now()) on DUPLICATE KEY UPDATE `index`=VALUES(`index`),change_rate=VALUES(change_rate),`change`=VALUES(`change`),region = VALUES(region),booking_price=VALUES(booking_price),trade_price=VALUES(trade_price),avg_trade_weight=VALUES(avg_trade_weight),update_date=now()',data,function(err,result){
                    if(err){
                        console.log(batchId,item.index,item.data_date,item.index,item.change_rate,item.change,item.name,item.booking_price,item.trade_price,item.avg_trade_weight)
                        console.log('pigIndex',err)
                    }else{
						console.log(result)
						console.log('insert success')
					}
                });
    },callback);
	connection.release()
}



//把jgjc存入数据库
exports.jgjc = function(list,callback){
    console.log('save jgjc')
    var connection = list.connection
    list.res.forEach(function(item){
        console.log('save jgjc',JSON.stringify(item));
			var datetimeType = "";  
		    var date = new Date();   
		  
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
		var batchId = datetimeType
        var data = [batchId,item.data_date,item.product_type,item.stat_type,item.raw_price,item.fodder_price,item.rate,item.balance,item.profit_count,item.release_date]				
                connection.query('insert into crawler_jgjc_result(batch_id,data_date,product_type,stat_type,raw_price,fodder_price,rate,balance,profit_count,release_date,update_date) values(?,?,?,?,?,?,?,?,?,?,now()) on DUPLICATE KEY UPDATE raw_price=VALUES(raw_price),fodder_price=VALUES(fodder_price),rate=VALUES(rate),balance=VALUES(balance),profit_count=VALUES(profit_count),release_date=VALUES(release_date),update_date=now()',data,function(err,result){
                    if(err){
                        console.log(batchId,item.index,item.data_date,item.index,item.change_rate,item.change,item.name,item.booking_price,item.trade_price,item.avg_trade_weight,item.release_date)
                        console.log('jgjc',err)
                    }else{
						//console.log(result)
						console.log('insert success')
					}
                });
    },callback);
	connection.release()
}



//把qts存入数据库
exports.qts = function(list,callback){
	try{
    console.log('save qts')
    var connection = list.connection
     list.res.forEach(function(item){
       // console.log('save qts: ',JSON.stringify(item));
			var datetimeType = "";  
		    var date = new Date();   
		  
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
		var curMonth =  datetimeType;
		    datetimeType+= day;   //日  
		var batchId = datetimeType
        var data = [batchId,curMonth,item.company,item.prodType,item.rule,item.unit,item.specs,item.certificationID,item.certDate,item.expireDate,item.status,item.isCancled]				
                connection.query('insert into crawler_qts_result(batch_id,month,company,prodType,rule,unit,specs,certificationID,certDate,expireDate,status,isCancled,update_date) values(?,?,?,?,?,?,?,?,?,?,?,?,now()) on DUPLICATE KEY UPDATE specs=VALUES(specs),certificationID=VALUES(certificationID),certDate=VALUES(certDate),expireDate=VALUES(expireDate),status=VALUES(status),isCancled=VALUES(isCancled),update_date=now()',data,function(err,result){
                    if(err){
                        //console.log(batchId,curMonth,item.company,item.prodType,item.rule,item.unit,item.specs,item.certificationID,item.certDate,item.expireDate,item.status,item.isCancled)
                        console.log('qts',err)
                    }else{
						console.log(result)
						console.log('insert success')
					}
                   
                });				
    },callback);
	 connection.release()
	}catch(err){
		console.log('save qts error: ',err);
	}
}


//把gasgoo存入数据库
exports.gasgoo = function(list,callback){
    console.log('save gasgoo')
    var connection = list.connection
    list.res.forEach(function(item){
       // console.log('save gasgoo: ',JSON.stringify(item));
			var datetimeType = "";  
		    var date = new Date();   
		  
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
		var curMonth =  datetimeType;
		    datetimeType+= day;   //日  
		var batchId = datetimeType
		
		
			var data = [batchId,curMonth,item.search_target,item.company,item.attribute,item.attr_value]
			//console.log("data: " + JSON.stringify(data))			
                connection.query('insert into crawler_gasgoo_result(batch_id,month,search_target,company,attribute,attr_value,update_date) values(?,?,?,?,?,?,now()) on DUPLICATE KEY UPDATE attr_value=VALUES(attr_value),update_date=now()',data,function(err,result){
                    if(err){
                        console.log(batchId,curMonth,item.search_target,item.company)
                        console.log('gasgoo',err)
                    }else{
						//console.log(result)
						console.log('insert success')
					}
                   
                });
				
		
    },callback);
	 connection.release()
}



//log
exports.log = function(list,callback){
    console.log('save log')
    var connection = list.connection
    list.res.forEach(function(item){
			
		
			var data = [item.crawler_type,item.step,item.message]	
                connection.query('insert into crawler_log(crawler_type,step,message,update_date) values(?,?,?,now()) ',data,function(err,result){
                    if(err){
                        console.log(batchId,item.crawler_type,item.step,item.message)
                        console.log('log',err)
                    }else{
						//console.log('insert success')
					}
                   
                });
				
		
    },callback);
	 connection.release()
}






