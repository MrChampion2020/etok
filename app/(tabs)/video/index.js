/*import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Place a video call</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: "900",
    fontSize: 45,
  },
});*/





import React, { useEffect, useState, useRef } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, Platform } from "react-native";
import io from "socket.io-client";
import AsyncStorage from '@react-native-async-storage/async-storage';

const socket = io("http://your-server-url");

let RTCPeerConnection, mediaDevices, RTCView;

if (Platform.OS !== 'web') {
  ({ RTCPeerConnection, mediaDevices, RTCView } = require('react-native-webrtc'));
}

const CallScreen = ({ userId }) => {
  const [call, setCall] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [callRecords, setCallRecords] = useState([]);
  const [userData, setUserData] = useState(null);
  const pc = useRef(null);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      pc.current = new RTCPeerConnection();
    }
    socket.emit("userOnline", userId);

    socket.on("incomingCall", async ({ callId, callerId, type }) => {
      setCall({ callId, callerId, type });
      // Prompt user to accept or reject the call
    });

    socket.on("startCall", async ({ callId }) => {
      const stream = await getMediaStream();
      setLocalStream(stream);
      pc.current.addStream(stream);

      pc.current.onaddstream = (event) => {
        setRemoteStream(event.stream);
      };

      // Create offer and send to server
      const offer = await pc.current.createOffer();
      await pc.current.setLocalDescription(offer);
      socket.emit("sendOffer", { callId, offer });
    });

    socket.on("callEnded", (callRecord) => {
      setCall(null);
      setLocalStream(null);
      setRemoteStream(null);
      if (pc.current) {
        pc.current.close();
        pc.current = new RTCPeerConnection();
      }

      setCallRecords((prevRecords) => [...prevRecords, callRecord]);
    });

    fetchUserData();
    fetchCallRecords();

    return () => {
      socket.emit("userOffline", userId);
    };
  }, [userId]);

  const getMediaStream = async () => {
    if (Platform.OS === 'web') {
      return null;
    }
    let stream = null;
    try {
      stream = await mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
    return stream;
  };

  const acceptCall = async () => {
    socket.emit("acceptCall", { callId: call.callId });
  };

  const rejectCall = () => {
    socket.emit("rejectCall", { callId: call.callId });
  };

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('http://your-server-url/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = await response.json();
      setUserData(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchCallRecords = async () => {
    try {
      const response = await fetch(`http://your-server-url/api/calls/${userId}`);
      const records = await response.json();
      setCallRecords(records);
    } catch (error) {
      console.error("Error fetching call records:", error);
    }
  };

  const renderCallRecord = ({ item }) => (
    <View style={styles.callRecord}>
      <Text>{`Caller: ${item.caller.name}, Receiver: ${item.receiver.name}, Type: ${item.type}, Status: ${item.status}, Start: ${item.startTime}, End: ${item.endTime}`}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {userData && (
        <View style={styles.userData}>
          <Text>{`Welcome, ${userData.name}`}</Text>
        </View>
      )}
      {call && (
        <View style={styles.callPrompt}>
          <Text>Incoming call from {call.callerId}</Text>
          <Pressable style={styles.acceptButton} onPress={acceptCall}>
            <Text style={styles.buttonText}>Accept</Text>
          </Pressable>
          <Pressable style={styles.rejectButton} onPress={rejectCall}>
            <Text style={styles.buttonText}>Reject</Text>
          </Pressable>
        </View>
      )}
      {localStream && Platform.OS !== 'web' && (
        <RTCView streamURL={localStream.toURL()} style={styles.rtcView} />
      )}
      {remoteStream && Platform.OS !== 'web' && (
        <RTCView streamURL={remoteStream.toURL()} style={styles.rtcView} />
      )}
      <FlatList
        data={callRecords}
        renderItem={renderCallRecord}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  userData: {
    alignItems: 'center',
    marginVertical: 10,
  },
  callPrompt: {
    alignItems: 'center',
    marginVertical: 20,
  },
  acceptButton: {
    backgroundColor: 'green',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  rejectButton: {
    backgroundColor: 'red',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  rtcView: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
  callRecord: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default CallScreen;
