<template>
    <div class="login">
        <div class="login-form">

        <h1>
        <i class="el-icon-setting"></i>
        华联超市管理系统
        </h1>
    
            <el-form :model="loginForm" status-icon :rules="loginRules" ref="loginForm" label-width="100px" class="demo-ruleForm">
                
                <el-form-item label="用户名" prop="userName">
                    <el-input type="text" v-model="loginForm.userName" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="密码" prop="pass">
                    <el-input type="password" v-model="loginForm.pass" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="loginForm.checkPass" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
                    <el-button @click="resetForm('loginForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>

    </div>
</template>
<script>
import qs from 'qs'
  export default {
    data() {
        const confirmPass=(rule,value,callback)=>{
            if(value === ''){
                callback(new Error("请再次输入密码"))
            }else if (value !== this.loginForm.pass){
                callback(new Error("两次密码输入不一致"))
            }else{
                callback()
            }
        }  

      return {
        loginForm: {
          userName: '',
          pass: '',
          checkPass: ''
        },
        //验证字段
        loginRules: {
          userName: [
            { required: true, message: '账号不能为空', trigger: 'blur' }, // 非空验证
            { min: 4, max: 12, message: '长度必须 4 到 12 个字符', trigger: 'blur' } // 长度验证
          ],
          pass: [
           { required: true, message: '密码不能为空', trigger: 'blur' }, // 非空验证
            { min: 6, max: 12, message: '长度必须 6 到 12 个字符', trigger: 'blur' } // 长度验证
          ],
          checkPass: [
            { required: true, validator: confirmPass, trigger: 'blur' }, // 非空验证
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //收集用户信息
            let params = {
                username : this.loginForm.userName,
                password : this.loginForm.pass,
            }
            //允许携带cookies
            this.axios.defaults.withCredentials=true
            //将用户名密码发送给后端
            this.axios.post('http://192.168.20.97:3000/users/checklogin',
            qs.stringify(params),
            {headers:{'Content-Type':'application/x-www-form-urlencoded'}}
            ).then(response=>{
                if(response.data.rstCode === 1){
                    this.$message({
                        type:'success',
                        message:response.data.msg
                    });
                //跳转到首页
                setTimeout(()=>{
                    this.$router.push('/')
                },500)
                }else{
                    this.$message.error(response.data.msg)
                }
            })
          } else {
            console.log('验证失败不能登录！');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
<style lang="less">
    html,body{
        height:100%;
        background:url('../../../public/images/4.jpg');
    }
    .login{
        .login-form{
            width:500px;
            height:300px;
            padding:30px;
            position:fixed;
            top:0;
            left:0;
            right:0;
            bottom:0;
            margin:auto;
            h1{
                text-align:center;
                color:white;
                font-weight:200;
                font-size:30px;
            }
        }
        .el-form-item__label{
            color:white
        }
    }
</style>