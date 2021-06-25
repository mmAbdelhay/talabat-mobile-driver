import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View, Alert, Image } from "react-native";
import * as Location from "expo-location";
import Constants from "expo-constants";
import Loading from "../Loading/Loading";
import WorkState from "../Shared/workState";
import { axiosPost, axiosPut } from "../../services/AxiosRequests";

const HomeScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState("");
  const [workState, setWorkState] = useState("");
  const [isOnCall, setIsOnCall] = useState(false);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  const setWorkStateToServer = async (workState) => {
    let response = await axiosPut("/api/v1/driver/status/", {
      work_state: workState,
    });
    if (response.Message === "OnCall") setIsOnCall(true);
  };

  const getOrder = async (locationformPhone) => {
    const payload = {
      latitude: locationformPhone.coords.latitude,
      longitude: locationformPhone.coords.longitude,
    };
    let response = await axiosPost("/api/v1/driver/socket/", payload);
    setOrder(response.Order[0]);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let locationformPhone = await Location.getCurrentPositionAsync({});
      setLocation(locationformPhone);
    })();
  }, []);

  useEffect(() => {
    if (location) {
      if (location?.coords?.latitude && location?.coords?.longitude) {
        getOrder(location);
        setLoading(false);
      }
    }
  }, [location]);

  useEffect(() => {
    if (workState) setWorkStateToServer(workState);
  }, [workState]);

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
          marginTop: "20%",
        }}
      >
        <WorkState
          workState={(value) => {
            setWorkState(value);
            if (value == "OnCall" && order) {
              Alert.alert(
                "start your shift",
                `you will redirect to Map page to take your next order`,
                [
                  {
                    text: "cancel",
                    onPress: () => console.info("canceled"),
                  },
                  {
                    text: "ok",
                    onPress: () =>
                      navigation.navigate("Map", {
                        order: order,
                      }),
                  },
                ]
              );
            }
          }}
        />
        {!order && workState == "OnCall" ? (
          <View style={{ marginTop: "10%" }}>
            <Image
              source={require("../../assets/imgs/LLyJ.gif")}
              style={{ width: 150, height: 150, borderRadius: 30 }}
            />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                textAlign: "center",
                marginTop: 20,
              }}
            >
              Wiating for Order
            </Text>
          </View>
        ) : null}
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
