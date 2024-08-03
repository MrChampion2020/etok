/*import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Image,
  Pressable,
  Switch,
  Platform, 
  ImageBackground,
  Alert,
} from "react-native";
import { Feather } from '@expo/vector-icons';
import { Entypo, AntDesign } from "@expo/vector-icons";
import axios from "axios";
import jwtDecode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { API_URL } from "../../../config";
import { useRouter } from "expo-router";
import profilePlaceholder from "../../../assets/profilepic.jpg";

const Index = () => {
  const [option, setOption] = useState("AD");
  const [username, setusername] = useState("");
  const [userId, setUserId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [userDetails, setUserDetails] = useState({});
  const [coins, setCoins] = useState(0);
  const [diamonds, setDiamonds] = useState(0);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isOn, setIsOn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("auth");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };
 
    fetchUser();
  }, []);

  const fetchUsername = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}`);
      console.log(response);
      const user = response.data;
 
      setName(user?.user?.username);
      setImages(user?.user.profileImages);
      setLookingOptions(user?.user.lookingFor)
    } catch (error) {
      console.log("Error fetching user description", error);
    }
  };
  useEffect(() => {
    if (userId) {
      fetchUsername();
    }
  }, [userId]);
  const updateUserName = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/users/${userId}/username`,
        {
          username: username,
        }
      );
 
      console.log(response.data);
 
      if (response.status === 200) {
        Alert.alert("Success", "Description updated successfully");
      }
    } catch (error) {
      console.log("Error updating the user Description");
    }
  };


  const toggleButton = () => {
    setIsOn((prevState) => !prevState);
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}`);
      const user = response.data.user;
      setUserDetails(user);
      setCoins(user.coins);
      setDiamonds(user.diamonds);
      setImageUrl(user.profileImage); // Assuming the API returns the profile image URL
      console.log(`${user.name}`);
      console.log(`ID: ${userId}`);
    } catch (error) {
      console.log("Error fetching user details", error);
    }
  };

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem("auth");
      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        setUserId(userId);
        fetchUserDetails(userId);
      }
    } catch (error) {
      console.log("Error fetching user", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled && result.assets && result.assets.length > 0) {
      const localUri = result.assets[0].uri;
      let newPath = localUri;

      if (Platform.OS !== "web") {
        const filename = localUri.split("/").pop();
        newPath = `${FileSystem.documentDirectory}${filename}`;
        await FileSystem.moveAsync({
          from: localUri,
          to: newPath,
        });
      }

      setImageUrl(newPath);
      uploadImage(newPath);
    }
  };

  const handleImageTake = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled && result.assets && result.assets.length > 0) {
      const localUri = result.assets[0].uri;
      let newPath = localUri;

      if (Platform.OS !== "web") {
        const filename = localUri.split("/").pop();
        newPath = `${FileSystem.documentDirectory}${filename}`;
        await FileSystem.moveAsync({
          from: localUri,
          to: newPath,
        });
      }

      setImageUrl(newPath);
      uploadImage(newPath);
    }
  };

  const uploadImage = async (uri) => {
    try {
      const token = await AsyncStorage.getItem("auth");
      if (token) {
        const formData = new FormData();
        formData.append("image", {
          uri,
          name: "profile.jpg",
          type: "image/jpg",
        });

        const response = await axios.put(
          `${API_URL}/users/${userId}/profile-image`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          Alert.alert("Success", "Profile image updated successfully.");
        }
      }
    } catch (error) {
      console.log("Error uploading image", error);
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View
        style={styles.topContainer}
        source={{
          uri: "https://static.vecteezy.com/system/resources/thumbnails/018/977/074/original/animated-backgrounds-with-liquid-motion-graphic-background-cool-moving-animation-for-your-background-free-video.jpg",
        }}
      >
        <View style={styles.topContent}>
          <View style={styles.topRow}>
            <View style={styles.profileContainer}>
              <Pressable onPress={handleImagePick}>
                <Image
                  style={styles.profileImage}
                  source={imageUrl ? { uri: imageUrl } : profilePlaceholder}
                />
              </Pressable>
              <Pressable onPress={handleImageTake}>
                <Text style={styles.textButton}>Take Picture</Text>
              </Pressable>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userInfoText}>
                Verified: {userDetails.isVerified ? "Yes" : "No"}
              </Text>
              <Text style={styles.userInfoText}>Name: {userDetails.name}</Text>
              <TextInput 
             value={username}
             multiline
             onChangeText={(text) => setusername(text)}
             style={{
               fontFamily: "Helvetica",
               fontSize: username ? 17 : 17,
             }}
             //   placeholderTextColor={"black"}
           />
              <Pressable onPress={() => setOption("AD")}>
         <Text
           style={{
             fontSize: 16,
             fontWeight: "500",
             color: option == "AD" ? "black" : "gray",
           }}
         >
           AD
         </Text>
       </Pressable>
              <Text style={styles.userInfoText}>ID: {userId}</Text>

            </View>
            <View style={styles.settingsButton}>
              <Pressable onPress={() => router.replace("bio/setting")}>
                <AntDesign name="setting" size={30} color="white" />
              </Pressable>
            </View>
          </View>
          <View style={styles.followInfoRow}>
            <Text style={styles.followInfo}>
              Followers: {userDetails.followers || 0}
            </Text>
            <Text style={styles.followInfo}>
              Following: {userDetails.following || 0}
            </Text>
            <Text style={styles.followInfo}>
              Free Messages: {userDetails.freeMessages || 0}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.walletContainer}>
        <View style={styles.iconRow}>
          <Entypo name="wallet" size={24} color="#1da1f2" />
          <Text>Coins: {coins}</Text>
          <Pressable onPress={() => router.replace("bio/payment")}>
            <Text style={styles.textButton}>Recharge</Text>
          </Pressable>
        </View>
        <View style={styles.iconRow}>
          <Entypo name="heart" size={24} color="red" />
          <Text>Diamonds: {diamonds}</Text>
          <Pressable onPress={() => {}}>
            <Text style={styles.textButton}>Withdraw</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.toggleContainer}>
        <View style={styles.toggleRow}>
          <Text>
            <Entypo name="video-camera" size={24} color="#1da1f2" />
          </Text>
          <Switch value={videoEnabled} onValueChange={setVideoEnabled} />
          <Pressable onPress={toggleButton}>
            <Text style={styles.textButton}>{isOn ? "On" : "Off"}</Text>
          </Pressable>
        </View>
        <View style={styles.toggleRow}>
          <Text>
            <Feather name="phone-call" size={24} color="#1da1f2" />
          </Text>
          <Switch value={audioEnabled} onValueChange={setAudioEnabled} />
          <Pressable onPress={toggleButton}>
            <Text style={styles.textButton}>{isOn ? "On" : "Off"}</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.navContainer}>
        <Pressable onPress={() => router.replace("Invite")}>
          <Entypo name="share" size={24} color="#1da1f2" />
          <Text>Invite</Text>
        </Pressable>
        <Pressable onPress={() => router.replace("Referral")}>
          <Entypo name="users" size={24} color="#1da1f2" />
          <Text>Referrals</Text>
        </Pressable>
        <Pressable onPress={() => router.replace("Help")}>
          <AntDesign name="customerservice" size={24} color="#1da1f2" />
          <Text>Help</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "80%",
    flexGrow: 1,
    backgroundColor: "#f8f9fa",
  },
  topContainer: {
    margin: "auto",
    width: "100%",
    height: "25%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(212, 42, 70)"
  },
  topContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    padding: 16,
  },
  profileContainer: {
    alignItems: "center",
    width: "100%",
    height: "50%",
    /*border: "2px solid black",*
    backgroundColor: "white"
  },
  profileImage: {
    marginTop: "20%",
    width: 100,
    height: 100,
    borderRadius: 50,
    border: "2px solid white",
    position: "relative",
  },
  textButton: {
    color: "#1da1f2",
    fontSize: 16,
    marginTop: 8,
    fontWeight: "600"
  },
  userInfo: {
    alignItems: "left",
    width: "30%"
  },
  userInfoText: {
    color: "white",
    fontSize: 16,
    marginTop: 8,
  },
  settingsButton: {
    position: "absolute",
    top: 30,
    right: 0,
    width: "10%"
  },
  followInfoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    padding: 16,
  },
  followInfo: {
    color: "white",
    fontSize: 16,
  },
  walletContainer: {
    padding: 16,
    backgroundColor: "#fff",
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  toggleContainer: {
    padding: 16,
    backgroundColor: "#fff",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  navContainer: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
  },
});

export default Index;

/*


import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Image,
  Pressable,
  Switch,
  Platform, 
  ImageBackground,
  Alert,
} from "react-native";
import { Feather } from '@expo/vector-icons';
import { Entypo, AntDesign } from "@expo/vector-icons";
import axios from "axios";
import jwtDecode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { API_URL } from "../../../config";
import { useRouter } from "expo-router";
import profilePlaceholder from "../../../assets/profilepic.jpg";

const Index = () => {
  const [option, setOption] = useState("AD");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [userDetails, setUserDetails] = useState({});
  const [coins, setCoins] = useState(0);
  const [diamonds, setDiamonds] = useState(0);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isOn, setIsOn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("auth");
      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        setUserId(userId);
      }
    };

    fetchUser();
  }, []);

  const fetchUsername = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}`);
      const user = response.data;

      setUsername(user?.user?.username);
      setImageUrl(user?.user.profileImages);
    } catch (error) {
      console.log("Error fetching user description", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUsername();
    }
  }, [userId]);

  const updateUserName = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/users/${userId}/username`,
        {
          username: username,
        }
      );

      console.log(response.data);

      if (response.status === 200) {
        Alert.alert("Success", "Description updated successfully");
      }
    } catch (error) {
      console.log("Error updating the user Description");
    }
  };

  const toggleButton = () => {
    setIsOn((prevState) => !prevState);
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}`);
      const user = response.data.user;
      setUserDetails(user);
      setCoins(user.wallet);
      setDiamonds(user.diamonds);
      setImageUrl(user.profileImage); // Assuming the API returns the profile image URL
      console.log(`${user.username}`);
      console.log(`ID: ${userId}`);
    } catch (error) {
      console.log("Error fetching user details", error);
    }
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled && result.assets && result.assets.length > 0) {
      const localUri = result.assets[0].uri;
      let newPath = localUri;

      if (Platform.OS !== "web") {
        const filename = localUri.split("/").pop();
        newPath = `${FileSystem.documentDirectory}${filename}`;
        await FileSystem.moveAsync({
          from: localUri,
          to: newPath,
        });
      }

      setImageUrl(newPath);
      uploadImage(newPath);
    }
  };

  const handleImageTake = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled && result.assets && result.assets.length > 0) {
      const localUri = result.assets[0].uri;
      let newPath = localUri;

      if (Platform.OS !== "web") {
        const filename = localUri.split("/").pop();
        newPath = `${FileSystem.documentDirectory}${filename}`;
        await FileSystem.moveAsync({
          from: localUri,
          to: newPath,
        });
      }

      setImageUrl(newPath);
      uploadImage(newPath);
    }
  };

  const uploadImage = async (uri) => {
    try {
      const token = await AsyncStorage.getItem("auth");
      if (token) {
        const formData = new FormData();
        formData.append("image", {
          uri,
          name: "profile.jpg",
          type: "image/jpg",
        });

        const response = await axios.put(
          `${API_URL}/users/${userId}/profile-image`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          Alert.alert("Success", "Profile image updated successfully.");
        }
      }
    } catch (error) {
      console.log("Error uploading image", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View
        style={styles.topContainer}
        /*source={{
          uri: "https://static.vecteezy.com/system/resources/thumbnails/018/977/074/original/animated-backgrounds-with-liquid-motion-graphic-background-cool-moving-animation-for-your-background-free-video.jpg",
        }}*
      >
        <View style={styles.topContent}>
          <View style={styles.topRow}>
            <View style={styles.profileContainer}>
              <Pressable onPress={handleImagePick}>
                <Image
                  style={styles.profileImage}
                  source={imageUrl ? { uri: imageUrl } : profilePlaceholder}
                />
              </Pressable>
              <Pressable onPress={handleImageTake}>
                <Text style={styles.textButton}>Take Picture</Text>
              </Pressable>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userInfoText}>
                Verified: {userDetails.isVerified ? "Yes" : "No"}
              </Text>
              <Text style={styles.userInfoText}>Name: {userDetails.name}</Text>
              <TextInput 
                value={username}
                multiline
                onChangeText={(text) => setUsername(text)}
                style={{
                  fontFamily: "Helvetica",
                  fontSize: 17,
                }}
              />

              <Pressable onPress={() => setOption("AD")}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "500",
                    color: option === "AD" ? "black" : "gray",
                  }}
                >
                  AD
                </Text>
              </Pressable>
              <Text style={styles.userInfoText}>ID: {userId}</Text>
            </View>
            <View style={styles.settingsButton}>
              <Pressable onPress={() => router.replace("bio/setting")}>
                <AntDesign name="setting" size={30} color="white" />
              </Pressable>
            </View>
          </View>
          <View style={styles.followInfoRow}>
            <Text style={styles.followInfo}>
              Followers: {userDetails.followers || 0}
            </Text>
            <Text style={styles.followInfo}>
              Following: {userDetails.following || 0}
            </Text>
            <Text style={styles.followInfo}>
              Free Messages: {userDetails.freeMessages || 0}
            </Text>
          </View>
        </View>

      </View >  

      <View style={styles.walletContainer}>
        <View style={styles.iconRow}>
          <Entypo name="wallet" size={24} color="#1da1f2" />
          <Text>Coins: {coins}</Text>
          <Pressable onPress={() => router.replace("bio/payment")}>
            <Text style={styles.textButton}>Recharge</Text>
          </Pressable>
        </View>
        <View style={styles.iconRow}>
          <Entypo name="heart" size={24} color="red" />
          <Text>Diamonds: {diamonds}</Text>
          <Pressable onPress={() => {}}>
            <Text style={styles.textButton}>Withdraw</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.toggleContainer}>
        <View style={styles.toggleRow}>
          <Text>Video</Text>
          <Switch value={videoEnabled} onValueChange={setVideoEnabled} />
        </View>
        <View style={styles.toggleRow}>
          <Text>Audio</Text>
          <Switch value={audioEnabled} onValueChange={setAudioEnabled} />
        </View>
        <View style={styles.toggleRow}>
          <Text>Lights</Text>
          <Pressable onPress={toggleButton}>
            <Text style={styles.textButton}>{isOn ? "On" : "Off"}</Text>
          </Pressable>
        </View>
      </View>

      <Pressable onPress={updateUserName} style={styles.button}>
        <Text style={styles.buttonText}>Update Username</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    
  },
  topContainer: {
    width: "100%",
    height: "20%",
    marginBottom: 10,
    backgroundColor: "rgb(212, 42, 70)"
  },
  topContent: {
    padding: 16,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  profileContainer: {
    alignItems: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  textButton: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1da1f2",
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userInfoText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1da1f2",
  },
  settingsButton: {
    marginRight: 16,
  },
  followInfoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  followInfo: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1da1f2",
  },
  walletContainer: {
    marginVertical: 16,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  toggleContainer: {
    marginVertical: 16,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#1da1f2",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default Index;

*/

















