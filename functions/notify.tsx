import * as Notifications from 'expo-notifications';
import CollectionReturner from "../functions/createVersesArray";
import AsyncStorage from '@react-native-async-storage/async-storage';


var VerseArray = [];

const populateVerses = async (collectionSelection) => {
    try{
        var Array = await CollectionReturner(collectionSelection);
        VerseArray = Array.filter( x => x.Display == true);
    } catch (e) {
        //console.log("populateVerses error: " + e)
    }

};

const saveLastTrigger = async (value) => {
  try {
   // console.log(value)
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('LastNotification', jsonValue)
  } catch(e) {
    console.log("error saving last notification time", e)
  }

 // console.log('Done.')
}

async function scheduleLocalNotification(frequencyhrs, frequencymins, verseOrPersonal, startTime, endTime, notificationSound, collectionSelection, random ) {

  //console.log("running schedule local nots", startTime, endTime)

  if(collectionSelection.length == 0) {return}

  await populateVerses(collectionSelection);

  Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: false,
        shouldPlaySound: notificationSound,
        shouldSetBadge: false,
      }),
  });

  const triggerArray = [];
  var filteredTriggers = [];
  let counter = 0;
  let frequency = parseInt(frequencyhrs) * 60 + parseInt(frequencymins);

  //console.log("frequency: " + frequency)
  
  var VOrP = verseOrPersonal ? "Verse" : "Personalise"; 

  const setVorP = (element) => {
    //console.log(element.Verse == "",element.Personalise == "",VOrP,checked)

    if (element.Verse == "" && element.Personalise == "") return false;
    if (verseOrPersonal && element.Verse == "") {
      VOrP = "Personalise";
      return true;
    };
    if (!verseOrPersonal && element.Persoanlise == "") {
      VOrP = "Verse";
      return true;
    }
    return true;
  }

  const startTimeInt = parseInt(startTime);
  const endTimeInt = parseInt(endTime);

  const compareTimes = (x) => {
    // console.log( x.getHours(), x.getHours()*60 + x.getMinutes(), startTimeInt, endTimeInt,  ( x.getHours()*60 + x.getMinutes() ) >= startTimeInt, (x.getHours()*60 + x.getMinutes() <= endTimeInt), (( x.getHours()*60 + x.getMinutes() ) >= startTimeInt) && (x.getHours()*60 + x.getMinutes() <= endTimeInt))
    return ( ( ( x.getHours()*60 + x.getMinutes() ) >= startTimeInt) && (x.getHours()*60 + x.getMinutes() <= endTimeInt) )
  } 

  try {

    // create an array of triggers

    const nowTime = new Date();
    nowTime.setMinutes(0);
    nowTime.setSeconds(0);
    nowTime.setHours(nowTime.getHours());
    const nowMilli = nowTime.getTime();
    
    for (let q=0; q<800; q++) {                         

      var triggerTime = (nowMilli +  frequency * 60 * 1000 * (q+1))
      //console.log("triggerTime" + triggerTime)
      triggerArray.push(new Date(triggerTime))
    }
    //console.log("triggerTime" + triggerArray)
    //console.log("start and end: " + startTime, endTime)

    //console.log(endTimeInt == startTimeInt, endTimeInt > startTimeInt )

    if (endTimeInt == startTimeInt) {
      filteredTriggers = [...triggerArray];
    } else if (endTimeInt > startTimeInt) {
      filteredTriggers = triggerArray.filter(compareTimes);

    } else {
      for (let z=0; z<triggerArray.length; z++) {
        if (triggerArray[z].getHours()*60+triggerArray[z].getMinutes()>endTimeInt && triggerArray[z].getHours()*60+triggerArray[z].getMinutes()<startTimeInt) {
          continue
        } else {
          filteredTriggers.push(triggerArray[z]);
        }
      }
    }
    
    //console.log(...filteredTriggers.map(x => x.getHours()))

    // create array of random numbers for randomiser

    var randomArray = [];
    var ranks =[];

    for (let i=0; i < VerseArray.length; i++) {
      randomArray.push(random ? Math.floor(Math.random()*1000000) : i)
    }
    
    if(random) {
      //var arr = [79, 5, 18, 5, 32, 1, 16, 1, 82, 13];
      var sorted = randomArray.slice().sort(function(a,b){return b-a})
      ranks = randomArray.map(function(v){ return sorted.indexOf(v)+1 });
    } else {
      ranks = [...randomArray];
    };

    //console.log(ranks);


    // create notification events

    for( let i=0; i<800; i++) {
      for( let n=0; n<VerseArray.length; n++) {

        if(counter >= filteredTriggers.length-2) break; 
        //if(counter >= 30) break;

        const z = ranks[n] - 1;

        if (!setVorP(VerseArray[z])) continue;
        if (!VerseArray[z]["Display"]) continue;

        const trigger =  filteredTriggers[counter];
        //console.log("trigger: " + trigger)
        const removeNewLine = VerseArray[z][VOrP].replace(/\n/g," ");
        
        var startOfVerseIndex = 0;
        var nonSpaceOrLetters = removeNewLine.search(/[,.;:!]/g);
          if(nonSpaceOrLetters>20 && nonSpaceOrLetters<35){
            startOfVerseIndex = nonSpaceOrLetters+1;
          }
        
        
        if(startOfVerseIndex == 0) {
          var a = removeNewLine.indexOf(" ",35);
          if(a == -1) {a = 999999};
          startOfVerseIndex = a;
        }

        // const startOfVerseIndex = removeNewLine.indexOf(" ",35);
        const startOfVerse = removeNewLine.slice(0,startOfVerseIndex);
        const restOfVerse = removeNewLine.slice(startOfVerseIndex+1);

        console.log(counter + " " + trigger + " start of Verse: " + startOfVerse);

        await Notifications.scheduleNotificationAsync({
          content: {
            title: `${startOfVerse}`,
            body: `${restOfVerse}\n${VerseArray[z].Book} ${VerseArray[z].Chapter}:${VerseArray[z].V}`,
            data: {
              "collection": VerseArray[z].Collection,
              "key": VerseArray[z].Key
            },
          },
          trigger: trigger,
          
        });
        counter++;
      }  
    }

    //store last notification time to memory

    saveLastTrigger(filteredTriggers[counter-1].getTime());

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Continue verse notifications?",
        body: "Open app to continue receiving verse notifications.",
        data: {data: "restartNotifications"},
      },
      trigger: filteredTriggers[counter-1] ,

    });

  } catch(Error) {console.log(Error)};

};

export default scheduleLocalNotification;