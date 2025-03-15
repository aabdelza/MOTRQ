// screens/CheckoutScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";

export default function CheckoutScreen({ route, navigation }) {
  // Total passed from CartScreen (in dollars)
  const { total } = route.params || { total: 29.99 };
  // Stripe expects amount in cents
  const amountInCents = Math.round(total * 100);

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentSheetReady, setPaymentSheetReady] = useState(false);

  // Shipping details form state
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // Function to create PaymentIntent and initialize PaymentSheet
  const initializePayment = async () => {
    setLoading(true);
    try {
      // Replace with your backend URL. If using a physical device, ensure you use your computer’s IP address.
      const response = await fetch("http://192.168.110.44:3000/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountInCents }),
      });
      const { paymentIntentClientSecret } = await response.json();
      setClientSecret(paymentIntentClientSecret);

      // Initialize PaymentSheet with additional required options
      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: paymentIntentClientSecret,
        merchantDisplayName: "MOTRQ Store",
        applePay: { merchantCountryCode: "US" },
        returnURL: "motrq://stripe-redirect", // Must match your URL scheme
      });
      if (!error) {
        setPaymentSheetReady(true);
      } else {
        console.log("Error initializing PaymentSheet:", error);
      }
    } catch (error) {
      console.log("Error creating PaymentIntent:", error);
    }
    setLoading(false);
  };

  // When user taps "Continue to Payment," validate shipping details and initialize payment
  const handleContinueToPayment = async () => {
    if (!name || !address || !city || !postalCode) {
      alert("Please fill in all shipping details.");
      return;
    }
    // You might want to send these details to your backend here.
    await initializePayment();
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    if (error) {
      alert(`Payment error: ${error.message}`);
    } else {
      alert("Success! Payment completed. Thank you.");
      navigation.goBack();
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!paymentSheetReady) {
    // Show shipping details form
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Shipping Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="City"
          value={city}
          onChangeText={setCity}
        />
        <TextInput
          style={styles.input}
          placeholder="Postal Code"
          value={postalCode}
          onChangeText={setPostalCode}
          keyboardType="numeric"
        />
        <Button title="Continue to Payment" onPress={handleContinueToPayment} />
      </View>
    );
  }

  // When PaymentSheet is ready, show button to launch it
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Total: ${total}</Text>
      <Button title="Complete Payment" onPress={openPaymentSheet} />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
  },
});
