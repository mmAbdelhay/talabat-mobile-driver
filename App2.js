import React, { useEffect } from "react";
import { Text, SafeAreaView } from "react-native";
import socketIOClient from "socket.io-client";
import { axiosTestSocket } from "./services/AxiosRequests";

const ENDPOINT = "http://192.168.1.9:5000";
const socket = socketIOClient(ENDPOINT);
export default function app2() {
   socket.on("Yolo", (args) => {
      console.log("Emitted from server");
      console.log(args);
   });

   socket.on("connect", () => {
      console.log("Socket Made Connection");
      socket.emit("hello", "Some message");
   });

   useEffect(() => {
      (async () => {
         console.log("Calling");
         setInterval(() => {
            axiosTestSocket();
         }, 5000);
      })();
   }, []);

   return (
      <>
         <Text>HELLO</Text>
         <Text>HELLO</Text>
         <Text>HELLO</Text>
         <Text>HELLO</Text>
      </>
   );
}
