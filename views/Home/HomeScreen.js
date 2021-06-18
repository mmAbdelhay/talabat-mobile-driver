import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View } from "react-native";
import * as Location from "expo-location";
import Constants from "expo-constants";
import Loading from "../Loading/Loading";
import { ServerIP } from "../../assets/config";

const HomeScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    if (location) {
      setLoading(false);
    }
  }, [location]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Loading />
      </View>
    );
  } else {
    return (
      <>
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Map goes here {JSON.stringify(location)}</Text>
        </View>
      </>
    );
  }
};

export default HomeScreen;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    top: "5%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    padding: 8,
  },
});
