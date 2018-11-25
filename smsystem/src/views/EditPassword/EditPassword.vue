<template>
    <div class="edit-password">
        <!-- 头部 -->
        <Header></Header>
        <!-- 主体 -->
        <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
            <el-form-item label="原密码" prop="pass">
                <el-input type="password" v-model="ruleForm2.pass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="checkPass">
                <el-input type="password" v-model="ruleForm2.checkPass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="age">
                <el-input v-model.number="ruleForm2.age"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="success" @click="submitForm('ruleForm2')">修改</el-button>
                <!-- <el-button @click="resetForm('ruleForm2')">重置</el-button> -->
            </el-form-item>
        </el-form>
        <!-- 尾部 -->
        <Footer></Footer>
    </div>
</template>
<script>
// 引入头部和尾部组件
import Header from '@/components/Header/Header.vue';
import Footer from '@/components/Footer/Footer.vue';


export default {
    // 注册组件
    components:{
        Header,
        Footer
    },
    data() {
      var checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('年龄不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
          } else {
            if (value < 18) {
              callback(new Error('必须年满18岁'));
            } else {
              callback();
            }
          }
        }, 1000);
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm2.checkPass !== '') {
            this.$refs.ruleForm2.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm2.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleForm2: {
          pass: '',
          checkPass: '',
          age: ''
        },
        rules2: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          age: [
            { validator: checkAge, trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
};
</script>
<style lang="less">
    .edit-password{
        width:100%;
        display:flex;
        flex-direction:column;
        // 主体
        .el-main{
            flex:1;
        }

    }
</style>