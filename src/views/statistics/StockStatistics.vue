<template>
  <div style="display: flex;">
    <div ref="pieChartContainer" style="width: 50%; height: 400px;"></div>
    <div ref="barChartContainer" style="width: 50%; height: 400px;"></div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts';
import { onMounted, ref } from 'vue';

// 员工地区分布数据
const empData = ref([
  { name: '北京', value: 100 },
  { name: '上海', value: 120 },
  { name: '天津', value: 130 },
  { name: '重庆', value: 70 },
  { name: '武汉', value: 90 }
]);

// 模拟销售数据
const sellData = ref({
  xdata: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  ydata: Array.from({ length: 12 }, () => Math.floor(Math.random() * (10000 - 500 + 1)) + 500)
});

// DOM容器引用
const pieChartContainer = ref(null);
const barChartContainer = ref(null);

// 渲染饼图
function renderPieChart() {
  const myEcharts = echarts.init(pieChartContainer.value);
  const option = {
    tooltip: { trigger: 'item' },
    legend: { top: '5%', left: 'center' },
    series: [
      {
        name: '员工地区分布',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
        label: { show: false, position: 'center' },
        emphasis: { label: { show: true, fontSize: 40, fontWeight: 'bold' } },
        labelLine: { show: false },
        data: empData.value
      }
    ]
  };
  myEcharts.setOption(option);
}

// 渲染柱状图
function renderBarChart() {
  const myCharts = echarts.init(barChartContainer.value);
  const option = {
    xAxis: { type: 'category', data: sellData.value.xdata },
    yAxis: { type: 'value' },
    series: [
      {
        data: sellData.value.ydata,
        type: 'bar',
        showBackground: true,
        backgroundStyle: { color: 'rgba(180, 180, 180, 0.2)' }
      }
    ]
  };
  myCharts.setOption(option);
}

onMounted(() => {
  renderPieChart();
  renderBarChart();
});
</script>