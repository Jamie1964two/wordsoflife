import React, { useRef } from 'react';
import { Animated, View, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import { useIsDrawerOpen } from '@react-navigation/drawer';

const spinMenu = (props) => {
    
  const spinValue = useRef( new Animated.Value(0) ).current;
  const isDrawerOpen = useIsDrawerOpen();

  React.useEffect(() => {
    Animated.timing(
    spinValue,
    {
        toValue: isDrawerOpen ? 1 : 0,
        duration: 500,
        useNativeDriver: true
    }
    ).start();
  }, [props.drawerOpen, isDrawerOpen])

  const toggleMenuDrawer = () => {
    props.toggleDrawerOpen();
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.fadingContainer,
          {
            transform: [{ rotate: spinValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '270deg']
              })
            }]
          },
        ]}>
            <Pressable  android_disableSound={true} onPress={toggleMenuDrawer}>
        <Feather name="menu" size={24} color="rgba(55,55,55,0.5)" />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex:9,
    borderColor:"rgba(255,255,255,0.7)",
    backgroundColor:"rgba(255,255,255,0.8)",
    borderWidth:2,
    borderRadius:15
  },
  fadingContainer: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },

});

export default spinMenu;