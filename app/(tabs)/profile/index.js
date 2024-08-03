import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode"; // Corrected import statement
import { View, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Profile from "../../../components/Profile";
import { API_URL } from '../../../config';

const Index = () => {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState();
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("auth");
        if (token) {
          const decodedToken = jwt_decode(token); // Corrected usage
          const userId = decodedToken.userId;
          setUserId(userId);
        }
      } catch (error) {
        console.log("Error decoding token", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchUserDescriptionAndProfiles = async () => {
      try {
        const responseUser = await axios.get(`${API_URL}/users/${userId}`);
        setUser(responseUser.data.user);

        const responseProfiles = await axios.get(`${API_URL}/profiles`, {
          params: {
            userId: userId,
            gender: responseUser.data.user?.gender,
            turnOns: responseUser.data.user?.turnOns,
            lookingFor: responseUser.data.user?.lookingFor,
          },
        });
        setProfiles(responseProfiles.data.profiles);
      } catch (error) {
        console.log("Error fetching user description and profiles", error);
      }
    };

    if (userId) {
      fetchUserDescriptionAndProfiles();
    }
  }, [userId]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={profiles}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item, index }) => (
          <Profile
            item={item}
            userId={userId}
            setProfiles={setProfiles}
            isEven={index % 2 === 0}
            key={item._id.toString()}
          />
        )}
      />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({});
