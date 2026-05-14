import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookPlus, CheckCircle } from 'lucide-react';
import { createBook } from '../api/client';

const categories = ['技术', '文学', '管理', '其他'];

export default function DonateBookPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    author: '',
    publisher: '',
    description: '',
    category: '技术',
    cover: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = '请输入书名';
    if (!form.author.trim()) newErrors.author = '请输入作者';
    if (!categories.includes(form.category)) newErrors.category = '请选择有效的分类';
    return newErrors;
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    const res = await createBook(form);
    setIsLoading(false);

    if (res.code === 0) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/books');
      }, 1500);
    } else {
      setErrors({ submit: res.message });
    }
  };

  if (success) {
    return (
      <div className="container donate-page fade-in">
        <div className="success-state">
          <CheckCircle size={64} strokeWidth={1.5} />
          <h2>捐书成功！</h2>
          <p>感谢您的分享，图书已添加到图书馆。</p>
          <button className="btn btn-primary" onClick={() => navigate('/books')}>
            返回图书列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container donate-page fade-in">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} />
        返回
      </button>

      <div className="donate-card">
        <div className="donate-header">
          <BookPlus size={28} />
          <h2>我要捐书</h2>
          <p>分享您的图书，让更多人受益</p>
        </div>

        <form className="donate-form" onSubmit={handleSubmit}>
          {errors.submit && <div className="error-message">{errors.submit}</div>}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">
                书名 <span className="required">*</span>
              </label>
              <input
                id="title"
                type="text"
                placeholder="请输入书名"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
              />
              {errors.title && <span className="field-error">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="author">
                作者 <span className="required">*</span>
              </label>
              <input
                id="author"
                type="text"
                placeholder="请输入作者"
                value={form.author}
                onChange={(e) => handleChange('author', e.target.value)}
              />
              {errors.author && <span className="field-error">{errors.author}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="publisher">出版社</label>
              <input
                id="publisher"
                type="text"
                placeholder="请输入出版社"
                value={form.publisher}
                onChange={(e) => handleChange('publisher', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">
                分类 <span className="required">*</span>
              </label>
              <select
                id="category"
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.category && <span className="field-error">{errors.category}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="cover">封面图 URL</label>
            <input
              id="cover"
              type="text"
              placeholder="https://example.com/cover.jpg"
              value={form.cover}
              onChange={(e) => handleChange('cover', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">简介</label>
            <textarea
              id="description"
              rows={4}
              placeholder="请输入图书简介..."
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
              取消
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? '提交中...' : '确认捐书'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
