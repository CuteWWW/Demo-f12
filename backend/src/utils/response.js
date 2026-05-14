/**
 * 统一 API 响应格式工具
 */

function success(data = null, message = 'success') {
  return { code: 0, message, data };
}

function error(code, message, data = null) {
  return { code, message, data };
}

module.exports = { success, error };
