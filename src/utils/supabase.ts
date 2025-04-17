import { createClient } from '@supabase/supabase-js';

// Çalışma ortamını kontrol etmeye gerek kalmadı, Vite'ın import.meta.env API'si kullanılacak
// Ortam değişkenlerini oku
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Değerlerin varlığını kontrol et
if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL veya anahtar bulunamadı!');
}

// Supabase istemcisini oluştur
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

// Logger oluşturma - production modunda console.log'ları devre dışı bırakır
export const logger = {
  info: (message: string, ...args: unknown[]) => {
    if (import.meta.env.MODE !== 'production') {
      console.info(`[INFO] ${message}`, ...args);
    }
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(`[ERROR] ${message}`, ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(`[WARN] ${message}`, ...args);
  },
  debug: (message: string, ...args: unknown[]) => {
    if (import.meta.env.MODE === 'development') {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
};

// Oturum durumu değişikliklerini izle
supabase.auth.onAuthStateChange((event, session) => {
  // Sadece önemli oturum değişikliklerini logla
  if (event === 'SIGNED_OUT' || event === 'SIGNED_IN') {
    logger.info('Supabase Oturum Durumu:', event, session?.user?.email || 'Anonim');
  }
});

export interface Activity {
  id: string;
  title: string;
  date: string;
  description: string;
  image: string;
  is_active: boolean;
  created_at: string;
}

export interface Press {
  id: string;
  title: string;
  source: string;
  date: string;
  image: string;
  summary: string;
  link?: string;
  is_active: boolean;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

// İletişim mesajları arayüzü
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// Üyelik başvurusu arayüzü
export interface MembershipApplication {
  id: string;
  full_name: string;
  bjk_id: string;
  birth_date: string;
  blood_type: string;
  birth_city: string;
  education_level: string;
  graduated_school: string;
  occupation: string;
  workplace: string;
  title: string;
  phone: string;
  email: string;
  residence_city: string;
  residence_district: string;
  kvkk_consent: boolean;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

// Hata tipleri
export enum ErrorType {
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  VALIDATION = 'VALIDATION',
  SERVER_ERROR = 'SERVER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  UNKNOWN = 'UNKNOWN'
}

// API Hatası sınıfı
export class ApiError extends Error {
  type: ErrorType;
  originalError?: unknown;

  constructor(message: string, type: ErrorType, originalError?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.type = type;
    this.originalError = originalError;
  }
}

// API hata yönetimi - geliştirilmiş versiyon
const handleApiError = (error: unknown) => {
  logger.error('API Hatası:', error);
  
  // Hata nesnesini daha spesifik bir tipe cast et
  const err = error as { 
    code?: string; 
    details?: string; 
    message?: string; 
    status?: number 
  };
  
  // Supabase özel hata kodları
  if (err.code === 'PGRST116') {
    if (err.details?.includes('contains 0 rows')) {
      throw new ApiError('Kayıt bulunamadı', ErrorType.NOT_FOUND, error);
    }
    throw new ApiError('Veri bulunamadı', ErrorType.NOT_FOUND, error);
  }
  
  // HTTP durum kodları
  if (err.status === 406) {
    throw new ApiError('Geçersiz veri formatı. Lütfen form verilerini kontrol edin.', ErrorType.VALIDATION, error);
  }
  
  if (err.status === 401 || err.status === 403) {
    throw new ApiError('Yetkilendirme hatası. Lütfen oturumunuzu kontrol edin.', ErrorType.UNAUTHORIZED, error);
  }

  // Supabase bağlantı hataları
  if (err.message?.includes('Failed to fetch')) {
    throw new ApiError('Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.', ErrorType.NETWORK_ERROR, error);
  }

  // JWT token hataları
  if (err.message?.includes('JWT')) {
    throw new ApiError('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.', ErrorType.TOKEN_EXPIRED, error);
  }
  
  // Genel hata mesajı
  throw new ApiError(err.message || 'Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.', ErrorType.UNKNOWN, error);
};

// Faaliyetler için CRUD işlemleri
export const activitiesApi = {
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('is_active', true)  // Sadece aktif olan faaliyetleri getir
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      handleApiError(error);
      return [];
    }
  },

  // Admin için tüm aktiviteleri getiren ayrı bir fonksiyon
  getAllForAdmin: async () => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      handleApiError(error);
      return [];
    }
  },

  create: async (activity: Omit<Activity, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .insert([activity])
        .select()
        .maybeSingle();
      
      if (error) throw error;
      if (!data) throw new Error('Kayıt oluşturulamadı');
      return data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  update: async (id: string, activity: Partial<Activity>) => {
    try {
      // Tarihi doğru formata çevir
      const updateData: Partial<Activity> = { ...activity };
      if (activity.date) {
        const formattedDate = new Date(activity.date).toISOString().split('T')[0];
        updateData.date = formattedDate;
      }

      // Önce kaydın var olduğunu kontrol et
      const { data: existingRecord, error: checkError } = await supabase
        .from('activities')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (checkError) {
        logger.error('Kayıt kontrol hatası:', checkError);
        throw checkError;
      }

      if (!existingRecord) {
        throw new ApiError('Düzenlemek istediğiniz kayıt bulunamadı', ErrorType.NOT_FOUND);
      }

      // Güncelleme işlemi
      const { data, error } = await supabase
        .from('activities')
        .update(updateData)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) {
        logger.error('Güncelleme hatası:', error);
        
        const errorObj = error as { code?: string; message?: string };
        
        if (errorObj.code === 'PGRST116' || errorObj.message?.includes('bulunamadı')) {
          throw new ApiError(
            'Düzenlemek istediğiniz kayıt artık mevcut değil. ' +
            'Lütfen liste sayfasını yenileyip tekrar deneyin.',
            ErrorType.NOT_FOUND,
            error
          );
        }
        
        throw error;
      }

      if (!data) {
        throw new ApiError('Güncellenecek kayıt bulunamadı', ErrorType.NOT_FOUND);
      }

      logger.debug('Güncelleme başarılı:', data);
      return data;
    } catch (error: Error | unknown) {
      logger.error('Güncelleme hatası:', error);
      
      const errorObj = error as { code?: string; message?: string };
      
      if (errorObj.code === 'PGRST116' || errorObj.message?.includes('bulunamadı')) {
        throw new ApiError(
          'Düzenlemek istediğiniz kayıt artık mevcut değil. ' +
          'Lütfen liste sayfasını yenileyip tekrar deneyin.',
          ErrorType.NOT_FOUND,
          error
        );
      }
      
      if (errorObj.code === '406') {
        throw new ApiError('Geçersiz veri formatı. Lütfen girdiğiniz bilgileri kontrol edin.', 
          ErrorType.VALIDATION, 
          error
        );
      }
      
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      // Oturum bilgisini kontrol et
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        logger.warn('Silme işlemi için aktif oturum bulunamadı!');
        throw new ApiError('Oturum bilgisi bulunamadı. Lütfen tekrar giriş yapın.', ErrorType.UNAUTHORIZED);
      }
      
      // Önce kaydın var olduğunu kontrol et
      const { data: existingRecord, error: checkError } = await supabase
        .from('activities')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (checkError) {
        logger.error('Kayıt kontrol hatası:', checkError);
        throw checkError;
      }

      if (!existingRecord) {
        return true; // Zaten silinmiş, başarılı kabul et
      }
      
      // Silme işlemi
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id);
      
      if (error) {
        logger.error('Silme hatası:', error);
        if (error.code === '42501' || error.message?.includes('permission') || error.message?.includes('yetki')) {
          throw new ApiError(`Yetkilendirme hatası: Silme işlemi için yeterli yetkiniz yok. Kullanıcı: ${session.user.email}`, 
            ErrorType.UNAUTHORIZED, 
            error
          );
        }
        throw error;
      }
      
      // Silme işleminin tamamlanması için bekle
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Silme işlemini doğrula
      const { data: checkData, error: verifyError } = await supabase
        .from('activities')
        .select('id')
        .eq('id', id);
      
      if (verifyError) {
        logger.error('Doğrulama hatası:', verifyError);
      }
      
      // Eğer checkData null veya empty array ise, silme başarılı olmuştur
      if (!checkData || checkData.length === 0) {
        return true;
      }
      
      // İlk deneme başarısız olduysa ikinci kez deneyelim (bazen veri tabanı gecikmesi olabilir)
      logger.debug(`İlk silme başarısız oldu, tekrar deneniyor: '${id}'`);
      
      // 3 saniye bekle ve tekrar dene
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // İkinci silme denemesi
      const { error: error2 } = await supabase
        .from('activities')
        .delete()
        .eq('id', id);
        
      if (error2) {
        logger.error('İkinci silme hatası:', error2);
      } else {
        // Tekrar doğrula
        const { data: checkData2 } = await supabase
          .from('activities')
          .select('id')
          .eq('id', id);
          
        if (!checkData2 || checkData2.length === 0) {
          logger.debug(`İkinci deneme başarılı: '${id}' ID'li faaliyet silindi.`);
          return true;
        }
      }
      
      // RLS (Row Level Security) kurallarını atlayarak silmeyi dene (service role gerektirir)
      logger.debug(`RLS kurallarını atlayarak silme deneniyor: '${id}'`);
      
      try {
        // RPC (Remote Procedure Call) kullanarak silme
        const { error: bypassError } = await supabase.rpc('force_delete_activity', { 
          activity_id: id 
        });
        
        if (bypassError) {
          logger.error('RPC silme hatası:', bypassError);
          throw bypassError;
        }
        
        // Son kez kontrol et
        const { data: finalCheck } = await supabase
          .from('activities')
          .select('id')
          .eq('id', id);
          
        if (!finalCheck || finalCheck.length === 0) {
          logger.debug(`RPC silme başarılı: '${id}' ID'li faaliyet silindi.`);
          return true;
        }
      } catch (rpcError) {
        logger.error('RPC hatası:', rpcError);
      }
      
      logger.error(`HATA: '${id}' ID'li faaliyet üç denemeye rağmen silinemedi.`);
      throw new ApiError('Silme işlemi başarısız oldu. Lütfen sistem yöneticisiyle iletişime geçin.', 
        ErrorType.SERVER_ERROR
      );
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  subscribeToChanges: (callback: (payload: unknown) => void) => {
    return supabase
      .channel('activities-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activities' }, callback)
      .subscribe();
  }
};

