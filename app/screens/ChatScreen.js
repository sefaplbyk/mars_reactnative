import {
  View,
  Text,
  TextInput,
  ImageBackground,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import Searchicon from "react-native-vector-icons/Ionicons";
import { COLORS } from "../config";

const ChatScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const mockMessageData = [
    {
      id: '1',
      firstName: 'John Doe',
      lastMessage: 'Hey, how are you doing?',
      time: '10:30',
      unread: 2,
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      online: true,
    },
    {
      id: '2',
      firstName: 'Sarah Wilson',
      lastMessage: 'The meeting is scheduled for tomorrow',
      time: '09:15',
      unread: 0,
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      online: true,
    },
    {
      id: '3',
      firstName: 'Michael Brown',
      lastMessage: 'Thanks for your help!',
      time: 'Yesterday',
      unread: 1,
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      online: false,
    },
    {
      id: '4',
      firstName: 'Emma Davis',
      lastMessage: 'Sure, lets meet at 5',
      time: 'Yesterday',
      unread: 0,
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      online: false,
    },
  ];
  const filteredData = mockMessageData.filter((item) =>
    item.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMessageItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => navigation.navigate('ChatDetail', { user: item })} 
      style={styles.messageItem}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {item.online && <View style={styles.onlineIndicator} />}
      </View>
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.name}>{item.firstName}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <View style={styles.messageFooter}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      
        <View style={styles.searchContainer}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "white",
              gap: 10,
              paddingHorizontal: 10,
              borderRadius: 30,
              width: "90%",
            }}
          >
            <Searchicon color={COLORS.white} name="search" size={16} />
            <TextInput
              style={{
                color: "white",
                flex: 1,
              }}
              placeholder="Ara"
              placeholderTextColor={"white"}
              maxLength={20}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
      <View style={
        styles.messagesContainer
      }>
      <Text style={styles.messagesTitle}>Mesajlar</Text>
      <FlatList
        data={filteredData}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
      </View>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  searchContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  messagesContainer:{
    marginVertical: 10,
    width:"90%",
    alignSelf:"center",
  },
  messagesTitle:{
    color: "white",
    fontWeight: "bold",
    fontSize: 24,
  },
  messageItem: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 5,
    borderRadius: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: 'black',
  },
  messageContent: {
    flex: 1,
    marginLeft: 15,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  name: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  time: {
    color: '#aaa',
    fontSize: 12,
  },
  lastMessage: {
    color: '#ddd',
    fontSize: 14,
    flex: 1,
    marginRight: 10,
  },
  unreadBadge: {
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
