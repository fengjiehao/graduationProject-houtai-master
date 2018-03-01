<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="warning" @click="handleAdd">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="handleAdd">删除</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="classList" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column type="index" width="150">
      </el-table-column>
      <el-table-column prop="classno" label="班级号" min-width="150" sortable>
      </el-table-column>
      <el-table-column prop="classname" label="班级名称" min-width="200" sortable>
      </el-table-column>
      <el-table-column label="操作" min-width="150">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="paging">
          <span>第{{this.currentPage}}/{{this.countPage}}页</span>&nbsp;&nbsp;
          <!--<span>总记录数&nbsp;&nbsp;</span>&nbsp;&nbsp;-->
          <span>
           <el-button type="primary" size="small" round @click="FirstPage">首页</el-button>&nbsp;&nbsp;
           <el-button type="primary" size="small" round @click="PreviousPage">上一页</el-button>&nbsp;&nbsp;
           <el-button type="primary" size="small" round @click="NextPage">下一页</el-button>&nbsp;&nbsp;
           <el-button type="primary" size="small" round @click="FinalPage">尾页</el-button>&nbsp;&nbsp;
          </span>
      <span>
        <span>前往</span>
        <el-input type="number" size="small" v-model="seekPage"
                  prefix-icon="el-icon-search" style="width: 100px;border-radius:20px" >{{seekPage}}</el-input>
        <span>页</span>
        <el-button type="primary" size="small" round @click="selectPage">go</el-button>
      </span>
    </div>
    <!--编辑界面-->
    <el-dialog title="编辑班级信息" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editClassVO" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="班级号" class="inuptStyle" prop="classno">
          <el-input v-model="editClassVO.classno" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="班级名称" class="inuptStyle" prop="classname">
          <el-input auto-complete="off" v-model="editClassVO.classname"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="新增班级信息" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="newClassVO" label-width="80px" :rules="addFormRules" ref="editForm">
        <el-form-item label="班级号" class="inuptStyle" prop="classno">
          <el-input v-model="newClassVO.classno" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="班级名称" class="inuptStyle" prop="classname">
          <el-input auto-complete="off" v-model="newClassVO.classname"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import util from '../../common/js/util'
  import axios from 'axios'
  //import NProgress from 'nprogress'
  import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

  export default {
    name:'adminClassManagement',
    data() {
      return {
        users: [],
        total: 0,
        page: 1,
        listLoading: false,
        sels: [],//列表选中列

        editFormVisible: false,//编辑界面是否显示
        editLoading: false,
        editFormRules: {
          classno: [
            { required: true, message: '必填项不能为空', trigger: 'blur' }
          ],
          classname: [
            { required: true, message: '必填项不能为空', trigger: 'blur' }
          ]
        },

        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          classno: [
            { required: true, message: '必填项不能为空', trigger: 'blur' }
          ],
          classname: [
            { required: true, message: '必填项不能为空', trigger: 'blur' }
          ]
        },
        //新增实体
        newClassVO: {
          classno: '',
          classname: ''
        },
        //编辑实体
        editClassVO: {
          classno: '',
          classname: ''
        },
        //显示列表
        classList:[],
        //当前页面
        currentPage: 1,
        //分页总数
        countPage: 1,
        seekPage: 1,
      }
    },
    methods: {
      // 通过学号查询
      selectByclassNo(id){
        console.log(id);
        let self = this;
        axios.get('http://localhost:8088/attendanceSystem/classInfo/getClassById?id='+ id)
          .then(response => {
            console.log(response.data);
            this.classList = response.data;

            var data = response.data;
          }), () => {
          console.log(error);
        };

      },
      // 获取数据总页数
      getTotalCount() {
        let self = this;
        axios.get('http://localhost:8088/attendanceSystem/classInfo/getTotalCount')
          .then(response => {
            console.log(response.data);
            this.countPage = response.data;
            console.log(this.countPage);
          }), () => {
          console.log(error);
        };
      },
      // 查询数据
      getAllInfoList() {
        let self = this;
        axios.get('http://localhost:8088/attendanceSystem/classInfo/getAllClassByPage',{
          params:{
            currentPage: this.currentPage,
          }
        })
          .then(response => {
            console.log(response.data);
            this.classList = response.data;

            var data = response.data;
          }), () => {
          console.log(error);
        };
      },
      //删除学生信息
      handleDelete (index, thisVO) {
        console.log(index);
        console.log(thisVO);
        this.$confirm('是否确定删除该学生信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //确定
          let self = this;
          axios.post('http://localhost:8088/attendanceSystem/classInfo/DelClassInfo', thisVO)
            .then(response => {
              console.log(response.data);
              this.editFormVisible = false;
              if(response.data != null){
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.getAllInfoList();
              }
            }), () => {
            console.log(error);
          };

        }).catch(() => {
          //取消
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //编辑
      editSubmit () {
        this.checkEmpty(this.editClassVO);
          let self = this;
          axios.post('http://localhost:8088/attendanceSystem/classInfo/editClassInfo', this.editClassVO)
            .then(response => {
              console.log(response.data);
              this.editFormVisible = false;
              if(response.data != null){
                this.$message({
                  message: '修改成功',
                  type: 'success'
                });
                this.getAllInfoList();
              }
            }), () => {
            console.log(error);
          };
      },
      //新增
      addSubmit () {
        this.checkEmpty(this.newClassVO);
        console.log(this.newClassVO);
        let self = this;
        axios.post('http://localhost:8088/attendanceSystem/classInfo/saveClassInfo', this.newClassVO)
          .then(response => {
            console.log(response.data);
            this.addFormVisible = false;
            if(response.data == ""){
              this.$alert('该学号已存在', '提示', {
                confirmButtonText: '确定',
//                callback: action => {
//                  this.$message({
//                    type: 'info',
//                    message: `action: ${ action }`
//                  });
//                }
              });
            } else {
              this.$message({
                message: '新增成功',
                type: 'success'
              });
              this.getAllInfoList();
            }
          }), () => {
          console.log(error);
        };
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getUsers();
      },
      //获取用户列表
      getUsers() {
        let para = {
          page: this.page,
        };
        this.listLoading = true;
        //NProgress.start();
        getUserListPage(para).then((res) => {
          this.total = res.data.total;
          this.users = res.data.users;
          this.listLoading = false;
          //NProgress.done();
        });
      },
      //显示编辑界面
      handleEdit (index, thisVO) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, thisVO);
        console.log(index);
        console.log(thisVO);
        this.editClassVO = thisVO;
      },
      //显示新增界面
      handleAdd () {
        this.newClassVO = {
          classno: '',
          classname: '',
        };
        this.addFormVisible = true;
      },
      // 判空
      checkEmpty(thisVO) {
        if (thisVO.classno === '' || thisVO.classname === '') {
          this.infoEmpty();
        } else {
          console.log(thisVO);
        }
      },
      //信息不能为空
      infoEmpty() {
        this.$message({message: '请确保信息已填写完整', type: 'warning'});
      },
      //首页
      FirstPage() {
        this.currentPage = 1;
        this.getAllInfoList();
      },
      //上一页
      PreviousPage() {
        if(this.currentPage > 1){
          this.currentPage -= 1;
          this.getAllInfoList();
        } else if(this.currentPage = 1){
          this.$message({message: '当前页为第一页', type: 'warning'});
        }
      },
      //下一页
      NextPage() {
        if(this.currentPage < this.countPage){
          this.currentPage += 1;
          this.getAllInfoList();
        } else if(this.currentPage = this.countPage){
          this.$message({message: '当前页为最后一页', type: 'warning'});
        }
      },
      //尾页
      FinalPage() {
        this.currentPage = this.countPage;
        this.getAllInfoList();
      },
      //查询输入页数的数据
      selectPage() {
        //取整
        this.seekPage = parseInt(this.seekPage);
        if(this.seekPage > this.countPage){
          this.seekPage = this.countPage;
          this.currentPage = this.countPage;
          this.$message({message: '当前页面为最后一页', type: 'warning'}); 
        }else if(this.seekPage < 1){
          this.seekPage = 1;
          this.currentPage = 1;
        }else{
          this.currentPage = this.seekPage;
        }
        this.getAllInfoList();
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      //批量删除
      batchRemove: function () {
        var ids = this.sels.map(item => item.id).toString();
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { ids: ids };
          batchRemoveUser(para).then((res) => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getUsers();
          });
        }).catch(() => {

        });
      }
    },
    created() {
      //分页获取数据
      this.getAllInfoList();
      this.currentPage = 1;
      //总分页数
      this.getTotalCount();
    },
    mounted() {
//      this.getUsers();
    }
  }

</script>

<style scoped>
.el-input{
  width: 80%;
}
  .paging{
    position: fixed;
    bottom: 3%;
    right: 30%;
    font-family: 微软雅黑;
  }
</style>
