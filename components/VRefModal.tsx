import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import {BookChoice, ChapterChoice, VerseChoice, } from '../store';
import {NoOfVersesInChapter} from '../store';
import BlueArrow from './BlueArrow';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const VRefModal = observer((props) => {
            
    const setColorArrayChoice =  (index) => {
        var newColorArray = [...props.verseColorArray2];
        newColorArray[index] = !newColorArray[index];
        props.setVerseColorArray2(newColorArray);
        //console.log("VrefModal versecolorArray: " + [...verseColorArray.array])
    };
        
    const addRemoveVerse = action( (item) => {
        var newVerseArray = [...VerseChoice.Verse];
        if(newVerseArray.includes(item)) {
            newVerseArray.splice(newVerseArray.indexOf(item), 1);
        } else {
            newVerseArray.push(item);
        }
        newVerseArray.sort( (a,b) => a-b );
        VerseChoice.Verse = [...newVerseArray];
        //console.log("new verse array: " + newVerseArray);
    });

    const selectV = (item, index) => {
        setColorArrayChoice(index);
        addRemoveVerse(item);
    };

    const verseElements = () => {

        //if(verseColorArray.array.length === 0) {return};
        if(props.verseColorArray2 === undefined) {return};
        //console.log([...verseColorArray.array]);

        var versesArray = []
        for(var i=0; i< NoOfVersesInChapter.count; i++) { 
            versesArray.push(i+1)
        };

        return (
            <ScrollView>
                <View style={{flexDirection:"row", flexWrap:"wrap", flex:1, justifyContent: NoOfVersesInChapter.count > 4 ? "space-between" : "flex-start" }}>
                    { versesArray.map( (item,index) => 
            
                        <Pressable  android_disableSound={true} onPress={ () => selectV(item, index) } key={index}>
                            <View style={{height:40, width:45, flex:1, borderWidth:1, borderColor:"#EEE", borderRadius:3, justifyContent:"center", alignItems:"center", padding:3, margin:3, backgroundColor:props.verseColorArray2[index] ? "#cce0ff" : "#FEFEFE", }}  >
                                <Text style={{fontSize:16, color:props.verseColorArray2[index] ? "#3A86FF" : "#AAA" }} >{item}</Text>
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

                <View style={{flex:1, maxHeight: 70, marginVertical:10, marginTop:0, flexDirection:"row", justifyContent:"space-between", alignItems:"center", }} >

                    <Ionicons name="arrow-back" size={30} color="#CCC" onPress={() => {props.openVModal(false, false); setTimeout(() => props.openChapterModal(false, true),800)}}/>

                    <View style={{alignItems:"center", maxWidth:windowWidth*0.4}}>
                        <View>
                            <Text style={{color:"#3A86FF", fontWeight:"bold", fontSize: 20, textAlign:"center"}}>Verse</Text>
                        </View>
                        <ScrollView style={{marginTop:7}} horizontal={true}>
                            <Text style={{fontSize:17, color:"#999", fontWeight:"bold"}}>{`${BookChoice.Book} ${ChapterChoice.Chapter}`}{VerseChoice.Verse.length === 0 ? "" : `:${VerseChoice.Verse}`}</Text>
                        </ScrollView>
                    </View>

                    <Pressable  android_disableSound={true} onPress={() => {
                            if(VerseChoice.Verse.length != 0) {
                            props.openVModal(true, false); 
                            setTimeout(() => props.openVersionModal(true, true),800)
                            } else {
                                {};
                            };
                    }}
                    >

                        <BlueArrow forwardArrowVisible={VerseChoice.Verse.length != 0} />

                    </Pressable>

                </View>

                <View style={styles.divisions}>
                </View>

                <View style={{marginTop:10, flex:1}}>
    
                    <View style={{maxHeight:windowHeight*0.3}}>
                    
                        {verseElements()}

                    </View>

                </View>

                <View style={{width:"100%", alignItems:"center"}}> 
                    <Text style={{fontSize:16, color:"#999"}} onPress={() => {props.openVModal(true, false)}}>Cancel</Text>
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

export default VRefModal;