const { validationResult } = require('express-validator')

module.exports = validations => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)))

    // 接收错误信息
    const errors = validationResult(req)
    // 如果errors为空，让下一个中间件继续执行
    if (errors.isEmpty()) {
      return next()
    }
    // 如果errors不为空，表明有错误
    res.status(400).json({ errors: errors.array() })
  }
}