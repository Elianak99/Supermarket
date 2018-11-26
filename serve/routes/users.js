/**
 * users路由模块 主要负责用户管理模块的路由处理（处理用户模块的所有请求）
 */
var express = require('express');
var router = express.Router();

/* 引入数据库连接模块 */
const connection = require('./connect');

// 设置多个响应头 写在所有路由之前，拦截所有请求
// router.all('*',(req,res,next)=>{
  // 先设置响应头
  // res.setHeader('Access-Control-Allow-Origin','http://127.0.0.1:8080');
  // 设置允许设置cookie
  // res.setHeader('Access-Control-Allow-Credentials',true);
  // 给其他路由放行
  // next();
// })

/**
 * 接收添加账号请求的路由 /adduser
 */
router.post('/adduser', (req, res) => {
  // 设置响应头
  res.setHeader('Access-Control-Allow-Origin', '*');


  // 接收参数
  let { username, password, usergroup } = req.body

  // 把这些数据存入数据库
  // 构造插入数据库的sql语句(使用？占位的写法 更安全 可以过滤不安全的数据)
  const sqlStr = `insert into users(username, password, usergroup) values(?, ?, ?)`;

  // 参数列表
  const sqlParams = [username, password, usergroup];

  // 执行sql语句
  connection.query(sqlStr, sqlParams, (err, data) => {

    if (err) {
      throw err;
    } else {
      // 如果受影响的数据行数 > 0 就是成功
      if (data.affectedRows > 0) {
        // 返回成功的信息（数据对象）给前端
        res.send({"rstCode": 1, "msg":"添加账号成功"})

      } else {
        // 否则就是失败 返回失败的信息（数据对象）给前端
        res.send({"rstCode": 0, "msg":"添加账号失败"})
      }
    }
  })
})

/**
 * 接收用户账号列表请求（所有数据） /userslist
 */
router.get('/userlist', (req, res) => {
  // 设置响应头
  res.setHeader('Access-Control-Allow-Origin', '*');

  // 构造sql 查询所有用户账号数据 
  /* 
    order by 字段 修饰符（asc desc） 按照这个字段排序 默认是升序 asc是升序 desc是降序
  */
  const sqlStr = 'select * from users order by cdate desc' 
  // 执行sql语句
  connection.query(sqlStr, (err, data) => {
    if (err) {
      throw err // 如果有错 抛出错误
    } else {
      // 否则 把查询到的所有用户账号数据 响应（返回）给前端
      res.send(data)
    }
  })
})

/**
 * 接收单条删除的请求 /deluser
 */
router.get('/deluser', (req, res) => {
  // 设置响应头
  res.setHeader('Access-Control-Allow-Origin', '*');

  // 接收id
  let { id } = req.query
  // 构造sql 根据接收到的id 删除这一条数据
  const sqlStr = `delete from users where id = ${id}`

  // 执行sql语句（单条删除操作）
  connection.query(sqlStr, (err, data) => {
    if (err) {
      throw err
    } else {
      // 根据结果判断 如果受影响行数 > 0 就是删除成功
      if (data.affectedRows > 0) {
        // 返回删除成功的信息给前端
        res.send({"rstCode": 1, "msg":"删除成功,哈哈！"})
      } else {
        // 否则就是删除失败 返回删除失败的信息给前端
        res.send({"rstCode": 0, "msg":"删除失败,呵呵!"})
      }
    }
  })  
})

// 接收修改用户的请求 -- 数据回显 /edituser
router.get('/edituser',(req,res)=>{
  // 设置响应头
  res.setHeader('Access-Control-Allow-Origin', '*');
  // 接收需要修改的数据的id
  let{id}=req.query;
  // 构造sql语句
  const sqlStr = `select * from users where id=${id}`;
  // 执行sql语句
  connection.query(sqlStr,(err,data)=>{
    if(err){
      throw err;
    }else{
      res.send(data);
    }
  })
})
// 接收保存修改用户的请求  /saveedit
router.post('/saveedit',(req,res)=>{
  // 设置响应头
  res.setHeader('Access-Control-Allow-Origin', '*');
  // 接收新的数据 和 一个原来的id
  let{username,password,usergroup,editId} = req.body;
  // 构造sql语句
  const sqlStr = `update users set username='${username}',password='${password}',usergroup='${usergroup}' where id=${editId}`;
  // 执行sql语句
  connection.query(sqlStr,(err,data)=>{
    if(err){
      throw err;
    }else{
      if(data.affectedRows > 0){
        res.send({"rstCode":1,"msg":"修改成功！"});
      }else{
        res.send({"rstCode":0,"msg":"修改失败！"});
      }
    }
  })
})
// 批量删除请求路由   /batchdel
router.post('/batchdel',(req,res)=>{
  // 设置响应头
  res.setHeader('Access-Control-Allow-Origin', '*');
  // 接收前端传过来的需要批量删除的id数组
  let {idArr} = req.body;
  // 把字符串类型数据转为数组
  idArr = JSON.parse(idArr);
  // 构造sql语句 执行批量删除
  const sqlStr = `delete from users where id in(${idArr})`;
  // 执行sql语句
  connection.query(sqlStr,(err,data)=>{
    if(err){
      throw err;
    }else{
      if(data.affectedRows > 0){
        res.send({"rstCode":1,"msg":"批量删除成功！"});
      }else{
        res.send({"rstCode":0,"msg":"批量删除失败！"});
      }
    }
  })
})



module.exports = router;
