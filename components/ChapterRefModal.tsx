import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Pressable } from 'react-native';
import Modal from 'react-native-modal';

import { Ionicons } from '@expo/vector-icons';

import {action} from 'mobx';
import {observer} from 'mobx-react';

import {NoOfVersesInChapter, ChapterChoice, BookIndex, VerseChoice} from '../store';
import {NoOfChapters} from '../store';

import VersesInChapters from '../constants/VersesInChapters';
import BlueArrow from './BlueArrow';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ChapterRefModal = observer((props) => {

    
    const setColorArrayChoice = action ((index) => {
        var colorOnOff = [];
        for (let i=0; i < NoOfChapters.count; i ++) {
            i === index ? colorOnOff.push(true) : colorOnOff.push(false);
        };

        //console.log("chaptercolorArray: " + [...chapterColorArray.array])
        props.setChapterColorArray2(colorOnOff);
    });

 
    const selectChapter = action( (item, index) => {
        //console.log("VersesInChapters[BookIndex.index][parseInt(item)] :" + VersesInChapters[BookIndex.index][parseInt(item)]);
        setColorArrayChoice(index);
        NoOfVersesInChapter.count = parseInt(`${VersesInChapters[BookIndex.index][parseInt(item)]}`);
        ChapterChoice.Chapter = item;
        VerseChoice.Verse.length = 0;
        setVerseColorArray();
    });

    const setVerseColorArray = () => {
        var allFalse = [];
        for (let i=0; i < NoOfVersesInChapter.count; i++) {
            allFalse.push(false);
        };
        props.setVerseColorArray2(allFalse);
        //console.log("set up in Chpt modal vcolorarray : " + [...verseColorArray.array]);
    };

    const chapterElements = () => {

        var versesArray = []
        for(var i=0; i< NoOfChapters.count; i++) { 
            versesArray.push(i+1)
        };

        //console.log("here" + [...chapterColorArray.array])

        return (
            <ScrollView>
                
                <View style={{flexDirection:"row", flexWrap:"wrap", flex:1, justifyContent: NoOfChapters.count > 4 ? "space-between" : "flex-start" }}>
                    { versesArray.map( (item,index) => 
            
                        <Pressable  android_disableSound={true} onPress={ () => selectChapter(item, index) } key={index}>
                            <View style={{height:40, width:45, flex:1, borderWidth:1, borderColor:"#EEE", borderRadius:3, justifyContent:"center", alignItems:"center", padding:3, margin:3, backgroundColor:props.chapterColorArray2[index] ? "#cce0ff" : "#FEFEFE" }}  >
                                <Text style={{fontSize:16, color:props.chapterColorArray2[index] ? "#3A86FF" : "#AAA" }} >{item}</Text> 
                            </View>
                        </Pressable>
                        )
                    }
                </View>
            </ScrollView>
        );
    };


    return (

        <Modal 
        isVisible={props.modalVisible} 
        backdropColor={"#AAA"} 
        backdropOpacity={0.7} 
        style={{ flex:1, zIndex:20, justifyContent:"center", alignItems:"center"}} 
        coverScreen={true}
        backdropTransitionOutTiming={1500} 
        animationIn={props.slideForward ? "slideInRight" : "slideInLeft"}
        animationOut={props.slideForward ? "slideOutLeft" : "slideOutRight"}
        animationInTiming={500}
        animationOutTiming={500}
        >

        <View style={{ flex:1, width:windowWidth*0.8, maxHeight:windowHeight*0.7, padding:20, backgroundColor:"white", justifyContent:"center", borderColor:"#777", borderWidth:1, borderRadius:8}}>

            <View style={{flex:1, justifyContent:"flex-start"}}>

                <View style={{flex:1, maxHeight: 50, marginVertical:10, marginTop:0, flexDirection:"row", justifyContent:"space-between", alignItems:"center"}} >

                    <Ionicons name="arrow-back" size={30} color="#CCC" onPress={() => {props.openChapterModal(false, false); setTimeout(() => props.openBookModal(false, true),800)}}/>

                    <Text style={{color:"#3A86FF", fontWeight:"bold", fontSize: 20, textAlign:"center"}}>Chapter</Text>

                    <Pressable  android_disableSound={true} onPress={() => {
                            if(ChapterChoice.Chapter) {
                            props.openChapterModal(true, false); 
                            setTimeout(() => props.openVModal(true, true),800)
                            } else {
                                {};
                            };
                    }}
                    >

                    <BlueArrow forwardArrowVisible={ChapterChoice.Chapter} />

                    </Pressable>

                </View>

                <View style={styles.divisions} />

                <View style={{marginTop:10, flex:1}}>

                    <View style={{maxHeight:windowHeight*0.5}}>
                    
                        {chapterElements()}

                    </View>

                </View>

                <View style={{width:"100%", alignItems:"center"}}>
                    <Text style={{fontSize:16, color:"#999"}} onPress={() => {props.openChapterModal(true, false)}}>Cancel</Text>
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
        //flex:1,
        height: 70,
        marginRight:10,
        zIndex: 1,
        marginTop:8,
    }
});

export default ChapterRefModal;