// Yönetim Kurulu Üye tipi
export interface Member {
  id: string;
  name: string;
  position: string;
  email: string;
  image: string;
  bio?: string;
  is_president?: boolean; // Başkan mı?
  created_at?: string; // Oluşturma tarihi
  updated_at?: string; // Güncelleme tarihi
}

// Üye düzenleme formu için
export interface MemberFormValues {
  id: string;
  name: string;
  position: string;
  email: string;
  image: string;
  bio: string;
  is_president?: boolean;
}
