
// voice command 
const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
let botRecognition;
const botSynth = window.speechSynthesis;
let systemVoiceEnabled = false;

const statusBar = document.getElementById('voice-status-bar');
const statusText = document.getElementById('voice-text');
let currentLanguage = "en-US"; // guide code will switch this to hi-IN if user requests Hindi tour or uses Hindi commands
// 1. Database separating properties, features, and workflow mechanics
const screenDatabase = {
    'map': {
        en: {
            summary: "The Map Screen, or desha-chitra, displays global project regions and geographic distributions.",
            feature: "It features an interactive regional hot-spot layout map overlay with dynamic geographic pins and share your locaton to privately or publicly.Mark on map share your problem in description probide in from and helper will reach you",
            howItWorks: "It works by pulling raw operational coordinates from your data cluster and projecting them visually onto your dashboard grid map.Open the screen and see add project click on it will show a form fill the form and submit it your project will be added on map and if you have any problem click on problem in description and fill the form and submit it helper will reach you.",
            properties: "Its key properties include custom map themes, live zoom adjustments, live location every seconds and real-time area categorization tags."
        },
        hi: {
            summary: "मैप स्क्रीन, यानी देश-चित्र, वैश्विक परियोजना क्षेत्रों और भौगोलिक वितरण को दर्शाती है।",
            feature: "इसमें एक इंटरैक्टिव क्षेत्रीय हॉट-स्पॉट लेआउट मैप ओवरले है जिसमें गतिशील भौगोलिक पिन और अपनी लोकेशन को निजी या सार्वजनिक रूप से साझा करने की सुविधा है। मानचित्र पर मार्क करें, अपनी समस्या का विवरण में फॉर्म भरें और सबमिट करें, हेल्पर आपकी मदद के लिए पहुंच जाएगा।",
            howItWorks: "यह आपके डेटा क्लस्टर से कच्चे परिचालन निर्देशांक खींचकर और उन्हें आपके डैशबोर्ड ग्रिड मैप पर विज़ुअल रूप से प्रोजेक्ट करके काम करता है। स्क्रीन खोलें और परियोजना जोड़ें पर क्लिक करें, यह आपको एक फॉर्म दिखाएगा, फॉर्म भरें और सबमिट करें, आपकी परियोजना मानचित्र पर जोड़ दी जाएगी और यदि आपको कोई समस्या है तो विवरण में समस्या पर क्लिक करें, फॉर्म भरें और सबमिट करें, हेल्पर आपकी मदद के लिए पहुंच जाएगा।",
            properties: "इसकी मुख्य विशेषताओं में कस्टम मैप थीम, लाइव ज़ूम एडजस्टमेंट, लाइव location और रीयल-टाइम क्षेत्र वर्गीकरण टैग शामिल हैं।"
        }
    },
    'table': {
        en: {
            summary: "The Table Screen, we call as T.D., in this user can data and share .",
            feature: "It features a highly responsive data grid structure with lightning-fast multi-column server side sorting, share the table and targeted filtering rules.",
            howItWorks: "open the screen, use will see a input field and create. enter title and click on create button your table will be created and click on add data to add data in table and share the table with your team members by phone one by one after refresh you will below and friends will see table.",
            properties: "Its primary properties include direct inline editing flags, customizable field exports, read only or edit command and complete auditing trail visibility."
        },
        hi: {
            summary: "टेबल स्क्रीन, यानी टी.डी., में संरचनात्मक दस्तावेज़ीकरण मैट्रिस और व्यवस्थित लॉगिंग इंडेक्स शामिल हैं।",
            feature: "इसमें एक अत्यंत प्रतिक्रियाशील डेटा ग्रिड संरचना है जिसमें लाइटनिंग-फास्ट मल्टी-कॉलम सर्वर साइड सॉर्टिंग, टेबल साझा करने और लक्षित फ़िल्टरिंग नियम शामिल हैं।",
            howItWorks: "स्क्रीन खोलें, उपयोगकर्ता एक इनपुट फ़ील्ड और क्रिएट बटन देखेगा। शीर्षक दर्ज करें और क्रिएट बटन पर क्लिक करें, आपकी टेबल बन जाएगी। टेबल में डेटा जोड़ने के लिए डेटा जोड़ें पर क्लिक करें और अपने टीम के सदस्यों के साथ टेबल साझा करें, फोन द्वारा एक-एक करके साझा करें, रिफ्रेश के बाद आप नीचे देखेंगे और दोस्त टेबल देखेंगे।",
            properties: "इसके प्राथमिक गुणों में सीधे इनलाइन संपादन फ़्लैग, अनुकूलन योग्य फ़ील्ड निर्यात और संपूर्ण ऑडिटिंग ट्रेल दृश्यता शामिल हैं।"
        }
    },
    'ter': {
        en: {
            summary: "The T.E.R Screen only for daily wages persons.",
            feature: "It features detailed performance  screenshots, share works, auto calculation earning according to time and shows total work time.",
            howItWorks: "its works comes on screen start button before starting select your role. after selecting role click on start button and start your work and after finishing work click on stop button and share your work with your boss.",
            properties: "Its key properties include automated efficiency score generator, priority level filters and due date countdown alerts."
        },
        hi: {
            summary: "T.E.R स्क्रीन केवल दैनिक मजदूरों के लिए है।",
            feature: " इसमें विस्तृत प्रदर्शन स्क्रीनशॉट, कार्य साझा करना, समय के अनुसार कमाई की स्वचालित गणना और कुल कार्य समय दिखाना शामिल है।",
            howItWorks: "यह स्क्रीन पर स्टार्ट बटन पर आता है, शुरू करने से पहले अपनी भूमिका चुनें। भूमिका चुनने के बाद स्टार्ट बटन पर क्लिक करें और अपना काम शुरू करें, और काम खत्म करने के बाद स्टॉप बटन पर क्लिक करें और अपने बॉस के साथ अपना काम साझा करें।",
            properties: "इसके मुख्य गुणों में स्वचालित दक्षता स्कोर जनरेटर, प्राथमिकता स्तर फ़िल्टर और नियत तारीख काउंटडाउन अलर्ट शामिल हैं।"
        }
    },
    'project': {
        en: {
            summary: "The Project reports Management Screen organizes active assignments, historic task compilations, and contract portfolios.",
            feature: "It features create project and upload work images every hours, your project will be created and you can share your project with your boss and friends.",
            howItWorks: "It this opens user will see add create project button click on it and fill the detail form and submit it your project will created and share to your boss and friends and after refresh you will see project and friends will see project.",
            properties: "Its notable properties include drag-and-drop images, access permission level settings, and cloud document linking capacities."
        },
        hi: {
            summary: "प्रोजेक्ट रिपोर्ट्स प्रबंधन स्क्रीन सक्रिय असाइनमेंट, ऐतिहासिक कार्य संकलन और अनुबंध पोर्टफोलियो को व्यवस्थित करती है।",
            feature: "इसमें हर घंटे परियोजना बनाएं और कार्य छवियां अपलोड करें, आपकी परियोजना बन जाएगी और आप अपनी परियोजना को अपने बॉस और दोस्तों के साथ साझा कर सकते हैं।",
            howItWorks: "यह खुलने पर उपयोगकर्ता को परियोजना बनाएं बटन दिखाई देगा, उस पर क्लिक करें और विवरण फ़ॉर्म भरें और सबमिट करें, आपकी परियोजना बन जाएगी और अपने बॉस और दोस्तों के साथ साझा करें, और रिफ्रेश के बाद आप परियोजना देखेंगे और दोस्त परियोजना देखेंगे।",
            properties: "इसके उल्लेखनीय गुणों में ड्रैग-एंड-ड्रॉप मैकेनिक्स, एक्सेस अनुमति स्तर सेटिंग्स और क्लाउड दस्तावेज़ लिंकिंग क्षमताएं शामिल हैं।"
        }
    },
    'invoice': {
        en:{
            summary: "The Invoice Screen provides a comprehensive overview of billing details, payment history, and financial transactions.",
            feature: "It features detailed invoice breakdowns, payment status indicators, and downloadable billing statements.",
            howItWorks: "Upon opening the screen, users can view a list of invoices with their respective details. Clicking on an invoice will provide a detailed breakdown of charges, payment history, and options to download or share the invoice.",
        },
        hi:{
            summary: "इनवॉइस स्क्रीन बिलिंग विवरण, भुगतान इतिहास और वित्तीय लेनदेन का एक व्यापक अवलोकन प्रदान करती है।",
            feature: "इसमें विस्तृत इनवॉइस ब्रेकडाउन, भुगतान स्थिति संकेतक और डाउनलोड करने योग्य बिलिंग स्टेटमेंट शामिल हैं।",
            howItWorks: "स्क्रीन खोलने पर, उपयोगकर्ता संबंधित विवरण के साथ इनवॉइस की एक सूची देख सकते हैं। किसी इनवॉइस पर क्लिक करने से शुल्क का विस्तृत ब्रेकडाउन, भुगतान इतिहास और इनवॉइस डाउनलोड या साझा करने के विकल्प प्रदान किए जाएंगे।"
        }
    },
    'conversion':{
        en: {
            summary: "The Conversion Screen offers tools for unit conversions, units changes, and measurement calculations.",
            feature: "It features a user-friendly interface for converting between different units of measurement,  and a calculator for complex conversions.",
            howItWorks: "Users can select the type of conversion they need (e.g., length, weight, currency), input the value they wish to convert, and receive the converted result instantly. The screen also provides options to save frequently used conversions for quick access."
        },
        hi: {
            summary: "कनवर्शन स्क्रीन इकाई कनवर्सन, इकाई परिवर्तन और माप गणनाओं के लिए उपकरण प्रदान करती है।",
            feature: "इसमें विभिन्न माप के बीच कनवर्शन के लिए उपयोगकर्ता-अनुकूल इंटरफ़ेस, और कम प्रकार के कनवर्शन के लिए कैलकुलेटर शामिल है।",
            howItWorks: "उपयोगकर्ता कनवर्शन के प्रकार का चयन कर सकते हैं (उदाहरण के लिए, लंबाई, वज़न, मुद्रा), मान प्रवेश करेंगे,और प्रतिक्रिया प्राप्त करेंगे। स्क्रीन में संभव हैं।"
        }
    },
    'Stages': {
        en:{
            summary: "The Stages Screen outlines the sequential phases of project development, from initiation to completion.",
            feature: "It features a visual timeline of project stages, key milestone markers, and progress tracking indicators.",
            howItWorks: "Users can view the different stages of their project, see which stage they are currently in, and track their progress towards completion. The screen also provides insights into upcoming tasks and deadlines for each stage."
        },
        hi: {
            summary: "स्टेजेस स्क्रीन परियोजना विकास के क्रमिक चरणों को रेखांकित करती है, आरंभ से लेकर पूर्णता तक।",
            feature: "इसमें परियोजना चरणों का एक दृश्य टाइमलाइन, महत्वपूर्ण मील किलोमीटर मार्कर और प्रगति ट्रैकिंग संकेतक शामिल हैं।",
            howItWorks: "उपयोगकर्ता अपनी परियोजना के विभिन्न चरणों को देख सकते हैं, देख सकते हैं कि वे किस चरण में हैं, और पूर्णता की ओर अपनी प्रगति का ट्रैकिंग कर सकते हैं। स्क्रीन में प्रबंधन के साथ-साथ प्रत्येक चरण के लिए आगामी कार्योंऔर समय सीमाओं के बारे में जानकारी प्रदान की जाती है।"
        }
    },
    'weather': {
        en: {
            summary: "The Weather Screen provides real-time weather information, forecasts, and location-based updates.",
            feature: "It features a detailed weather map, hourly forecasts, and customizable alerts for severe weather conditions.",
            howItWorks: "Users can view current weather conditions and forecasts for their location or any selected city. The screen also allows users to set alerts for specific weather events."
        },
        hi: {
            summary: "मौसम स्क्रीन वास्तविक समय के मौसम जानकारी, भविष्यवाणी और स्थान-आधारित अपडेट प्रदान करती है।",
            feature: "इसमें विस्तृत मौसम मैप, घटे की भविष्यवाणी और गंभीर मौसम स्थितियों के लिए कस्टमाइज़ेबल अलर्ट शामिल हैं।",
            howItWorks: "उपयोगकर्ता अपने स्थान या किसी भी चयनित शहर के लिए मौज़म की स्थिति और भविष्यवाणी को देख सकते हैं। स्क्रीन में उपयोगकर्ता specific मौसम events के लिए alerts सेट करने की ijazat प्रदान करती है।"
        }
    },
    'notebook': {
        en: {
            summary: "The Notebook Screen serves as a digital workspace for jotting down ideas, project notes, and important reminders.",
            feature: "It features a rich text editor, organizational folders, and the ability to attach files and images to notes.",
            howItWorks: "Users can create new notes, organize them into folders, and easily search through their notes. The screen also allows users to attach relevant files and images to their notes for better project documentation."
        },
        hi: {
            summary: "नोटबुक स्क्रीन विचारों, परियोजना नोट्स और महत्वपूर्ण रिमाइंडर्स के लिए एक डिजिटल कार्यक्षेत्र के रूप में कार्य करती है।",
            feature: "इसमें एक समृद्ध पाठ संपादक, संगठनात्मक फ़ोल्डर और नोट्स में फ़ाइलें और छवियां संलग्न करने की क्षमता शामिल है।",        
            howItWorks: "उपयोगकर्ता नए नोट्स बना सकते हैं, उन्हें फ़ोल्डरों में व्यवस्थित कर सकते हैं, और अपने नोट्स के माध्यम से आसानी से खोज कर सकते हैं। स्क्रीन उपयोगकर्ताओं को बेहतर परियोजना दस्तावेज़ीकरण के लिए उनके नोट्स में संबंधित फ़ाइलें और छवियां संलग्न करने की भी अनुमति देती है।"
        }
    }
};
// guide code database for website tour
const tourSteps = [

    {
        selector: '#userMenu',

        text: {
            en: "Here is the navigation bar. On the right side after login, You can click on it to see logout options.",

            hi: "यह नेविगेशन बार है।  उस पर क्लिक करके आप अकाउंट, प्रोफाइल बनाएं और लॉगआउट विकल्प देख सकते हैं।"
        }
    },
/*
    {
        selector: '.hero',

        text: {
            en: "This central area displays our featured products and services.",

            hi: "यह मुख्य सेक्शन हमारे फीचर्ड प्रोडक्ट्स और सेवाओं को दिखाता है।"
        }
    },
*/
    {
        selector: '.search-container',

        text: {
            en: "this section, you can use the search bar and filters to find contractors, architects, technicians and suppliers for your construction needs.",

            hi: "इस सेक्शन में आप सर्च बार और फिल्टर का उपयोग करके अपने निर्माण कार्य के लिए कॉन्ट्रैक्टर, आर्किटेक्ट, टेक्नीशियन और सप्लायर्स खोज सकते हैं।"
        }
    },

    {
        selector: '.button-box',

        text: {
            en: "this section, have four buttons, you can access maps, table data, ter,project management reports and many more tools to make your construction work easier.",

            hi: " इस सेक्शन में चार बटन हैं, जिनके माध्यम से आप मैप्स, टेबल डेटा, टेर, प्रोजेक्ट मैनेजमेंट रिपोर्ट्स और कई अन्य टूल्स तक पहुंच सकते हैं जो आपके निर्माण कार्य को आसान बनाते हैं।"
        }
    },

    {
        selector: '#heroButtons',

        text: {
            en: "Here you can use features for personal .",

            hi: "यहां आप व्यक्तिगत उपयोग के लिए सुविधाओं का उपयोग कर सकते हैं।"
        }
    },

    {
        selector: '.button-bvox',

        text: {
            en: "This is the tab section. You can use these features to view invoices, conversion, reports and project progress reports.",

            hi: "यह टैब सेक्शन है। आप इन सुविधाओं का उपयोग करके चालान, रूपांतरण, रिपोर्ट और परियोजना प्रगति रिपोर्ट देख सकते हैं।"
        }
    },
    {
        selector: '#notification',
        text: {
            en: "This is the notification section. Here you will receive updates about your projects, messages and important alerts.",
            hi: "यह नोटिफिकेशन सेक्शन है। यहाँ आपको अपने प्रोजेक्ट्स, संदेश और महत्वपूर्ण अलर्ट के बारे में अपडेट मिलेंगे।"
        }
    },

    {
        selector: '#chat-toggle',

        text: {
            en: "This button opens our AI chat assistant where you can ask questions and get instant help. This feature is currently under development and more improvements will come soon.",

            hi: "यह बटन हमारे एआई चैट असिस्टेंट को खोलता है जहाँ आप सवाल पूछ सकते हैं और तुरंत सहायता प्राप्त कर सकते हैं। यह फीचर अभी डेवलपमेंट में है और जल्द ही इसमें और बेहतर सुविधाएँ जोड़ी जाएंगी।"
        }
    },

    {
        selector: '#ctta',

        text: {
            en: "This is the footer section where you can find our contact details, terms and conditions.",

            hi: "यह फुटर सेक्शन है जहाँ आप हमारे संपर्क विवरण, नियम और शर्तें पा सकते हैं।"
        }
    }

];


