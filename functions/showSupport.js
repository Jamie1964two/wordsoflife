import AsyncStorage from '@react-native-async-storage/async-storage';

const getSupport = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('support')
        return jsonValue != null ? JSON.parse(jsonValue) : {time: 0, textOption: 0};
    } catch(e) {
        console.log("error getting support object: " + e)
    }
}

const saveSupport = async (value) => {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem('support', jsonValue)
    } catch(e) {
        console.log("error setting support object" + e)
    }
}

const showSupport = async () => {

    const support = await getSupport();
    var d = new Date();
    const nowTime = d.getTime();

    if (support["time"] == 0) {
        saveSupport({time: nowTime, repeated: 1});
        return {showSupport: true, textOption: 0};
    }

    const timeElapsed = nowTime - support["time"];

    // check if date past is +3 

    const waitDays = () => {
        if(support["repeated"]>7) return 60;
        if(support["repeated"]==7) return 30;
        if(support["repeated"]==6) return 21;
        if(support["repeated"]==5) return 14;
        if(support["repeated"]==4) return 7;
        if(support["repeated"]<4) return 3; // change back to 3 before release
    }

    if (timeElapsed < waitDays() * 24 * 3600 * 1000) {
        return {showSupport: false}
    }

    const nextTextOption = support["repeated"] >= 4 ? 4 : support["repeated"];

    saveSupport({time: nowTime, repeated: support["repeated"] + 1})

    return {showSupport: true, textOption: nextTextOption}
};

export default showSupport;

