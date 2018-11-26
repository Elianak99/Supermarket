<template>
   <div class="goods-add">
       <!-- 头部 -->
       <Header></Header>
       <!-- 主体 -->
        <el-main>
            <el-card class="box-card">
                <!-- 面板标题 -->
                <div slot="header" class="clearfix">
                    <span>商品管理</span>
                </div>
                <!-- 面板内容 -->
                <div class="text item">
                    <div class="content">
                        <el-form :inline="true" :model="formInline" class="demo-form-inline">
                        <el-form-item>
                            <p><span>*</span>所属分类：</p>
                                <el-select v-model="formInline.region">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                                </el-select>
                            <p><span>*</span>商品条形码</p>
                                <el-form-item>
                                    <el-input v-model="formData.name"></el-input>
                                </el-form-item>
                                <el-button type="primary" @click="onSubmit">生成条形码</el-button>
                            <p><span>*</span>商品名称：</p>
                                <el-form-item>
                                    <el-input v-model="formData.name"></el-input>
                                </el-form-item>
                            <p><span>*</span>商品售价：</p>
                                <el-form-item>
                                    <el-input v-model="formData.name"></el-input>
                                </el-form-item>元
                            <p>市场价：</p>
                                <el-form-item>
                                    <el-input v-model="formData.name"></el-input>
                                </el-form-item>元
                                <p class="tip">默认市场价为售价的1.2倍</p>
                            <p>商品进价：</p>
                                <el-form-item>
                                    <el-input v-model="formData.name"></el-input>
                                </el-form-item>元 
                            <p>入库数量：</p>
                                <el-form-item>
                                    <el-input v-model="formData.name"></el-input>
                                </el-form-item>
                                <p class="tip">计重商品单位为千克</p>
                            <p>商品重量：</p>
                                <el-form-item>
                                    <el-input v-model="formData.name"></el-input>
                                </el-form-item>
                            <p>商品单位：</p>
                                <el-form-item>
                                    <el-input v-model="formData.name"></el-input>
                                </el-form-item>
                            <p>会员优惠：</p>
                                <el-radio v-model="radio1" label="1">享受</el-radio>
                                <el-radio v-model="radio1" label="2">不享受</el-radio>
                            <p>是否促销：</p>
                                <el-radio v-model="radio2" label="1">启用</el-radio>
                                <el-radio v-model="radio2" label="2">禁用</el-radio>   
                            <p>商品简介：</p>    
                                <el-input
                                    type="textarea"
                                    :rows="2"
                                    v-model="textarea">
                                </el-input>
                                <p class="tip">不超过200个字</p>
                            <el-button type="primary" @click="onSubmit">添加</el-button>
                        </el-form-item>
                        </el-form> 
                    </div>    
                </div>
            </el-card>
        </el-main>
       <!-- 尾部 -->
       <Footer></Footer>
    </div> 
</template>
<script>
// 引入头部组件和尾部组件
import Header from "@/components/Header/Header.vue";
import Footer from "@/components/Footer/Footer.vue";
// 注册组件
export default {
  components: {
    Header,
    Footer
  },
  data() {
     return {
         //会员优惠
        radio1: '1',
        //是否促销
        radio2: '1',
        //文本域内容
        textarea: '',
        formInline: {
        }, 
        formData: {
        }
      }
  },
    methods: {
      onSubmit() {
        console.log('submit!');
      }
    }
};
</script>
<style lang="less">
.goods-add {
  width: 100%;
  display: flex; //让这个盒子 变为一个可以伸缩的盒子
  flex-direction: column; //方向是 纵向
    p{  
        span{
            color:red
        }
        margin:0;
        padding:0;
        height:30px;
        line-height:20px;
    }
    .tip{
        margin-bottom:15px;
        color:rgba(0,0,0,.5)
    }
    form .el-button{
        margin:0 !important;
    }
    .el-input__inner{
        margin:0 !important;
    }
  // 主体
  .el-main {
    flex: 1; //自动增长， 撑满
    .el-card {
      .el-card__header {
        font-weight: 700;
        font-size: 15px;
        background-color: #f1f1f1;
      }
      .el-card__body {
          height:1040px;
      }
    }
  }
}

</style>