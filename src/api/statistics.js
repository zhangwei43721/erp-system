import request from './config'

export const statisticsApi = {
  // 获取年份列表
  getYearList() {
    return request.get('/queryYear')
  },
  // 获取某年统计数据
  getYearNum(year) {
    return request.get(`/countNum?year=${year}`)
  },
  // 年度月度销售统计
  getYearMonthSell(year) {
    return request.get(`/countSell?year=${year}`)
  },
  // 员工年龄分布
  getEmpAge() {
    return request.get('/countEmpAge')
  },
  // 员工学历分布
  getEmpEdu() {
    return request.get('/countEmpEdu')
  },
  // 客户地区分布
  getCustomerArea() {
    return request.get('/countCust')
  },
  // 投诉类型统计
  getQuestionType() {
    return request.get('/countQuestionType')
  },
  // 投诉状态统计
  getQuestionState() {
    return request.get('/countQuestionState')
  }
}
