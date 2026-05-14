# 图书共享后端

## 开发进度

✅ **已完成** — 4 个核心接口及基础配置全部开发完毕，已通过全流程接口测试。

---

## 技术栈

| 技术 | 说明 |
|------|------|
| Bun | 运行时 + 包管理 |
| Express | Web 框架 |
| `bun:sqlite` | 内置 SQLite 驱动（无需额外编译依赖） |
| jsonwebtoken | JWT 认证 |
| bcryptjs | 密码哈希 |
| dotenv | 环境变量管理 |

---

## 项目结构

```
backend/
├── package.json              # Bun 依赖与脚本
├── .env                      # 环境变量（不提交到 Git）
├── .env.example              # 环境变量模板
├── database/
│   └── library.db            # SQLite 数据库文件
└── src/
    ├── index.js              # Express 入口 + 数据库初始化
    ├── config/
    │   └── db.js             # SQLite 连接实例
    ├── models/
    │   └── seed.js           # 建表 + 种子数据（首次启动自动执行）
    ├── middleware/
    │   ├── auth.js           # JWT 认证中间件
    │   └── errorHandler.js   # 全局异常捕获
    ├── utils/
    │   └── response.js       # 统一 {code, message, data} 响应格式
    ├── controllers/
    │   ├── authController.js # 登录逻辑
    │   └── bookController.js # 图书列表/详情/新增逻辑
    └── routes/
        ├── auth.js           # /api/login
        └── books.js          # /api/books + /api/books/:id
```

---

## 已实现的接口

### 1. 登录
```
POST /api/login
```

**请求体：**
```json
{
  "username": "zhangsan",
  "password": "123456"
}
```

**成功响应：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "name": "张三",
      "avatar": "https://example.com/avatar1.jpg"
    }
  }
}
```

**错误响应：**
- `400` — 缺少必填参数: username / password
- `1001` — 用户名或密码错误

---

### 2. 图书列表
```
GET /api/books?keyword=JavaScript&category=技术
```

**查询参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 否 | 按书名或作者模糊搜索 |
| category | string | 否 | 分类筛选：技术/文学/管理/其他 |

**响应示例：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [...],
    "total": 2
  }
}
```

**认证：** 需要 `Authorization: Bearer <token>` 请求头。

---

### 3. 图书详情
```
GET /api/books/:id
```

**响应包含：** 完整图书信息 + 拥有者 + 当前借阅人 + `borrowHistory` 借阅历史。

**错误响应：**
- `404` — 图书不存在

---

### 4. 捐书（新增图书）
```
POST /api/books
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体：**
```json
{
  "title": "深入理解计算机系统",
  "author": "Randal E. Bryant",
  "publisher": "机械工业出版社",
  "description": "程序员必读经典...",
  "category": "技术",
  "cover": "https://example.com/cover3.jpg"
}
```

**错误响应：**
- `400` — 缺少必填参数: title / author
- `400` — category 必须是: 技术/文学/管理/其他
- `401` — 未登录或 token 已过期

---

## 数据库表结构

### users（用户表）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | 主键 |
| username | TEXT UNIQUE | 登录账号 |
| password | TEXT | bcrypt 哈希密码 |
| name | TEXT | 显示名称 |
| avatar | TEXT | 头像 URL |

### books（图书表）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | 主键 |
| title | TEXT | 书名 |
| author | TEXT | 作者 |
| publisher | TEXT | 出版社 |
| description | TEXT | 简介 |
| cover | TEXT | 封面图 URL |
| category | TEXT | 分类 |
| owner_id | INTEGER | 拥有者（关联 users.id） |
| status | TEXT | available / borrowed |
| borrower_id | INTEGER | 当前借阅人 |
| borrowed_at | TEXT | 借阅时间 |
| due_date | TEXT | 归还期限 |
| created_at | TEXT | 创建时间 |

### borrow_history（借阅历史表）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | 主键 |
| book_id | INTEGER | 图书 ID |
| user_id | INTEGER | 用户 ID |
| action | TEXT | borrow / return |
| time | TEXT | 操作时间 |

---

## 种子数据

启动服务时自动初始化（仅首次执行）：

| 账号 | 密码 | 名称 |
|------|------|------|
| zhangsan | 123456 | 张三 |
| lisi | 123456 | 李四 |
| wangwu | 123456 | 王五 |

**预置图书：**
1. JavaScript高级程序设计（张三拥有，可借）
2. 百年孤独（李四拥有，已借给王五，含借阅历史）

---

## 快速开始

### 1. 安装依赖
```bash
bun install
```

### 2. 配置环境变量
复制模板文件并修改（可选）：
```bash
cp .env.example .env
```

`.env` 默认内容：
```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

### 3. 启动服务

**生产模式：**
```bash
bun src/index.js
```

**开发模式（热重载）：**
```bash
bun run dev
```

服务默认运行在 http://localhost:3000

---

## API 测试示例

### 登录获取 Token
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"zhangsan","password":"123456"}'
```

### 获取图书列表
```bash
curl -X GET http://localhost:3000/api/books \
  -H "Authorization: Bearer <token>"
```

### 搜索图书
```bash
curl -X GET "http://localhost:3000/api/books?keyword=Java&category=技术" \
  -H "Authorization: Bearer <token>"
```

### 获取图书详情
```bash
curl -X GET http://localhost:3000/api/books/2 \
  -H "Authorization: Bearer <token>"
```

### 捐书
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "深入理解计算机系统",
    "author": "Randal E. Bryant",
    "publisher": "机械工业出版社",
    "description": "程序员必读经典...",
    "category": "技术",
    "cover": "https://example.com/cover3.jpg"
  }'
```

---

## 统一响应格式

所有接口遵循以下响应结构：

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

- `code: 0` — 成功
- `code: 400` — 参数错误
- `code: 401` — 未登录或 token 已过期
- `code: 404` — 资源不存在
- `code: 1001` — 用户名或密码错误

---

## 注意事项

1. **SQLite 文件**：数据库文件位于 `database/library.db`，首次启动会自动建表并插入种子数据。
2. **JWT Secret**：生产环境请务必修改 `.env` 中的 `JWT_SECRET`。
3. **Windows 中文编码**：在 CMD/PowerShell 中直接 `curl` 发送中文 JSON 可能出现编码问题，建议使用 Bun/Node.js 脚本或 API 测试工具（如 Postman、Apifox）进行测试。
