const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    config.plugin('define').tap((args) => {
      args[0]['__VUE_OPTIONS_API__'] = true // 启用 Options API（根据需要可设为 false）
      args[0]['__VUE_PROD_DEVTOOLS__'] = false // 生产环境禁用开发者工具
      args[0]['__VUE_PROD_HYDRATION_MISMATCH_DETAILS__'] = false // 禁用水合不匹配详情
      return args
    })
  }
})