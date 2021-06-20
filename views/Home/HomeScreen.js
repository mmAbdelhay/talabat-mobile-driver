import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View } from "react-native";
import * as Location from "expo-location";
import Constants from "expo-constants";
import Loading from "../Loading/Loading";
import { ServerIP } from "../../assets/config";
import { axiosPost } from "../../services/AxiosRequests";

// const socket = io("http://192.168.1.9:5000/");

const HomeScreen = ({ navigation }) => {
   const [location, setLocation] = useState(null);
   const [errorMsg, setErrorMsg] = useState(null);
   const [loading, setLoading] = useState(true);
   const [order, setOrder] = useState("");

   //  socket.on("Yolo", (args) => {
   //     console.log("Emitted from server");
   //     console.log(args);
   //  });

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
      if (location) {
         setLoading(false);
         (async () => {
            const payload = {
               latitude: location.coords.latitude,
               longitude: location.coords.longitude,
            };
            let response = await axiosPost("/api/v1/driver/socket/", payload);
            console.log("HI", response.Order[0].id);
            setOrder(response.Order[0].id);
         })();
      }
   }, [location]);

   useEffect(() => {
      let orderInterval;
      if (location && order) {
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
         <>
            <View
               style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
               }}>
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