import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Image,
  Pressable,
  Switch,
  Platform,
  Alert,
} from "react-native";
import { Feather, Entypo, AntDesign } from "@expo/vector-icons";
import axios from "axios";
import jwtDecode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { API_URL } from "../../../config";
import { useRouter } from "expo-router";
import profilePlaceholder from "../../../assets/profilepic.jpg";

const Index = () => {
  const [option, setOption] = useState("AD");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [userDetails, setUserDetails] = useState({});
  const [coins, setCoins] = useState(0);
  const [diamonds, setDiamonds] = useState(0);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isOn, setIsOn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("auth");
      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        setUserId(userId);
      } else {
        router.replace("login");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  const fetchUserDetails = async () => {
    const token = await AsyncStorage.getItem("auth");
    if (!token) {
      Alert.alert("Login required", "Please login to access your dashboard");
      router.replace("login");
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/user-details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const data = response.data.user;
        setUserDetails(data);
        setCoins(data.wallet);
        setDiamonds(data.diamond);
        setImageUrl(data.profileImages[0]); // Assuming the first profile image
        setUsername(data.username);
      } else {
        Alert.alert("Error", "Login to access your dashboard");
        await AsyncStorage.removeItem("auth");
        router.replace("login");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      Alert.alert("Error", "An error occurred while fetching user data");
      await AsyncStorage.removeItem("auth");
      router.replace("login");
    }
  };

  const updateUserName = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/users/${userId}/username`,
        {
          username: username,
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Username updated successfully");
      }
    } catch (error) {
      console.log("Error updating the username", error);
    }
  };

  const toggleButton = () => {
    setIsOn((prevState) => !prevState);
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const localUri = result.assets[0].uri;
      let newPath = localUri;

      if (Platform.OS !== "web") {
        const filename = localUri.split("/").pop();
        newPath = `${FileSystem.documentDirectory}${filename}`;
        await FileSystem.moveAsync({
          from: localUri,
          to: newPath,
        });
      }

      setImageUrl(newPath);
      uploadImage(newPath);
    }
  };

  const handleImageTake = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const localUri = result.assets[0].uri;
      let newPath = localUri;

      if (Platform.OS !== "web") {
        const filename = localUri.split("/").pop();
        newPath = `${FileSystem.documentDirectory}${filename}`;
        await FileSystem.moveAsync({
          from: localUri,
          to: newPath,
        });
      }

      setImageUrl(newPath);
      uploadImage(newPath);
    }
  };

  const uploadImage = async (uri) => {
    try {
      const token = await AsyncStorage.getItem("auth");
      if (token) {
        const formData = new FormData();
        formData.append("image", {
          uri,
          name: "profile.jpg",
          type: "image/jpg",
        });

        const response = await axios.put(
          `${API_URL}/users/${userId}/profile-image`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          Alert.alert("Success", "Profile image updated successfully.");
        }
      }
    } catch (error) {
      console.log("Error uploading image", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.topContent}>
          <View style={styles.topRow}>
            <View style={styles.profileContainer}>
              <Pressable onPress={handleImagePick}>
                <Image
                  style={styles.profileImage}
                  source={imageUrl ? { uri: imageUrl } : profilePlaceholder}
                />
              </Pressable>
              <Pressable onPress={handleImageTake}>
                <Text style={styles.textButton}>Take Picture</Text>
              </Pressable>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userInfoText}>
                Verified: {userDetails.verified ? "Yes" : "No"}
              </Text>
              <Text style={styles.userInfoText}>Name: {userDetails.name}</Text>
              <TextInput
                value={username}
                multiline
                onChangeText={(text) => setUsername(text)}
                style={styles.textInput}
              />
              <Pressable onPress={() => setOption("AD")}>
                <Text
                  style={[
                    styles.optionText,
                    { color: option === "AD" ? "black" : "gray" },
                  ]}
                >
                  AD
                </Text>
              </Pressable>
              <Text style={styles.userInfoText}>ID: {userId}</Text>
            </View>
            <View style={styles.settingsButton}>
              <Pressable onPress={() => router.replace("bio/setting")}>
                <AntDesign name="setting" size={30} color="white" />
              </Pressable>
            </View>
          </View>
          <View style={styles.followInfoRow}>
            <Text style={styles.followInfo}>
              Followers: {userDetails.friends ? userDetails.friends.length : 0}
            </Text>
            <Text style={styles.followInfo}>
              Following: {userDetails.following || 0}
            </Text>
            <Text style={styles.followInfo}>
              Free Messages: {userDetails.freeMessages || 0}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.walletContainer}>
        <View style={styles.iconRow}>
          <Entypo name="wallet" size={24} color="#1da1f2" />
          <Text>Coins: {coins}</Text>
          <Pressable onPress={() => router.replace("bio/payment")}>
            <Text style={styles.textButton}>Recharge</Text>
          </Pressable>
        </View>
        <View style={styles.iconRow}>
          <Entypo name="heart" size={24} color="red" />
          <Text>Diamonds: {diamonds}</Text>
          <Pressable onPress={() => {}}>
            <Text style={styles.textButton}>Withdraw</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.toggleContainer}>
        <View style={styles.toggleRow}>
          <Text>Video</Text>
          <Switch value={videoEnabled} onValueChange={setVideoEnabled} />
        </View>
        <View style={styles.toggleRow}>
          <Text>Audio</Text>
          <Switch value={audioEnabled} onValueChange={setAudioEnabled} />
        </View>
        <Pressable style={styles.button} onPress={toggleButton}>
          <Text style={styles.buttonText}>{isOn ? "ON" : "OFF"}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#151f2b",
    padding: 16,
  },
  topContainer: {
    marginBottom: 10,
  },
  topContent: {
    backgroundColor: "#1a1a2e",
    padding: 16,
    borderRadius: 10,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileContainer: {
    marginRight: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  textButton: {
    color: "#1da1f2",
    textAlign: "center",
    marginVertical: 5,
  },
  userInfo: {
    flex: 1,
  },
  userInfoText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  textInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 5,
    paddingHorizontal: 10,
    color: "white",
  },
  optionText: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
  settingsButton: {
    marginLeft: 10,
  },
  followInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  followInfo: {
    fontSize: 16,
    color: "white",
  },
  walletContainer: {
    padding: 16,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    marginBottom: 10,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  toggleContainer: {
    padding: 16,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    marginBottom: 10,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#1da1f2",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default Index;
