const { error } = require('../utils/response');

function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // 处理业务逻辑错误
  if (err.statusCode && err.message) {
    return res.status(err.statusCode).json(error(err.statusCode, err.message));
  }

  // 默认 500 错误
  res.status(500).json(error(500, '服务器内部错误'));
}

module.exports = errorHandler;
