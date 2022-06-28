import { verseKeyHolder, VerseObject } from "../store";
import { action } from "mobx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const saveData = action( async (setPopUpVisible) => {

    //activeVerseKeySet();

    var jsonBackup = "";
    verseKeyHolder.key = VerseObject.Key;
    
    //steps:
    // 1. save back up if existing
    // 2. clear item if existing
    // 3. create new
    // 4. if fail restore original


    // 1. create a back up if already exists

    try {
        jsonBackup = await AsyncStorage.getItem(VerseObject.Key);
       // console.log('Backup of earlier verse copy made: ' + jsonBackup);
        // 2. clear item if existing
        await AsyncStorage.removeItem(VerseObject.Key)
    } catch(e) {
        console.log("No previous verse with this key found.");
    };

    // 3. create new
    
    try {
        const jsonValue = JSON.stringify(VerseObject);
        //console.log(jsonValue);
        const verseKey = `Verse_${VerseObject.Collection}_${VerseObject.Key}`;
        await AsyncStorage.setItem(verseKey, jsonValue);
        setPopUpVisible(true);
        //console.log("saving item: " + jsonValue);
    } catch (e) {
        console.log("saving error: " + e);
            Alert.alert(
                "Verse save failed",
                e,
                [{ text: "OK" }]
            );
        // 4. attempt to restore original
        try {
            //console.log("attempting to restore original.");
            const verseKey = VerseObject.Key;
            await AsyncStorage.setItem(verseKey, jsonBackup);
        } catch (e) {
            console.log("Orignal restore fail" + e);
        };
    };

});

export default saveData;