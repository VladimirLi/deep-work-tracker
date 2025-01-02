import { Model } from "@nozbe/watermelondb";
import { date, field, readonly } from "@nozbe/watermelondb/decorators";

export class DeepWorkSession extends Model {
  static table = "deep_work_sessions";

  @field("task_description") taskDescription!: string;
  @date("started_at") startedAt!: Date;
  @date("ended_at") endedAt!: Date;
  @field("duration") duration!: number;
  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;
}
