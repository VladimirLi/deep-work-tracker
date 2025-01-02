import { appSchema, tableSchema } from "@nozbe/watermelondb";

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: "deep_work_sessions",
      columns: [
        { name: "started_at", type: "number" },
        { name: "ended_at", type: "number" },
        { name: "duration", type: "number" },
        { name: "task_description", type: "string" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
  ],
});
