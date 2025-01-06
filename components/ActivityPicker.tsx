import { useSQLiteContext } from "expo-sqlite";
import React, { useState } from "react";
import { FlatList, Modal, StyleSheet, View } from "react-native";
import { Button, Card, Portal, Surface, Text } from "react-native-paper";
import { Activity, getActivities } from "../database/queries/activities";

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

  const selectedActivity = activities.find((a) => a.id === selectedActivityId);

  return (
    <View>
      <Button
        mode="outlined"
        onPress={() => setModalVisible(true)}
        style={styles.button}
      >
        Activity: {selectedActivity?.name || "Select Activity"}
      </Button>

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          transparent
        >
          <Surface style={styles.centeredView}>
            <Card style={styles.modalView}>
              <Card.Content>
                <Text variant="titleLarge" style={styles.modalTitle}>
                  Select Activity
                </Text>

                <FlatList
                  data={activities}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <Button
                      mode={
                        item.id === selectedActivityId ? "contained" : "text"
                      }
                      onPress={() => {
                        onSelectActivity(item.id);
                        setModalVisible(false);
                      }}
                      style={styles.activityItem}
                      labelStyle={styles.activityText}
                    >
                      {item.name}
                    </Button>
                  )}
                />

                <Button
                  mode="contained"
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                >
                  Close
                </Button>
              </Card.Content>
            </Card>
          </Surface>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "80%",
    maxHeight: "80%",
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
  },
  activityItem: {
    marginVertical: 4,
    borderRadius: 8,
  },
  activityText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 15,
  },
});