// Click to unlock browser audio restrictions
function initializeVoiceSystem() {
    if (systemVoiceEnabled) return;

    botRecognition = new Speech();
    botRecognition.continuous = false;
    botRecognition.interimResults = true;
    botRecognition.lang = 'en-US';
 // ADD THESE
    botRecognition.maxAlternatives = 1;
    botRecognition.onresult = processVoiceInput;
    //botRecognition.onend = recoverVoiceStream;
    botRecognition.onstart = () => {
    isRecognitionRunning = true;
    console.log("Recognition started");
   };
   botRecognition.onnomatch = () => {

    console.log("Voice command not recognized");

    if(statusText){
        statusText.innerText = "Command not recognized";
    }

    setTimeout(() => {
        recoverVoiceStream();
    }, 800);
};

  botRecognition.onend = () => {

    isRecognitionRunning = false;

    console.log("Recognition ended");

    setTimeout(() => {
        recoverVoiceStream();
    }, 800);
 };
    botRecognition.onerror = (event) => {

        console.log("Speech recognition error:", event.error);

        if (
            event.error === "network" ||
            event.error === "aborted" ||
            event.error === "no-speech"
        ) {
            recoverVoiceStream();
        }
    };
    botRecognition.start();
    systemVoiceEnabled = true;

    document.getElementById('voice-activation-area').style.display = 'none';
    if(statusBar) statusBar.style.display = 'block';
    if(statusText) statusText.innerText = "Listening...";
    console.log("Voice system active. Listening for greeting or screens directly...");
}

