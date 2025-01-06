import React from "react";
import { Animated, Pressable, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { IconButton, Text, useTheme } from "react-native-paper";
import { SwipeableActivityItemProps } from "../types/activity";
import { styles } from "./styles/ActivityManager.styles";

export const SwipeableActivityItem: React.FC<SwipeableActivityItemProps> = ({
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
    return (
      <View
        style={[
          styles.swipeActions,
          styles.rightAction,
          { backgroundColor: theme.colors.errorContainer },
        ]}
      >
        <IconButton
          icon="delete"
          size={24}
          iconColor={theme.colors.onErrorContainer}
        />
      </View>
    );
  };

  const renderLeftActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50],
      outputRange: [0, 50],
      extrapolate: "clamp",
    });

    return (
      <View
        style={[
          styles.swipeActions,
          styles.leftAction,
          { backgroundColor: "#E3F2FD" },
        ]}
      >
        <IconButton icon="pencil" size={24} iconColor="#1976D2" />
      </View>
    );
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  };

  const isSelected = item.id === selectedActivityId;
  const textColor = isSelected ? theme.colors.onPrimaryContainer : undefined;

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}
      friction={2}
      leftThreshold={30}
      rightThreshold={30}
      overshootLeft={false}
      overshootRight={false}
      onSwipeableWillOpen={handleSwipeableWillOpen}
      useNativeAnimations
    >
      <Pressable onPress={() => onSelect(item.id)}>
        <View
          style={[
            styles.activityItem,
            { backgroundColor: theme.colors.background },
            isSelected && {
              backgroundColor: theme.colors.primaryContainer,
            },
          ]}
        >
          <View style={styles.activityContent}>
            <Text
              variant="bodyLarge"
              style={[
                styles.activityText,
                isSelected && {
                  color: textColor,
                },
              ]}
            >
              {item.name}
            </Text>
            {item.totalDuration ? (
              <Text
                variant="bodyMedium"
                style={[
                  styles.durationText,
                  isSelected && {
                    color: textColor,
                  },
                ]}
              >
                {formatDuration(item.totalDuration)}
              </Text>
            ) : null}
          </View>
        </View>
      </Pressable>
    </Swipeable>
  );
};
