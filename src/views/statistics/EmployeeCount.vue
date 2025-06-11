<template>
<h2>员工信息统计</h2>
  <el-button type="success" @click="countEmpAge">年龄分布统计</el-button>
  <el-button type="success" @click="countEmpEdu">学历分布统计</el-button>
  <hr/>
  <div id="empInfo" style="width:100%;height: 100%"></div>

</template>
<script setup>
import * as echarts from 'echarts'
import {onMounted} from "vue";
import { statisticsApi } from '@/api/statistics';
function countEmpAge(){
  statisticsApi.getEmpAge()
  .then(response=>{
    var empDom=document.getElementById("empInfo");
    var ageEcharts=echarts.init(empDom)
    var option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: '员工年龄分布',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          padAngle: 5,
          itemStyle: {
            borderRadius: 10
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data:response.data
        }
      ]
    };
    option&&ageEcharts.setOption(option);
  })
  .catch(error=>{})
}
onMounted(function(){
  countEmpAge();
})
function countEmpEdu(){
  statisticsApi.getEmpEdu()
  .then((response)=>{
    var empDom=document.getElementById("empInfo");
    var eudEcharts=echarts.init(empDom)
    var option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: '员工学历分布',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          padAngle: 5,
          itemStyle: {
            borderRadius: 10
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data:response.data
        }
      ]
    };
    option&&eudEcharts.setOption(option);
  })
  .catch(error=>{})
}
</script>

<style scoped>

</style>