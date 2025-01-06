import React from "react";
import { Animated, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { IconButton, List, useTheme } from "react-native-paper";
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
          { backgroundColor: theme.colors.primaryContainer },
        ]}
      >
        <IconButton
          icon="pencil"
          size={24}
          iconColor={theme.colors.onPrimaryContainer}
        />
      </View>
    );
  };

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
      <List.Item
        title={item.name}
        style={[
          styles.activityItem,
          { backgroundColor: theme.colors.background },
          item.id === selectedActivityId && {
            backgroundColor: theme.colors.primaryContainer,
          },
        ]}
        titleStyle={[
          styles.activityText,
          item.id === selectedActivityId && {
            color: theme.colors.onPrimaryContainer,
          },
        ]}
        onPress={() => onSelect(item.id)}
      />
    </Swipeable>
  );
};
