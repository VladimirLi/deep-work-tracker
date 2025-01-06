import { SQLiteDatabase } from "expo-sqlite";

const DATABASE_VERSION = 2;

export const migrateIfNeeded = async (db: SQLiteDatabase) => {
  const result = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version"
  );
  let currentDbVersion = result?.user_version ?? 0;

  if (currentDbVersion === 0) {
    await migrateFrom0To1(db);
    currentDbVersion = 1;
  }

  if (currentDbVersion === 1) {
    await migrateFrom1To2(db);
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
};

const migrateFrom0To1 = async (db: SQLiteDatabase) => {
  return db.execAsync(`
CREATE TABLE Sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  duration INTEGER,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
  `);
};

const migrateFrom1To2 = async (db: SQLiteDatabase) => {
  return db.execAsync(`
CREATE TABLE Activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE Sessions ADD COLUMN activity_id INTEGER REFERENCES Activities(id);

-- Insert default activity
INSERT INTO Activities (name) VALUES ('Default');

-- Update existing sessions to use default activity
UPDATE Sessions SET activity_id = (SELECT id FROM Activities WHERE name = 'Default');
  `);
};
