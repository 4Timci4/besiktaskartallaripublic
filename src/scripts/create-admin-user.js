// Bu script ile admin kullanıcısı oluşturabilirsiniz
// Kullanım: node create-admin-user.js email@ornek.com sifre123

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY; // Service key (admin key) kullanın

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Supabase yapılandırması eksik. Lütfen .env dosyasını kontrol edin.');
  process.exit(1);
}

// Supabase istemcisini hizmet anahtarı ile başlat
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
  const args = process.argv.slice(2);
  
  if (args.length !== 2) {
    console.error('Kullanım: node create-admin-user.js email@ornek.com sifre123');
    process.exit(1);
  }
  
  const [email, password] = args;
  
  try {
    // Kullanıcı oluştur
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true
    });
    
    if (error) {
      throw error;
    }
    
    console.log('Admin kullanıcısı başarıyla oluşturuldu:');
    console.log(`Email: ${email}`);
    console.log(`Kullanıcı ID: ${data.user.id}`);
    
    // Kullanıcıya admin rolü ekleme (isteğe bağlı)
    // Bu işlemi RLS politikalarınıza göre yapılandırın
    
    console.log('\nBu kullanıcı şimdi admin paneline giriş yapabilir.');
  } catch (error) {
    console.error('Kullanıcı oluşturulurken hata oluştu:', error.message);
    process.exit(1);
  }
}

createAdminUser(); 