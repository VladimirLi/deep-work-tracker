import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function HomeScreen() {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [time, setTime] = useState(0);
  const theme = useColorScheme() ?? "light";

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

  const timeDisplay = formatTime(time);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.timerContainer}>
        <ThemedView style={styles.timeDisplay}>
          <ThemedText type="title" style={styles.timerText}>
            {timeDisplay.hours}
          </ThemedText>
          <ThemedText type="title" style={styles.timerSeparator}>
            :
          </ThemedText>
          <ThemedText type="title" style={styles.timerText}>
            {timeDisplay.minutes}
          </ThemedText>
          <ThemedText type="title" style={styles.timerSeparator}>
            :
          </ThemedText>
          <ThemedText type="title" style={styles.timerText}>
            {timeDisplay.seconds}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.buttonContainer}>
        <TouchableOpacity onPress={toggleTimer}>
          <ThemedView style={styles.buttonContent}>
            <IconSymbol
              name={isTimerRunning ? "pause.fill" : "play.fill"}
              size={48}
              color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
            />
          </ThemedView>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  timeDisplay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  timerText: {
    fontSize: 72,
    width: 100,
    textAlign: "center",
  },
  timerSeparator: {
    fontSize: 72,
    marginHorizontal: -5,
  },
  timeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 30,
    marginTop: 8,
  },
  timeLabel: {
    fontSize: 16,
    opacity: 0.7,
    width: 100,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  button: {
    padding: 20,
    borderRadius: 16,
    minWidth: 160,
  },
  buttonContent: {
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    fontSize: 18,
  },
});
