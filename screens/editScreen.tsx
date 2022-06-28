import React, {useState} from 'react';
import {View} from 'react-native';
import ReadWrite from '../components/readwrite';
import { useFocusEffect } from '@react-navigation/native';

const EditScreen = ({navigation, route}) => {

    const [focused, setFocused] = useState(false);

    useFocusEffect( React.useCallback(() => {
        setFocused(state => !state); 
    },[]));
    
    
    const goBack = () => {
        navigation.goBack()
        //navigation.navigate('Main')
    }; 


    return (
        <View style={{flex:1, width:"100%", height:"100%", maxHeight:"100%"}}>
            <ReadWrite goBack = {goBack} focused={focused}/>
        </View>
    )
};  

EditScreen.navigationOptions = {
    headerShown:false,
};


export default EditScreen;