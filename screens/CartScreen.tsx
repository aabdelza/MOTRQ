// screens/CartScreen.tsx
import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../contexts/CartContext";

export default function CartScreen({ navigation }) {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <LinearGradient colors={["#FAD961", "#efa00b"]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        <TouchableOpacity onPress={clearCart}>
          <Ionicons name="trash-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Cart List */}
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty.</Text>
        </View>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 15, paddingBottom: 120 }}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <Image source={{ uri: item.image }} style={styles.cartImage} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>
                  ${item.price} x {item.quantity}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFromCart(item.id)}
              >
                <Ionicons name="remove-circle-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* Footer: Total + Checkout Button */}
      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => navigation.navigate("Checkout", { total })}
          >
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
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
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#fff", fontSize: 18 },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  cartImage: { width: 60, height: 60, borderRadius: 8 },
  itemName: { fontSize: 16, fontWeight: "bold" },
  itemPrice: { fontSize: 14, color: "gray" },
  removeButton: {
    backgroundColor: "#FF3B30",
    borderRadius: 30,
    padding: 6,
    marginLeft: 10,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalText: { fontSize: 16, fontWeight: "bold" },
  checkoutButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  checkoutButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
