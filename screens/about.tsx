import React from 'react';
import { Text, View,  Image, Pressable } from 'react-native';
import * as Animatable from 'react-native-animatable';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons'; 
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { observer } from 'mobx-react-lite';

const aboutScreen = observer( ({navigation}) => {

  const goBack = () => {
    navigation.goBack()
  };

  const emailMe = () => {
    //Linking.openURL('mailto: jamie1964two@gmail.com')
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
          <Text style={{fontSize:24, color:"#222"}}>About</Text>
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
            Welcome to Words of Life
          </Text>
          
          <View style={{marginTop:10}}>
          <Text style={{fontSize:18, textAlign:"justify", color:"#999"}}>  
            This app is designed to help you fix your thoughts on God's promises for your life.
          </Text>
          </View>

          <View style={{marginTop:10}}>
          <Text style={{fontSize:18, textAlign:"justify", color:"#999"}}>

            We all go through many struggles in life but we are not left alone without hope and overwhelmed. The Lord has given us great and precious promises in His Word. By standing on these we can walk victorious and overcome through trusting Him who is faithful. 

          </Text>
          </View>

          <View style={{marginTop:10}}>
          <Text style={{fontSize:18, textAlign:"justify", color:"#999"}}>
            You do not need to live in doubt and fear, instead fix your heart on the truth of God's word. As you do, faith and trust will rise within you. You will begin to live with confidence in the Lord who created you, provides for you, cares for you, saves you and never leaves you.
          </Text>
          </View>

          <View style={{marginTop:10}}>
          <Text style={{fontSize:18, textAlign:"justify", color:"#999"}}>
            Everyday, speak the promises of God over your life. Personalise each scripture and declare it boldly, knowing that God is faithful and 'every promise is yes and Amen' in Christ Jesus. Your words are powerful and steer the course of your life. So start speaking positive, faith filled words and you'll increasingly experience the Lord's peace.
          </Text>
          </View>

          <View style={{marginTop:10}}>
          <Text style={{fontSize:20, textAlign:"justify", color:"#999", fontWeight:"700"}}>
            
            Jesus is...

          </Text>
          </View>
    
          <View style={{marginTop:10}}>
          <Text style={{fontSize:18, textAlign:"justify", color:"#999"}}>This app contains groups of promises in collections titled 'Identity', 'Victory', 'Peace' and so on. One of the collections though soley contains what God has revealed about His Son, Jesus. Thinking upon the Lord's promises for our lives is wonderful, but gazing upon the promise giver is even sweeter!</Text>
          </View>
        
          <View style={{marginTop:10}}>
          <Text style={{fontSize:20, textAlign:"justify", color:"#999", fontWeight:"700"}}>
            
            A request

          </Text>
          </View>

          <View style={{marginTop:10}}>
          <Text style={{fontSize:18, textAlign:"justify", color:"#999"}}>

            This app has been made freely available but support is crucial to allow for it's maintenance and development. If this app is proving helpful to you, please consider supporting!

          </Text>
          </View>

          <View style={{marginTop:10}}>
          <Text style={{fontSize:18, textAlign:"justify", color:"#999"}}>

            I pray this app will be a blessing in your life as you fight the good fight of faith.
                  
          </Text>
          </View>
          
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

export default aboutScreen;
