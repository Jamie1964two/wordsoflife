import React, {useState} from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Dialog, { SlideAnimation, DialogContent } from 'react-native-popup-dialog';
import { Slider} from 'react-native-elements';


const PopUpColour = (props) => {

    const [hue, setHue] = useState(217)
    const [saturation, setSaturation] = useState(30)
    const [lightness, setLightness] = useState(91)

    return (   
        <View>
            <Dialog
                visible={props.popUpVisible}
                width={0.8}
                dialogAnimation={new SlideAnimation({
                slideFrom: 'bottom',
                })}
                containerStyle={{justifyContent: "center", alignItems:"center", flex:1}}
                 footer={

                    <View style={{  flexDirection:"row", alignItems:"center", justifyContent:"space-around", padding:20, borderTopWidth:1, borderColor:"#DDD"}}>
                        <TouchableOpacity  onPress={() => {props.visibleOff(); props.makeColorChoice(hue,saturation,lightness)}}><Text style={{fontSize:20, color:"#3A86FF", alignContent:"center"}}>OK</Text></TouchableOpacity>
                        <TouchableOpacity  onPress={props.visibleOff}><Text style={{fontSize:20, color:"#3A86FF", alignContent:"center"}}>Cancel</Text></TouchableOpacity>
                    </View>

                } 
                onDismiss={props.buttonPress}
            >
            <DialogContent>
                <View style={{justifyContent: "center", alignItems:"center", marginTop:20}}>
                    <Text style={{fontSize:20, textAlign:"center", color:"#666"}}>Select HSL colour</Text>  
                </View>
                
                <View style={{justifyContent: "center", alignItems:"center", margin:20}}>
                    <View style={{borderRadius:10, height:30, borderWidth:1, width:"85%", backgroundColor:`hsl(${hue},${saturation}%,${lightness}%)`}}></View>
                </View>

                <View style={{paddingHorizontal:10}}>

                    <View style={{marginRight:30, borderRadius:5, justifyContent: "center", flexDirection:"row", paddingLeft:20, paddingRight:20, height:50, width:"100%",   alignItems:"center", backgroundColor:"rgba(255,255,255,0.8)"}} >
                        <Text style={{fontSize:18, color:"#666", fontWeight:"600"}}>H</Text>
                        <View style={{ paddingHorizontal:20, flex:1, alignItems: 'stretch', justifyContent: 'center' }}>
                            <Slider
                                value={hue}
                                onValueChange={(value) => setHue(value)}
                                maximumValue={360}
                                minimumValue={0}
                                step={1}
                                trackStyle={{ height: 3, backgroundColor: 'transparent' }}
                                thumbStyle={{ height: 20, width:20, backgroundColor: '#3A86FF'}}             
                            />
                        </View>
                    </View>
                    <View style={{marginRight:30, borderRadius:5, justifyContent: "center", flexDirection:"row", paddingLeft:20, paddingRight:20, height:50, width:"100%",   alignItems:"center", backgroundColor:"rgba(255,255,255,0.8)"}} >
                        <Text style={{fontSize:18, color:"#666", fontWeight:"600"}}>S</Text>
                        <View style={{ paddingHorizontal:20, flex:1, alignItems: 'stretch', justifyContent: 'center' }}>
                            <Slider
                                value={saturation}
                                onValueChange={(value) => setSaturation(value)}
                                maximumValue={100}
                                minimumValue={0}
                                step={1}
                                trackStyle={{ height: 3, backgroundColor: 'transparent' }}
                                thumbStyle={{ height: 20, width:20, backgroundColor: '#3A86FF'}}             
                            />
                        </View>
                    </View>
                    <View style={{marginRight:30, borderRadius:5, justifyContent: "center", flexDirection:"row", paddingLeft:20, paddingRight:20, height:50, width:"100%",   alignItems:"center", backgroundColor:"rgba(255,255,255,0.8)"}} >
                        <Text style={{fontSize:18, color:"#666", fontWeight:"600"}}>L</Text>
                        <View style={{ paddingHorizontal:20, flex:1, alignItems: 'stretch', justifyContent: 'center' }}>
                            <Slider
                                value={lightness}
                                onValueChange={(value) => setLightness(value)}
                                maximumValue={100}
                                minimumValue={0}
                                step={1}
                                trackStyle={{ height: 3, backgroundColor: 'transparent' }}
                                thumbStyle={{ height: 20, width:20, backgroundColor: '#3A86FF'}}             
                            />
                        </View>
                    </View>
                </View>

            </DialogContent>
        </Dialog>
        </View>
    );
};

export default PopUpColour;