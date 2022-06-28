import React from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Dialog, { SlideAnimation, DialogContent } from 'react-native-popup-dialog';

const savedDataPopUp = (props) => {

    return (   
        <View>
            <Dialog
                visible={props.popUpVisible}
                dialogAnimation={new SlideAnimation({
                slideFrom: 'bottom',
                })}
                containerStyle={{justifyContent: "center", alignItems:"center", flex:1}}
                 footer={
                    <View style={{ height: 50, alignItems:"center", justifyContent:"center", padding:10, borderTopWidth:1, borderColor:"#DDD"}}>
                        <TouchableOpacity  onPress={props.switchVisible}>
                            <Text style={{fontSize:20, color:"#3A86FF", alignContent:"center"}}>OK</Text>
                        </TouchableOpacity>
                    </View>
                } 
                onDismiss={props.buttonPress}
            >
                <DialogContent>
                    <View style={{justifyContent: "center", alignItems:"center", marginTop:20}}>
                        <Text style={{fontSize:20}}>Verse Saved</Text>
                    </View>
                </DialogContent>

            </Dialog>
        </View>
    );
};

export default savedDataPopUp;