// Check what the user said
function processVoiceInput(event) {
    const currentEventIndex = event.resultIndex;
    
    // FIXED SAFETY CHECK: Validates nesting inner arrays correctly
    if (!event.results || !event.results[currentEventIndex] || !event.results[currentEventIndex][0]) {
        console.log("Speech recognition returned an empty result block. Skipping...");
        return; 
    }
// IMPORTANT FIX
// Ignore interim results and only process final speech
if (!event.results[currentEventIndex].isFinal) {
    return;
}
    // FIXED TRANSCRIPT EXTRACTION: Pointing securely to index [0]
    const rawText = event.results[currentEventIndex][0].transcript;
    if (!rawText) return; 

    const spokenTranscript = rawText
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
        .trim();
    
    console.log("Cleaned Spoken Input:", spokenTranscript);
    if(statusText) statusText.innerText = `Heard: "${spokenTranscript}"`;
     
       // 1. ADDED INTERRUPT COMMAND CHECK (Checks this before everything else)
    if (spokenTranscript === 'stop' || spokenTranscript === 'quiet' || 
        spokenTranscript === 'chup' || spokenTranscript === 'silence') {
        
        if (botSynth.speaking) {
            botSynth.cancel(); // Instantly clears the audio output queue
            if(statusText) statusText.innerText = "Stopped speaking.";
            console.log("AI voice cut off by user interrupt command.");
            return; // Exit execution loop early
        }
    }
    // 2. Handle Wake/Greeting Command immediately
    if (spokenTranscript.includes('hello') || spokenTranscript.includes('hi') || spokenTranscript.includes('hey')) {
        triggerGreeting();
        return; 
    }
  //2.5 handle thankyou command.
  if (spokenTranscript.includes('thank you') || spokenTranscript.includes('thanks') || spokenTranscript.includes('dhanyavaad') || spokenTranscript.includes('shukriya')) {
        if (botSynth.speaking) botSynth.cancel(); // Clear prior audio streams first
        const thankYouMsg = new SpeechSynthesisUtterance("You're welcome! Let me know if you need anything else.");
        botRecognition.abort();

thankYouMsg.onend = () => {
    recoverVoiceStream();
};

botSynth.speak(thankYouMsg);
        return; 
    }
    // 3. Advanced Section Splitter for Property Explanations
    if (spokenTranscript.includes('explain') || spokenTranscript.includes('tell me') || 
        spokenTranscript.includes('work') || spokenTranscript.includes('feature') || 
        spokenTranscript.includes('property') || spokenTranscript.includes('properties') ||
        spokenTranscript.includes('batao') || spokenTranscript.includes('samjhao') || 
        spokenTranscript.includes('kaam') || spokenTranscript.includes('kaise')) {
        
        handleAdvancedExplanation(spokenTranscript);
        return;
    }
// WEBSITE TOUR COMMAND
// WEBSITE TOUR COMMAND
if (
    spokenTranscript.includes('guide me') ||
    spokenTranscript.includes('tour this website') ||
    spokenTranscript.includes('start tour') ||
    spokenTranscript.includes('website guide')
) {

    currentLanguage = "en-US";

    startTour();

    return;
}

// HINDI WEBSITE TOUR COMMAND
if (
    spokenTranscript.includes('guide karo') ||
    spokenTranscript.includes('website ghumao') ||
    spokenTranscript.includes('tour shuru karo') ||
    spokenTranscript.includes('hindi tour') ||
    spokenTranscript.includes('मुझे गाइड करो') ||
    spokenTranscript.includes('वेबसाइट समझाओ')
) {

    currentLanguage = "hi-IN";

    startTour();

    return;
}
    // 4. Handle Navigation Routes immediately
    handleNavigationCommand(spokenTranscript);
}
// Recovery function to restart voice recognition after interruptions or command processing and guide tour
function startTour() {

    // Browser Support Check
    if (!('speechSynthesis' in window)) {

        showToast("Browser not supported.");

        return;
    }

    isTourActive = true;

    currentStepIndex = 0;


    // BUTTON UI
    //voiceaiBtn.classList.add('speaking');

   // voiceaiBtn.innerHTML =
     //   '<span class="icon">⏹️</span> Stop Tour';
try {
    botRecognition.stop();
} catch(e){}

playStep(0);

}


