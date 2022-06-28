import React from 'react';
import {StyleSheet, View, Alert } from 'react-native';
import Axios from 'axios';
import {Button} from 'react-native-elements';
import { AntDesign } from '@expo/vector-icons';  

const APICall = (props) => {

    const fetchData = (e) => {
        e.preventDefault()
        console.log("props.searchString: " + props.searchString.replace(/\s/g, ""))
        
        Axios.get(props.searchString.replace(/\s/g, ""))

        .then(({data}) => {
          const verseObject = data.text;
          props.onGetVerse(verseObject.replace(/\n/g, " "));     
        })
        .catch((error) => {
            console.log(props.searchString, error);
            Alert.alert(
                `Verse could not be retrieved.`,
                `Check reference or try again later.
${props.BookChapterVerseVersion}`,               
                [
                  {
                    text: "OK",
                  },
                ]
              );
        });
    }
        
    return (
        <View style={styles.container}>
            <Button
                icon={
                    <AntDesign name="down-square-o" size={30} color="#3A86FF" />
                }
                type="clear"
                onPress={fetchData}
            />
        </View>
    );
};


const styles = StyleSheet.create ({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default APICall;