// Galeri için CRUD işlemleri
export const galleryApi = {
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('is_active', true)  // Sadece aktif olan galeri öğelerini getir
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      handleApiError(error);
      return [];
    }
  },

  // Admin için tüm galeri öğelerini getiren fonksiyon
  getAllForAdmin: async () => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      handleApiError(error);
      return [];
    }
  },

  create: async (item: Omit<GalleryItem, 'id' | 'created_at'>) => {
    try {
      // Eskiden kalan category ve description alanlarını kaldır
      const { title, image, display_order, is_active } = item;
      
      // display_order değeri çok büyükse düzelt
      const safeDisplayOrder = display_order > 2147483647 
        ? Math.floor(Date.now() / 1000) // Eğer çok büyükse saniye cinsinden timestamp kullan
        : display_order;
      
      const { data, error } = await supabase
        .from('gallery')
        .insert([{ 
          title, 
          image, 
          display_order: safeDisplayOrder, 
          is_active 
        }])
        .select()
        .maybeSingle();
      
      if (error) throw error;
      if (!data) throw new Error('Kayıt oluşturulamadı');
      return data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  update: async (id: string, item: Partial<GalleryItem>) => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .update(item)
        .eq('id', id)
        .select()
        .maybeSingle();
      
      if (error) throw error;
      if (!data) throw new Error('Güncellenecek kayıt bulunamadı');
      return data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      // Oturum bilgisini kontrol et
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        logger.warn('Silme işlemi için aktif oturum bulunamadı!');
        throw new Error('Oturum bilgisi bulunamadı. Lütfen tekrar giriş yapın.');
      }
      
      // Önce kaydın var olduğunu kontrol et
      const { data: existingRecord, error: checkError } = await supabase
        .from('gallery')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (checkError) {
        logger.error('Kayıt kontrol hatası:', checkError);
        throw checkError;
      }

      if (!existingRecord) {
        return true; // Zaten silinmiş, başarılı kabul et
      }
      
      // Silme işlemi
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);
      
      if (error) {
        logger.error('Silme hatası:', error);
        if (error.code === '42501' || error.message?.includes('permission') || error.message?.includes('yetki')) {
          throw new Error(`Yetkilendirme hatası: Silme işlemi için yeterli yetkiniz yok. Kullanıcı: ${session.user.email}`);
        }
        throw error;
      }
      
      // Silme işleminin tamamlanması için bekle
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Silme işlemini doğrula
      const { data: checkData, error: verifyError } = await supabase
        .from('gallery')
        .select('id')
        .eq('id', id);
      
      if (verifyError) {
        logger.error('Doğrulama hatası:', verifyError);
      }
      
      // Eğer checkData null veya empty array ise, silme başarılı olmuştur
      if (!checkData || checkData.length === 0) {
        return true;
      }
      
      // İkinci deneme
      const { error: retryError } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);
        
      if (retryError) {
        logger.error('İkinci silme denemesi hatası:', retryError);
        throw retryError;
      }
      
      return true;
    } catch (error: Error | unknown) {
      logger.error('Galeri öğesi silme hatası:', error);
      throw error;
    }
  },

  subscribeToChanges: (callback: (payload: unknown) => void) => {
    return supabase
      .channel('gallery-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery' }, callback)
      .subscribe();
  }
};

