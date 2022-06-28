import { Audio } from 'expo-av';
import { VerseObject } from '../store';
import { action } from 'mobx';

export async function startRecording(setRecordingValue) {
  try {
    // console.log('Requesting permissions..');
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    }); 
    // console.log('Starting recording..');
    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
    await recording.startAsync(); 
    setRecordingValue(recording);
    //toggleRecording();
    // console.log('Recording started');
  } catch (err) {
    console.error('Failed to start recording', err);
  }
}

export async function stopRecording(recording, setRecordingValue) {
  // console.log('Stopping recording..');
  setRecordingValue(undefined);
  await recording.stopAndUnloadAsync();
  const uri = recording.getURI(); 
  //console.log(" ")
  // console.log('Recording stopped and stored at', uri);
  // console.log(recording.getStatusAsync());
  storeFileName(uri);
}

const storeFileName = action( (uri) => {
  VerseObject["Audio"] = uri;
})


