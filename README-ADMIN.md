# Admin Paneli Kurulum ve Kullanım Talimatları

Bu belge, admin panelinin kurulumu ve kullanımı için adım adım talimatları içermektedir.

## Kurulum

### 1. Supabase Yapılandırması

Admin paneli, Supabase authentication sistemi üzerinden kullanıcı doğrulaması yapmaktadır. Supabase projenizde authentication servisini etkinleştirmeniz gerekmektedir.

1. [Supabase Dashboard](https://app.supabase.io)'a giriş yapın
2. Projenizi seçin
3. Sol menüden "Authentication" seçeneğine gidin
4. "Settings" sekmesinde "Email Auth" özelliğinin etkinleştirildiğinden emin olun

### 2. Çevre Değişkenlerini Ayarlama

`.env` dosyanızın aşağıdaki değişkenleri içerdiğinden emin olun:

```
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_KEY=your-service-key
```

Servis anahtarını (service key) Supabase Dashboard > Settings > API kısmından alabilirsiniz. Bu anahtar sadece yetkili kullanıcı oluşturmak için kullanılacaktır ve client tarafında kullanılmamalıdır!

### 3. Admin Kullanıcı Yönetimi

Admin kullanıcıları yönetmek için aşağıdaki betikler kullanılabilir. Tüm bu betikler `src/scripts` klasöründe bulunmaktadır ve Node.js ortamında çalıştırılırlar.

#### Gerekli Paketlerin Yüklenmesi

Bu betikleri kullanmadan önce gerekli Node.js paketlerini yüklemeniz gerekmektedir:

```bash
npm install dotenv @supabase/supabase-js
```

#### Admin Kullanıcısı Oluşturma

```bash
node -r dotenv/config src/scripts/create-admin-user.js <e-posta-adresi> <şifre>
```

Örnek:
```bash
node -r dotenv/config src/scripts/create-admin-user.js admin@ornek.com guclu-sifre123
```

Bu komut:
- Belirtilen e-posta ve şifreyle bir admin kullanıcısı oluşturur
- Kullanıcıya otomatik olarak 'admin' rolü atar
- Kullanıcı zaten varsa, hata mesajı gösterir

#### Admin Kullanıcılarını Listeleme

Sistemdeki tüm admin kullanıcılarını görüntülemek için:

```bash
node -r dotenv/config src/scripts/list-admin-users.js
```

Bu komut, tüm admin kullanıcılarının e-posta adresleri, kullanıcı ID'leri ve oluşturulma tarihlerini gösterir.

#### Admin Kullanıcısını Silme

Bir admin kullanıcısını silmek için:

```bash
node -r dotenv/config src/scripts/delete-admin-user.js <e-posta-adresi>
```

Örnek:
```bash
node -r dotenv/config src/scripts/delete-admin-user.js admin@ornek.com
```

Bu komut:
- Belirtilen e-posta adresine sahip kullanıcıyı bulur
- Kullanıcının admin rolüne sahip olduğunu doğrular
- Kullanıcıyı sistemden tamamen siler
- İşlem başarılı olduğunda bilgi mesajı gösterir

> **Dikkat:** Bu işlem geri alınamaz! Kullanıcı verileri tamamen silinir.

#### Admin Kullanıcı Şifresini Sıfırlama

Bir admin kullanıcısının şifresini sıfırlamak için:

```bash
node -r dotenv/config src/scripts/reset-admin-password.js <e-posta-adresi> <yeni-şifre>
```

Örnek:
```bash
node -r dotenv/config src/scripts/reset-admin-password.js admin@ornek.com yeni-guclu-sifre456
```

Bu komut:
- Belirtilen e-posta adresine sahip kullanıcının şifresini değiştirir
- İşlem başarılı olduğunda bilgi mesajı gösterir

#### Admin Kullanıcı Rolünü Değiştirme

Bir kullanıcıya admin rolü vermek veya rolünü kaldırmak için:

```bash
node -r dotenv/config src/scripts/update-user-role.js <e-posta-adresi> <rol>
```

Örnek (admin rolü vermek için):
```bash
node -r dotenv/config src/scripts/update-user-role.js kullanici@ornek.com admin
```

Örnek (admin rolünü kaldırmak için):
```bash
node -r dotenv/config src/scripts/update-user-role.js admin@ornek.com user
```

Bu komut:
- Belirtilen e-posta adresine sahip kullanıcıyı bulur
- Kullanıcının rolünü belirtilen rol ile değiştirir
- İşlem başarılı olduğunda bilgi mesajı gösterir

### 4. Betik Dosyalarını Oluşturma

Yukarıda bahsedilen betikler sisteminizde bulunmuyorsa, aşağıdaki komutlarla bunları oluşturabilirsiniz:

1. `src/scripts` klasörünü oluşturun:
```bash
mkdir -p src/scripts
```

2. Gerekli betik dosyalarını oluşturun ve ilgili kodları içlerine ekleyin. Betik şablonları bu belgenin sonundaki "Ek: Betik Şablonları" bölümünde bulunabilir.

## Kullanım

### Admin Paneline Erişim

Admin paneline aşağıdaki URL üzerinden erişebilirsiniz:

```
http://your-domain.com/admin/login
```

Oluşturduğunuz admin kullanıcı bilgileriyle giriş yapın.

### Temel Özellikler

Admin paneli şu temel özellikleri sunar:

1. **Faaliyetler Yönetimi**: Faaliyet ekleme, düzenleme, silme, etkinleştirme/devre dışı bırakma.
2. **Galeri Yönetimi**: Galeri öğelerini ekleme, düzenleme, silme ve sıralama.

### Güvenlik Önlemleri

1. Admin kullanıcı şifrenizi düzenli olarak değiştirin
2. Admin panelinin yetkisiz kişiler tarafından erişilebilir olmadığından emin olun
3. Supabase'in Row Level Security (RLS) politikalarını kullanarak veri erişimini kısıtlamayı düşünün
4. Servis anahtarınızı (VITE_SUPABASE_SERVICE_KEY) asla frontend kodunda yayınlamayın
5. Çok kritik işlemler için iki faktörlü doğrulama kullanmayı düşünün

## Sorun Giderme

Yaygın sorunlar ve çözümleri:

1. **Giriş yapamıyorum**: 
   - Kullanıcı adı ve şifrenizin doğru olduğundan emin olun
   - Şifrenizi sıfırlamak için `reset-admin-password.js` betiğini kullanın
   - Şifrenizi unuttuysanız, yeni bir admin kullanıcısı oluşturun

2. **İçerik ekleyemiyorum/düzenleyemiyorum**: 
   - Supabase RLS politikalarınızın admin kullanıcısına uygun izinleri sağladığından emin olun
   - Kullanıcınızın 'admin' rolüne sahip olduğunu doğrulayın

3. **Hata mesajları alıyorum**: 
   - Konsol hatalarını kontrol edin
   - Supabase Dashboard > Storage > Logs bölümüne bakın
   - Node betiklerinin çalıştırılması sırasında oluşan hata mesajlarını inceleyin

4. **Betikler çalışmıyor**:
   - `.env` dosyanızın doğru yapılandırıldığından emin olun
   - Gerekli Node.js paketlerinin yüklendiğini kontrol edin
   - Node.js sürümünüzün güncel olduğundan emin olun (v14 veya üzeri tavsiye edilir)

## Teknik Detaylar

- Admin paneli, React ve React Router kullanılarak oluşturulmuştur
- Kimlik doğrulama için Supabase Auth kullanılmaktadır
- UI için Tailwind CSS kullanılmaktadır
- Admin kullanıcı yönetimi, Supabase Auth API'si üzerinden yapılmaktadır

## Ek: Betik Şablonları

### create-admin-user.js

```javascript
const { createClient } = require('@supabase/supabase-js');

// Çevre değişkenlerini al
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY;

// Argümanları kontrol et
if (process.argv.length !== 4) {
  console.error('Kullanım: node create-admin-user.js <email> <password>');
  process.exit(1);
}

const email = process.argv[2];
const password = process.argv[3];

// Supabase istemcisini başlat
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
  try {
    // Kullanıcı oluştur
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: 'admin' }
    });

    if (createError) {
      throw createError;
    }

    console.log('Admin kullanıcısı başarıyla oluşturuldu:');
    console.log(`E-posta: ${email}`);
    console.log(`Kullanıcı ID: ${userData.user.id}`);
    console.log(`Oluşturulma tarihi: ${new Date(userData.user.created_at).toLocaleString()}`);
    console.log('\nBu kullanıcı bilgilerini güvenli bir şekilde saklayın.');

  } catch (error) {
    console.error('Admin kullanıcısı oluşturulurken hata oluştu:', error.message);
    process.exit(1);
  }
}

createAdminUser();
```

### delete-admin-user.js

```javascript
const { createClient } = require('@supabase/supabase-js');

// Çevre değişkenlerini al
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY;

// Argümanları kontrol et
if (process.argv.length !== 3) {
  console.error('Kullanım: node delete-admin-user.js <email>');
  process.exit(1);
}

const email = process.argv[2];

// Supabase istemcisini başlat
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function deleteAdminUser() {
  try {
    // Kullanıcıyı bul
    const { data: userData, error: getUserError } = await supabase.auth.admin.listUsers();
    
    if (getUserError) {
      throw getUserError;
    }
    
    const user = userData.users.find(u => u.email === email);
    if (!user) {
      throw new Error(`${email} e-posta adresine sahip kullanıcı bulunamadı`);
    }
    
    // Admin rolünü doğrula
    const userRole = user.user_metadata?.role;
    if (userRole !== 'admin') {
      throw new Error(`${email} kullanıcısı admin rolüne sahip değil. Mevcut rol: ${userRole || 'tanımlanmamış'}`);
    }
    
    // Kullanıcıyı sil
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
    
    if (deleteError) {
      throw deleteError;
    }
    
    console.log(`${email} adresine sahip admin kullanıcısı başarıyla silindi.`);
    
  } catch (error) {
    console.error('Admin kullanıcısı silinirken hata oluştu:', error.message);
    process.exit(1);
  }
}

deleteAdminUser();
```

### list-admin-users.js

```javascript
const { createClient } = require('@supabase/supabase-js');

// Çevre değişkenlerini al
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY;

// Supabase istemcisini başlat
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listAdminUsers() {
  try {
    // Tüm kullanıcıları getir
    const { data: userData, error: getUserError } = await supabase.auth.admin.listUsers();
    
    if (getUserError) {
      throw getUserError;
    }
    
    // Admin rolüne sahip kullanıcıları filtrele
    const adminUsers = userData.users.filter(user => 
      user.user_metadata?.role === 'admin' || user.app_metadata?.role === 'admin'
    );
    
    if (adminUsers.length === 0) {
      console.log('Sistemde hiç admin kullanıcısı bulunamadı.');
      return;
    }
    
    console.log(`Toplam ${adminUsers.length} admin kullanıcısı bulundu:`);
    console.log('------------------------------------------');
    
    adminUsers.forEach((user, index) => {
      console.log(`${index + 1}. Admin Kullanıcı:`);
      console.log(`   E-posta: ${user.email}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Oluşturulma Tarihi: ${new Date(user.created_at).toLocaleString()}`);
      console.log(`   Son Giriş: ${user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Hiç giriş yapılmadı'}`);
      console.log('------------------------------------------');
    });
    
  } catch (error) {
    console.error('Admin kullanıcıları listelenirken hata oluştu:', error.message);
    process.exit(1);
  }
}

