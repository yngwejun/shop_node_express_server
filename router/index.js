const express = require('express')
const router = express.Router()

// router.get('/',(req, res, next) => {
//   console.log(req.body)
//   res.send(JSON.stringify({"hello":"hello"}))
// })

// 挂载其它路由
router.use(require('./user'))

module.exports = router