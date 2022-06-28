import React from 'react';
import { StyleSheet, View } from 'react-native';
import MenuButton from './menuButton'
import { allCollectionsArray } from '../store';

const MenuButtonCollection = (props) => {

    const arrayOfColors = [[217,90,61],[44,100,52],[334,100,50],[217,20,25],[197,60,41],[217,90,61],
                        [44,100,52],[334,100,50],[217,20,25],[197,60,41],[217,90,61],[44,100,52],
                        [334,100,50],[217,20,25],[197,60,41],[217,90,61],[44,100,52],[334,100,50],
                        [217,20,25],[197,60,41],[217,90,61],[44,100,52],[334,100,50],[217,20,25],
                        [197,60,41],[217,90,61],[44,100,52],[334,100,50],[217,20,25],[197,60,41],
                        [217,90,61],[44,100,52],[334,100,50],[217,20,25],[197,60,41],[217,90,61],
                        [44,100,52],[334,100,50],[217,20,25],[197,60,41]];


    const arrayFilter = (x) => {
        switch (x) {
            case "Identity":
            case "Jesus":
            case "Strength":
            case "Provision":
            case "Healing":
            case "Victory":
            case "Blessing":
            case "Protection":
            case "Salvation":
            case "Comfort":
            case "Prayer":
            case "Peace":
            case "Loved":
            case "Authority":
            case "Apostolic Prayers":
            case false:
            case null:
            case undefined:
            case "":
            case " ":
              return false;
            default:
              return true; 
        } 
    };

    const customCollections = allCollectionsArray.filter(arrayFilter);

    return (
        <View style={styles.buttonContainer}>
            <MenuButton H={334} S={100} L={50} title="Favourites" iconName="heart-plus" iconFamily="MaterialCommunityIcons" onClickAction = {props.ButtonClick} activeCollection={props.activeCollection}/>
            <MenuButton H={44} S={100} L={52} title="Jesus" iconName="crown-outline" iconFamily="MaterialCommunityIcons" onClickAction = {props.ButtonClick} activeCollection={props.activeCollection}/>
            <MenuButton H={217} S={90} L={61} title="Identity" iconName="v-card" onClickAction = {props.ButtonClick} activeCollection={props.activeCollection}/>
            <MenuButton H={334} S={100} L={50} title="Loved" iconName="heart" onClickAction = {props.ButtonClick}  activeCollection={props.activeCollection}/>
            <MenuButton H={44} S={100} L={52} title="Victory" iconName="trophy" onClickAction = {props.ButtonClick}  activeCollection={props.activeCollection}/>
            <MenuButton H={217} S={20} L={25} title="Strength" iconName="battery" onClickAction = {props.ButtonClick}  activeCollection={props.activeCollection}/>
            <MenuButton H={217} S={90} L={61} title="Provision" iconName="drop" onClickAction = {props.ButtonClick}  activeCollection={props.activeCollection}/>
            
            <MenuButton H={334} S={100} L={50} title="Healing" iconName="plus" onClickAction = {props.ButtonClick} iconFamily="FontAwesome" activeCollection={props.activeCollection}/>
            <MenuButton H={44} S={100} L={52} title="Blessing" iconName="light-up" onClickAction = {props.ButtonClick}  activeCollection={props.activeCollection}/>
            <MenuButton H={217} S={20} L={25} title="Protection" iconName="shield" onClickAction = {props.ButtonClick}  activeCollection={props.activeCollection}/>
            <MenuButton H={197} S={60} L={41} title="Salvation" iconName="cross" iconFamily="FontAwesome5" onClickAction = {props.ButtonClick}  activeCollection={props.activeCollection}/>
            {/* <MenuButton H={334} S={100} L={50} title="Family" iconName="heart" iconFamily="FontAwesome5" onClickAction = {props.ButtonClick}  activeCollection={props.activeCollection}/> */}

            <MenuButton H={133} S={98} L={34} title="Prayer" iconName="tree" onClickAction = {props.ButtonClick}  activeCollection={props.activeCollection}/>
            <MenuButton H={334} S={100} L={50} title="Authority" iconName="hair-cross" onClickAction = {props.ButtonClick}  activeCollection={props.activeCollection}/>
            <MenuButton H={197} S={60} L={41} title="Apostolic Prayers" iconName="fire" iconFamily="FontAwesome5" onClickAction = {props.ButtonClick}  activeCollection={props.activeCollection}/>
    
            <MenuButton H={44} S={100} L={52} title="Peace" iconName="dove" iconFamily="FontAwesome5" onClickAction = {props.ButtonClick}  activeCollection={props.activeCollection}/>
            <MenuButton H={197} S={60} L={41} title="Comfort" iconName="hand-holding-heart" iconFamily="FontAwesome5" onClickAction = {props.ButtonClick}  activeCollection={props.activeCollection}/>
            {/* <MenuButton H={197} S={60} L={41} title="Direction" iconName="arrow-up" onClickAction = {props.ButtonClick}  activeCollection={props.activeCollection}/> */}

            {customCollections.map( (item, index) =>

            {
            var colIndex = index > 40 ? index - 40 : index;
            return <MenuButton H={arrayOfColors[colIndex][0]} S={arrayOfColors[colIndex][1]} L={arrayOfColors[colIndex][2]} title={item} iconName="own" onClickAction = {props.ButtonClick} key={index}  activeCollection={props.activeCollection}/>
            })}
        </View>
            
    );
    
};

const styles =StyleSheet.create({
    buttonContainer: {
        width: "100%",
        flex:1,
        
        flexWrap:"wrap",
        flexDirection:"row",
        justifyContent:"space-evenly",
    },
    menuItem: {
        flex:1,
        flexDirection: "row",
    },


});

export default MenuButtonCollection;