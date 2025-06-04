<template>

  <!-- div容器用来渲染echarts控件 -->
  <div id="main" style="width: 100%;height: 100%"></div>
</template>

<script setup>
import * as echarts from 'echarts';
import {onMounted} from "vue";
import axios from "axios";

//定义函数统计客户地区分布
function countCustomerArea(){
  //发送ajax请求，获得统计数据
  axios.get("http://localhost:8080/countCust")
  .then((response)=>{

    //响应成功渲染图表
    var custDom = document.getElementById('main');
    var custChart = echarts.init(custDom);
    var option = {
      title: {
        text: '客户地区分布统计',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      series: [
        {
          name: '客户分布',
          type: 'pie',
          radius: [20, 140],
          center: ['50%', '50%'],
          roseType: 'area',
          itemStyle: {
            borderRadius: 5
          },
          data:response.data
        }
      ]
    };

    option && custChart.setOption(option);

  })
  .catch((error)=>{
    console.log(error);
  })

}
//加载视图调用函数
onMounted(function(){
  countCustomerArea();
})
</script>

<style scoped>

</style>