import React from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Dialog, { SlideAnimation, DialogContent } from 'react-native-popup-dialog';

const PopUpNotifInitialise = (props) => {

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
                        <TouchableOpacity  onPress={() => {props.toggleVisible(); props.goToNotifications()}}><Text style={{fontSize:20, color:"#3A86FF", alignContent:"center"}}>OK</Text></TouchableOpacity>
                        <TouchableOpacity  onPress={props.toggleVisible}><Text style={{fontSize:20, color:"#3A86FF", alignContent:"center"}}>Cancel</Text></TouchableOpacity>
                    </View>

                } 
                onDismiss={props.buttonPress}
            >
                <DialogContent>
                    <View style={{justifyContent: "center", alignItems:"center", marginTop:20}}>
                        <Text style={{fontSize:20, textAlign:"center"}}>Would you like to set up verse notifications?</Text>
                    </View>
                </DialogContent>
            </Dialog>
        </View>
    );
};

export default PopUpNotifInitialise;