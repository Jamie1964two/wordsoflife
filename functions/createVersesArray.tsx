import AsyncStorage from '@react-native-async-storage/async-storage';
import Verses from "../assets/verses";
import { allCollectionsArray } from '../store';
import {action} from 'mobx';


// steps to finding verse collections

// 1. get array key of all verses in phone memory storage
// 2. retrieve and search
// 2. search for all with collection required
// 3. add in verses with that collection from verses store 
//checking that there's no duplication in key


//get keys function

const getAllKeys = async () => {
    let keys = []
    try {
      keys = await AsyncStorage.getAllKeys()
      //console.log(" ")
        //console.log("keys:" + keys)
        //console.log(" ")

    } catch(e) {
      //console.log("Get keys error: " + e);
    }
    return keys;
};

//retrieve verse function


const jsonObject = (values) => {
    return values.map( x => JSON.parse(x[1]) )
};


const arrayFilter = (x) => {
    switch (x) {
        case false:
        case null:
        case "":
        case " ":
        case undefined:
          return false;
        default:
          return true; 
    } 
};


const collectionList = action((array) => {

    var systemCollections = Verses.map(x=>x.Collection)
    //console.log("system collections: " + systemCollections)
    var allCollections = [...array,...systemCollections];

    //const allCollections2 = allCollections.filter( (value, index) => array.indexOf(value)==index );
    const allCollections2 = [...new Set(allCollections)]
    //console.log("system collections added to array 2: " + allCollections2)
    const allCollections3 = allCollections2.filter(arrayFilter);

    allCollectionsArray.replace(allCollections3.sort());

    //console.log("collections: " + allCollections3)

});


const CollectionReturner = async (collection) => {

    //console.log("repopulating verses...");    

    // 1. get array key of all verses in phone memory storage

    var versesInCollection = [];
    var collectionsList = [];

    let keys = await getAllKeys();
    let onlyVerseKeys = [];
    let collectionKeys = [];

    onlyVerseKeys = keys.filter( x => x.startsWith("Verse_"));

    //console.log("onlyVerseKeys: " + onlyVerseKeys);

    collectionsList = onlyVerseKeys.map( x => x.slice(6,x.lastIndexOf("_")));

    //console.log("collectionsList: " + collectionsList);

    collectionList(collectionsList);
    
    if (collection[0] == "All" || collection[0] == "Favourites" || collection[1] == "All") {
        collectionKeys = [...onlyVerseKeys];
    } else {
    collectionKeys = onlyVerseKeys.filter( x => {
        for( let i=0; i < collection.length; i++) {
            if (x.includes(`${collection[i]}`))
            return true
        }
        return false;
    })}

    //console.log("collectionKeys: " + collectionKeys);


    //getMultiple(keys);
    
    let values
    try {
        values = await AsyncStorage.multiGet(collectionKeys)
        versesInCollection = jsonObject(values);
    } catch(e) {
        console.log("error getting multi items :" + e)
    }
    //console.log(" ");
    //console.log("Retrieved versesinCollection :" + versesInCollection)
    //console.log(" ");

  
    //now add to array the verses from verses if no key duplication

    var versesFiltered = [];

    //console.log("Collection: " + collection)

    if(collection[0] == "All" || collection[1] == "All" || collection[0] == "Favourites") {
        versesFiltered = [...Verses];
    } else {
        versesFiltered = Verses.filter(x => {
            for( let i=0; i < collection.length; i++) {
                if (x.Collection == `${collection[i]}`) {
                return true
                }
            }
        return false;
        })
    }

    // console.log("filteredverses: " + versesFiltered);
    // console.log("filteredverses 0: " + versesFiltered[0].Book);

    // add created verses and home brew verses together

    for ( let i = 0; i < versesFiltered.length; i++) {
        var addToArray = true;
        for ( let j =0; j < versesInCollection.length; j++) {
            if (versesFiltered[i].Key == versesInCollection[j].Key) {
                addToArray = false;
                break
            }
        }
        addToArray ? versesInCollection.push(versesFiltered[i]) : {};
    };
    
    //console.log("final collection array: " + versesInCollection.length);
    // console.log("verses being returned by create Verse array: ");
    // console.log("collection: " + collection)

    // if favourites selected then filter all verses for favourite and other collections

    //console.log("collection[0]:" + collection[0]);

    if(collection[0] == "Favourites") {
        const versesTemp = versesInCollection.filter(x => {
            if(x.Favourite == true) return true;
            for( let i=1; i < collection.length; i++) {
                if (x.Collection == `${collection[i]}`) {
                return true
                }
            }
            return false;
        })
        versesInCollection = [...versesTemp]
    }

    return versesInCollection;

};

export default CollectionReturner;