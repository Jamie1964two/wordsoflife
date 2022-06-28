import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import {VersionChoice, VerseObject} from '../store';
import * as Linking from 'expo-linking';
import BlueArrow from './BlueArrow';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const VersionRefModal = observer((props) => {

    const createVersionArrayList = () => {
        var newVersions = [['KJV', 'King James Version'],['WEB', 'World English Bible']];
        //var newVersions = [['KJV', 'King James Version'],['WEB', 'World English Bible'],['Almeida', 'João Ferreira de Almeida Portuguese Version'],['RCCV', 'Romanian Corrected Cornilescu Version'],['Cherokee','Cherokee New Testament']];
        return newVersions;
    };

    const [versionArrayList, setVersionArrayList] = useState(() => createVersionArrayList());

    const setColorArray = () => {
        console.log("VerseObject.Version: " + VerseObject.Version)
        var allFalse = [];
        for (let i=0; i < versionArrayList.length; i ++) {
            console.log("versionArrayList[i][0]" + versionArrayList[i][0])
            versionArrayList[i][0] == VerseObject.Version ? allFalse.push(true) : allFalse.push(false);
        };
        return allFalse;
    };

    const [choiceColor,setChoiceColor] = useState(setColorArray);

    const setColorArrayChoice = (index) => {
        var colorOnOff = [];
        for (let i=0; i <= versionArrayList.length; i ++) {
            i === index ? colorOnOff.push(true) : colorOnOff.push(false);
        };
        setChoiceColor(colorOnOff);
    };

    const selectVersion = action( (item, index) => {
        setColorArrayChoice(index);
        VersionChoice.version = item;
        saveVersionChoice(item);
    });

    const saveVersionChoice = async(item) => {
        try {
            await AsyncStorage.setItem('VersionChoice', item)
        } catch (e) {
           //console.log("error saving version choice: " + e)
        }        
    }

    const collectionElements = () => {
        
        return (
       
            <View style={{flex:1}}>

                <Pressable  android_disableSound={true} onPress={ () => {Linking.openURL('https://www.buymeacoffee.com/JamieMoreland');} } >
                    <View style={{height:80, borderWidth:1, borderColor:"#EEE", borderRadius:3, justifyContent:"center", padding:10, paddingLeft:10, margin:3, backgroundColor:"#edf4ff"}}  >
                        <Text style={{fontSize:16, color: "#999", textAlign:"center" }}>More Bible versions coming soon!</Text>
                        <Text style={{fontSize:16, color: "#999", textAlign:"center" }}>Please support Words of Life.</Text>
                    </View>
                </Pressable>

                {versionArrayList.map( (item, index) =>
                    <Pressable  android_disableSound={true} onPress={ () => selectVersion(item[0], index) } key={item[0]}>
                        <View style={{height:60, borderWidth:1, borderColor:"#EEE", borderRadius:3, justifyContent:"center", padding:3, paddingLeft:10, margin:3, backgroundColor:choiceColor[index] ? "#cce0ff" : "#FEFEFE"}}  >
                            <Text style={{fontSize:16, color:(choiceColor[index]) ? "#3A86FF" : "#AAA" }}>{item[0]}</Text>
                            <Text style={{fontSize:14, color:(choiceColor[index]) ? "#3A86FF" : "#CCC" }}>{item[1]}</Text>
                        </View>
                    </Pressable>
                )}

            </View>

        );

    };


    return (

        <Modal 
        isVisible={props.modalVisible} 
        backdropColor={"#AAA"} 
        backdropOpacity={0.7} 
        style={{ flex:1, zIndex:20, justifyContent:"center", alignItems:"center"}} 
        coverScreen={true}
        animationIn={props.slideForward ? "slideInRight" : "slideInLeft"}
        animationOut={props.slideForward ? "slideOutLeft" : "slideOutRight"} 
        backdropTransitionOutTiming={1500}
        animationInTiming={500}
        animationOutTiming={500}
        >

        <View style={{ flex:1, width:windowWidth*0.8, maxHeight:windowHeight*0.7, padding:20, backgroundColor:"white", justifyContent:"center", borderColor:"#777", borderWidth:1, borderRadius:8}}>

            <View style={{flex:1, justifyContent:"flex-start"}}>

                <View style={{flex:1, maxHeight: 50, marginVertical:10, marginTop:0, flexDirection:"row", justifyContent:"space-between", alignItems:"center"}} >

                    <Ionicons name="arrow-back" size={30} color="#CCC" onPress={() => {props.openVersionModal(false, false); setTimeout(() => props.openVModal(false, true),800)}}/>

                    <Text style={{color:"#3A86FF", fontWeight:"bold", fontSize: 20, textAlign:"center"}}>Version</Text>

                    <Pressable  android_disableSound={true} onPress={() => {
                            props.openVersionModal(true, false); 
                            setTimeout(() => props.openAPIModal(true, true),800)
                        }} 
                    >

                    <BlueArrow forwardArrowVisible={true} />

                    </Pressable>

                </View>

                <View style={styles.divisions} />

                <View style={{marginTop:10, marginBottom:20, flex:1}}>
                
                    <ScrollView>
                        
                        {collectionElements()}

                    </ScrollView>

                </View>

                <View style={{width:"100%", alignItems:"center"}}>
                    <Text style={{fontSize:16, color:"#999"}} onPress={() => {props.openVersionModal(true, false)}}>Cancel</Text>
                </View>


            </View>

        </View>

        </Modal>

    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    divisions: {
        width:"100%",
        backgroundColor:"#CCC",
        height:2,
        marginTop:-5,
    },
    viewBoxes: {
        height: 70,
        marginRight:10,
        zIndex: 1,
        marginTop:8,
    }
});

export default VersionRefModal;