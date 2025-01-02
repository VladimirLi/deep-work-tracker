import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { IconButton, Surface, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [time, setTime] = useState(0);
  const theme = useTheme();

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

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

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

  const isStopButtonDisabled = time === 0;

  const onStopButtonPress = () => {
    setTime(0);
  };

  const timeDisplay = formatTime(time);

  return (
    <SafeAreaView
      style={{ ...styles.container, backgroundColor: theme.colors.background }}
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
          onPress={toggleTimer}
          iconColor={theme.colors.primary}
        />
        <IconButton
          icon="stop-circle"
          size={72}
          onPress={onStopButtonPress}
          iconColor={theme.colors.primary}
          disabled={isStopButtonDisabled}
        />
      </Surface>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
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
});
