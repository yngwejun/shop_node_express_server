# RESTful接口设计规范

[返回文档主页](../README.md)

### 菜鸟教程

[菜鸟教程地址](https://www.runoob.com/w3cnote/restful-architecture.html)

### 协议

API与用户的通信协议，尽量使用https协议

### 域名

应该尽量将API部署在专用的域名之下

```sh
https://www.example.com
```

如果确定API很简单，不会有进一步扩展，可以考虑放在主域名下

```sh
https://www.example.com/org/api
```

### 版本

应该将API的版本号放入URL

```sh
https://www.example.com/v1/
```

另一种做法是，将版本号放入https的头信息中，但不如放在URL方便和直观

### 路径

路径由称终点（endport），表示API具体网址。

在RESTful架构中，每个网址代表一种资源，所以网址中不能有动词，只能有名词而且所用的名词，URL 是名词，那么应该使用复数，还是单数？
 这没有统一的规定。

### HTTP动词

对于资源的具体操作类型，由HTTP动词表示。

常用的HTTP动词有以下5个及对应的SQL命令

* GET(读取)：从服务器读取出一项或多项资源
* POST（创建）：从服务器新建一个资源
* PUT（完整更新）：从服务器更新资源（客户端提供改变后的完整资源）
* PATCH（部分更新）：从服务器更新资源（客户端提供改变的属性）
* DELETE（删除）：从服务器删除资源

还有两个不常用的HTTP动词

* HEAD：获取资源的元数据
* OPTIONS：获取信息，关于资源的哪些属性是客户端可以改变的

例子：

> - GET /zoos：列出所有动物园
> - POST /zoos：新建一个动物园
> - GET /zoos/ID：获取某个指定动物园的信息
> - PUT /zoos/ID：更新某个指定动物园的信息（提供该动物园的全部信息）
> - PATCH /zoos/ID：更新某个指定动物园的信息（提供该动物园的部分信息）
> - DELETE /zoos/ID：删除某个动物园
> - GET /zoos/ID/animals：列出某个指定动物园的所有动物
> - DELETE /zoos/ID/animals/ID：删除某个指定动物园的指定动物

### 过滤信息

如果记录数量多，服务器不可能将它们返回给用户，API应该提供参数，过滤返回结果

以下是一些常用的参数：

* ？limit=10：返回指定记录的数量
* ？offset=10：指定返回记录的开始位置
* ？page=2&per_page=100：指定第几页以及每页的记录数
* ？sortby=name&order=asc：指定返回结果按照哪个属性排序，以及排序顺序
* ？animal_type_id=1：指定筛选条件

参数的设计允许冗余，即允许API路径和URL参数偶尔出现重复，如：GET/zoo/ID/anmals与GET/anals?zoo_id=ID的含义是相同的

### 状态码

客户端的每一次请求，服务端都必须给出回应，包括HTTP状态码和数据两部分。

HTTP状态码是一个三位数，分为5个类别。

* 1xx：相关信息
* 2xx：操作成功
* 3xx：重定向
* 4xx：客户端错误
* 5xx：服务端错误

常见的状态码：

* 200 ok-[GET]：服务器成功返回用户请求数据
* 201 [POST/PUTPATCH]：用户新建或修改数据成功
* 202：表示请求已进入后台排队（异步任务）
* 204 [DELETE]：用户删除数据成功
* 400 [POST/PUTPATCH]：用户发出请求时有错误，服务器没有进行新建或修改的操作
* 401：表示用户没有权限（令牌，用户名，密码错误）
* 403：用户得到权限但是访问是被禁止的
* 404：用户发出的请球针对的是不存在的记录，服务器没有进行操作
* 406 [GET]：用户请求的格式不可得，（如：用户请求json格式，但是只有XML格式
* 410 [GET]：用户请求得资源被永久删除，且不会再得到得
* 422 [POST/PUTPATCH]：创建一个对象时，发生一个验证错误
* 500：服务器发生错误，用户将无法判断发生得请求是否成功

### 返回结果

API返回的数据格式不应该是纯文本，而应该是一个JSON对象，因为这样才能返回一个标准的结构化数据，所以，服务器回应的HTTP头的`content-type`属性要设置为application/json。

针对不同操作，服务器向用户返回的结果应该符合以下规范：

* GET /conection：返回资源对象的列表（数组）
* GET /conection/resource：返回单个资源对象
* POST /conection：返回新生成的资源对象
* PUT /conection/resource：返回完整的资源对象
* PATCH /conection/resource：返回完整的资源对象
* DELETE 、conection/resource：返回一个空文档

### 错误处理

有一种不恰当的做法是，即使发生错误，也返回200状态码，把错误信息放在数据里面，比如这样：

```json
/* 200 ok */
{
    "status": "failure",
    "data": {
        "error": "....."
    }
}
```

正确的做法是根据HTTP状态码反映发生的错误，具体的错误信息放在数据体里返回。比如：

```json
// 400
{
    "error": "Invalid payload",
    "detail": {
        "surname": "this field is required"
    }
}
```

### 身份认证

基于JWT的接口权限认证：

* 字段名：`Authorization`
* 字段值：`Bearer token`数据

### 跨域处理

可以在服务端设置CORS允许客户端跨域请求资源