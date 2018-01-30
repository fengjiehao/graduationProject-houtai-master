<template>
    <section>
      <!--工具条-->
      <el-col :span="24" class="toolbar adminChangePwd">
        <el-form :inline="true"  :model="passwordVO" :rules="addFormRules">
          <el-form-item>
            <span>旧密码：</span>
          </el-form-item>
          <el-form-item prop="oldPwd">
            <el-input type="password" v-model="passwordVO.oldPwd" placeholder="请输入旧密码" style="width: 300px"></el-input>
          </el-form-item>
        </el-form>
        <el-form :inline="true" :model="passwordVO" :rules="addFormRules">
          <el-form-item>
            <span>新密码：</span>
          </el-form-item>
          <el-form-item prop="newPwd">
            <el-input type="password" v-model="passwordVO.newPwd" placeholder="请输入新密码" style="width: 300px"></el-input>
          </el-form-item>
        </el-form>
        <el-form :inline="true" :model="passwordVO" :rules="addFormRules">
          <el-form-item>
            <span>确认新密码：</span>
          </el-form-item>
          <el-form-item prop="confirmNewPwd">
            <el-input type="password" v-model="passwordVO.confirmNewPwd" placeholder="请再次输入新密码" style="width: 300px;padding-right: 26px"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <div style="text-align: center">
        <el-button type="primary" style="margin-left: 15px" @click="confirm">确认</el-button>
        <el-button type="warning" style="margin-left: 10px" @click="reset">重置</el-button>
      </div>
    </section>
</template>

  <script>
    import store from 'src/store.js'

    export default {
    name:'adminChangePwd',
    data () {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入确认新密码'));
        } else if (value !== this.passwordVO.newPwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        passwordVO: {
          oldPwd: '',
          newPwd: '',
          confirmNewPwd: '',
        },
        isSuccess: false,
        addFormRules: {
          oldPwd: [
            { required: true, message: '请输入旧密码', trigger: 'blur' },
            { min: 6, max: 16, message: '密码长度在 6 到 16 个字符', trigger: 'blur' }
            ],
          newPwd: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 6, max: 16, message: '密码长度在 6 到 16 个字符', trigger: 'blur' }
          ],
          confirmNewPwd: [
            // 自定义校验规则
            { validator: validatePass, trigger: 'blur' }
            ],
        },
      }
    },
    methods: {
      // 判断密码合理性
      checkPassword() {
        if(this.passwordVO.oldPwd.length < 6 || this.passwordVO.newPwd.length < 6 || this.passwordVO.confirmNewPwd.length < 6){
          this.$message({message: '密码位数限制为6-16位', type: 'warning'});
          this.isSuccess = false;
        } else if (this.passwordVO.newPwd !== this.passwordVO.confirmNewPwd){
          this.$message.error('新密码与确认新密码不一致');
          this.isSuccess = false;
        } else {
          this.isSuccess = true;
        }
      },
      // 判空
      checkEmpty() {
        if (this.passwordVO.oldPwd === '' || this.passwordVO.newPwd === '' || this.passwordVO.confirmNewPwd === '') {
          this.infoEmpty();
          this.isSuccess = false;
        } else {
          this.checkPassword();
          if(this.isSuccess) {
            console.log('修改成功');
          }
        }
      },
      //信息不能为空
      infoEmpty() {
        this.$message({
          message: '请确保信息已填写完整',
          type: 'warning'
        });
      },
      // 确定
      confirm () {
        this.checkEmpty();
      },
      // 重置
      reset () {
        this.passwordVO.oldPwd = '',
        this.passwordVO.newPwd = '',
        this.passwordVO.confirmNewPwd = ''
      },

    },
    watch:{
    }
  }

</script>
<style scoped>
 .activePublic .router-link{color:#fff;}
 .activePublic .but-group .el-button{margin-right: 20px;}
 .adminChangePwd{
   padding-bottom: 0px;
   text-align: center
 }
</style>
<style>
  .adminChangePwd .el-form--inline{
    padding-top: 10px;
  }
</style>
