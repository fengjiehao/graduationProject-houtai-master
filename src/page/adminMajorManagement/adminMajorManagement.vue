<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-button type="warning" @click="handleAdd">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="handleAdd">删除</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column type="index" width="150">
      </el-table-column>
      <el-table-column prop="sex" label="专业号" min-width="150" :formatter="formatSex" sortable>
      </el-table-column>
      <el-table-column prop="addr" label="专业名称" min-width="200" sortable>
      </el-table-column>
      <el-table-column label="操作" min-width="150">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--编辑界面-->
    <el-dialog title="编辑专业信息" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editMajorVO" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="专业号" class="inuptStyle" prop="necessary">
          <el-input v-model="editMajorVO.majorNo" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="专业名称" class="inuptStyle" prop="necessary">
          <el-input auto-complete="off" v-model="editMajorVO.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="新增专业信息" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="newMajorVO" label-width="80px" ref="editForm"  :rules="addFormRules">
        <el-form-item label="专业号" class="inuptStyle" prop="necessary">
          <el-input v-model="newMajorVO.majorNo" auto-complete="off" > </el-input>
        </el-form-item>
        <el-form-item label="专业名称" class="inuptStyle" prop="necessary">
          <el-input auto-complete="off" v-model="newMajorVO.name"></el-input>
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
  //import NProgress from 'nprogress'
  import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

  export default {
    name:'adminMajorManagement',
    data() {
      return {
        filters: {
          name: ''
        },
        users: [],
        total: 0,
        page: 1,
        listLoading: false,
        sels: [],//列表选中列

        editFormVisible: false,//编辑界面是否显示
        editLoading: false,
        editFormRules: {
          necessary: [
            { required: true, message: '必填项不能为空', trigger: 'blur' }
          ]
        },

        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          necessary: [
            { required: true, message: '必填项不能为空', trigger: 'blur' }
          ]
        },

        newMajorVO: {
          majorNo: '',
          name: ''
        },
        editMajorVO: {
          majorNo: '',
          name: ''
        },

      }
    },
    methods: {
      //性别显示转换
      formatSex: function (row, column) {
        return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getUsers();
      },
      //获取用户列表
      getUsers() {
        let para = {
          page: this.page,
          name: this.filters.name
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
      //删除
      handleDel: function (index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { id: row.id };
          removeUser(para).then((res) => {
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
      },
      //显示编辑界面
      handleEdit: function (index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },
      //显示新增界面
      handleAdd: function () {
        this.addFormVisible = true;
        this.addForm = {
          name: '',
          sex: -1,
          age: 0,
          birth: '',
          addr: ''
        };
      },
      // 判空
      checkEmpty(thisVO) {
        if (thisVO.majorNo === '' || thisVO.name === '') {
          this.infoEmpty();
        } else {
          console.log(thisVO);
        }
      },
      //信息不能为空
      infoEmpty() {
        this.$message({message: '请确保信息已填写完整', type: 'warning'});
      },
      //编辑
      editSubmit () {
        this.checkEmpty(this.editMajorVO);
      },
      //新增
      addSubmit () {
        this.checkEmpty(this.newMajorVO);
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
    mounted() {
//      this.getUsers();
    }
  }

</script>

<style scoped>
  .el-input{
    width: 80%;
  }
</style>
