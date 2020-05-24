var mysql = require('mysql');
var wrapper = require('co-mysql')

var ip = 'http://119.3.19.171:3306';
var host = '119.3.19.171';
var pool = mysql.createPool({
    host:'119.3.19.171',
    user:'root',
    password:'y2iaciej',
    database:'haier',
    connectTimeout:30000
});

p = wrapper(pool);

module.exports = {
    ip    : ip,
    pool  : pool,
    p     : p,
    host  : host,
    photo : 5,
}