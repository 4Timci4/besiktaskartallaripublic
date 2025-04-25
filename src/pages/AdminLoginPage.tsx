import React, { useState, useEffect, FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import supabase from '@/utils/supabase';
import { isAuthenticated, saveLoginTime } from '@/utils/auth';
import { LogIn, AlertCircle, Lock, Mail, Shield, EyeOff, Eye, Loader2 } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// --- Constants ---
const UI_TEXTS = {
  pageTitle: "Beşiktaş Kartalları Admin",
  pageDescription: "Yönetim paneline erişmek için giriş yapın",
  emailLabel: "E-posta",
  passwordLabel: "Şifre",
  rememberMeLabel: "Beni hatırla",
  forgotPasswordLabel: "Şifremi unuttum",
  loginButtonLabel: "Giriş Yap",
  checkingAuthStatus: "Oturum kontrol ediliyor...",
  loggingInStatus: "Giriş yapılıyor...",
  errorTitle: "Giriş Hatası",
  loginFailedPrefix: "Giriş başarısız: ",
  unknownError: "Bilinmeyen bir hata oluştu.",
  sessionError: "Oturum bilgisi alınamadı.",
  footerWarning: "Bu panel sadece yetkili BJK personelinin kullanımı içindir.\nYetkisiz erişim girişimleri kaydedilmektedir.",
  emailPlaceholder: "email@adresiniz.com",
  passwordPlaceholder: "••••••••",
  showPasswordAria: "Şifreyi göster",
  hidePasswordAria: "Şifreyi gizle",
};

const BRAND_COLORS = {
  primary: 'black',
  secondary: 'white',
  accent: 'red-600',
};

// --- Helper Components ---

/**
 * Renders the loading indicator shown during the initial authentication check.
 */
function AuthCheckLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col items-center space-y-3">
        <Loader2 className={`h-10 w-10 animate-spin text-${BRAND_COLORS.primary}`} />
        <p className="text-sm text-muted-foreground">{UI_TEXTS.checkingAuthStatus}</p>
      </div>
    </div>
  );
}

/**
 * Renders the main login form card.
 */
function LoginFormCard({
  email, password, loading, error, showPassword, rememberMe,
  onEmailChange, onPasswordChange, onRememberMeChange, onTogglePasswordVisibility, onSubmit
}: {
  email: string; password: string; loading: boolean; error: string | null; showPassword: boolean; rememberMe: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRememberMeChange: (checked: boolean | 'indeterminate') => void;
  onTogglePasswordVisibility: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <Card className="w-full max-w-md shadow-lg border-t-4 border-black dark:border-gray-700">
      <CardHeader className="items-center text-center space-y-3 pt-8 pb-6">
        <Avatar className="h-16 w-16 bg-gray-100 dark:bg-gray-800 border">
          <AvatarFallback className="bg-transparent">
            <Shield className={`h-8 w-8 text-${BRAND_COLORS.primary}`} />
          </AvatarFallback>
        </Avatar>
        <CardTitle className="text-2xl font-semibold">{UI_TEXTS.pageTitle}</CardTitle>
        <CardDescription>{UI_TEXTS.pageDescription}</CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{UI_TEXTS.errorTitle}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form className="space-y-4" onSubmit={onSubmit}>
          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email">{UI_TEXTS.emailLabel}</Label>
            {/* Reverting to relative container, absolute icon, and pl-12 */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                id="email"
                type="email"
                placeholder={UI_TEXTS.emailPlaceholder}
                required
                value={email}
                onChange={onEmailChange}
                // Using text-indent instead of padding-left
                className="" // Removed pl-12
                style={{ textIndent: '2.25rem' }} // Indent text/placeholder
                autoComplete="email"
                disabled={loading}
              />
            </div>
          </div>
          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password">{UI_TEXTS.passwordLabel}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={UI_TEXTS.passwordPlaceholder}
                required
                value={password}
                onChange={onPasswordChange}
                className="pr-10" // Removed pl-10, kept pr-10 for button
                style={{ textIndent: '2.25rem' }} // Added text-indent like email field
                autoComplete="current-password"
                disabled={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onTogglePasswordVisibility}
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? UI_TEXTS.hidePasswordAria : UI_TEXTS.showPasswordAria}
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={onRememberMeChange}
                disabled={loading}
              />
              <Label htmlFor="remember-me" className="text-sm font-normal text-muted-foreground">
                {UI_TEXTS.rememberMeLabel}
              </Label>
            </div>
            <Button variant="link" type="button" className="h-auto p-0 text-sm text-muted-foreground hover:text-primary" disabled={loading}>
              {UI_TEXTS.forgotPasswordLabel}
            </Button>
          </div>
          {/* Submit */}
          <Button type="submit" disabled={loading} className="w-full !mt-6">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {UI_TEXTS.loggingInStatus}
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                {UI_TEXTS.loginButtonLabel}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

/**
 * Admin Login Page Component - Main Entry Point
 */
function AdminLoginPage() {
  // --- State ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // --- Effects ---
  useEffect(() => {
    let isMounted = true;
    async function checkAuthStatus() {
      const authenticated = await isAuthenticated();
      if (isMounted) setIsLoggedIn(authenticated);
    }
    checkAuthStatus();
    return () => { isMounted = false; };
  }, []);

  // --- Conditional Renders ---
  if (isLoggedIn === true) return <Navigate to="/admin" replace />;
  if (isLoggedIn === null) return <AuthCheckLoader />;

  // --- Event Handlers ---
  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      if (!data.session) throw new Error(UI_TEXTS.sessionError);
      saveLoginTime(data.session.access_token);
      navigate('/admin');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : UI_TEXTS.unknownError;
      setError(`${UI_TEXTS.loginFailedPrefix}${message}`);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  // --- Render ---
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-950 dark:to-black p-4">
       <LoginFormCard
         email={email}
         password={password}
         loading={loading}
         error={error}
         showPassword={showPassword}
         rememberMe={rememberMe}
         onEmailChange={(e) => setEmail(e.target.value)}
         onPasswordChange={(e) => setPassword(e.target.value)}
         onRememberMeChange={(checked) => setRememberMe(Boolean(checked))}
         onTogglePasswordVisibility={() => setShowPassword(prev => !prev)}
         onSubmit={handleLoginSubmit}
       />
       {/* Footer Text */}
       <div className="mt-6 text-center text-xs text-muted-foreground max-w-md w-full whitespace-pre-line">
         {UI_TEXTS.footerWarning}
       </div>
    </div>
  );
}

export default AdminLoginPage;
