import React, { useState, useEffect } from "react";
import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";
import { View, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Profile from "../../../components/Profile";

const Index = () => {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState();
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("auth");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchUserDescriptionAndProfiles = async () => {
      try {
        const responseUser = await axios.get(`https://etok-ef21c0e14609.herokuapp.com:3000/users/${userId}`);
        setUser(responseUser.data.user);

        const responseProfiles = await axios.get("https://etok-ef21c0e14609.herokuapp.com:3000/profiles", {
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
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Profile
            key={index}
            item={item}
            userId={userId}
            setProfiles={setProfiles}
            isEven={index % 2 === 0}
          />
        )}
      />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({});



/*import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";
import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Profile from "../../../components/Profile";

const index = () => {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState();
  const [profiles, setProfiles] = useState([]);
  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("auth");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };

    fetchUser();
  }, []);
  const fetchUserDescription = async () => {
    try {
      const response = await axios.get(`http://192.168.137.40:3000/users/${userId}`);
      console.log(response);
      const user = response.data;
      setUser(user?.user);
    } catch (error) {
      console.log("Error fetching user description", error);
    }
  };

  const fetchProfiles = async () => {
    try {
      const response = await axios.get("http://192.168.137.40:3000/profiles", {
        params: {
          userId: userId,
          gender: user?.gender,
          turnOns: user?.turnOns,
          lookingFor: user?.lookingFor,
        },
      });

      setProfiles(response.data.profiles);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    if (userId) {
      fetchUserDescription();
    }
  }, [userId]);
  useEffect(() => {
    if (userId && user) {
      fetchProfiles();
    }
  }, [userId, user]);
  console.log("profiles", profiles);
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Profile
            key={index}
            item={item}
            userId={userId}
            setProfiles={setProfiles}
            isEven={index % 2 === 0}
          />
        )}
      />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});

*/