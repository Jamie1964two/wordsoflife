import React from 'react';
import { View } from 'react-native'; 
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';

const BlueArrow = (props) => {

    return (

        <View style={{height:35}}>

            {!props.forwardArrowVisible && <Ionicons name="arrow-forward" size={30} color="white" /> }

            {props.forwardArrowVisible &&
            <Animatable.View 
            animation="shake" 
            iterationCount={3} 
            iterationDelay={3000}  
            style={{flex:1}}
            >
                <Ionicons name="arrow-forward" size={30} color="#3A86FF" />                       
            </Animatable.View> }

        </View>
    );
        
};

export default BlueArrow;