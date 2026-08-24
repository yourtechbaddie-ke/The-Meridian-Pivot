import Database from 'better-sqlite3';

export const db = new Database(process.env.DB_FILE || 'solstice.db');
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS attendees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  attendee_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'NOT_CHECKED_IN' CHECK(status IN ('NOT_CHECKED_IN','PRINT_PENDING','CHECKED_IN','PRINT_FAILED')),
  print_job_id TEXT UNIQUE,
  print_event_id TEXT UNIQUE,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS print_jobs (
  job_id TEXT PRIMARY KEY,
  event_id TEXT UNIQUE NOT NULL,
  attendee_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'QUEUED' CHECK(status IN ('QUEUED','PRINTING','COMPLETED','FAILED')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TEXT,
  FOREIGN KEY(attendee_code) REFERENCES attendees(attendee_code)
);
CREATE TABLE IF NOT EXISTS processed_webhooks (
  event_id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL,
  attendee_code TEXT NOT NULL,
  received_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`);

const count = db.prepare('SELECT COUNT(*) AS count FROM attendees').get().count;
if (count === 0) {
  const insert = db.prepare('INSERT INTO attendees (attendee_code,name,email) VALUES (?,?,?)');
  db.transaction(() => {
    insert.run('SOL-001','Amina Wanjiku','amina@example.com');
    insert.run('SOL-002','Brian Otieno','brian@example.com');
    insert.run('SOL-003','Claire Njeri','claire@example.com');
  })();
}
