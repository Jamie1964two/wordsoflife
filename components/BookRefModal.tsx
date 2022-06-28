import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import booksOfBibleOT from '../constants/booksOfBibleOT';
import booksOfBibleNT from '../constants/booksOfBibleNT';
import { Ionicons } from '@expo/vector-icons';

import {action} from 'mobx';
import {observer} from 'mobx-react';
import {ChapterChoice, NoOfChapters, VerseChoice, Verse, VerseObject } from '../store';
import {BookChoice} from '../store';
import {BookIndex} from '../store';
import Collapsible from 'react-native-collapsible';
import { Feather } from '@expo/vector-icons'; 
import VersesInChapters from '../constants/VersesInChapters';
import BlueArrow from './BlueArrow';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const BookRefModal = observer((props) => {

    const [isOTCollapsed, setIsOTCollapsed] = useState(true);
    const [isNTCollapsed, setIsNTCollapsed] = useState(true);

    const collapseOT = () => {
        if(isOTCollapsed) setIsNTCollapsed(true);
        setIsOTCollapsed(state => !state);
    };

    const collapseNT = () => {
        if(isNTCollapsed) setIsOTCollapsed(true);
        setIsNTCollapsed(state => !state);
    };
    
    const createCollectionArrayList = () => {
        var newCollection = [...props.collectionListIdDrop];
        newCollection.push("+ New Collection");
        return newCollection;
    };

    const setColorArray = (old, noOfBooks) => {
        var allFalse = [];
        for (let i=0; i < noOfBooks; i ++) {
            if(old === true) {
                booksOfBibleOT[i]["title"] === VerseObject.Book ? allFalse.push(true) : allFalse.push(false);
            } else {
                booksOfBibleNT[i]["title"] === VerseObject.Book ? allFalse.push(true) : allFalse.push(false);
            };   
        };
        
        return allFalse;

    };

    const [OTchoiceColor,setOTChoiceColor] = useState(setColorArray(true, 39));
    const [NTchoiceColor,setNTChoiceColor] = useState(setColorArray(false, 27));

    const setColorArrayChoice = (index, Old) => {
        var colorOnOff = [];
        if (Old) { 
            for (let i=0; i < 39; i ++) {
                i === index ? colorOnOff.push(true) : colorOnOff.push(false);
            };
            setOTChoiceColor(colorOnOff);
            colorOnOff = [];
            for (let i=0; i < 27; i ++) {
                colorOnOff.push(false);
            };
            setNTChoiceColor(colorOnOff);
        } else {
            for (let i=0; i < 27; i ++) {
                i === index ? colorOnOff.push(true) : colorOnOff.push(false);
            };
            setNTChoiceColor(colorOnOff);
            colorOnOff = [];
            for (let i=0; i < 39; i ++) {
                colorOnOff.push(false);
            };
            setOTChoiceColor(colorOnOff);
        }

    };

    const initalForwardArrowOn = () => {
        //console.log("VerseObject.Book: " + VerseObject["Book"] + typeof VerseObject["Book"])
        var selectionMade = (VerseObject["Book"] == null) ? false : true;
        return selectionMade;
    };
        
    const [forwardArrowVisible, setForwardArrowVisible] = useState(() => initalForwardArrowOn());


    const selectBook = (item, index, Old) => {
        setColorArrayChoice(index, Old);
        setForwardArrowVisible(true);
        updateBook(item);
        updateNoOfChapters();
    };

    const updateBook = action((item) => {
        BookChoice.Book = item.value;
        ChapterChoice.Chapter = null;
        VerseChoice.Verse.length = 0;
        setChapterColorArray();
        Verse.verse = "";
        //console.log("update Book versecolorArray: " + [...verseColorArray.array])
    });

    const setChapterColorArray = action( () => {
        var allFalse = [];
        for (let i=0; i < NoOfChapters.count; i ++) {
            allFalse.push(false);
        };
        //chapterColorArray.array = [...allFalse];
        props.setChapterColorArray2(allFalse);
        //console.log("chaptercolourarray :" + [...chapterColorArray.array]);
    });

    const setVerseColorArray = action( () => {
        var allFalse = [];
        for (let i=0; i < 177; i ++) {
            allFalse.push(false);
        };
        //verseColorArray.array = [...allFalse];
        //console.log("versecolourarray :" + [...verseColorArray.array]);
    });

    const updateNoOfChapters = action( () => {
        VersesInChapters.forEach( (x, index) => {
            var NoWhiteSpace = x[0] + "";
            NoWhiteSpace = NoWhiteSpace.replace(/\s/g,"")
            
            var BookComparison = BookChoice.Book + "";
            BookComparison = BookComparison.replace(/\s/g,"");

            if(NoWhiteSpace === BookComparison) {
                BookIndex.index = index;     
            } 
        } 
        );
        NoOfChapters.count = VersesInChapters[BookIndex.index].length-1;
        //console.log("Book index :" + BookIndex.index);
        //console.log("No Of Chapters :" + NoOfChapters.count);
    })

    const TestamentElements = (Old) => {
        
        var Books = (Old === true ? [...booksOfBibleOT] : [...booksOfBibleNT]);

        return (
                <ScrollView>
                {Books.map( (item, index) =>
                    <Pressable onPress={ () => selectBook(item, index, Old) } key={item.value} android_disableSound={true}>
                        <View style={{height:30, borderWidth:1, borderColor:"#EEE", borderRadius:3, justifyContent:"center", padding:3, paddingLeft:10, margin:3, backgroundColor:(Old === true ? OTchoiceColor[index] : NTchoiceColor[index]) ? "#cce0ff" : "#FEFEFE"}}  >
                            <Text style={{fontSize:16, color:(Old === true ? OTchoiceColor[index] : NTchoiceColor[index]) ? "#3A86FF" : "#AAA" }}>{item.value}</Text>
                        </View>
                    </Pressable>
                )}
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

                    <Ionicons name="arrow-back" size={30} color="#CCC" onPress={() => {props.openBookModal(false, false); setTimeout(() => props.openCollectionModal(false, true),800)}}/>

                    <Text style={{color:"#3A86FF", fontWeight:"bold", fontSize: 20, textAlign:"center"}}>Book</Text>

                    <Pressable  android_disableSound={true} onPress={() => {
                            if(forwardArrowVisible) {
                            props.openBookModal(true, false); 
                            setTimeout(() => props.openChapterModal(true, true),800)
                            } else {
                                {};
                            };
                        }}
                    >

                    <BlueArrow forwardArrowVisible={forwardArrowVisible} />

                    </Pressable>



                </View>

                <View style={styles.divisions} />

                <View style={{marginTop:10, flex:1}}>

                    <Pressable  android_disableSound={true} onPress={collapseOT} >
                        <View style={{margin:10, flexDirection: "row", justifyContent:"space-between"}} >
                            <Text style={{fontSize:16, color:"#777", fontWeight:"bold"}}>Old Testament  </Text>
                            <Feather name={isOTCollapsed ? "chevron-down" : "chevron-up"} size={20} color="#777" />
                        </View>
                    </Pressable>

                    <Collapsible collapsed={isOTCollapsed}>
    
                        <View style={{maxHeight:windowHeight*0.35}}>
                        
                            {TestamentElements(true)}

                        </View>

                    </Collapsible>

                    
                    <Pressable  android_disableSound={true} onPress={collapseNT} >
                        <View style={{margin:10, flexDirection: "row", justifyContent:"space-between"}} >
                            <Text style={{fontSize:16, color:"#777", fontWeight:"bold"}}>New Testament  </Text>
                            <Feather name={isNTCollapsed ? "chevron-down" : "chevron-up"} size={20} color="#777" />
                        </View>
                    </Pressable>
                    
                    
                    <Collapsible collapsed={isNTCollapsed}>

                        <View style={{maxHeight:windowHeight*0.35}}>
                            
                            {TestamentElements(false)}

                        </View>
                    
                    </Collapsible>


                </View>

                <View style={{width:"100%", alignItems:"center"}}>
                    <Text style={{fontSize:16, color:"#999"}} onPress={() => {props.openBookModal(true, false)}}>Cancel</Text>
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

export default BookRefModal;