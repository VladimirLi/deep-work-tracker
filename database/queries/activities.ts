import { SQLiteDatabase, SQLiteRunResult } from "expo-sqlite";

export type Activity = {
  id: number;
  name: string;
  totalDuration?: number;
};

export const getActivities = async (
  db: SQLiteDatabase
): Promise<Activity[]> => {
  return db.getAllAsync<Activity>(
    `SELECT 
      Activities.*, 
      COALESCE(SUM(Sessions.duration), 0) as totalDuration
    FROM Activities 
    LEFT JOIN Sessions ON Activities.id = Sessions.activity_id
    GROUP BY Activities.id`
  );
};

export const createActivity = async (
  db: SQLiteDatabase,
  name: string
): Promise<SQLiteRunResult> => {
  return db.runAsync(`INSERT INTO Activities (name) VALUES (?)`, [name]);
};

export const updateSessionActivity = async (
  db: SQLiteDatabase,
  sessionId: number,
  activityId: number
): Promise<SQLiteRunResult> => {
  return db.runAsync(`UPDATE Sessions SET activity_id = ? WHERE id = ?`, [
    activityId,
    sessionId,
  ]);
};

export const updateActivity = async (
  db: SQLiteDatabase,
  id: number,
  name: string
): Promise<SQLiteRunResult> => {
  return db.runAsync(`UPDATE Activities SET name = ? WHERE id = ?`, [name, id]);
};

export const deleteActivity = async (
  db: SQLiteDatabase,
  id: number
): Promise<SQLiteRunResult> => {
  return db.runAsync(`DELETE FROM Activities WHERE id = ?`, [id]);
};
