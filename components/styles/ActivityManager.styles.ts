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
  swipeHint: {
    textAlign: "center",
    opacity: 0.6,
    fontSize: 14,
    marginBottom: 12,
  },
  sectionTitle: {
    marginVertical: 10,
    opacity: 0.7,
  },
  activityItem: {
    borderRadius: 8,
    height: 48,
    justifyContent: "center",
  },
  activityContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  activityText: {
    fontSize: 16,
    flex: 1,
  },
  durationContainer: {
    height: 48,
    justifyContent: "center",
    paddingRight: 16,
  },
  durationText: {
    fontSize: 14,
    opacity: 0.7,
    width: 70,
    textAlign: "right",
    marginLeft: 8,
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
