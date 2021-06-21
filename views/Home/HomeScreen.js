import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View } from "react-native";
import * as Location from "expo-location";
import Constants from "expo-constants";
import Loading from "../Loading/Loading";
import WorkState from "../Shared/workState";
import { axiosPost, axiosPut } from "../../services/AxiosRequests";
import Map from "../map/Map";

const HomeScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState("");
  const [workState, setWorkState] = useState("");
  const [isOnCall, setIsOnCall] = useState(false);

  //  socket.on("Yolo", (args) => {
  //     console.log("Emitted from server");
  //     console.log(args);
  //  });

  useEffect(() => {
    if (workState === "OnCall") {
      (async () => {
        let response = await axiosPut("/api/v1/driver/status/", {
          work_state: workState,
        });
        if (response.Message === "OnCall") setIsOnCall(true);
      })();
    }
  }, [workState]);

  useEffect(() => {
    (async () => {
      //  axiosTestSocket();
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
    if (location && isOnCall) {
      (async () => {
        const payload = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        let response = await axiosPost("/api/v1/driver/socket/", payload);
        setOrder(response.Order[0].id);
      })();
    }
    if (location) setLoading(false);
  }, [location]);

  useEffect(() => {
    let orderInterval;
    if (location && order && isOnCall) {
      (async () => {
        orderInterval = setInterval(async () => {
          const socketPayload = {
            order_id: order,
            lat: location.coords.latitude,
            long: location.coords.longitude,
          };
          let socketResponse = await axiosPost(
            "/api/v1/driver/socket/updatelocation",
            socketPayload
          );
        }, 5000);
      })();
    } else {
      clearInterval(orderInterval);
    }
  }, [location, order]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Loading />
      </View>
    );
  } else {
    return (
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <WorkState workState={(value) => setWorkState(value)} />
        {workState == "OnCall" && (
          //and any login according to OnCall driver
          <View>
            <Map />
          </View>
        )}
      </View>
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
