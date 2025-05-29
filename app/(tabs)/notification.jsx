import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const DUMMY_NOTIFICATIONS = [
  {
    id: '0',
    title: 'Order To Confirm',
    message: 'Your order #1235 is awaiting confirmation.',
    read: false,
    time: '1m ago',
  },
  {
    id: '1',
    title: 'Order To Process',
    message: 'Your order #1234 is being processed.',
    read: false,
    time: '2m ago',
  },
  {
    id: '2',
    title: 'Order To Deliver',
    message: 'Your order #1234 is out for delivery.',
    read: false,
    time: '10m ago',
  },
  {
    id: '3',
    title: 'Order Delivered',
    message: 'Your order #1234 has been successfully delivered.',
    read: false,
    time: '1h ago',
  },
];

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setNotifications(DUMMY_NOTIFICATIONS);
  }, []);

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.notificationBox, item.read && styles.readBox]}
      onPress={() => handleMarkAsRead(item.id)}
    >
      <Ionicons
        name={item.read ? "notifications-outline" : "notifications"}
        size={28}
        color={item.read ? "#aaa" : "#ff9900"}
        style={{ marginRight: 10 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, item.read && styles.readText]}>{item.title}</Text>
        <Text style={[styles.message, item.read && styles.readText]}>{item.message}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No notifications.</Text>}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 50,
    paddingHorizontal: 18,
  },
  header: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
  },
  notificationBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#181818',
    borderRadius: 10,
    marginBottom: 14,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9900',
  },
  readBox: {
    backgroundColor: '#222',
    borderLeftColor: '#aaa',
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
  },
  message: {
    fontSize: 15,
    color: '#fff',
    marginTop: 2,
  },
  readText: {
    color: '#aaa',
  },
  time: {
    fontSize: 12,
    color: '#ff9900',
    marginTop: 5,
  },
  empty: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
  },
});

export default Notification;