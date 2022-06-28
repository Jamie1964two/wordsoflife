import React from 'react';
import { View, Switch, StyleSheet } from 'react-native';

const ToggleSwitch= (props) => {
 
  const toggleSwitch = () => {
      props.setActive(previousState => !previousState);
    }

  return (
    <View style={styles.container}>
      <Switch
        trackColor={{ false: '#767577', true: '#3A86FF' }}
        thumbColor={props.isActive ? '#fff' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={props.isActive}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ToggleSwitch;