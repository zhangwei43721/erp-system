<template>
  <h2>客户投诉列表</h2>
  <el-form :inline="true" :model="condForm">
    <el-form-item label="投诉单号">
      <el-input v-model="condForm.id" />
    </el-form-item>
    <el-form-item label="问题描述">
      <el-input v-model="condForm.question" />
    </el-form-item>

    <br />
    <el-form-item label="紧急程度" style="width: 22%">
      <el-select v-model="condForm.grade" placeholder="请选择....">
        <el-option label="普通" value="普通" />
        <el-option label="加急" value="加急" />


      </el-select>
    </el-form-item>
    <el-form-item label="处理状态" style="width: 22%">
      <el-select v-model="condForm.state" placeholder="请选择....">
        <el-option label="未处理" value="未处理" />
        <el-option label="已处理" value="已处理" />
        <el-option label="未回访" value="未回访" />
        <el-option label="已回访" value="已回访" />

      </el-select>
    </el-form-item>
    <br />
    <el-form-item>
      <el-button type="primary" @click="subQueryAfter">查询</el-button>

    </el-form-item>
  </el-form>

  <hr />

  <el-table :data="afterSaleList" stripe style="width: 100%">
    <el-table-column prop="id" label="投诉编号" />
    <el-table-column prop="custName" label="客户姓名" />
    <el-table-column prop="question" label="问题类型" />
    <el-table-column prop="state" label="处理状态" />
    <el-table-column prop="grade" label="紧急程度" />
    <el-table-column prop="level" label="投诉满意度" />

    <el-table-column fixed="right" label="操作" width="200">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="openReplayDialog(scope.row.id)">处理
        </el-button>
        <el-button link type="primary" size="small" @click="loadQuestionReplayList(scope.row)">查看处理详情
        </el-button>
      </template>
    </el-table-column>

  </el-table>
  <hr />

  <el-pagination size="small" background :page-size="10" :pager-count="7" layout="prev, pager, next" :total="total"
    class="mt-4" @current-change="handlerSalePageChange" />

  <!-- 添加对话框控件 -->
  <!-- 回显客户信息的对话框 -->
  <el-dialog v-model="dialogReplayVisible" width="80%">
    <h2>回复客户投诉</h2>

    <!-- 对话框中添加form -->
    <el-form :model="replayForm" label-width="120px">
      <el-form-item label="回复内容">
        <el-input v-model="replayForm.content" style="width: 80%;height: 120px" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="subReplayForm">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>


  <!-- 添加对话框控件 -->
  <!-- 回复列表对话框 -->
  <el-dialog v-model="dialogReplayListVisible" width="80%">
    <h2>回复列表</h2>
    <div style="text-align: left">

      <el-text>投诉人:{{ question.custName }}</el-text><br />
      <el-text>投诉问题:{{ question.quesDesc }}</el-text>
      <!--   table    -->
      <el-table :data="replaysList" stripe style="width: 100% ;height: 200px">
        <el-table-column prop="id" label="编号" />
        <el-table-column prop="redate" label="时间" />
        <el-table-column prop="score" label="评分" />
        <el-table-column prop="content" label="内容" />
        <!--        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scope">
            <el-button link type="primary" size="small"
                      @click="openReplayDialog(scope.row.id)">处理
            </el-button>
            <el-button link type="primary" size="small"
                      @click="loadQuestionReplayList(scope.row)">查看处理详情
            </el-button>
          </template>
        </el-table-column>-->

      </el-table>

      <!--   分页    -->
      <hr />

      <el-pagination size="small" background :page-size="10" :pager-count="7" layout="prev, pager, next" :total="totalReplay"
        class="mt-4" @current-change="handlerReplayPageChange" />

    </div>


  </el-dialog>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { customerApi } from "@/api/customer";
//数据库总记录数
const total = ref(0)
//声明投诉列表集合
const afterSaleList = ref([]);
//定义封装查询条件的表单对象
const condForm = reactive({
  id: '',
  question: '',
  grade: '',
  level: ''
});
//定义函数发生ajax请求
function queryAfterSaleList(pageNum) {
  condForm.pageNum = pageNum;
  customerApi.getAfterSaleList(condForm)
    .then((response) => {
      afterSaleList.value = response.data.afterSalesList;
      total.value = response.data.total;
    })
    .catch((error) => {
      console.log(error);

    });
}
//加载视图进行调用
onMounted(function () {
  queryAfterSaleList(1);
});
//定义函数提交分页请求
function handlerSalePageChange(pageNum) {
  queryAfterSaleList(pageNum);
}
//定义函数提交查询条件
function subQueryAfter() {
  queryAfterSaleList(1);
}
//定义对话框状态
const dialogReplayVisible = ref(false);
//定义对话框中form表单
const replayForm = reactive({
  content: ''
});
//定义函数打开对话框
function openReplayDialog(qid) {
  dialogReplayVisible.value = true;
  replayForm.quesId = qid;
}
//发送ajax请求
function subReplayForm() {
  //发送aajx请求
  customerApi.saveReply(replayForm)
    .then((response) => {
      if (response.data.code == 200) {
        dialogReplayVisible.value = false;
        replayForm.content = '';  //清空回复内容
        ElMessage(response.data.message);
      } else {
        ElMessage(response.data.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
//定义回复列表对话框状态
const dialogReplayListVisible = ref(false);
//定义回显投诉人和投诉内容的对象数据
const question = reactive({
  custName: '',
  quesDesc: ''
})
//定义total。保存回复总记录数
const totalReplay = ref(0);
//定义回复列表数据
const replaysList = ref([]);
//声明变量保存投诉id
let qid = 0;
//打开对话框加载恢复列表
function loadQuestionReplayList(row) {
  dialogReplayListVisible.value = true;
  question.custName = row.custName;
  question.quesDesc = row.question;
  qid = row.id;
  //发送ajax请求
  customerApi.getReplyList(row.id)
    .then((response) => {
      replaysList.value = response.data.replayList;
      totalReplay.value = response.data.total;
    })
    .catch((error) => {
      console.log(error);
    })
}

//提交分页查询参数的请求
function handlerReplayPageChange(pageNum) {
  //发送ajax请求
  customerApi.getReplyList(qid, pageNum)
    .then((response) => {
      replaysList.value = response.data.replayList;
      totalReplay.value = response.data.total;
    })
    .catch((error) => {
      console.log(error);
    })
}
</script>

<style scoped></style>