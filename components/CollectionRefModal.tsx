import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import { Input } from 'react-native-elements';
import {observer} from 'mobx-react';
import {CollectionChoice, allCollectionsArray} from '../store';
import Collapsible from 'react-native-collapsible';
import BlueArrow from './BlueArrow';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const CollectionRefModal = observer((props) => {

    const [isCollapsed, setIsCollapsed] = useState(false);

    const initalForwardArrowOn = () => {
        var selectionMade = (CollectionChoice.Collection === null) ? false : true;
        return selectionMade;
    };
        
    const [forwardArrowVisible, setForwardArrowVisible] = useState(() => initalForwardArrowOn());

    const createCollectionArrayList = () => {
        var newCollection = [...allCollectionsArray];
        newCollection.push("+ New Collection");
        return newCollection;
    };

    const [collectionArrayList, setCollectionArrayList] = useState(() => createCollectionArrayList());

    const setColorArray = () => {
        var allFalse = [];
        for (let i=0; i <= collectionArrayList.length; i ++) {
            collectionArrayList[i] === CollectionChoice.Collection ? allFalse.push(true) : allFalse.push(false);
        };
        return allFalse;
    };

    const [choiceColor,setChoiceColor] = useState(setColorArray);

    const setColorArrayChoice = (index) => {
        var colorOnOff = [];
        for (let i=0; i <= collectionArrayList.length; i ++) {
            i === index ? colorOnOff.push(true) : colorOnOff.push(false);
        };
        setChoiceColor(colorOnOff);
    };

    const selectCollection = (item, index) => {
        setForwardArrowVisible(true);
        setColorArrayChoice(index);
        item === "+ New Collection" ? addNewCollection() : props.CollectionHandler(item);
    };

    const addNewCollection = () => {
        setIsCollapsed( (state) => !state );
    };

    const collectionElements = () => {
        
        return (
       
            <View style={{flex:1}}>

                {collectionArrayList.map( (item, index) =>
                    <Pressable  android_disableSound={true} onPress={ () => selectCollection(item, index) } key={item}>
                        <View style={{height:30, borderWidth:1, borderColor:"#EEE", borderRadius:3, justifyContent:"center", padding:3, paddingLeft:10, margin:3, backgroundColor:choiceColor[index] ? "#cce0ff" : "#FEFEFE"}}  >
                            <Text style={{fontSize:16, color:(choiceColor[index]) ? "#3A86FF" : "#AAA" }}>{item}</Text>
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

                    <Ionicons name="arrow-back" size={30} color="white" />

                    <Text style={{color:"#3A86FF", fontWeight:"bold", fontSize: 20, textAlign:"center"}}>Collection</Text>

                    <Pressable  android_disableSound={true} onPress={() => {
                            if(forwardArrowVisible) {
                            props.openCollectionModal(true, false); 
                            setTimeout(() => props.openBookModal(true, true),800)
                            } else {
                                {};
                            };}} 
                    >

                    <BlueArrow forwardArrowVisible={forwardArrowVisible} />

                    </Pressable>

                </View>

                <View style={styles.divisions} />

                <View style={{marginTop:10, flex:1}}>
                
                    <Collapsible collapsed={isCollapsed}>
    
                        <ScrollView>
                        
                            {collectionElements()}

                        </ScrollView>

                    </Collapsible>

                    <Collapsible collapsed={!isCollapsed}>

                        <Input
                            label="New Collection Name"
                            placeholder={"+ New Collection"} 
                            inputStyle={{fontSize:16}}
                            onChangeText={props.CollectionHandler}
                            value={CollectionChoice.Collection}
                        />

                        <View style={{flexDirection:"row", justifyContent:"center"}}>
                            <Text style={{margin:20, fontSize:16, color:"#3A86FF", fontWeight:"bold"}} 
                                onPress={() => {
                                    props.openCollectionModal(true, false); 
                                    setTimeout(() => props.openBookModal(true, true))
                                }}>OK
                            </Text>
                            <Text style={{margin:20, fontSize:16, color:"#999"}} onPress={addNewCollection}>Back</Text>
                        </View>
                    
                    </Collapsible>

                </View>

                <View style={{width:"100%", alignItems:"center"}}>
                    <Text style={{fontSize:16, color:"#999"}} onPress={() => {props.openCollectionModal(true, false)}}>Cancel</Text>
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

export default CollectionRefModal;