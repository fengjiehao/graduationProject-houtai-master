<template>
  <section>
  <div class="detail">
    <div class="outStyle">
    <div class="loginDiv">
      <el-col :span="24" class="toolbar">
        <h2 class="titleFont">系统登录</h2>
        <el-form :inline="true" :model="userVO" :rules="addFormRules">
          <el-form-item prop="user">
            <el-input class="inputType" id="userID" placeholder="帐号" v-model="userVO.user"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input class="inputType" type="password" placeholder="密码"  v-model="userVO.password"></el-input>
          </el-form-item>
        </el-form>
        <el-button class="loginButton" type="primary" v-on:click="login" onmouseover="this.style.backgroundColor='rgb(154, 154, 255)';" onmouseout="this.style.backgroundColor='rgb(131, 132, 255)';">
          <span class="btnFont">登录</span>
        </el-button>
      </el-col>
    </div>
    </div>
  </div>
  </section>
</template>

<script>
  import Vue from 'vue'

  export default {
    name:'login',
    data: function () {
      return {
        userVO: {
          user: '',
          password: ''
        },
        addFormRules: {
          user: [
            { required: true, message: '帐号不能为空', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
            { min: 6, max: 16, message: '密码长度在 6 到 16 个字符', trigger: 'blur' }
          ],
        },
        isSuccess: false,
      }
    },
    methods: {
      // 密码合理性
      checkPassword() {
        if(this.userVO.password.length < 6){
          this.isSuccess = false;
        } else {
          this.isSuccess = true;
        }
      },
      // 登录
      login(){
          this.checkPassword();
          if(this.isSuccess) {
            this.$router.push('/teacherSchedule');
          }
      },
      // 密码不正确
      passwordError() {
        this.$message.error('密码不正确');
      }
    },
  }

</script>

<style scoped>
  .loginDiv{
    width: 490px;
    height: 250px;
    left: -18px;
    transform: skew(8deg);
    /*-webkit-border-radius: 8px;*/
    /*-moz-border-radius: 8px;*/
    /*border-radius: 8px;*/
    -webkit-box-shadow: #666 0px 0px 10px;
    -moz-box-shadow: #666 0px 0px 10px;
    box-shadow: #516 0px 0px 20px;
    background: #F5F5F5;
    text-align:center;
    margin-left: auto;
    margin-right: auto;
    position: relative;
    overflow: hidden;
    background-color:rgba(255, 255, 255, 0.5);
    opacity: 0.8;
  }
  .inputType{
    width: 300px;
  }
  .loginButton{
    width: 300px;
    margin-left: -8px;
    background-color: rgb(131, 132, 255);
    border: none;
    font-family: 微软雅黑;
  }
  .titleFont{
    /*color: transparent;*/
    color: #834DFF;
    /*background-color : #834DFF;*/
    text-shadow : rgba(255,255,255,0.5) 0 5px 6px, rgba(255,255,255,0.2) 1px 3px 3px;
    /*-webkit-background-clip : text;*/
  }
  .btnFont{
    font-size: 16px;
  }
  .detail {
    background: url(../../assets/backgroundHome.jpg);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: absolute;
  }
  .outStyle{
    width: 450px;
    height: 480px;
    background-color:rgba(255, 255, 255, 0.5);
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    border-radius: 8px;
    text-align:center;
    margin-left: auto;
    margin-right: auto;
    position: relative;
    top: 120px;
    overflow: hidden;
    transform: skew(-10deg);
    box-shadow: #65E 0px 0px 50px;
  }
</style>
