import React, { useState } from 'react';
import { View, Pressable } from 'react-native'; 
import { FaithScriptures } from "../assets/FaithScriptures";
import CreateVerse from "./createVerse";


const FaithVerses = () => {

    const [displayerIndex, setDisplayerIndex] = useState([true,false,false,false,false,false,false,false,false,false,false,false]);
    const [trueInd, setTrueInd] = useState(1);

    const setUpVerseOrder = () => {
        var scriptureOrder = [];
        for(let n=0; n < FaithScriptures.length; n++) {
            scriptureOrder.push(Math.floor(Math.random()*999));
        };
        var sorted = scriptureOrder.slice().sort(function(a,b){return b-a})
        var ranks = scriptureOrder.map(function(v){ return sorted.indexOf(v) });
        return ([...ranks]);
    };

    const [verseOrder, setVerseOrder] = useState(setUpVerseOrder());

    const displayUpdater = () => {
        setTrueInd(prevState => prevState === displayerIndex.length -1 ? 0 : prevState + 1);
        var newDisplay = [];
        for (let n=0; n<displayerIndex.length; n++) {
            newDisplay.push( trueInd === n ? true : false);
        };
        setDisplayerIndex([...newDisplay]);
        //console.log(displayerIndex, verseOrder);
    };

    return (      
        <View style={{flex:1,}}>
            <Pressable  android_disableSound={true} onPress={displayUpdater} style={{flex:1}} android_disableSound={true}>
                {displayerIndex[0] && <CreateVerse text1={FaithScriptures[verseOrder[0]][0]} text2={FaithScriptures[verseOrder[0]][1]} />}  
                {displayerIndex[1] && <CreateVerse text1={FaithScriptures[verseOrder[1]][0]} text2={FaithScriptures[verseOrder[1]][1]} />}   
                {displayerIndex[2] && <CreateVerse text1={FaithScriptures[verseOrder[2]][0]} text2={FaithScriptures[verseOrder[2]][1]} />}   
                {displayerIndex[3] && <CreateVerse text1={FaithScriptures[verseOrder[3]][0]} text2={FaithScriptures[verseOrder[3]][1]} />}
                {displayerIndex[4] && <CreateVerse text1={FaithScriptures[verseOrder[4]][0]} text2={FaithScriptures[verseOrder[4]][1]} />}  
                {displayerIndex[5] && <CreateVerse text1={FaithScriptures[verseOrder[5]][0]} text2={FaithScriptures[verseOrder[5]][1]} />}   
                {displayerIndex[6] && <CreateVerse text1={FaithScriptures[verseOrder[6]][0]} text2={FaithScriptures[verseOrder[6]][1]} />}   
                {displayerIndex[7] && <CreateVerse text1={FaithScriptures[verseOrder[7]][0]} text2={FaithScriptures[verseOrder[7]][1]} />}
                {displayerIndex[8] && <CreateVerse text1={FaithScriptures[verseOrder[8]][0]} text2={FaithScriptures[verseOrder[8]][1]} />}  
                {displayerIndex[9] && <CreateVerse text1={FaithScriptures[verseOrder[9]][0]} text2={FaithScriptures[verseOrder[9]][1]} />}   
                {displayerIndex[10] && <CreateVerse text1={FaithScriptures[verseOrder[10]][0]} text2={FaithScriptures[verseOrder[10]][1]} />}   
                {displayerIndex[11] && <CreateVerse text1={FaithScriptures[verseOrder[11]][0]} text2={FaithScriptures[verseOrder[11]][1]} />}
            </Pressable> 
        </View>
    );        
};

export default FaithVerses;