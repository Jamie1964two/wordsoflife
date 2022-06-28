import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Text, View, SafeAreaView, StyleSheet, Pressable } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { Card, Button } from 'react-native-elements';
import {deviceWidth} from "../constants/screendimensions"; 
import { ScrollView } from 'react-native-gesture-handler';
import PlayVerse from '../components/PlayVerse'; 
import { Entypo } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { CustomText } from "../components/CustomText";
import {observer} from 'mobx-react';
import {action} from 'mobx';
import { ActiveVerseObject, ActiveCarouselIndex,  PlayButtonEnabled,  VerseObject, Options, AutoPlayOn} from '../store';
import { Ionicons } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons';
import saveData from '../functions/savaData';
import * as Animatable from 'react-native-animatable';
import UpdateActiveVerse from '../functions/UpdateActiveVerse'
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import { Audio } from 'expo-av';
import Sounds from '../assets/Sounds';
import * as WebBrowser from 'expo-web-browser';


const CarouselComponent = observer((props) => {

    const [verseButtonLabel, setVerseButtonLabel] = useState("Personalise");
    const [displayVerse, setDisplayVerse] = useState("Personalise");
    const [playingSound, setPlayingSound] = useState(false);
    const [heartsArray, setHeartsArray] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [errorlog, setErrorLog] = useState("");
   
    useEffect(() => {
        carouselRef.current.snapToItem(0);
        SetTheIndex(0);
        newHearts();
        PlayButtonToggle();
        if(props.carouselItems[0] == "None"){
            setDisabled(true)
        } else {
            setDisabled(false)
        };
        verseButtonCheck();
    }, [props.carouselItems]);

    const carouselRef = useRef(null);
    const color1 = "#3A86FF";
    const color2 = `rgba(255,255,255,${Options.Opacity})`;

    const [verseColor1, setVerseColor1] =useState(color1);
    const [verseColor2, setVerseColor2] =useState(color2);
    
    const verseButtonChanger = () => {
        if (displayVerse == "Verse") {
            setDisplayVerse("Personalise");
            setVerseButtonLabel(props.carouselItems[0].Collection == "Jesus" ? "Jesus is..." : "Personalise");
            setVerseColor1(color2);
            setVerseColor2(color1);
        } else {
            setDisplayVerse("Verse");
            setVerseButtonLabel("Verse")
            setVerseColor1(color1);
            setVerseColor2(color2);  
        }; 
    };

    const verseButtonCheck = () => {
        if (displayVerse == "Personalise") {
            setVerseButtonLabel(props.carouselItems[0].Collection == "Jesus" ? "Jesus is..." : "Personalise");
        }
    };

    const newHearts = () => {
        try{
        var heartArray = props.carouselItems.map( x => x.Favourite);
        setHeartsArray(heartArray);
        } catch (e) {
            console.log("error creating hearts array: " + e);
        }
    };

    const heartsChange = (index) => {
        var tempHearts = [...heartsArray];
        tempHearts[index] = !tempHearts[index];
        setHeartsArray(tempHearts);
        saveHearts(tempHearts[index]);
    };

    const saveHearts = action ( (fave) => {

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
        VerseObject.Favourite = fave;

        saveData(()=>{});

    })

    const switchAutoPlay = async () => {
        if (!AutoPlayOn.On) { 
            try {
                await props.oneSound.stopAsync();
                await props.oneSound.unloadAsync();
                setPlayingSound(false);
            } catch (e) {
                //console.log(e)
            }
            autoPlayswitch(true);
            var currentIndex = carouselRef.current.currentIndex;
            var noOfItems = props.carouselItems.length;
            activateKeepAwake(); 
            playVerseAdvance(currentIndex, noOfItems);
        } else {
           // console.log("switcing autoplay off")
           autoPlayswitch(false);
            try{
            await props.ffsound.stopAsync();
            await props.ffsound.unloadAsync();
            } catch (e) {
                //console.log(e)
            }
            deactivateKeepAwake(); 
        };
       
       
    };


    const stepForward = () => {
        var currentIndex = carouselRef.current.currentIndex;
        var noOfItems = props.carouselItems.length;
        (currentIndex === noOfItems - 1) ? currentIndex = 0 : currentIndex++;
        carouselRef.current.snapToItem(currentIndex);
    }


    async function playVerseAdvance(currentIndex, noOfItems) {

        if (props.carouselItems[currentIndex].Audio === "") {
            setTimeout(() => {                
                
                    if (AutoPlayOn.On) {
                        (currentIndex === noOfItems - 1) ? currentIndex = 0 : currentIndex++;
                        carouselRef.current.snapToItem(currentIndex);
                        playVerseAdvance(currentIndex, noOfItems)
                    };
                    
                }
        , 1000);
        } else {
            try {                
                await playAudio(props.setFFsound, setErrorLog, );
            } catch(e) {
                //setErrorLog( state => state + `\n` + e)
                //console.log(e);
            };
        };     
    };

    const autoPlayswitch = action((state) => {AutoPlayOn.On = state})

    const advanceAndPlay = () => {    
        if(AutoPlayOn.On) {
            var currentIndex = carouselRef.current.currentIndex;
            var noOfItems = props.carouselItems.length;
            (currentIndex === noOfItems - 1) ? currentIndex = 0 : currentIndex++;
            carouselRef.current.snapToItem(currentIndex);
            UpdateActiveVerse(props.carouselItems[currentIndex])
            //console.log("calling playverseadvance again")
            playVerseAdvance(currentIndex, noOfItems)
        }
    };
    
    const playAudio = async (setFFsound, setErrorLog) => {
    
        const onPlaybackStatusUpdate = async(PlayBackStatus) => {
        if (PlayBackStatus.didJustFinish) {
            console.log("just finished")
            //playingSound = false;
            //setPlayingSound(false);

            try{
                await soundObject.unloadAsync();    
            } catch (e) {
                //console.log("Error unloading sound " + e)
            }
            setTimeout(()=>advanceAndPlay(),500);
        };
        if (!PlayBackStatus.isLoaded) {
            setErrorLog( state => state + `\nSound loaded ok`)
            if (PlayBackStatus.error) {
            console.log(`Encountered a fatal error during playback: ${PlayBackStatus.error}`);
            // Send Expo team the error on Slack or the forums so we can help you debug!
            setErrorLog( state => state + `\nsound not loaded ${PlayBackStatus.error}` )
            }
        };
        };
        
        var audioLength;
    
        try {
        if(ActiveVerseObject["Audio"].match(/^[0-9]{3}_/)) {
            //console.log("sounds file: " + JSON.stringify(Sounds[ActiveVerseObject["Key"]]))
            var { sound: soundObject, status } = await Audio.Sound.createAsync(Sounds[ActiveVerseObject["Key"]]);
        } else { 
            var source = { uri: ActiveVerseObject["Audio"] };
            var { sound: soundObject, status } = await Audio.Sound.createAsync( source );
        }    
    
        setErrorLog( state => state + `\n${ActiveVerseObject["Audio"]}`)
    
        //const { sound: soundObject, status } = await Audio.Sound.createAsync( source );
        setFFsound(soundObject)
        audioLength = status;
        await soundObject.playAsync(); 
        //playingSound = true;
        //setPlayingSound(true);
        await soundObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
        
        } catch (err) {
       // setErrorLog( state => state + err)
        console.log("sound did not play" + err);
        }    
        //try {
        //setErrorLog( state => state + `Duration: ${audioLength.durationMillis}\n`)
        return (audioLength.durationMillis);
        //} catch (e) {
        //console.log(e)
        //}
    };
    
    const editButtonPress = () => {

        //console.log("updating active verse from editButtonPress")
        UpdateActiveVerse(props.carouselItems[ActiveCarouselIndex.Index])
        props.settingsButton();
    };

    var tempIndex=0;
 
    const SetTheIndex = action((value) => {ActiveCarouselIndex.Index = value});

    const PlayButtonToggle = action( () => {PlayButtonEnabled.On = (ActiveVerseObject["Audio"] != "") ? true : false;});
    
    const UpdateCarouselIndex = async() => {    //getTheIndex
        //console.log("updating active verse from UpdateCarouselIndex")
        try {
            tempIndex = await carouselRef.current.currentIndex;
            SetTheIndex(tempIndex);

            //console.log("updating active verse in updateCarouselIndex")
            UpdateActiveVerse(props.carouselItems[tempIndex])
            PlayButtonToggle();

            
        } catch(e) {
            // console.log("get the carousel index error: " + e)
            // console.log("carousel items index: " + ActiveCarouselIndex.Index)
            // console.log("carousel items current index: " + props.carouselItems[ActiveCarouselIndex.Index])
            // console.log("carousel items [0] index: " + props.carouselItems[0])
        }

    }

    const openWebLink = (book, chapter, verse, version) => {
        //const verseStr = JSON.stringify(...verse)
        WebBrowser.openBrowserAsync(`https://www.biblegateway.com/passage/?search=${book}+${chapter}%3A${verse}&version=${version}`);
        //console.log("open: " + `https://www.biblegateway.com/passage/?search=${book}+${chapter}%3A${verse}&version=${version}`)
    }


    const renderItem = ({item,index}) => {
         if (item == "None") {
            return (          
            <LinearGradient start={[0.3,0]} end={[0.6,1]} colors={[`rgba(255,255,255,${0.7*Options.Opacity})`,`rgba(255,255,255,${Options.Opacity})`, `rgba(255,255,255,${0.9*Options.Opacity})`]} style={{marginHorizontal: -3, borderRadius: 25, padding: 10, flex:1, justifyContent:"center", alignItems:"center", }} >
                <View style={styles.cardTitleContainer}>
                    <View style={{height:50, width:"100%", justifyContent:"center", alignItems:"center"}} >
                        <CustomText title={`No verses found`} h1 titlefont style={{color: "#AAA", textAlign:"center", fontSize: Options.FontSize}}/>
                    </View>
                </View>
            </LinearGradient>    
        )}; 

        return (

            //<View style={{marginHorizontal: -3, borderRadius: 25, padding: 10, backgroundColor:"white", flex:1, justifyContent:"center", alignItems:"center"}}> 
            <LinearGradient start={[0.3,0]} end={[0.6,1]} colors={[`rgba(255,255,255,${0.7*Options.Opacity})`,`rgba(255,255,255,${Options.Opacity})`, `rgba(255,255,255,${0.9*Options.Opacity})`]} style={{marginHorizontal: -3, borderRadius: 25, padding: 10, flex:1, justifyContent:"center", alignItems:"center", }} >
                <View style={styles.cardTitleContainer}>

                    <View style={{height:50, justifyContent:"center", width:"100%"}} >
                        <Pressable onPress={()=>openWebLink(item.Book, item.Chapter, item.V, item.Version)}>
                        <CustomText title={`${item.Book} ${item.Chapter}:${item.V}`} h4 titlefont style={{color: "hsl(217,10%,40%)", textAlign:"center", fontSize: Options.FontSize}}/>
                        </Pressable>
                    </View>

                    <View style={{position:"absolute", right:0, top:0}}>
                    {heartsArray[index] &&
                    <Animatable.View 
                        animation="fadeInDown" 
                        iterationCount={1} 
                        duration={800}
                        >
                    <Pressable  android_disableSound={true} style={{width:40, height:50, justifyContent:"center"}} onPress={ () => {heartsChange(index)} }>
                        <MaterialCommunityIcons name= {heartsArray[index] ? "heart-plus" : "heart-plus-outline"} size={heartsArray[index] ? 30 : 26} color={heartsArray[index] ? "hsl(334,100%,50%)" : "#BBB"} />
                    </Pressable>
                    </Animatable.View>
                    }

                    {!heartsArray[index] &&
                    <Pressable  android_disableSound={true} style={{width:40, height:50, justifyContent:"center"}} onPress={ () => {heartsChange(index)} }>
                        <MaterialCommunityIcons name= {heartsArray[index] ? "heart-outline" : "heart-plus-outline"} size={26} color={heartsArray[index] ? "hsl(217,100%,41%)" : "#BBB"} />
                    </Pressable>
                    }
                    </View>
                
                </View>

                <Card.Divider style={{height: 1, backgroundColor: "#555", width: "90%"}}/>

                <ScrollView style={{...styles.scroll, zIndex:2}}>
                    <CustomText title={item[displayVerse]} h1 style={{...styles.cardtext, fontFamily: Options.FontFamily, fontSize: Options.FontSize }} />
                    {/* <Text>{errorlog}</Text> */}
                </ScrollView> 

            </LinearGradient>    
        );
    };


    return (
          <SafeAreaView style={{paddingTop: 0, marginTop: 0, flex:1, alignItems:"center" }}>
            <View style={{ flexDirection:'row', justifyContent:'center', flex:5 }}>
                <Carousel
                ref={carouselRef}
                layout={'default'} 
                data={props.carouselItems}
                sliderWidth={deviceWidth}
                sliderHeight={deviceWidth*1.3}
                itemWidth={deviceWidth*0.8}
                renderItem={renderItem}
                activeSlideOffset={50}
                enableSnap={true}
                enableMomentum={false}
                lockScrollWhileSnapping={true}
                loop={false}
                onSnapToItem = {UpdateCarouselIndex}
                autoplay={false}
                autoplayInterval={5000}
                inactiveSlideScale={0.8}
                inactiveSlideOpacity={0.6}
                activeSlideAlignment={'center'} 
                lockScrollWhileSnapping={true}
                /> 
           </View>    

           <Pressable  android_disableSound={true} style={{position:"absolute", right:0, bottom: props.carouselItems.length < 7 ? 160: 100, width:51, height:70, justifyContent:"center", alignItems:"center", borderTopLeftRadius:15, borderBottomLeftRadius:15, backgroundColor:"rgba(255,255,255,0.7)"}}
            onPress={()=> stepForward()}>
                <Ionicons name="chevron-forward-circle-outline" size={40} color="rgba(55,55,55,0.5)" />
                <View >
                    <Text style={{color:"rgba(55,55,55,0.5)", fontSize:16}}>{ActiveCarouselIndex.Index+1}/{props.carouselItems.length}</Text>
                </View>
           </Pressable>

            {!disabled &&
           <View style={{...styles.buttonGroup, marginTop: props.carouselItems.length < 8 ? 10 : 0}}>
                <View style={{width:150, paddingHorizontal:10, height:45 }}>
                <Button
                    icon={ 
                        <FontAwesome name="refresh" size={20} fontWeight="bold" color= {verseColor2  == "#3A86FF" ? "#3A86FF" : "white"}/>
                    }
                    onPress={verseButtonChanger}
                    buttonStyle={{backgroundColor: verseColor1, height:45, borderRadius:10 }}
                    titleStyle= {{color: verseColor2 == "#3A86FF" ? "#3A86FF" : "white", fontWeight:"bold"}}
                    title={`  ${verseButtonLabel}`}
                    disabled={disabled}
                />
                </View>
            
                <View style={{...styles.buttonContainer, padding:0}}><PlayVerse origin={"main"} setOneSound={props.setOneSound} ffsound={props.ffsound} setAutoPlayOn={autoPlayswitch} playingSound={playingSound} setPlayingSound={setPlayingSound} /></View>
                <View style={styles.buttonContainer}><Ionicons name={AutoPlayOn.On ? "stop-outline" : "play-forward-outline"} size={35} color="#3A86FF" onPress={switchAutoPlay} fontWeight="bold"/></View>
                <View style={styles.buttonContainer}><Entypo name="new-message" size={30} color="#3A86FF" onPress={editButtonPress}  fontWeight="bold"/></View>

            </View>}
        
          </SafeAreaView>
    );
    
});

const styles = StyleSheet.create({

    scroll: {
        height: Math.floor(deviceWidth*0.4),
        paddingBottom: 10,
        marginBottom:5,
    },
    cardtext: {
        color: "#555",
        marginBottom: 5,
        fontSize: 22,
        textAlign: "center",
    },
    cardTitle: {
        color: "#666",
    },
    cardTitleContainer: {
        marginTop: 5,
        marginBottom: 10,
        width: "100%",
        alignItems: "center",
        flexDirection: "row",
        justifyContent:"space-between"
    },
    buttonGroup: {
        flexDirection: "row",        
        marginBottom:0,
        justifyContent: "center",
        alignItems: "center",
        flex:1,
    },

    buttonContainer: {
        
        justifyContent: 'center',
        backgroundColor: `rgba(255,255,255,${Options.Opacity})`,
        padding: 5,
        margin:5,
        width:45,
        height:45,
        alignItems:"center",
        borderRadius:10,
        
    },
    


});

export default CarouselComponent;