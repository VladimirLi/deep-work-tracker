import {
  Activity,
  createActivity,
  getActivities,
  updateSessionActivity,
} from "@/database/queries/activities";
import { useSQLiteContext } from "expo-sqlite";

interface UseActivitiesReturn {
  getActivities: () => Promise<Activity[]>;
  createActivity: (name: string) => Promise<void>;
  updateSessionActivity: (
    sessionId: number,
    activityId: number
  ) => Promise<void>;
}

export const useActivities = (): UseActivitiesReturn => {
  const db = useSQLiteContext();
  if (!db) {
    throw new Error(
      "useActivities must be used within a SQLiteContextProvider"
    );
  }

  return {
    getActivities: async () => getActivities(db),
    createActivity: async (name: string) => {
      await createActivity(db, name);
    },
    updateSessionActivity: async (sessionId: number, activityId: number) => {
      await updateSessionActivity(db, sessionId, activityId);
    },
  };
};
