import React, {useState} from 'react';
import { StyleSheet, Text, View, Alert, ActivityIndicator, Pressable } from 'react-native';
import ToggleSwitch from "../components/ToggleSwitch";
import {allCollectionsArray, VerseObject, origin, ActiveVerseObject} from '../store';
import {observer} from "mobx-react";
import {action} from "mobx";
import { Ionicons } from '@expo/vector-icons'; 
import { ScrollView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CollectionReturner from "../functions/createVersesArray";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import saveData from '../functions/savaData';
import Collapsible from 'react-native-collapsible';
import { Entypo } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import UpdateActiveVerse from '../functions/UpdateActiveVerse'


const AllVersesScreen = observer( ({navigation}) => {

  const [allVerses, setAllVerses] = useState([]);
  const [displayVerses, setDisplayVerses] = useState([]);
  const [ready, setReady] = useState(false);

  const goBack = () => {
    navigation.goBack()
  };
  
  
  const populateVerses = async () => {
    try{
          var Array = await CollectionReturner(["All"]);
          var activeVerses = [];
          var displayArray = [];
          for(let i=0; i<allCollectionsArray.length; i++) {
            for( let j=0; j<Array.length; j++) {
              if (Array[j].Collection == allCollectionsArray[i]) {
                activeVerses.push(Array[j])

                //array to describe each verse's appearence
                //[key, Display, Deleted (hides child if deleted), collapse verse, colorcode]
                displayArray.push([Array[j].Key,Array[j].Display,false,true, collectionColor(Array[j].Collection)])
              }
            }
          }
          setAllVerses(activeVerses);
          setDisplayVerses(displayArray);
          //console.log(displayArray[0][2]);
          setReady(true);
      } catch (e) {
          console.log("populateVerses error: " + e)
      }
  };

  // useEffect( () => {
  //   populateVerses()},[]
  // );

  useFocusEffect( React.useCallback(() => {
    origin.origin = "drawer"; 
    populateVerses()
    //console.log("Library got focus: " + origin.origin);
},[]));

  const deletePopUp = (index) => {

    const callDelete = () => deleteAction(index);

    Alert.alert(
      "Delete Verse?",
      "This operation cannot be undone.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Delete", onPress: () => callDelete() }
      ],
      
    );
  }

  const deleteAction = (index) => {
    
    var tempArray = JSON.parse(JSON.stringify(displayVerses));
    //console.log("tempArray[0][2] index" + Object.keys(index) + index.currentTarget)
    tempArray[index][2] = true;
    setDisplayVerses(tempArray);
    removeValue(index);

  }

  const toggleSwitch = (index) => {
    
    var tempArray = JSON.parse(JSON.stringify(displayVerses));
    //console.log("tempArray[0][2] index" + Object.keys(index) + index.currentTarget)
    tempArray[index][1] = !displayVerses[index][1];
    setDisplayVerses(tempArray);

  }

  const toggleCollapse = (index) => {
    
    var tempArray = JSON.parse(JSON.stringify(displayVerses));
    //console.log("tempArray[0][2] index" + Object.keys(index) + index.currentTarget)
    tempArray[index][3] = !displayVerses[index][3];
    setDisplayVerses(tempArray);

  }

  const removeValue = async (index) => {
    try {
      await AsyncStorage.removeItem(allVerses[index]["Key"])
    } catch(e) {
      console.log("error deleting verse: " + e)
    }
  }

  const toggleActive = (index) => {
    updateVerseObject(index);
    saveData(()=>{});
    toggleSwitch(index);
  };

  const updateVerseObject = action( (i) => {
    
    //console.log('allVerses[i]["Key"]' + allVerses[i]["Key"])

    VerseObject.Key = allVerses[i]["Key"];    
    VerseObject.Collection = allVerses[i]["Collection"];
    VerseObject.Book = allVerses[i]["Book"];
    VerseObject.Chapter = allVerses[i]["Chapter"];
    VerseObject.V = allVerses[i]["V"];
    VerseObject.Version = allVerses[i]["Version"];
    VerseObject.Verse = allVerses[i]["Verse"];
    VerseObject.Personalise = allVerses[i]["Personalise"];
    VerseObject.Audio = allVerses[i]["Audio"];
    VerseObject.Deleteable = true;
    VerseObject.Display = !displayVerses[i][1];

    //console.log(VerseObject);
    
  });

  const collectionColor = (coll) => {

    const defaultColor = coll.length < 40 ? 1 : coll.length;
    
    const arrayOfColors = [[217,90,61],[44,100,52],[334,100,50],[217,20,25],[197,60,41],[217,90,61],
                        [44,100,52],[334,100,50],[217,20,25],[197,60,41],[217,90,61],[44,100,52],
                        [334,100,50],[217,20,25],[197,60,41],[217,90,61],[44,100,52],[334,100,50],
                        [217,20,25],[197,60,41],[217,90,61],[44,100,52],[334,100,50],[217,20,25],
                        [197,60,41],[217,90,61],[44,100,52],[334,100,50],[217,20,25],[197,60,41],
                        [217,90,61],[44,100,52],[334,100,50],[217,20,25],[197,60,41],[217,90,61],
                        [44,100,52],[334,100,50],[217,20,25],[197,60,41]];
   
     switch (coll) {
      case "Identity": 
        return "hsl(217,90%,61%)";
      case "Authority": 
      return "hsl(334,100%,50%)";
      case "Strength":
        return "hsl(217,20%,25%)";
      case "Provision":
        return "hsl(217,90%,61%)";
      case "Healing":
        return "hsl(334,100%,50%)"; 
      case "Victory":
        return "hsl(44,100%,52%)";
      case "Blessing":
        return "hsl(44,100%,52%)";
      case "Protection":
        return "hsl(217,20%,25%)";
      case "Salvation":
        return "hsl(197,60%,41%)";
      case "Peace":
        return "hsl(44,100%,52%)";
      case "Prayer":
        return "hsl(133,98%,34%)";
      case "Comfort":
        return "hsl(197,60%,41%)";
      case "Apostolic Prayers":
        return "hsl(44,100%,52%)";
      case "Loved":
        return "hsl(334,100%,50%)";
      default:
        return `"hsl(${arrayOfColors[defaultColor][0]},${arrayOfColors[defaultColor][1]}%,${arrayOfColors[defaultColor][2]}%)"`;
    }
  }

  

  const updateActiveVerseObject = action( (i) => {
    
    //console.log('allVerses[i]["Key"]' + allVerses[i]["Key"])

    //ActiveVerseObject = allVerses[i]

    ActiveVerseObject.Key = allVerses[i]["Key"];
    ActiveVerseObject.Collection = allVerses[i]["Collection"];
    ActiveVerseObject.Book = allVerses[i]["Book"];
    ActiveVerseObject.Chapter = allVerses[i]["Chapter"];
    ActiveVerseObject.V = [...allVerses[i]["V"]];
    ActiveVerseObject.Version = allVerses[i]["Version"];
    ActiveVerseObject.Verse = allVerses[i]["Verse"];
    ActiveVerseObject.Personalise = allVerses[i]["Personalise"];
    ActiveVerseObject.Audio = allVerses[i]["Audio"];
    ActiveVerseObject.Deleteable = allVerses[i]["Deleteable"];
    ActiveVerseObject.Display = allVerses[i]["Display"];
    ActiveVerseObject.Favourite = allVerses[i]["Favourite"];
    
    //console.log(VerseObject);
    
  });

  const editButtonPress = (index) => {

    UpdateActiveVerse(allVerses[index]);
    //updateActiveVerseObject(index);
    origin.origin = "main";
    navigation.navigate('Edit');
  
  };
  
  
    
  return (
    <View style={{ flex: 1, alignItems:"flex-start", justifyContent:"flex-start"}}>

      <View style={{ padding:20, paddingTop:50, width:"100%", height:90, backgroundColor:"white", flexDirection:"row", justifyContent:"space-between", alignItems:"center", borderBottomColor:"#DDD", borderBottomWidth:2}} >

        <View>
          <Pressable   android_disableSound={true}onPress={goBack} >
            <Ionicons name="arrow-back-outline" size={28} color="#222" />
          </Pressable>
        </View>
        <View>
          <Text style={{fontSize:24, color:"#222"}}>Verse Library</Text>
        </View>
        <View>
          <Pressable  android_disableSound={true}>
            <Ionicons name="arrow-back-outline" size={24} color="white" />
          </Pressable>
        </View>

      </View>

        {/* <View style={{height:70, marginTop:2, flexDirection:"row", justifyContent: "flex-start", alignItems:"center", backgroundColor:"#FAFAFA", width:"100%", padding:20}}>
          <View style={{flex:4}}>
            <Text style={{fontSize:18, color:"#555"}}>Verse notifications active</Text>
          </View>
          <View style={{marginLeft:10, flex:1}}>
            <ToggleSwitch setActive={false} isActive={notificationsOn.On} />
          </View>
        </View> */}

      <ScrollView style={{width:"100%", height:"100%", flex:1}}>

      {!ready &&
      <View style={{width:"100%", marginTop: 100, flex:1, justifyContent:"center", alignItems:"center"}} >
        <ActivityIndicator size="large" color="#3A86FF" />
      </View>
      }

      {ready && 
      allVerses.map( (x, index) => {

        //console.log("displayverse index 2:" + displayVerses[index][2])
        
        if(displayVerses[index][2]) return;

        return (
          
          <View key={x.Key}>
          
          {!displayVerses[index][2] &&
            <View>
          
            <View style={{justifyContent: "center", flexDirection:"row", height:50, width:"100%", backgroundColor:"#FAFAFA",borderColor:"#BBB",borderTopWidth:1}} >
              
              
                <View style={{padding:10, flex:3,justifyContent:"center", alignItems:"flex-start"}}>
                  <Pressable  android_disableSound={true} onPress={() => toggleCollapse(index)}>
                  <View style={{flexDirection:"row", alignItems:"center"}}>
                    <View style={{borderRadius:10, marginRight:10, height:10, width:10, backgroundColor:displayVerses[index][4] }}></View>
                    <Text style={{fontSize:16, color:"#666", fontWeight:"700", flexWrap:"wrap"}}>{`${x.Collection.slice(0, 26)}`}</Text>
                  </View>
                  </Pressable>
                </View>

                <View style={{padding:10, flex:5,justifyContent:"center", alignItems:"flex-start"}}>
                  <Pressable  android_disableSound={true} onPress={() => toggleCollapse(index)}>
                    <Text style={{fontSize:16, color:"#666"}}>{`${x.Book} ${x.Chapter}:${x.V}`}</Text>
                  </Pressable>
                </View>

              {x.Deleteable &&
              <View style={{paddingVertical:10, flex:1, justifyContent:"center", alignItems:"center"}}>
                <MaterialCommunityIcons name="delete-forever" size={24} color={x.Deleteable ? "#999" : "#FAFAFA" } onPress={x.Deleteable ? () => deletePopUp(index) : () => {}} />
              </View>
              }
              
              <View style={{padding:10, marginRight:5, flex: x.Deleteable ? 1: 2 ,justifyContent:"center", alignItems:"center"}}>
                <ToggleSwitch setActive={() =>toggleActive(index)} isActive={displayVerses[index][1]} />
              </View>

            </View>

            <Collapsible collapsed={displayVerses[index][3]}>
              
              <View style={{flexDirection:"row", paddingLeft:20, paddingRight:20, paddingBottom:10, paddingTop:0, backgroundColor:"#FAFAFA"}}>
                
                <View style={{flex:6}}>
                  <Pressable  android_disableSound={true} onPress={() => toggleCollapse(index)}>
                    <Text style={{fontSize:16, color:"#666"}}>{`${x.Verse}`}</Text>
                  </Pressable>
                </View>
                
                <View style={{paddingVertical:10, paddingRight:8, flex:1,justifyContent:"flex-end", alignItems:"flex-end"}}>
                  <Entypo name="new-message" size={24} color="#999" onPress={()=>editButtonPress(index)}/>
                </View>

              </View>
              
            </Collapsible>

          </View>
            
      }
          
          </View>
       
        )

      })}

      </ScrollView>

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
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },

   
})

export default AllVersesScreen;
