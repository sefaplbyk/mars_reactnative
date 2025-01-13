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
  const mockData = [
    {
      id: 1,
      firstName: "John",
      eMail: "John@gmail.com",
      pic: `https://randomuser.me/api/portraits/men/${Math.floor(
        Math.random() * 100
      )}.jpg`,
    },
    {
      id: 2,
      firstName: "Jane",
      eMail: "Jane@gmail.com",
      pic: `https://randomuser.me/api/portraits/women/${Math.floor(
        Math.random() * 100
      )}.jpg`,
    },
    {
      id: 3,
      firstName: "Emma",
      eMail: "Emy@gmail.com",
      pic: `https://randomuser.me/api/portraits/women/${Math.floor(
        Math.random() * 100
      )}.jpg`,
    },
    {
      id: 4,
      firstName: "Ahmet",
      eMail: "Ahmet@gmail.com",
      pic: `https://randomuser.me/api/portraits/men/${Math.floor(
        Math.random() * 100
      )}.jpg`,
    },
    {
      id: 5,
      firstName: "Mehmet",
      eMail: "Mehmet@gmail.com",
      pic: `https://randomuser.me/api/portraits/men/${Math.floor(
        Math.random() * 100
      )}.jpg`,
    },
    {
      id: 6,
      firstName: "Ali",
      eMail: "Ali@gmail.com",
      pic: `https://randomuser.me/api/portraits/men/${Math.floor(
        Math.random() * 100
      )}.jpg`,
    },
    {
      id: 7,
      firstName: "Sara",
      eMail: "Sara@gmail.com",
      pic: `https://randomuser.me/api/portraits/women/${Math.floor(
        Math.random() * 100
      )}.jpg`,
    },
    {
      id: 8,
      firstName: "David",
      eMail: "David@gmail.com",
      pic: `https://randomuser.me/api/portraits/men/${Math.floor(
        Math.random() * 100
      )}.jpg`,
    },
    {
      id: 9,
      firstName: "Laura",
      eMail: "Laura@gmail.com",
      pic: `https://randomuser.me/api/portraits/women/${Math.floor(
        Math.random() * 100
      )}.jpg`,
    },
    {
      id: 10,
      firstName: "Tom",
      eMail: "Tom@gmail.com",
      pic: `https://randomuser.me/api/portraits/men/${Math.floor(
        Math.random() * 100
      )}.jpg`,
    },
    {
      id: 11,
      firstName: "Anna",
      eMail: "Anna@gmail.com",
      pic: `https://randomuser.me/api/portraits/women/${Math.floor(
        Math.random() * 100
      )}.jpg`,
    },
    {
      id: 12,
      firstName: "Robert",
      eMail: "Robert@gmail.com",
      pic: `https://randomuser.me/api/portraits/men/${Math.floor(
        Math.random() * 100
      )}.jpg`,
    },
    {
      id: 13,
      firstName: "Emily",
      eMail: "Emily@gmail.com",
      pic: `https://randomuser.me/api/portraits/women/${Math.floor(
        Math.random() * 100
      )}.jpg`,
    },
    {
      id: 14,
      firstName: "Michael",
      eMail: "Michael@gmail.com",
      pic: `https://randomuser.me/api/portraits/men/${Math.floor(
        Math.random() * 100
      )}.jpg`,
    },
    {
      id: 15,
      firstName: "Sophia",
      eMail: "Sophia@gmail.com",
      pic: `https://randomuser.me/api/portraits/women/${Math.floor(
        Math.random() * 100
      )}.jpg`,
    },
    {
      id: 16,
      firstName: "James",
      eMail: "James@gmail.com",
      pic: `https://randomuser.me/api/portraits/men/${Math.floor(
        Math.random() * 100
      )}.jpg`,
    },
    {
      id: 17,
      firstName: "Olivia",
      eMail: "Olivia@gmail.com",
      pic: `https://randomuser.me/api/portraits/women/${Math.floor(
        Math.random() * 100
      )}.jpg`,
    },
    {
      id: 18,
      firstName: "William",
      eMail: "William@gmail.com",
      pic: `https://randomuser.me/api/portraits/men/${Math.floor(
        Math.random() * 100
      )}.jpg`,
    },
    {
      id: 19,
      firstName: "Isabella",
      eMail: "Isabella@gmail.com",
      pic: `https://randomuser.me/api/portraits/women/${Math.floor(
        Math.random() * 100
      )}.jpg`,
    },
    {
      id: 20,
      firstName: "Alexander",
      eMail: "Alexander@gmail.com",
      pic: `https://randomuser.me/api/portraits/men/${Math.floor(
        Math.random() * 100
      )}.jpg`,
    },
    {
      id: 21,
      firstName: "Mia",
      eMail: "Mia@gmail.com",
      pic: `https://randomuser.me/api/portraits/women/${Math.floor(
        Math.random() * 100
      )}.jpg`,
    },
    {
      id: 22,
      firstName: "Daniel",
      eMail: "Daniel@gmail.com",
      pic: `https://randomuser.me/api/portraits/men/${Math.floor(
        Math.random() * 100
      )}.jpg`,
    },
    {
      id: 23,
      firstName: "Charlotte",
      eMail: "Charlotte@gmail.com",
      pic: `https://randomuser.me/api/portraits/women/${Math.floor(
        Math.random() * 100
      )}.jpg`,
    },
    {
      id: 24,
      firstName: "Matthew",
      eMail: "Matthew@gmail.com",
      pic: `https://randomuser.me/api/portraits/men/${Math.floor(
        Math.random() * 100
      )}.jpg`,
    },
    {
      id: 25,
      firstName: "Amelia",
      eMail: "Amelia@gmail.com",
      pic: `https://randomuser.me/api/portraits/women/${Math.floor(
        Math.random() * 100
      )}.jpg`,
    },
    {
      id: 26,
      firstName: "Joseph",
      eMail: "Joseph@gmail.com",
      pic: `https://randomuser.me/api/portraits/men/${Math.floor(
        Math.random() * 100
      )}.jpg`,
    },
    {
      id: 27,
      firstName: "Harper",
      eMail: "Harper@gmail.com",
      pic: `https://randomuser.me/api/portraits/women/${Math.floor(
        Math.random() * 100
      )}.jpg`,
    },
    {
      id: 28,
      firstName: "Henry",
      eMail: "Henry@gmail.com",
      pic: `https://randomuser.me/api/portraits/men/${Math.floor(
        Math.random() * 100
      )}.jpg`,
    },
    {
      id: 29,
      firstName: "Evelyn",
      eMail: "Evelyn@gmail.com",
      pic: `https://randomuser.me/api/portraits/women/${Math.floor(
        Math.random() * 100
      )}.jpg`,
    },
    {
      id: 30,
      firstName: "Jackson",
      eMail: "Jackson@gmail.com",
      pic: `https://randomuser.me/api/portraits/men/${Math.floor(
        Math.random() * 100
      )}.jpg`,
    },
  ];

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
          // backgroundColor:"black",
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
            // backgroundColor: "rgba(161, 32, 32, 0.7)",
            borderWidth: 1,
            // borderColor: COLORS.secondary,
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
