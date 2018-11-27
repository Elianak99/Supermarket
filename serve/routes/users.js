/**
 * users路由模块 主要负责用户管理模块的路由处理（处理用户模块的所有请求）
 */
var express = require('express');
var router = express.Router();

/* 引入数据库连接模块 */
const connection = require('./connect')

/**
 * 设置多个响应头 -- 写在所有路由之前 拦截所有请求
 */
router.all('*', (req, res, next) => {
  // 先设置响应头
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
  // 设置允许设置cookie
  res.setHeader('Access-Control-Allow-Credentials', true);
  // 给其他路由放行
  next();
})

/**
 * 检测用户是否可以登录-用户名和密码是否存在  /checklogin
 */
router.post('/checklogin', (req, res) => {
  // 接收用户名和密码
  let { username, password } = req.body;

  // 构造sql 查询用户名和密码是否存在（且的关系）
  const sqlStr = `select * from users where username='${username}' and password='${password}'`;
  // 执行sql语句
  connection.query(sqlStr, (err, data) => {
    if (err) {
      throw err;
    } else {
      if (data.length) {
        // 设置cookie 必须设置在res.send()之前
        res.cookie('userid', data[0].id);
        res.cookie('username', data[0].username);

        res.send({"rstCode":1, "msg":"欢迎您! 登录成功!"})
      } else {
        res.send({"rstCode":0, "msg":"请检查用户名或密码!"})
      }
    }
  })
})

/**
 * 检查用户登录状态-（是否已经登录过）
 */
router.get('/checkIsLogin', (req, res) => {
  // 获取浏览器的cookie
  let userid = req.cookies.userid;
  let username = req.cookies.username;

  // 如果都存在 证明用户登录过 
  if (userid && username) {
    // 存在 证明登录过
    res.send({"isLogin": true})
  } else {
    // 不存在 证明没有登录
    res.send({"isLogin": false})
  }
})

/**
 * 接收请求 退出登录 /logout
 */
router.get('/logout', (req, res) => {
  // 清除cookie
  res.clearCookie('userid');
  res.clearCookie('username');

  // 返回给前端 退出登录成功的信息
  res.send({"rstCode":1, "msg":"退出成功, 欢迎下次登录！"})
})

/**
 * 显示当前登录的用户名 /getusername
 */
router.get('/getusername', (req, res) => {
    // 从cookie里面获取用户名 
    let username = req.cookies.username;
    // 直接把用户名返回给前端
    res.send(username)
})

/**
 * 验证旧密码是否正确的路由 /checkoldpwd
 */
router.get('/checkoldpwd', (req, res) => {
  // 接收参数（用户输入的旧密码）
  let { oldPwd } = req.query;
  
  // 获取当前用户的id (从cookie里面获取)
  let id = req.cookies.userid;
  // 构造sql 查询出当前登录的用户数据
  const sqlStr = `select * from users where id=${id}`;
  // 执行sql 查询出当前登录的用户数据
  connection.query(sqlStr, (err, data) => {
    if (err) {
      throw err;
    } else {
      // 如果有数据
      if (data.length) {
        // 对比 用户输入的密码 和 当前用户的密码是否一致
        if ( oldPwd === data[0].password ) {
          res.send({"rstCode":1, "msg":"旧密码正确"})
        } else {
          res.send({"rstCode":0, "msg":"旧密码不正确"})
        }
      } else {
        res.send({"rstCode":501, "msg":"请求异常"})
      }
    }
  })
})

/**
 * 保存新密码 /savenewpwd
 */
router.get('/savenewpwd', (req, res) => {
  //  接收新密码
  let { newPwd } = req.query;
  // // 获取当前登录用户的id
  let id = req.cookies.userid;
  // // 根据id 构造sql（修改密码的sql）
  const sqlStr = `update users set password='${newPwd}' where id=${id}`;
  // 执行sql语句
  connection.query(sqlStr, (err, data) => {
    if (err) {
      throw err;
    } else {
      // 判断 如果受影响行数大于0 就是成功 
      if (data.affectedRows > 0) {
        // 成功
        // 清除cookie
        res.clearCookie('userid');
        res.clearCookie('username');

        // 返回修改成功的信息给前端
        res.send({"rstCode":1, "msg":"修改密码成功！请重新登录！"})
      } else {
        // 失败
        res.send({"rstCode":1, "msg":"修改密码失败！"})
      }
    }
  })
  
})

