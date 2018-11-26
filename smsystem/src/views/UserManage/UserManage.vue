<template>
    <div class="user-manage">
        <!-- 头部 -->
        <Header></Header>
        <!-- 主体 -->
        <el-main>
            <el-card class="box-card">
                <!-- 面板标题 -->
                <div slot="header" class="clearfix">
                    <span>账号管理</span>
                </div>
                <!-- 面板内容 -->
                <div class="text item">
                    <!-- 账号管理列表 -->
                    <el-table
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                        <!-- 选择框 -->
                        <el-table-column
                        type="selection"
                        >
                        </el-table-column>
                        <!-- 用户名称 -->
                        <el-table-column
                        prop="username"
                        label="用户名称"
                        >
                        </el-table-column>
                        <!-- 用户组别 -->
                        <el-table-column
                        prop="usergroup"
                        label="用户组"
                        >
                        </el-table-column>
                        
                        <!-- 日期 -->
                        <el-table-column
                        label="日期"
                        >
                        <template slot-scope="scope">{{ scope.row.cdate | formatCdate }}</template>
                        </el-table-column>
                        <!-- 操作 -->
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button
                                size="mini"
                                type="primary"
                                @click="handleEdit(scope.row.id)"><i class="el-icon-edit"></i>修改</el-button>
                                <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.row.id)"><i class="el-icon-delete"></i>删除</el-button>
                            </template>
                        </el-table-column>

                    </el-table>

                    <!-- 选择按钮 -->
                    <!-- <div style="margin-top: 20px">
                        <el-button @click="toggleSelection([tableData[1], tableData[2]])">切换第二、第三行的选中状态</el-button>
                        <el-button @click="toggleSelection()">取消选择</el-button>
                    </div> -->
                </div>
            </el-card>
        </el-main>
        <!-- 尾部 -->
        <Footer></Footer>
    </div>
</template>

<script>
    // 引入moment时间格式化插件
    import moment from "moment";
    // 引入头部组件 和 尾部组件
    import Header from '@/components/Header/Header.vue';
    import Footer from '@/components/Footer/Footer.vue';
    // 暴露出去， 暴露的是当前组件的vue实例对象（new Vue({ })）
    export default{
        // 注册组件
        components:{
            Header,
            Footer
        },
        // 数据
        data(){
            return {
                tableData:[]
            };
        },
        // 方法
        methods:{
            // 编辑触发函数
            handleEdit(id){
                console.log("你想要修改？"+id);
            },
            // 删除触发的函数
            handleDelete(id){
                // 发送一个请求，把id发送给后端
                this.axios.get(`http://127.0.0.1:3000/users/deluser?id=${id}`)
                .then(response => {
                    // 根据后端响应的数据判断
                    if(response.data.rstCode === 1){
                        // 弹出删除成功的提示
                        this.$message({
                            type:'success',
                            message:response.data.msg
                        })
                        // 重新请求一下所有的账号数据
                        this.getUserList();
                    }else{
                        this.$message.error(response.data.msg);
                    }
                })
            },
            // 下面两个是选择相关的函数
            toggleSelection(rows){
                if(rows){
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                }else{
                    this.$refs.multipleTable.clearSelection();
                }
            },
            handleSelectionChange(val){
                this.multipleSelection = val;
            },
            // 封装一个请求所有用户账号数据的函数
            getUserList(){
                // 发送ajax请求 获取所有数据
                this.axios.get("http://127.0.0.1:3000/users/userlist")
                .then(response => {
                    // 直接把请求到的所有用户账号的数据，赋值给tableData 渲染用户账号列表
                    this.tableData = response.data;
                });
            }
        },
        // 生命周期钩子函数（vue实例创建完成，但是还没有挂载dom 适合请求数据） 只要进入组件，组件就会经历这个周期，会自动触发这个函数
        created(){
            // 调用请求所有数据的函数
            this.getUserList();
        },
        // 过滤器
        filters:{
            formatCdate(value){
                return moment(value).format('YYYY-MM-DD HH:mm:ss');
            }
        }

    }
</script>

<style lang="less">
.user-manage {
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
        }
      }
    }
  }
}
</style>