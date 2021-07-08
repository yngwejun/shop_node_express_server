const mongoose = require('mongoose')
const { dbUrl } = require('../config/config.default')

// 连接MongoDB数据库
mongoose.connect(dbUrl)

const db = mongoose.connection

db.on('err', err => {
  console.log('数据库连接失败...',err)
})

// 成功提醒 & 失败警告
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  // we're connected!
  console.log('数据库连接成功...')
})

// 组织导出模型构造函数
module.exports = {
  User: mongoose.model('User',require('./user'))
}
