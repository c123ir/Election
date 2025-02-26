/**
 * تبدیل اعداد فارسی به انگلیسی
 * @param str رشته حاوی اعداد فارسی
 * @returns رشته با اعداد انگلیسی
 */
export function convertPersianToEnglish(str: string): string {
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  
  return str.split('').map(c => {
    const index = persianNumbers.indexOf(c);
    return index !== -1 ? englishNumbers[index] : c;
  }).join('');
}

/**
 * تبدیل اعداد انگلیسی به فارسی
 * @param str رشته حاوی اعداد انگلیسی
 * @returns رشته با اعداد فارسی
 */
export function convertEnglishToPersian(str: string): string {
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  
  return str.split('').map(c => {
    const index = englishNumbers.indexOf(c);
    return index !== -1 ? persianNumbers[index] : c;
  }).join('');
}

/**
 * حذف کاراکترهای غیر عددی از رشته
 * @param str رشته ورودی
 * @returns رشته فقط با اعداد
 */
export function extractNumbers(str: string): string {
  return str.replace(/\D/g, '');
}

/**
 * تبدیل اعداد فارسی به انگلیسی و حذف کاراکترهای غیر عددی
 * @param str رشته ورودی
 * @returns رشته فقط با اعداد انگلیسی
 */
export function normalizeNumber(str: string): string {
  return extractNumbers(convertPersianToEnglish(str));
}