import { SQLiteDatabase, SQLiteRunResult } from "expo-sqlite";

export type Session = {
  id: number;
  start_time: string;
  end_time: string;
  duration: number;
  notes: string | null;
  activity_id: number;
};

export const getSessions = async (
  db: SQLiteDatabase
): Promise<(Session & { activity_name: string })[]> => {
  return db.getAllAsync<Session & { activity_name: string }>(
    `SELECT Sessions.*, Activities.name as activity_name 
     FROM Sessions 
     LEFT JOIN Activities ON Sessions.activity_id = Activities.id`
  );
};

export const createSession = async (
  db: SQLiteDatabase,
  session: Omit<Session, "id">
): Promise<SQLiteRunResult> => {
  return db.runAsync(
    `
    INSERT INTO Sessions 
    (start_time, end_time, duration, notes, activity_id) 
    VALUES (?, ?, ?, ?, ?)`,
    [
      session.start_time,
      session.end_time,
      session.duration,
      session.notes,
      session.activity_id,
    ]
  );
};

export const deleteSession = async (
  db: SQLiteDatabase,
  sessionId: number
): Promise<SQLiteRunResult> => {
  return db.runAsync(`DELETE FROM Sessions WHERE id = ?`, [sessionId]);
};
