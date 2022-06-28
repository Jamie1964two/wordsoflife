import {action} from 'mobx';
import {ActiveVerseObject} from '../store';

const ActiveVerseObjectUpdate = action( (item) => {

    //console.log("running activeverseobject update")
 
    ActiveVerseObject.Key = item["Key"];
    ActiveVerseObject.Collection = item["Collection"];
    ActiveVerseObject.Book = item["Book"];
    ActiveVerseObject.Chapter = item["Chapter"];
    ActiveVerseObject.V = [...item["V"]];
    ActiveVerseObject.Version = item["Version"];
    ActiveVerseObject.Verse = item["Verse"];
    ActiveVerseObject.Personalise = item["Personalise"];
    ActiveVerseObject.Audio = item["Audio"];
    ActiveVerseObject.Deleteable = item["Deleteable"];
    ActiveVerseObject.Display = item["Display"];
    ActiveVerseObject.Favourite = item["Favourite"];

    //console.log("active verse object update: " + ActiveVerseObject.Audio)
    //console.log("Updating ActiveVerseObject key is: " + ActiveVerseObject["Key"])
});

export default ActiveVerseObjectUpdate