import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ScrollView } from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore, auth } from "../firebaseConfig";
import { LinearGradient } from "expo-linear-gradient";

export default function OrderHistoryScreen() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!auth.currentUser) {
        console.error("No user logged in");
        return;
      }

      try {
        console.log("Fetching orders for UID:", auth.currentUser.uid); // Debugging
        const q = query(
          collection(firestore, "Orders"),
          where("Customer", "==", auth.currentUser.uid)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log("No orders found in Firestore for this user.");
        }

        const ordersList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            Items: typeof data.Items === "string" ? JSON.parse(data.Items) : data.Items, // Convert string to JSON if needed
          };
        });

        console.log("Fetched Orders:", ordersList); // Debugging
        setOrders(ordersList);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <LinearGradient colors={["#FAD961", "#efa00b"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Order Summary</Text>
        {orders.length === 0 ? (
          <Text style={styles.noOrdersText}>No orders found.</Text>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.orderCard}>
                <Text style={styles.orderText}>Order ID: {item.ID}</Text>
                <Text style={styles.orderText}>Shop: {item.Vendor}</Text>
                <Text style={styles.orderText}>Amount: ${item.Amount}</Text>
                <Text style={styles.orderText}>Items:</Text>
                {item.Items.map((product, index) => (
                  <Text key={index} style={styles.itemText}>
                    - {product.name} x {product.quantity} (${product.price})
                  </Text>
                ))}
              </View>
            )}
          />
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: 20, alignItems: "center" },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 40,
  },
  noOrdersText: { fontSize: 18, textAlign: "center", color: "#fff", marginTop: 20 },
  orderCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    width: "90%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  orderText: { fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 5 },
  itemText: { fontSize: 16, color: "#555" },
});
