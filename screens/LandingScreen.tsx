import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebaseConfig"; // Import Firestore from your Firebase config
import { Ionicons } from "@expo/vector-icons";

const categories = [
  { name: "Japan", flag: "🇯🇵" },
  { name: "America", flag: "🇺🇸" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "China", flag: "🇨🇳" },
];

export default function LandingScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [shops, setShops] = useState([]);

  // Fetch shops from Firebase Firestore
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "shops"));
        const shopsList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setShops(shopsList);
      } catch (error) {
        console.error("Error fetching shops:", error);
      }
    };
    fetchShops();
  }, []);

  // Filter shops based on search query and selected category
  const filteredShops = shops.filter(
    (shop) =>
      (shop.name?.toLowerCase() || "").includes(searchQuery.toLowerCase() || "") &&
      (!selectedCategory || shop.country === selectedCategory)
  );

  return (
    <LinearGradient colors={["#FAD961", "#efa00b"]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("LiveChat")}>
          <Ionicons name="chatbubble-outline" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>محلات قطع الغيار</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          placeholder="Search for a shop"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Filters */}
      <View style={{ marginBottom: 10 }}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item.name}
          contentContainerStyle={{ paddingVertical: 5, alignItems: "center" }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item.name && styles.categoryButtonSelected,
              ]}
              onPress={() => setSelectedCategory(item.name === selectedCategory ? null : item.name)}
            >
              <Text style={styles.categoryText}>{item.flag} {item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Shop List */}
      <FlatList
        data={filteredShops}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.shopList}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.shopCard} onPress={() => navigation.navigate("ShopParts", { shopId: item.id })}>
            <Image source={{ uri: item.image || "https://via.placeholder.com/100" }} style={styles.shopImage} />
            <Text style={styles.shopName}>{item.name || "Unknown Shop"}</Text>
            <Text style={styles.shopCountry}>{item.country || "Unknown Country"}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate("Landing")} style={styles.navItem}>
          <Ionicons name="storefront" size={28} color="#F76B1C" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Cart")} style={styles.navItem}>
          <Ionicons name="cart-outline" size={28} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")} style={styles.navItem}>
          <Ionicons name="person-outline" size={28} color="black" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 50 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff", textAlign: "center", flex: 1 },
  searchContainer: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 10, padding: 8, alignItems: "center" },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16 },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 25,
    backgroundColor: "#fff",
    marginHorizontal: 5,
    marginVertical: 5,
    elevation: 3,
    width: 85,
    height: 40,
  },
  categoryButtonSelected: {
    backgroundColor: "#F76B1C",
  },
  categoryText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "bold",
  },
  shopList: { paddingVertical: 10 },
  shopCard: { backgroundColor: "#fff", padding: 10, borderRadius: 10, marginBottom: 10 },
  shopImage: { width: "100%", height: 100, borderRadius: 10 },
  shopName: { fontSize: 18, fontWeight: "bold", marginTop: 5 },
  shopCountry: { fontSize: 14, color: "gray" },
  bottomNav: { flexDirection: "row", justifyContent: "space-around", paddingVertical: 10, backgroundColor: "#fff" },
  navItem: { alignItems: "center", paddingVertical: 10 },
});

export default LandingScreen;
