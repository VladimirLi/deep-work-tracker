import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Menu } from "react-native-paper";
import { Activity } from "../database/queries/activities";

type ActivitySelectorProps = {
  activities: Activity[];
  selectedActivityId: number;
  onSelectActivity: (activityId: number) => void;
  onManageActivities: () => void;
};

export const ActivitySelector: React.FC<ActivitySelectorProps> = ({
  activities,
  selectedActivityId,
  onSelectActivity,
  onManageActivities,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const selectedActivity = activities.find((a) => a.id === selectedActivityId);

  return (
    <View>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setMenuVisible(true)}
            style={styles.button}
            icon="playlist-edit"
          >
            {selectedActivity?.name || "Select Activity"}
          </Button>
        }
      >
        {activities.map((activity) => (
          <Menu.Item
            key={activity.id}
            onPress={() => {
              onSelectActivity(activity.id);
              setMenuVisible(false);
            }}
            title={activity.name}
            leadingIcon={
              activity.id === selectedActivityId ? "check" : undefined
            }
          />
        ))}
        <Menu.Item
          onPress={() => {
            setMenuVisible(false);
            onManageActivities();
          }}
          title="Manage Activities..."
          leadingIcon="cog"
        />
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 5,
  },
});