// Üyelik başvuruları için CRUD işlemleri
export const membershipApplicationsApi = {
  // Tüm başvuruları getir
  getAllApplications: async () => {
    try {
      const { data, error } = await supabase
        .from('membership_applications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Üyelik başvurularını getirirken hata:', error);
      handleApiError(error);
      return [];
    }
  },
  
  // Tek bir başvuruyu getir
  getApplication: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('membership_applications')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) throw new ApiError('Başvuru bulunamadı', ErrorType.NOT_FOUND);
      
      return data;
    } catch (error) {
      logger.error('Üyelik başvurusu getirirken hata:', error);
      handleApiError(error);
      throw error;
    }
  },
  
  // Başvuru durumunu güncelle
  updateStatus: async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    try {
      const { data, error } = await supabase
        .from('membership_applications')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .maybeSingle();
      
      if (error) throw error;
      if (!data) throw new ApiError('Başvuru bulunamadı', ErrorType.NOT_FOUND);
      
      return data;
    } catch (error) {
      logger.error('Başvuru durumu güncellenirken hata:', error);
      handleApiError(error);
      throw error;
    }
  },
  
  // Başvuruyu sil
  deleteApplication: async (id: string) => {
    try {
      const { error } = await supabase
        .from('membership_applications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Başvuru silinirken hata:', error);
      handleApiError(error);
      throw error;
    }
  }
};

