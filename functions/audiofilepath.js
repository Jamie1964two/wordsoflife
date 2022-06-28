import { Image } from 'react-native';

const audioFilePath = (fileName) => {

    const exampleImage = require('../assets/Logo_leaf.png');
    const exampleImageUri = Image.resolveAssetSource(exampleImage).uri;
    const rootPath = exampleImageUri.replace(/(Logo_leaf.png).*/,"");
    const filePathSounds = rootPath + "/Sounds/" + fileName;

    return filePathSounds;

}

export default audioFilePath;