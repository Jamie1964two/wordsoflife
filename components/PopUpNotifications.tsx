import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import Dialog, { SlideAnimation, DialogContent } from 'react-native-popup-dialog';

const PopUp = (props) => {

    return (   
        <View>
            <Dialog
                visible={props.popUpVisible}
                dialogAnimation={new SlideAnimation({
                slideFrom: 'bottom',
                })}
                containerStyle={{justifyContent: "center", alignItems:"center", flex:1}}
            >
                <DialogContent>
                    <View style={{justifyContent: "center", alignItems:"center", marginTop:20}}>
                        <View style={{margin:10}}><Text style={{fontSize:20}}>Scheduling verses</Text></View>
                        <View style={{width:50, height:50, margin:10, justifyContent:"center", alignItems:"center"}} >
                            <ActivityIndicator size="large" color="#3A86FF" />
                        </View>
                    </View>
                </DialogContent>
            </Dialog>
        </View>
    );
};

export default PopUp;