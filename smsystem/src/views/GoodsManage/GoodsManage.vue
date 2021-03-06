<template>
    <div class="user-manage">
        <!-- 头部 -->
        <Header></Header>
        <!-- 主体 -->
        <el-main>
            <el-card class="box-card">
                <!-- 面板标题 -->
                <div slot="header" class="clearfix">
                    <span>商品管理</span>
                </div>
                <div>
                    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                        <el-form-item label="所属分类">
                            <el-select v-model="searchForm.classify" placeholder="所属分类">
                                <el-option label="全部" value="全部"></el-option>
                                <el-option label="食品类" value="食品类"></el-option>
                                <el-option label="水果类" value="水果类"></el-option>
                                <el-option label="酒水类" value="酒水类"></el-option>
                                <el-option label="电子类" value="电子类"></el-option>
                                <el-option label="生活用品" value="生活用品"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="关键字">
                            <el-input v-model="searchForm.keyWord" placeholder="商品名称或条形码"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="search">查询</el-button>
                        </el-form-item>
                    </el-form>
                </div>

                <!-- 面板内容 -->
                <div class="text item">
                    <!-- 账号管理列表 -->
                    <el-table ref="userlist" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
                        <!-- 选择框 -->
                        <el-table-column type="selection">
                        </el-table-column>
                        <!-- 条形码 -->
                        <el-table-column prop="barCode" label="条形码">
                        </el-table-column>
                        <!-- 商品名称 -->
                        <el-table-column prop="goodsName" label="商品名称">
                        </el-table-column>
                        <!-- 所属分类 -->
                        <el-table-column prop="classify" label="所属分类">
                        </el-table-column>
                        <!-- 售价 -->
                        <el-table-column prop="salePrice" label="售价">
                        </el-table-column>
                        <!-- 是否存销 -->
                        <el-table-column prop="promotion" label="是否促销">
                        </el-table-column>
                        <!-- 日期 -->
                        <el-table-column label="日期">
                            <template slot-scope="scope">{{ scope.row.cdate | formatCdate }}</template>
                        </el-table-column>
                        <!-- 操作 -->
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" @click="handleEdit(scope.row.id)">
                                    <i class="el-icon-edit"></i>
                                </el-button>
                                <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">
                                    <i class="el-icon-delete"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- 修改弹出的模态框 -->
          <el-dialog title="修改商品" :visible.sync="dialogFormVisible" width="40%">
            <!-- 修改用户表单 -->
            <el-form :model="editForm" status-icon :rules="rules" ref="editForm" label-width="100px" class="demo-ruleForm">
              <!-- 条形码 -->
              <el-form-item label="条形码" prop="barCode">
                <el-input type="text" v-model="editForm.barCode" autocomplete="off"></el-input>
              </el-form-item>
              <!-- 商品名称 -->
              <el-form-item label="商品名称" prop="goodsName">
                <el-input type="text" v-model="editForm.goodsName" autocomplete="off"></el-input>
              </el-form-item>
              <!-- 所属分类 -->
              <el-form-item label="所属分类" prop="classify">
                <el-input type="text" v-model="editForm.classify" autocomplete="off"></el-input>
              </el-form-item>
              <!-- 商品售价 -->
              <el-form-item label="商品售价" prop="salePrice">
                <el-input type="text" v-model="editForm.salePrice" autocomplete="off"></el-input>
              </el-form-item>
              <!-- 是否促销 -->
              <el-form-item label="是否促销" prop="promotion">
                <el-input type="text" v-model="editForm.promotion" autocomplete="off"></el-input>
              </el-form-item>
         
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="submitForm('editForm')">确 定</el-button>
            </div>
          </el-dialog>

                    <!-- 分页组件 -->
                    <div style="margin-top: 20px">
                      <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[1, 3, 5, 10, 20, 50]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalCount">
                      </el-pagination>
                    </div>
                    <!-- 批量删除按钮 -->
                    <div style="margin-top: 20px">
                        <el-button type="danger" @click="batchDel">批量删除</el-button>
                        <el-button @click="toggleSelection">取消选择</el-button>
                    </div>
                </div>
            </el-card>
        </el-main>
        <!-- 尾部 -->
        <Footer></Footer>
    </div>
</template>
<script>
// 引入moment 事件格式化插件
import moment from "moment";
// 引入qs模块 用于处理post方式产参数
import qs from "qs";

// 引入头部组件 和 尾部组件
import Header from "@/components/Header/Header.vue";
import Footer from "@/components/Footer/Footer.vue";

