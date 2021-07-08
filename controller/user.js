const { User } = require('../model')
const jwt = require('../util/jwt')
const { jwtSecret } = require('../config/config.default')

// 用户登录
exports.login = async (req, res, next) => {
  try{
    // 1.数据验证
    // 2.生成token
    const user = req.user.toJSON()
    const token = await jwt.sign({
      userId: user._id
    }, jwtSecret, {
      expiresIn: 60*60
    })
    // 3.发送成功响应（包含token的用户信息）
    delete user.password
    res.status(200).json({
      ...user,
      token
    })
  }catch (err) {
    // 抛给异常处理中间件
    next(err)
  }
}

// 用户注册
exports.register = async (req, res, next) => {
  try{
    // 1.获取请求体数据
    // 2.基本数据验证
    // 3.业务数据验证
    
    let user = new User(req.body.user)

    // 4.验证通过 ==> 将数据保存到数据库
    await user.save()

    // 将mongoose架构对象转换成普通对象，才能删除返回携带的密码
    user = user.toJSON()
    delete user.password

    // 5.发送成功响应
    res.status(201).json({ user })
  }catch (err) {
    // 抛给异常处理中间件
    next(err)
  }
}

// 获取当前登录用户
exports.getCurrentUser = async (req, res, next) => {
  try{
    // console.log(req.headers)
    res.status(200).json({
      user: req.user
    })
  }catch (err) {
    next(err)
  }
}
