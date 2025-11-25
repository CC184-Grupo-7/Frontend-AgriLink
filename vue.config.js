const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production'
    ? '/Frontend-AgriLink/'     
    : '/',               
  
  transpileDependencies: true,
  
  devServer: {
    port: 8080,
    open: false,          
    historyApiFallback: true
  }
})