// Token yenileme işlemi
export const refreshToken = async () => {
  try {
    logger.debug('Token yenileme işlemi başlatılıyor...');

    // Mevcut oturumu kontrol et
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      logger.warn('Oturum bulunamadı, yönlendirme yapılıyor...');
      
      // Tarayıcıda çalışıyorsa login sayfasına yönlendir
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
      return false;
    }
    
    // Token'ı yenile
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      logger.error('Token yenileme hatası:', error);
      
      // Tarayıcıda çalışıyorsa login sayfasına yönlendir
      if (typeof window !== 'undefined') {
        logger.warn('Oturum geçersiz, yönlendirme yapılıyor...');
        window.location.href = '/admin/login';
      }
      
      return false;
    }
    
    if (data.session) {
      // JWT token'ı yerel depolamaya kaydet
      localStorage.setItem('authToken', data.session.access_token);
      
      // Token'ın geçerlilik süresini görüntüle
      const expiryDate = new Date((data.session.expires_at || 0) * 1000);
      logger.debug(`Token başarıyla yenilendi. Geçerlilik: ${expiryDate.toLocaleString()}`);
      
      return true;
    } else {
      logger.warn('Token yenilendi ancak oturum bilgisi eksik');
      return false;
    }
  } catch (err) {
    logger.error('Token yenileme işlemi başarısız:', err);
    return false;
  }
};

