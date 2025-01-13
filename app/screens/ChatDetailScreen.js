import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { COLORS } from '../config';
import Icon from 'react-native-vector-icons/Ionicons';

const ChatDetailScreen = ({ route }) => {
  const [message, setMessage] = useState('');
  
  const mockMessages = [
    {
      id: '1',
      text: 'Merhaba, nasılsın?',
      time: '10:00',
      sender: 'other',
    },
    {
      id: '2',
      text: 'İyiyim, teşekkürler! Sen nasılsın?',
      time: '10:01',
      sender: 'me',
    },
    {
      id: '3',
      text: 'Ben de iyiyim. Bugün hava çok güzel!',
      time: '10:02',
      sender: 'other',
    },
    {
      id: '4',
      text: 'Evet, gerçekten öyle. Dışarı çıkmayı düşünüyor musun?',
      time: '10:03',
      sender: 'me',
    },
    {
      id: '5',
      text: 'Evet, biraz yürüyüş yapmayı planlıyorum.',
      time: '10:04',
      sender: 'other',
    },
  ];

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'me' ? styles.myMessage : styles.otherMessage
    ]}>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timeText}>{item.time}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mockMessages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Mesaj yazın..."
          maxLength={200}
          placeholderTextColor="#666"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity style={styles.sendButton}>
          <Icon name="send" size={24} color={COLORS.secondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  messagesList: {
    padding: 15,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 5,
    padding: 12,
    borderRadius: 15,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.secondary,
    borderBottomRightRadius: 5,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#333',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    color: 'white',
    fontSize: 16,
  },
  timeText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    color: 'white',
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatDetailScreen;
