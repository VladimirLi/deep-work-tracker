import { useSQLiteContext } from "expo-sqlite";
import React, { useState } from "react";
import { Animated, FlatList, Modal, StyleSheet, View } from "react-native";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import {
  Button,
  Card,
  Divider,
  IconButton,
  List,
  Portal,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import {
  Activity,
  createActivity,
  deleteActivity,
  getActivities,
  updateActivity,
} from "../database/queries/activities";

type ActivityManagerProps = {
  visible: boolean;
  onDismiss: () => void;
  selectedActivityId: number;
  onSelectActivity: (activityId: number) => void;
};

type SwipeableActivityItemProps = {
  item: Activity;
  selectedActivityId: number;
  onSelect: (id: number) => void;
  onEdit: (activity: Activity) => void;
  onDelete: (id: number) => void;
};

const SwipeableActivityItem: React.FC<SwipeableActivityItemProps> = ({
  item,
  selectedActivityId,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const theme = useTheme();
  const swipeableRef = React.useRef<Swipeable>(null);

  const handleSwipeableWillOpen = (direction: "left" | "right") => {
    if (direction === "left") {
      onEdit(item);
    } else {
      onDelete(item.id);
    }
    swipeableRef.current?.close();
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <View
        style={[
          styles.swipeActions,
          { backgroundColor: theme.colors.errorContainer },
        ]}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <IconButton
            icon="delete"
            mode="contained"
            containerColor="transparent"
            iconColor={theme.colors.onErrorContainer}
            size={24}
          />
        </Animated.View>
      </View>
    );
  };

  const renderLeftActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: "clamp",
    });

    return (
      <View
        style={[
          styles.swipeActions,
          { backgroundColor: theme.colors.primaryContainer },
        ]}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <IconButton
            icon="pencil"
            mode="contained"
            containerColor="transparent"
            iconColor={theme.colors.onPrimaryContainer}
            size={24}
          />
        </Animated.View>
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}
      friction={1.5}
      leftThreshold={40}
      rightThreshold={40}
      overshootLeft={false}
      overshootRight={false}
      onSwipeableWillOpen={handleSwipeableWillOpen}
      useNativeAnimations
    >
      <List.Item
        title={item.name}
        style={[
          styles.activityItem,
          { backgroundColor: theme.colors.background },
          item.id === selectedActivityId && {
            backgroundColor: theme.colors.primaryContainer,
          },
        ]}
        titleStyle={[
          styles.activityText,
          item.id === selectedActivityId && {
            color: theme.colors.onPrimaryContainer,
          },
        ]}
        onPress={() => onSelect(item.id)}
      />
    </Swipeable>
  );
};

type EditableActivityItemProps = {
  activity: Activity;
  onSave: (activity: Activity) => void;
  onCancel: () => void;
};

const EditableActivityItem: React.FC<EditableActivityItemProps> = ({
  activity,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(activity.name);

  return (
    <View style={styles.editContainer}>
      <TextInput
        mode="outlined"
        value={name}
        onChangeText={setName}
        style={styles.editInput}
        autoFocus
        onSubmitEditing={() => onSave({ ...activity, name })}
        returnKeyType="done"
      />
      <IconButton
        icon="check"
        mode="contained-tonal"
        onPress={() => onSave({ ...activity, name })}
        style={styles.editButton}
      />
      <IconButton
        icon="close"
        mode="contained-tonal"
        onPress={onCancel}
        style={styles.editButton}
      />
    </View>
  );
};

export const ActivityManager: React.FC<ActivityManagerProps> = ({
  visible,
  onDismiss,
  selectedActivityId,
  onSelectActivity,
}) => {
  const theme = useTheme();
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

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 16,
  },
  modalView: {
    width: "90%",
    maxHeight: "80%",
    borderRadius: 16,
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  sectionTitle: {
    marginVertical: 10,
    opacity: 0.7,
  },
  activityItem: {
    borderRadius: 8,
    marginVertical: 4,
  },
  activityText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 15,
  },
  addActivityContainer: {
    marginVertical: 15,
    minHeight: 60,
  },
  input: {
    backgroundColor: "transparent",
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  editContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 4,
  },
  editInput: {
    flex: 1,
  },
  editButton: {
    margin: 0,
  },
  divider: {
    marginVertical: 15,
  },
  separator: {
    height: 8,
  },
  list: {
    maxHeight: 300,
    minHeight: 100,
  },
  swipeActions: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: 75,
  },
  gestureRoot: {
    marginBottom: 15,
  },
  listContent: {
    flexGrow: 0,
  },
});
