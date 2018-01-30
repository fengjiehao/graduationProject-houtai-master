<template>
  <div class="allActive">
    <el-form :inline="true" :model="filters">
      <el-form-item>
        <el-select v-model="lessonType" class="lession" placeholder="请选择课程">
          <el-option
            v-for="type in types"
            :value="type">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-on:click="">查询</el-button>
      </el-form-item>
    </el-form>
    <el-row class="head">
        <el-col :span="8" style="padding:20px 0;background:  #3091F2;">
          {{ totalActiveNum }}<br>
          <span>迟到</span>
        </el-col>
        <el-col :span="8" style="padding:20px 0;background: #33CCCC;">
          {{ totalActiveNum }}<br>
          <span>请假</span>
        </el-col>
        <el-col :span="8"  style="padding:20px 0;background: #E03636;">
          {{ auditNum }}<br>
          <span>旷课</span>
        </el-col>
    </el-row>

    <el-card class="box-card">
      <h3>详情</h3>
      <el-table :data="filteredTableData"  style="width: 100%"
                @cell-click="handleSelect" @selection-change="selectionchange">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column property="title" label="上课周期"></el-table-column>
        <el-table-column property="type" label="上课日期" ></el-table-column>
        <el-table-column property="status" label="教师名"></el-table-column>
        <el-table-column property="readNum" label="出勤状况"></el-table-column>
      </el-table>

      <el-row type="flex" justify="end" style="padding:20px 0; ">
        <el-pagination
          :current-page="5"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="sizes, prev, pager, next"
          :total="1000">
        </el-pagination>
      </el-row>
    </el-card>


  </div>
</template>
<script>
  export default {
    name: 'studentAttendanceDetail',
    data: function () {
      return {
        totalActiveNum: 3,
        totalSignUp: 204,
        auditNum: 15,
        activeNum: 0,
        currentType: '全部',
        selectItems:[],
        types: ['全部','测试活动','免费活动','收费活动'],
        tableData: [
          {
            id: '001',
            title: '王小虎',
            type: '测试活动',
            status: '已结束',
            readNum: 200,
            signUpNum: 100,
            auditNum: 100
          }, {
            id: '002',
            title: '王小虎',
            type: '测试活动',
            status: '已结束',
            readNum: 200,
            signUpNum: 100,
            auditNum: 100
          }, {
            id: '003',
            title: '王小虎',
            type: '测试活动',
            status: '已结束',
            readNum: 200,
            signUpNum: 100,
            auditNum: 100
          }, {
            id: '004',
            title: '王小虎',
            type: '测试活动',
            status: '已结束',
            readNum: 200,
            signUpNum: 100,
            auditNum: 100
          }],
        filters: {
          name:'',
        },
        lessonType:'',
      }
    },
    computed:{
      filteredTableData: function () {
        var type = this.currentType;
        return this.tableData.filter(function (data) {
          if(type == '全部'|| type == '' ){
            return true
          }else{
            return data.type == type
          }
        })
      }
    },
    methods: {
      handleSelect: function (row, column, cell, event) {
        if (column.label == '操作') {
          this.$router.push('/activeManage/detail/page1');
        } else if(column.type == 'selection'){
          row.$info = !row.$selected;
        }else{
          row.$selected = !row.$selected;
          row.$info = row.$selected;
        }
      },
      selectionchange: function (val) {
        var arr = [];
        val.forEach(function (item) {
          arr.push(item.id);
        });
        this.selectItems = arr;
        this.activeNum = this.selectItems.length;
      },
      handleRemove:function(){
        var tableData = this.tableData;
        this.selectItems.forEach(function (id) {
          tableData.forEach(function (data) {
            if(id == data.id){
              tableData.splice(tableData.indexOf(data),1)
            }
          })
        });
        this.selectItems = [];
      },
    }
  }
</script>
<style>
  .allActive > .head > .el-col > .el-col {
    padding: 20px 0;
    border-right: solid 1px #fff;
  }

  .allActive .head {
    text-align: center;
    color: #fff;
    font-size: 30px;
    margin-bottom: 50px;
  }
  .allActive .head span {
    font-size: 20px;
  }
  .lession{
    min-width: 300px;
    margin-bottom: 20px;
  }
</style>
