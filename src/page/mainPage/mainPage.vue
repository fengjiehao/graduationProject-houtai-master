<template>
<div>
  <!-- 头部导航 -->
  <header class="header" :class="{ 'header-fixed' : headerFixed }">
    <el-row>
      <div>
        <div class="titleDiv">
          <p class="titleFont">出勤管理系统</p>
        </div>
        <div class="userDiv">
        <span><img src="../../assets/myself.jpg" class="myself"/></span>
          <el-dropdown >
            <span class="el-dropdown-link myselfUser">
              {{this.loginName}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><p class="myselfQuit" @click="logout">注销</p></el-dropdown-item>
              <el-dropdown-item><p class="myselfQuit" @click="changePwd">修改密码</p></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <span class="userType" v-if="this.loginRuleType == 0">管理员</span>
        <span class="userType" v-if="this.loginRuleType == 1">教师用户</span>
        <span class="userType" v-if="this.loginRuleType == 2">学生用户</span>
      </div>
    </el-row>
  </header>
  <div v-show="headerFixed" style="position: relative;height: 60px;width: 100%;"></div>

  <main class="mainStyle">
    <!-- 左侧导航 -->
    <div class="main-left">
      <el-menu default-active="/activePublic" class="el-menu-vertical-demo" :router="true">
        <el-submenu index="1" v-if="this.loginRuleType == 0">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>信息管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/adminClassTimeManagement" :class="{'isActive': isSelectNum[10]}" @click="isSelected(10)" ><i class="el-icon-setting"></i>课程时间管理</el-menu-item>
            <el-menu-item index="/adminCollegeManagement" :class="{'isActive': isSelectNum[11]}" @click="isSelected(11)" ><i class="el-icon-setting"></i>学院管理</el-menu-item>
            <el-menu-item index="/adminMajorManagement" :class="{'isActive': isSelectNum[12]}" @click="isSelected(12)" ><i class="el-icon-setting"></i>专业管理</el-menu-item>
            <el-menu-item index="/adminClassManagement" :class="{'isActive': isSelectNum[13]}" @click="isSelected(13)" ><i class="el-icon-setting"></i>课程管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item index="/teacherSchedule" :class="{'isActive': isSelectNum[0]}" @click="isSelected(0)" v-if="this.loginRuleType == 1"> <i class="el-icon-setting"></i>课程信息管理</el-menu-item>
        <el-menu-item index="/teacherAttendanceManagement" :class="{'isActive': isSelectNum[1]}" @click="isSelected(1)" v-if="this.loginRuleType == 1"> <i class="el-icon-setting"></i>考勤管理</el-menu-item>
        <el-menu-item index="/teacherAttendanceDetail" :class="{'isActive': isSelectNum[2]}" @click="isSelected(2)" v-if="this.loginRuleType == 1"><i class="el-icon-date"></i>出勤详情</el-menu-item>
        <el-menu-item index="/teacherAttendanceStatistics" :class="{'isActive': isSelectNum[3]}" @click="isSelected(3)" v-if="this.loginRuleType == 1"><i class="el-icon-tickets"></i>考勤统计</el-menu-item>
        <el-menu-item index="/teacherDoingAttendance" :class="{'isActive': isSelectNum[4]}" @click="isSelected(4)" v-if="this.loginRuleType == 1"><i class="el-icon-time"></i>实时考勤</el-menu-item>
        <el-menu-item index="/studentAttendanceDetail" :class="{'isActive': isSelectNum[5]}" @click="isSelected(5)" v-if="this.loginRuleType == 2"> <i class="el-icon-date"></i>考勤详情</el-menu-item>
        <el-menu-item index="/studentSchedule" :class="{'isActive': isSelectNum[6]}" @click="isSelected(6)" v-if="this.loginRuleType == 2"> <i class="el-icon-setting"></i>课程管理</el-menu-item>
        <el-menu-item index="/adminTeacherUser" :class="{'isActive': isSelectNum[7]}" @click="isSelected(7)" v-if="this.loginRuleType == 0"> <i class="el-icon-setting"></i>教师用户管理</el-menu-item>
        <el-menu-item index="/adminStudentUser" :class="{'isActive': isSelectNum[8]}" @click="isSelected(8)" v-if="this.loginRuleType == 0"> <i class="el-icon-setting"></i>学生用户管理</el-menu-item>
        <el-menu-item index="/adminChangePwd" :class="{'isActive': isSelectNum[9]}" @click="isSelected(9)"><i class="el-icon-view"></i>修改密码</el-menu-item>


      </el-menu>
    </div>

    <!-- 右侧主内容区 -->
    <div  class="main-right" >
      <transition name="fade">
        <router-view class="view"></router-view>
      </transition>
    </div>
  </main>
</div>
</template>

<script>

  export default {
    name:'mainPage',
    data: function () {
      return {
        active:true,
        headerFixed : true,
        isSelectNum: [],
        loginUser:{},
        rule:'',
        loginName:'',
        loginRuleType:'',
      }
    },
    methods: {
      // 注销
      logout () {
        this.$router.push('/login');
      },
      // 修改密码
      changePwd () {
        this.$router.push({
            name:'adminChangePwd',
            query: {
              loginUser:this.loginUser
            }
          });
        this.isSelected(9);
      },
      // 左侧导航被选择样式
      isSelected(num) {
        for(let i = 0; i <= 14; i ++){
          this.isSelectNum[i] = false;
        }
        switch(num)
        {
          case 0:
            this.isSelectNum[0] = true;
            break;
          case 1:
            this.isSelectNum[1] = true;
            break;
          case 2:
            this.isSelectNum[2] = true;
            break;
          case 3:
            this.isSelectNum[3] = true;
            break;
          case 4:
            this.isSelectNum[4] = true;
            break;
          case 5:
            this.isSelectNum[5] = true;
            break;
          case 6:
            this.isSelectNum[6] = true;
            break;
          case 7:
            this.isSelectNum[7] = true;
            break;
          case 8:
            this.isSelectNum[8] = true;
            break;
          case 9:
            this.isSelectNum[9] = true;
            break;
          case 10:
            this.isSelectNum[10] = true;
            break;
          case 11:
            this.isSelectNum[11] = true;
            break;
          case 12:
            this.isSelectNum[12] = true;
            break;
          case 13:
            this.isSelectNum[13] = true;
            break;
          default:
            this.isSelectNum[14] = true;
            break;
        }
      },
      //从本地缓存获取角色和姓名
      confirmRule() {
        var obj = JSON.parse(localStorage.getItem("loginUserVO"));
        console.log(obj);
        this.loginRuleType = obj.ruletype;
        this.loginName = obj.name;
        this.isSelectNum[4] = true;
      },
      },
    mounted() {
//      console.log(this.isSelectNum);
//      console.log(this.loginRuleType);
//      console.log(this.loginName);
    },
    created(){
      this.confirmRule();
    },

  }

</script>

<style scoped>
  .loginDiv{
    border: 1px solid #696;padding: 60px 0;text-align: center; width: 200px;
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    border-radius: 8px;
    -webkit-box-shadow: #666 0px 0px 10px;
    -moz-box-shadow: #666 0px 0px 10px;
    box-shadow: #666 0px 0px 10px;
    background: #EEFF99;
  }
  .mainStyle{
    border: 0;
    margin-top: 27px;
  }
  .myself{
    margin: 20px 0px;
    float: left;
  }
  .myselfUser{
    font-size: 14px;
    font-family: 微软雅黑;
  }
  .myselfQuit{
    font-family: 微软雅黑;
    color: #1d90e6;
    font-size: 14px;
    margin: 0px;
  }

  body{margin: 0;}
  #app {
    min-width: 1200px;
    margin: 0 auto;
    font-family: "Helvetica Neue","PingFang SC",Arial,sans-serif;
  }
  /* 头部导航 */
  header{
    z-index: 1000;
    min-width: 1200px;
    transition: all 0.5s ease;
    border-top: solid 4px #3091F2;
    background-color: #fff;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.12),0 0 6px 0 rgba(0,0,0,.04);
  }
  header.header-fixed{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }
  header .el-menu-demo{
    padding-left: 300px!important;
  }

  /* 主内容区 */
  main{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    border: solid 40px #E9ECF1;
    min-height: auto;
    background-color: whitesmoke;
  }
  main .main-left{
    text-align: left;
    -webkit-box-flex: 0;
    -ms-flex: 0 0 200px;
    flex: 0 0 200px;
    position: fixed;
    width: 200px;
    font-family: 微软雅黑;
    height: 100%;
    overflow-y: auto;
    background-color: whitesmoke;
  }
  main .main-right{
    -webkit-box-flex:1;
    -ms-flex:1;flex:1;
    background-color: #fff;
    padding: 50px 50px;
    margin-left: 200px;
    overflow-x: hidden;
  }
  /* 单选框 */
  .el-form-item .el-radio+.el-radio {
    margin-left: 30px!important;
  }
  /* 路由切换动效 */
  .fade-enter-active, .fade-leave-active {
    transition: all .0s;
  }
  .fade-enter, .fade-leave-active {
    opacity: 0;
  }
  .list-enter-active, .list-leave-active {
    transition: all 1s;
  }
  .list-enter, .list-leave-active {
    opacity: 0;
    transform: translateY(30px);
  }
  .titleFont{
    float: left;
    font-size: 28px;
    width: 180px;
    margin-left: 56px;
    margin-right: 20px;
    font-weight: bold;
    margin: 24px 12px;
    color: transparent;
    background-color : white;
    text-shadow : rgba(255,255,255,0.5) 0 5px 6px, rgba(255,255,255,0.2) 1px 3px 3px;
    -webkit-background-clip : text;
  }
  .headFont{
    font-size: 24px;
    font-family: 微软雅黑;
    margin-left: 56px;
    width: 180px;
    float: left;
    margin-right: 20px;
  }
  .titleDiv{
    background-color: #409EFF;
    width: 199px;
    height: 83px;
    float: left;
  }
  .userDiv{
    margin-left: 10px;
    float: right;
  }
  .userType{
    margin: 30px 30px;
    float: right;
    font-family: 微软雅黑;
    color: #1d90e6;
    font-size: 16px;
    text-shadow:0 0 0.2em #61AEFE,
    -0 -0 0.2em #61AEFE;
    border: 1px solid #61AEFE;
  }
  .main-left .el-icon-location{
    margin-right: 0px;
  }
  .el-dropdown{
    padding-top: 32px;
    padding-right: 55px;
  }
  .el-dropdown-menu{
    min-width: inherit;
    margin: 6px 40px;
    border-radius:10px;
  }
</style>
<style>
  .main-left .el-menu-item-group__title{
    padding: 0px !important;
  }
</style>
