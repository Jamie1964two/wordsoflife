import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Dialog, { SlideAnimation, DialogContent } from 'react-native-popup-dialog';
import * as Linking from 'expo-linking';
import * as Animatable from 'react-native-animatable';

const PopUpSupport = (props) => {
    
const textOptions = [
    ["Welcome!","This app is filled with God's words about your life. Filling your heart with God's thoughts about you has the ability to grow trust in your heart and bring peace to your mind.", "Try reading aloud some of God's promises every day. As you speak them, and chose to believe them, you'll find your faith in your heavenly Father growing.", "Have confidence in these promises, knowing that you can fully trust in God's word. He will be forever faithful to what He has said, after all, God is not a man that He should lie."],
    [`Sword of the Spirit`,`God has given His people so many wonderful promises in His Word. By standing on these promises we can confidently face every opposition in life that would try to knock us down.`, `Remember when Jesus faced the tempter in the wilderness, each time He responded by saying, "It is written...". Speak out the Lord's promises when you encounter difficulties and experience the life and peace they bring.`],
    [`One Thing`,`This world is full of many things competing for our attention. Today, choose to be like Mary, who sat at Jesus’ feet, and focused on His words. When Mary's sister complained, Jesus replied, "Martha, you are anxious and troubled about many things, but one thing is needed. Mary has chosen the good part, which will not be taken away from her."`, `Above all the distractions in life, choose to give time to the Lord's words - they are worthy of our fullest attention.`],
    [`Be Transformed`,`Romans 12 instructs us to 'be transformed by the renewing of your mind.' God's thoughts are far above ours and we are invited to begin to exchange our limited, darkened thoughts for His.`, "Put the Creator's words in your mind, begin to think and speak like Him, and you'll find yourself being transformed into His glorious image."],
    ["Thank you","I hope that 'Words of Life' is proving a blessing in your life. This app was created to help believers keep the Word of God before their eyes and hold tightly to His 'great and precious promises'. If this app has been an encouragement to you, please consider supporting its development.", "The Lord bless you."],
]

    return (   
        <View>
            <Dialog
                visible={props.popUpVisible}
                width={0.88}
                height={0.9}
                dialogAnimation={new SlideAnimation({
                slideFrom: 'bottom',
                })}
                // overlayOpacity={0.9}
                containerStyle={{justifyContent: "center", alignItems:"center", flex:1}}
                onDismiss={props.buttonPress}
            >

            <DialogContent >
                <ScrollView style={{width:"100%"}}>
                    <View style={{width:"100%", height:100, margin:10}}>
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
                    <View style={{ marginTop:20}}>
                        
                        <Text style={{fontSize:21, textAlign:"left", color:"#777", fontWeight:"900"}}>
                            {textOptions[props.textOption][0]}
                        </Text>

                        <View style={{marginTop:5}}>
                            <Text style={{fontSize:18, textAlign:"justify", color:"#999"}}>{textOptions[props.textOption][1]}</Text>
                        </View>

                        <View style={{marginTop:5}}>
                            <Text style={{fontSize:18, textAlign:"justify", color:"#999"}}>{textOptions[props.textOption][2]}</Text>
                        </View>

                        <View style={{marginTop:5}}>
                            <Text style={{fontSize:18, textAlign:"justify", color:"#999"}}>{textOptions[props.textOption][3]}</Text>
                        </View>

                        <View>
                            <Image  resizeMode={"contain"} style={{width:"100%", height:60, zIndex:5, opacity:0.7, marginTop:10}} source={require(`../assets/images/leaf_horizontal.png`)} />
                        </View>

                        <View style={{  flexDirection:"row", alignItems:"center", justifyContent:"space-around",marginTop:10, padding:20, borderTopWidth:1, borderColor:"#DDD"}}>
                            <TouchableOpacity  onPress={() => {props.toggleVisible(); Linking.openURL('https://www.buymeacoffee.com/JamieMoreland')}}><Text style={{fontSize:20, color:"#3A86FF", alignContent:"center"}}>Support</Text></TouchableOpacity>
                            <TouchableOpacity  onPress={props.toggleVisible}><Text style={{fontSize:20, color:"#3A86FF", alignContent:"center"}}>Close</Text></TouchableOpacity>
                        </View>

                    </View>
                </ScrollView>
            </DialogContent>
            </Dialog>
        </View>
    );
};

export default PopUpSupport;