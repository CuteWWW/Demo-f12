const { Database } = require('bun:sqlite');
const path = require('path');

const dbPath = path.join(__dirname, '../../database/library.db');
const db = new Database(dbPath);

// 启用外键约束
db.exec('PRAGMA foreign_keys = ON;');

module.exports = db;
