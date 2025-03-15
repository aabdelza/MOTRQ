import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { TextInput as PaperInput, Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from "@expo-google-fonts/poppins";

export default function SignUpScreen({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) return null;

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.replace("Landing");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <LinearGradient colors={["#FAD961", "#F76B1C"]} style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>
        Already have an account?{" "}
        <Text style={styles.link} onPress={() => navigation.navigate("SignIn")}>
          Sign In
        </Text>
      </Text>

      <View style={styles.formContainer}>
        <View style={styles.row}>
          <PaperInput mode="outlined" label="First Name" value={firstName} onChangeText={setFirstName} style={styles.halfInput} />
          <PaperInput mode="outlined" label="Last Name" value={lastName} onChangeText={setLastName} style={styles.halfInput} />
        </View>

        <PaperInput mode="outlined" label="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
        <PaperInput mode="outlined" label="Phone Number" value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" />

        <PaperInput
          mode="outlined"
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secureTextEntry}
          right={<PaperInput.Icon icon={secureTextEntry ? "eye-off" : "eye"} onPress={() => setSecureTextEntry(!secureTextEntry)} />}
          style={styles.input}
        />

        <Button mode="contained" onPress={handleSignUp} style={styles.signUpButton} labelStyle={styles.buttonText}>
          Sign Up
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
  row: { flexDirection: "row", justifyContent: "space-between" },
  halfInput: { width: "48%" },
  input: { marginVertical: 8, backgroundColor: "#f5f5f5" },
  signUpButton: { backgroundColor: "#007BFF", marginTop: 10, padding: 10 },
  buttonText: { fontSize: 18 },
});

export default SignUpScreen;



