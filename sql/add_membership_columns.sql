-- Üyelik başvuru formuna yeni sütunlar ekleme ve address sütununu kaldırma
ALTER TABLE membership_applications
ADD COLUMN graduated_school TEXT,
ADD COLUMN title TEXT;

-- Address sütununu kaldırma
ALTER TABLE membership_applications
DROP COLUMN address;
