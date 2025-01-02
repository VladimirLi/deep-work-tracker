import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import { DeepWorkSession } from "./model";
import schema from "./schema";

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
  schema,
  // (You might want to comment out the next line when you run the app for the first time)
  // migrations,
  jsi: true, // Use JSI for better performance (requires Expo SDK 41+)
  onSetUpError: (error) => {
    console.error(error);
  },
});

// Then, make a Watermelon database from it!
export const database = new Database({
  adapter,
  modelClasses: [DeepWorkSession],
});

export { DeepWorkSession };
