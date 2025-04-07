import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TouchableOpacity,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../config";
import { useAuth } from "../../context/AuthContext";
import { toggleUserPrivacy } from "../../services/userService";
import { useNavigation } from "@react-navigation/native";

const SettingsModal = ({ user }) => {
  const { logout } = useAuth();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [isPrivate, setIsPrivate] = useState(user?.isPrivate);
  const userId = user.luid || user._id;

  const togglePrivacy = () => {
    setIsPrivate((prev) => !prev);
    toggleUserPrivacy(userId, !isPrivate);
  };
  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
        style={styles.centeredView}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={styles.modalView}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Settings</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons
                  name="person-outline"
                  size={24}
                  color={COLORS.primary}
                />
                <Text style={styles.menuText}>Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() =>
                  navigation.navigate("Notifications", { userId: userId })
                }
              >
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color={COLORS.primary}
                />
                <Text style={styles.menuText}>Notifications</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <Ionicons
                  name="lock-closed-outline"
                  size={24}
                  color={COLORS.primary}
                />
                <Text style={styles.menuText}>Privacy</Text>
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={styles.menuText}>
                  {isPrivate ? "Profil Durumu: Gizli" : "Profil Durumu: Açık"}
                </Text>
                <Switch
                  value={isPrivate ? true : false}
                  onValueChange={togglePrivacy}
                  thumbColor={isPrivate ? COLORS.lightGray : COLORS.secondary}
                  trackColor={{ false: COLORS.primary, true: COLORS.secondary }}
                />
              </View>
              <TouchableOpacity
                onPress={logout}
                style={[styles.menuItem, styles.logout]}
              >
                <Ionicons
                  name="log-out-outline"
                  size={24}
                  color={COLORS.primary}
                />
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
      <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
        <Ionicons name="settings-outline" size={24} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  modalView: {
    position: "absolute",
    right: 0,
    height: "100%",
    width: "50%",
    backgroundColor: COLORS.white,
    padding: 0,
    alignItems: "stretch",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    backgroundColor: "black",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
  },
  modalContent: {
    flex: 1,
    padding: 16,
    backgroundColor: "black",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  menuText: {
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "500",
  },
  logout: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  logoutText: {
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "500",
  },
});

export default SettingsModal;
