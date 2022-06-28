import React, { useRef } from 'react';
import { Animated, StyleSheet, Pressable } from 'react-native';

const splashScreenFade = (props) => {

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const spinValue = useRef( new Animated.Value(0) ).current;

  const fadeOut = () => {
    // Will change fadeAnim value to 0 in 5 seconds
    Animated.timing(
      spinValue,
      {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
      }
      ).start();
      
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1500,
      useNativeDriver: true
    }).start(()=>props.loaded());
  };

  return (

    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim, // Bind opacity to animated value
        },
      ]}>

      <Pressable  android_disableSound={true} onPress={fadeOut} style={styles.container}>

        <Animated.Image
        source={require(`../assets/images/leaf.png`)}
        style={[
          styles.imageContainer,
          {
            transform: [{ rotate: spinValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '380deg']
              })
            }]
          },

        ]} />

      </Pressable> 
      
    </Animated.View>

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex:11,
    width:"100%",
    height:"100%",
    backgroundColor:"white"    
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex:12,
    width:"30%",
    height:"30%",   
    resizeMode:"contain"
  },
});

export default splashScreenFade;