// ============================================
// STOP TOUR guide tour
// ============================================

function stopTour() {

    isTourActive = false;

    window.speechSynthesis.cancel();


    // REMOVE HIGHLIGHTS
    document.querySelectorAll('.voice-highlight')
        .forEach(el => {
            el.classList.remove('voice-highlight');
        });


    // RESET BUTTON
    //voiceaiBtn.classList.remove('speaking');

    //voiceaiBtn.innerHTML =
     //   '<span class="icon">🔊</span> Start Tour';
setTimeout(() => {

    try {
        botRecognition.start();
    } catch(e){}

}, 1000);
}


// ============================================
// PLAY STEP guide tour
// ============================================

function playStep(index) {

    // END TOUR
    if (!isTourActive || index >= tourSteps.length) {

        stopTour();

        return;
    }

    const step = tourSteps[index];

    const element =
        document.querySelector(step.selector);


    // ============================================
    // HIGHLIGHT ELEMENT
    // ============================================

    if (element) {

        element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        element.classList.add('voice-highlight');

    }


    // ============================================
    // SELECT TEXT BASED ON LANGUAGE guide tour
    // ============================================

    const textToSpeak =
        currentLanguage === "hi-IN"
            ? step.text.hi
            : step.text.en;


    // ============================================
    // SPEECH
    // ============================================

    const utterance =
        new SpeechSynthesisUtterance(textToSpeak);


    // LANGUAGE
    utterance.lang = currentLanguage;


    // SPEED controller
    utterance.rate = 1;


    // PITCH
    utterance.pitch = 1;


    // VOLUME
    utterance.volume = 1;


    // ============================================
    // OPTIONAL: AUTO SELECT VOICE
    // ============================================

    const voices =
        window.speechSynthesis.getVoices();

    const selectedVoice =
        voices.find(voice =>
            voice.lang === currentLanguage
        );

    if(selectedVoice){
        utterance.voice = selectedVoice;
    }


    // ============================================
    // ON FINISH
    // ============================================

    utterance.onend = () => {

        if (element) {
            element.classList.remove('voice-highlight');
        }

        playStep(index + 1);

    };


    // ============================================
    // ERROR
    // ============================================

    utterance.onerror = (e) => {

        console.error("Speech error:", e);

        stopTour();

    };


    // ============================================
    // SPEAK
    // ============================================

    window.speechSynthesis.speak(utterance);

}
function triggerGreeting() {
       if (botSynth.speaking) {
        botSynth.cancel();
    }

    botRecognition.stop();
    const greetingMsg = new SpeechSynthesisUtterance("How can I help you?");
     greetingMsg.onend = () => {
        recoverVoiceStream();
    };
    botSynth.speak(greetingMsg);
}

