<template>
<h2>员工信息统计</h2>
  <el-button type="success" @click="countEmpAge">年龄分布统计</el-button>
  <el-button type="success" @click="countEmpEdu">学历分布统计</el-button>
  <hr/>
  <div id="empInfo" style="width:100%;height: 100%"></div>

</template>
<script setup>
//定义函数发生请求，统计年龄分部
import * as echarts from 'echarts'
import {onMounted} from "vue";
import axios from "axios";
function countEmpAge(){
  axios.get("http://localhost:8080/countEmpAge")
  .then(response=>{
    //获得显示echarts控件的dom
    var empDom=document.getElementById("empInfo");
    //创建echarts对象
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
          name: '员工年龄分部',
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
//页面加载调用函数
onMounted(function(){
  countEmpAge();
})

//定义函数统计员工学历分布
function countEmpEdu(){
  axios.get("http://localhost:8080/countEmpEdu")
  .then((response)=>{
    //实现echarts控件数据的渲染
    //获得显示echarts控件的dom
    var empDom=document.getElementById("empInfo");
    //创建echarts对象
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
          name: '员工学历分部',
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
  .catch((error)=>{
    console.log(error);
  });
}
</script>

<style scoped>

</style>