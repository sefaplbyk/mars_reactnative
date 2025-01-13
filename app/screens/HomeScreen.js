import { View, ActivityIndicator, FlatList } from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import Screen from "../components/layout/Screen";
import Post from "../components/post/Post";
import { getAllPosts } from "../services/postService";
import { COLORS } from "../config";
import { formatDate } from "../utils/formatDate";

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useLayoutEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getAllPosts();
      setPosts(data);
    } catch (err) {
    
     setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const renderPostItem = ({ item }) => (

      <Post
      postId = {item.id}
      postAuthorId={item.authorId}
      userName={item.userName}
      userEmail={item.userEmail}
      userProfilePic={item.userProfilePic}
      content={item.content}
      likesCount={item.likesCount}
      commentCount={item.commentsCount || 0}
      date={formatDate(item.date)}
      />
    
  );

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator size="large" color={COLORS.secondary} />
      </Screen>
    );
  }

  return (
    <Screen>
      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingVertical: 20 }}
        onRefresh={fetchPosts}
        refreshing={loading}
      />
    </Screen>
  );
};

export default HomeScreen;
