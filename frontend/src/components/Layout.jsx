import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isLoginPage = location.pathname === '/login';
  if (isLoginPage) return children;

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="container header-inner">
          <Link to="/books" className="brand">
            <BookOpen size={28} strokeWidth={2} />
            <span>图书共享</span>
          </Link>
          <nav className="nav-links">
            <Link to="/books" className={location.pathname === '/books' ? 'active' : ''}>
              图书列表
            </Link>
            <Link to="/books/donate" className={location.pathname === '/books/donate' ? 'active' : ''}>
              我要捐书
            </Link>
          </nav>
          <div className="user-section">
            {user && (
              <>
                <div className="user-info">
                  <User size={18} />
                  <span>{user.name}</span>
                </div>
                <button className="btn btn-secondary logout-btn" onClick={handleLogout}>
                  <LogOut size={16} />
                  <span>退出</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="app-main">
        {children}
      </main>
    </div>
  );
}
