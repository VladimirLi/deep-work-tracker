import { useSQLiteContext } from "expo-sqlite";
import React, { useState } from "react";
import { View } from "react-native";
import { Activity, getActivities } from "../database/queries/activities";
import { ActivityManager } from "./ActivityManager";
import { ActivitySelector } from "./ActivitySelector";

type ActivityPickerProps = {
  selectedActivityId: number;
  onSelectActivity: (activityId: number) => void;
};

export const ActivityPicker: React.FC<ActivityPickerProps> = ({
  selectedActivityId,
  onSelectActivity,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const db = useSQLiteContext();

  React.useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    const loadedActivities = await getActivities(db);
    setActivities(loadedActivities);
  };

  return (
    <View>
      <ActivitySelector
        activities={activities}
        selectedActivityId={selectedActivityId}
        onSelectActivity={onSelectActivity}
        onManageActivities={() => setModalVisible(true)}
      />
      <ActivityManager
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        selectedActivityId={selectedActivityId}
        onSelectActivity={onSelectActivity}
      />
    </View>
  );
};
