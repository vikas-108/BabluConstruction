// ============================================
// MULTI LANGUAGE WEBSITE VOICE TOUR
// ENGLISH + HINDI
// ============================================


// LANGUAGE
// "en-US" = English
// "hi-IN" = Hindi

let currentLanguage = "en-US";


// ============================================
// TOUR STEPS
// ============================================

const tourSteps = [

    {
        selector: '#userMenu',

        text: {
            en: "Here is the navigation bar. On the right side after login, your number will be shown in secure form. You can click on it to see account, create profile and logout options.",

            hi: "यह नेविगेशन बार है। लॉगिन के बाद दाईं तरफ आपका नंबर secure फॉर्म में दिखाई देगा। उस पर क्लिक करके आप अकाउंट, प्रोफाइल बनाएं और लॉगआउट विकल्प देख सकते हैं।"
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
            en: "In this section, you can use the search bar and filters to find contractors, architects, technicians and suppliers for your construction needs.",

            hi: "इस सेक्शन में आप सर्च बार और फिल्टर का उपयोग करके अपने निर्माण कार्य के लिए कॉन्ट्रैक्टर, आर्किटेक्ट, टेक्नीशियन और सप्लायर्स खोज सकते हैं।"
        }
    },

    {
        selector: '.button-box',

        text: {
            en: "In this section, have four buttons, you can access maps, table data, ter,project management reports and many more tools to make your construction work easier.",

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


// ============================================
// VARIABLES
// ============================================

let currentStepIndex = 0;
let isTourActive = false;

const voiceaiBtn =
    document.getElementById('voice-assistant-btn');


// ============================================
// LANGUAGE SWITCH BUTTONS
// ============================================

// Example:
// <button onclick="setLanguage('en-US')">English</button>
// <button onclick="setLanguage('hi-IN')">हिंदी</button>

function setLanguage(lang){

    currentLanguage = lang;

    if(lang === "hi-IN"){
        showToast("हिंदी वॉइस टूर सक्रिय हो गया");
    }else{
        showToast("English voice tour activated");
    }

}


// ============================================
// MAIN BUTTON
// ============================================

voiceaiBtn.addEventListener('click', () => {

    if (isTourActive) {
        stopTour();
    } else {
        startTour();
    }

});


// ============================================
// START TOUR
// ============================================

function startTour() {

    // Browser Support Check
    if (!('speechSynthesis' in window)) {

        showToast("Browser not supported.");

        return;
    }

    isTourActive = true;

    currentStepIndex = 0;


    // BUTTON UI
    voiceaiBtn.classList.add('speaking');

    voiceaiBtn.innerHTML =
        '<span class="icon">⏹️</span> Stop Tour';


    // START
    playStep(0);

}


// ============================================
// STOP TOUR
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
    voiceaiBtn.classList.remove('speaking');

    voiceaiBtn.innerHTML =
        '<span class="icon">🔊</span> Start Tour';

}


// ============================================
// PLAY STEP
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
    // SELECT TEXT BASED ON LANGUAGE
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


    // SPEED
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
function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerText = message;

    container.appendChild(toast);

    // show animation
    setTimeout(() => toast.classList.add("show"), 100);

    // auto remove
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => container.removeChild(toast), 300);
    }, 3000);
  }
  
