/**
 * ماژول دیتابیس
 * 
 * این ماژول برای ذخیره‌سازی داده‌ها در مرورگر استفاده می‌شود
 */

// ذخیره داده‌ها در localStorage
const DB_KEY = 'election_system_db';

interface DBSchema {
  users: any[];
  candidates: any[];
  votes: any[];
  surveys: any[];
  expectations: any[];
  webinars: any[];
  chat_rooms: any[];
  chat_messages: any[];
}

// دریافت داده‌ها از localStorage
function getDB(): DBSchema {
  const data = localStorage.getItem(DB_KEY);
  if (!data) {
    return {
      users: [],
      candidates: [],
      votes: [],
      surveys: [],
      expectations: [],
      webinars: [],
      chat_rooms: [],
      chat_messages: []
    };
  }
  return JSON.parse(data);
}

// ذخیره داده‌ها در localStorage
function saveDB(data: DBSchema) {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
}

/**
 * اجرای یک کوئری روی دیتابیس
 * 
 * @param {string} table نام جدول
 * @param {string} operation نوع عملیات
 * @param {any} data داده‌ها
 * @returns {Promise<any>} نتیجه کوئری
 */
export async function query(table: keyof DBSchema, operation: 'select' | 'insert' | 'update' | 'delete', data?: any): Promise<any> {
  const db = getDB();
  
  switch (operation) {
    case 'select':
      return db[table];
      
    case 'insert':
      if (!data) throw new Error('داده‌ای برای درج وجود ندارد');
      db[table].push({ ...data, id: crypto.randomUUID() });
      saveDB(db);
      return data;
      
    case 'update':
      if (!data || !data.id) throw new Error('شناسه برای بروزرسانی وجود ندارد');
      const updateIndex = db[table].findIndex((item: any) => item.id === data.id);
      if (updateIndex === -1) throw new Error('آیتم مورد نظر یافت نشد');
      db[table][updateIndex] = { ...db[table][updateIndex], ...data };
      saveDB(db);
      return db[table][updateIndex];
      
    case 'delete':
      if (!data || !data.id) throw new Error('شناسه برای حذف وجود ندارد');
      const deleteIndex = db[table].findIndex((item: any) => item.id === data.id);
      if (deleteIndex === -1) throw new Error('آیتم مورد نظر یافت نشد');
      db[table].splice(deleteIndex, 1);
      saveDB(db);
      return true;
      
    default:
      throw new Error('عملیات نامعتبر');
  }
}

/**
 * بررسی وضعیت اتصال به دیتابیس
 * 
 * @returns {Promise<boolean>} وضعیت اتصال
 */
export async function checkConnection(): Promise<boolean> {
  try {
    // در محیط مرورگر همیشه متصل است
    return true;
  } catch (error) {
    console.error('خطا در بررسی اتصال:', error);
    return false;
  }
}

/**
 * اجرای یک تراکنش
 * 
 * @param {Function} callback تابع حاوی عملیات تراکنش
 * @returns {Promise<any>} نتیجه تراکنش
 */
export async function transaction<T>(callback: () => Promise<T>): Promise<T> {
  try {
    const result = await callback();
    return result;
  } catch (error) {
    throw error;
  }
}

export default {
  query,
  checkConnection,
  transaction
};