/**
 * ماژول API چت و پیام‌رسانی
 * 
 * این ماژول توابع مربوط به چت و پیام‌رسانی را پیاده‌سازی می‌کند
 * شامل مدیریت اتاق‌های چت، ارسال و دریافت پیام‌ها
 */
import { supabase } from '../supabase';
import { ChatRoom, Message } from '../../types';

/**
 * دریافت لیست اتاق‌های چت
 * 
 * @param {object} options گزینه‌های فیلتر
 * @returns {Promise<ChatRoom[]>} لیست اتاق‌های چت
 * 
 * @example
 * // دریافت همه اتاق‌های چت
 * const rooms = await chatApi.getChatRooms();
 * 
 * // دریافت اتاق‌های چت عمومی
 * const publicRooms = await chatApi.getChatRooms({ type: 'public' });
 */
export async function getChatRooms(options: { type?: string, is_active?: boolean } = {}): Promise<ChatRoom[]> {
  try {
    let query = supabase.from('chat_rooms').select('*');
    
    if (options.type) {
      query = query.eq('type', options.type);
    }
    
    if (options.is_active !== undefined) {
      query = query.eq('is_active', options.is_active);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('خطا در دریافت اتاق‌های چت:', error);
      return [];
    }
    
    return data as ChatRoom[];
  } catch (error) {
    console.error('خطا در دریافت اتاق‌های چت:', error);
    return [];
  }
}

/**
 * دریافت یک اتاق چت
 * 
 * @param {string} roomId شناسه اتاق چت
 * @returns {Promise<ChatRoom | null>} اطلاعات اتاق چت
 * 
 * @example
 * // دریافت اتاق چت
 * const room = await chatApi.getChatRoom('123');
 */
export async function getChatRoom(roomId: string): Promise<ChatRoom | null> {
  try {
    const { data, error } = await supabase
      .from('chat_rooms')
      .select('*')
      .eq('id', roomId)
      .single();
    
    if (error) {
      console.error('خطا در دریافت اتاق چت:', error);
      return null;
    }
    
    return data as ChatRoom;
  } catch (error) {
    console.error('خطا در دریافت اتاق چت:', error);
    return null;
  }
}

/**
 * ایجاد اتاق چت جدید
 * 
 * @param {object} roomData اطلاعات اتاق چت
 * @returns {Promise<string | null>} شناسه اتاق چت یا null
 * 
 * @example
 * // ایجاد اتاق چت
 * const roomId = await chatApi.createChatRoom({
 *   title: 'عنوان اتاق',
 *   type: 'public',
 *   created_by: 'user123'
 * });
 */
export async function createChatRoom(roomData: {
  title: string;
  type: string;
  created_by: string;
}): Promise<string | null> {
  try {
    const { data, error } = await supabase.rpc('create_chat_room', {
      room_title: roomData.title,
      room_type: roomData.type,
      creator_id: roomData.created_by
    });
    
    if (error) {
      console.error('خطا در ایجاد اتاق چت:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('خطا در ایجاد اتاق چت:', error);
    return null;
  }
}

/**
 * دریافت پیام‌های یک اتاق چت
 * 
 * @param {string} roomId شناسه اتاق چت
 * @param {object} options گزینه‌های فیلتر
 * @returns {Promise<Message[]>} لیست پیام‌ها
 * 
 * @example
 * // دریافت پیام‌های اتاق چت
 * const messages = await chatApi.getChatMessages('room123');
 * 
 * // دریافت 20 پیام آخر
 * const recentMessages = await chatApi.getChatMessages('room123', { limit: 20 });
 */
export async function getChatMessages(roomId: string, options: { limit?: number } = {}): Promise<Message[]> {
  try {
    let query = supabase
      .from('chat_messages')
      .select('*')
      .eq('room_id', roomId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });
    
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('خطا در دریافت پیام‌ها:', error);
      return [];
    }
    
    return data as Message[];
  } catch (error) {
    console.error('خطا در دریافت پیام‌ها:', error);
    return [];
  }
}

/**
 * ارسال پیام در اتاق چت
 * 
 * @param {object} messageData اطلاعات پیام
 * @returns {Promise<string | null>} شناسه پیام یا null
 * 
 * @example
 * // ارسال پیام
 * const messageId = await chatApi.sendMessage({
 *   room_id: 'room123',
 *   sender_id: 'user456',
 *   content: 'متن پیام'
 * });
 */
