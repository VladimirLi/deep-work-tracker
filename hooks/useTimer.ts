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
  const [sessionStartTimestamp, setSessionStartTimestamp] =
    useState<Date | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [time, setTime] = useState(0);

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

  const startSession = () => {
    if (!sessionStartTimestamp) {
      setSessionStartTimestamp(new Date());
    }
    setIsTimerRunning(true);
  };

  const pauseSession = () => {
    setIsTimerRunning(false);
  };

  const stopSession = () => {
    onStop();
    setSessionStartTimestamp(null);
    setTime(0);
    setIsTimerRunning(false);
  };

  return {
    formattedTime: formatTime(time),
    sessionStartTimestamp,
    sessionDuration: time,
    startSession,
    pauseSession,
    stopSession,
    isTimerRunning,
  };
};
