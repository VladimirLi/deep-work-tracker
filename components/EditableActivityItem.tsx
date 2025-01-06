import React, { useState } from "react";
import { View } from "react-native";
import { IconButton, TextInput } from "react-native-paper";
import { EditableActivityItemProps } from "../types/activity";
import { styles } from "./styles/ActivityManager.styles";

export const EditableActivityItem: React.FC<EditableActivityItemProps> = ({
  activity,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(activity.name);

  return (
    <View style={styles.editContainer}>
      <TextInput
        mode="outlined"
        value={name}
        onChangeText={setName}
        style={styles.editInput}
        autoFocus
        onSubmitEditing={() => onSave({ ...activity, name })}
        returnKeyType="done"
      />
      <IconButton
        icon="check"
        mode="contained-tonal"
        onPress={() => onSave({ ...activity, name })}
        style={styles.editButton}
      />
      <IconButton
        icon="close"
        mode="contained-tonal"
        onPress={onCancel}
        style={styles.editButton}
      />
    </View>
  );
};