// Advanced Trigger Core Logic: Parses what part of the database to read
function handleAdvancedExplanation(command) {
    //botRecognition.stop(); 
     if (botSynth.speaking) botSynth.cancel(); // Clear prior audio streams first
    let selectedScreenKey = null;
    let selectedSection = 'summary'; 
    let language = 'en'; 

    // Language processing check
    if (command.includes('batao') || command.includes('samjhao') || command.includes('kaam') || command.includes('kaise')) {
        language = 'hi';
    }

    // Screen match sorting loops
    if (command.includes('map') || command.includes('chitra')) {
        selectedScreenKey = 'map';
    } else if (command.includes('table') || command.includes('td')) {
        selectedScreenKey = 'table';
    } else if (command.includes('ter') || command.includes('tmr')) {
        selectedScreenKey = 'ter';
    } else if (command.includes('project') || command.includes('report')) {
        selectedScreenKey = 'project';
    }else if (command.includes('invoice') || command.includes('bill')) {
        selectedScreenKey = 'invoice';
    }else if (command.includes('conversion') || command.includes('unit')){
        selectedScreenKey = 'conversion';
    }else if (command.includes('Stages') || command.includes('progress') || command.includes('stage')) {
        selectedScreenKey = 'Stages';
    }else if (command.includes('weather') || command.includes('mausam')) {
        selectedScreenKey = 'weather';
    }else if (command.includes('notebook') || command.includes('notes')) {
        selectedScreenKey = 'notebook';
    }

    // Identify nested key path targeting
    if (command.includes('feature') || command.includes('खासियत')) {
        selectedSection = 'feature';
    } else if (command.includes('work') || command.includes('kaam') || command.includes('kaise')) {
        selectedSection = 'howItWorks';
    } else if (command.includes('property') || command.includes('properties') || command.includes('गुण')) {
        selectedSection = 'properties';
    } 

    if (selectedScreenKey) {
        const textToSpeak = screenDatabase[selectedScreenKey][language][selectedSection];
        const explanationUtterance = new SpeechSynthesisUtterance(textToSpeak);
        
        explanationUtterance.lang = (language === 'hi') ? 'hi-IN' : 'en-US';
        botRecognition.abort();

explanationUtterance.onend = () => {
    recoverVoiceStream();
};

botSynth.speak(explanationUtterance);
    } else {
        const errorMsg = (language === 'hi') 
            ? "क्षमा करें, मैं इस निर्देश को समझ नहीं पाया।" 
            : "Sorry, I could not extract that specific screen configuration.";
        
        const errorUtterance = new SpeechSynthesisUtterance(errorMsg);
        errorUtterance.lang = (language === 'hi') ? 'hi-IN' : 'en-US';
        botSynth.speak(errorUtterance);
    }
}

