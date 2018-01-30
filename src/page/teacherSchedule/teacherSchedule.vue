<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-select v-model="lessonType" style="width: 250px;" placeholder="请选择课程">
            <el-option
              v-for="type in types"
              :value="type">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getUsers">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" style="margin-left: 100px" @click="handleAdd">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="handleAdd">删除</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="selection" min-width="55">
      </el-table-column>
      <el-table-column type="index" min-width="60">
      </el-table-column>
      <el-table-column prop="name" label="UUID" min-width="150" sortable>
      </el-table-column>
      <el-table-column prop="sex" label="教工号" min-width="150" :formatter="formatSex" sortable>
      </el-table-column>
      <el-table-column prop="birth" label="课程号" min-width="150" sortable>
      </el-table-column>
      <el-table-column prop="addr" label="课程名" min-width="150" sortable>
      </el-table-column>
      <el-table-column prop="addr" label="上课周期" min-width="150" sortable>
      </el-table-column>
      <el-table-column prop="addr" label="上课时间" min-width="150" sortable>
      </el-table-column>
      <el-table-column label="操作" min-width="120">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
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
    <el-dialog title="编辑教师课程" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editClassVO" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="UUID" class="inuptStyle" type="number" prop="uuid">
          <el-input v-model="editClassVO.uuid" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="教工号" class="inuptStyle" prop="teacherNo">
          <el-input auto-complete="off" v-model="editClassVO.teacherNo"></el-input>
        </el-form-item>
        <el-form-item label="课程" prop="className">
          <el-select v-model="editClassVO.className" style="width: 250px;" placeholder="请选择课程">
            <el-option
              v-for="type in types"
              :value="type">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程时段" prop="classDateEnd" required>
          <el-date-picker
            v-model="editClassVO.classDateBegin"
            type="month"
            placeholder="开始月份">
          </el-date-picker>
          <el-date-picker
            v-model="editClassVO.classDateEnd"
            type="month"
            placeholder="结束月份">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="课程时间" prop="classDay">
          <el-checkbox-group v-model="editClassVO.classDay" >
            <el-checkbox v-for="item2 in classWeekAll" :label="item2" >{{item2}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="上课时间" prop="classTime">
          <div v-for="item in classTimeVO" class="classTimeStyle">
            <el-radio  v-model="editClassVO.classTime" :label=item.type border>
              <span>{{item.beginTime}}</span>
              <span> - </span>
              <span>{{item.endTime}}</span>
            </el-radio>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="新增教师课程" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="newClassVO" label-width="80px" :rules="addFormRules" ref="newClassVO">
        <el-form-item label="UUID" class="inuptStyle" type="number" prop="uuid">
          <el-input v-model="newClassVO.uuid" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="教工号" class="inuptStyle"  prop="teacherNo">
          <el-input auto-complete="off" v-model="newClassVO.teacherNo"></el-input>
        </el-form-item>
        <el-form-item label="课程" prop="className">
          <el-select v-model="newClassVO.className" style="width: 250px;" placeholder="请选择课程">
            <el-option
              v-for="type in types"
              :value="type">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程时段" required>
          <el-date-picker
            v-model="newClassVO.classDateBegin"
            type="month"
            placeholder="开始月份">
          </el-date-picker>
          <el-date-picker
            v-model="newClassVO.classDateEnd"
            type="month"
            placeholder="结束月份">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="课程时间" prop="classDay" >
          <el-checkbox-group v-model="newClassVO.classDay" >
            <el-checkbox v-for="item2 in classWeekAll" :label="item2" >{{item2}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="上课时间" prop="classTime" >
          <div v-for="item in classTimeVO" class="classTimeStyle">
            <el-radio  v-model="newClassVO.classTime" :label=item.type border>
              <span>{{item.beginTime}}</span>
              <span> - </span>
              <span>{{item.endTime}}</span>
            </el-radio>
          </div>
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
    name:'teacherSchedule',
    data() {
      return {
        addForm: {
          necessary: '',
        },
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
          uuid: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
          teacherNo: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
          className: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
          classDay: [{ type: 'array', required: true, message: '请至少选一项', trigger: 'change' }],
          classTime: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        },
        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          uuid: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
          teacherNo: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
          className: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
          classDay: [{ type: 'array', required: true, message: '请至少选一项', trigger: 'change' }],
          classTime: [{ required: true, message: '必填项不能为空', trigger: 'change' }],
        },
        // 课程类别
        types: ['全部','马克思列宁主义','计算机专业英语','离散数学'],
        lessonType:'',
        // 上课时间选择
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
        newClassVO: {
          uuid: '',
          teacherNo: '',
          className: '',
          classDateBegin: '',
          classDateEnd: '',
          classDay: [],
          classTime: ''
        },
        editClassVO: {
          uuid: '',
          teacherNo: '',
          className: '',
          classDateBegin: '',
          classDateEnd: '',
          classDay: [],
          classTime: ''
        },
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
        isSelectTimeType:'',
        isSelectWeek:[''],
        classWeekAll:['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        isReasonable: false,

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
      // 时间合理性判断
      checkTime (thisVO) {
        if (thisVO.classDateBegin > thisVO.classDateEnd) {
          this.$message.error('课程结束月份必须在课程开始月份之后');
          thisVO.classDateEnd = '';
          this.isReasonable = false;
        } else {
          this.isReasonable = true;
        }
      },
      // 判空
      checkEmpty(thisVO) {
        if (thisVO.uuid === '' || thisVO.teacherNo === '' || thisVO.className === ''
          || thisVO.classDateBegin === undefined || thisVO.classDateEnd === undefined
          || thisVO.classDateBegin === '' || thisVO.classDateEnd === ''
          || thisVO.classDay[0] === undefined || thisVO.classTime === '') {
          this.infoEmpty();
          this.isReasonable = false;
        } else {
          this.checkTime(thisVO);
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
        this.checkEmpty(this.editClassVO);
        if (this.isReasonable) {
          console.log(this.editClassVO);
        }
      },
      //新增
      addSubmit () {
        this.checkEmpty(this.newClassVO);
        if (this.isReasonable) {
          console.log(this.newClassVO);
        }
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
  .classTimeStyle{
    min-width: 150px;
    margin-right: 50px;
    margin-bottom: 10px;
    float: left;
  }
  .inuptStyle{
    margin-right: 150px;
  }
</style>
