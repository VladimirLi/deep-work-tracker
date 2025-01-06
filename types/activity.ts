import { Activity } from "../database/queries/activities";

export interface ActivityManagerProps {
  visible: boolean;
  onDismiss: () => void;
  selectedActivityId: number;
  onSelectActivity: (activityId: number) => void;
}

export interface SwipeableActivityItemProps {
  item: Activity;
  selectedActivityId: number;
  onSelect: (id: number) => void;
  onEdit: (activity: Activity) => void;
  onDelete: (id: number) => void;
}

export interface EditableActivityItemProps {
  activity: Activity;
  onSave: (activity: Activity) => void;
  onCancel: () => void;
}
