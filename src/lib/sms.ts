/**
 * ماژول ارسال پیامک
 * 
 * این ماژول توابع مربوط به ارسال پیامک را پیاده‌سازی می‌کند
 * در محیط توسعه، پیامک‌ها فقط در کنسول نمایش داده می‌شوند
 * در محیط تولید، از سرویس پیامک استفاده می‌شود
 */

/**
 * ارسال پیامک
 * 
 * @param {string} to شماره موبایل گیرنده
 * @param {string} text متن پیامک
 * @returns {Promise<boolean>} نتیجه ارسال پیامک
 * 
 * @example
 * // ارسال پیامک
 * const success = await sendSMS('09123456789', 'متن پیامک');
 */
export async function sendSMS(to: string, text: string): Promise<boolean> {
  try {
    // در محیط توسعه، پیامک را فقط در کنسول نمایش می‌دهیم
    if (import.meta.env.DEV) {
      console.log(`[پیامک به ${to}]: ${text}`);
      return true;
    }
    
    // در محیط واقعی، اتصال به سرویس پیامک 0098
    const url = new URL('https://0098sms.com/sendsmslink.aspx');
    url.searchParams.append('FROM', '3000164545');
    url.searchParams.append('TO', to);
    url.searchParams.append('TEXT', text);
    url.searchParams.append('USERNAME', 'zsms8829');
    url.searchParams.append('PASSWORD', 'j494moo*O^HU');
    url.searchParams.append('DOMAIN', '0098');
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    const data = await response.text();
    if (data !== '0') {
      console.error('خطای ارسال پیامک:', data);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('خطا در ارسال پیامک:', error);
    return false;
  }
}

/**
 * ارسال کد تأیید به شماره موبایل کاربر
 * 
 * @param {string} phone شماره موبایل کاربر
 * @param {string} code کد تأیید
 * @returns {Promise<boolean>} نتیجه ارسال کد
 * 
 * @example
 * // ارسال کد تأیید
 * const success = await sendVerificationCode('09123456789', '1234');
 */
export async function sendVerificationCode(phone: string, code: string): Promise<boolean> {
  const message = `کد تایید شما: ${code}\nاتحادیه صنف کامپیوتر`;
  return await sendSMS(phone, message);
}