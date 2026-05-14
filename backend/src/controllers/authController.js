const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { success, error } = require('../utils/response');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRES = '24h';

function login(req, res, next) {
  try {
    const { username, password } = req.body;

    // 参数校验
    if (!username) {
      return res.status(400).json(error(400, '缺少必填参数: username'));
    }
    if (!password) {
      return res.status(400).json(error(400, '缺少必填参数: password'));
    }

    // 查询用户
    const user = db.query('SELECT * FROM users WHERE username = ?').get(username);
    if (!user) {
      return res.status(401).json(error(1001, '用户名或密码错误'));
    }

    // 密码比对
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json(error(1001, '用户名或密码错误'));
    }

    // 生成 JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, name: user.name },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRES }
    );

    res.json(success({
      token,
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar
      }
    }));
  } catch (err) {
    next(err);
  }
}

module.exports = { login };
