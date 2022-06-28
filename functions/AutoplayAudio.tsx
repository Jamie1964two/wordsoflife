import { Audio } from 'expo-av';
import {ActiveVerseObject} from '../store';
import Sounds from '../assets/Sounds';


const playAudio = async (setFFsound, setErrorLog) => {

  var playingSound = false;
  
  //console.log("audioObject: "+ JSON.stringify(audioObject))
 
  const onPlaybackStatusUpdate = (PlayBackStatus) => {
    if (PlayBackStatus.didJustFinish) {playingSound = false; return true};
    if (!PlayBackStatus.isLoaded) {
      setErrorLog( state => state + `\nSound loaded ok`)
      if (PlayBackStatus.error) {
        console.log(`Encountered a fatal error during playback: ${PlayBackStatus.error}`);
        // Send Expo team the error on Slack or the forums so we can help you debug!
        setErrorLog( state => state + `\nsound not loaded ${PlayBackStatus.error}` )
      }
    };
  };
  
  var audioLength;

  try {
    if(ActiveVerseObject["Audio"].match(/^[0-9]{3}_/)) {
     // console.log("sounds file: " + JSON.stringify(Sounds[ActiveVerseObject["Key"]]))
      var { sound: soundObject, status } = await Audio.Sound.createAsync(Sounds[ActiveVerseObject["Key"]]);
    } else { 
      var source = { uri: ActiveVerseObject["Audio"] };
      var { sound: soundObject, status } = await Audio.Sound.createAsync( source );
    }    

    setErrorLog( state => state + `\n${ActiveVerseObject["Audio"]}`)

    //const { sound: soundObject, status } = await Audio.Sound.createAsync( source );
    setFFsound(soundObject)
    audioLength = status;
    await soundObject.playAsync(); 
    playingSound = true;
    await soundObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    
  } catch (err) {
    setErrorLog( state => state + err)
   // console.log("sound did not play");
  }    
  try {
 // setErrorLog( state => state + `Duration: ${audioLength.durationMillis}\n`)
  return (audioLength.durationMillis);
  } catch (e) {
    //console.log(e)
  }
};

export default playAudio;