// 暴露出去 暴露的是当前组件的vue实例对象（new Vue({  })）
export default {
  // 注册组件
  components: {
    Header,
    Footer
  },
  // 数据
  data() {
    return {
      searchForm: {
        // 搜索表单
        classify: "", // 分类名
        keyWord: "" // 关键字
      },
      totalCount: 0, // 数据总条数
      currentPage: 1, // 当前页
      pageSize: 3, // 默认每页显示3条
      dialogFormVisible: false, // 控制修改模态框的显示和隐藏的变量
      tableData: [], // 用户账号列表的数据
      editId: "", // 保存要修改的数据的id
      seletedProduct: [], // 保存选中的用户数据

      // 和修改表单双向绑定的数据
      editForm: {
        barCode: "",
        goodsName: "",
        classify: "",
        salePrice: "",
        promotion: ""
      },
      // 验证的字段 修改表单的验证规则
      rules: {
        // 验证二维码
        barCode: [
          { required: true, message: "二维码不能为空", trigger: "blur" }, // 非空验证
        ],
        // 验证商品名
        goodsName: [
          { required: true, message: "商品名不能为空", trigger: "blur" }, // 非空验证
        ],
        // 验证所属分类
        classify: [
          { required: true, message: "所属分类不能为空", trigger: "change" } // 非空验证
        ],
        //验证售价
        salePrice: [
          { required: true, message: "售价不能为空", trigger: "change" } // 非空验证
        ],
        //验证促销
        promotion: [
          { required: true, message: "促销不能为空", trigger: "change" } // 非空验证
        ]
      }
    };
  },
  // 方法
  methods: {
    // 查询
    search() {

        // 查询直接调用分页方法
        this.getGoodsListByPage();
        /* 
          // 点击查询按钮  获取要查询的关键字 
          let classify = this.searchForm.classify;
          let keyWord = this.searchForm.keyWord;
          
          // 发送ajax请求 把这两个关键字发送给后端
          this.axios.get(`http://127.0.0.1:3000/goods/search?classify=${classify}&keyWord=${keyWord}`)
              .then(response => {
                  // 把查询的结果渲染表单 赋值给 tableData
                  this.tableData = response.data;
              })
          
        */

    },
    // 当页面尺寸(每页显示多少条)改变 就触发这个函数 传入当前页面尺寸
    handleSizeChange(val) {
      // 重置pageSize 的值
      this.pageSize = val;
      // 调用获取数据的函数
      this.getGoodsListByPage();
    },
    // 当页码改变 就会触发这个函数 传入当前页码
    handleCurrentChange(val) {
      // 重置当前页码
      this.currentPage = val;
      // 调用获取数据的函数
      this.getGoodsListByPage();
    },

    // 编辑(修改)触发函数
    handleEdit(id) {
      // 把要修改的id 保存到一个变量里面
      this.editId = id;
      // 发送一个ajax 把需要修改的数据的id发送给后端
      this.axios
        .get(`http://127.0.0.1:3000/goods/editgood?id=${id}`)
        .then(response => {
          // 一一对应 把数据回填到模态框里面
          this.editForm.barCode = response.data[0].barCode;
          this.editForm.goodsName = response.data[0].goodsName;
          this.editForm.classify = response.data[0].classify;
          this.editForm.salePrice = response.data[0].salePrice;
          this.editForm.promotion = response.data[0].promotion;
          // 回填号数据以后 再弹出模态框
          this.dialogFormVisible = true;
        });
    },

    // 删除触发的函数
    handleDelete(id) {
      // 发送一个请求 把id发送给后端
      this.axios
        .get(`http://127.0.0.1:3000/goods/delgood?id=${id}`)
        .then(response => {
          // 根据后端响应的数据判断
          if (response.data.rstCode === 1) {
            // 弹出删除成功的提示
            this.$message({
              type: "success",
              message: response.data.msg
            });
            // 重新请求一下所有商品数据（刚才已经把数据删除了 所有再次请求就是只有删除后的数据）
            this.getGoodsListByPage();
          } else {
            this.$message.error(response.data.msg);
          }
        });
    },

    // 取消选择的函数
    toggleSelection() {
      // 取消选择
      this.$refs.userlist.clearSelection();
    },
    // 当选择状态改变 触发这个函数
    handleSelectionChange(val) {
      // 把选中的数据 保存到一个变量里面
      this.seletedProduct = val;
    },

    // 批量删除函数
    batchDel() {
      // 把需要批量删除的数据的id 取出来
      let idArr = this.seletedProduct.map(v => v.id);

      // 判断 如果没有选中任何数据 那么就弹出请选择以后再操作 直接返回
      if (!idArr.length) {
        this.$message.error("请选择要删除的选项！");
        return;
      }

      // 收集参数
      let param = {
        idArr: JSON.stringify(idArr) // 把数组转为字符串
      };
      // 发送一个ajax请求 把这个id数组（里面是需要批量删除的数据的id）发送给后端
      this.axios
        .post(
          "http://127.0.0.1:3000/goods/batchdel",
          qs.stringify(param), // 处理参数
          { Header: { "Content-Type": "application/x-www-form-urlencoded" } } // 设置请求头
        )
        .then(response => {
          // 接收后端响应的数据 根据结果判断
          if (response.data.rstCode === 1) {
            // 成功 弹出批量删除成功的提示
            this.$message({
              type: "success",
              message: response.data.msg
            });

            // 刷新页面（重新获取一下最新数据）
            this.getGoodsListByPage();
          } else {
            // 失败 弹出错误信息
            this.$message.error(response.data.msg);
          }
        });
    },
    // 封装一个请求所有用户账号数据的函数
    getGoodsList() {
      // 发送ajax请求 获取所有数据
      this.axios.get("http://127.0.0.1:3000/goods/goodslist").then(response => {
        // 直接把请求到的所用用户账号的数据 赋值给 tableData 渲染用户账号列表
        this.tableData = response.data;
      });
    },

    // 按照分页请求数据
    getGoodsListByPage() {
      // 获取当前页码
      let currentPage = this.currentPage;
      // 获取当前页面尺寸pageSize(每页显示多少条)
      let pageSize = this.pageSize

      let classify = this.searchForm.classify;
      let keyWord = this.searchForm.keyWord;


      // 发送ajax请求 按照分页请求数据
      this.axios
        .get(`http://127.0.0.1:3000/goods/goodslistbypage?currentPage=${currentPage}&pageSize=${pageSize}&classify=${classify}&keyWord=${keyWord}`)
        .then(response => {

          // 把后端返回的对应页码的数据 赋值给 tableData
          this.tableData = response.data.data;

          // 把后端返回的数据总调数据 赋值 给 tatalCount
          this.totalCount = response.data.totalCount;

          // 如果当前页码 没有数据 且 不是第一页
          if (!response.data.data.length && this.currentPage !== 1) {
            // 当前页码减去 1
            this.currentPage -= 1;
            // 再次调用自己
            this.getGoodsListByPage();
          }
        });
    },

    // 修改表单提交函数
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
        //   收集修改后的新数据 和 一个原来的id
            let params = {
              barCode: this.editForm.barCode,
              goodsName: this.editForm.goodsName,
              classify: this.editForm.classify,
              salePrice: this.editForm.salePrice,
              promotion: this.editForm.promotion,
              editId: this.editId
            }
            // 发送ajax 把修改后的新数据 和 原来的id 一起发送给后端
            this.axios.post('http://127.0.0.1:3000/goods/saveedit',
            qs.stringify(params),
            { Header: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            ).then(response => {
              // 根据后端响应的数据判断
              if (response.data.rstCode === 1) {
                // 成功 弹出修改成功的提示
                this.$message({
                  type: 'success',
                  message: response.data.msg
                })
                // 重新调用一下获取数据的方法（刷新一遍页面 获取最新数据）
                this.getGoodsListByPage()
              } else {
                this.$message.error(response.data.msg);
              }
            })
            // 关闭模态框
            this.dialogFormVisible = false;
        } else {
          console.log("前端验证不通过, 不能发送");
          return false;
        }
      });
    }
  },
  // 生命周期钩子函数(vue实例创建完成 但是还没有挂载dom 适合请求数据) 只要进入组件 组件就会经历这个周期 会自动触发这个函数
  created() {
    // 页面加载 请求一次数据 按照分页请求数据
    this.getGoodsListByPage();

    // 请求所有商品数据
    // this.getGoodsList();
  },
  // 过滤器
  filters: {
    // 过滤器
    formatCdate(value) {
      return moment(value).format("YYYY-MM-DD");
    }
  }
};
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
        .el-dialog {
          .el-dialog__header {
            font-weight: 700;
          }
          .el-dialog__body {
            .el-form {
              width: 80%;
            }
          }
        }
      }
    }
  }
}
</style>


