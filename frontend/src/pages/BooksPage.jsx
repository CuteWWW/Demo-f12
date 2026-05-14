import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, BookPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getBooks } from '../api/client';
import BookCard from '../components/BookCard';

const categories = ['全部', '技术', '文学', '管理', '其他'];

export default function BooksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || '全部');

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    const params = {};
    if (keyword.trim()) params.keyword = keyword.trim();
    if (activeCategory !== '全部') params.category = activeCategory;

    const res = await getBooks(params);
    if (res.code === 0) {
      setBooks(res.data.list);
    }
    setIsLoading(false);
  }, [keyword, activeCategory]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleSearch = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (keyword.trim()) newParams.set('keyword', keyword.trim());
    else newParams.delete('keyword');
    setSearchParams(newParams);
    fetchBooks();
  };

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat !== '全部') newParams.set('category', cat);
    else newParams.delete('category');
    setSearchParams(newParams);
  };

  return (
    <div className="books-page fade-in">
      <div className="container">
        {/* 页面头部 */}
        <div className="page-header">
          <h2>图书列表</h2>
          <Link to="/books/donate" className="btn btn-primary donate-btn">
            <BookPlus size={18} />
            我要捐书
          </Link>
        </div>

        {/* 搜索栏 */}
        <form className="search-bar" onSubmit={handleSearch}>
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="搜索书名或作者..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit" className="btn btn-primary search-btn">
            搜索
          </button>
        </form>

        {/* 分类筛选 */}
        <div className="category-filter">
          <Filter size={16} />
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 结果统计 */}
        <div className="result-count">
          共找到 <strong>{books.length}</strong> 本图书
        </div>

        {/* 图书网格 */}
        {isLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>加载中...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="empty-state">
            <BookPlus size={48} strokeWidth={1} />
            <p>暂无图书</p>
            <p className="empty-hint">试试其他搜索条件，或者成为第一位捐书人</p>
          </div>
        ) : (
          <div className="books-grid">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
