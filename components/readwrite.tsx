import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, Keyboard, Pressable, ScrollView, Alert} from 'react-native';
import {Card, Button, Input,  } from 'react-native-elements';
import Verses from "../assets/verses";
import { AntDesign } from '@expo/vector-icons'; 
import PlayVerse from '../components/PlayVerse';
import ToggleSwitch from '../components/ToggleSwitch';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Entypo, Feather, MaterialIcons } from '@expo/vector-icons'; 
import PopUp from "./PopUp";
import { ActiveVerseObject, ChapterChoice, BookChoice, Verse, VerseChoice, VersionChoice, showCardTitle2, VerseObject, CollectionChoice, origin, NewVerseCreated} from '../store';
import {observer} from "mobx-react";
import {action} from "mobx";
import CollectionRefModal from './CollectionRefModal';
import BookRefModal from './BookRefModal';
import ChapterRefModal from './ChapterRefModal';
import VRefModal from './VRefModal';
import VersionRefModal from './VersionRefModal';
import APIRefModal from './APIRefModal';
import * as Animatable from 'react-native-animatable';
import saveData from '../functions/savaData';
import RecorderBar from './RecorderBar';
import { Foundation } from '@expo/vector-icons'; 
import Collapsible from 'react-native-collapsible';
import saveAudioFile from '../functions/saveAudioFile';
import { Dimensions} from 'react-native';


const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const collectionListDrop = [... new Set(Verses.map((i, x) => i.Collection))];
const collectionListIdDrop = collectionListDrop.map( (i,x) => i).filter( x => typeof(x) === "string");       
              
