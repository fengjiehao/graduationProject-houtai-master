<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getUsers">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="handleAdd" style="margin-left: 100px">新增</el-button>
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
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column prop="name" label="课程名" min-width="120" sortable>
      </el-table-column>
      <el-table-column prop="sex" label="上课日期" min-width="120" :formatter="formatSex" sortable>
      </el-table-column>
      <el-table-column prop="age" label="上课时间" min-width="120" sortable>
      </el-table-column>
      <el-table-column prop="birth" label="学号" min-width="120" sortable>
      </el-table-column>
      <el-table-column prop="birth" label="姓名" min-width="100" sortable>
      </el-table-column>
      <el-table-column prop="birth" label="专业" min-width="120" sortable>
      </el-table-column>
      <el-table-column prop="birth" label="班级" min-width="120" sortable>
      </el-table-column>
      <el-table-column prop="birth" label="出勤状况" min-width="100" >
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
      </el-pagination>
    </el-col>

    <!--修改界面-->
    <el-dialog title="编辑考勤信息" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editAttendanceVO" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="课程名" prop="className">
          <el-select v-model="editAttendanceVO.className" style="width: 250px;" placeholder="请选择课程">
            <el-option
              v-for="type in types"
              :value="type">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上课日期" prop="classDate">
          <el-date-picker
            v-model="editAttendanceVO.classDate"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="上课时间" prop="classTime">
          <div v-for="item in classTimeVO" class="classTimeStyle">
            <el-radio  v-model="editAttendanceVO.classTime" :label=item.type border>
              <span>{{item.beginTime}}</span>
              <span> - </span>
              <span>{{item.endTime}}</span>
            </el-radio>
          </div>
        </el-form-item>
        <el-form-item label="学号" class="inuptStyle" prop="studentNo">
          <el-input auto-complete="off" v-model="editAttendanceVO.studentNo"></el-input>
        </el-form-item>
        <el-form-item label="姓名" class="inuptStyle" prop="name">
          <el-input auto-complete="off" v-model="editAttendanceVO.name"></el-input>
        </el-form-item>
        <el-form-item label="专业" class="inuptStyle" prop="major">
          <el-input auto-complete="off" v-model="editAttendanceVO.major"></el-input>
        </el-form-item>
        <el-form-item label="班级" class="inuptStyle" prop="class">
          <el-input auto-complete="off" v-model="editAttendanceVO.class"></el-input>
        </el-form-item>
        <el-form-item label="出勤状况" prop="attendanceType">
          <el-radio-group v-model="editAttendanceVO.attendanceType">
            <el-radio-button label="迟到"></el-radio-button>
            <el-radio-button label="请假"></el-radio-button>
            <el-radio-button label="旷课"></el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="新增考勤信息" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="newAttendanceVO" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="课程名" prop="className">
          <el-select v-model="newAttendanceVO.className" style="width: 250px;" placeholder="请选择课程">
            <el-option
              v-for="type in types"
              :value="type">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上课日期" prop="classDate">
          <el-date-picker
            v-model="newAttendanceVO.classDate"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="上课时间" prop="classTime">
          <div v-for="item in classTimeVO" class="classTimeStyle">
            <el-radio  v-model="newAttendanceVO.classTime" :label=item.type border>
              <span>{{item.beginTime}}</span>
              <span> - </span>
              <span>{{item.endTime}}</span>
            </el-radio>
          </div>
        </el-form-item>
        <el-form-item label="学号" class="inuptStyle" prop="studentNo">
          <el-input auto-complete="off" v-model="newAttendanceVO.studentNo"></el-input>
        </el-form-item>
        <el-form-item label="姓名" class="inuptStyle" prop="name">
          <el-input auto-complete="off" v-model="newAttendanceVO.name"></el-input>
        </el-form-item>
        <el-form-item label="专业" class="inuptStyle" prop="major">
          <el-input auto-complete="off" v-model="newAttendanceVO.major"></el-input>
        </el-form-item>
        <el-form-item label="班级" class="inuptStyle" prop="class">
          <el-input auto-complete="off" v-model="newAttendanceVO.class"></el-input>
        </el-form-item>
        <el-form-item label="出勤状况" prop="attendanceType">
          <el-radio-group v-model="newAttendanceVO.attendanceType">
            <el-radio-button label="迟到"></el-radio-button>
            <el-radio-button label="请假"></el-radio-button>
            <el-radio-button label="旷课"></el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import util from '../../common/js/util'
  //import NProgress from 'nprogress'
  import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

  export default {
    name:'teacherAttendanceDetail',
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
          className: [{ required: true, message: '请选择课程', trigger: 'change' }],
          classDate: [{ type: 'date',required: true, message: '请选择上课日期', trigger: 'change' }],
          classTime: [{ required: true, message: '请选择上课时间段', trigger: 'change' }],
          studentNo: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
          name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
          major: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
          class: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
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
          className: [{ required: true, message: '请选择课程', trigger: 'change' }],
          classDate: [{ type: 'date',required: true, message: '请选择上课日期', trigger: 'change' }],
          classTime: [{ required: true, message: '请选择上课时间段', trigger: 'change' }],
          studentNo: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
          name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
          major: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
          class: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
        },
        //新增界面数据
        addForm: {
          name: '',
          sex: -1,
          age: 0,
          birth: '',
          addr: ''
        },
        // 出勤状况
        attendanType:'迟到',
        // 课程类别
        types: ['全部','马克思列宁主义','计算机专业英语','离散数学'],
        lessonType:'',
        // 上课时间选择
        classDate:'',
        classTime:'',
        classTimeBegin:'',
        classTimeEnd:'',
        classTimeVO:[{
          type:'1',
          beginTime:'08:00',
          endTime:'09:35',
        },
          {
            type:'2',
            beginTime:'09:55',
            endTime:'11:30',
          },
          {
            type:'3',
            beginTime:'11:40',
            endTime:'12:30',
          },
          {
            type:'4',
            beginTime:'14:00',
            endTime:'15:35',
          },
          {
            type:'5',
            beginTime:'15:55',
            endTime:'17:30',
          },
        ],
        isSelectTimeType:'',
        newAttendanceVO: {
          className: '',
          classDate: '',
          classTime: '',
          studentNo: '',
          name: '',
          major: '',
          class: '',
          attendanceType: '旷课',
        },
        editAttendanceVO: {
          className: '',
          classDate: '',
          classTime: '',
          studentNo: '',
          name: '',
          major: '',
          class: '',
          attendanceType: '旷课',
        }

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
      //编辑
      editSubmit () {
        this.checkEmpty(this.editAttendanceVO);
      },
      // 信息不能为空
      infoEmpty() {
        this.$message({
          message: '请确保信息已填写完整',
          type: 'warning'
        });
      },
      // 判空
      checkEmpty (thisVO) {
        if (thisVO.className === '' || thisVO.classDate === '' || thisVO.classTime === ''
          || thisVO.studentNo === '' || thisVO.name === ''
          || thisVO.major === '' || thisVO.class === '' || thisVO.attendanceType === '') {
          this.infoEmpty();
        } else {
          console.log(thisVO);
        }
      },
      //新增
      addSubmit () {
        this.checkEmpty(this.newAttendanceVO);
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      //批量删除
      batchRemove: function () {
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
  .classTimeStyle{
    min-width: 150px;
    margin-right: 50px;
    margin-bottom: 10px;
    float: left;
  }
</style>
