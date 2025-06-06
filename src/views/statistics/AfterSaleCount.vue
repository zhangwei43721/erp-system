<template>
  <h2>投诉统计</h2>
  <el-button type="success" @click="questionTypeCount">投诉类型统计</el-button>
  <el-button type="success" @click="questionStateCount">回复状态统计</el-button>


  <div id="questionInfo" style="width:100%;height: 100%"></div>
</template>

<script setup>
  //定义函数发生请求，加载投诉类型统计数据
  import * as echarts from "echarts";
  import {onMounted} from "vue";
  import axios from "axios";

  function questionTypeCount(){
    axios.get("http://localhost:8080/countQuestionType")
    .then((response)=>{
      //获得显示echarts控件的dom
      var questionDom=document.getElementById("questionInfo");
      //创建echarts对象
      var typeEcharts=echarts.init(questionDom)

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
            name: '投诉问题类型数据',
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
      option&& typeEcharts.setOption(option);
    })
    .catch((error)=>{
      console.log(error);
    });
  }
  //页面加载调用函数
  onMounted(function(){
    questionTypeCount();
  })


  //定义函数发生按照回复状态进行统计的请求
  function questionStateCount(){
    axios.get("http://localhost:8080/countQuestionState")
    .then((response)=>{
      //获得dom对象
      var quesDom=document.getElementById("questionInfo");
      //初始化echarts对象
      var stateEcharts=echarts.init(quesDom)
      var option = {//完成echarts控件渲染的配置
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: '回复状态统计',
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
            data: response.data
          }
        ]
      };
      option && stateEcharts.setOption(option);
    })
    .catch((error)=>{
      console.log(error);
    });
  }
</script>

<style scoped>

</style>