var mysql = require('mysql');
var debug = require('debug')('crawl:save');
var conf = require('./../config/config')
var async = require('async');

//把pigIndex存入数据库
exports.pigIndex = function(list,callback){
    console.log('save pigIndex')
    var connection = list.connection
    async.forEach(list.res,function(item,cb){
        debug('save pigIndex',JSON.stringify(item));
		var batchId = '20200525'
        var data = [batchId,item.index,item.data_date,item.change_rate,item.change,item.name,item.booking_price,item.trade_price,item.avg_trade_weight]				
                connection.query('insert into crawler_pigindex_result(batch_id,`index`,data_date,change_rate,`change`,name,booking_price,trade_price,avg_trade_weight,updata_date) values(?,?,?,?,?,?,?,?,?,now()) on DUPLICATE KEY UPDATE `index`=`index`,change_rate=change_rate,`change`=`change`,booking_price=booking_price,trade_price=trade_price,avg_trade_weight=avg_trade_weight,updata_date=now()',data,function(err,result){
                    if(err){
                        console.log(batchId,item.index,item.data_date,item.index,item.change_rate,item.change,item.name,item.booking_price,item.trade_price,item.avg_trade_weight)
                        console.log('pigIndex',err)
                    }
                    cb();
                });
    },callback);
}

//把jgjc存入数据库
exports.jgjc = function(list,callback){
    console.log('save jgjc')
    var connection = list.connection
    async.forEach(list.res,function(item,cb){
        debug('save jgjc',JSON.stringify(item));
		var batchId = '20200525'
        var data = [batchId,item.data_date,item.product_type,item.stat_type,item.raw_price,item.fodder_price,item.rate,item.balance,item.profit_count]				
                connection.query('insert into crawler_jgjc_result(batch_id,data_date,product_type,stat_type,raw_price,fodder_price,rate,balance,profit_count,update_date) values(?,?,?,?,?,?,?,?,?,now()) on DUPLICATE KEY UPDATE raw_price=raw_price,fodder_price=fodder_price,rate=rate,balance=balance,profit_count=profit_count,update_date=now()',data,function(err,result){
                    if(err){
                        console.log(batchId,item.data_date,item.product_type,item.stat_type,item.raw_price,item.fodder_price,item.rate,item.balance,item.profit_count)
                        console.log('jgjc',err)
                    }
                    cb();
                });
    },callback);
}



//把jgjc存入数据库
exports.jgjc = function(list,callback){
    console.log('save jgjc')
    var connection = list.connection
    async.forEach(list.res,function(item,cb){
        debug('save jgjc',JSON.stringify(item));
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
			data.data_date = datetimeType
		var batchId = datetimeType
        var data = [batchId,item.data_date,item.product_type,item.stat_type,item.raw_price,item.fodder_price,item.rate,item.balance,item.profit_count,now()]				
                connection.query('insert into crawler_jgjc_result(batch_id,data_date,product_type,stat_type,raw_price,fodder_price,rate,balance,profit_count,update_date) values(?,?,?,?,?,?,?,?,?,now()) on DUPLICATE KEY UPDATE raw_price=raw_price,fodder_price=fodder_price,rate=rate,balance=balance,profit_count=profit_count,update_date=now()',data,function(err,result){
                    if(err){
                        console.log(batchId,item.index,item.data_date,item.index,item.change_rate,item.change,item.name,item.booking_price,item.trade_price,item.avg_trade_weight)
                        console.log('jgjc',err)
                    }
                    cb();
                });
    },callback);
}


