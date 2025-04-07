import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Pressable, Image } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { COLORS } from '../config';
import { generateResponse } from '../services/chatService';

const ChatBotScreen = ({ route, navigation }) => {
  const { scientist } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const welcomeMessage = {
      id: Date.now(),
      text: `Merhaba! Ben ${scientist.name}. Sizinle sohbet etmek için sabırsızlanıyorum. Bana merak ettiğiniz her şeyi sorabilirsiniz.`,
      isUser: false
    };
    setMessages([welcomeMessage]);
  }, [scientist]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      isUser: true
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await generateResponse(scientist, inputText);
      
      // Eğer yanıt gelmediyse
      if (!response) {
        throw new Error('Yanıt alınamadı');
      }

      const botMessage = {
        id: Date.now() + 1,
        text: response,
        isUser: false
      };

      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      // Hata mesajını kullanıcıya göster
      const errorMessage = {
        id: Date.now() + 1,
        text: "Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.",
        isUser: false,
        isError: true
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageItem,
      item.isUser ? styles.userMessage : styles.botMessage
    ]}>
      {!item.isUser && (
        <View style={styles.avatarContainer}>
          <Image source={scientist.image} style={styles.avatar} />
          {/* <View style={styles.onlineIndicator} /> */}
        </View>
      )}
      <View style={[
        styles.messageContent,
        item.isUser ? styles.userMessageContent : styles.botMessageContent
      ]}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={COLORS.white} />
        </Pressable>
        <View style={styles.headerInfo}>
          <View style={styles.avatarContainer}>
            <Image source={scientist.image} style={styles.headerAvatar} />
            {/* <View style={styles.onlineIndicator} /> */}
          </View>
          <Text style={styles.headerText}>{scientist.name}</Text>
        </View>
      </View>
      
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.messagesList}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Mesajınızı yazın..."
          placeholderTextColor={COLORS.gray}
        />
        <Pressable 
          onPress={sendMessage} 
          style={styles.sendButton}
          disabled={isLoading}
        >
          <Icon 
            name={isLoading ? "timer" : "send"} 
            size={20} 
            color={COLORS.white} 
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {
    padding: 8,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  messagesList: {
    padding: 16,
  },
  messageItem: {
    flexDirection: 'row',
    marginBottom: 16,
    // maxWidth: '80%',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  // onlineIndicator: {
  //   position: 'absolute',
  //   right: 0,
  //   bottom: 0,
  //   width: 12,
  //   height: 12,
  //   borderRadius: 6,
  //   backgroundColor: '#4CAF50',
  //   borderWidth: 2,
  //   borderColor: 'black',
  // },
  messageContent: {
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  botMessage: {
    alignSelf: 'flex-start',
  },
  userMessageContent: {
    backgroundColor: COLORS.primary,
    marginLeft: 12,
    borderTopRightRadius: 4,
  },
  botMessageContent: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginLeft: 12,
    borderTopLeftRadius: 4,
  },
  messageText: {
    color: COLORS.white,
    fontSize: 14,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: COLORS.white,
    marginRight: 8,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
  },
});

export default ChatBotScreen;
