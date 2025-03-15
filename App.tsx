import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StripeProvider } from "@stripe/stripe-react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

import LandingScreen from "./screens/LandingScreen";
import ShopPartsScreen from "./screens/ShopPartsScreen";
import CartScreen from "./screens/CartScreen";
import CheckoutScreen from "./screens/CheckoutScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import OrderHistoryScreen from "./screens/OrderHistoryScreen";
import { CartProvider } from "./contexts/CartContext";

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#F76B1C" />
      </View>
    );
  }

  return (
    <StripeProvider publishableKey="pk_test_51R31QtFqwdxUxuFvMH6l6gfAwxAyRRysqlT6kB3Y82MLdu9FMQ3VdpLQLhZkiNqNReZWvrXil98K4tjDfti0HOCM005UObn0Bh">
      <CartProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={user ? "Landing" : "SignIn"}>
            {!user ? (
              <>
                <Stack.Screen
                  name="SignIn"
                  component={SignInScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="SignUp"
                  component={SignUpScreen}
                  options={{ headerShown: false }}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name="Landing"
                  component={LandingScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="ShopParts"
                  component={ShopPartsScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Cart"
                  component={CartScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Checkout"
                  component={CheckoutScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Profile"
                  component={ProfileScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="OrderHistory"
                  component={OrderHistoryScreen}
                  options={{ headerShown: false }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </StripeProvider>
  );
}
