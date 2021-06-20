import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerContent from "./navigation/DrawerContent";
import SingInScreen from "./views/Login/SignInScreen";
import HomeStackScreen from "./views/Home/HomeStackScreen";
import SplashScreen from "./views/Splash/SplashScreen";
import { getTokenWithSavedPayload } from "./services/getTokenWithSavedPayload";
import { axiosGet } from "./services/AxiosRequests";
import ContactUsStackScreen from "./views/ContactUs/ContactUsStackScreen";
import AccountStackScreen from "./views/Acoount/AccountStackScreen";

const Drawer = createDrawerNavigator();

export default function App({ route, navigation }) {
   const [token, setToken] = useState("");
   const [driver, setDriver] = useState();

   useEffect(() => {
      async function checkToken() {
         let getToken = await getTokenWithSavedPayload();
         if (getToken?.length > 0) setToken(getToken);
      }
      checkToken();
      driverInfo();
   }, []);

   const driverInfo = async () => {
      let driver = await axiosGet("/api/v1/driver/info");
      if (driver) setDriver(driver?.driver);
   };

   if (token.length > 0) {
      return (
         <NavigationContainer>
            <Drawer.Navigator
               drawerContent={(props) => <DrawerContent driver={driver} {...props} />}>
               <Drawer.Screen name="Home" component={HomeStackScreen} />
               <Drawer.Screen name="ContactUs" component={ContactUsStackScreen} />
               <Drawer.Screen name="Account" component={AccountStackScreen} />
            </Drawer.Navigator>
         </NavigationContainer>
      );
   } else {
      return (
         <NavigationContainer>
            <Drawer.Navigator initialRouteName="Splash">
               <Drawer.Screen name="Splash" component={SplashScreen} />
               <Drawer.Screen name="Login" component={SingInScreen} />
            </Drawer.Navigator>
         </NavigationContainer>
      );
   }
}
