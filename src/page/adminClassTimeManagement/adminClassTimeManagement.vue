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
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column prop="name" label="类型" min-width="150" sortable>
      </el-table-column>
      <el-table-column prop="sex" label="上课时间" min-width="180" :formatter="formatSex" sortable>
      </el-table-column>
      <el-table-column prop="addr" label="下课时间" min-width="180" sortable>
      </el-table-column>
      <el-table-column label="操作" min-width="150">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--编辑界面-->
    <el-dialog title="编辑学生信息" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editClassTimeVO" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="类型" prop="classTimeType">
          <el-input-number v-model="editClassTimeVO.classTimeType" @change="" :min="1" :max="20"></el-input-number>
        </el-form-item>
        <el-form-item label="上课时间" prop="classTimeBegin">
          <el-time-picker
            type="fixed-time"
            v-model="editClassTimeVO.classTimeBegin"
            :picker-options="{ selectableRange: '07:00:00 - 22:30:00'}"
            placeholder="开始时间">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="下课时间" prop="classTimeEnd">
          <el-time-picker
            type="fixed-time"
            v-model="editClassTimeVO.classTimeEnd"
            :picker-options="{ selectableRange: '07:00:00 - 22:30:00'}"
            placeholder="结束时间">
          </el-time-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="新增学生帐号" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="newClassTimeVO" label-width="80px" :rules="addFormRules" ref="editForm">
        <el-form-item label="类型" prop="classTimeType">
          <el-input-number v-model="newClassTimeVO.classTimeType" @change="" :min="1" :max="20"></el-input-number>
        </el-form-item>
        <el-form-item label="上课时间" prop="classTimeBegin">
          <el-time-picker
            type="fixed-time"
            v-model="newClassTimeVO.classTimeBegin"
            :picker-options="{ selectableRange: '07:00:00 - 22:30:00'}"
            placeholder="开始时间">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="下课时间" prop="classTimeEnd">
          <el-time-picker
            type="fixed-time"
            v-model="newClassTimeVO.classTimeEnd"
            :picker-options="{ selectableRange: '07:00:00 - 22:30:00'}"
            placeholder="结束时间">
          </el-time-picker>
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
    name:'adminClassTimeManagement',
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
          classTimeType: [{ type: 'date',required: true, message: '必填项不能为空', trigger: 'blur' }],
          classTimeBegin: [{ type: 'date',required: true, message: '必填项不能为空', trigger: 'change' }],
          classTimeEnd: [{ type: 'date',required: true, message: '必填项不能为空', trigger: 'change' }]
        },
        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          classTimeType: [{ type: 'date',required: true, message: '必填项不能为空', trigger: 'blur' }],
          classTimeBegin: [{ type: 'date',required: true, message: '必填项不能为空', trigger: 'change' }],
          classTimeEnd: [{ type: 'date',required: true, message: '必填项不能为空', trigger: 'change' }]
        },

        // 新增
        newClassTimeVO: {
          classTimeType: '',
          classTimeBegin: '',
          classTimeEnd: '',
        },
        // 编辑
        editClassTimeVO: {
          classTimeType: '',
          classTimeBegin: '',
          classTimeEnd: '',
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
      // 时间合理性判断
      checkTime (thisVO) {
        if (thisVO.classTimeBegin >= thisVO.classTimeEnd) {
          this.$message.error('下课时间必须在上课时间之后');
          thisVO.classTimeEnd = '';
        }
      },
      // 判空
      checkEmpty(thisVO) {
        if (thisVO.classTimeType === '' || thisVO.classTimeBegin === '' || thisVO.classTimeEnd === ''
          || thisVO.classTimeBegin === undefined || thisVO.classTimeEnd === undefined) {
          this.infoEmpty();
        } else {
          this.checkTime(thisVO);
          console.log(thisVO);
        }
      },
      //信息不能为空
      infoEmpty() {
        this.$message({message: '请确保信息已填写完整', type: 'warning'});
      },
      //编辑
      editSubmit () {
        this.checkEmpty(this.editClassTimeVO);
      },
      //新增
      addSubmit () {
        this.checkEmpty(this.newClassTimeVO);
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

</style>