const editVerse = observer( (props) => {
  
    const [popUpVisible, setPopUpVisible] = useState(false);
    const [collectionModalVisible, setCollectionModalVisible] = useState(false);
    const [bookModalVisible, setBookModalVisible] = useState(false);
    const [chapterModalVisible, setChapterModalVisible] = useState(false);
    const [vModalVisible, setVModalVisible] = useState(false);
    const [versionModalVisible, setVersionModalVisible] = useState(false);
    const [APIModalVisible, setAPIModalVisible] = useState(false);
    const [slideForward, setSlideForward] = useState(true);
    const [chapterColorArray2, setChapterColorArray2] = useState([]);
    const [verseColorArray2, setVerseColorArray2] = useState([]);
    const [recordingBarOpen, setRecordingBarOpen] = useState(false);
    const [playingSound, setPlayingSound] = useState(false);
    const [recorderBarKey, setRecorderBarKey] = useState(0);


    const setUpElement = action( () => {

       // console.log("set up element run" + ActiveVerseObject.Object["Key"]+" " +props.origin )
        if((ActiveVerseObject.Key != "") && origin.origin == "main") {
                        
            VerseObject.Key = ActiveVerseObject["Key"];
            VerseObject.Collection = ActiveVerseObject["Collection"];
            VerseObject.Book = ActiveVerseObject["Book"];
            VerseObject.Chapter = ActiveVerseObject["Chapter"];
            VerseObject.V = [...ActiveVerseObject["V"]];
            VerseObject.Version = ActiveVerseObject["Version"];
            VerseObject.Verse = ActiveVerseObject["Verse"];
            VerseObject.Personalise = ActiveVerseObject["Personalise"];
            VerseObject.Audio = ActiveVerseObject["Audio"];
            VerseObject.Deleteable = ActiveVerseObject["Deleteable"];
            VerseObject.Display = ActiveVerseObject["Display"];
            VerseObject.Favourite = ActiveVerseObject["Favourite"];
            CollectionChoice.Collection = ActiveVerseObject["Collection"];
            BookChoice.Book = ActiveVerseObject["Book"];
            ChapterChoice.Chapter = ActiveVerseObject["Chapter"];
            VerseChoice.Verse = [...ActiveVerseObject["V"]];
            VersionChoice.version = ActiveVerseObject["Version"];
            Verse.verse = ActiveVerseObject["Verse"];

        } else {
            nullVerse();

            CollectionChoice.Collection = null;
            BookChoice.Book = null;
            ChapterChoice.Chapter = null;
            VerseChoice.Verse = [];
            VersionChoice.version = VerseObject["Version"];
            Verse.verse = "";
        };   
    });

    const nullVerse = action(() => {
        VerseObject.Key = (Math.random() * 0xfffff * 1000000).toString(16);
        VerseObject.Collection = null;
        VerseObject.Book = null;
        VerseObject.Chapter = null;
        VerseObject.V = [];
        getVersionChoice();
        VerseObject.Verse = "";
        VerseObject.Personalise = "";
        VerseObject.Audio = "";
        VerseObject.Deleteable = true;
        VerseObject.Display = true;
        VerseObject.Favourite = false;
    });

    const getVersionChoice = async() => {
        try {
            const value = await AsyncStorage.getItem('VersionChoice')
            if(value != null) {
             setLastVersionChoice(value);
             //console.log("last Version Choice retrieved: " + value);
            } else {
            setLastVersionChoice("WEB");
            //console.log("last Version Choice null WEB set");
            }
        } catch(e) {
           // console.log("error fetching last version choice: " + e);
        } 
    }

    const setLastVersionChoice = action ( (value) => {
        VerseObject.Version = value;
    })
    
    useEffect( () => {
        //console.log("focused" + props.focused)
        setUpElement();
        setRecorderBarKey( state => state+1 );
    }, [props.focused]);

    const updateVerseObject = action( () => {
        
        VerseObject.Collection = CollectionChoice.Collection;
        VerseObject.Book = BookChoice.Book;
        VerseObject.Chapter = ChapterChoice.Chapter;
        VerseObject.V = VerseChoice.Verse;
        VerseObject.Version = VersionChoice.version;
        VerseObject.Verse = Verse.verse;
        VerseObject.Personalise = "";
        VerseObject.Audio = "";
        VerseObject.Deleteable = true;
        VerseObject.Favourite = false;

        //console.log(VerseObject);
        
    });

   
    useEffect(() => {
        Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
        Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

        // cleanup function
        return () => {
        Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
        Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
        };
    }, []);
    
    const [keyboardStatus, setKeyboardStatus] = useState(false);
    const _keyboardDidShow = () => setKeyboardStatus(true);
    const _keyboardDidHide = () => setKeyboardStatus(false);

    const cardTitle = action( () => {
        if( VerseObject.Collection === null) {
            showCardTitle2.visible = false;   
            return "New Verse"
        }; 
        if( VerseObject.V.length != 0 ) {
            showCardTitle2.visible = true; 
            return `${VerseObject.Collection}`
        };
        showCardTitle2.visible = false; 
        return `${VerseObject.Collection}`;   
    });

    const cardTitle2 = action( () => {
        const VerseTitle = `${VerseObject.Book} ${VerseObject.Chapter}:${VerseObject.V}`;
        return  VerseTitle;  
    });

    const CollectionHandler = action( (value) => {
        CollectionChoice.Collection = value;
    });

    const changeVerseHandler = action( (item) => {
        Verse.verse = item;
        VerseObject.Verse = item;
    });

    const changePersonaliseHandler = action( (item) => {
        VerseObject.Personalise = item;
    });

    const copyPersonaliseHandler = action( () => {
        VerseObject.Personalise = `${Verse.verse}`;
    });

    const changeDisplayHandler = action( () => {
        VerseObject.Display = !VerseObject.Display;
    });

    const deleteButtonHandler = action( () => {
        nullVerse();
        CollectionChoice.Collection = null;
        BookChoice.Book = null;
        ChapterChoice.Chapter = null;
        VerseChoice.Verse = [];
        VersionChoice.version = "WEB";
        Verse.verse = "";
    });
 
    const checkCollectionCompleted = async () => {
        if (VerseObject.Collection === null) {
            Alert.alert(
            "Collection not completed",
                    "Please select a collection for the verse.",
                    [
                      { text: "OK" }
                    ],
                    { cancelable: false }
                  );
        } else {
            UpdateNewVerseCreated();
            await saveAudioFile(VerseObject.Audio)
            saveData(setPopUpVisible);
        };
    };

    const UpdateNewVerseCreated = action (() => NewVerseCreated.New =true); 
    
    const switchVisible = () => {
        setPopUpVisible(popUpVisible => !popUpVisible); 
    };

    const openCollectionModal = (slideForward, collectionModal) => {
        setSlideForward(slideForward);
        setCollectionModalVisible(collectionModal);
    };

    const openBookModal = (slideForward, bookModal) => {
        setSlideForward(slideForward);
        setBookModalVisible(bookModal)
    };

    const openChapterModal = (slideForward, chapterModal) => {
        setSlideForward(slideForward);
        setChapterModalVisible(chapterModal)
    };

    const openVModal = (slideForward, vModal) => {
        setSlideForward(slideForward);
        setVModalVisible(vModal)
    };

    const openVersionModal = (slideForward, versionModal) => {
        setSlideForward(slideForward);
        setVersionModalVisible(versionModal)
    };

    const openAPIModal = (slideForward, APIModal) => {
        setSlideForward(slideForward);
        setAPIModalVisible(APIModal)
    };

    const exitBack = () => {  
        props.goBack();
    };

    const openRecordingBar = () => {
        setRecordingBarOpen( state => !state)
    };
    
    return (

        <SafeAreaView style={{ flex:1,backgroundColor:"#3A86FF", height:deviceHeight, width:deviceWidth}}>
        <Pressable  android_disableSound={true} onPress={Keyboard.dismiss} style={{backgroundColor:"white", height:deviceHeight, flex:1, width:"100%"}}>
        <ScrollView style={{backgroundColor:"white", width:"100%"}} persistentScrollbar={true}>

            {/* CARD */}

            <View style={{flex:1, alignItems:"center", width:"100%", backgroundColor:"white",}} >
                
                {/* CARD HEADER */}
                
                <View style={{height:100, flex:1, width:"100%", flexDirection: "row", alignItems:"center", justifyContent:"space-between",  marginHorizontal:0, paddingRight:10, paddingVertical:10, paddingTop:20, backgroundColor: VerseObject.Display ? "hsl(217,100%,61%)" : "#666"}}>
                    
                    <View style={{flex:7, alignItems:"flex-start", paddingLeft:20, justifyContent:"flex-start"}}>
                        <Pressable onPress={() => {openCollectionModal(true, true)}}>
                        <View style={{marginBottom:-20}}><Card.Title style={{textAlign:"left", color:"white", fontSize:28, fontWeight:"bold"}}>{cardTitle()}</Card.Title></View>
                        { showCardTitle2.visible && <View style={{marginBottom:-15}}><Card.Title style={{textAlign:"left", color:"white", fontSize:18}}>{cardTitle2()}</Card.Title></View>}
                        </Pressable>
                    </View>

                    <View style={{flex:1, alignItems:"center", justifyContent:"center",   height:50, width:60, paddingTop:10,  borderRadius:10 }}>
                        
                        {VerseObject.Collection != null &&
                        <AntDesign name="edit" size={27} color="white" onPress={() => {openCollectionModal(true, true)}} />
                        }

                        {VerseObject.Collection == null &&
                            <Animatable.View 
                            animation="slideInRight" 
                            iterationCount={1} 
                            iterationDelay={1000}  
                            style={{flex:1}}
                            >
                            <AntDesign name="edit" size={27} color="white" onPress={() => {openCollectionModal(true, true)}} />
                            </Animatable.View> 
                        }
                        
                    </View>
                </View>
                
                {/* CARD BODY */}
                
                <View style={{marginHorizontal:10, width:deviceWidth, paddingHorizontal:10}}>
                    
                    {/* INPUT ONE */}

                    <View style={{width:"100%" }}>

                        <View style={{padding:10, marginTop:10}} >
                            <Text style={{fontSize:16, color:"#777", fontWeight:"bold"}}>Verse</Text>
                        </View>

                        
                        <View style={{width:"100%"}}>    
                            <Input
                            placeholder="For God so loved the world..."
                            onChangeText={changeVerseHandler}
                            multiline={true}
                            numberOfLines={4}
                            inputStyle={{fontSize:18, color:"#777", width:"100%", flex:1}}
                            inputContainerStyle={{ borderColor:"white"}}
                            textAlignVertical="top"
                            value={`${VerseObject.Verse}`}
                            />
                        </View>

                    </View>

                    {/* INPUT TWO */}

                    <View style={{borderColor:"hsl(217,0%,89%)", borderWidth:1, marginHorizontal:5, marginVertical:5}}/>


                    <View style={{width:"100%" }}>    
                    
                        <View style={{width:"100%", flexDirection:"row", justifyContent:"space-between", alignItems:"center" }}>

                            <View style={{padding:10}} >
                                <Text style={{fontSize:16, color:"#777", fontWeight:"bold"}}>Personalised</Text>
                            </View>

                            <Button
                            icon={
                                <MaterialIcons name="content-copy" size={30} color="#3A86FF" />
                                // <AntDesign name="downsquare" size={30} color="#3A86FF" />
                            }
                            type="clear"
                            onPress={copyPersonaliseHandler}
                            title="copy  "
                            titleStyle={{fontSize:16, fontWeight:"600", color:"#3A86FF"}}
                            iconRight={true}
                            />

                        </View>

                        <Input
                        placeholder="For God so loves me..."
                        multiline={true}
                        numberOfLines={4}
                        textAlignVertical="top"
                        onChangeText={changePersonaliseHandler}
                        inputStyle={{fontSize:18, color:"#777"}}
                        inputContainerStyle={{ borderColor:"white"}}
                        value={VerseObject.Personalise}
                        />     

                    </View>

                </View>

                {/* BUTTON GROUP */}

                <View style={{borderColor:"hsl(217,0%,89%)", borderWidth:1, marginHorizontal:15, marginVertical:5}}/>

                <View style={{borderColor:"hsl(217,10%,95%)", borderWidth:2, alignItems:"center", flex:1, width:"95%", justifyContent:"center", marginHorizontal:10}}>

                    <Collapsible collapsed={recordingBarOpen} style={{width:"90%"}}>
        
                    <View style={{flex:1, flexDirection:"row", alignItems:"center", marginBottom: 10, marginTop:10, width:"100%"}}>   
                        <View style={styles.ControlsBox}><Text style={styles.TextLabels}>Audio</Text></View>
                        <View style={styles.ControlsBox}><Text style={styles.TextLabels}>Record</Text></View>
                        <View style={styles.ControlsBox}><Text style={styles.TextLabels}>Active</Text></View>
                        <View style={styles.ControlsBox}><Text style={styles.TextLabels}>Clear</Text></View>
                    </View>

                    <View style={{flexDirection:"row", alignItems:"center", height: 50}}>   
                        <View style={styles.ControlsBox}><PlayVerse origin={"edit"} setPlayingSound={setPlayingSound} playingSound={playingSound}/></View>
                        <View style={styles.ControlsBox}>
                            <View style={{flex: 1, justifyContent: 'center', padding: 10, height: 50,}}>
                                <Button
                                    icon={ <Foundation name={"microphone"} size={30} color="#3A86FF" />}
                                    type="clear"
                                    onPress={()=>openRecordingBar()}
                                />
                            </View>
                                {/* <RecordVerse setFilePath = {changeAudioHandler} /> */}
                        </View>
                        <View style={styles.ControlsBox}><ToggleSwitch isActive = {VerseObject.Display} setActive = {changeDisplayHandler}/></View>
                        <View style={styles.ControlsBox}><Button icon={ <Entypo name="squared-cross" size={30} color={ (VerseObject.Deleteable) ? "#c73f36" : "#DDD"} /> } type="clear" disabled={!VerseObject.Deleteable} onPress={deleteButtonHandler} /></View>        
                    </View>

                    </Collapsible>

                    <Collapsible collapsed={!recordingBarOpen}>
                        <View style={{margin:10}}>
                            <RecorderBar openRecordingBar={openRecordingBar} origin={"edit"} setPlayingSound={setPlayingSound} playingSound={playingSound} key={recorderBarKey}/>
                        </View>
                    </Collapsible>
    
                </View>

                <View style={{borderColor:"hsl(217,0%,89%)", borderWidth:1, marginHorizontal:15, marginVertical:5}}/>

                <View style={{flex:1, flexDirection:"row", justifyContent: "center", alignItems:"center", marginTop: 20,}}>
                    <Button
                    icon={<Feather name="save" size={24} color="#3A86FF" />}
                    buttonStyle={{borderRadius: 5, backgroundColor:"#FFF", marginLeft: 10, marginRight: 10, marginBottom: 10, width:120, borderColor:"hsl(217,100%,71%)", borderWidth:2}}
                    title='  Save'
                    type="outline"
                    onPress={checkCollectionCompleted} />
                    <Button
                    icon={<MaterialIcons name="cancel" size={24} color="#c73f36" />}
                    buttonStyle={{borderRadius: 5, backgroundColor:"#FFF", marginLeft: 10, marginRight: 10, marginBottom: 10, width:120, borderColor:"hsl(217,100%,71%)", borderWidth:2}}
                    title='  Cancel'
                    type="outline"
                    onPress={exitBack} />
                </View>

            </View>

            
            <PopUp buttonPress={props.goBack} popUpVisible={popUpVisible} switchVisible={switchVisible}/>
            
            <CollectionRefModal 
            collectionListIdDrop={collectionListIdDrop} 
            CollectionHandler={CollectionHandler} 
            modalVisible={collectionModalVisible}
            openCollectionModal={openCollectionModal}
            openBookModal={openBookModal}
            slideForward={slideForward}
            />

            <BookRefModal 
            collectionListIdDrop={collectionListIdDrop} 
            CollectionHandler={CollectionHandler} 
            modalVisible={bookModalVisible}
            openCollectionModal={openCollectionModal}
            openBookModal={openBookModal}
            openChapterModal={openChapterModal}
            slideForward={slideForward}
            setVerseColorArray2={setVerseColorArray2}
            setChapterColorArray2={setChapterColorArray2}
            verseColorArray2={verseColorArray2}
            chapterColorArray2={chapterColorArray2}
            />  

            <ChapterRefModal 
            CollectionHandler={CollectionHandler} 
            modalVisible={chapterModalVisible}
            openBookModal={openBookModal}
            openChapterModal={openChapterModal}
            openVModal={openVModal}
            slideForward={slideForward}
            setVerseColorArray2={setVerseColorArray2}
            setChapterColorArray2={setChapterColorArray2}
            verseColorArray2={verseColorArray2}
            chapterColorArray2={chapterColorArray2}
            /> 

            <VRefModal  
            modalVisible={vModalVisible}
            openChapterModal={openChapterModal}
            openVModal={openVModal}
            openVersionModal={openVersionModal}
            slideForward={slideForward}
            setVerseColorArray2={setVerseColorArray2}
            verseColorArray2={verseColorArray2}
            /> 

            <VersionRefModal 
            modalVisible={versionModalVisible}
            openVModal={openVModal}
            openVersionModal={openVersionModal}
            openAPIModal={openAPIModal}
            slideForward={slideForward}
            />

            <APIRefModal 
            modalVisible={APIModalVisible}
            openAPIModal={openAPIModal}
            openVersionModal={openVersionModal}
            slideForward={slideForward}
            changeVerseHandler={changeVerseHandler}
            updateVerseObject={updateVerseObject}
            />             

        </ScrollView>
        </Pressable>                                  
        </SafeAreaView>

    );

});

const styles = StyleSheet.create({
    TextLabels: {
        color:"#777", 
        fontWeight:"bold", 
        fontSize: 16
    },

    ControlsBox: {
        flex:2, 
        justifyContent: "center", 
        alignItems: "center",
    },
    
    modalBackdropOn: {
        backgroundColor: "black",
        opacity: 0.7,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        
    },

    modalBackdropOff: {
        backgroundColor: "black",
        opacity: 0.7,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
    },

});

export default editVerse;