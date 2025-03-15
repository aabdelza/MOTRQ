import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { TextInput as PaperInput, Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from "@expo-google-fonts/poppins";

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) return null;

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace("Landing");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <LinearGradient colors={["#FAD961", "#F76B1C"]} style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>
        Don't have an account?{" "}
        <Text style={styles.link} onPress={() => navigation.navigate("SignUp")}>
          Sign Up
        </Text>
      </Text>

      <View style={styles.formContainer}>
        <PaperInput mode="outlined" label="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />

        <PaperInput
          mode="outlined"
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secureTextEntry}
          right={<PaperInput.Icon icon={secureTextEntry ? "eye-off" : "eye"} onPress={() => setSecureTextEntry(!secureTextEntry)} />}
          style={styles.input}
        />

        <Button mode="contained" onPress={handleSignIn} style={styles.signInButton} labelStyle={styles.buttonText}>
          Sign In
        </Button>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 },
  title: { fontSize: 32, fontFamily: "Poppins_600SemiBold", color: "#fff", marginBottom: 5 },
  subtitle: { fontSize: 16, fontFamily: "Poppins_400Regular", color: "#fff", marginBottom: 20 },
  link: { color: "#007BFF", fontWeight: "bold" },
  formContainer: { backgroundColor: "white", borderRadius: 15, padding: 20, width: "100%", maxWidth: 380 },
  input: { marginVertical: 8, backgroundColor: "#f5f5f5" },
  signInButton: { backgroundColor: "#007BFF", marginTop: 10, padding: 10 },
  buttonText: { fontSize: 18 },
});

export default SignInScreen;
