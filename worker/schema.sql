CREATE TABLE IF NOT EXISTS letters (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  open_date TEXT NOT NULL,
  encrypted_payload TEXT NOT NULL,
  salt TEXT NOT NULL,
  iv TEXT NOT NULL,
  created_at TEXT NOT NULL,
  reminder_sent_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_letters_due ON letters (open_date, reminder_sent_at);
