import React, {useState, useEffect} from 'react';
import { Text, TextInput, View, Pressable } from 'react-native';
import { Button } from 'react-native-elements';
import ToggleSwitch from "../components/ToggleSwitch";
import * as Notifications from 'expo-notifications';
import { CheckBox } from 'react-native-elements'
import {notificationsOn, notificationCollection, allCollectionsArray} from '../store';
import {observer} from "mobx-react";
import {action} from "mobx";
import { Ionicons } from '@expo/vector-icons'; 
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import scheduleLocalNotification from '../functions/notify';
import DateTimePicker from '@react-native-community/datetimepicker';
import Collapsible from 'react-native-collapsible';
import { Entypo } from '@expo/vector-icons'; 
import PopUpNotifications from '../components/PopUpNotifications';


const NotificationScreen = observer( ({navigation}) => {

  const [frequencyhrs , setFrequencyhrs] = useState(2);
  const [frequencymins , setFrequencymins] = useState(0);
  const [verseOrPersonal, setVerseOrPersonal] = useState(false);
  const [startTime, setStartTime] = useState(480);
  const [endTime, setEndTime] = useState(1320);
  const [notificationSound, setNotificationSound] = useState(false);
  const [showTimePicker1, setShowTimePicker1] = useState(false);
  const [showTimePicker2, setShowTimePicker2] = useState(false);
  const [date1, setDate1] = useState(new Date(28800000));
  const [date2, setDate2] = useState(new Date(79200000));
  const [buttonLabel1, setButtonLabel1] = useState("08:00");
  const [buttonLabel2, setButtonLabel2] = useState("22:00");
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isCollapsedActive, setIsCollapsedActive] = useState(true);
  const [collectionSelection, setCollectionSelection] = useState(["All"]);
  const [collectionSelectionColor, setCollectionSelectionColor] = useState([]);
  const [random, setRandom] = useState(true);
  const [popUpVisible, setPopUpVisible] = useState(false);

  //console.log("setup start time: " + startTime)

  const saveAndGoBack = async() => {
    saveData();
    Notifications.cancelAllScheduledNotificationsAsync();
    //console.log("saveandGoBack start time: " + startTime)
    if(notificationsOn.On) {
      setPopUpVisible(true)
      var hours = frequencyhrs == "" ? 0 : frequencyhrs;
      var mins = frequencymins == "" ? 0 : frequencymins;
      if (hours == 0 && mins == 0) {mins = 1};
      await scheduleLocalNotification(hours, mins, verseOrPersonal, startTime, endTime, notificationSound, collectionSelection, random)
      setPopUpVisible(false)
    }
    navigation.goBack()
  };

  const GoBack = async() => {
    saveData();
    Notifications.cancelAllScheduledNotificationsAsync();
    //console.log("saveandGoBack start time: " + startTime)
    if(notificationsOn.On) {
      var hours = frequencyhrs == "" ? 0 : frequencyhrs;
      var mins = frequencymins == "" ? 0 : frequencymins;
      if (hours == 0 && mins == 0) {mins = 1};
      scheduleLocalNotification(hours, mins, verseOrPersonal, startTime, endTime, notificationSound, collectionSelection, random)
    }
    navigation.goBack()
  };

  const toggleNotificationsOn = action( () => {
    notificationsOn.On = !notificationsOn.On;
    setIsCollapsedActive(state => !state);
    Notifications.cancelAllScheduledNotificationsAsync();
  });

  const toggleNotificationSound = action( () => {
    setNotificationSound(state => !state);
  });

  const toggleRandom = action( () => {
    setRandom(state => !state);
  });

  const frequencyhrsInput = (text) => {
    var hours = text.replace(/[^0-9]/g,"");
    //hours = hours == "" ? 0 : hours; 
    setFrequencyhrs(hours);
  }

  const frequencyminsInput = (text) => {
    setFrequencymins(text.replace(/[^0-9]/g,""));
  }


  const saveData = async () => {

    const NotificationSettings = {
      notificationsActive: notificationsOn.On,
      frequencyhrs: frequencyhrs,
      frequencymins: frequencymins,
      //versesArray: [...versesArray],
      verseOrPersonal: verseOrPersonal,
      startTime: startTime,
      endTime: endTime,
      notificationSound: notificationSound,
      collectionChoice: [...collectionSelection],
      random: random,
    };

    try {
      const jsonValue = JSON.stringify(NotificationSettings);
      const Key = "NotificationSettings";
      await AsyncStorage.setItem(Key, jsonValue);
      console.log(Key,jsonValue)
    } catch (e) {
      console.log("saving error: " + e);
    };
  };

  const timeFormater = (time) => {
    var hours = Math.floor(time/60);
    var minutes = time - hours*60;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutes}`
  }

  const getNotificationSettings = async() => {
    try {
      const jsonValue = await AsyncStorage.getItem("NotificationSettings");
      const SettingsObject = JSON.parse(jsonValue);
      console.log(jsonValue);
      notiOn(SettingsObject.notificationsActive);

      setFrequencyhrs(SettingsObject.frequencyhrs);
      setFrequencymins(SettingsObject.frequencymins);
      //setVersesArray(SettingsObject.versesArray);
      setVerseOrPersonal(SettingsObject.verseOrPersonal);
      setStartTime(SettingsObject.startTime);
      setEndTime(SettingsObject.endTime);
      setNotificationSound(SettingsObject.notificationSound);
      setCollectionSelection(SettingsObject.collectionChoice);
      initialCollectionColors();
      setRandom(SettingsObject.random)

      setButtonLabel1(()=>timeFormater(SettingsObject.startTime));
      setButtonLabel2(()=>timeFormater(SettingsObject.endTime));
      
    } catch(e) {
      console.log("No notifications settings found: " + e);
    } finally {
      initialCollectionColors();
    }
  };

  const notiOn = action ( (value) => {
    notificationsOn.On = value;
  })



  useEffect( () => {getNotificationSettings()} , []);

  var collections = [...allCollectionsArray];
  collections = collections.filter( x => typeof(x) === "string")
 
  collections.unshift("All");
  collections.unshift("Favourites");

  const collectionColors = (x) => {

    var colorArray = [];

    //All
    if(x == 1) {
      if(collectionSelectionColor[1]) {
        for( let i = 1; i < collections.length; i++) {
          colorArray.push(false)
        }
        setCollectionSelection([]);
      }
      if(!collectionSelectionColor[1]) {
        for( let i = 0; i < collections.length; i++) {
          colorArray.push(true)
        }
        colorArray[0]=false;
        setCollectionSelection(["All"]);
      }

      setCollectionSelectionColor(colorArray);
      return;
    }


    colorArray = [...collectionSelectionColor];
    colorArray[x] = !colorArray[x];
     
    var tempColorArray = [...colorArray];
    tempColorArray.shift();

    if(tempColorArray.includes(false)) {
      colorArray[1] = false;
    }

    setCollectionSelectionColor(colorArray)
  
    var collectionArray = [];
    for( let i = 0; i < collections.length; i++) {
      colorArray[i] ? collectionArray.push(collections[i]) : {}
    }

    setCollectionSelection(collectionArray);

    //console.log("collection array: " + collectionArray)
    //console.log("ColorS: " + collectionSelectionColor);
  
  };
  
  const initialCollectionColors = () => {

    //console.log("initialising collection array colours\n collectionSelection: " + collectionSelection)

    var colorArray = []

    if(collectionSelection.length == 0) {
      for( let i=0; i<collections.length; i++) {
        colorArray.push(false);
      }
      setCollectionSelectionColor([...colorArray])
      return
    }

    if( collectionSelection[0] == "All") {
      for( let i =0; i<collections.length; i++) {
        colorArray.push(true);
      }
      setCollectionSelectionColor([...colorArray])
      return
    }

    for( let i =0; i<collections.length; i++) {
      for( let j =0; j<collectionSelection.length; j++) {
        if (collectionSelection[j] == collections[i]) {
          colorArray.push(true);
          continue;
        }
        if (j = collectionSelection.length - 1) {
          colorArray.push(false)
        };
      };
    };

    setCollectionSelectionColor([...colorArray])

  }
  

  const onChange = (event, selectedDate) => {
    //console.log("selectedDate: " + selectedDate);
    setShowTimePicker1(false);
    const currentDate = selectedDate || date1;
    setDate1(currentDate);
    //console.log("setting startTime: ", currentDate , currentDate.getHours()*60,currentDate.getMinutes())
    setStartTime(currentDate.getHours()*60+currentDate.getMinutes());
    timeFormat(currentDate);
    setButtonLabel1(() => timeFormat(currentDate));
  };

  const onChange2 = (event, selectedDate) => {
    setShowTimePicker2(false);
    const currentDate = selectedDate || date2;
    setDate2(currentDate);
    setEndTime(currentDate.getHours()*60+currentDate.getMinutes())
    timeFormat(currentDate);
    setButtonLabel2(() => timeFormat(currentDate));
  };

  const timeFormat = (time) => {
    const minutes = "0" + time.getMinutes();
    const hours = "0" + time.getHours();
    const fulltime = hours.substr(-2) + ":" + minutes.substr(-2);
    return fulltime;
  }

  return (
    <View style={{ flex: 1, alignItems:"flex-start", justifyContent:"flex-start"}}>

      <View style={{ padding:20, paddingTop:50, width:"100%", height:90, backgroundColor:"white", flexDirection:"row", justifyContent:"space-between", alignItems:"center", borderBottomColor:"#DDD", borderBottomWidth:2}} >

        <View>
          <TouchableOpacity onPress={GoBack} >
            <Ionicons name="arrow-back-outline" size={28} color="#222" />
          </TouchableOpacity>
        </View>

        <View>
          <Text style={{fontSize:24, color:"#222"}}>Notifications</Text>
        </View>
        
        <View>
          <Pressable  android_disableSound={true} >
            <Ionicons name="arrow-back-outline" size={24} color="white" />
          </Pressable>
        </View>

      </View>

    <ScrollView style={{width:"100%"}}>

      <View style={{height:70, marginTop:2, flexDirection:"row", justifyContent: "flex-start", alignItems:"center", backgroundColor:"#FAFAFA", width:"100%", padding:20}}>
        <View style={{flex:4}}>
          <Text style={{fontSize:18, color:"#555"}}>Verse notifications active</Text>
        </View>
        <View style={{marginLeft:10, flex:1}}>
          <ToggleSwitch setActive={toggleNotificationsOn} isActive={notificationsOn.On} />
        </View>
      </View>

      <Collapsible collapsed={!notificationsOn.On} style={{height:1500}}>

      <View style={{height:70, marginTop:2, flexDirection:"row", justifyContent: "flex-start", alignItems:"center", backgroundColor:"#FAFAFA", width:"100%", padding:20}}>
        <View style={{flex:4}}>
          <Text style={{fontSize:18, color:"#555"}}>Notification sound</Text>
        </View>
        <View style={{marginLeft:10, flex:1}}>
          <ToggleSwitch setActive={toggleNotificationSound} isActive={notificationSound} />
        </View>
      </View>

      <View style={{marginTop:2, flexDirection:"column", justifyContent: "flex-start", alignItems:"center", backgroundColor:"#FAFAFA", width:"100%", padding:20}}>
        <View style={{height:30, flexDirection:"row",justifyContent: "flex-start", alignItems:"center", backgroundColor:"#FAFAFA", width:"100%"}}>
        
          <View style={{marginRight:5}}>
            <Text style={{fontSize:18, color:"#555"}}>Display</Text>
          </View>

          <View style={{marginRight:-5}}>
            <CheckBox
              center
              checkedIcon='dot-circle-o'
              uncheckedIcon='circle-o'
              checked={verseOrPersonal}
              checkedColor={"#3A86FF"}
              onPress={() => {setVerseOrPersonal(checked => !checked)}}
            />
          </View>

          <View style={{marginRight:-5}}>
            <Text style={{fontSize:18, color:"#555"}}>verse</Text>
          </View>

        </View>

        <View style={{height:30, flexDirection:"row",  justifyContent: "flex-start", alignItems:"center", backgroundColor:"#FAFAFA", width:"100%", marginTop:7}}>

          <View style={{marginRight:5}}>
            <Text style={{fontSize:18, color:"#FAFAFA"}}>Display</Text>
          </View>

          
          <View style={{marginRight:-5}}>
            <CheckBox
              center
              checkedIcon='dot-circle-o'
              uncheckedIcon='circle-o'
              checked={!verseOrPersonal}
              onPress={() => {setVerseOrPersonal(checked => !checked)}}
              checkedColor={"#3A86FF"}
            />
          </View>

          <View >
            <Text style={{fontSize:18, color:"#555"}}>personalised</Text>
          </View>
        </View>
      </View>
      
      <View style={{height:70, marginTop:2, flexDirection:"row", justifyContent: "flex-start", alignItems:"center", backgroundColor:"#FAFAFA", width:"100%", padding:20}}>
        <View>
          <Text style={{fontSize:18, color:"#555"}}>Schedule</Text>
        </View>
        <View style={{marginLeft:10}}>
          <TextInput
            style={{ fontSize:18, height: 40, width:50, borderColor: '#CCC', borderWidth: 1, backgroundColor:"#FEFEFE", textAlign:"center", color:"#3A86FF" }}
            onChangeText={text => frequencyhrsInput(text)}
            value={`${frequencyhrs}`}
            keyboardType={"number-pad"}
          />
        </View>
        <View style={{marginLeft:10}} >
          <Text style={{fontSize:18, color:"#555"}}>hr</Text>
        </View>
        <View style={{marginLeft:10}}>
          <TextInput
            style={{ fontSize:18, height: 40, width:50, borderColor: '#CCC', borderWidth: 1, backgroundColor:"#FEFEFE", textAlign:"center", color:"#3A86FF" }}
            onChangeText={text => frequencyminsInput(text)}
            value={`${frequencymins}`}
            keyboardType={"number-pad"}
          />
        </View>
        <View style={{marginLeft:10}} >
          <Text style={{fontSize:18, color:"#555"}}>mins</Text>
        </View>
      </View>

      <View style={{height:70, marginTop:2, flexDirection:"row", justifyContent: "flex-start", alignItems:"center", backgroundColor:"#FAFAFA", width:"100%", padding:20}}>
        
        <View>
          <Text style={{fontSize:18, color:"#555"}}>Between</Text>
        </View>
      
        <View style={{marginLeft:10,  width:80}}>
          <Button onPress={() => {setShowTimePicker1(true)}} title={buttonLabel1} type={"outline"} titleStyle ={{color:"#3A86FF", fontSize:18, fontWeight:"normal"}} style={{borderColor:"#999"}}/>
        </View>
        
        {showTimePicker1 &&
          <DateTimePicker
            testID="dateTimePicker"
            value={date1}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        }
        
        <View style={{marginLeft:10}} >
          <Text style={{fontSize:18, color:"#555"}}>and</Text>
        </View>

        <View style={{marginLeft:10, width:80}}>
          <Button onPress={() => {setShowTimePicker2(true)}} title={buttonLabel2} type={"outline"} titleStyle ={{color:"#3A86FF", fontSize:18, fontWeight:"normal"}} style={{borderColor:"#999"}} />
        </View>

        {showTimePicker2 &&
          <DateTimePicker
            testID="dateTimePicker"
            value={date2}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onChange2}
          />
        }

      </View>

      <View style={{height:70, marginTop:2, flexDirection:"row", justifyContent: "flex-start", alignItems:"center", backgroundColor:"#FAFAFA", width:"100%", padding:20}}>
        <View style={{flex:4}}>
          <Text style={{fontSize:18, color:"#555"}}>Randomised</Text>
        </View>
        <View style={{marginLeft:10, flex:1}}>
          <ToggleSwitch setActive={toggleRandom} isActive={random} />
        </View>
      </View>

      <Pressable  android_disableSound={true} onPress={() => setIsCollapsed(state => !state)} style={{height:70, marginTop:2, flexDirection:"row", justifyContent: "space-between", alignItems:"center", backgroundColor:"#FAFAFA", width:"100%", padding:20}}>
        <View >
          <Text style={{fontSize:18, color:"#555"}}>Collection</Text>
        </View>
        <View >
          <Entypo name={isCollapsed? "chevron-thin-down":"chevron-thin-up"} size={22} color="#AAA" />
        </View>
      </Pressable>    
        
      <View style={{flex:1, width:"100%",}}>
        <Collapsible collapsed={isCollapsed} >
            
          {collections.map( (x, index) => {

            return(
            <Pressable  android_disableSound={true} onPress={() => collectionColors(index)} style={{padding:20, paddingLeft:40, flex:1, width:"100%", height:40, marginTop:2, flexDirection:"row", justifyContent: "flex-start", alignItems:"center", backgroundColor: collectionSelectionColor[index] ?  "hsl(217,100%,95%)" : "#FAFAFA", }} key={index} >
              
              <Text style={{fontSize:20, color: collectionSelectionColor[index] ? "#3A86FF" : "#999", fontWeight: collectionSelectionColor[index] ? "600" : "normal"}}>{x}</Text>

            </Pressable>
            )
          })}
          
        </Collapsible>
      </View>

      <View style={{flex:1, height:100, width:"100%",}}>
      </View>

      </Collapsible>
      
    </ScrollView>

    <View style={{position:"absolute", bottom:30, alignItems:"center", justifyContent:"space-between", marginTop:20, width: "100%", paddingHorizontal:10}}>
      <TouchableOpacity onPress={()=>saveAndGoBack()} style={{padding:15, paddingHorizontal:20, borderRadius:5, margin:3, height:40, justifyContent:"center", alignItems:"center", backgroundColor: "rgba(255,255,255,0.8)", borderWidth:1, borderColor:"#AAA"}}>
          <Text style={{color:"#3A86FF", fontSize:18, fontWeight:"600"}}>Save Settings</Text>
      </TouchableOpacity>
    </View>

    <PopUpNotifications  popUpVisible={popUpVisible} />

    </View>
)});
  
export default NotificationScreen;