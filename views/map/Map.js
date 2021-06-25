import React, { useState, useEffect } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { TouchableOpacity, Image, View, Text, StatusBar } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { axiosPut } from "../../services/AxiosRequests";

export default function Map({ navigation, route }) {
  const { order } = route.params;
  console.log(`order`, order);
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [onProviderLocation, setOnProviderLocation] = useState(false);

  const setWorkState = async (workState) => {
    let response = await axiosPut("/api/v1/driver/status/", {
      work_state: workState,
    });
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
      setWorkState("GoingToOrder");
    })();
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      if (
        latitude == order.pickup_latitude &&
        longitude == order.pickup_longitude
      ) {
        setWorkState("Delivering");
      } else if (
        latitude == order.delivery_latitude &&
        longitude == order.delivery_longitude
      ) {
        Alert.alert("Confirmation", `did you deliver the order`, [
          {
            text: "cancel",
            onPress: () => console.info("canceled"),
          },
          {
            text: "ok",
            onPress: () => {
              setWorkState("OnCall");
              navigation.navigate("Home");
            },
          },
        ]);
      }
    }
  }, [latitude, longitude]);

  const pickupLocation = {
    latitude: +order.pickup_latitude,
    longitude: +order.pickup_longitude,
  };

  const orderLocation = {
    latitude: +order.delivery_latitude,
    longitude: +order.delivery_longitude,
  };

  if (latitude && longitude) {
    return (
      <MapView style={{ flex: 1 }}>
        <StatusBar
          animated={true}
          backgroundColor="#fff"
          barStyle="dark-content"
        />
        <View
          style={{
            flexDirection: "row",
            height: 30,
            top: "8%",
          }}
        >
          <TouchableOpacity
            style={{
              width: 50,
              paddingLeft: "7%",
              justifyContent: "center",
            }}
            onPress={() => navigation.navigate("Home")}
          >
            <Image
              source={require("../../assets/imgs/back.png")}
              resizeMode="contain"
              style={{
                width: 23,
                height: 23,
              }}
            />
          </TouchableOpacity>

          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>Map</Text>
          </View>
          <View style={{ bottom: "2%" }}>
            <Icon.Button
              name="ios-menu"
              size={25}
              color="#000"
              backgroundColor="transparent"
              onPress={() => navigation.openDrawer()}
            ></Icon.Button>
          </View>
        </View>
        {onProviderLocation ? (
          <Polyline
            coordinates={[
              { latitude: +latitude, longitude: +longitude },
              pickupLocation,
            ]}
          />
        ) : (
          <Polyline
            coordinates={[
              { latitude: +latitude, longitude: +longitude },
              orderLocation,
            ]}
          />
        )}
        <Marker coordinate={{ latitude: +latitude, longitude: +longitude }} />
      </MapView>
    );
  } else {
    return (
      <View
        style={{
          marginTop: "10%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
    );
  }
}
