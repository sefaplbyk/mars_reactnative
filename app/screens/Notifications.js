import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { COLORS } from "../config";
import { acceptReq, getRequest, rejectReq } from "../services/requestService";
import { formatDate } from "../utils/formatDate";
import { getProfilePic } from "../utils/profilePicUtils";

const handleAcceptRequest = async (reqId) => {
  await acceptReq(reqId);
};
const handleRejectRequest = async (reqId) => {
  await rejectReq(reqId);
};
const NotificationItem = ({ item }) => (
  <TouchableOpacity style={styles.card}>
    <Image
      source={getProfilePic(item.requester.profilePicture)}
      style={styles.avatar}
    />
    <View style={styles.textContainer}>
      <Text style={styles.title}>Takip İsteği</Text>
      <Text style={styles.description}>
        {item.requester.username} seni takip etmek istiyor.
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.accent,
            padding: 10,
            borderRadius: 10,
            width: 80,
            alignItems: "center",
          }}
          onPress={() => handleAcceptRequest(item._id)}
        >
          <Text>Onayla</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.black,
            padding: 10,
            borderRadius: 10,
            width: 80,
            alignItems: "center",
          }}
          onPress={() => handleRejectRequest(item._id)}
        >
          <Text
            style={{
              color: COLORS.white,
            }}
          >
            Sil
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.time}>{formatDate(item.createdAt)}</Text>
    </View>
  </TouchableOpacity>
);

const NotificationsScreen = ({ route }) => {
  const { userId } = route.params;
  const [data, setData] = useState([]);

  const getUserNotifications = async () => {
    try {
      //   setLoading(true);
      const userNotifi = await getRequest(userId);
      setData(userNotifi);
    } catch (error) {
      console.log(error, "errorFetchNotifications");
    } finally {
      //   setLoading(false);
    }
  };
  useEffect(() => {
    getUserNotifications();
  }, []);
  console.log(data);
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bildirimler</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <NotificationItem item={item} />}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: COLORS.lightGray2,
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: COLORS.gray,
  },
});

export default NotificationsScreen;
