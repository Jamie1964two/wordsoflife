import * as FileSystem from 'expo-file-system';
import { VerseObject } from '../store';
import { action } from 'mobx';

const saveAudioFile = async (uri) => {

    if( uri == "") return;

    const options = {    
        from: uri, 
        to: FileSystem.documentDirectory + `VerseAudioRecordings/` + VerseObject.Key + ".m4a"
    }

    try {
        await checkFolder();
        await FileSystem.moveAsync(options);
        updateVerseObject(uri);
    } catch (e) {
        console.log("error moving file: " + e);

    }

}

const createFolder = async() => {
    try {
        await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "VerseAudioRecordings")
    } catch (e) {
        console.log("error creating Audio folder: " + (e));
    };
}

const checkFolder = async() => {
    try {
        const dir = await FileSystem.getInfoAsync(FileSystem.documentDirectory + "VerseAudioRecordings");
        if (!dir.exists) { await createFolder()}
        //console.log("directory exist uri: " + dir.uri)
    } catch (e) {
        console.log("error finding folder: " + e);
    }
}

const updateVerseObject = action((uri) => {
    VerseObject.Audio = FileSystem.documentDirectory + `VerseAudioRecordings/` + VerseObject.Key + ".m4a";
    console.log("audio stored at: "+ VerseObject.Audio);
})

export default saveAudioFile;