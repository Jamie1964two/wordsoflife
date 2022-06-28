import React, {useState} from 'react';
import { View, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import {Button} from 'react-native-elements';
import { Feather } from '@expo/vector-icons'; 
import {VerseObject, ActiveVerseObject, PlayButtonEnabled} from '../store';
import {observer} from 'mobx-react';
import { useEffect } from 'react';
import Sounds from '../assets/Sounds';

const playButton = observer((props) => {

  const [sound, setSound] = useState();
  const [active, setActive] = useState(false);

  const changeActive = () => {
    if(props.origin == "main") {
      setActive(PlayButtonEnabled.On);
    } 
    if(props.origin == "edit") {
      setActive(VerseObject.Audio == "" ? false : true);
    }
  }
      
  const changeAudio = () => {

    var audioObject = {};

    try {
    if(props.origin == "main") {
      //console.log('ActiveVerseObject["Audio"]: ' + ActiveVerseObject["Audio"])
      if(ActiveVerseObject["Audio"] != "") {
      audioObject = {
        Audio: ActiveVerseObject["Audio"],
        Key: ActiveVerseObject["Key"]
      };
      } else {
        return;
      }
    };
    if(props.origin == "edit") {
      //audioObject = VerseObject.Audio;
      audioObject = {
        Audio: VerseObject["Audio"],
        Key: VerseObject["Key"]
      };
    };
    } catch (e) {//console.log(e)
    }

    return audioObject;
   
  };


  useEffect( () => changeActive() , [])

  useEffect( () => changeActive(), [PlayButtonEnabled.On, VerseObject.Audio, ActiveVerseObject.Object])

  const onPlaybackStatusUpdate = (PlayBackStatus) => {
    if (PlayBackStatus.didJustFinish) {props.setPlayingSound(false)};
  };

  async function playSound() {

    props.setPlayingSound(true);
    const audioObject = changeAudio();

    //console.log("audioObject: "+ JSON.stringify(audioObject))

    if(audioObject["Audio"].match(/^[0-9]{3}_/)) {
      console.log("sounds file: " + JSON.stringify(Sounds[audioObject["Key"]]))
      var { sound } = await Audio.Sound.createAsync(Sounds[audioObject["Key"]]);
    } else { 
      var source = { uri: audioObject["Audio"] };
      var { sound } = await Audio.Sound.createAsync( source );
    }    

    try {
      //const { sound } = await Audio.Sound.createAsync( source );
      setSound(sound);
      if(props.origin=="main"){
        props.setOneSound(sound)
      }
      try {
        props.ffsound.stopAsync()
        props.setAutoPlayOn(false);
        props.ffsound.unloadAsync()
      } catch (e) {
        //console.log(e)
      }
      await sound.playAsync(); 
      await sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    } catch (err) {
      //console.log("playAsync err: " + err);
      props.setPlayingSound(false);
    }    
  };

  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync(); 
        }
      : undefined;
  }, [sound]);

  async function stopPlayBack() {
    try {
    await sound.stopAsync()
    } catch (err) {
    //console.log("stopAsync err:" + err) 
    };
    props.setPlayingSound(false);
  };
  
  return (
    <View style={styles.container}>

      <Button
        icon={
            <Feather name={(props.playingSound) ? "square" : "play" } size={30} color={active ? "#3A86FF" : "#DDD"} />
        }
        buttonStyle={{backgroundColor:"rgba(255,255,255,0}"}}
        onPress={props.playingSound ? stopPlayBack : playSound}
        disabled={!active}
        disabledStyle={{backgroundColor:"rgba(255,255,255,0}"}}
      />
    </View>      
  );

});

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height:45,
  },
});

export default playButton;