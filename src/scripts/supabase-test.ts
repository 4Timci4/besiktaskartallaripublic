import supabase, { activitiesApi, galleryApi } from '../utils/supabase';

// Supabase bağlantısını test et
async function testSupabaseConnection() {
  console.log('Supabase bağlantısı test ediliyor...');
  
  try {
    // Health check - basit bir sorgu gönder
    const { error } = await supabase.from('activities').select('count');
    
    if (error) {
      console.error('❌ Supabase bağlantı hatası:', error.message);
      return false;
    }
    
    console.log('✅ Supabase bağlantısı başarılı!');
    
    // Faaliyetleri ve galeri öğelerini çek
    console.log('Faaliyetler alınıyor...');
    const activities = await activitiesApi.getAll();
    console.log(`${activities.length} faaliyet alındı.`);
    
    console.log('Galeri öğeleri alınıyor...');
    const galleryItems = await galleryApi.getAll();
    console.log(`${galleryItems.length} galeri öğesi alındı.`);
    
    return true;
  } catch (error) {
    console.error('❌ Test başarısız oldu:', error instanceof Error ? error.message : String(error));
    return false;
  }
}

// Testi çalıştır
testSupabaseConnection()
  .then(success => {
    if (success) {
      console.log('🎉 Tüm testler başarılı!');
    } else {
      console.log('😢 Testler başarısız oldu.');
    }
  }); 