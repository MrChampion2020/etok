import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profiles",
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Feather name="eye" size={24} color="#1da1f2" />
            ) : (
              <Feather name="eye" size={24} color="gray" />
            ),
        }}
      />

      <Tabs.Screen
        name="video"
        options={{
          title: "Video",
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="videocam" size={24} color="#1da1f2" />
            ) : (
              <Ionicons name="videocam" size={24} color="gray" />
            ),
        }}
      />

      <Tabs.Screen
        name="moments"
        options={{
          title: "Moments",
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <MaterialCommunityIcons
                name="account-star"
                size={24}
                color="#1da1f2"
              />
            ) : (
              <MaterialCommunityIcons
                name="account-star"
                size={24}
                color="gray"
              />
            ),
        }}
      />

      <Tabs.Screen
        name="match"
        options={{
          title: "Match",
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <MaterialCommunityIcons
                name="heart-multiple-outline"
                size={24}
                color="#1da1f2"
              />
            ) : (
              <MaterialCommunityIcons
                name="heart-multiple-outline"
                size={24}
                color="gray"
              />
            ),
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={24}
                color="#1da1f2"
              />
            ) : (
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={24}
                color="gray"
              />
            ),
        }}
      />

      <Tabs.Screen
        name="bio"
        options={{
          title: "Account",
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <MaterialCommunityIcons
                name="guy-fawkes-mask"
                size={24}
                color="#1da1f2"
              />
            ) : (
              <MaterialCommunityIcons
                name="guy-fawkes-mask"
                size={24}
                color="gray"
              />
            ),
        }}
      />
    </Tabs>
  );
}
