import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "app_name": "BhuRakshak",
      "overview": "Overview Dashboard",
      "live_map": "Live Risk Map",
      "ai_prediction": "AI Risk Prediction",
      "weather": "Weather & Rainfall",
      "soil": "Soil Moisture",
      "roads": "Road Connectivity",
      "reporting": "Field Reporting",
      "emergency": "Emergency Response",
      "system_online": "System Online",
      "search": "Search districts, zones...",
      "submit_report": "Submit Report",
      "offline_mode": "Offline Mode",
      "syncing": "Syncing..."
    }
  },
  hi: {
    translation: {
      "app_name": "BhuRakshak",
      "overview": "अवलोकन डैशबोर्ड",
      "live_map": "लाइव जोखिम मानचित्र",
      "ai_prediction": "AI जोखिम भविष्यवाणी",
      "weather": "मौसम और वर्षा",
      "soil": "मिट्टी की नमी",
      "roads": "सड़क संपर्क",
      "reporting": "फील्ड रिपोर्टिंग",
      "emergency": "आपातकालीन प्रतिक्रिया",
      "system_online": "सिस्टम ऑनलाइन",
      "search": "जिले खोजें...",
      "submit_report": "रिपोर्ट सबमिट करें",
      "offline_mode": "ऑफ़लाइन मोड",
      "syncing": "सिंक हो रहा है..."
    }
  },
  as: {
    translation: {
      "app_name": "BhuRakshak",
      "overview": "অভাৰভিউ ডেচবৰ্ড",
      "live_map": "লাইভ ৰিস্ক মেপ",
      "ai_prediction": "AI ৰিস্ক পূৰ্বানুমান",
      "weather": "বতৰ আৰু বৰষুণ",
      "soil": "মাটিৰ আৰ্দ্ৰতা",
      "roads": "পথ সংযোগ",
      "reporting": "ফিল্ড ৰিপৰ্টিং",
      "emergency": "জৰুৰীকালীন সঁহাৰি",
      "system_online": "চিষ্টেম অনলাইন",
      "search": "জিলা বিচাৰক...",
      "submit_report": "ৰিপৰ্ট দাখিল কৰক",
      "offline_mode": "অফলাইন মোড",
      "syncing": "চিঙ্ক কৰি থকা হৈছে..."
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
