import React, { useState, useReducer } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
type Pizza = {
  name: string;
  price: number;
  image: string;
};

type Action =
  | { type: 'ADD_PIZZA'; payload: { pizza: Pizza } }
  | { type: 'REMOVE_PIZZA'; payload: { name: string } };

// Reducer function (for local display, not main storage)
const reducer = (state: Pizza[], action: Action): Pizza[] => {
  switch (action.type) {
    case 'ADD_PIZZA':
      return [...state, action.payload.pizza];
    case 'REMOVE_PIZZA':
      return state.filter(pizza => pizza.name !== action.payload.name);
    default:
      return state;
  }
};

// Pizza data
const pizzas: Pizza[] = [
  {
    name: 'Pepperoni Pizza',
    price: 322.0,
    image: 'https://th.bing.com/th/id/OIP.1-U83fzNqPbKBJkHJGcyDgHaE8?rs=1&pid=ImgDetMain',
  },
  {
    name: 'Hawaiian Pizza',
    price: 350.0,
    image: 'https://thestayathomechef.com/wp-content/uploads/2023/04/Hawaiian-Pizza-8-1200x720.jpg',
  },
  {
    name: 'Four Cheese Pizza',
    price: 399.0,
    image: 'https://www.mashed.com/img/gallery/the-best-cheeses-for-pizza-ranked/intro-1673461506.jpg',
  },
  {
    name: 'Bacon Ham Pizza',
    price: 370.0,
    image: 'https://bing.com/th?id=OSK.f0303da3845fa604be63d289f97dd1f5',
  },
];

const Menu = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredPizzas, setFilteredPizzas] = useState<Pizza[]>(pizzas);

  // Local reducer, not needed for cart logic (storage is main source of truth)
  const [cart, dispatch] = useReducer(reducer, []);

  const handleSearch = () => {
    const trimmed = searchText.trim().toLowerCase();
    if (!trimmed) {
      setFilteredPizzas(pizzas);
    } else {
      setFilteredPizzas(
        pizzas.filter(pizza =>
          pizza.name.toLowerCase().includes(trimmed)
        )
      );
    }
  };

  // Add to cart handler with AsyncStorage and duplicate check
  const handleAddToCart = async (pizza: Pizza) => {
    const cartData = await AsyncStorage.getItem('cart');
    let currentCart: Pizza[] = cartData ? JSON.parse(cartData) : [];
    const alreadyInCart = currentCart.some(item => item.name === pizza.name);

    if (alreadyInCart) {
      Alert.alert("Already in Cart", `"${pizza.name}" is already in your cart.`);
      return;
    }
    Alert.alert(
      "Add to Cart",
      `Add "${pizza.name}" to your cart?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Add",
          onPress: async () => {
            currentCart.push(pizza);
            await AsyncStorage.setItem('cart', JSON.stringify(currentCart));
            dispatch({ type: 'ADD_PIZZA', payload: { pizza } }); // update local (optional)
            Alert.alert("Added!", `"${pizza.name}" has been added to your cart.`);
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: '#000' }]}>

      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search menu..."
          placeholderTextColor="#aaa"
          style={styles.searchInput}
          underlineColorAndroid="transparent"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity onPress={handleSearch} style={{ marginLeft: 8 }}>
          <Text style={{ fontSize: 20, color: '#fff' }}>🔍</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingTop: 120, paddingBottom: 40 }}>
        <Text style={styles.menuTitle}>MENU</Text>
        <View style={styles.pizzaGrid}>
          {filteredPizzas.length > 0 ? (
            filteredPizzas.map((pizza, idx) => (
              <View
                key={idx}
                style={styles.pizzaCard}
              >
                <Image
                  source={{ uri: pizza.image }}
                  style={styles.pizzaImg}
                  resizeMode="cover"
                />
                <View style={styles.rowBetween}>
                  <Text style={styles.pizzaName}>{pizza.name}</Text>
                  <TouchableOpacity
                    style={styles.addToCartBtn}
                    onPress={() => handleAddToCart(pizza)}
                  >
                    <AntDesign name="shoppingcart" size={22} color="#ff9900" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.pizzaPrice}>₱ {pizza.price.toFixed(2)}</Text>
              </View>
            ))
          ) : (
            <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center', marginTop: 40 }}>
              No pizzas found.
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  searchRow: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    position: 'absolute',
    top: 40,
    left: '5%',
    zIndex: 2,
  },
  searchInput: { flex: 1, fontSize: 16, color: '#fff', padding: 0 },
  menuTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 2,
    color: '#fff',
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 20,
  },
  pizzaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  pizzaCard: {
    width: 150,
    marginBottom: 40,
    backgroundColor: '#191919',
    borderRadius: 12,
    alignItems: 'flex-start',
    padding: 10,
    marginHorizontal: 5,
  },
  pizzaImg: { width: 130, height: 110, borderRadius: 12, marginBottom: 8, alignSelf: 'center' },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 2,
  },
  pizzaName: { fontSize: 16, fontWeight: '600', color: '#fff', flex: 1, flexWrap: 'wrap' },
  addToCartBtn: {
    marginLeft: 8,
    padding: 3,
    borderRadius: 50,
  },
  pizzaPrice: { fontSize: 16, fontWeight: '600', color: '#fff' },
});

export default Menu;