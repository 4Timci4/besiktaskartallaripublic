import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// .env dosyasını yükle
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  console.log(`.env dosyası yükleniyor: ${envPath}`);
  dotenv.config({ path: envPath });
} else {
  console.log('.env dosyası bulunamadı, varsayılan ortam değişkenleri kullanılacak');
  dotenv.config();
}

// Ortam değişkenlerini oku
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY || '';

// Değerlerin varlığını kontrol et
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Supabase URL veya service key bulunamadı!');
  process.exit(1);
}

// Service role ile client oluştur
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createPressBucket() {
  try {
    console.log('Press bucket oluşturuluyor...');
    
    // Bucket'ın var olup olmadığını kontrol et
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Bucket listesi alınırken hata:', listError);
      return;
    }
    
    const pressBucketExists = buckets.some(bucket => bucket.name === 'press');
    
    if (pressBucketExists) {
      console.log('Press bucket zaten mevcut.');
      return;
    }
    
    // Bucket oluştur
    const { data, error } = await supabase.storage.createBucket('press', {
      public: true,
      fileSizeLimit: 5242880, // 5MB
    });

    if (error) {
      console.error('Bucket oluşturma hatası:', error);
      return;
    }

    console.log('Press bucket başarıyla oluşturuldu:', data);
    
    // Bucket için izinleri ayarla
    const { error: policyError } = await supabase.storage.from('press').createSignedUrl('test.txt', 60);
    
    if (policyError && !policyError.message.includes('not found')) {
      console.error('İzin ayarlama hatası:', policyError);
    } else {
      console.log('Bucket izinleri başarıyla ayarlandı.');
    }
    
  } catch (err) {
    console.error('İşlem hatası:', err);
  }
}

createPressBucket();
