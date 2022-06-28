import { PixelRatio, Dimensions} from 'react-native';

export const pixelRatio = PixelRatio.get();
export const deviceHeight = Dimensions.get('window').height;
export const deviceWidth = Dimensions.get('window').width;