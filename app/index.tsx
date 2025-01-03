import { SessionList } from "@/components/SessionList";
import { Session } from "@/database/queries/sessions";
import { useSessions } from "@/hooks/useSessions";
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

type OngoingSession = Pick<Session, "start_time">;

export default function HomeScreen() {
  const [ongoingSession, setOngoingSession] = useState<OngoingSession | null>(
    null
  );
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [showSessions, setShowSessions] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const theme = useTheme();
  const { createSession, getSessions } = useSessions();

  const loadSessions = async () => {
    const sessions = await getSessions();
    setSessionCount(sessions.length);
    console.log(JSON.stringify(sessions, null, 2));
  };

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerRunning]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
    };
  };

  const startSession = () => {
    setOngoingSession({ start_time: new Date().toISOString() });
    setIsTimerRunning(true);
  };

  const handlePlayButtonPress = () => {
    if (ongoingSession === null) {
      startSession();
    } else {
      setIsTimerRunning(true);
    }
  };

  const handlePauseButtonPress = () => {
    setIsTimerRunning(false);
  };

  const isStopButtonDisabled = ongoingSession === null;

  const saveSession = () => {
    if (ongoingSession === null) return;

    const endTime = new Date().toISOString();

    createSession({
      start_time: ongoingSession.start_time,
      end_time: endTime,
      notes: null,
      duration: time,
    }).then(() => {
      setOngoingSession(null);
      loadSessions();
      setTime(0);
      setIsTimerRunning(false);
    });
  };

  const handleStopButtonPress = () => {
    saveSession();
  };

  const timeDisplay = formatTime(time);

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
            <Text variant="displayLarge">{timeDisplay.hours}</Text>
            <Text variant="displayLarge">:</Text>
            <Text variant="displayLarge">{timeDisplay.minutes}</Text>
            <Text variant="displayLarge">:</Text>
            <Text variant="displayLarge">{timeDisplay.seconds}</Text>
          </Surface>

          <Surface style={styles.buttonContainer} elevation={0}>
            <IconButton
              icon={isTimerRunning ? "pause-circle" : "play-circle"}
              size={72}
              onPress={
                isTimerRunning ? handlePauseButtonPress : handlePlayButtonPress
              }
              iconColor={theme.colors.primary}
            />
            <IconButton
              icon="stop-circle"
              size={72}
              onPress={handleStopButtonPress}
              iconColor={theme.colors.primary}
              disabled={isStopButtonDisabled}
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
