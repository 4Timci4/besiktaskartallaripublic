import { Member } from '../types/board';
import supabase, { storageApi } from './supabase';
import boardMembersData from '../data/boardMembers.json';

// JSON verisini tipini düzeltmek için zorla dönüştürme (Type Assertion)
// Bu sadece migrasyon için kullanılıyor
const jsonData = boardMembersData as {
  president: Member;
  boardMembers: Member[];
};

// Hata mesajlarını kullanıcı dostu hale getiren yardımcı fonksiyon
const formatErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return 'Bir hata oluştu: ' + error.message;
  }
  return 'Bilinmeyen bir hata oluştu';
};

// Supabase üzerinden yönetim kurulu verilerini almak için
export const boardService = {
  // Dosya yükleme işlemi
  async uploadMemberImage(file: File): Promise<string> {
    try {
      const result = await storageApi.upload({
        file,
        bucket: 'public',
        folderPath: 'board-members'
      });
      
      return result.publicUrl;
    } catch (error) {
      console.error('Üye fotoğrafı yüklenirken hata oluştu:', error);
      throw new Error(formatErrorMessage(error));
    }
  },
  // Tüm yönetim kurulu verilerini getir
  async getAll(): Promise<{ president: Member | null; boardMembers: Member[] }> {
    try {
      // Supabase'den veri çekmeyi dene
      const { data: presidentData, error: presidentError } = await supabase
        .from('board_members')
        .select('*')
        .eq('is_president', true)
        .single();

      if (presidentError && presidentError.code !== 'PGRST116') { // PGRST116: Sonuç bulunamadı hatası
        console.error('Başkan verisi alınırken hata oluştu:', presidentError);
        throw new Error('Başkan verisi alınırken hata oluştu');
      }

      const { data: membersData, error: membersError } = await supabase
        .from('board_members')
        .select('*')
        .eq('is_president', false)
        .order('created_at', { ascending: true });

      if (membersError) {
        console.error('Yönetim kurulu üyeleri alınırken hata oluştu:', membersError);
        throw new Error('Yönetim kurulu üyeleri alınırken hata oluştu');
      }

      // Veritabanından gelen verileri döndür
      return {
        president: presidentData || null,
        boardMembers: membersData || []
      };
    } catch (error) {
      console.error('Veri getirme hatası:', error);
      throw new Error(formatErrorMessage(error));
    }
  },

  // Tek bir üyeyi ID'ye göre getir
  async getById(id: string): Promise<Member | null> {
    try {
      if (!id) {
        throw new Error('Geçersiz ID');
      }
      
      // Supabase'den veri çekmeyi dene
      const { data, error } = await supabase
        .from('board_members')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // PGRST116: Sonuç bulunamadı hatası
          return null;
        }
        console.error(`ID: ${id} olan üye alınırken hata oluştu:`, error);
        throw new Error('Üye bilgileri alınırken hata oluştu');
      }

      return data;
    } catch (error) {
      console.error('Veri getirme hatası:', error);
      throw new Error(formatErrorMessage(error));
    }
  },

  // Yeni üye ekleme (Admin için)
  async addMember(member: Member): Promise<{ success: boolean; error?: Error | unknown }> {
    try {
      // Üye ID'si yoksa oluştur
      if (!member.id) {
        // Türkçe karakterleri dönüştür
        const turkishToEnglish = (text: string): string => {
          return text
            .replace(/ğ/g, 'g')
            .replace(/Ğ/g, 'G')
            .replace(/ü/g, 'u')
            .replace(/Ü/g, 'U')
            .replace(/ş/g, 's')
            .replace(/Ş/g, 'S')
            .replace(/ı/g, 'i')
            .replace(/İ/g, 'I')
            .replace(/ö/g, 'o')
            .replace(/Ö/g, 'O')
            .replace(/ç/g, 'c')
            .replace(/Ç/g, 'C');
        };
        
        member.id = turkishToEnglish(member.name)
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');
      }

      // Üye oluşturma tarihi yoksa ekle
      if (!member.created_at) {
        member.created_at = new Date().toISOString();
      }

      // Üye güncelleme tarihi ekle
      member.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('board_members')
        .insert(member);

      if (error) {
        console.error('Üye ekleme hatası:', error);
        return { success: false, error: new Error('Üye eklenirken bir hata oluştu') };
      }

      return { success: true };
    } catch (error) {
      console.error('Üye ekleme hatası:', error);
      return { success: false, error: new Error(formatErrorMessage(error)) };
    }
  },

  // Üye güncelleme (Admin için)
  async updateMember(member: Member): Promise<{ success: boolean; error?: Error | unknown }> {
    try {
      // Üye güncelleme tarihi ekle
      member.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('board_members')
        .update(member)
        .eq('id', member.id);

      if (error) {
        console.error('Üye güncelleme hatası:', error);
        return { success: false, error: new Error('Üye güncellenirken bir hata oluştu') };
      }

      return { success: true };
    } catch (error) {
      console.error('Üye güncelleme hatası:', error);
      return { success: false, error: new Error(formatErrorMessage(error)) };
    }
  },

  // Üye silme (Admin için)
  async deleteMember(id: string): Promise<{ success: boolean; error?: Error | unknown }> {
    try {
      const { error } = await supabase
        .from('board_members')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Üye silme hatası:', error);
        return { success: false, error: new Error('Üye silinirken bir hata oluştu') };
      }

      return { success: true };
    } catch (error) {
      console.error('Üye silme hatası:', error);
      return { success: false, error: new Error(formatErrorMessage(error)) };
    }
  },

  // JSON verilerini veritabanına aktar (Migrasyon için)
  async migrateJsonToDatabase(): Promise<{ success: boolean; error?: Error | unknown }> {
    try {
      // Önce başkanı ekle
      const president = {
        ...jsonData.president,
        is_president: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error: presidentError } = await supabase
        .from('board_members')
        .upsert(president, { onConflict: 'id' });

      if (presidentError) {
        console.error('Başkan ekleme hatası:', presidentError);
        return { success: false, error: new Error('Başkan eklenirken bir hata oluştu') };
      }

      // Sonra diğer üyeleri ekle
      const members = jsonData.boardMembers.map(member => ({
        ...member,
        is_president: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const { error: membersError } = await supabase
        .from('board_members')
        .upsert(members, { onConflict: 'id' });

      if (membersError) {
        console.error('Üye ekleme hatası:', membersError);
        return { success: false, error: new Error('Üyeler eklenirken bir hata oluştu') };
      }

      return { success: true };
    } catch (error) {
      console.error('Migrasyon hatası:', error);
      return { success: false, error: new Error(formatErrorMessage(error)) };
    }
  }
};
