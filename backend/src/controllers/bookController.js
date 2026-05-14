const db = require('../config/db');
const { success, error } = require('../utils/response');

const VALID_CATEGORIES = ['技术', '文学', '管理', '其他'];

/**
 * 获取图书列表
 * GET /api/books?keyword=&category=
 */
function getBooks(req, res, next) {
  try {
    const { keyword, category } = req.query;

    let sql = `
      SELECT
        b.id,
        b.title,
        b.author,
        b.cover,
        b.category,
        b.status,
        b.created_at,
        u.id as owner_id,
        u.name as owner_name,
        bu.id as borrower_id,
        bu.name as borrower_name
      FROM books b
      LEFT JOIN users u ON b.owner_id = u.id
      LEFT JOIN users bu ON b.borrower_id = bu.id
      WHERE 1=1
    `;
    const params = [];

    if (keyword) {
      sql += ` AND (b.title LIKE ? OR b.author LIKE ?)`;
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    if (category) {
      sql += ` AND b.category = ?`;
      params.push(category);
    }

    sql += ` ORDER BY b.created_at DESC`;

    const rows = db.query(sql).all(...params);

    const list = rows.map(row => ({
      id: row.id,
      title: row.title,
      author: row.author,
      cover: row.cover,
      category: row.category,
      owner: {
        id: row.owner_id,
        name: row.owner_name
      },
      status: row.status,
      borrower: row.borrower_id ? {
        id: row.borrower_id,
        name: row.borrower_name
      } : null,
      createdAt: row.created_at
    }));

    res.json(success({ list, total: list.length }));
  } catch (err) {
    next(err);
  }
}

/**
 * 获取图书详情
 * GET /api/books/:id
 */
function getBookById(req, res, next) {
  try {
    const { id } = req.params;

    const book = db.query(`
      SELECT
        b.*,
        u.id as owner_id,
        u.name as owner_name,
        u.avatar as owner_avatar,
        bu.id as borrower_id,
        bu.name as borrower_name
      FROM books b
      LEFT JOIN users u ON b.owner_id = u.id
      LEFT JOIN users bu ON b.borrower_id = bu.id
      WHERE b.id = ?
    `).get(id);

    if (!book) {
      return res.status(404).json(error(404, '图书不存在'));
    }

    // 获取借阅历史
    const historyRows = db.query(`
      SELECT
        bh.user_id,
        u.name as user_name,
        bh.action,
        bh.time
      FROM borrow_history bh
      JOIN users u ON bh.user_id = u.id
      WHERE bh.book_id = ?
      ORDER BY bh.time ASC
    `).all(id);

    const borrowHistory = historyRows.map(h => ({
      userId: h.user_id,
      userName: h.user_name,
      action: h.action,
      time: h.time
    }));

    const result = {
      id: book.id,
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      description: book.description,
      cover: book.cover,
      category: book.category,
      owner: {
        id: book.owner_id,
        name: book.owner_name,
        avatar: book.owner_avatar
      },
      status: book.status,
      borrower: book.borrower_id ? {
        id: book.borrower_id,
        name: book.borrower_name,
        borrowedAt: book.borrowed_at,
        dueDate: book.due_date
      } : null,
      borrowHistory,
      createdAt: book.created_at
    };

    res.json(success(result));
  } catch (err) {
    next(err);
  }
}

/**
 * 捐书（新增图书）
 * POST /api/books
 */
function createBook(req, res, next) {
  try {
    const { title, author, publisher, description, category, cover } = req.body;
    const user = req.user;

    // 必填校验
    if (!title) {
      return res.status(400).json(error(400, '缺少必填参数: title'));
    }
    if (!author) {
      return res.status(400).json(error(400, '缺少必填参数: author'));
    }

    // 分类校验
    if (category && !VALID_CATEGORIES.includes(category)) {
      return res.status(400).json(error(400, 'category 必须是: 技术/文学/管理/其他'));
    }

    const insert = db.prepare(`
      INSERT INTO books (title, author, publisher, description, category, cover, owner_id, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'available')
    `);

    const result = insert.run(
      title,
      author,
      publisher || null,
      description || null,
      category || '其他',
      cover || null,
      user.id
    );

    const newBookId = result.lastInsertRowid;

    res.json(success({
      id: newBookId,
      title,
      status: 'available',
      owner: {
        id: user.id,
        name: user.name
      },
      createdAt: new Date().toISOString()
    }));
  } catch (err) {
    next(err);
  }
}

module.exports = { getBooks, getBookById, createBook };
