<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="请输入学号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getAllInfoList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" style="margin-left: 100px" @click="handleAdd">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="">删除</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="studentList" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column prop="name" label="姓名" min-width="120" sortable>
      </el-table-column>
      <el-table-column prop="studentno" label="学号/帐号" min-width="150" sortable>
      </el-table-column>
      <el-table-column prop="password" label="密码" min-width="120" sortable>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
      </el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog title="编辑学生信息" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editStudentVO" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="姓名" class="inuptStyle" prop="name">
          <el-input v-model="editStudentVO.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="学号" class="inuptStyle" prop="studentNo">
          <el-input auto-complete="off" v-model="editStudentVO.studentNo"></el-input>
        </el-form-item>
        <el-form-item label="密码" class="inuptStyle" prop="password">
          <el-input auto-complete="off" v-model="editStudentVO.password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="新增学生帐号" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="newStudentVO" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="姓名" class="inuptStyle" prop="name">
          <el-input v-model="newStudentVO.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="学号" class="inuptStyle" prop="studentNo">
          <el-input auto-complete="off" v-model="newStudentVO.studentNo"></el-input>
        </el-form-item>
        <el-form-item label="密码" class="inuptStyle" prop="password">
          <el-input auto-complete="off" v-model="newStudentVO.password"></el-input>
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
    name:'adminStudentUser',
    data() {
      return {
        filters: {
          name: ''
        },
        total: 0,
        page: 1,
        listLoading: false,
        sels: [],//列表选中列

        editFormVisible: false,//编辑界面是否显示
        editLoading: false,
        editFormRules: {
          name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
          studentNo: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
          password: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
        },
        //编辑界面数据
        editForm: {
          id: 0,
          name: '',
          sex: -1,
          age: 0,
          birth: '',
          addr: ''
        },

        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
          studentNo: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
          password: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
        },
        //新增界面数据
        addForm: {
          name: '',
          sex: -1,
          age: 0,
          birth: '',
          addr: ''
        },
        // 课程类别
        types: ['全部','马克思列宁主义','计算机专业英语','离散数学'],
        lessonType:'',
        // 上课时间选择
        classDate:'',
        classTime:'',
        classTimeBegin:'',
        classTimeEnd:'',
        classTimeOptions:{
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        newStudentVO: {
          name: '',
          studentNo: '',
          password: '',
        },
        editStudentVO: {
          name: '',
          studentNo: '',
          password: '',
        },
        studentList: [],

      }
    },
    created() {
      this.getAllInfoList();
    },
    methods: {

      // 获取初始化信息列表
      getAllInfoList() {
        let self = this;
        this.$http.get('http://localhost:8088/attendanceSystem/studentUser/getAllStu')
          .then(response => {
            console.log(response.data);
            this.studentList = response.data;

            var data = response.data;
          }), () => {
            console.log(error);
          };
      },

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
        if (thisVO.name === '' || thisVO.studentNo === '' || thisVO.password === '') {
          this.infoEmpty();
        } else {
          console.log(thisVO);
        }
      },
      //信息不能为空
      infoEmpty() {
        this.$message({
          message: '请确保信息已填写完整',
          type: 'warning'
        });
      },
      //编辑
      editSubmit () {
        this.checkEmpty(this.editStudentVO);
      },
      //新增
      addSubmit () {
        this.checkEmpty(this.newStudentVO);
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
  .inuptStyle{
    margin-right: 150px;
  }
</style>
