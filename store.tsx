import {autorun, computed, observable} from 'mobx';

    var ActiveVerseKey = observable({YaleKey:""});
    //var ActiveVerseObject = observable({Object:{}});
    var ActiveVerseObject = observable({
        Key: "",
        Collection: null,
        Book: null, 
        Chapter: null,
        V: [],
        Version: "",
        Verse: "",
        Personalise: "",
        Display: true,
        Audio: "",
        Deleteable: true,
        Favourite: false,
    });
    var NewVerseCreated = observable({New:false});
    var ActiveCarouselIndex = observable({Index:"0"});
    var ActiveVerseAudio = observable({Audio:""});
    var PlayButtonEnabled = observable({On: true});
    var AutoPlayOn = observable({On: true});

    var notificationsOn = observable({On: false});
    var notificationCollection = observable({collection: "All"});
    

    var OTNTChoice = observable({Testament: "new"});
    var CollectionChoice = observable({Collection: null});
    var BookChoice = observable({Book: null});
    var BookIndex = observable({index:null});
    var ChapterChoice = observable({Chapter: null});
    var VerseChoice = observable({Verse: []});
    var NoOfChapters = observable({count:null});
    var NoOfVersesInChapter = observable({count:null});
    var VersionChoice = observable({version:"WEB"});
    var Verse = observable({verse:""});
    var showCardTitle2 = observable({visible:false});
    var VerseObject = observable({
        Key: (Math.random() * 0xfffff * 1000000).toString(16),
        Collection: null,
        Book: null, 
        Chapter: null,
        V: [],
        Version: "WEB",
        Verse: "",
        Personalise: "",
        Display: true,
        Audio: "",
        Deleteable: true,
        Favourite: false,
    });
    var verseKeyHolder = observable({key:""});
    var origin = observable({origin:"drawer"});
    var allCollectionsArray = observable(["Identity", "Strength", "Provision", "Healing", "Victory", "Blessing", "Protection", "Salvation", "Prayer"]);
    var activeRecording = observable({active:false});

    var Options = observable({
        FontSize:22,
        Opacity:0.5,
        FontFamily:"Handlee",
        Background:"sunset",
        Overlay:0.5,
        ColorChoice:[217,30,91]
    });

    var NotificationVerse = observable({
        Collection: "",
        Key: "",
    });

    var Ready = observable({ready:false});
    
export {ActiveVerseKey, 
    ActiveVerseObject,
    ActiveCarouselIndex, 
    ActiveVerseAudio, 
    PlayButtonEnabled, 
    OTNTChoice, 
    CollectionChoice,
    BookChoice,
    NoOfChapters,
    BookIndex,
    NoOfVersesInChapter,
    ChapterChoice,
    VerseChoice,
    VersionChoice,
    Verse,
    showCardTitle2,
    VerseObject,
    notificationsOn,
    notificationCollection,
    verseKeyHolder,
    origin,
    allCollectionsArray,
    NewVerseCreated,
    activeRecording,
    Options,
    Ready,
    AutoPlayOn,
    NotificationVerse

};