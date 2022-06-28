import React from 'react';
import { Text, View, Image, Pressable } from 'react-native';
import * as Animatable from 'react-native-animatable';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons'; 
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { observer } from 'mobx-react-lite';


const infoScreen = observer( ({navigation}) => {

  const goBack = () => {
    navigation.goBack()
  };

  const emailMe = () => {
    Linking.openURL('mailto: jamie1964two@gmail.com')
  }
  
  return (
    <View style={{ flex: 1, alignItems:"flex-start", justifyContent:"flex-start"}}>

      <View style={{ padding:20, paddingTop:50, width:"100%", height:90, backgroundColor:"white", flexDirection:"row", justifyContent:"space-between", alignItems:"center", borderBottomColor:"#DDD", borderBottomWidth:2}} >

        <View>
          <Pressable  android_disableSound={true} onPress={goBack} >
            <Ionicons name="arrow-back-outline" size={28} color="#222" />
          </Pressable>
        </View>
        <View>
          <Text style={{fontSize:24, color:"#222"}}>Information</Text>
        </View>
        <View>
          <Pressable   android_disableSound={true}>
            <Ionicons name="arrow-back-outline" size={24} color="white" />
          </Pressable>
        </View>

      </View>


      <ScrollView style={{width:"100%", height:"100%", flex:1}}>

        <View style={{width:"100%", backgroundColor:"white"}}>
              
          <Animatable.View 
            animation={"fadeIn"}
            duration={2000} 
            iterationCount={1} 
            //iterationDelay={5000} 
            style={{flex:1}}
            >
                
            <Image resizeMode={"contain"} style={{width:"100%", height:100, marginTop:20}} source={require(`../assets/Logo_leaf.png`)} />
          </Animatable.View>

        </View>
          
      
        <View style={{flex:1, padding:20, backgroundColor:"white"}}>
          
        <Text style={{fontSize:20, textAlign:"center", color:"#999", fontWeight:"bold"}}>
          Privacy Policy
        </Text>
        
        <View style={{marginTop:10}}>
          <Text style={{fontSize:18, textAlign:"justify", color:"#999"}}>  
          No personal data is collected by this app or at any point requested from the user. If you chose to contact the developer any data shared will never be given to any third party, under any circumstances. Your data will also never be used for any purpose without specific permission. The app engages in no ad targeting, data mining, or other activities that may compromise your privacy, and we do not affiliate ourselves with any third parties that do so. This app requests permission to record audio solely for the purpose of creating new verse audio segments. No audio is shared with the developers or any affiliated parties.
          </Text>
        </View>

        <View style={{marginTop:10}}>
        <Text style={{fontSize:20, textAlign:"justify", color:"#999", fontWeight:"700"}}>
          
          Contact

        </Text>
        </View>

        <View style={{marginTop:10}}>
        <Text style={{fontSize:18, textAlign:"justify", color:"#999"}}>

          If you have comments or suggestions for improvement please contact the developer.

        </Text>
        </View>
        
        <Pressable onPress={emailMe} style={{marginTop:10}}>
          <Text style={{fontSize:18, textAlign:"justify", color:"#3A86FF"}}>
            jamie1964two@gmail.com
          </Text>
        </Pressable>

        
        <View>
          <Image resizeMode={"contain"} style={{width:"100%", height:60, marginTop:20}} source={require(`../assets/images/leaf_horizontal.png`)} />
        </View>

        </View>


        <View style={{  flexDirection:"row", alignItems:"center", justifyContent:"space-around", padding:20, borderTopWidth:1, borderColor:"#DDD"}}>
          <TouchableOpacity  onPress={() => {Linking.openURL('https://www.buymeacoffee.com/JamieMoreland')}}><Text style={{fontSize:20, color:"#3A86FF", alignContent:"center"}}>Support</Text></TouchableOpacity>
          <TouchableOpacity  onPress={goBack}><Text style={{fontSize:20, color:"#3A86FF", alignContent:"center"}}>Close</Text></TouchableOpacity>
        </View>

      </ScrollView> 

    </View>
  );
})

export default infoScreen;