import { SQLiteDatabase } from "expo-sqlite";

const DATABASE_VERSION = 1;

export const migrateIfNeeded = async (db: SQLiteDatabase) => {
  const result = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version"
  );
  let currentDbVersion = result?.user_version ?? 0;

  console.log("currentDbVersion", currentDbVersion);
  if (currentDbVersion === 0) {
    await migrateFrom0To1(db);
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
