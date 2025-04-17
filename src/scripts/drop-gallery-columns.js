// Gallery tablosundan gereksiz alanları kaldırmak için script
import supabase from '../utils/supabase';

async function dropGalleryColumns() {
  console.log('Gallery tablosundan category ve description alanlarını kaldırma işlemi başlatılıyor...');
  
  try {
    // SQL sorgusunu çalıştır
    const { error } = await supabase.rpc('exec_sql', {
      query: `
        ALTER TABLE gallery 
        DROP COLUMN IF EXISTS category,
        DROP COLUMN IF EXISTS description;
      `
    });
    
    if (error) throw error;
    
    console.log('Gallery tablosundan alanlar başarıyla kaldırıldı!');
  } catch (error) {
    console.error('Hata oluştu:', error.message);
  }
}

// Fonksiyonu çalıştır
dropGalleryColumns(); 