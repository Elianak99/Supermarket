<template>
    <div class="user-add">
        <!-- 头部 -->
        <Header></Header>
        <!-- 主体 -->
        <el-main>
            <el-card class="box-card">
                <!-- 面板标题 -->
                <div slot="header" class="clearfix">
                    <span>添加账号</span>
                </div>

                <!-- 面板内容 -->
                <div class="text item">
                    <!-- 添加账户表单 -->
                    <el-form :model="addUserForm" status-icon :rules="addUserRules" ref="addUserForm" label-width="100px" class="demo-ruleForm">
                        <!-- 账号 -->
                        <el-form-item label="账号" prop="username">
                            <el-input type="text" v-model="addUserForm.username" autocomplete="off"></el-input>
                        </el-form-item>
                        <!-- 密码 -->
                        <el-form-item label="密码" prop="password">
                            <el-input type="text" v-model="addUserForm.password" autocomplete="off"></el-input>
                        </el-form-item>
                        <!-- 确认密码 -->
                        <el-form-item label="确认密码" prop="checkPwd">
                            <el-input type="text" v-model="addUserForm.checkPwd"></el-input>
                        </el-form-item>
                        <!-- 用户组 -->
                        <el-form-item label="选择用户组" prop="usergroup">
                            <el-select v-model="addUserForm.usergroup" placeholder="请选择用户组">
                                <el-option label="超级管理员" value="超级管理员"></el-option>
                                <el-option label="普通用户" value="普通用户"></el-option>
                            </el-select>
                        </el-form-item>
                        <!-- 添加按钮 -->
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('addUserForm')">添加</el-button>
                            <el-button @click="resetForm('addUserForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-card>
        </el-main>
        <!-- 尾部 -->
        <Footer></Footer>
    </div>
</template>
<script>
// axios自带一个依赖库 qs 主要帮我们处理post请求的参数问题
import qs from 'qs';

// 引入头部组件 和 尾部组件
import Header from "@/components/Header/Header.vue";
import Footer from "@/components/Footer/Footer.vue";
export default {
  // 注册组件
  components: {
    Header,
    Footer
  },
  data() {
    // 自定义一个验证密码一致性的函数
    const confirmPwd = (rule, value, callback) => {
      // 非空验证
      if (value === "") {
        // 输出不能为空的提示
        callback(new Error("请再次输入密码"));
      } else if (value !== this.addUserForm.password) {
        // 一致性验证
        // 输出密码不一致的回调
        callback(new Error("两次密码不一致"));
      } else {
        // 成功提示（绿色勾勾）
        callback();
      }
    };
    return {
      // 增加用户表单数据对象
      addUserForm: {
        username: "",
        password: "",
        checkPwd: "",
        usergroup: ""
      },
      // 验证的字段
      addUserRules: {
        // 验证用户名
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" }, // 非空验证
          { min: 6, max: 12, message: "长度必须 6 到 12 个字符", trigger: "blur" } // 长度验证
        ],
        // 验证密码
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }, // 非空验证
          { min: 6, max: 12, message: "长度必须 6 到 12 个字符", trigger: "blur" } // 长度验证
        ],
        // 验证确认密码 --- 自定义验证规则
        // validator 配置选项的值 是一个函数 可以自己在这个函数里面验证
        checkPwd: [
          { required: true, validator: confirmPwd, trigger: "blur" } // 非空验证
        ],
        // 验证用户组
        usergroup: [
            { required: true, message: "请选择用户组", trigger: "change" }, // 非空验证
        ]
      }
    }
  },
  methods: {
    // 表单提交触发的函数
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 获取用户输入的要新增的账号数据，用一个参数对象保存
          let params = {
            username: this.addUserForm.username,
            password: this.addUserForm.password,
            usergroup: this.addUserForm.usergroup
          }
         
          // 发送ajax请求  把数据发送给后端
          this.axios.post('http://127.0.0.1:3000/users/adduser', 
            qs.stringify(params), // 参数处理
            { "headers": {"Content-Type":"application/x-www-form-urlencoded" } // 设置请求头
          })
            .then(response => {
              // 如果请求状态码是1 那么就是请求成功
              if (response.data.rstCode === 1) {
                // 弹出提示信息 
                this.$message({
                  type: 'success',
                  message: response.data.msg
                })

                // 跳转到账号管理列表页面
                this.$router.push('/usermanage')

              } else {
                // 弹出账号添加失败信息
                this.$message.error(response.data.msg)
              }
            })
        } else {
          console.log("前端验证不通过, 不能发送");
          return false;
        }
      });
    },
    // 重置表单触发的函数
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style lang="less">
  .user-add {
  width: 100%;
  display: flex; // 让这个盒子 变为一个可以伸缩的盒子
  flex-direction: column; // 方向是 纵向
  // 主体
  .el-main {
    flex: 1; // 自动增长 撑满
    .el-card {
      .el-card__header {
        font-weight: 700;
        font-size: 15px;
        background-color: #f1f1f1;
      }
      .el-card__body {
        .item {
            .el-form {
                width: 300px;
                .el-form-item {
                  margin-bottom: 30px;
                    .el-form-item__label {
                        height: 35px;
                        line-height: 35px;
                        color: black;
                    }
                    .el-form-item__content {
                        height: 35px;
                        line-height: 35px;
                        .el-input__inner {
                            height: 35px;
                            line-height: 35px;
                            margin-top: 0;
                        }
                    }
                }
            }
        }
      }
    }
  }
}
</style>