require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const errorHandler = require('./middleware/errorHandler');
const { initDatabase } = require('./models/seed');

const app = express();
const PORT = process.env.PORT || 3000;

// 解析 JSON 请求体
app.use(express.json());

// 初始化数据库
initDatabase();

// 路由
app.use('/api', authRoutes);
app.use('/api/books', bookRoutes);

// 全局错误处理
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
