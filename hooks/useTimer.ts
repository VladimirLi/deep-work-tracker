import { useEffect, useState } from "react";

interface FormattedTime {
  hours: string;
  minutes: string;
  seconds: string;
}

interface UseTimerReturn {
  formattedTime: FormattedTime;
  sessionStartTimestamp: Date | null;
  sessionDuration: number;
  startSession: () => void;
  pauseSession: () => void;
  stopSession: () => void;
  isTimerRunning: boolean;
}

const formatTime = (totalSeconds: number): FormattedTime => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return {
    hours: hours.toString().padStart(2, "0"),
    minutes: minutes.toString().padStart(2, "0"),
    seconds: seconds.toString().padStart(2, "0"),
  };
};

export const useTimer = (onStop: () => void): UseTimerReturn => {
  const [startTimestamp, setStartTimestamp] = useState<Date | null>(null);
  const [pauseTimestamp, setPauseTimestamp] = useState<Date | null>(null);
  const [pausedDuration, setPausedDuration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [activeDuration, setActiveDuration] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && startTimestamp) {
      interval = setInterval(() => {
        const now = new Date();
        const totalDuration = Math.floor(
          (now.getTime() - startTimestamp.getTime()) / 1000
        );
        setActiveDuration(totalDuration - pausedDuration);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, startTimestamp, pausedDuration]);

  const startSession = () => {
    if (!startTimestamp) {
      setStartTimestamp(new Date());
    } else if (pauseTimestamp) {
      // Coming back from pause
      const now = new Date();
      const additionalPausedTime = Math.floor(
        (now.getTime() - pauseTimestamp.getTime()) / 1000
      );
      setPausedDuration((prev) => prev + additionalPausedTime);
      setPauseTimestamp(null);
    }
    setIsRunning(true);
  };

  const pauseSession = () => {
    setIsRunning(false);
    setPauseTimestamp(new Date());
  };

  const stopSession = () => {
    onStop();
    setStartTimestamp(null);
    setActiveDuration(0);
    setIsRunning(false);
    setPauseTimestamp(null);
    setPausedDuration(0);
  };

  return {
    formattedTime: formatTime(activeDuration),
    sessionStartTimestamp: startTimestamp,
    sessionDuration: activeDuration,
    startSession,
    pauseSession,
    stopSession,
    isTimerRunning: isRunning,
  };
};
