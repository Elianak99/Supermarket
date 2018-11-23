<template>
   <div class="home">
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
                        <el-dropdown trigger="click" >
                        <span class="el-dropdown-link">
                            ----选择分类----<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>黄金糕</el-dropdown-item>
                            <el-dropdown-item>狮子头</el-dropdown-item>
                        </el-dropdown-menu>
                        </el-dropdown>
                                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                               
                                关键字：
                                <el-form-item>
                                    <el-input v-model="formInline.user"></el-input>
                                </el-form-item>
                                (商品名称，条形码)
                                <el-form-item>
                                    <el-button type="success" @click="onSubmit">查询</el-button>
                                </el-form-item>         
                                </el-form>
                    </div>


                    <el-table
                        :data="tableData2"
                        style="width: 100%"
                        :row-class-name="tableRowClassName">
                        <el-table-column
                        prop="barcode"
                        label="商品条形码">
                        </el-table-column>
                        <el-table-column
                        prop="pname"
                        label="商品名称">
                        </el-table-column>
                        <el-table-column
                        prop="classify"
                        label="所属分类">
                        </el-table-column>
                        <el-table-column
                        prop="sellprice"
                        label="售价(元)">
                        </el-table-column>
                        <el-table-column
                        prop="promotionprice"
                        label="促销价(元)">
                        </el-table-column>
                        <el-table-column
                        prop="marketprice"
                        label="市场价(元)">
                        </el-table-column>
                        <el-table-column
                        prop="inventory"
                        label="库存">
                        </el-table-column>
                        <el-table-column
                        prop="inventorytotleprice"
                        label="库存总额(元)">
                        </el-table-column>
                        <el-table-column
                        prop="totlesales"
                        label="销售总额(元)">
                        </el-table-column>
                        <el-table-column
                        prop="manage"
                        label="管理">
                        </el-table-column>
                    </el-table>
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
        formInline: {
          user: '',
          region: ''
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
.home {
  width: 100%;
  display: flex; //让这个盒子 变为一个可以伸缩的盒子
  flex-direction: column; //方向是 纵向
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
        .item {
        }
      }
    }
  }
}
.el-dropdown{
    height:50px;
    line-height:50px;
}
form{
    display:inline-block;
    height:50px;
    line-height:50px;
    margin-left:5px;
    .el-input__inner{
        margin-top:12px;
        height:30px;
    };
    .el-button{
        margin-top:12px;
        padding:6px 10px
    }
}
.content{
    height:50px;
}

</style>