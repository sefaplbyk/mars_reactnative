import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  FlatList,
} from "react-native";
import React, { use, useEffect, useState } from "react";
import Screen from "../components/layout/Screen";
import Icon from "react-native-vector-icons/FontAwesome5";
import Searchicon from "react-native-vector-icons/Ionicons";
import UserCard from "../components/user/UserCard";
import { COLORS } from "../config";
import { getAllUsers } from "../services/userService";

const FindPeopleScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);

  const filteredData = users.filter((item) =>
    item.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchAllUsers = async () => {
    getAllUsers().then((response) => {
      setUsers(response);
    });
  };
  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <Screen>
      <View
        style={{
          flex: 1,
          paddingVertical: 10,
          alignItems: "center",
        }}
      >
        {/* Search Bar  */}
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
            placeholder="Search by username"
            placeholderTextColor={"white"}
            maxLength={20}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Text
              style={{
                color: "white",
              }}
            >
              {filteredData.length}
            </Text>
            <Icon
              color={COLORS.white}
              name="user-friends"
              size={24}
              style={{}}
            />
          </View>
        </View>
        {/* User Card  */}
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            width: "90%",
          }}
        >
          <View
            style={{
              gap: 10,
              justifyContent: "center",
              flexDirection: "row",
              flexWrap: "wrap",
              paddingVertical: 20,
            }}
          >
            {filteredData.map((item, index) => (
              <UserCard
                key={index}
                username={item.username}
                email={item.email}
                profilePicture={item.profilePicture}
                id={item._id}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </Screen>
  );
};

export default FindPeopleScreen;
