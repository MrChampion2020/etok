import React from "react";
import { StyleSheet, Text, View, Pressable, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import axios from "axios"; // Import axios for API requests
import { API_URL } from "../../../../config";

const Settings = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("auth");
      router.replace("/");
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              // Get user ID from AsyncStorage or another source
              const userId = await AsyncStorage.getItem("userId");
              if (userId) {
                // Implement account deletion logic here
                await axios.delete(`${API_URL}/users/${userId}`);
                await AsyncStorage.removeItem("auth");
                router.replace("/");
              }
            } catch (error) {
              console.error("Error deleting account", error);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.column}>
        <Pressable
          style={styles.button}
          onPress={() => router.push("./editProfile")} // Navigate to EditProfile screen
        >
          <Text style={styles.buttonText}>Edit Profile</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("BillDetails")}
        >
          <Text style={styles.buttonText}>Bill Details</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("Invite")}
        >
          <Text style={styles.buttonText}>Invite</Text>
        </Pressable>
        <Pressable style={styles.deleteButton} onPress={handleDeleteAccount}>
          <Text style={styles.buttonText}>Delete Account</Text>
        </Pressable>
      </View>
      <Pressable onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
  },
  column: {
    flexDirection: "column",
    alignItems: "center",
  },
  button: {
    width: "80%",
    padding: 15,
    backgroundColor: "#1da1f2",
    borderRadius: 5,
    marginVertical: 10,
  },
  deleteButton: {
    width: "80%",
    padding: 15,
    backgroundColor: "red",
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  logoutText: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
  },
});

export default Settings;

