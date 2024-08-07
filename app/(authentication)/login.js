/*import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from '../../config';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("auth");
        if (token) {
          router.replace("/(tabs)/profile");
        }
      } catch (error) {
        console.log("Error", error);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    const user = {
      email,
      password,
    };

    try {
      const response = await axios.post(`${API_URL}/login`, user);
      console.log(response);

      const token = response.data.token;
      await AsyncStorage.setItem("auth", token);

      router.replace("/(authentication)/select");
    } catch (error) {
      Alert.alert(
        "Login Error",
        "An error occurred while logging in. Please check your credentials and try again."
      );
      console.log("Login failed", error);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}
    >
      <View style={{ height: 200, backgroundColor: "#1da1f2", width: "100%" }}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 15,
          }}
        >
          <Image
            style={{ width: 150, height: 80, resizeMode: "contain" }}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/736/736605.png",
            }}
          />
        </View>
        <Text
          style={{
            marginTop: 10,
            textAlign: "center",
            fontSize: 45,
            fontFamily: "sans-serif",
            color: "white",
            fontWeight: "900",
          }}
        >
          Etok
        </Text>
      </View>

      <KeyboardAvoidingView>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "bold",
              marginTop: 25,
              color: "#1da1f2",
            }}
          >
            Log in to your Account
          </Text>
        </View>

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Image
            style={{ width: 100, height: 80, resizeMode: "cover" }}
            source={{
              uri: "https://cdn-icons-gif.flaticon.com/10471/10471023.gif",
            }}
          />
        </View>

        <View style={{ marginTop: 10 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#1da1f2",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 20,
            }}
          >
            <MaterialIcons
              style={{ marginLeft: 8 }}
              name="email"
              size={24}
              color="white"
            />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={"white"}
              style={{
                color: "white",
                marginVertical: 10,
                width: 300,
                fontSize: 17,
              }}
            />
          </View>

          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: "#1da1f2",
                paddingVertical: 5,
                borderRadius: 5,
                marginTop: 20,
              }}
            >
              <AntDesign
                style={{ marginLeft: 8 }}
                name="lock1"
                size={24}
                color="white"
              />
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                placeholder="Enter your password"
                style={{
                  color: "white",
                  marginVertical: 8,
                  width: 300,
                  fontSize: 17,
                }}
                placeholderTextColor="white"
              />
            </View>
          </View>

          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text>Keep me logged in</Text>
            <Text style={{ color: "#1da1f2", fontWeight: "500" }}>
              Forgot Password
            </Text>
          </View>

          <View style={{ marginTop: 20 }} />

          <Pressable
            onPress={handleLogin}
            style={{
              width: "100%",
              backgroundColor: "#1da1f2",
              borderRadius: 6,
              marginLeft: "auto",
              marginRight: "auto",
              padding: 15,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Login
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace("/register")}
            style={{ marginTop: 10 }}
          >
            <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
              Don't have an account? Sign Up
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({});


*/import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../config";

const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("auth");
        if (token) {
          router.replace("/(tabs)/profile");
        }
      } catch (error) {
        console.log("Error checking login status:", error);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    const user = {
      email: email,
      password: password,
    };
    try {
      const response = await axios.post(`${API_URL}/login`, user);
      if (response.status === 200) {
        const token = response.data.token;
        await AsyncStorage.setItem("auth", token);
        router.replace("/(authentication)/select");
      } else {
        console.error("Login failed with status:", response.status);
        alert("An error occurred while logging in. Please check credentials and try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred while logging in. Please check credentials and try again.");
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}
    >
      <View style={{ height: 200, backgroundColor: "#1da1f2", width: "100%" }}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 15,
          }}
        >
          <Image
            style={{ width: 150, height: 80, resizeMode: "contain" }}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/736/736605.png",
            }}
          />
        </View>
        <Text
          style={{
            marginTop: 10,
            textAlign: "center",
            fontSize: 45,
            fontFamily: "sans-serif",
            color: "white",
            fontWeight: "900",
          }}
        >
          Etok
        </Text>
      </View>

      <KeyboardAvoidingView>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "bold",
              marginTop: 25,
              color: "#1da1f2",
            }}
          >
            Log in to your Account
          </Text>
        </View>

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Image
            style={{ width: 100, height: 80, resizeMode: "cover" }}
            source={{
              uri: "https://cdn-icons-gif.flaticon.com/10471/10471023.gif",
            }}
          />
        </View>

        <View style={{ marginTop: 10 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#1da1f2",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 20,
            }}
          >
            <MaterialIcons
              style={{ marginLeft: 8 }}
              name="email"
              size={24}
              color="white"
            />
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Enter your email"
              placeholderTextColor={"white"}
              style={{
                color: "white",
                marginVertical: 10,
                width: 300,
                fontSize: password ? 17 : 17,
              }}
            />
          </View>

          <View style={{}}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: "#1da1f2",
                paddingVertical: 5,
                borderRadius: 5,
                marginTop: 20,
              }}
            >
              <AntDesign
                style={{ marginLeft: 8 }}
                name="lock1"
                size={24}
                color="white"
              />
              <TextInput
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
                placeholder="Enter your password"
                style={{
                  color: "white",
                  marginVertical: 8,
                  width: 300,
                  fontSize: password ? 17 : 17,
                }}
                placeholderTextColor="white"
              />
            </View>
          </View>

          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text>Keep me logged in</Text>

            <Text style={{ color: "#1da1f2", fontWeight: "500" }}>
              Forgot Password
            </Text>
          </View>

          <View style={{ marginTop: 20 }} />

          <Pressable
            onPress={handleLogin}
            style={{
              width: "100%",
              backgroundColor: "#1da1f2",
              borderRadius: 6,
              marginLeft: "auto",
              marginRight: "auto",
              padding: 15,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Login
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace("/register")}
            style={{ marginTop: 10 }}
          >
            <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
              Don't have an account? Sign Up
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default login;

const styles = StyleSheet.create({});
