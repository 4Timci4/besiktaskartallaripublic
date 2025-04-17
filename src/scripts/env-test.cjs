// JavaScript ile basit bir test script
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

// .env dosyasını yükle
dotenv.config();

console.log('Çevre değişkenleri yüklendi.');

// Supabase URL ve anahtarlarını kontrol et
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl ? '✅ Tanımlı' : '❌ Tanımlı değil');
console.log('Supabase Anahtar:', supabaseKey ? '✅ Tanımlı' : '❌ Tanımlı değil');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase konfigürasyonu eksik! Test durduruldu.');
  process.exit(1);
}

// Supabase client oluştur
const supabase = createClient(supabaseUrl, supabaseKey);
console.log('Supabase istemcisi oluşturuldu');

// Bağlantıyı test et
async function testConnection() {
  try {
    console.log('Supabase sunucusuna bağlanılıyor...');
    const { data, error } = await supabase.from('activities').select('count');
    
    if (error) {
      console.error('❌ Bağlantı hatası:', error.message);
      return;
    }
    
    console.log('✅ Bağlantı başarılı!');
    console.log('Veri:', data);
    
    // Faaliyetleri ve galeri öğelerini çek
    console.log('\nFaaliyetler listesi alınıyor...');
    const { data: activities, error: activitiesError } = await supabase
      .from('activities')
      .select('*')
      .limit(3);
    
    if (activitiesError) {
      console.error('❌ Faaliyetler alınamadı:', activitiesError.message);
    } else {
      console.log(`✅ ${activities.length} faaliyet alındı:`);
      console.log(activities.map(a => a.title).join('\n- '));
    }
    
    console.log('\nGaleri öğeleri alınıyor...');
    const { data: gallery, error: galleryError } = await supabase
      .from('gallery')
      .select('*')
      .limit(3);
    
    if (galleryError) {
      console.error('❌ Galeri öğeleri alınamadı:', galleryError.message);
    } else {
      console.log(`✅ ${gallery.length} galeri öğesi alındı:`);
      console.log(gallery.map(g => g.title).join('\n- '));
    }
    
  } catch (e) {
    console.error('❌ Test esnasında beklenmeyen hata:', e);
  }
}

testConnection(); 