// Storage API - Dosya yükleme ve indirme işlemleri
export const storageApi = {
  uploadFile: async (file: File, folder: 'activities' | 'gallery'): Promise<{ path: string; url: string }> => {
    try {
      const BUCKET_NAME = 'bjk-storage'; // Sabit bucket adı
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`; // Bucket içindeki klasör yolu

      logger.info(`Dosya yükleniyor: ${fileName}, bucket: ${BUCKET_NAME}, path: ${filePath}`);

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw new ApiError(uploadError.message, ErrorType.SERVER_ERROR, uploadError);

      const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

      return {
        path: filePath,
        url: data.publicUrl
      };
    } catch (error) {
      logger.error('Dosya yüklenirken hata:', error);
      throw handleApiError(error);
    }
  },

  upload: async ({ file, bucket = 'public', folderPath = '' }: { file: File; bucket?: string; folderPath?: string }): Promise<{ path: string; publicUrl: string }> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw new ApiError(uploadError.message, ErrorType.SERVER_ERROR, uploadError);

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

      return {
        path: filePath,
        publicUrl: data.publicUrl
      };
    } catch (error) {
      logger.error('Dosya yüklenirken hata:', error);
      throw handleApiError(error);
    }
  },

  deleteFile: async (filePath: string): Promise<boolean> => {
    try {
      // Dosya yolundan bucket adını ve dosya adını ayır
      let bucket = 'bjk-storage';
      let fileName = filePath;
      
      // URL'den dosya yolunu çıkar
      if (filePath.includes('supabase.co/storage/v1/object/public/')) {
        // URL'den dosya yolunu ayıkla
        const pathParts = filePath.split('supabase.co/storage/v1/object/public/')[1].split('/');
        bucket = pathParts[0];
        fileName = pathParts.slice(1).join('/');
        
        logger.debug(`Dosya siliniyor - Bucket: ${bucket}, Dosya Yolu: ${fileName}`);
      }
      
      const { error } = await supabase.storage
        .from(bucket)
        .remove([fileName]);

      if (error) throw new ApiError(error.message, ErrorType.SERVER_ERROR, error);
      return true;
    } catch (error) {
      logger.error('Dosya silinirken hata:', error);
      throw handleApiError(error);
    }
  }
};

// İstatistikler için API
export const statisticsApi = {
  // Bu API objesi artık kullanılmıyor - Ziyaretçi sistemi kaldırıldı
};

// Press API
export const pressApi = {
  getAll: async (): Promise<Press[]> => {
    try {
      const { data, error } = await supabase
        .from('press')
        .select('*')
        .eq('is_active', true)
        .order('date', { ascending: false });

      if (error) throw new ApiError(error.message, ErrorType.SERVER_ERROR, error);
      
      return data || [];
    } catch (error) {
      logger.error('Basın haberleri getirilirken hata:', error);
      throw handleApiError(error);
    }
  },

  getAllForAdmin: async (): Promise<Press[]> => {
    try {
      const { data, error } = await supabase
        .from('press')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw new ApiError(error.message, ErrorType.SERVER_ERROR, error);
      
      return data || [];
    } catch (error) {
      logger.error('Admin için basın haberleri getirilirken hata:', error);
      throw handleApiError(error);
    }
  },

  getById: async (id: string): Promise<Press | null> => {
    try {
      const { data, error } = await supabase
        .from('press')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Kayıt bulunamadı
          return null;
        }
        throw new ApiError(error.message, ErrorType.SERVER_ERROR, error);
      }
      
      return data;
    } catch (error) {
      logger.error(`ID ile basın haberi getirilirken hata (${id}):`, error);
      throw handleApiError(error);
    }
  },

  create: async (pressItem: Omit<Press, 'id' | 'created_at'>): Promise<Press> => {
    try {
      const { data, error } = await supabase
        .from('press')
        .insert([pressItem])
        .select()
        .single();

      if (error) throw new ApiError(error.message, ErrorType.SERVER_ERROR, error);
      
      return data;
    } catch (error) {
      logger.error('Basın haberi oluşturulurken hata:', error);
      throw handleApiError(error);
    }
  },

  update: async (id: string, updates: Partial<Omit<Press, 'id' | 'created_at'>>): Promise<Press> => {
    try {
      const { data, error } = await supabase
        .from('press')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new ApiError(error.message, ErrorType.SERVER_ERROR, error);
      
      return data;
    } catch (error) {
      logger.error(`Basın haberi güncellenirken hata (${id}):`, error);
      throw handleApiError(error);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('press')
        .delete()
        .eq('id', id);

      if (error) throw new ApiError(error.message, ErrorType.SERVER_ERROR, error);
    } catch (error) {
      logger.error(`Basın haberi silinirken hata (${id}):`, error);
      throw handleApiError(error);
    }
  },

  toggleVisibility: async (id: string, isActive: boolean): Promise<Press> => {
    try {
      const { data, error } = await supabase
        .from('press')
        .update({ is_active: isActive })
        .eq('id', id)
        .select()
        .single();

      if (error) throw new ApiError(error.message, ErrorType.SERVER_ERROR, error);
      
      return data;
    } catch (error) {
      logger.error(`Basın haberi görünürlüğü değiştirilirken hata (${id}):`, error);
      throw handleApiError(error);
    }
  }
};

// İletişim mesajları için CRUD işlemleri
export const contactMessagesApi = {
  // İletişim mesajı gönderme (Ziyaretçiler için)
  submitContactForm: async (message: Omit<ContactMessage, 'id' | 'is_read' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([message])
        .select()
        .maybeSingle();
      
      if (error) throw error;
      if (!data) throw new Error('Mesaj kaydedilemedi');
      
      return data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  // Tüm mesajları getir (Admin paneli için)
  getAllMessages: async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      handleApiError(error);
      return [];
    }
  },
  
  // Tek bir mesajı getir
  getMessage: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) throw new ApiError('Mesaj bulunamadı', ErrorType.NOT_FOUND);
      
      return data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  // Mesajı okundu olarak işaretle
  markAsRead: async (id: string, isRead: boolean = true) => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .update({ is_read: isRead })
        .eq('id', id)
        .select()
        .maybeSingle();
      
      if (error) throw error;
      if (!data) throw new ApiError('Mesaj bulunamadı', ErrorType.NOT_FOUND);
      
      return data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  // Mesajı sil
  deleteMessage: async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
};
