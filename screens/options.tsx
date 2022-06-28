import React, {useState, useEffect,} from 'react';
import { StyleSheet, Text, View, ImageBackground,  Pressable } from 'react-native';
import {CustomText} from "../components/CustomText";
import { Card, Button } from 'react-native-elements';
import {action} from "mobx";
import { Ionicons } from '@expo/vector-icons'; 
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Slider } from 'react-native-elements';
import { observer } from 'mobx-react-lite';
import { Options, origin } from '../store';
import PopUpColour from '../components/PopUpColour';



const optionsScreen = observer( ({navigation}) => {

  const [opacity, setOpacity] = useState(0.5);
  const [textSize, setTextSize] = useState(3);
  const [pic, setpic] = useState("beach");
  const [picArray, setPicArray] = useState([true,false,false,false,false,false,false,false,false,]);
  const [textfont, setTextFont] = useState("Handlee");
  const [textArray, setTextArray] = useState([true,false,false]);
  const [transparancy, setTransparancy]  = useState(0.5);
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [colorChoice, setColorChoice] = useState([217,30,91])

  const goBack = () => {
    navigation.goBack()
  };

  const makeColorChoice = (h,s,l) => {
    setColorChoice([h,s,l]);
  };
  
  const beach = require('../images/beach.jpg'); 
  const blossom = require('../images/blossom.jpg');
  const clouds = require('../images/clouds.jpg'); 
  const cross = require('../images/cross.png'); 
  const mountains = require('../images/mountains.jpg');
  const sunset = require('../images/sunset.jpg'); 
  const wave = require('../images/wave.jpg');
  const stars = require('../images/stars.jpg'); 
  const soft = require('../images/soft.png'); 
  const texture = require('../images/texture.jpg'); 

  const togglePicArray = (x) => {
    var array = [];
    for ( let i = 0; i<13; i++){
      i == x ? array.push(true) : array.push(false);
    };
    setPicArray(array);
  }

  const changeTextFont = (value, x) => {
    setTextFont(value);
    var array = [];
    for ( let i = 0; i<3; i++){
      i == x ? array.push(true) : array.push(false);
    };
    setTextArray(array);
  }

  const loadOptions = () => {
    setTextSize( Math.ceil(Math.sqrt((Options.FontSize-12)*100/36)) );
    setTransparancy(Options.Opacity);
    setTextFont(Options.FontFamily);
    setpic(Options.Background);
    setOpacity(Options.Overlay);
    setColorChoice(Options.ColorChoice);
  };

  useEffect( () => {
    loadOptions();
  },[]);

  const saveOptions = action( () => {
    Options.FontSize = Math.floor(12+textSize*textSize/100*36);
    Options.Opacity = 0.1 * transparancy;
    Options.FontFamily = textfont;
    Options.Background = pic;
    Options.Overlay = 0.1 * opacity;
    Options.ColorChoice = colorChoice;
  })

  const storeData = async () => {
    try {
      const jsonValue = JSON.stringify(Options)
      await AsyncStorage.setItem('Options', jsonValue)
    } catch (e) {
      console.log("error saving object: " + e)
    }
  }
  
  const saveAndExit = async() => {
    origin.origin = "options"
    saveOptions();
    await storeData();
    goBack();
  }

  const visibleOn = () => {
    setPopUpVisible( true );
  }

  const visibleOff = () => {
    setPopUpVisible( false );
  }

 
  const children = () => {
    return (
      <View style={{padding:20, paddingBottom:30, flex:1, justifyContent: "center",  width:"100%", backgroundColor:`rgba(255,255,255,${opacity*0.1})`}} >
      
        <View style={{justifyContent: "center",  width:"100%", flex:1}} >
        
          <View style={{flex:1, height:250, padding:10, margin:10, backgroundColor:`rgba(255,255,255,${transparancy*0.1})`, borderRadius:10}}>
            <CustomText title={`John 3:16`} titlefont style={{color: "#666", textAlign:"center", fontSize: Math.floor(12+textSize*textSize/100*36)}}/>
            <Card.Divider style={{height: 1, backgroundColor: "#555", width: "90%"}}/>
            <CustomText title={"For God so loves me!"} style={{...styles.cardtext, fontFamily: textfont, fontSize: Math.floor(12+textSize*textSize/100*36) }} />
          
          </View>

          <View style={{paddingHorizontal:10, marginBottom:10, marginTop:5}}>
            <View style={{marginRight:30, borderRadius:5, justifyContent: "center", flexDirection:"row", paddingLeft:20, paddingRight:20, height:50, width:"100%",   alignItems:"center", backgroundColor:"rgba(255,255,255,0.8)"}} >
              <Text style={{fontSize:18, color:"#666", fontWeight:"600"}}>Font size</Text>
              <View style={{ paddingHorizontal:20, flex:1, alignItems: 'stretch', justifyContent: 'center' }}>
                <Slider
                  value={textSize}
                  onValueChange={(x) => setTextSize(x)}
                  maximumValue={7}
                  minimumValue={3}
                  step={1}
                  trackStyle={{ height: 3, backgroundColor: 'transparent' }}
                  thumbStyle={{ height: 20, width:20, backgroundColor: '#3A86FF'}}             
                />
              </View>
            </View>
          </View>

          <View style={{paddingHorizontal:10, marginBottom:10}}>
            <View style={{marginRight:30, borderRadius:5, justifyContent: "center", flexDirection:"row", paddingLeft:20, paddingRight:20, height:50, width:"100%",   alignItems:"center", backgroundColor:"rgba(255,255,255,0.8)"}} >
              <Text style={{fontSize:18, color:"#666", fontWeight:"600"}}>Opacity</Text>
              <View style={{ paddingHorizontal:20, flex:1, alignItems: 'stretch', justifyContent: 'center' }}>
                <Slider
                  value={transparancy}
                  onValueChange={(value) => setTransparancy(value)}
                  maximumValue={10}
                  minimumValue={0}
                  step={1}
                  trackStyle={{ height: 3, backgroundColor: 'transparent' }}
                  thumbStyle={{ height: 20, width:20, backgroundColor: '#3A86FF'}}             
                />
              </View>
            </View>
          </View>

          <View style={{flexDirection:"row", flex:1, justifyContent:"center", width:"100%", paddingHorizontal:10}}>

            <Pressable  android_disableSound={true} onPress={()=>changeTextFont("Handlee", 0)} style={{padding:5, paddingTop:10, borderRadius:5, margin:3, flex:1, height:45, justifyContent:"center", alignItems:"center", backgroundColor: textArray[0] ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.6)"}}>
                <CustomText title={"Handlee"} Handlee h5 color={"#666"} />
            </Pressable>

            <Pressable  android_disableSound={true} onPress={()=>changeTextFont("Nunito", 1)} style={{padding:5, borderRadius:5, margin:3, flex:1, height:45, justifyContent:"center",alignItems:"center", backgroundColor: textArray[1] ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.6)"}}>
                <CustomText title={"Nunito"} Nunito h5 color={"#666"}/>
            </Pressable>

            <Pressable  android_disableSound={true} onPress={()=>changeTextFont("", 2)} style={{padding:5, borderRadius:5, margin:3, flex:1, height:45, justifyContent:"center",alignItems:"center", backgroundColor: textArray[2] ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.6)"}}>
                <CustomText title={"System"} h5 color={"#666"}/>
            </Pressable>

          </View>

        
          <View style={{alignItems:"flex-start", width:"100%", padding:10, paddingTop:5}} >  
              <ScrollView horizontal={true}>  
                
                <Button
                title='beach'
                type={'clear'}
                containerStyle={{...styles.button, borderRadius:5, backgroundColor:picArray[0] ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.6)"}}
                titleStyle={{fontSize:18, color:"#666", fontWeight:"600"}}
                onPress={() => {setpic("beach"); togglePicArray(0)}}
                /> 
                <Button
                title='blossom'
                type={'clear'}
                containerStyle={{...styles.button, borderRadius:5, backgroundColor:picArray[1] ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.6)"}}
                titleStyle={{fontSize:18, color:"#666", fontWeight:"600"}}
                onPress={() => {setpic("blossom"); togglePicArray(1)}}
                /> 
                <Button
                title="clouds"
                type={'clear'}
                containerStyle={{...styles.button, borderRadius:5, backgroundColor:picArray[2] ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.6)"}}
                titleStyle={{fontSize:18, color:"#666", fontWeight:"600"}}
                onPress={() =>{setpic("clouds"); togglePicArray(2)}}
                /> 
                <Button
                title="cross"
                type={'clear'}
                containerStyle={{...styles.button, borderRadius:5, backgroundColor:picArray[3] ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.6)"}}
                titleStyle={{fontSize:18, color:"#666", fontWeight:"600"}}
                onPress={() => {setpic("cross"); togglePicArray(3)}}
                /> 
                <Button
                title="colour"
                type={'clear'}
                containerStyle={{...styles.button, borderRadius:5, backgroundColor:picArray[4] ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.6)"}}
                titleStyle={{fontSize:18, color:"#666", fontWeight:"600"}}
                onPress={() => {visibleOn(); setpic("colour"); togglePicArray(4);}}
                /> 


                <Button
                title="mountains"
                type={'clear'}
                containerStyle={{...styles.button, borderRadius:5, backgroundColor:picArray[7] ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.6)"}}
                titleStyle={{fontSize:18, color:"#666", fontWeight:"600"}}
                onPress={() => {setpic("mountains"); togglePicArray(7)}}
                /> 

                <Button
                title="soft"
                type={'clear'}
                containerStyle={{...styles.button, borderRadius:5, backgroundColor:picArray[6] ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.6)"}}
                titleStyle={{fontSize:18, color:"#666", fontWeight:"600"}}
                onPress={() => {setpic("soft"); togglePicArray(6)}}
                /> 
                <Button
                title="stars"
                type={'clear'}
                containerStyle={{...styles.button, borderRadius:5, backgroundColor:picArray[10] ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.6)"}}
                titleStyle={{fontSize:18, color:"#666", fontWeight:"600"}}
                onPress={() => {setpic("stars"); togglePicArray(10)}}
                /> 
                <Button
                title="sunset"
                type={'clear'}
                containerStyle={{...styles.button, borderRadius:5, backgroundColor:picArray[11] ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.6)"}}
                titleStyle={{fontSize:18, color:"#666", fontWeight:"600"}}
                onPress={() => {setpic("sunset"); togglePicArray(11)}}
                /> 
                <Button
                title="texture"
                type={'clear'}
                containerStyle={{...styles.button, borderRadius:5, backgroundColor:picArray[12] ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.6)"}}
                titleStyle={{fontSize:18, color:"#666", fontWeight:"600"}}
                onPress={() => {setpic("texture"); togglePicArray(12)}}
                /> 
                <Button
                title="wave"
                type={'clear'}
                containerStyle={{...styles.button, borderRadius:5, backgroundColor:picArray[13] ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.6)"}}
                titleStyle={{fontSize:18, color:"#666", fontWeight:"600"}}
                onPress={() => {setpic("wave"); togglePicArray(13)}}
                /> 

              </ScrollView>
          </View>

          <View style={{paddingHorizontal:10}}>
            <View style={{marginRight:30, borderRadius:5, justifyContent: "center", flexDirection:"row", paddingLeft:20, paddingRight:20, height:50, width:"100%",   alignItems:"center", backgroundColor:"rgba(255,255,255,0.8)"}} >
              <Text style={{fontSize:18, color:"#666", fontWeight:"600"}}>Overlay</Text>
              <View style={{ paddingHorizontal:20, flex:1, alignItems: 'stretch', justifyContent: 'center' }}>
                <Slider
                  value={opacity}
                  onValueChange={(value) => setOpacity(value)}
                  maximumValue={10}
                  minimumValue={0}
                  step={1}
                  trackStyle={{ height: 3, backgroundColor: 'transparent' }}
                  thumbStyle={{ height: 20, width:20, backgroundColor: '#3A86FF'}}             
                />
              </View>
            </View>
          </View>

          <View style={{alignItems:"center", justifyContent:"space-between", marginTop:20, width: "100%", paddingHorizontal:10}}>
          <TouchableOpacity onPress={()=>saveAndExit()} style={{padding:10, borderRadius:5, margin:3, width:180, height:40, justifyContent:"center", alignItems:"center", backgroundColor: "rgba(255,255,255,0.8)"}}>
            <Text style={{fontSize:18, color:"#555", fontWeight:"600"}}>Save settings</Text>
            {/* <CustomText title={"Save settings"} p color={"#666"} /> */}
          </TouchableOpacity>
          </View>

        </View>

      </View>

    )
  }
      
  return (
    <View style={{ flex: 1, alignItems:"flex-start", justifyContent:"flex-start"}}>

      <View style={{ padding:20, paddingTop:50, width:"100%", height:90, backgroundColor:"white", flexDirection:"row", justifyContent:"space-between", alignItems:"center", borderBottomColor:"#DDD", borderBottomWidth:2}} >

        <View>
          <Pressable  android_disableSound={true} onPress={goBack} >
            <Ionicons name="arrow-back-outline" size={28} color="black" />
          </Pressable>
        </View>
        <View>
          <Text style={{fontSize:24, color:"#222"}}>Options</Text>
        </View>
        <View>
          <Pressable  android_disableSound={true}>
            <Ionicons name="arrow-back-outline" size={24} color="white" />
          </Pressable>
        </View>

      </View>

      <ScrollView style={{width:"100%",  flex:1}}>

        {pic == "beach" &&
        <ImageBackground source={beach} style={styles.image}>
          {children()}
        </ImageBackground>}

        {pic == "blossom" &&
        <ImageBackground source={blossom} style={styles.image}>
          {children()}
        </ImageBackground>}

        {pic == "clouds" &&
        <ImageBackground source={clouds} style={styles.image}>
          {children()}
        </ImageBackground>}

        {pic == "colour" &&
        <View style={{...styles.image, backgroundColor:`hsl(${colorChoice[0]},${colorChoice[1]}%,${colorChoice[2]}%)`}}> 
          {children()}
        </View>}

        {pic == "cross" &&
        <ImageBackground source={cross} style={styles.image}>
          {children()}
        </ImageBackground>}

        {pic == "mountains" &&
        <ImageBackground source={mountains} style={styles.image}>
          {children()}
        </ImageBackground>}

        {pic == "stars" &&
        <ImageBackground source={stars} style={styles.image}>
          {children()}
        </ImageBackground>}

        {pic == "sunset" &&
        <ImageBackground source={sunset} style={styles.image}>
          {children()}
        </ImageBackground>}

        {pic == "wave" &&
        <ImageBackground source={wave} style={styles.image}>
          {children()}
        </ImageBackground>}

        {pic == "snow" &&
        <ImageBackground source={snow} style={styles.image}>
          {children()}
        </ImageBackground>}

        {pic == "soft" &&
        <ImageBackground source={soft} style={styles.image}>
          {children()}
        </ImageBackground>}

        {pic == "texture" &&
        <ImageBackground source={texture} style={styles.image}>
          {children()}
        </ImageBackground>}

      </ScrollView>

      <PopUpColour visibleOff={visibleOff} popUpVisible={popUpVisible} makeColorChoice={makeColorChoice}/>

    </View>
  );
})


const styles =StyleSheet.create({

  screen: {
      flex: 1,
      alignItems: "flex-start",
      width:"100%",
      justifyContent: "flex-start",
  },
  
  image: {
    resizeMode: 'cover',
  },

  cardtext: {
    color: "#555",
    marginBottom: 5,
    textAlign: "center",
  },

  button: {
    paddingHorizontal:10, 
    borderWidth:0, 
    backgroundColor:"rgba(255,255,255,0)", 
    margin:2, 
  }
   
})

export default optionsScreen;