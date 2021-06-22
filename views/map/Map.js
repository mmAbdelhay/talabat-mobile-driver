import React, { useState, useEffect } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import { TouchableOpacity, Image, View, Text, StatusBar } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { axiosPut } from "../../services/AxiosRequests";

export default function Map({ navigation, route }) {
  const { order } = route.params?.order;
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [onProviderLocation, setOnProviderLocation] = useState(false);

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
    })();
    (async () => {
      let response = await axiosPut("/api/v1/driver/status/", {
        work_state: "GoingToOrder",
      });
    })();
  }, []);

  useEffect(() => {
    if (
      latitude == order.pickup_latitude &&
      longitude == order.pickup_longitude
    ) {
      (async () => {
        let response = await axiosPut("/api/v1/driver/status/", {
          work_state: "Delivering",
        });
      })();
    } else if (
      latitude == order.delivery_latitude &&
      longitude == order.delivery_longitude
    ) {
      (async () => {
        let response = await axiosPut("/api/v1/driver/status/", {
          work_state: "OnCall",
        });
      })();
    }
  }, [location]);

  const pickupLocation = {
    latitude: order.pickup_latitude,
    longitude: order.pickup_longitude,
  };

  const orderLocation = {
    latitude: order.delivery_latitude,
    longitude: order.delivery_longitude,
  };

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
            { latitude: latitude, longitude: longitude },
            pickupLocation,
          ]}
        />
      ) : (
        <Polyline
          coordinates={[
            { latitude: latitude, longitude: longitude },
            orderLocation,
          ]}
        />
      )}

      <Marker coordinate={{ latitude: latitude, longitude: longitude }} />
    </MapView>
  );
}
