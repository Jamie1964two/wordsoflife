import React from 'react';
import { View, Text, StyleSheet,  ScrollView, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import APICall from './APICall';
import {observer} from 'mobx-react';
import {BookChoice, ChapterChoice, Verse, VerseChoice, VersionChoice} from '../store';
import * as Animatable from 'react-native-animatable';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const APIRefModal = observer((props) => {

    const APIDataComplete = () => {
        if (BookChoice.Book != null &&
            ChapterChoice.Chapter != null &&
            VerseChoice.Verse.length != 0) {
        return true
        } else {
        return false
        }
    };

    return (

      <Modal 
      isVisible={props.modalVisible} 
      backdropColor={"#AAA"} 
      backdropOpacity={0.7} 
      style={{ flex:1, zIndex:20, justifyContent:"center", alignItems:"center"}} 
      coverScreen={true}
      animationIn={props.slideForward ? "slideInRight" : "slideInLeft"}
      animationOut={props.slideForward ? "slideOutLeft" : "slideOutRight"} 
      backdropTransitionOutTiming={1500}
      animationInTiming={500}
      animationOutTiming={500}
      //hasBackdrop={false} 
      >

        <View style={{ flex:1, width:windowWidth*0.8, maxHeight:windowHeight*0.7, padding:20, backgroundColor:"white", justifyContent:"center", borderColor:"#777", borderWidth:1, borderRadius:8}}>

            <View style={{flex:1, justifyContent:"flex-start"}}>

                <View style={{flex:1, maxHeight: 50, marginVertical:10, marginTop:0, flexDirection:"row", justifyContent:"space-between", alignItems:"center"}} >

                    <Ionicons name="arrow-back" size={30} color="#CCC" onPress={() => {props.openAPIModal(false, false); setTimeout(() => props.openVersionModal(false, true),800)}}/>

                    <Text style={{color:"#3A86FF", fontWeight:"bold", fontSize: 20, textAlign:"center"}}>Look Up</Text>

                    <Ionicons name="close" size={30} color="#CCC"
                        onPress={() => {
                           
                            props.openAPIModal(true, false); 
                            
                        }}  
                    />

                </View>

                <View style={styles.divisions} />

                <View style={{marginTop:20, height:70, flexDirection:"row", justifyContent:"center"}}>

                    <View style={{flex:1, justifyContent:"center", height:50, padding:10}}>
                        <Text style={{fontSize:18, fontWeight:"800", color:"#888"}}>{`${BookChoice.Book} ${ChapterChoice.Chapter}:${VerseChoice.Verse} (${VersionChoice.version})`}</Text>
                    </View>

                    <Animatable.View 
                    animation="bounce" 
                    iterationCount={Verse.verse ? 1 : 2} 
                    iterationDelay={3000}  
                    style={{}}
                    >
                    <View style={{flex:0, height:50}}>
                        {APIDataComplete() && <APICall searchString = {`https://bible-api.com/${BookChoice.Book.replace(/\s/,"")}%20${ChapterChoice.Chapter}:${VerseChoice.Verse}?translation=${VersionChoice.version}`} onGetVerse={props.changeVerseHandler} BookChapterVerseVersion={`\nBook: ${BookChoice.Book}\nChapter: ${ChapterChoice.Chapter}\nVerse: ${VerseChoice.Verse}\nVersion: ${VersionChoice.version}`}/> }
                    </View>
                    </Animatable.View>

                </View>

                <View style={{borderWidth:1, borderColor:"#EEE", padding:10, backgroundColor:"#FDFDFD", flex:1, marginBottom:20}}>

                    <ScrollView>
                        
                        <Text style={{fontSize:18, color:"#3A86FF", fontWeight:"900"}}>{Verse.verse}</Text>

                    </ScrollView>

                </View>

                
                <View style={{width:"100%", alignItems:"center", marginVertical:10}}>
                
                   {!Verse.verse && <Text style={{fontSize:18, color: Verse.verse ? "#3A86FF" : "#999", fontWeight: Verse.verse ? "700" : "normal"}} onPress={() => {props.updateVerseObject(); props.openAPIModal(true, false)}}>Finish</Text>}

                    {!(!Verse.verse) &&
                     <Animatable.View 
                     animation="flash" 
                     iterationCount={1} 
                     iterationDelay={2000}  >
                        <Text style={{fontSize:18, color: Verse.verse ? "#3A86FF" : "#999", fontWeight: Verse.verse ? "700" : "normal"}} onPress={() => {props.updateVerseObject(); props.openAPIModal(true, false)}}>Finish</Text>
                    </Animatable.View>
                    }  
                
                </View>

            </View>

        </View>

      </Modal>

    );

});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    divisions: {
        width:"100%",
        backgroundColor:"#CCC",
        height:2,
        marginTop:-5,
    },
    viewBoxes: {
        //flex:1,
        height: 70,
        marginRight:10,
        zIndex: 1,
        marginTop:8,
    }
});

export default APIRefModal;