listAdminUsers();
```

### reset-admin-password.js

```javascript
const { createClient } = require('@supabase/supabase-js');

// Çevre değişkenlerini al
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY;

// Argümanları kontrol et
if (process.argv.length !== 4) {
  console.error('Kullanım: node reset-admin-password.js <email> <new-password>');
  process.exit(1);
}

const email = process.argv[2];
const newPassword = process.argv[3];

// Supabase istemcisini başlat
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function resetAdminPassword() {
  try {
    // Kullanıcıyı bul
    const { data: userData, error: getUserError } = await supabase.auth.admin.listUsers();
    
    if (getUserError) {
      throw getUserError;
    }
    
    const user = userData.users.find(u => u.email === email);
    if (!user) {
      throw new Error(`${email} e-posta adresine sahip kullanıcı bulunamadı`);
    }
    
    // Şifreyi güncelle
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );
    
    if (updateError) {
      throw updateError;
    }
    
    console.log(`${email} kullanıcısının şifresi başarıyla güncellendi.`);
    
  } catch (error) {
    console.error('Şifre sıfırlama işlemi sırasında hata oluştu:', error.message);
    process.exit(1);
  }
}

resetAdminPassword();
```

### update-user-role.js

```javascript
const { createClient } = require('@supabase/supabase-js');

