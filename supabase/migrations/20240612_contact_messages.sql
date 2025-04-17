-- İletişim mesajları tablosunu oluştur
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- İndeksler
CREATE INDEX contact_messages_created_at_idx ON public.contact_messages (created_at DESC);
CREATE INDEX contact_messages_is_read_idx ON public.contact_messages (is_read);

-- RLS (Row Level Security) Politikaları
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Kimliği doğrulanmış kullanıcılara tam erişim izni ver (admins tablosu yerine)
CREATE POLICY "Yetkilendirilmiş kullanıcılar tam erişime sahiptir" ON public.contact_messages
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Anonim kullanıcılara yazma erişimi ver, fakat okuma izni verme
CREATE POLICY "Herkes yeni mesaj gönderebilir" ON public.contact_messages
  FOR INSERT TO anon
  WITH CHECK (true);

-- Yorum ekleme
COMMENT ON TABLE public.contact_messages IS 'İletişim formundan gönderilen mesajlar'; 