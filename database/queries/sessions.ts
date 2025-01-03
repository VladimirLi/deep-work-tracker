import { SQLiteDatabase, SQLiteRunResult } from "expo-sqlite";

export type Session = {
  id: number;
  start_time: string;
  end_time: string;
  duration: number;
  notes: string | null;
};

export const getSessions = async (db: SQLiteDatabase): Promise<Session[]> => {
  return db.getAllAsync<Session>("SELECT * FROM Sessions");
};

export const createSession = async (
  db: SQLiteDatabase,
  session: Omit<Session, "id">
): Promise<SQLiteRunResult> => {
  return db.runAsync(
    `
			INSERT INTO Sessions 
			( start_time, end_time, duration, notes) 
			VALUES (?, ?, ?, ?)`,
    [session.start_time, session.end_time, session.duration, session.notes]
  );
};

export const deleteSession = async (
  db: SQLiteDatabase,
  sessionId: number
): Promise<SQLiteRunResult> => {
  return db.runAsync(`DELETE FROM Sessions WHERE id = ?`, [sessionId]);
};
