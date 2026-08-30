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
  event_name TEXT NOT NULL DEFAULT 'The Golden Hour Gala',
  ticket_type TEXT NOT NULL DEFAULT 'General',
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

const columns = db.prepare("PRAGMA table_info(attendees)").all().map(c => c.name);
if (!columns.includes('event_name')) db.exec("ALTER TABLE attendees ADD COLUMN event_name TEXT NOT NULL DEFAULT 'The Golden Hour Gala'");
if (!columns.includes('ticket_type')) db.exec("ALTER TABLE attendees ADD COLUMN ticket_type TEXT NOT NULL DEFAULT 'General'");

const count = db.prepare('SELECT COUNT(*) AS count FROM attendees').get().count;
if (count === 0) {
  const attendees = [
    ['SOL-001','Amara Bell','amara.bell@solstice-demo.invalid','The Golden Hour Gala','VIP'],
    ['SOL-002','Jalen Mercer','jalen.mercer@solstice-demo.invalid','The Golden Hour Gala','General'],
    ['SOL-003','Nia Laurent','nia.laurent@solstice-demo.invalid','The Golden Hour Gala','VIP'],
    ['SOL-004','Elian Brooks','elian.brooks@solstice-demo.invalid','The Golden Hour Gala','General'],
    ['SOL-005','Mara Sterling','mara.sterling@solstice-demo.invalid','The Golden Hour Gala','Executive'],
    ['SOL-006','Theo Vale','theo.vale@solstice-demo.invalid','The Golden Hour Gala','General'],
    ['SOL-007','Iris Monroe','iris.monroe@solstice-demo.invalid','The Golden Hour Gala','VIP'],
    ['SOL-008','Noah Laurent','noah.laurent@solstice-demo.invalid','The Golden Hour Gala','General'],
    ['SOL-009','Zara Ellis','zara.ellis@solstice-demo.invalid','The Golden Hour Gala','Executive'],
    ['SOL-010','Kai Bennett','kai.bennett@solstice-demo.invalid','The Golden Hour Gala','General'],
    ['SOL-011','Lena Hart','lena.hart@solstice-demo.invalid','The Golden Hour Gala','VIP'],
    ['SOL-012','Roman Avery','roman.avery@solstice-demo.invalid','The Golden Hour Gala','General'],
    ['SOL-013','Sienna Blake','sienna.blake@solstice-demo.invalid','The Golden Hour Gala','General'],
    ['SOL-014','Milan Rose','milan.rose@solstice-demo.invalid','The Golden Hour Gala','VIP'],
    ['SOL-015','Ari Cole','ari.cole@solstice-demo.invalid','The Golden Hour Gala','General'],
    ['SOL-016','Cleo Arden','cleo.arden@solstice-demo.invalid','The Golden Hour Gala','Executive'],
    ['SOL-017','Dante Ellis','dante.ellis@solstice-demo.invalid','The Golden Hour Gala','General'],
    ['SOL-018','Maya Sterling','maya.sterling@solstice-demo.invalid','The Golden Hour Gala','VIP'],
    ['SOL-019','Ezra Quinn','ezra.quinn@solstice-demo.invalid','The Golden Hour Gala','General'],
    ['SOL-020','Nyla Reed','nyla.reed@solstice-demo.invalid','The Golden Hour Gala','General'],
    ['SOL-021','Avery Lane','avery.lane@solstice-demo.invalid','The Golden Hour Gala','VIP'],
    ['SOL-022','Sage Rowan','sage.rowan@solstice-demo.invalid','The Golden Hour Gala','General'],
    ['SOL-023','Amelie Hart','amelie.hart@solstice-demo.invalid','The Golden Hour Gala','Executive'],
    ['SOL-024','Kieran Moss','kieran.moss@solstice-demo.invalid','The Golden Hour Gala','General'],
    ['SOL-025','Rhea Bloom','rhea.bloom@solstice-demo.invalid','The Golden Hour Gala','VIP'],
    ['SOL-026','Julian Frost','julian.frost@solstice-demo.invalid','The Golden Hour Gala','General'],
    ['SOL-027','Elara Wynn','elara.wynn@solstice-demo.invalid','The Golden Hour Gala','General'],
    ['SOL-028','Micah Stone','micah.stone@solstice-demo.invalid','The Golden Hour Gala','VIP'],
    ['SOL-029','Ayla Rose','ayla.rose@solstice-demo.invalid','The Golden Hour Gala','General'],
    ['SOL-030','Rowan Blake','rowan.blake@solstice-demo.invalid','The Golden Hour Gala','Executive']
  ];
  const insert = db.prepare('INSERT INTO attendees (attendee_code,name,email,event_name,ticket_type) VALUES (?,?,?,?,?)');
  db.transaction(() => attendees.forEach(row => insert.run(...row)))();
}
