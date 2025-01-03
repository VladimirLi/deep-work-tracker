import { Session } from "@/database/queries/sessions";
import { useSessions } from "@/hooks/useSessions";
import { format } from "date-fns";
import React from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import { Button, Card, IconButton, Text, useTheme } from "react-native-paper";

interface SessionListProps {
  onClose: () => void;
  onSessionsChange: () => void;
}

export const SessionList = ({
  onClose,
  onSessionsChange,
}: SessionListProps) => {
  const { getSessions, deleteSession } = useSessions();
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

  const renderItem = React.useCallback(
    ({ item }: { item: Session }) => (
      <Card style={styles.sessionItem} mode="elevated">
        <Card.Content style={styles.cardContent}>
          <View style={styles.sessionInfo}>
            <Text variant="titleMedium" style={styles.dateText}>
              {format(new Date(item.start_time), "MMM d, yyyy h:mm a")}
            </Text>
            <Text variant="bodyMedium" style={styles.durationText}>
              Duration: {Math.round(item.duration / 60)} minutes
            </Text>
            {item.notes && (
              <Text variant="bodyMedium" style={styles.notesText}>
                Notes: {item.notes}
              </Text>
            )}
          </View>
          <Button
            mode="contained-tonal"
            onPress={() => handleDelete(item.id)}
            textColor={theme.colors.error}
            style={styles.deleteButton}
          >
            Delete
          </Button>
        </Card.Content>
      </Card>
    ),
    [theme.colors.error]
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
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sessionInfo: {
    flex: 1,
    marginRight: 16,
  },
  dateText: {
    marginBottom: 4,
  },
  durationText: {
    marginBottom: 2,
    opacity: 0.7,
  },
  notesText: {
    opacity: 0.7,
  },
  deleteButton: {
    minWidth: 80,
  },
});
