<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'

export default {
  name: 'app',
  data(){
    return {
    }
  },
  created(){
//    this.$router.push('/activePublic');
  },
  methods: {

  },
}
</script>

<style>
body{margin: 0;}
#app {
  width: 100%;
  margin: 0 auto;
  font-family: "Helvetica Neue","PingFang SC",Arial,sans-serif;
  height: 100%;
}
/* 主内容区 */
main{
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  height: 100%;
  border: solid 40px #E9ECF1;
  background-color: #FCFCFC;
}
main .main-left{
  text-align: center;
  -webkit-box-flex: 0;
  -ms-flex: 0 0 200px;
  flex: 0 0 200px;
  position: fixed;
  width: 200px;
}
main .main-right{
  -webkit-box-flex:1;
  -ms-flex:1;flex:1;
  background-color: #fff;
  padding: 50px 50px;
  margin-left: 200px;
}
main .el-menu{
  background-color: transparent!important;
}
.el-dialog .el-form-item__label{
  width: 100px !important;
}
.el-dialog .el-form-item__content{
  margin-left: 100px !important;
}
</style>
