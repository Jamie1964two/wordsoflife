import React, {useState} from 'react';
import { View, Text } from 'react-native';
import PlayVerse from './PlayVerse';
import {Button} from 'react-native-elements';
import { Feather } from '@expo/vector-icons'; 
import { Stopwatch } from 'react-native-stopwatch-timer'
import { observer } from 'mobx-react-lite';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { startRecording, stopRecording } from './RecordVerse';

const RecorderBar = observer((props) => {

    const [recording, setRecording] = React.useState();
    const [recordingActivated, setRecordingActivated] = React.useState(false);
    const [resetStopWatch, setResetStopWatch] = React.useState(false);
    const [recordingMade, setRecordingMade] = useState(false);

    const setRecordingValue = (value) => {
        setRecording(value);
    }

    const RecordingOn = () => {
        setResetStopWatch(false);
        setRecordingActivated(true);
    }

    const RecordingOff = () => {
        setRecordingActivated(false);
        setRecordingMade(true);
    }

    const resetStop = () => {
        setResetStopWatch(true);
        setRecordingActivated(false);  
        setRecordingMade(false) 
    }
    
    return (   
        <View>
            <View style={{width:"100%", height:80,  justifyContent:"flex-start"}}>              
                <View style={{paddingLeft:10, flex:1, alignItems:"flex-start", width:"100%"}}>
                    <Text style={{fontSize:16, color:"#777", fontWeight:"bold"}}>Record verse audio</Text>
                </View>
                <View style={{flexDirection:"row", flex:2, justifyContent:"space-evenly", alignItems:"center", width:"100%"}}>
                    <View style={{flex:1}} >
                        <PlayVerse origin={"edit"} setPlayingSound={props.setPlayingSound} playingSound={props.playingSound}/>
                    </View>
                    <View style={{flex:1}}>
                        <Button
                        icon={
                            <MaterialCommunityIcons name="record" size={30} color={recordingMade ? "#666" : "red"} /> }
                            type="clear"
                            onPress={() => {if(recordingMade) {
                                resetStop() 
                            } else {
                                RecordingOn(); 
                                startRecording(setRecordingValue)
                            }}}
                        />
                
                    </View>
                    <View style={{flex:1}}>

                        <Button
                        icon={
                            <Feather name={"square"} size={30} color={recordingActivated ? "#3A86FF" : "#999"} />
                        }
                        buttonStyle={{backgroundColor:"rgba(255,255,255,0}"}}
                        onPress={() =>{
                            if(recordingActivated) {
                            RecordingOff();
                            stopRecording(recording, setRecordingValue)
                            } else {
                            
                            }}}
                        disabled={false}
                        disabledStyle={{backgroundColor:"rgba(255,255,255,0}"}}
                        />

                    </View>

                    <View style={{flex:1, alignItems:"center"}}>
                        <Stopwatch msecs options={options} start={recordingActivated} reset={resetStopWatch}/>
                    </View>

                    <View style={{flex:1}}>

                        <Button
                        icon={
                            <Feather name={"x"} size={30} color={"#3A86FF"} />
                        }
                        buttonStyle={{backgroundColor:"rgba(255,255,255,0}"}}
                        onPress={() => {RecordingOff();stopRecording(recording, setRecordingValue);props.openRecordingBar()}}
                        disabled={false}
                        disabledStyle={{backgroundColor:"rgba(255,255,255,0}"}}
                        />

                    </View>

                </View> 

            </View>

        </View>
    );
});


const options = {
    container: {
      backgroundColor: '#FFF',
      padding: 5,
      borderRadius: 5,
      width: 70,
      alignItems: 'center',
    },
    text: {
      fontSize: 22,
      color: '#888',
    }
};

export default RecorderBar;