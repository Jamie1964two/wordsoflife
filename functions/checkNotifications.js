import AsyncStorage from "@react-native-async-storage/async-storage";
import scheduleLocalNotification from "./notify";
import * as Notifications from 'expo-notifications';

var SettingsObject = {};
var LastNotification;


const getNotificationSettings = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("NotificationSettings");
    SettingsObject = JSON.parse(jsonValue);
    // const nots = await AsyncStorage.getItem('NotificationSettings');
    // console.log("nots: " + nots)
    // return nots != null ? JSON.parse(nots) : null;
  } catch(e) {
    console.log("error retrieving notifcation settings: " + e)
  }
  
}

const getLastNotification = async () => {
    try {
      LastNotification = await AsyncStorage.getItem('LastNotification');
    } catch(e) {
        console.log("error retrieving last notifcation time: " + e)
    }  
}

const notificationsCheck = async() => {

    await getNotificationSettings();

    if(SettingsObject == null) return "Notifications not initialised";

    console.log("retrieving settings object: "+ JSON.stringify(SettingsObject))

    if (SettingsObject.notificationsActive != true) return "Notifications off";

    await getLastNotification();

    const nowTime = new Date()

    console.log("time left to run hours: " + (LastNotification - nowTime.getTime())/1000/60/60)

    //const frequency = (SettingsObject.frequencyhrs *60 + SettingsObject.frequencymins)

    if(LastNotification != null && LastNotification - nowTime.getTime() > 2*24*3600*1000) return "Over 2 days to run"

    Notifications.cancelAllScheduledNotificationsAsync();

    await scheduleLocalNotification(SettingsObject.frequencyhrs, SettingsObject.frequencymins, SettingsObject.verseOrPersonal, SettingsObject.startTime, SettingsObject.endTime, SettingsObject.notificationSound, SettingsObject.collectionChoice, SettingsObject.random);

    console.log("notifications relaunched");

    return "notifications set"
};

export default notificationsCheck;
