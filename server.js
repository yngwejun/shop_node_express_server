
const express = require('express')
const morgan = require('morgan')
const router = require('./router')
const cors = require('cors')
const errorHandler = require('./middleware/error-handler')
require('./model')

// 获取服务器端口
const PORT = process.env.PORT || 5000

// 创建服务器应用
const server = express()

// 解析请求体
server.use(express.json())

// 使用中间件,用于输出日志
server.use(morgan('dev'))

// 为客户端提供跨域资源请求
server.use(cors())

// 挂载路由,以api作为前缀
server.use('/api',router)

// 错误处理,必须放到路由后面
server.use(errorHandler())

server.listen(PORT,() => {
  console.log(`serve running at port http://localhost:${PORT} ...`)
})