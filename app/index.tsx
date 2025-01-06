import { ActivityPicker } from "@/components/ActivityPicker";
import { SessionList } from "@/components/SessionList";
import { useActivities } from "@/hooks/useActivities";
import { useSessions } from "@/hooks/useSessions";
import { useTimer } from "@/hooks/useTimer";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  IconButton,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [showSessions, setShowSessions] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(
    null
  );
  const theme = useTheme();
  const { createSession, getSessions } = useSessions();
  const { getActivities } = useActivities();

  const loadSessions = async () => {
    const sessions = await getSessions();
    setSessionCount(sessions.length);
  };

  useEffect(() => {
    loadSessions();
    // Set default activity when component mounts
    getActivities().then((activities) => {
      if (activities.length > 0) {
        setSelectedActivityId(activities[0].id);
      }
    });
  }, []);

  const handleStop = () => {
    if (!sessionStartTimestamp || !selectedActivityId) return;

    createSession({
      start_time: sessionStartTimestamp.toISOString(),
      end_time: new Date().toISOString(),
      notes: null,
      duration: sessionDuration,
      activity_id: selectedActivityId,
    }).then(() => {
      loadSessions();
    });
  };

  const {
    formattedTime,
    sessionStartTimestamp,
    sessionDuration,
    startSession,
    pauseSession,
    stopSession,
    isTimerRunning,
  } = useTimer(handleStop);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.container}>
        <View
          style={[
            styles.timerSection,
            showSessions && styles.timerSectionWithList,
          ]}
        >
          <Surface style={styles.timeDisplay} elevation={0}>
            <Text variant="displayLarge">{formattedTime.hours}</Text>
            <Text variant="displayLarge">:</Text>
            <Text variant="displayLarge">{formattedTime.minutes}</Text>
            <Text variant="displayLarge">:</Text>
            <Text variant="displayLarge">{formattedTime.seconds}</Text>
          </Surface>

          <ActivityPicker
            selectedActivityId={selectedActivityId ?? 0}
            onSelectActivity={setSelectedActivityId}
          />

          <Surface style={styles.buttonContainer} elevation={0}>
            <IconButton
              icon={isTimerRunning ? "pause-circle" : "play-circle"}
              size={72}
              onPress={isTimerRunning ? pauseSession : startSession}
              iconColor={theme.colors.primary}
            />
            <IconButton
              icon="stop-circle"
              size={72}
              onPress={stopSession}
              iconColor={theme.colors.primary}
              disabled={!sessionStartTimestamp}
            />
          </Surface>
        </View>

        {showSessions ? (
          <View style={styles.sessionsContainer}>
            <SessionList
              onClose={() => setShowSessions(false)}
              onSessionsChange={loadSessions}
            />
          </View>
        ) : sessionCount > 0 ? (
          <View style={styles.showSessionsButtonContainer}>
            <Button
              mode="contained"
              onPress={() => setShowSessions(true)}
              icon="history"
            >
              Show Work Sessions ({sessionCount})
            </Button>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  timerSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
  },
  timerSectionWithList: {
    flex: 0,
    paddingVertical: 40,
  },
  timeDisplay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  sessionsContainer: {
    flex: 1,
  },
  showSessionsButtonContainer: {
    padding: 16,
    paddingBottom: 32,
  },
});
