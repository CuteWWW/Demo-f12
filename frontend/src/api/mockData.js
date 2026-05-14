export const mockUsers = [
  { id: 1, name: '张三', avatar: 'https://example.com/avatar1.jpg', username: 'zhangsan', password: '123456' },
  { id: 2, name: '李四', avatar: 'https://example.com/avatar2.jpg', username: 'lisi', password: '123456' },
  { id: 3, name: '王五', avatar: 'https://example.com/avatar3.jpg', username: 'wangwu', password: '123456' },
];

export const categories = ['技术', '文学', '管理', '其他'];

export let mockBooks = [
  {
    id: 1,
    title: 'JavaScript高级程序设计',
    author: 'Matt Frisbie',
    publisher: '人民邮电出版社',
    description: '本书是JavaScript开发者必备的经典教程，深入讲解了语言核心、DOM操作、BOM、事件处理等核心知识。第四版全面更新了ES6+新特性，包括Promise、async/await、模块系统等现代开发必备内容。',
    cover: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=400&fit=crop',
    category: '技术',
    ownerId: 1,
    status: 'available',
    borrowerId: null,
    borrowedAt: null,
    dueDate: null,
    borrowHistory: [],
    createdAt: '2026-05-10T10:00:00Z',
  },
  {
    id: 2,
    title: '百年孤独',
    author: '加西亚·马尔克斯',
    publisher: '南海出版公司',
    description: '魔幻现实主义文学代表作，讲述了布恩迪亚家族七代人的传奇故事，以及加勒比海沿岸小镇马孔多的百年兴衰。作品融入神话传说、民间故事、宗教典故等神秘因素，巧妙地糅合了现实与虚幻，展现出一个瑰丽的想象世界。',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
    category: '文学',
    ownerId: 2,
    status: 'borrowed',
    borrowerId: 3,
    borrowedAt: '2026-05-12T09:00:00Z',
    dueDate: '2026-05-26T09:00:00Z',
    borrowHistory: [
      { userId: 1, userName: '张三', action: 'borrow', time: '2026-05-09T10:00:00Z' },
      { userId: 1, userName: '张三', action: 'return', time: '2026-05-11T15:00:00Z' },
    ],
    createdAt: '2026-05-08T14:30:00Z',
  },
  {
    id: 3,
    title: '深入理解计算机系统',
    author: 'Randal E. Bryant',
    publisher: '机械工业出版社',
    description: '程序员必读经典，从程序员的视角详细阐述计算机系统的本质概念，包括信息的表示和处理、程序的机器级表示、处理器体系结构、优化程序性能、存储器层次结构、链接、异常控制流等核心内容。',
    cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=400&fit=crop',
    category: '技术',
    ownerId: 1,
    status: 'available',
    borrowerId: null,
    borrowedAt: null,
    dueDate: null,
    borrowHistory: [],
    createdAt: '2026-05-11T10:00:00Z',
  },
  {
    id: 4,
    title: '重构：改善既有代码的设计',
    author: 'Martin Fowler',
    publisher: '人民邮电出版社',
    description: '软件工程经典之作，详细阐述了重构的原理和最佳实践，介绍了数十种具体的重构手法。本书帮助开发者理解如何在保持代码功能不变的前提下，通过一系列小的修改来改善代码的内部结构。',
    cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop',
    category: '技术',
    ownerId: 2,
    status: 'available',
    borrowerId: null,
    borrowedAt: null,
    dueDate: null,
    borrowHistory: [],
    createdAt: '2026-05-09T10:00:00Z',
  },
  {
    id: 5,
    title: '设计模式',
    author: 'Erich Gamma 等',
    publisher: '机械工业出版社',
    description: '软件设计模式经典，介绍了23种常用的面向对象设计模式。每一种模式都详细描述了其意图、动机、适用场景、结构和实现方式，并通过实际案例展示了如何在软件开发中应用这些模式来解决常见的设计问题。',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop',
    category: '技术',
    ownerId: 3,
    status: 'available',
    borrowerId: null,
    borrowedAt: null,
    dueDate: null,
    borrowHistory: [
      { userId: 1, userName: '张三', action: 'borrow', time: '2026-05-01T10:00:00Z' },
      { userId: 1, userName: '张三', action: 'return', time: '2026-05-10T16:00:00Z' },
    ],
    createdAt: '2026-05-07T10:00:00Z',
  },
];

export function findUserById(id) {
  return mockUsers.find(u => u.id === id);
}

export function findBookById(id) {
  return mockBooks.find(b => b.id === id);
}

export function pickUser(user) {
  if (!user) return null;
  return { id: user.id, name: user.name, avatar: user.avatar };
}

export function pickOwner(user) {
  if (!user) return null;
  return { id: user.id, name: user.name };
}

export function formatBookListItem(book) {
  const owner = findUserById(book.ownerId);
  const borrower = book.borrowerId ? findUserById(book.borrowerId) : null;
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    cover: book.cover,
    category: book.category,
    owner: pickOwner(owner),
    status: book.status,
    borrower: borrower ? { id: borrower.id, name: borrower.name } : null,
    createdAt: book.createdAt,
  };
}

export function formatBookDetail(book) {
  const owner = findUserById(book.ownerId);
  const borrower = book.borrowerId ? findUserById(book.borrowerId) : null;
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    publisher: book.publisher,
    description: book.description,
    cover: book.cover,
    category: book.category,
    owner: pickUser(owner),
    status: book.status,
    borrower: borrower
      ? { id: borrower.id, name: borrower.name, borrowedAt: book.borrowedAt, dueDate: book.dueDate }
      : null,
    borrowHistory: book.borrowHistory,
    createdAt: book.createdAt,
  };
}