// Çevre değişkenlerini al
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY;

// Argümanları kontrol et
if (process.argv.length !== 4) {
  console.error('Kullanım: node update-user-role.js <email> <role>');
  console.error('Rol örnekleri: admin, user');
  process.exit(1);
}

const email = process.argv[2];
const role = process.argv[3];

// Geçerli roller
const validRoles = ['admin', 'user'];
if (!validRoles.includes(role)) {
  console.error(`Hata: Geçersiz rol "${role}". Geçerli roller: ${validRoles.join(', ')}`);
  process.exit(1);
}

// Supabase istemcisini başlat
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateUserRole() {
  try {
    // Kullanıcıyı bul
    const { data: userData, error: getUserError } = await supabase.auth.admin.listUsers();
    
    if (getUserError) {
      throw getUserError;
    }
    
    const user = userData.users.find(u => u.email === email);
    if (!user) {
      throw new Error(`${email} e-posta adresine sahip kullanıcı bulunamadı`);
    }
    
    // Kullanıcı rolünü güncelle
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { user_metadata: { role } }
    );
    
    if (updateError) {
      throw updateError;
    }
    
    console.log(`${email} kullanıcısının rolü "${role}" olarak güncellendi.`);
    
  } catch (error) {
    console.error('Kullanıcı rolü güncellenirken hata oluştu:', error.message);
    process.exit(1);
  }
}

updateUserRole();
```

---

Herhangi bir soru veya sorun için lütfen iletişime geçin. 