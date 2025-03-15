// screens/ShopPartsScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../contexts/CartContext";

/** Example static data (replace with your Firestore data). */
const SAMPLE_PARTS = [
  { id: "1", name: "Spark Plugs", price: 25, image: "https://example.com/spark.jpg" },
  { id: "2", name: "Brake Pads", price: 40, image: "https://example.com/brakepads.jpg" },
  { id: "3", name: "Oil Filter", price: 15, image: "https://example.com/oilfilter.jpg" },
];

export default function ShopPartsScreen({ navigation }) {
  const { cartItems, addToCart } = useCart();

  const handleAddToCart = (item) => {
    // item matches Omit<CartItem, "quantity">
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
  };

  return (
    <LinearGradient colors={["#FAD961", "#efa00b"]} style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shop Parts</Text>

        {/* CART ICON + BADGE */}
        <TouchableOpacity
          style={{ position: "relative" }}
          onPress={() => navigation.navigate("Cart")}
        >
          <Ionicons name="cart-outline" size={28} color="#fff" />
          {cartItems.length > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{cartItems.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* LIST OF PARTS */}
      <FlatList
        data={SAMPLE_PARTS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 10 }}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>${item.price}</Text>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAddToCart(item)}
            >
              <Text style={styles.addButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: {
    marginBottom: 15,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  // Badge
  badgeContainer: {
    position: "absolute",
    top: -6,
    right: -10,
    backgroundColor: "red",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  // List items
  itemCard: {
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  itemImage: { width: "100%", height: 120, borderRadius: 8 },
  itemName: { fontSize: 16, fontWeight: "bold", marginTop: 5 },
  itemPrice: { fontSize: 14, color: "#F76B1C", marginVertical: 5 },
  addButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontWeight: "bold" },
});
