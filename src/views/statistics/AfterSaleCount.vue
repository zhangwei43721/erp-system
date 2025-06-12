<template>
  <h2>投诉统计</h2>
  <el-button type="success" @click="questionTypeCount">投诉类型统计</el-button>
  <el-button type="success" @click="questionStateCount">回复状态统计</el-button>


  <div id="questionInfo" style="width:100%;height: 100%"></div>
</template>

<script setup>
import * as echarts from "echarts";
import { onMounted } from "vue";
import { statisticsApi } from '@/api/statistics';

function questionTypeCount() {
  statisticsApi.getQuestionType()
    .then((response) => {
      var questionDom = document.getElementById("questionInfo");
      var typeEcharts = echarts.init(questionDom)
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
            name: '投诉问题类别数据',
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
      option && typeEcharts.setOption(option);
    })
    .catch((error) => {
      console.log(error);
    });
}
onMounted(function () {
  questionTypeCount();
})
function questionStateCount() {
  statisticsApi.getQuestionState()
    .then((response) => {
      var quesDom = document.getElementById("questionInfo");
      var stateEcharts = echarts.init(quesDom)
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
            name: '投诉状态数据',
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
    .catch((error) => {
      console.log(error);
    });
}
</script>

<style scoped></style>