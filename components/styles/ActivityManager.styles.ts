import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 16,
  },
  modalView: {
    width: "90%",
    maxHeight: "80%",
    borderRadius: 16,
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  sectionTitle: {
    marginVertical: 10,
    opacity: 0.7,
  },
  activityItem: {
    borderRadius: 8,
    height: 48,
  },
  activityText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 15,
  },
  addActivityContainer: {
    marginVertical: 15,
    minHeight: 60,
  },
  input: {
    backgroundColor: "transparent",
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  editContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 4,
  },
  editInput: {
    flex: 1,
  },
  editButton: {
    margin: 0,
  },
  divider: {
    marginVertical: 15,
  },
  separator: {
    height: 8,
  },
  list: {
    maxHeight: 300,
    minHeight: 100,
  },
  swipeActions: {
    flex: 1,
    justifyContent: "center",
    width: 75,
    height: 48,
    borderRadius: 8,
  },
  leftAction: {
    alignItems: "flex-start",
  },
  rightAction: {
    alignItems: "flex-end",
  },
  gestureRoot: {
    marginBottom: 15,
  },
  listContent: {
    flexGrow: 0,
  },
});
