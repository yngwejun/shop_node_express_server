# Express环境搭建

[返回文档主页](../README.md)

Express是极简的，仅仅提供web开发的基础功能，但是它使用中间件的方式集成了许多外部插件来处理http请求

* body-parser:解析`http`请求体
* compression:压缩`http`响应
* cookie-parser:解析cookie数据
* `cors`:解决跨越资源请求
* morgan：`http`请求日志记录

### Express 中间件

在express中，中间件是一个可以访问请求对象，响应对象和调用next方法的一个函数

```js
// next 下一个中间件
app.use(function(req,res,next){
    conslo.log(req.url,req.method,date.now())
    // 交出执行权，往后匹配执行
    next()
})
```

解决webstorm 中express下划线提示

```sh
npm i -D @types/express
```

### 数据库

```sh
npm i mongoose
```

```js
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

const Cat = mongoose.model('Cat', { name: String });

const kitty = new Cat({ name: 'zs' });
kitty.save().then(() => console.log('meow'));
```

### 数据验证

```sh
npm i express-validator
```

```
const { body, validationResult } = require('express-validator')
```

### JWT身份认证

JSON Web Token 是目前最流行的跨域认证解决方案

##### 跨域认证问题

流程：

> - 用户向服务器发送用户名和密码
> - 服务器通过后，在当前会话（session）里保存相关数据（用户角色，登录时间等）
> - 服务器向用户返回一个session_id，写入用户的cookie
> - 用户随后每一次请求，都会通过cookie，将session_id传回服务器
> - 服务器收到session_id，找到前期保存的数据，由此得知用户的身份

这种方案，扩展姓不好，如果服务器集群，就要求session共享

> - 一种解决方案是，session数据持久化，写入数据库或别的持久层，架构清晰，但工程量大

> - 另一种方案是不保存session数据，所有数据都保存在客户端，每次请求都发回服务器，JWT这就是这种方案

##### JWT原理

服务器认证以后生成一个JSON对象，发回给用户，比如：

```json
{
    "姓名": "某某",
    "角色": "管理员"，
    "到期时间": "2021年x月x日..."
}
```

为了防止用户篡改数据，服务器在生成这个对象的时候，会加上签名

##### JWT的数据结构

它是一个很长的字符串，中间用（.）分隔成三部分，依次为：

> - Header(头部)
> - Payload(负载)
> - Signature(签名)

##### Header

Header是一个JSON对象，描述JWT的元数据，像这样：

```json
{
    "alg": "HS256",
    "typ": "JWT"
}
```

> - "alg"表示签名的算法，默认是HMAC SHA256(HS256)
> - "typ"表示这个令牌（token）的类型（type)

##### Paayload

Paayload也是一个JSON对象，用来存放实际需要传递的数据，JWT规定了7个官方字段，供选用

> - iss(issuer)：签发人
> - exp(expiration time)：过期时间
> - sub(subject)：主题
> - aud(audience)：受众
> - nbf(Not Before)：生效时间
> - iat(Issued At)：签发时间
> - iti(JWT ID)：编号

除了官方字段，还可以自定义私有字段，比如：

```json
{
    "sub": "14526485",
    "name": "xxx",
    "admin": true
}
```

>
>
>**注：**JWT默认是不加密的，任何人都可以读取，不要把私密信息放到这个部分
>
>这个JSON对象也要使用base64URL算法转换成字符串
>
>

##### Signature

Signature部分是对前两部分的签名，防止数据的篡改



首先需要指定一个密钥（secret），这个密钥只有服务器知道，不能泄露给用户，然后在Header里指定签名算法（默认是HMAC SHA256）按照下面的公式生成签名：

```js
HMACSHA256(base64URLEncode(header) 
           + "." 
           +  base64URLEncode(payload),
          secret)
```

算出签名后，把Header,Payload,Signature三个部分拼成一个字符串，每个部分之间用（.）分隔，并返回给用户

##### JWT使用方式

客户端收到服务端返回的JWT，可以存储在cookie里面，也可以存储在localStorage

此后，客户端每次与服务端通信，都要携带这个JWT，可以放到cookie里面自动发送但是不能跨域，根号的做法是放在HTTP请求的头信息`Authorization`字段里面

```sh
Authorization: Bearer <token>
```

另一种做法是，跨域的时候，JWT放在POST请求的数据体里面

##### JWT特点

> - JWT默认是不加密的，但是也可以加密，生成原始的Token以后，可以用密钥在加密一次
> - JWT不加密的情况下，不能将秘密数据写入到JWT
> - JWT不仅可以认证，也可以用于交换信息，有效使用JWT，可以降低服务器查询数据库的次数
> - 缺点：由于服务器不保存session状态，因此无法在使用的过程中废止某个token，或者更爱某个token的权限，一旦签发，在到期之前始终有效，除非服务器部署额外的逻辑
> - JWT本身包含了认证信息，一旦泄露，任何人都可以获得该令牌的使用权，伪类减少到盗用，JWT有效期应该设置得比较短，对于一些比较重要得权限，使用时应该再次对用户进行认证
> - 为了减少盗用，JWT不应该使用HTTP协议明码传输，要使用HTTPS协议传输

##### 第三方包

```sh
npm i jsonwebtoken
```

