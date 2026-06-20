ALTER TABLE letters ADD COLUMN creator_ip TEXT;
CREATE INDEX IF NOT EXISTS idx_letters_creator_day ON letters (creator_ip, created_at);
