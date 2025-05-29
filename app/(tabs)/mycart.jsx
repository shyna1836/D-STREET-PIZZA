import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert, TextInput, Modal, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';

const MyCart = () => {
  const [cart, setCart] = useState([]);
  const [checked, setChecked] = useState([]); // Track checked items
  const [total, setTotal] = useState(0);
  const navigation = useNavigation();

  // Address modal state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [street, setStreet] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [addressError, setAddressError] = useState('');

  // Calculate total for checked items only
  useEffect(() => {
    const totalPrice = cart.reduce(
      (sum, item, idx) => checked.includes(idx) ? sum + (item.price || 0) * (item.quantity || 1) : sum,
      0
    );
    setTotal(totalPrice);
  }, [cart, checked]);

  useEffect(() => {
    const fetchCart = async () => {
      const cartData = await AsyncStorage.getItem('cart');
      let cartArr = cartData ? JSON.parse(cartData) : [];
      cartArr = cartArr.map(item => ({ ...item, quantity: item.quantity || 1 }));
      setCart(cartArr);
      setChecked(cartArr.map((_, idx) => idx)); // Select all by default
    };
    const unsubscribe = navigation.addListener('focus', fetchCart);
    fetchCart();
    return unsubscribe;
  }, [navigation]);

  const updateQuantity = async (index, change) => {
    let newCart = [...cart];
    let item = { ...newCart[index] };
    const newQuantity = (item.quantity || 1) + change;
    if (newQuantity <= 0) {
      Alert.alert(
        "Remove item?",
        `Are you sure you want to remove "${item.name}" from your cart?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Remove", style: "destructive", onPress: () => deleteItem(index) }
        ]
      );
      return;
    }
    item.quantity = newQuantity;
    newCart[index] = item;
    setCart(newCart);
    await AsyncStorage.setItem('cart', JSON.stringify(newCart));
  };

  const deleteItem = async (index) => {
    let newCart = [...cart];
    const removed = newCart.splice(index, 1);
    setCart(newCart);
    setChecked(checked.filter(i => i !== index));
    await AsyncStorage.setItem('cart', JSON.stringify(newCart));
    Alert.alert("Item removed", `"${removed[0]?.name}" has been removed from your cart.`);
  };

  const handleDeletePress = (index, itemName) => {
    Alert.alert(
      "Remove item?",
      `Are you sure you want to remove "${itemName}" from your cart?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", style: "destructive", onPress: () => deleteItem(index) }
      ]
    );
  };

  const handleCheckout = () => {
    if (!cart.length || checked.length === 0) {
      Alert.alert('Please select at least one item to buy!');
      return;
    }
    setShowAddressModal(true);
  };

  const handleConfirmAddress = () => {
    if (!fullName.trim() || !street.trim() || !address.trim() || !phone.trim()) {
      setAddressError('Please fill in all fields.');
      return;
    }
    setAddressError('');
    setShowAddressModal(false);

    // Confirmation for purchasing
    Alert.alert(
      "Confirm Purchase",
      "Are you sure you want to purchase the selected items?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm", style: "default", onPress: async () => {
            // Optionally clear cart or update it
            // Here, we clear only the checked items
            const uncheckedCart = cart.filter((_, idx) => !checked.includes(idx));
            await AsyncStorage.setItem('cart', JSON.stringify(uncheckedCart));
            setCart(uncheckedCart);
            setChecked(uncheckedCart.map((_, idx) => idx));

            Alert.alert(
              "Purchase Successful",
              "Thank you for your purchase!",
              [
                {
                  text: "OK",
                  onPress: () => navigation.navigate('menu')
                }
              ],
              { cancelable: false }
            );
          }
        }
      ]
    );
  };

  const toggleCheck = (idx) => {
    setChecked(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  if (!cart.length) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#fff', fontSize: 18 }}>Your cart is empty.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Cart</Text>
      <AntDesign name="shoppingcart" size={24} color="black" />
      <FlatList
        data={cart}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.itemRow}>
            <TouchableOpacity onPress={() => toggleCheck(index)}>
              <Ionicons
                name={checked.includes(index) ? "checkmark-circle" : "ellipse-outline"}
                size={28}
                color={checked.includes(index) ? "#ff9900" : "#aaa"}
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
            <Image source={{ uri: item.image }} style={styles.img} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>₱{item.price?.toFixed(2)}</Text>
            </View>
            <View style={styles.qtyContainer}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateQuantity(index, -1)}
              >
                <Text style={styles.qtyBtnText}>–</Text>
              </TouchableOpacity>
              <Text style={styles.qtyText}>{item.quantity || 1}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateQuantity(index, 1)}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDeletePress(index, item.name)}
            >
              <Text style={styles.deleteBtnText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
        style={{ marginBottom: 20 }}
      />
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalPrice}>₱{total.toFixed(2)}</Text>
      </View>
      <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Buy Now</Text>
      </TouchableOpacity>

      <Modal
        visible={showAddressModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAddressModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delivery Information</Text>
            <ScrollView>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#aaa"
                value={fullName}
                onChangeText={setFullName}
              />
              <TextInput
                style={styles.input}
                placeholder="Street"
                placeholderTextColor="#aaa"
                value={street}
                onChangeText={setStreet}
              />
              <TextInput
                style={styles.input}
                placeholder="Address (Barangay, City, Zip)"
                placeholderTextColor="#aaa"
                value={address}
                onChangeText={setAddress}
                multiline
              />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="#aaa"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
              {addressError ? <Text style={styles.errorText}>{addressError}</Text> : null}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 }}>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: '#aaa' }]}
                  onPress={() => setShowAddressModal(false)}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalBtn}
                  onPress={handleConfirmAddress}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 8,
    paddingTop: 50,
  },
  header: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 10,
    marginBottom: 14,
    padding: 5,
  },
  img: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 16,
  },
  name: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  price: {
    color: '#fff',
    fontSize: 16,
    marginTop: 4,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    backgroundColor: '#333',
    borderRadius: 10,
  },
  qtyBtn: {
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  qtyBtnText: {
    color: '#ff9900',
    fontSize: 22,
    fontWeight: 'bold',
  },
  qtyText: {
    color: '#fff',
    fontSize: 16,
    marginHorizontal: 8,
    minWidth: 22,
    textAlign: 'center',
  },
  deleteBtn: {
    marginLeft: 8,
    padding: 4,
  },
  deleteBtnText: {
    fontSize: 20,
    color: '#ff4444',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 8,
  },
  totalLabel: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  totalPrice: {
    color: '#ff9900',
    fontSize: 20,
    fontWeight: 'bold',
  },
  checkoutBtn: {
    backgroundColor: '#ff9900',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '88%',
    backgroundColor: '#181818',
    borderRadius: 12,
    padding: 22,
    elevation: 6,
    maxHeight: 440,
  },
  modalTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 44,
    marginBottom: 10,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  modalBtn: {
    backgroundColor: '#ff9900',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginHorizontal: 6,
  },
});

export default MyCart;