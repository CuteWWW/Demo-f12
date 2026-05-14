import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!username.trim()) {
      setError('请输入用户名');
      setIsLoading(false);
      return;
    }
    if (!password.trim()) {
      setError('请输入密码');
      setIsLoading(false);
      return;
    }

    const result = await login(username.trim(), password.trim());
    setIsLoading(false);

    if (result.success) {
      navigate('/books');
    } else {
      setError(result.error || '登录失败');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card fade-in">
        <div className="login-brand">
          <BookOpen size={40} strokeWidth={1.5} />
          <h1>图书共享</h1>
          <p>企业内部图书借阅与捐赠平台</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">用户名</label>
            <input
              id="username"
              type="text"
              placeholder="请输入用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">密码</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={isLoading}>
            {isLoading ? '登录中...' : '登录'}
          </button>
        </form>

        <div className="login-hint">
          <p>测试账号：</p>
          <p>zhangsan / 123456（张三）</p>
          <p>lisi / 123456（李四）</p>
          <p>wangwu / 123456（王五）</p>
        </div>
      </div>
    </div>
  );
}
