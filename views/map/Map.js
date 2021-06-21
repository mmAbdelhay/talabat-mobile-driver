import React, { useState, useEffect } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import { View } from "react-native";

export default function Map(props) {
  const [region, setRegion] = useState({
    latitude: 52.5200066,
    longitude: 13.404954,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const Berlin = {
    latitude: 52.5200066,
    longitude: 13.404954,
  };

  const Frankfurt = {
    latitude: 50.1109221,
    longitude: 8.6821267,
  };

  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80%",
      }}
    >
      <MapView style={{ flex: 1 }} initialRegion={region}>
        <Polyline coordinates={[Berlin, Frankfurt]} />
        <Marker coordinate={{ latitude: 51.5078788, longitude: -0.0877321 }} />
      </MapView>
    </View>
  );
}
