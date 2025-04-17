import supabase from './supabase';
import { logger } from './supabase';

// Oturum süresi sabiti (milisaniye cinsinden)
const SESSION_TIMEOUT = 3 * 60 * 60 * 1000; // 3 saat

/**
 * Kullanıcının kimlik doğrulamasını kontrol eder.
 * Sadece token varlığı değil, token geçerliliğini ve son aktivite süresini de doğrular.
 * @returns Kullanıcı oturum açmışsa, token geçerliyse ve son oturum süresi aşılmamışsa true, aksi halde false
 */
export const isAuthenticated = async (): Promise<boolean> => {
  // LocalStorage'da token var mı kontrol et
  const token = localStorage.getItem('authToken');
  if (!token) return false;
  
  // Son giriş zamanını kontrol et
  const lastLogin = localStorage.getItem('lastLoginTime');
  if (lastLogin) {
    const lastLoginTime = parseInt(lastLogin, 10);
    const currentTime = Date.now();
    
    // Son girişten bu yana 3 saatten fazla zaman geçtiyse
    if (currentTime - lastLoginTime > SESSION_TIMEOUT) {
      logger.info('Oturum süresi doldu (3 saat)');
      await logout(); // Oturumu sonlandır
      return false;
    }
  }
  
  try {
    // Token ile kullanıcı doğrulama
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Son aktivite zamanını güncelle
      localStorage.setItem('lastLoginTime', Date.now().toString());
      return true;
    }
    
    return false;
  } catch (error) {
    logger.error('Token doğrulama hatası:', error);
    // Token geçersizse localStorage'dan temizle
    localStorage.removeItem('authToken');
    localStorage.removeItem('lastLoginTime');
    return false;
  }
};

/**
 * Kullanıcının çıkış yapmasını sağlar.
 * Hem Supabase oturumunu sonlandırır hem de yerel token'ı temizler.
 * @returns İşlem sonucu (başarılı/başarısız)
 */
export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('lastLoginTime');
    return { success: true };
  } catch (error) {
    logger.error('Çıkış yapılırken hata oluştu:', error);
    return { success: false, error };
  }
};

/**
 * Mevcut oturum açmış kullanıcı bilgilerini getirir.
 * @returns Kullanıcı nesnesi veya null
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    logger.error('Kullanıcı bilgisi alınırken hata oluştu:', error);
    return null;
  }
};

/**
 * Token'ın süresi dolmuşsa yeniler
 * @returns Yenileme başarılıysa true, aksi halde false
 */
export const refreshAuthToken = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      logger.error('Token yenileme hatası:', error);
      return false;
    }
    
    if (data.session) {
      localStorage.setItem('authToken', data.session.access_token);
      return true;
    }
    
    return false;
  } catch (error) {
    logger.error('Token yenileme işlemi başarısız:', error);
    return false;
  }
};

/**
 * Kullanıcı giriş yaptığında son giriş zamanını kaydet
 * @param token Kimlik doğrulama token'ı
 */
export const saveLoginTime = (token: string) => {
  localStorage.setItem('authToken', token);
  localStorage.setItem('lastLoginTime', Date.now().toString());
};