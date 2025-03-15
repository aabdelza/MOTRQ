import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from "react-native";
import { signOut, updateProfile } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen({ navigation }) {
  const [displayName, setDisplayName] = useState(auth.currentUser?.displayName || "");
  const [phone, setPhone] = useState(""); // Fetch phone from Firestore
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth.currentUser) return;

      const userDoc = await getDoc(doc(firestore, "Users", auth.currentUser.uid));
      if (userDoc.exists()) {
        setDisplayName(userDoc.data().Name || "");
        setPhone(userDoc.data().Phone || "");
      }
    };

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) fetchProfile();
    });

    return unsubscribe;
  }, []);

  const handleSaveProfile = async () => {
    if (!auth.currentUser) return;

    try {
      await updateProfile(auth.currentUser, { displayName });
      await setDoc(doc(firestore, "Users", auth.currentUser.uid), { Name: displayName, Phone: phone }, { merge: true });
      setEditing(false);
    } catch (error) {
      console.error("Profile Update Error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("SignIn");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <LinearGradient colors={["#FAD961", "#F76B1C"]} style={styles.container}>
      <View style={styles.profileCard}>
        <Image source={{ uri: "https://via.placeholder.com/100" }} style={styles.profileImage} />
        <Text style={styles.title}>Profile</Text>
        {editing ? (
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Enter your name"
          />
        ) : (
          <Text style={styles.profileText}>{displayName || "No Name Set"}</Text>
        )}
        {editing ? (
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone number"
            keyboardType="numeric"
          />
        ) : (
          <Text style={styles.profileText}>Phone: {phone || "No Phone Set"}</Text>
        )}
        {editing ? (
          <TouchableOpacity onPress={handleSaveProfile} style={styles.saveButton}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setEditing(true)} style={styles.editButton}>
            <Ionicons name="create-outline" size={20} color="white" />
            <Text style={styles.buttonText}> Edit Profile</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => navigation.navigate("OrderHistory")} style={styles.historyButton}>
          <Ionicons name="receipt-outline" size={20} color="white" />
          <Text style={styles.buttonText}> View Order History</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={20} color="white" />
        <Text style={styles.logoutText}> Logout</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  profileCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    width: "90%",
    elevation: 5,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 10 },
  profileText: { fontSize: 18, color: "#555", marginBottom: 10 },
  input: {
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 8,
    width: "90%",
    marginBottom: 10,
    textAlign: "center",
  },
  editButton: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#34C759",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  historyButton: {
    backgroundColor: "#FFA500",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  logoutText: { color: "white", fontSize: 18, fontWeight: "bold" },
});

export default ProfileScreen;