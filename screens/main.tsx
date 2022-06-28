import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, ImageBackground, Pressable } from 'react-native';
import Carousel from "../components/carousel";
import FaithVerses from "../components/FaithVerses";
import MenuButtonCollection from "../components/menuButtonCollection"
import { Entypo } from '@expo/vector-icons'; 
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import SpinMenu from "../components/menuButtonRotate";
import CollectionReturner from "../functions/createVersesArray";
import { useFocusEffect } from '@react-navigation/native';
import { NewVerseCreated, origin, VerseObject, Options, AutoPlayOn, NotificationVerse} from '../store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import notificationsCheck from '../functions/checkNotifications';
import PopUpNotifInitialise from "../components/PopUpNotifInitialise"
import { useIsDrawerOpen } from '@react-navigation/drawer';
import PopUpSupport from '../components/PopUpSupport';
import showSupport from '../functions/showSupport';
import SplashScreenFade from '../components/SplashScreenFade';
import UpdateActiveVerse from '../functions/UpdateActiveVerse';



var image; //= require(`../images/sunset.jpg`)

const background = () => {
    if(Options.Background=="sunset") {
        image = require(`../images/sunset.jpg`)
        return;
    }
    if(Options.Background=="beach") {
        image = require(`../images/beach.jpg`)
        return;
    }
    if(Options.Background=="blossom") {
        image = require(`../images/blossom.jpg`)
        return;
    }
    if(Options.Background=="clouds") {
        image = require(`../images/clouds.jpg`)
        return;
    }
    if(Options.Background=="cross") {
        image = require(`../images/cross.png`)
        return;
    }
    if(Options.Background=="colour") {
        image = require(`../images/cross.png`)
        return;
    }

    if(Options.Background=="soft") {
        image = require(`../images/soft.png`)
        return;
    }
    if(Options.Background=="mountains") {
        image = require(`../images/mountains.jpg`)
        return;
    }

    if(Options.Background=="stars") {
        image = require(`../images/stars.jpg`)
        return;
    }
    if(Options.Background=="texture") {
        image = require(`../images/texture.jpg`)
        return;
    }
    if(Options.Background=="wave") {
        image = require(`../images/wave.jpg`)
        return;
    }
}

    
const Main = observer( ({navigation}) => {

    background();

    const gotoEditScreen = () => {
        origin.origin = "main";
        stopSounds();
        navigation.navigate('Edit')
    };
    

    const [activeCollection, setActiveCollection] = useState(["Identity"]);
    const [collectionMenuOpen, setCollectionMenuOpen] = useState(true);
    const [faithVersesOpen, setFaithVersesOpen] = useState(true);
    const [carouselItems, setCarouselItems] = useState([]);
    const [displayCarousel, setDisplayCarousel] = useState(false);
    const [displayComplete, setDisplayComplete] = useState(false);
    const [popUpVisible, setPopUpVisible] = useState(false);
    const [notificationCheckRun, setNotificationCheckRun] = useState(false);
    const [popUpSupportTextOption, setPopUpSupportTextOption] = useState(0)
    const [popUpSupportVisible, setPopUpSupportVisible] = useState(false)
    const [collectionCounter, setCollectionCounter] = useState(0);
    const [ffsound, setFFsound] = useState({});
    const [autoPlayOn, setAutoPlayOn] = useState(false);
    const [optionsObject, setOptionsObject] = useState({
            FontSize: Options.FontSize,
            Opacity: Options.Opacity,
            FontFamily: Options.FontFamily,
            Background: Options.Background,
            Overlay: Options.Overlay,
            ColorChoice: Options.ColorChoice,
    });
    const [carouselKey, setCarouselKey] = useState(0);
    const [overlayKey, setOverlayKey] = useState(0);
    const [colorChoiceKey, setColorChoiceKey] = useState(0);
    const [oneSound, setOneSound] = useState({});
    const [shouldShowNotiPopUp, setShouldShowNotiPopUp] = useState(false);


    const loaded = () => {
        setDisplayComplete(true);
        //console.log("display complete")
        if(!notificationCheckRun) notificationsCheckIn()
    }
    
    const notificationsCheckIn = async() => {
        var notificationsStatus = await notificationsCheck();
        console.log(notificationsStatus);
        if(notificationsStatus == "Notifications not initialised") {
            setShouldShowNotiPopUp(true);
        }
        setNotificationCheckRun(true);
    }

    const visibleOn = () => {
        if(popUpSupportVisible) return;
        setPopUpVisible( true );
    }

    const visibleOff = () => {
        setPopUpVisible( false );
    }

    const togglePopUpSupportOn = () => {
        setPopUpSupportVisible(state => !state)
    }

    const goToNotifications = () => {
        navigation.navigate('Notifications')
    }

    useFocusEffect( React.useCallback(() => {
        if(origin.origin == "options"){

            if(optionsObject.FontSize != Options.FontSize) {
                setCarouselKey( state => state +1);
            }
            
            if(optionsObject.Opacity != Options.Opacity) {
                setCarouselKey( state => state +1);
            }

            if(optionsObject.FontFamily != Options.FontFamily) {
                setCarouselKey( state => state +1);
            }

            if(optionsObject.Background != Options.Background) {
                background()
            }

            if(optionsObject.Overlay != Options.Overlay) {
                setOverlayKey( state => state +1);
            }

            if(optionsObject.ColorChoice != Options.ColorChoice) {
                setColorChoiceKey( state => state +1);
            }
        }

        if(NewVerseCreated.New) {
            //console.log("running new verse created");
            newVerseRun();
        }
       // console.log(JSON.stringify(Options))
        origin.origin = "drawer";
        return () => {
        stopSounds()
        }
    },[]));


    const stopSounds = async() => {
        try {
        await ffsound.stopAsync();
        await ffsound.unloadAsync();
        } catch (e) {
           // console.log("trying to unload sounds" + e)
        }
        try {
        await oneSound.stopAsync();
        await oneSound.unloadAsync();
        } catch (e) {
           // console.log("trying to unload sounds" + e)
        }
        setAutoPlayOn(false);
        autoPlayswitch(false);
    }

    const autoPlayswitch = action((state) => {AutoPlayOn.On = state})

    const newVerseRun = async () => {
        await newCollectionHandler(VerseObject.Collection, true);
        await UpdateNewVerseCreated();
    }

    const UpdateNewVerseCreated = action (() => NewVerseCreated.New =false); 

    const newCollectionHandler = async (value, reshuffle = false) => {
    // console.log("newCollectionHandler calling populate verses")
        setActiveCollection([value]);
        await populateVerses([value], reshuffle);
        storeData("LastCollection", value)
        setCollectionCounter(state => state+1)
        try{
            ffsound.stopAsync();
            ffsound.unloadAsync();
            setAutoPlayOn(false);
            autoPlayswitch(false);
        } catch (e) {
           // console.log("changing collection sound stop: " + e);
        }
        if(collectionCounter == 3) {setTimeout(()=>displaySupportPopUp(), 3000) }
        if(collectionCounter == 5 && shouldShowNotiPopUp) {setTimeout(visibleOn, 4000) }
        
    };

    const displaySupportPopUp = async () => {
        const support = await showSupport();
        if( support["showSupport"] ) {
            setPopUpSupportTextOption(support["textOption"]);
            togglePopUpSupportOn();
        }
    }
    
    const storeData = async (key, value) => {
        try {
          await AsyncStorage.setItem(key, value)
        } catch (e) {
          console.log("saving lastcollection error: " + e)
        }
    }

    const getCollection = async () => {
      //  console.log("getCollection calling populate verses")
        try {
          const value = await AsyncStorage.getItem("LastCollection")
          if(value !== null) {
         //   console.log("retrieved previous collection: " + value)
            setActiveCollection([value])
           await populateVerses([value]);
          } else {
            setActiveCollection(["Loved"]);
            await populateVerses(["Loved"]);
          }
        } catch(e) {
          console.log("error fetching lastcollection: " + e)
          setActiveCollection(["Loved"]);
          await populateVerses(["Loved"]);
        }
        setDisplayCarousel(true);
    };

    useEffect( () => {
        setNotificationClickedVerse();
    }, [NotificationVerse.Key]);

    const setNotificationClickedVerse = async() => {
        setActiveCollection([NotificationVerse.Collection]);
        await populateVerses([NotificationVerse.Collection], true);
        //setNotificationInfo();
    };

    if(displayCarousel == false) {
        if(NotificationVerse.Collection != "") {
            setNotificationClickedVerse();
        } else {
        getCollection();
        }
    };


    const toggleCollapsibles = () => {
        if (collectionMenuOpen) {
            toggleCollectionMenuOpen();
            setTimeout(toggleFaithVersesOpen, 600);
        } else {
            toggleFaithVersesOpen();
            setTimeout(toggleCollectionMenuOpen, 600);
        }
    };

    const toggleCollectionMenuOpen = () => {
        setCollectionMenuOpen( state => !state);
    };

    const toggleFaithVersesOpen = () => {
        setFaithVersesOpen( state => !state);
    };

    const toggleDrawerOpen = () => {
        navigation.toggleDrawer();
    };


    const isDrawerOpen = useIsDrawerOpen();

    React.useEffect(() => {
        stopSounds()
    }, [isDrawerOpen])

    const populateVerses = async (collectionSelected, reshuffle = false) => {
        //console.log("updating active verse from populateVerses")
        try{
       
            var Array = await CollectionReturner(collectionSelected);
            var activeVerses = Array.filter( x => x.Display == true);
            if(activeVerses.length == 0) {
                activeVerses = ["None"]
            } else {
            UpdateActiveVerse(activeVerses[0])
            }
            setCarouselItems(activeVerses);
        } catch (e) {
            console.log("populateVerses error: " + e)
        }
        if(reshuffle) {
            versesReshuffle(activeVerses)
        }
    };


    const versesReshuffle = (verseArray) => {
        
        const theKey = NotificationVerse.Key != "" ? NotificationVerse.Key : VerseObject.Key

        console.log("running versesReshuffle", theKey, NotificationVerse.Collection)

        try{
        var versesTemp = [...verseArray];
        const keysTemp = verseArray.map( x => x.Key);
        const index = keysTemp.indexOf(theKey);
        var newVerse;
        if(index>=0){
        newVerse = verseArray.slice(index,index+1);
        versesTemp.splice(index,1);
        //console.log("spliced verse: " + newVerse);
        
        versesTemp.unshift(...newVerse);
        }
        setCarouselItems(versesTemp);
       // console.log("active verse object update from versesReshuffle")
       // console.log("activeverse: " + JSON.stringify(newVerse))
        UpdateActiveVerse(versesTemp[0])
        } catch (e) {
            console.log("versesreshuffle error: " + e)
        }
    }


    return (
  
        <View style={styles.screen}>
            
            <ImageBackground source={image} style={styles.image}>

            { !displayComplete &&
            <Pressable  android_disableSound={true} style={{position:"absolute", width:"100%", height:"100%", zIndex:10, flex: 1, alignItems: 'center', justifyContent: 'center'}} onPress={() => setDisplayComplete(true)}>
                    <SplashScreenFade loaded={loaded} />
            </Pressable>
            }

            <LinearGradient
                colors={Options.Background == "colour" ? [`hsl(${Options.ColorChoice[0]},${Options.ColorChoice[1]}%,${Options.ColorChoice[2]}%)`, 
                                                            `hsl(${Options.ColorChoice[0]},${Options.ColorChoice[1]}%,${(100-Options.ColorChoice[2])*0.3+Options.ColorChoice[2]}%)`, 
                                                            `hsl(${Options.ColorChoice[0]},${Options.ColorChoice[1]}%,${Options.ColorChoice[2]}%)`] :
                ["rgba(0,0,0,0)", "rgba(0,0,0,0)"]}
                start={[0.4, 0]}
                end={[0.6,1]}
                style={{flex:1}}
                key={colorChoiceKey}
            > 
             
                <View style={{backgroundColor:`rgba(255,255,255,${Options.Overlay})`, flex:1}} key={overlayKey}>  

                    <View style={{position:"absolute", left: 20, top:30}}>
                        <SpinMenu toggleDrawerOpen={toggleDrawerOpen} />
                    </View>


                    <View style={styles.CarouselView}>
                        {displayCarousel && <Carousel collection = {activeCollection} key={carouselKey} settingsButton={gotoEditScreen} carouselItems={carouselItems} ffsound={ffsound} setFFsound={setFFsound} oneSound={oneSound} setOneSound={setOneSound} autoPlayOn={autoPlayOn} setAutoPlayOn={setAutoPlayOn}/>}
                    </View> 


                    <TouchableOpacity onPress={toggleCollapsibles} style={{height:40, marginBottom:10, width:"100%", alignItems: 'center', justifyContent: 'center', flexDirection: "row"}}>
                    <LinearGradient
                    colors={['rgba(255,255,255,0.1)','rgba(255,255,255,0.8)','rgba(255,255,255,0.9)','rgba(255,255,255,0.8)','rgba(255,255,255,0.1)', ]} style={{width:"100%", height:30,alignItems: 'center', justifyContent: 'center', flexDirection: "row"}}
                    start={[0,0.5]} end={[1,0.5]}>
                    <Text style={{fontSize:16, color:"#999", fontWeight:"bold"}}>Active Collection: </Text>
                    <Text style={{fontSize:16, color:"#3A86FF", fontWeight:"bold"}}> {activeCollection}  </Text>
                    <Entypo name={collectionMenuOpen ? "chevron-thin-down" : "chevron-thin-up"} size={20} color="#999" />
                    </LinearGradient>
                    </TouchableOpacity>

                     <View style={{flex:4, marginBottom:10,}}>
                    
                        {!collectionMenuOpen && <Animatable.View 
                        animation={"fadeInUp"} 
                        iterationCount={1} 
                        direction="alternate" 
                        style={{flex:1}}
                        duration={800}
                        >
   
                            <View style={{margin:10, flex:1,}}>
                                <ScrollView>
                                    <MenuButtonCollection ButtonClick = {newCollectionHandler} activeCollection={activeCollection}/>
                                </ScrollView>
                            </View>
                            
                        </Animatable.View> }

                        {collectionMenuOpen && <FaithVerses /> }
                
                    </View> 
                        
                </View>
                {/* </View> */}
                </LinearGradient>

                <PopUpNotifInitialise toggleVisible={visibleOff} goToNotifications={goToNotifications} popUpVisible={popUpVisible} />
                <PopUpSupport toggleVisible={togglePopUpSupportOn} popUpVisible={popUpSupportVisible} textOption={popUpSupportTextOption}/> 
                
            </ImageBackground> 

        </View>

    );
});

Main.navigationOptions = {
    headerShown:false,
};

const styles =StyleSheet.create({

    screen: {
        flex: 1,
        alignItems: "flex-start",
        width:"100%",
        justifyContent: "flex-start",
    },
   
    image: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },

    CarouselView: {
        flex:12,
        marginTop: 40,
        justifyContent: "flex-start",
        alignItems: "flex-start"
    },

    CollectionButtons: {
        flex:4,
        justifyContent: "center",
        marginTop: -10,
    },

    FaithVerseContainer: {
        flex: 4,
        justifyContent: "center",
    },

})

export default Main;