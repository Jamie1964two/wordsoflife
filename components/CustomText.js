import * as React from 'react';
import { Text } from 'react-native';
import { useFonts } from 'expo-font';
import adjust from "./adjust";


const CustomText = ({ h1, h2, h3, h4, h5, p, bold, 
                  title, titlefont, Handlee, Nunito, size, style, ...rest })=> {
    const [loaded] = useFonts({
        MirzaB: require("../assets/fonts/Mirza-Bold.ttf"),
        Handlee: require("../assets/fonts/Handlee-Regular.ttf"),
        Nunito: require('../assets/fonts/Nunito-Regular.ttf'),
        });
        
        if (!loaded) {
        return null;
        }

    return (
        <Text style={[
            h1 && { fontSize: adjust(48) },
            h2 && { fontSize: adjust(32) },
            h3 && { fontSize: adjust(20) },
            h4 && { fontSize: adjust(18) },
            h5 && { fontSize: adjust(16) },
            p && { fontSize: adjust(12) },
            titlefont && {fontFamily: 'MirzaB'},
            Nunito && {fontFamily: 'Nunito'},
            Handlee && {fontFamily: 'Handlee'},
            style
            
        ]}{...rest}>{title}</Text>
    );
};

export { CustomText };