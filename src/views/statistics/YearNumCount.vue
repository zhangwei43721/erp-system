<template>
  <h2>请选择年份</h2>
  <el-form :model="yearForm" label-width="120px" :inline="true">
    <el-form-item label="年份" style="width: 34%">
      <el-select
          v-model="yearForm.year"
          class="m-2"
          placeholder="请选择年份"
          @change="countNum"
      >
        <el-option
            v-for="item in yearList"
            :key="item.year"
            :label="item.label"
            :value="item.year"
        />
      </el-select>
    </el-form-item>
  </el-form>

  <div id="num" STYLE="width: 100%;height: 100%"></div>
</template>

<script setup>
  import axios from "axios";
  import * as echars from 'echarts';
  import {onMounted, reactive, ref} from "vue";

  //声明表单数据
  const yearForm=reactive({
    year:''
  });
  //声明选项集合
  const yearList=ref([]);
  //定义发送请求，加载年份数据
  function loadYear(){
    axios.get("http://localhost:8080/queryYear")
        .then((response)=>{
          yearList.value=response.data;
        })
        .catch((error)=>{
          console.log(error);
        })
  }
  //页面加载调用函数
  onMounted(function(){
    loadYear();
  });
  //////////////////////////////////////////////////////////////////
  function countNum(year){
    axios.get("http://localhost:8080/countNum?year="+year)
    .then((response)=>{
      //进行echars 控件渲染
      var numDom=document.getElementById("num");
      //创建echarts对象
      var numEcharts=echars.init(numDom);

      var option = {
        xAxis: {
          type: 'category',
          data:  response.data.xdata
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: response.data.ydata,
            type: 'line'
          }
        ]
      };

      option && numEcharts.setOption(option);
    })
    .catch((error)=>{
      console.log(error);
    });
  }
</script>

<style scoped>

</style>