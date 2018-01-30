<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar teacherDoingAttendance">
      <el-form :inline="true" :model="launchVO">
        <el-form-item label="课程">
          <el-select v-model="launchVO.className" class="lession" placeholder="请选择课程" >
            <el-option
              v-for="type in types"
              :value="type">
            </el-option>
          </el-select>
          <el-form-item label="上课日期">
            <el-date-picker
              v-model="launchVO.classDate" type="date" class="launchDate" placeholder="请选择上课日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <h3>上课时间：</h3>
            <div v-for="item in classTimeVO" class="classTimeStyle">
              <el-radio  v-model="launchVO.classTime" :label=item.type border>
                <span>{{item.beginTime}}</span>
                <span> - </span>
                <span>{{item.endTime}}</span>
              </el-radio>
            </div>
          </el-form-item>
        </el-form-item>
        <div>
          <el-button class="goButton" v-on:click="goBegin" type="primary" v-if="!isGo">启动</el-button>
          <el-button class="goButton" v-on:click="goBegin" type="danger" v-if="isGo">已启动</el-button>
        </div>
      </el-form>
    </el-col>
    <div>
      <h1>实时签到名单：</h1>
      <el-tag type="primary" class="attendanceName"><h1 class="nameType">苏打水</h1></el-tag>
    </div>

  </section>
</template>

<script>
  import util from '../../common/js/util'
  //import NProgress from 'nprogress'
  import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

  export default {
    name:'teacherDoingAttendance',
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

        addFormVisible: false,//新增界面是否显示
        addLoading: false,

        // 课程类别
        types: ['全部','马克思列宁主义','计算机专业英语','离散数学'],
        isGo: false,
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
        classTimeType:'',
        isSelectTimeType:'',
        launchVO: {
          className: '',
          classDate: '',
          classTime: '',
        }
      }
    },
    methods: {
      // 判空
      checkEmpty(thisVO) {
        if (thisVO.className === '' || thisVO.classDate === '' || thisVO.classDate === undefined || thisVO.classTime === '') {
          this.infoEmpty();
        } else {
          console.log(thisVO);
          // 显示已启动
          this.isGo = !this.isGo;
        }
      },
      //信息不能为空
      infoEmpty() {
        this.$alert('请选择完整的信息之后,再点击启动！', '提示', {
          confirmButtonText: '确定',
        });
      },
      // 启动
      goBegin(){
        this.checkEmpty(this.launchVO);
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
      //编辑
      editSubmit: function () {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              //NProgress.start();
              let para = Object.assign({}, this.editForm);
              para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
              editUser(para).then((res) => {
                this.editLoading = false;
                //NProgress.done();
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs['editForm'].resetFields();
                this.editFormVisible = false;
                this.getUsers();
              });
            });
          }
        });
      },
      //新增
      addSubmit: function () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.addLoading = true;
              //NProgress.start();
              let para = Object.assign({}, this.addForm);
              para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
              addUser(para).then((res) => {
                this.addLoading = false;
                //NProgress.done();
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs['addForm'].resetFields();
                this.addFormVisible = false;
                this.getUsers();
              });
            });
          }
        });
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
  .toolbar{
    padding-bottom: 0px;
  }
.attendanceName{
  min-width: 60px;
  min-height: 34px;
  margin-right: 15px;
  margin-bottom: 20px;
}
  .lession{
    width: 350px;
  }
  .lessionDate{
    width: 350px;
    margin-top: 20px;
  }
  .nameType{
    margin: 5px 5px;
  }
  .goButton{
    margin-bottom: 30px;
    margin-left: 290px;
  }
  .classTimeStyle{
    min-width: 150px;
    margin-right: 50px;
    margin-bottom: 20px;
    float: left;
  }
  .launchDate{
    min-width: 300px;
    margin-bottom: 20px;
  }

</style>

<style>
  .teacherDoingAttendance .el-select .el-input .el-input__icon{
    top: 75%;
  }
</style>
