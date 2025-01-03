import {
  createSession,
  getSessions,
  Session,
} from "@/database/queries/sessions";
import { useSQLiteContext } from "expo-sqlite";

interface Foo {
  getSessions: () => Promise<Session[]>;
  createSession: (session: Omit<Session, "id">) => Promise<void>;
}

export const useSessions = (): Foo => {
  const db = useSQLiteContext();
  if (!db) {
    throw new Error("useSessions must be used within a SQLiteContextProvider");
  }

  return {
    getSessions: async () => getSessions(db),
    createSession: async (session: Omit<Session, "id">) => {
      await createSession(db, session);
    },
  };
};