// Read commands and load the requested links directly
function handleNavigationCommand(command) {
    const routes = {
        'desha chitra': './screen/bhūgolapaṭa.html',
        'chitra': './screen/bhūgolapaṭa.html',
        'map': './screen/bhūgolapaṭa.html',
        
        'td': './screen/table.html',
        'table': './screen/table.html',
        
        'ter': './screen/tmr.html',
        'tmr': './screen/tmr.html',
        
        'project': './screen/projects-reports.html',
        'report': './screen/projects-reports.html',
        'invoice': './screen/invoice.html',
        'bill': './screen/invoice.html',
        'conversion': './screen/conversion.html',
        'unit': './screen/conversion.html',
        'stages': './screen/progrss.html',
        'progress': './screen/progrss.html',
        'stage': './screen/progrss.html',
        'weather': './screen/weather.html',
        'mausam': './screen/weather.html',
        'notebook': './screen/notebook.html',
        'notes': './screen/notebook.html'
    };

    let destinationUrl = null;

    // Direct loop match
    for (const key in routes) {
        if (command.includes(key)) {
            destinationUrl = routes[key];
            break;
        }
    }

    if (destinationUrl) {

    executeNavigation(destinationUrl);

} else {

    console.log("No matching route found for command:", command);

    // Speak fallback response
    botRecognition.abort();

    const unknownMsg = new SpeechSynthesisUtterance(
        "Sorry, I did not understand that command."
    );

    unknownMsg.onend = () => {

        // Restart listening again
        setTimeout(() => {
            recoverVoiceStream();
        }, 500);
    };

    botSynth.speak(unknownMsg);
}
}

