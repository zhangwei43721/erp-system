<template>
  <h2>请选择年份</h2>
  <el-form :model="yearForm" label-width="120px" :inline="true">
    <el-form-item label="年份" style="width: 34%">
      <el-select
          v-model="yearForm.year"
          class="m-2"
          placeholder="请选择年份"
          @change="handleYearMthSell"
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
  <div id="sellCharts" style="width: 100%; height: 100%"></div>


</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import * as echarts from "echarts";
import { statisticsApi } from '@/api/statistics';
//声明表单数据
const yearForm=reactive({
  year:''
});
const yearList=ref([]);
function loadYear(){
  statisticsApi.getYearList()
  .then((response)=>{
    yearList.value=response.data;
  })
  .catch((error)=>{
    console.log(error);
  })
}
onMounted(function(){
  loadYear();
});
function handleYearMthSell(year){
  statisticsApi.getYearMonthSell(year)
  .then((response)=>{
    var sellDom = document.getElementById('sellCharts');
    var sellChart = echarts.init(sellDom);
    var option = {
      xAxis: {
        type: 'category',
        data: response.data.xdata
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: response.data.ydata,
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          }
        }
      ]
    };
    option && sellChart.setOption(option);
  })
  .catch((error)=>{
    console.log(error);
  })
}
</script>

<style scoped>

</style>