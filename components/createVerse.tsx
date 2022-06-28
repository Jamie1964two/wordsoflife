import React from 'react';
import { View, StyleSheet } from 'react-native'; 
import * as Animatable from 'react-native-animatable';
import { Options } from '../store';
import { observer } from 'mobx-react';
import { CustomText } from "../components/CustomText";

const CreateVerse = observer( (props) => {
        
    const animationsIn = ["bounceIn","bounceInUp","bounceInLeft","bounceInRight",
    "fadeIn","fadeInUp", "fadeInUpBig", "fadeInLeft", "fadeInRight"];
    
    const aniRandom = (animationsIn[Math.floor(Math.random()*9)]);    
            
    return (
           
        <Animatable.View 
        animation={aniRandom} 
        iterationCount={1} 
        //iterationDelay={5000} 
        direction="alternate" 
        style={{flex:1}}
        >

            <View style={{...styles.verseBox, backgroundColor: `rgba(255,255,255,${Options.Opacity})`}}>
            <CustomText title={props.text1} style={{textAlign:"center", color:"#333", fontFamily: Options.FontFamily}} h5 /> 
            <CustomText title={props.text2}  style={{textAlign:"center", color:"#333", fontFamily: Options.FontFamily}} p />
            </View>
        
        </Animatable.View> 
       

        
    );
        
});

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },

    verseBox: {
        flex:1,
        padding:10,
        margin:10,
        marginHorizontal:20,
        borderRadius: 5,
        borderColor: "#999",
        justifyContent: "center", 
    }
});

export default CreateVerse;