export async function sendMessage(messageData: {
  room_id: string;
  sender_id: string;
  content: string;
}): Promise<string | null> {
  try {
    const { data, error } = await supabase.rpc('send_message', {
      room: messageData.room_id,
      sender: messageData.sender_id,
      msg_content: messageData.content
    });
    
    if (error) {
      console.error('خطا در ارسال پیام:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('خطا در ارسال پیام:', error);
    return null;
  }
}

/**
 * پیوستن به اتاق چت
 * 
 * @param {string} roomId شناسه اتاق چت
 * @param {string} userId شناسه کاربر
 * @returns {Promise<boolean>} نتیجه پیوستن
 * 
 * @example
 * // پیوستن به اتاق چت
 * const success = await chatApi.joinChatRoom('room123', 'user456');
 */
export async function joinChatRoom(roomId: string, userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('chat_participants')
      .insert({
        room_id: roomId,
        user_id: userId
      });
    
    if (error) {
      console.error('خطا در پیوستن به اتاق چت:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('خطا در پیوستن به اتاق چت:', error);
    return false;
  }
}

/**
 * خروج از اتاق چت
 * 
 * @param {string} roomId شناسه اتاق چت
 * @param {string} userId شناسه کاربر
 * @returns {Promise<boolean>} نتیجه خروج
 * 
 * @example
 * // خروج از اتاق چت
 * const success = await chatApi.leaveChatRoom('room123', 'user456');
 */
export async function leaveChatRoom(roomId: string, userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('chat_participants')
      .delete()
      .eq('room_id', roomId)
      .eq('user_id', userId);
    
    if (error) {
      console.error('خطا در خروج از اتاق چت:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('خطا در خروج از اتاق چت:', error);
    return false;
  }
}

/**
 * حذف پیام
 * 
 * @param {string} messageId شناسه پیام
 * @param {string} userId شناسه کاربر حذف‌کننده
 * @returns {Promise<boolean>} نتیجه حذف
 * 
 * @example
 * // حذف پیام
 * const success = await chatApi.deleteMessage('message123', 'user456');
 */
export async function deleteMessage(messageId: string, userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('chat_messages')
      .update({
        is_deleted: true,
        deleted_by: userId
      })
      .eq('id', messageId);
    
    if (error) {
      console.error('خطا در حذف پیام:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('خطا در حذف پیام:', error);
    return false;
  }
}

/**
 * دریافت شرکت‌کنندگان اتاق چت
 * 
 * @param {string} roomId شناسه اتاق چت
 * @returns {Promise<string[]>} لیست شناسه کاربران
 * 
 * @example
 * // دریافت شرکت‌کنندگان
 * const participants = await chatApi.getChatParticipants('room123');
 */
export async function getChatParticipants(roomId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('chat_participants')
      .select('user_id')
      .eq('room_id', roomId);
    
    if (error) {
      console.error('خطا در دریافت شرکت‌کنندگان اتاق چت:', error);
      return [];
    }
    
    return data.map(item => item.user_id);
  } catch (error) {
    console.error('خطا در دریافت شرکت‌کنندگان اتاق چت:', error);
    return [];
  }
}

/**
 * بررسی عضویت کاربر در اتاق چت
 * 
 * @param {string} roomId شناسه اتاق چت
 * @param {string} userId شناسه کاربر
 * @returns {Promise<boolean>} آیا کاربر عضو اتاق است
 * 
 * @example
 * // بررسی عضویت کاربر
 * const isMember = await chatApi.isUserInRoom('room123', 'user456');
 */
export async function isUserInRoom(roomId: string, userId: string): Promise<boolean> {
  try {
    const { data, error, count } = await supabase
      .from('chat_participants')
      .select('*', { count: 'exact' })
      .eq('room_id', roomId)
      .eq('user_id', userId);
    
    if (error) {
      console.error('خطا در بررسی عضویت کاربر در اتاق چت:', error);
      return false;
    }
    
    return (count || 0) > 0;
  } catch (error) {
    console.error('خطا در بررسی عضویت کاربر در اتاق چت:', error);
    return false;
  }
}

export const chatApi = {
  getChatRooms,
  getChatRoom,
  createChatRoom,
  getChatMessages,
  sendMessage,
  joinChatRoom,
  leaveChatRoom,
  deleteMessage,
  getChatParticipants,
  isUserInRoom
};