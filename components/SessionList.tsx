import { Session } from "@/database/queries/sessions";
import { useActivities } from "@/hooks/useActivities";
import { useSessions } from "@/hooks/useSessions";
import { format } from "date-fns";
import React from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";
import { ActivityPicker } from "./ActivityPicker";

interface SessionListProps {
  onClose: () => void;
  onSessionsChange: () => void;
}

export const SessionList = ({
  onClose,
  onSessionsChange,
}: SessionListProps) => {
  const { getSessions, deleteSession } = useSessions();
  const { updateSessionActivity } = useActivities();
  const [sessions, setSessions] = React.useState<Session[]>([]);
  const theme = useTheme();

  const loadSessions = React.useCallback(async () => {
    const data = await getSessions();
    setSessions(data);
    onSessionsChange();
  }, [getSessions, onSessionsChange]);

  React.useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handleDelete = async (sessionId: number) => {
    Alert.alert(
      "Delete Session",
      "Are you sure you want to delete this session?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteSession(sessionId);
            await loadSessions();
          },
        },
      ]
    );
  };

  const handleActivityChange = async (
    sessionId: number,
    activityId: number
  ) => {
    await updateSessionActivity(sessionId, activityId);
    await loadSessions();
  };

  const renderItem = React.useCallback(
    ({ item }: { item: Session }) => (
      <View
        style={[
          styles.sessionItem,
          { backgroundColor: theme.colors.elevation.level1 },
        ]}
      >
        <View style={styles.mainContent}>
          <View style={styles.timeInfo}>
            <Text variant="titleMedium">
              {format(new Date(item.start_time), "MMM d, yyyy")}
            </Text>
            <Text variant="bodyMedium" style={styles.secondaryText}>
              {format(new Date(item.start_time), "h:mm a")} •{" "}
              {Math.round(item.duration / 60)} min
            </Text>
          </View>
          <IconButton
            icon="delete-outline"
            mode="contained-tonal"
            onPress={() => handleDelete(item.id)}
            iconColor={theme.colors.error}
            style={styles.deleteButton}
          />
        </View>
        {item.notes && (
          <Text
            variant="bodyMedium"
            style={[styles.secondaryText, styles.notes]}
          >
            {item.notes}
          </Text>
        )}
        <ActivityPicker
          selectedActivityId={item.activity_id}
          onSelectActivity={(activityId) =>
            handleActivityChange(item.id, activityId)
          }
        />
      </View>
    ),
    [theme.colors.error, theme.colors.elevation.level1]
  );

  const ListHeaderComponent = React.useCallback(
    () => (
      <View style={styles.headerContainer}>
        <Text variant="headlineMedium" style={styles.title}>
          Work Sessions
        </Text>
        <IconButton icon="close" onPress={onClose} mode="contained-tonal" />
      </View>
    ),
    [onClose]
  );

  return (
    <View style={styles.container}>
      <ListHeaderComponent />
      <FlatList
        data={sessions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 8,
    paddingLeft: 16,
    paddingVertical: 8,
  },
  title: {
    fontWeight: "bold",
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  sessionItem: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    gap: 12,
  },
  mainContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  timeInfo: {
    flex: 1,
    gap: 4,
  },
  secondaryText: {
    opacity: 0.7,
  },
  notes: {
    marginTop: -4,
  },
  deleteButton: {
    margin: -8,
  },
});