/**
 * 接收添加账号请求的路由 /adduser
 */
router.post('/adduser', (req, res) => {
 
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

router.get('/userlistbypage', (req, res) => {

  // 接收两个参数 （两个分页条件）currentPage(当前页码)  pageSize(每页多少条)
  let { currentPage, pageSize } = req.query;

  /* 设置默然参数 */
  currentPage = currentPage ? currentPage : 1;
  pageSize = pageSize ? pageSize : 3;

  let sqlStr = 'select * from users order by cdate desc' 
  // 执行sql语句 查询所有数据 计算出数据总条数
  connection.query(sqlStr, (err, data) => {
    if (err) {
      throw err // 如果有错 抛出错误
    } else {
      let totalCount = data.length;
      
      // 计算分页条件
      let n = (currentPage - 1) * pageSize;
      // 构造分页查询的sql语句
      sqlStr += ` limit ${n}, ${pageSize}`;
      // 执行sql语句
      connection.query(sqlStr, (err, data) => {
        if (err) {
          throw err;
        } else {
          res.send({"totalCount": totalCount, "data":data});
        }
      })
    }
  })
})

/**
 * 接收单条删除的请求 /deluser
 */
router.get('/deluser', (req, res) => {
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
        res.send({"rstCode": 1, "msg":"删除成功！"})
      } else {
        // 否则就是删除失败 返回删除失败的信息给前端
        res.send({"rstCode": 0, "msg":"删除失败!"})
      }
    }
  })
  
})

/**
 * 接收修改用户请求 - 数据回显 /edituser
 */
router.get('/edituser', (req, res) => {
  // 接收需要修改的数据的id
  let { id } = req.query;

  // 构造sql语句
  const sqlStr = `select * from users where id=${id}`;
  // 执行sql语句
  connection.query(sqlStr, (err, data) => {
    if (err) {
      throw err;
    } else {
      res.send(data);
    }
  })
})

/**
 * 接收保存修改用户的请求  /saveedit
 */
router.post('/saveedit', (req, res) => {
  // 接收新的数据 和 一个原来的id
  let { username, password, usergroup, editId }  = req.body;

  // 构造sql语句（修改的sql）
  const sqlStr = `update users set username='${username}', password='${password}', usergroup='${usergroup}' where id=${editId}`;
  // 执行sql语句
  connection.query(sqlStr, (err, data) => {
    if (err) {
      throw err;
    } else {
      // 如果受影响行数 大于0 就是修改成功 返回给前端修改成功的信息
      if (data.affectedRows > 0) {
        res.send({"rstCode":1, "msg":"修改成功!"})
      } else {
        // 否则就是修改失败 返回给前端修改失败的信息
        res.send({"rstCode":0, "msg":"修改失败!"})
      }
    }
  })
})

/**
 * 批量删除请求路由 /batchdel
 */
router.post('/batchdel', (req, res) => {
  // 接收前端传过来的需要批量删除的id数组
  let { idArr } = req.body;
  // 把字符串类型数据转为数组
  idArr = JSON.parse(idArr);

  // 构造sql语句 执行批量删除
  const sqlStr = `delete from users where id in (${idArr})`;
  // 执行sql语句 
  connection.query(sqlStr, (err, data) => {
    if (err) {
      throw err;
    } else {
      // 如果受影响行数 大于 0 就是删除成功 返回删除成功的信息给前端
      if (data.affectedRows > 0) {
        res.send({"rstCode":1, "msg":"批量删除成功"})
      } else {
        // 否则就是失败 返回失败的信息给前端
        res.send({"rstCode":0, "msg":"批量删除失败"})
      }
    }
  })
})


module.exports = router;
