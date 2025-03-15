// components/CartIcon.tsx

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../contexts/CartContext";

export default function CartIcon({ navigation }) {
  const { cartItems } = useCart();

  // Sum all item quantities to get total cart count
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Cart")}
      style={{ marginRight: 15 }}
    >
      <Ionicons name="cart-outline" size={26} color="#fff" />
      {totalItems > 0 && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{totalItems}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    // Position badge top-right relative to icon
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "red",
    borderRadius: 8,
    minWidth: 16,
    minHeight: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});
