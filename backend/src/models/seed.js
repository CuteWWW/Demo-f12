const db = require('../config/db');
const bcrypt = require('bcryptjs');

function initDatabase() {
  // 创建用户表
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      avatar TEXT
    );
  `);

  // 创建图书表
  db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      publisher TEXT,
      description TEXT,
      cover TEXT,
      category TEXT NOT NULL,
      owner_id INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'available',
      borrower_id INTEGER,
      borrowed_at TEXT,
      due_date TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // 创建借阅历史表
  db.exec(`
    CREATE TABLE IF NOT EXISTS borrow_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      action TEXT NOT NULL,
      time TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // 检查是否已有数据，避免重复插入
  const userCount = db.query('SELECT COUNT(*) as count FROM users').get();
  if (userCount.count > 0) {
    return;
  }

  // 插入种子用户
  const hashedPassword = bcrypt.hashSync('123456', 10);
  const insertUser = db.prepare(`
    INSERT INTO users (username, password, name, avatar)
    VALUES (?, ?, ?, ?)
  `);

  const users = [
    ['zhangsan', hashedPassword, '张三', 'https://example.com/avatar1.jpg'],
    ['lisi', hashedPassword, '李四', 'https://example.com/avatar2.jpg'],
    ['wangwu', hashedPassword, '王五', 'https://example.com/avatar3.jpg']
  ];
  users.forEach(u => insertUser.run(...u));

  // 插入种子图书
  const insertBook = db.prepare(`
    INSERT INTO books (title, author, publisher, description, cover, category, owner_id, status, borrower_id, borrowed_at, due_date, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertBook.run(
    'JavaScript高级程序设计',
    'Matt Frisbie',
    '人民邮电出版社',
    '本书是JavaScript开发者必备的经典教程...',
    'https://example.com/cover1.jpg',
    '技术',
    1,
    'available',
    null,
    null,
    null,
    '2026-05-10T10:00:00Z'
  );

  insertBook.run(
    '百年孤独',
    '加西亚·马尔克斯',
    '南海出版公司',
    '魔幻现实主义文学代表作...',
    'https://example.com/cover2.jpg',
    '文学',
    2,
    'borrowed',
    3,
    '2026-05-12T09:00:00Z',
    '2026-05-26T09:00:00Z',
    '2026-05-08T14:30:00Z'
  );

  // 插入借阅历史记录（对应百年孤独）
  const insertHistory = db.prepare(`
    INSERT INTO borrow_history (book_id, user_id, action, time)
    VALUES (?, ?, ?, ?)
  `);

  insertHistory.run(2, 1, 'borrow', '2026-05-09T10:00:00Z');
  insertHistory.run(2, 1, 'return', '2026-05-11T15:00:00Z');

  console.log('数据库初始化完成，种子数据已插入');
}

module.exports = { initDatabase };