// Perform the actual redirect link jump
function executeNavigation(url) {
    //botRecognition.stop();
     if (botSynth.speaking) botSynth.cancel(); // Clear prior audio streams first
    if(statusText) statusText.innerText = "Navigating...";

    const confirmationMsg = new SpeechSynthesisUtterance("Opening requested screen.");
    
    confirmationMsg.onend = () => {
        window.location.href = url;
    };

    botSynth.speak(confirmationMsg);
}
let recognitionRestartTimeout = null;

function recoverVoiceStream() {

    if (!systemVoiceEnabled) return;

    // Don't restart while AI speaking
    if (botSynth.speaking) {
        return;
    }

    // Prevent duplicate starts
    if (isRecognitionRunning) {
        return;
    }

    try {

        isRecognitionRunning = true;

        botRecognition.start();

        if(statusText){
            statusText.innerText = "Listening...";
        }

        console.log("Voice restarted");

    } catch (err) {

        console.log("Restart error:", err);

        isRecognitionRunning = false;

        // retry safely
        setTimeout(() => {
            recoverVoiceStream();
        }, 1500);
    }
}
/* Continuous baseline microphone loop recovery
function recoverVoiceStream() {
    if (systemVoiceEnabled) {
        setTimeout(() => {
            try {
                // If the system is currently speaking a confirmation or greeting, don't turn on mic yet
                if (!botSynth.speaking) {
                    botRecognition.start();
                } else {
                    // Check again in a moment if speech synthesis is done
                    recoverVoiceStream();
                }
            } catch(e) {
                // Catch engine conflict flags safely
            }
        }, 400);
    }
}

*/
/**
 * // Separate Module: Voice Assistant Core Logic
const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
let botRecognition;
const botSynth = window.speechSynthesis;
let systemVoiceEnabled = false;

// Create UI Status elements dynamically so you don't need to hardcode them in HTML
let statusBar, statusText;

function createVoiceUI() {
    statusBar = document.createElement('div');
    statusBar.id = 'voice-status-bar';
    statusBar.style.cssText = 'position:fixed; bottom:20px; right:20px; background:#222; color:#fff; padding:15px; border-radius:8px; display:none; z-index:9999; font-family:sans-serif;';
    
    statusText = document.createElement('span');
    statusText.id = 'voice-text';
    statusText.innerText = "Listening in background...";
    
    statusBar.appendChild(statusText);
    document.body.appendChild(statusBar);
}

// Start background listening instantly on page load without a button click
window.addEventListener('DOMContentLoaded', () => {
    createVoiceUI();
    autoStartVoiceSystem();
});

// Invisible browser audio unlocker trick
function unlockBrowserAudio() {
    if (systemVoiceEnabled) return;
    
    // Proactively generate an empty sound byte to trick browser security blocks
    const silentUtterance = new SpeechSynthesisUtterance("");
    botSynth.speak(silentUtterance);
    
    console.log("Browser audio engine pre-cleared via page interaction.");
    // Remove the window events once unlocked
    window.removeEventListener('click', unlockBrowserAudio);
    window.removeEventListener('touchstart', unlockBrowserAudio);
}
window.addEventListener('click', unlockBrowserAudio);
window.addEventListener('touchstart', unlockBrowserAudio);

function autoStartVoiceSystem() {
    try {
        botRecognition = new Speech();
        botRecognition.continuous = false; 
        botRecognition.interimResults = false;
        botRecognition.lang = 'en-US';

        botRecognition.onresult = processVoiceInput;
        botRecognition.onend = recoverVoiceStream;

        botRecognition.start();
        systemVoiceEnabled = true;
        console.log("Voice system background auto-start active. Say 'hi boss' or 'hello boss'...");
    } catch (error) {
        console.error("Speech recognition failed to initialize automatically:", error);
    }
}

function processVoiceInput(event) {
    const currentEventIndex = event.resultIndex;
    
    if (!event.results || !event.results[currentEventIndex]) {
        return; 
    }

    const rawText = event.results[currentEventIndex][0].transcript;
    if (!rawText) return; 

    const spokenTranscript = rawText
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
        .trim();
    
    console.log("Cleaned Input:", spokenTranscript);

    // Dynamic Wake Keywords shifted to 'boss' or 'contractor'
    if (spokenTranscript.includes('hello') || 
        spokenTranscript.includes('hi boss') ||
        spokenTranscript.includes('hello contractor') || 
        spokenTranscript.includes('hi contractor')) {
        
        if (statusBar) statusBar.style.display = 'block';
        if (statusText) statusText.innerText = "Boss Active...";
        triggerGreeting();
        return; 
    }

    handleNavigationCommand(spokenTranscript);
}

function triggerGreeting() {
    botRecognition.stop(); 
    const greetingMsg = new SpeechSynthesisUtterance("How can I help you?");
    
    greetingMsg.onend = () => {
        if (statusText) statusText.innerText = "Listening for screen name...";
    };
    
    botSynth.speak(greetingMsg);
}

function handleNavigationCommand(command) {
    const routes = {
        'desha chitra': './screen/bhūgolapaṭa.html',
        'chitra': './screen/bhūgolapaṭa.html',
        'map': './screen/bhūgolapaṭa.html',
        
        'td': './screen/table.html',
        'table': './screen/table.html',
        
        'ter': './screen/tmr.html',
        'tmr': './screen/tmr.html',
        
        'project': './screen/projects-reports.html',
        'report': './screen/projects-reports.html'
    };

    let destinationUrl = null;

    for (const key in routes) {
        if (command.includes(key)) {
            destinationUrl = routes[key];
            break;
        }
    }

    if (destinationUrl) {
        executeNavigation(destinationUrl);
    }
}

function executeNavigation(url) {
    botRecognition.stop();
    if (statusText) statusText.innerText = "Navigating...";

    const confirmationMsg = new SpeechSynthesisUtterance("Opening requested screen.");
    
    confirmationMsg.onend = () => {
        window.location.href = url;
    };

    botSynth.speak(confirmationMsg);
}

function recoverVoiceStream() {
    if (systemVoiceEnabled) {
        setTimeout(() => {
            try {
                if (!botSynth.speaking) {
                    botRecognition.start();
                } else {
                    recoverVoiceStream();
                }
            } catch(e) {}
        }, 400);
    }
}

 */