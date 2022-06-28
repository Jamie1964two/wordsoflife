import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
//import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';


import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import 'react-native-gesture-handler';
//import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState, useCallback, useRef} from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {  Card, ListItem, Button, Icon , ThemeProvider } from 'react-native-elements';
import {CustomText} from "./components/CustomText";

//import Menu from "./screens/menu";

import Main from "./screens/main";
import EditScreen from "./screens/editScreen";
import Notificats from "./screens/notifications";
import allVerses from "./screens/allVerses";
import options from "./screens/options";
import about from "./screens/about"
import information from "./screens/info"
import * as Notifications from 'expo-notifications';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { HeaderBackButton } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons'; 
import { action } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Options, NotificationVerse } from './store';
import notificationsCheck from './functions/checkNotifications';
import * as SplashScreen from "expo-splash-screen";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Notifications.addNotificationReceivedListener(notification => {
//   console.log(notification);
// })

//const lastNotificationResponse = Notifications.useLastNotificationResponse();

export default function App() {

  const Drawer = createDrawerNavigator();
  const [loaded, setLoaded] = useState(false);

  const LastNoti = async() => {
    try {
      const response = Notifications.useLastNotificationResponse();
      //const response = await Notifications.getLastNotificationResponseAsync()
      return response;
    } catch (e) {
      console.log("last notification error: " + e);
    }
  }

  //const lastNotificationResponse = LastNoti();

  const getNotificationData = () => {
    try {
      const key = lastNotificationResponse.notification.request.content.data.key
      const collection = lastNotificationResponse.notification.request.content.data.collection
      setNotificationInfo(collection, key);
      console.log("retrieving key", key)  
    } catch (e) {
      console.log("retrieving key and collection of verse notification error" + e )
    }
  }

  // React.useEffect(() => {
  //   console.log("lastNotification UseEffect triggered");
  //   getNotificationData();
  // }, [lastNotificationResponse]);

  // React.useEffect(() => {
  //   console.log("lastNotification UseEffect[] triggered");
  //   getNotificationData();
  // }, []);

  React.useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      try{
        console.log(response.notification.request.content.data.key);
        setNotificationInfo(response.notification.request.content.data.collection, response.notification.request.content.data.key);
      } catch (e){
        console.log(e)
      }
    });
    return () => subscription.remove();
  }, []);

  

  const setNotificationInfo = action((collection, key) => {
    NotificationVerse.Collection = collection;
    NotificationVerse.Key = key;
    console.log("collection and key set:" + collection + key)
  })

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('Options')
      const optionsObject = jsonValue != null ? JSON.parse(jsonValue) : null;

      if(optionsObject != null) {
        assignOptions(optionsObject)
      } else {
        setLoaded(true);
      }
    } catch(e) {
      console.log("error retrieving options: " + e);
    }
  }

  useEffect( () => {
    getData();
  },[]);

  const assignOptions = action( (optionsObject) => {
    Options.FontSize = optionsObject.FontSize;
    Options.Opacity = optionsObject.Opacity;
    Options.FontFamily = optionsObject.FontFamily;
    Options.Background = optionsObject.Background;
    Options.Overlay = optionsObject.Overlay;
    Options.ColorChoice = optionsObject.ColorChoice;
    setLoaded(true);
  })

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
      setAppIsReady(true);
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

 
  return (
    
    <SafeAreaProvider >
      <View onLayout={onLayoutRootView}  style={{flex: 1}}>
      {/* <Navigation colorScheme={colorScheme} /> */}
      <NavigationContainer>
      {loaded &&
      <Drawer.Navigator 
    initialRouteName="Main"
    drawerType="slide">
    
      <Drawer.Screen
        name="Main"
        component={Main}
        options={{
          title: 'Home',
          headerTintColor: '#999',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerShown:false,           
        }}  
      />

        <Drawer.Screen
        name="Edit"
        component={EditScreen}
        options={{ title: 'Add New Verse',
        headerShown:false, }}
      />

      <Drawer.Screen
        name="Library"
        component={allVerses}
        options={{ title: 'Library',
        headerShown:false,
        }}
      /> 

      <Drawer.Screen
        name="Notifications"
        component={Notificats}
        options={{ title: 'Notifications',
        headerShown:false,
        }}
      />   

      <Drawer.Screen
        name="Options"
        component={options}
        options={{ title: 'Options',
        headerShown:false,
        }}
      />   

      
      <Drawer.Screen
        name="About"
        component={about}
        options={{ title: 'About',
        headerShown:false,
        }}
      /> 

      <Drawer.Screen
        name="Information"
        component={information}
        options={{ title: 'Information',
        headerShown:false,
        }}
      /> 

      </Drawer.Navigator>
      }
      </NavigationContainer>
      
      <StatusBar backgroundColor={"rgba(255,255,255,0.8)"} hidden={true}/> 
      </View>
    </SafeAreaProvider>
  );
  
}