import { signInWithEmail, signUpWithEmail } from "@/utils/SupaLegend";
import { supabase } from "@/utils/SupaLegend";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, TextInput } from "react-native";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  //   async function signInWithEmail() {
  //     setLoading(true);
  //     const { error } = await supabase.auth.signInWithPassword({
  //       email: email,
  //       password: password,
  //     });

  //     if (error) Alert.alert(error.message);
  //     setLoading(false);
  //     router.push("/todo");
  //   }
  async function handleSignIn() {
    setLoading(true);
    const { error } = await signInWithEmail(email, password);
    if (error) Alert.alert(error.message);
    else router.push("/todo");
    setLoading(false);
  }

  //   async function signUpWithEmail() {
  //     setLoading(true);
  //     const {
  //       data: { session },
  //       error,
  //     } = await supabase.auth.signUp({
  //       email: email,
  //       password: password,
  //     });

  //     if (error) Alert.alert(error.message);
  //     if (!session) {
  //       Alert.alert("Please check your inbox for email verification!");
  //     } else {
  //       router.push("/todo");
  //     }
  //     setLoading(false);
  //   }

  async function handleSignUp() {
    setLoading(true);
    const { session, error } = await signUpWithEmail(email, password);
    if (error) Alert.alert(error.message);
    else if (!session) {
      Alert.alert("Please check your inbox for email verification!");
    } else {
      router.push("/todo");
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TextInput
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title="Sign in"
          disabled={loading}
          onPress={() => handleSignIn()}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Button
          title="Sign up"
          disabled={loading}
          onPress={() => handleSignUp()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
