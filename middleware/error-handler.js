// 导入内置模块
const util = require('util')

// 导出一个函数
module.exports = () => {
  return (err, req, res, next) => {
    res.status(500).json({
      error: util.format(err)
    })
  }
}