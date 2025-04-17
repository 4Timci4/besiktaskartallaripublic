import { FormEvent, useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import supabase from '../utils/supabase';
import { isAuthenticated, saveLoginTime } from '../utils/auth';
import { LogIn, AlertCircle, Lock, Mail, Shield, EyeOff, Eye } from 'lucide-react';

function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Kullanıcı giriş durumunu kontrol et
  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      setIsLoggedIn(authenticated);
    };
    
    checkAuth();
  }, []);

  // Kullanıcı zaten giriş yapmışsa admin paneline yönlendir
  if (isLoggedIn === true) {
    return <Navigate to="/admin" replace />;
  }

  // Henüz kontrol edilmediyse yükleniyor göster
  if (isLoggedIn === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-600 text-sm">Oturum kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      if (data.session) {
        // JWT token'ı sakla ve son giriş zamanını kaydet
        saveLoginTime(data.session.access_token);
        // Admin paneline yönlendir
        navigate('/admin');
      }
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata';
      setError('Giriş başarısız: ' + errorMessage);
      console.error('Giriş hatası:', err);
    } finally {
      setLoading(false);
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Arka plan deseni */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMSI+PHBhdGggZD0iTTM2IDM0aDEydjRIMzZ2LTRabTAgOGgxMnY0SDM2di00Wm0wIDhoMTJ2NEgzNnYtNFptLTEyLTI0aDEydjRIMjR2LTRabTAgOGgxMnY0SDI0di00Wm0wIDhoMTJ2NEgyNHYtNFptMCA4aDEydjRIMjR2LTRabS0xMi0yNGgxMnY0SDEydi00Wm0wIDhoMTJ2NEgxMnYtNFptMCA4aDEydjRIMTJ2LTRabTI0LTI0aDEydjRIMzZ2LTRabTAtOGgxMnY0SDM2di00Wm0tMTIgMGgxMnY0SDI0di00Wm0tMTIgMGgxMnY0SDEydi00WiIvPjwvZz48L2c+PC9zdmc+')]"></div>
      </div>
      
      {/* Beşiktaş Renkleri Üst Çizgi */}
      <div className="fixed top-0 left-0 right-0 flex h-1">
        <div className="w-1/3 bg-black"></div>
        <div className="w-1/3 bg-white"></div>
        <div className="w-1/3 bg-red-600"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
          {/* Logo ve Başlık */}
          <div className="px-8 py-10 bg-black text-white relative">
            <div className="flex justify-center">
              <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-105">
                <Shield className="h-12 w-12 text-black" />
              </div>
            </div>
            <h2 className="mt-6 text-center text-2xl font-bold">Beşiktaş Kartalları Admin</h2>
            <p className="mt-2 text-center text-sm text-gray-300">
              Panel erişiminiz için giriş yapın
            </p>
            
            {/* Dekoratif çizgiler */}
            <div className="absolute bottom-0 left-0 w-full flex justify-between">
              <div className="h-1 w-1/3 bg-red-600"></div>
              <div className="h-1 w-1/3 bg-white"></div>
              <div className="h-1 w-1/3 bg-black"></div>
            </div>
          </div>
          
          {/* Form */}
          <div className="px-8 py-8">
            {error && (
              <div className="mb-6 rounded-lg bg-red-50 p-4 border-l-4 border-red-600 animate-fadeIn">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-2">
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                  E-posta
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors duration-200" />
                  </div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-black focus:border-black text-sm transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="ornek@bjk.com.tr"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Şifre
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors duration-200" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-black focus:border-black text-sm transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded transition-colors"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Beni hatırla
                  </label>
                </div>
                
                <div className="text-sm">
                  <button type="button" className="font-medium text-black hover:text-gray-800 transition-colors">
                    Şifremi unuttum
                  </button>
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Giriş yapılıyor...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <LogIn className="h-4 w-4 mr-2" />
                      Giriş Yap
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="mt-6 text-center text-xs text-gray-600 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-gray-100">
          <p>
            Bu panel sadece yetkili BJK personelinin kullanımı içindir.
            <br />
            Yetkisiz erişim girişimleri kaydedilmektedir.
          </p>
        </div>
      </div>
      
      {/* Beşiktaş Renkleri Alt Çizgi */}
      <div className="fixed bottom-0 left-0 right-0 flex h-1">
        <div className="w-1/3 bg-black"></div>
        <div className="w-1/3 bg-white"></div>
        <div className="w-1/3 bg-red-600"></div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
