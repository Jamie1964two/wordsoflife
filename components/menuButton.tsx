import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons'; 
import { CustomText } from "./CustomText";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 


const MenuButton = (props) => {

  const colorHSL = `hsl(218,8%,80%)`;
  const colorHSLlight = `hsl(218,8%,83%)`;
  const colorHSLon = `hsl(${props.H},${props.S}%,${props.L}%)`;
  const colorHSLlighton = `hsl(${props.H},${props.S}%,${props.L*1.1}%)`;


  const buttonClicked = () => {
   props.onClickAction(props.title);
  }

  const iconComp = (name, iconFamily, title) => {
    if(name=="own") {
           
      return <View style={{marginBottom: -8, marginTop:-10}}><CustomText style={{color: props.activeCollection == props.title ?  "#FFF" : "#EEE", fontSize: props.activeCollection == title ? 50 : 35, fontWeight:"900"}} menufont title={title.slice(0,1)} /></View>
    }
    if (iconFamily === "FontAwesome5") {
      return <FontAwesome5 color= { props.activeCollection == props.title ? "#FFF" : "#EEE"} name={name} size={props.activeCollection == title ? 40 : 30} />
    } 
    if (iconFamily === "MaterialCommunityIcons") {
      return <View style={{marginBottom: title=="Jesus" ? -5 : 0, marginTop: title=="Jesus" ? -5 : 0 }}><MaterialCommunityIcons color= { props.activeCollection == props.title ? "#FFF" : "#EEE"} name={name} size={props.activeCollection == title ? title == "Jesus" ? 45 : 40 : title == "Jesus" ? 40: 30} /></View>
    } 
    if (iconFamily === "FontAwesome") {
      return <FontAwesome color= { props.activeCollection == props.title ? "#FFF" : "#EEE"} name={name} size={props.activeCollection == title ? 40 : 30} />
    } else {
      return <Icon name={name} style={{color: props.activeCollection == props.title ?  "#FFF" : "#EEE", fontSize: props.activeCollection == title ? 40 : 30,}} />
    }
  };

return(

  <TouchableOpacity
  onPress={buttonClicked}
  style={{ justifyContent: "center", alignItems: "center", width: 60, height: 60, margin: 5 }}
  > 

    <LinearGradient style={{ flex: 1, justifyContent: "center", alignItems: "center",  borderRadius: 15, width: 60, height: 60}}
      colors={[props.activeCollection == props.title ? colorHSLon : colorHSL, 
      props.activeCollection == props.title ? colorHSLlighton : colorHSLlight,
      props.activeCollection == props.title ? colorHSLon : colorHSL]}
      start={{x:0,y:0}}
      end={{ x: 1, y: 1 }}
      locations={[0.3,0.5,0.7]}
      >

      {iconComp(props.iconName, props.iconFamily, props.title)}

      {props.title != props.activeCollection &&
      <Text style={{backgroundColor: 'transparent', fontSize: 10, color: "#EEE", fontWeight: "bold"}}>{props.title == "Apostolic Prayers" ? "Apostolic" : props.title.slice(0,10)}</Text>     
      }

    </LinearGradient> 

  </TouchableOpacity>
);
};

export default MenuButton;