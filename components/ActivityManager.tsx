import { useSQLiteContext } from "expo-sqlite";
import React, { useState } from "react";
import { FlatList, Modal, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  Button,
  Card,
  Divider,
  Portal,
  Surface,
  Text,
  TextInput,
} from "react-native-paper";
import {
  Activity,
  createActivity,
  deleteActivity,
  getActivities,
  updateActivity,
} from "../database/queries/activities";
import { ActivityManagerProps } from "../types/activity";
import { EditableActivityItem } from "./EditableActivityItem";
import { SwipeableActivityItem } from "./SwipeableActivityItem";
import { styles } from "./styles/ActivityManager.styles";

export const ActivityManager: React.FC<ActivityManagerProps> = ({
  visible,
  onDismiss,
  selectedActivityId,
  onSelectActivity,
  onActivitiesChange,
}) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [newActivityName, setNewActivityName] = useState("");
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const db = useSQLiteContext();

  React.useEffect(() => {
    if (visible) {
      loadActivities();
    }
  }, [visible]);

  const loadActivities = async () => {
    const loadedActivities = await getActivities(db);
    setActivities(loadedActivities);
    onActivitiesChange(loadedActivities);
  };

  const handleAddActivity = async () => {
    if (newActivityName.trim()) {
      await createActivity(db, newActivityName.trim());
      setNewActivityName("");
      await loadActivities();
    }
  };

  const handleUpdateActivity = async (activity: Activity) => {
    await updateActivity(db, activity.id, activity.name.trim());
    setEditingActivity(null);
    await loadActivities();
  };

  const handleDeleteActivity = async (id: number) => {
    await deleteActivity(db, id);
    if (selectedActivityId === id) {
      onSelectActivity(0); // Reset to default activity
    }
    await loadActivities();
  };

  const renderActivityItem = ({ item }: { item: Activity }) => {
    if (editingActivity?.id === item.id) {
      return (
        <EditableActivityItem
          activity={editingActivity}
          onSave={handleUpdateActivity}
          onCancel={() => setEditingActivity(null)}
        />
      );
    }

    return (
      <SwipeableActivityItem
        item={item}
        selectedActivityId={selectedActivityId}
        onSelect={onSelectActivity}
        onEdit={setEditingActivity}
        onDelete={handleDeleteActivity}
      />
    );
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} transparent>
        <Surface style={styles.centeredView}>
          <Card style={styles.modalView} mode="elevated">
            <Card.Content>
              <Text variant="headlineSmall" style={styles.modalTitle}>
                Manage Activities
              </Text>
              <View style={styles.addActivityContainer}>
                <TextInput
                  mode="outlined"
                  label="New Activity"
                  value={newActivityName}
                  onChangeText={setNewActivityName}
                  style={styles.input}
                  right={
                    <TextInput.Icon
                      icon="plus"
                      disabled={!newActivityName.trim()}
                      onPress={handleAddActivity}
                    />
                  }
                  onSubmitEditing={handleAddActivity}
                  returnKeyType="done"
                />
              </View>

              <Divider style={styles.divider} />

              <Text variant="titleMedium" style={styles.sectionTitle}>
                Your Activities
              </Text>
              <Text style={styles.swipeHint}>
                Swipe left to delete or right to edit
              </Text>

              <GestureHandlerRootView style={styles.gestureRoot}>
                <FlatList
                  data={activities}
                  keyExtractor={(item) => item.id.toString()}
                  ItemSeparatorComponent={() => (
                    <View style={styles.separator} />
                  )}
                  renderItem={renderActivityItem}
                  style={styles.list}
                  showsVerticalScrollIndicator={true}
                  scrollEnabled={true}
                  contentContainerStyle={styles.listContent}
                />
              </GestureHandlerRootView>

              <Divider style={styles.divider} />

              <Button
                mode="contained"
                onPress={onDismiss}
                style={styles.closeButton}
              >
                Done
              </Button>
            </Card.Content>
          </Card>
        </Surface>
      </Modal>
    </Portal>
  );
};
