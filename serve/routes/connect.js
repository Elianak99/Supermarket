// 连接数据库公用模块

//引入mysql 
const mysql = require('mysql');

//使用mysql创建链接
const connection = mysql.createConnection({
    host     : 'localhost', // 数据地址 默认本地
    user     : 'root',      // 用户名字
    password : 'root',    // 密码
    database : 'smsystem',       // 要连接的数据库的名字
    useConnectionPooling: true,
    // port:'3307'
})

//执行链接
connection.connect(()=>{
    console.log('数据库连接成功')
})

//暴露
module.exports = connection