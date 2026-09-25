export type SupportedLanguage = "English" | "தமிழ்" | "हिंदी" | "ಕನ್ನಡ" | "മലയാളം";

export interface AssistantContext {
  latestExposure?: string;
  twaPpm?: number;
  duration?: number;
  workerId?: string;
  status?: string;
}

export function getGreetingMessage(lang: string): string {
  switch (lang) {
    case "தமிழ்":
      return "வணக்கம்! நான் உங்கள் HSE பாதுகாப்பு உதவியாளன். H₂S வாயு அளவு, பாதுகாப்பு விதிகள், புகைப்பட வழிகாட்டல் மற்றும் பேட்ஜ் விவரங்கள் பற்றி எளிய முறையில் உங்களுக்கு உதவ தயார்.";
    case "हिंदी":
      return "नमस्ते! मैं आपका HSE सुरक्षा सहायक हूँ। मैं H₂S गैस स्तर, सुरक्षा नियमों, फोटो निर्देशों और बैज स्थिति के बारे में आपको आसान भाषा में जानकारी देने के लिए यहाँ हूँ।";
    case "கன்னட":
    case "ಕನ್ನಡ":
      return "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ HSE ಸುರಕ್ಷತಾ ಸಹಾಯಕ. H₂S ಗ್ಯಾಸ್ ಮಟ್ಟ, ಸುರಕ್ಷತಾ ನಿಯಮಗಳು ಮತ್ತು ಬ್ಯಾಡ್ಜ್ ವಿವರಗಳನ್ನು ಸರಳವಾಗಿ ತಿಳಿಸಲು ಇಲ್ಲಿದ್ದೇನೆ.";
    case "മലയാളം":
      return "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ HSE സുരക്ഷാ സഹായിയാണ്. H₂S ഗ്യാസ് അളവ്, സുരക്ഷാ നിയമങ്ങൾ, ഫോട്ടോ നിർദ്ദേശങ്ങൾ എന്നിവയെക്കുറിച്ച് ലളിതമായി സഹായിക്കാൻ ഞാൻ ഇവിടെയുണ്ട്.";
    default:
      return "Hello! I am your HSE Safety Assistant Bot. I am here to explain your gas levels, safety limits, photo scanning steps, and badge details in simple, easy-to-understand terms!";
  }
}

export function getSuggestedQuestions(lang: string): { key: string; label: string }[] {
  switch (lang) {
    case "தமிழ்":
      return [
        { key: "latest", label: "📊 எனது வாயு அளவு பாதுகாப்பானதா?" },
        { key: "emergency", label: "🚨 வாயு எச்சரிக்கை ஒலித்தால் என்ன செய்ய வேண்டும்?" },
        { key: "preshift", label: "📸 ஷிப்ட் போட்டோ எடுப்பது எப்படி?" },
        { key: "limit", label: "🛡️ வாயு பாதுகாப்பு வரம்புகள் என்ன?" },
        { key: "badge", label: "🏷️ எனது பேட்ஜ் நிலை என்ன?" },
      ];
    case "हिंदी":
      return [
        { key: "latest", label: "📊 क्या मेरा गैस स्तर सुरक्षित है?" },
        { key: "emergency", label: "🚨 गैस अलार्म बजने पर क्या करें?" },
        { key: "preshift", label: "📸 शिफ्ट फोटो कैसे खींचें?" },
        { key: "limit", label: "🛡️ गैस सुरक्षा सीमाएँ क्या हैं?" },
        { key: "badge", label: "🏷️ मेरे बैज की स्थिति क्या है?" },
      ];
    case "கன்னட":
    case "ಕನ್ನಡ":
      return [
        { key: "latest", label: "📊 ನನ್ನ ಗ್ಯಾಸ್ ಮಟ್ಟ ಸುರಕ್ಷಿತವಾಗಿದೆಯೇ?" },
        { key: "emergency", label: "🚨 ಗ್ಯಾಸ್ ಅಲಾರಾಂ ಬಂದಾಗ ಏನು ಮಾಡಬೇಕು?" },
        { key: "preshift", label: "📸 ಶಿಫ್ಟ್ ಫೋಟೋ ತೆಗೆಯುವುದು ಹೇಗೆ?" },
        { key: "limit", label: "🛡️ ಸುರಕ್ಷತಾ ಮಿತಿಗಳು ಯಾವುವು?" },
        { key: "badge", label: "🏷️ ನನ್ನ ಬ್ಯಾಡ್ಜ್ ಸ್ಥಿತಿ ಏನು?" },
      ];
    case "മലയാളം":
      return [
        { key: "latest", label: "📊 എൻ്റെ ഗ്യാസ് ലെവൽ സുരക്ഷിതമാണോ?" },
        { key: "emergency", label: "🚨 ഗ്യാസ് അലാറം അടിച്ചാൽ എന്ത് ചെയ്യണം?" },
        { key: "preshift", label: "📸 ഷിഫ്റ്റ് ഫോട്ടോ എങ്ങനെ എടുക്കാം?" },
        { key: "limit", label: "🛡️ സുരക്ഷിത ഗ്യാസ് പരിധികൾ ഏതൊക്കെയാണ്?" },
        { key: "badge", label: "🏷️ എൻ്റെ ബാഡ്ജ് നില എന്താണ്?" },
      ];
    default:
      return [
        { key: "latest", label: "📊 Is my current gas level safe?" },
        { key: "emergency", label: "🚨 What should I do if gas alarm sounds?" },
        { key: "preshift", label: "📸 How to take pre & post shift photos?" },
        { key: "limit", label: "🛡️ What are the safe gas exposure limits?" },
        { key: "badge", label: "🏷️ What is my badge expiry status?" },
      ];
  }
}

export function generateMultilingualAnswer(query: string, lang: string, ctx?: AssistantContext): string {
  const lower = query.toLowerCase().trim();
  const exposureVal = ctx?.twaPpm !== undefined ? ctx.twaPpm : 0.26;
  const doseVal = ctx?.latestExposure || "2.1 ppm·h";
  const twaStr = `${exposureVal.toFixed(2)} ppm`;
  const durationStr = ctx?.duration ? `${ctx.duration}h` : "8h";
  const workerStr = ctx?.workerId || "W-102";

  // Determine safety assessment level
  const isHighDanger = exposureVal > 2.5;
  const isModerateWarning = exposureVal >= 1.0 && exposureVal <= 2.5;

  // 1. GREETINGS & BOT ROLE IDENTIFICATION
  if (
    lower === "hi" ||
    lower === "hello" ||
    lower === "hey" ||
    lower.includes("namaste") ||
    lower.includes("vanakkam") ||
    lower.includes("namaskara") ||
    lower.includes("who are you") ||
    lower.includes("help") ||
    lower.includes("bot")
  ) {
    switch (lang) {
      case "தமிழ்":
        return `வணக்கம்! 👋 நான் உங்கள் பாதுகாப்பு உதவியாளன்.

உங்களுக்கு நான் செய்யக்கூடிய உதவிகள்:
• 📊 உங்கள் பணி இடத்தின் H₂S வாயு அளவு பாதுகாப்பானதா என்று சரிபார்த்தல்
• 🚨 வாயு கசிவு ஏற்பட்டால் செய்ய வேண்டிய அவசர வழிகாட்டுதல்
• 📸 ஷிப்ட் பேட்ஜ் படம் எடுக்கும் முறைகளை விளக்குதல்
• 🏷️ உங்கள் பேட்ஜ் ஆயுட்காலம் & நிலை கூறுதல்

எந்த சந்தேகத்தையும் கேட்கலாம்!`;
      case "हिंदी":
        return `नमस्ते! 👋 मैं आपका सुरक्षा सहायक हूँ।

मैं आपकी मदद कर सकता हूँ:
• 📊 आपका H₂S गैस स्तर सुरक्षित है या नहीं, यह बताने में
• 🚨 गैस रिसाव के समय आपातकालीन सुरक्षा निर्देशों में
• 📸 शिफ्ट फोटो स्कैन करने के आसान तरीकों में
• 🏷️ आपके बैज की वैधता जानने में

बेझिझक अपना सवाल पूछें!`;
      case "கன்னட":
      case "ಕನ್ನಡ":
        return `ನಮಸ್ಕಾರ! 👋 ನಾನು ನಿಮ್ಮ ಸುರಕ್ಷತಾ ಸಹಾಯಕ.

ನಾನು ಸಹಾಯ ಮಾಡುವ ವಿಷಯಗಳು:
• 📊 ನಿಮ್ಮ H₂S ಗ್ಯಾಸ್ ಮಟ್ಟ ಸುರಕ್ಷಿತವಾಗಿದೆಯೇ ಎಂದು ತಿಳಿಸುವುದು
• 🚨 ಗ್ಯಾಸ್ ಸೋರಿಕೆಯಾದಾಗ ಅನುಸರಿಸಬೇಕಾದ ಸುರಕ್ಷತಾ ನಿಯಮಗಳು
• 📸 ಫೋಟೋ ಸ್ಕ್ಯಾನ್ ಮಾಡುವ ಹಂತಗಳು
• 🏷️ ನಿಮ್ಮ ಬ್ಯಾಡ್ಜ್ ಮಾನ್ಯತೆಯ ಸ್ಥಿತಿ

ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ!`;
      case "മലയാളം":
        return `നമസ്കാരം! 👋 ഞാൻ നിങ്ങളുടെ സുരക്ഷാ സഹായിയാണ്.

ഞാൻ സഹായിക്കുന്ന കാര്യങ്ങൾ:
• 📊 നിങ്ങളുടെ H₂S ഗ്യാസ് നില സുരക്ഷിതമാണോ എന്ന് പരിശോധിക്കുക
• 🚨 ഗ്യാസ് ചോർച്ച ഉണ്ടായാൽ ചെയ്യേണ്ട കാര്യങ്ങൾ
• 📸 ഷിഫ്റ്റ് ഫോട്ടോ സ്കാൻ ചെയ്യുന്ന രീതികൾ
• 🏷️ നിങ്ങളുടെ ബാഡ്ജ് നില അറിയുക

എന്തും ചോദിക്കാം!`;
      default:
        return `Hello! 👋 I am your friendly Safety Assistant Bot.

Here is how I can help you today:
• 📊 Check if your gas level is safe for work
• 🚨 Emergency steps if a gas leak happens
• 📸 Simple guide for taking pre-shift and post-shift photos
• 🏷️ Check your badge shelf-life validity

Feel free to ask any question!`;
    }
  }

  // 2. EMERGENCY & GAS ALARM PROTOCOLS
  if (
    lower.includes("alarm") ||
    lower.includes("emergency") ||
    lower.includes("evacuate") ||
    lower.includes("leak") ||
    lower.includes("danger") ||
    lower.includes("hazard") ||
    lower.includes("siren") ||
    lower.includes("mask")
  ) {
    switch (lang) {
      case "தமிழ்":
        return `🚨 **வாயு எச்சரிக்கை பாதுகாப்பு வழிமுறைகள்:**

1. 🤿 **மூச்சுக்கருவி அணிங்கள்:** உடனடியாக உங்கள் SCBA அல்லது பாதுகாப்பு மாஸ்க் அணியவும்.
2. 🏃 **பாதுகாப்பான இடத்திற்குச் செல்லவும்:** காற்று வீசும் திசைக்கு எதிராக (Upwind) அவசர சேகரிப்பு இடத்திற்கு உடனே செல்லவும்.
3. 📢 **பாதுகாப்பு அதிகாரிக்குத் தெரிவிக்கவும்:** உடனடியாக கட்டுப்பாட்டு அறைக்கு தகவல் தெரிவிக்கவும்.
4. ⛔ **அனுமதியின்றி திரும்ப வேண்டாம்:** அதிகாரிகள் சரிபார்க்கும் வரை அந்த பகுதிக்கு செல்லக்கூடாது.`;
      case "हिंदी":
        return `🚨 **गैस अलार्म आपातकालीन सुरक्षा निर्देश:**

1. 🤿 **मास्क पहनें:** तुरंत अपना SCBA या सुरक्षा मास्क पहनें।
2. 🏃 **सुरक्षित स्थान पर जाएं:** हवा की विपरीत दिशा (Upwind) में आपातकालीन मस्टर प्वाइंट की तरफ तुरंत जाएँ।
3. 📢 **सूचित करें:** तुरंत सुरक्षा अधिकारी और कंट्रोल रूम को खबर दें।
4. ⛔ **वापस न जाएं:** जब तक अधिकारी अनुमति न दें, क्षेत्र में दोबारा न जाएँ।`;
      case "கன்னட":
      case "ಕನ್ನಡ":
        return `🚨 **ಗ್ಯಾಸ್ ಅಲಾರಾಂ ಬಂದಾಗ ಮಾಡಬೇಕಾದ ನಿಯಮಗಳು:**

1. 🤿 **ಮಾಸ್ಕ್ ಧರಿಸಿ:** ತಕ್ಷಣವೇ SCBA ಅಥವಾ ಸುರಕ್ಷತಾ ಮಾಸ್ಕ್ ಧರಿಸಿ.
2. 🏃 **ಸುರಕ್ಷಿತ ಜಾಗಕ್ಕೆ ತೆರಳಿ:** ಗಾಳಿಯ ವಿರುದ್ಧ ದಿಕ್ಕಿನಲ್ಲಿ ತಕ್ಷಣ ತುರ್ತು ಮಸ್ಟರ್ ಪಾಯಿಂಟ್‌ಗೆ ತೆರಳಿ.
3. 📢 **ಮಾಹಿತಿ ನೀಡಿ:** ಸುರಕ್ಷತಾ ಅಧಿಕಾರಿಗಳಿಗೆ ತಕ್ಷಣ ತಿಳಿಸಿ.
4. ⛔ **ಮರಳಿ ಹೋಗಬೇಡಿ:** ಅಧಿಕಾರಿಗಳು ಅನುಮತಿಸುವವರೆಗೆ ಆ ಜಾಗಕ್ಕೆ ಹೋಗಬೇಡಿ.`;
      case "മലയാളം":
        return `🚨 **ഗ്യാസ് അലാറം അടിക്കുമ്പോൾ ചെയ്യേണ്ട കാര്യങ്ങൾ:**

1. 🤿 **മാസ്ക് ധരിക്കുക:** ഉടൻ തന്നെ നിങ്ങളുടെ SCBA അല്ലെങ്കിൽ സുരക്ഷാ മാസ്ക് ധരിക്കുക.
2. 🏃 **സുരക്ഷിത സ്ഥാനത്തേക്ക് മാറുക:** കാറ്റിൻ്റെ എതിർദിശയിൽ (Upwind) മസ്റ്റർ പോയിൻ്റിലേക്ക് നീങ്ങുക.
3. 📢 **വിവരം അറിയിക്കുക:** സുരക്ഷാ ഉദ്യോഗസ്ഥരെ ഉടൻ വിവരമറിയിക്കുക.
4. ⛔ **തിരികെ പോകരുത്:** സുരക്ഷ ഉറപ്പാക്കുന്നത് വരെ ആ പ്രദേശത്തേക്ക് മടങ്ങരുത്.`;
      default:
        return `🚨 **EMERGENCY GAS SAFETY STEPS:**

1. 🤿 **Put on your breathing mask:** Don your SCBA or emergency breathing hood immediately.
2. 🏃 **Move to Safe Assembly Area:** Walk upwind (against the wind) away from the gas source toward the Muster Point.
3. 📢 **Notify Safety Officer:** Alert plant control room and supervisors immediately.
4. ⛔ **Do not return:** Stay in the safe area until safety monitors give all-clear clearance.`;
    }
  }

  // 3. PRE-SHIFT & POST-SHIFT CAPTURE GUIDANCE
  if (
    lower.includes("how to capture") ||
    lower.includes("preshift") ||
    lower.includes("pre-shift") ||
    lower.includes("postshift") ||
    lower.includes("post-shift") ||
    lower.includes("take photo") ||
    lower.includes("photo") ||
    lower.includes("scan")
  ) {
    switch (lang) {
      case "தமிழ்":
        return `📸 **ஷிப்ட் போட்டோ எடுக்கும் எளிதான வழி:**

• **வேலை தொடங்கும் முன் (Pre-Shift):** உங்கள் பேட்ஜை நல்ல வெளிச்சத்தில் கேமரா முன் பிடித்து போட்டோ எடுக்கவும்.
• **வேலை முடிந்த பின் (Post-Shift):** 8 மணிநேர பணி முடிந்ததும் மீண்டும் போட்டோ எடுக்கவும்.
• 💡 **குறிப்பு:** நிழல் மற்றும் அதிக வெளிச்சப் பிரதிபலிப்பு (Glare) இல்லாமல் தெளிவான போட்டோ எடுக்கவும்.`;
      case "हिंदी":
        return `📸 **शिफ्ट फोटो खींचने का आसान तरीका:**

• **काम शुरू करने से पहले (Pre-Shift):** अपने बैज को अच्छी रोशनी में रखकर फोटो खींचें।
• **काम खत्म होने के बाद (Post-Shift):** 8-घंटे की शिफ्ट पूरी होने पर दोबारा फोटो लें।
• 💡 **सलाह:** बैज पर छाया या तेज चमक (Glare) न आने दें, फोटो बिल्कुल साफ होनी चाहिए।`;
      case "கன்னட":
      case "ಕನ್ನಡ":
        return `📸 **ಫೋಟೋ ತೆಗೆಯುವ ಸರಳ ಹಂತಗಳು:**

• **ಕೆಲಸ ಪ್ರಾರಂಭಿಸುವ ಮೊದಲು (Pre-Shift):** ನಿಮ್ಮ ಬ್ಯಾಡ್ಜ್ ಅನ್ನು ಉತ್ತಮ ಬೆಳಕಿನಲ್ಲಿ ಹಿಡಿದು ಫೋಟೋ ತೆಗೆಯಿರಿ.
• **ಕೆಲಸ ಮುಗಿದ ನಂತರ (Post-Shift):** 8 ಗಂಟೆಗಳ ಕೆಲಸದ ನಂತರ ಮತ್ತೆ ಫೋಟೋ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ.
• 💡 **ಸಲಹೆ:** ನೆರಳು ಮತ್ತು ಅತಿಯಾದ ಬೆಳಕಿನ ಪ್ರತಿಫಲನವಿಲ್ಲದೆ ಸ್ಪಷ್ಟ ಫೋಟೋ ತೆಗೆಯಿರಿ.`;
      case "മലയാളം":
        return `📸 **ഫോട്ടോ എടുക്കുന്നതിനുള്ള എളുപ്പവഴികൾ:**

• **ജോലി തുടങ്ങുന്നതിന് മുൻപ് (Pre-Shift):** നല്ല വെളിച്ചത്തിൽ ബാഡ്ജ് ക്യാമറയിൽ ഫോട്ടോ എടുക്കുക.
• **ജോലി കഴിഞ്ഞ ശേഷം (Post-Shift):** 8 മണിക്കൂർ ഷിഫ്റ്റ് കഴിഞ്ഞ് വീണ്ടും സ്കാൻ ചെയ്യുക.
• 💡 **ശ്രദ്ധിക്കുക:** നിഴലോ വെളിച്ചത്തിൻ്റെ പ്രതിഫലനമോ ഇല്ലാതെ വ്യക്തമായ ഫോട്ടോ എടുക്കുക.`;
      default:
        return `📸 **EASY PHOTO SCANNING GUIDE:**

• **Before Shift (Pre-Shift):** Take a photo of your badge before you start work in a well-lit area.
• **After Shift (Post-Shift):** Take a second photo after finishing your 8-hour shift.
• 💡 **Photo Tip:** Make sure there is no camera glare or dark shadow over your badge.`;
    }
  }

  // 4. BADGE / CARTRIDGE STATUS & EXPIRY
  if (
    lower.includes("badge") ||
    lower.includes("expiry") ||
    lower.includes("expiration") ||
    lower.includes("shelf")
  ) {
    switch (lang) {
      case "தமிழ்":
        return `🏷️ **உங்கள் பேட்ஜ் விவரம் & ஆயுட்காலம்:**

• **பேட்ஜ் ஐடி:** B-00125
• **நிலை:** 🟢 செல்லுபடியாகும் (VALID)
• **ஆயுட்காலம்:** பாதுகாப்பான பணி நிலையில் உள்ளது (காலாவதி தேதி: 12 ஜனவரி 2027)`;
      case "हिंदी":
        return `🏷️ **आपके बैज की स्थिति:**

• **बैज आईडी:** B-00125
• **स्थिति:** 🟢 मान्य (VALID)
• **वैधता:** बैज पूरी तरह चालू और सुरक्षित है (समाप्ति: 12 जनवरी 2027)`;
      case "கன்னட":
      case "ಕನ್ನಡ":
        return `🏷️ **ನಿಮ್ಮ ಬ್ಯಾಡ್ಜ್ ವಿವರ ಮತ್ತು ಸ್ಥಿತಿ:**

• **ಬ್ಯಾಡ್ಜ್ ಐಡಿ:** B-00125
• **ಸ್ಥಿತಿ:** 🟢 ಮಾನ್ಯವಾಗಿದೆ (VALID)
• **ಆಯುಷ್ಯ:** ಸುರಕ್ಷಿತ ಸ್ಥಿತಿಯಲ್ಲಿದೆ (ಅವಧಿ ಮುಕ್ತಾಯ: 12 ಜನವರಿ 2027)`;
      case "മലയാളം":
        return `🏷️ **നിങ്ങളുടെ ബാഡ്ജ് നില:**

• **ബാഡ്ജ് ഐഡി:** B-00125
• **നില:** 🟢 സാധുവായത് (VALID)
• **കാലാവധി:** ബാഡ്ജ് പൂർണ്ണമായും സുരക്ഷിതമാണ് (കാലാവധി: 12 ജനുവരി 2027)`;
      default:
        return `🏷️ **YOUR DOSIMETER BADGE STATUS:**

• **Badge ID:** B-00125
• **Shelf Life Status:** 🟢 VALID & Healthy
• **Expiry Date:** 12 Jan 2027 (Safe for daily workplace monitoring)`;
    }
  }

  // 5. SAFETY LIMITS & THRESHOLDS (EXPLAINED IN SIMPLE WORKER TERMS)
  if (
    lower.includes("limit") ||
    lower.includes("threshold") ||
    lower.includes("safe") ||
    lower.includes("level") ||
    lower.includes("green") ||
    lower.includes("amber") ||
    lower.includes("red")
  ) {
    switch (lang) {
      case "தமிழ்":
        return `🛡️ **வாயு பாதுகாப்பு நிலைகள் (எளிய விளக்கம்):**

• 🟢 **பச்சை (பாதுகாப்பானது - < 1.0 ppm):** நீங்கள் முழு பாதுகாப்போடு வேலை செய்யலாம்.
• 🟡 **மஞ்சள் (எச்சரிக்கை - 1.0 முதல் 2.5 ppm):** வாயு அளவு சற்று அதிகம். கவனமாக இருக்கவும்.
• 🔴 **சிவப்பு (அபாயம் - > 2.5 ppm):** உடனே அந்த இடத்தை விட்டு வெளியேற வேண்டும்!`;
      case "हिंदी":
        return `🛡️ **गैस सुरक्षा स्तर (आसान भाषा में):**

• 🟢 **हरा (सुरक्षित - < 1.0 ppm):** आप पूरी तरह सुरक्षित हैं, काम जारी रखें।
• 🟡 **पीला (चेतावनी - 1.0 से 2.5 ppm):** गैस का स्तर थोड़ा बढ़ा है। सतर्क रहें।
• 🔴 **लाल (खतरा - > 2.5 ppm):** तुरंत जगह खाली करके बाहर आ जाएं!`;
      case "கன்னட":
      case "ಕನ್ನಡ":
        return `🛡️ **ಗ್ಯಾಸ್ ಸುರಕ್ಷತಾ ಮಟ್ಟಗಳು:**

• 🟢 **ಹಸಿರು (ಸುರಕ್ಷಿತ - < 1.0 ppm):** ನೀವು ಸಂಪೂರ್ಣವಾಗಿ ಸುರಕ್ಷಿತವಾಗಿದ್ದೀರಿ.
• 🟡 **ಹಳದಿ (ಎಚ್ಚರಿಕೆ - 1.0 ರಿಂದ 2.5 ppm):** ಗ್ಯಾಸ್ ಮಟ್ಟ ಸ್ವಲ್ಪ ಹೆಚ್ಚಿದೆ. ಎಚ್ಚರದಿಂದಿರಿ.
• 🔴 **ಕೆಂಪು (ಅಪಾಯ - > 2.5 ppm):** ತಕ್ಷಣವೇ ಸ್ಥಳ ಖಾಲಿ ಮಾಡಿ ಹೊರಬನ್ನಿ!`;
      case "മലയാളം":
        return `🛡️ **ഗ്യാസ് സുരക്ഷാ നിലവാരം (ലളിതമായി):**

• 🟢 **പച്ച (സുരക്ഷിതം - < 1.0 ppm):** നിങ്ങൾക്ക് പൂർണ്ണ സുരക്ഷിതത്വത്തോടെ ജോലി ചെയ്യാം.
• 🟡 **മഞ്ഞ (മുന്നറിയിപ്പ് - 1.0 മുതൽ 2.5 ppm):** ഗ്യാസ് നില അല്പം കൂടുതലാണ്. ശ്രദ്ധിക്കുക.
• 🔴 **ചുവപ്പ് (അപകടം - > 2.5 ppm):** ഉടൻ തന്നെ സ്ഥലം ഒഴിഞ്ഞ് മാറണം!`;
      default:
        return `🛡️ **WORKPLACE GAS SAFETY LEVELS MADE SIMPLE:**

• 🟢 **GREEN (SAFE - Under 1.00 ppm):** Totally safe to work normally.
• 🟡 **YELLOW (CAUTION - 1.00 to 2.50 ppm):** Elevated gas detected. Keep work area ventilated and stay alert.
• 🔴 **RED (DANGER - Above 2.50 ppm):** Dangerous gas level! Put on mask and evacuate immediately!`;
    }
  }

  // 6. WORKER MY READING / CURRENT EXPOSURE INQUIRY (USER'S EXACT TARGET FOR WORKERS!)
  if (
    lower.includes("reading") ||
    lower.includes("current") ||
    lower.includes("latest") ||
    lower.includes("my status") ||
    lower.includes("my dose") ||
    lower.includes("how much") ||
    lower.includes("result") ||
    lower.includes("explain") ||
    lower.includes("w-102") ||
    lower.includes("w-")
  ) {
    if (isHighDanger) {
      switch (lang) {
        case "தமிழ்":
          return `📊 **பணியாளர் ${workerStr} அவர்களின் வாயு நிலை அறிக்கை:**

• 🔴 **பாதுகாப்பு நிலை:** அபாயம்! (High Gas Exposure)
• 💨 **சராசரி வாயு அளவு:** ${twaStr} (பாதுகாப்பு வரம்பு 2.50 ppm ஐ விட அதிகம்!)
• ⏱️ **மொத்த வாயு அளவு:** ${doseVal} (${durationStr} ஷிப்ட்)

🚨 **முக்கிய அறிவுரை:** உடனடியாக பணியை நிறுத்திவிட்டு, மூச்சுக்கருவி அணிந்து பாதுகாப்பான இடத்திற்குச் செல்லவும்!`;
        case "हिंदी":
          return `📊 **कर्मचारी ${workerStr} की गैस सुरक्षा रिपोर्ट:**

• 🔴 **सुरक्षा स्थिति:** खतरा! (High Gas Exposure)
• 💨 **औसत गैस स्तर:** ${twaStr} (सुरक्षित सीमा 2.50 ppm से अधिक!)
• ⏱️ **कुल गैस सोखी गई:** ${doseVal} (${durationStr} शिफ्ट में)

🚨 **महत्वपूर्ण सलाह:** तुरंत काम रोकें, मास्क पहनें और सुरक्षित स्थान पर जाएं!`;
        case "கன்னட":
        case "ಕನ್ನಡ":
          return `📊 **ಕಾರ್ಮಿಕ ${workerStr} ಅವರ ಗ್ಯಾಸ್ ವರದಿ:**

• 🔴 **ಸುರಕ್ಷತಾ ಸ್ಥಿತಿ:** ಅಪಾಯ! (High Exposure)
• 💨 **ಸರಾಸರಿ ಗ್ಯಾಸ್ ಮಟ್ಟ:** ${twaStr} (ಸುರಕ್ಷಿತ ಮಿತಿಗಿಂತ ಹೆಚ್ಚು!)
• ⏱️ **ಒಟ್ಟು ಗ್ಯಾಸ್ ಶೇಖರಣೆ:** ${doseVal} (${durationStr} ಶಿಫ್ಟ್‌ನಲ್ಲಿ)

🚨 **ಮುಖ್ಯ ಸಲಹೆ:** ತಕ್ಷಣ ಕೆಲಸ ನಿಲ್ಲಿಸಿ, ಮಾಸ್ಕ್ ಧರಿಸಿ ಸುರಕ್ಷಿತ ಸ್ಥಳಕ್ಕೆ ತೆರಳಿ!`;
        case "മലയാളം":
          return `📊 **തൊഴിലാളി ${workerStr} യുടെ ഗ്യാസ് റിപ്പോർട്ട്:**

• 🔴 **സുരക്ഷാ നില:** അപകടം! (High Exposure)
• 💨 **ശരാശരി ഗ്യാസ് നില:** ${twaStr} (സുരക്ഷിത പരിധി കവിഞ്ഞു!)
• ⏱️ **ആകെ ഗ്യാസ് നില:** ${doseVal} (${durationStr} ഷിഫ്റ്റിൽ)

🚨 **പ്രധാന ഉപദേശം:** ഉടൻ ജോലി നിർത്തി മാസ്ക് ധരിച്ച് മാറുക!`;
        default:
          return `📊 **YOUR WORK SAFETY & GAS EXPOSURE SUMMARY (${workerStr}):**

• 🔴 **Safety Condition:** HIGH EXPOSURE HAZARD!
• 💨 **Average Gas Level:** ${twaStr} (EXCEEDS the 2.50 ppm safety limit!)
• ⏱️ **Total Gas Exposure:** ${doseVal} over ${durationStr} shift
• ❌ **Trace Status:** HAZARD ALERT

🚨 **WORK SAFETY ACTION:** Stop work immediately! Put on your breathing mask and move to the safe muster point. Report to your HSE Officer right away.`;
      }
    } else if (isModerateWarning) {
      switch (lang) {
        case "தமிழ்":
          return `📊 **பணியாளர் ${workerStr} அவர்களின் வாயு நிலை அறிக்கை:**

• 🟡 **பாதுகாப்பு நிலை:** எச்சரிக்கை (Moderate Exposure)
• 💨 **சராசரி வாயு அளவு:** ${twaStr} (எச்சரிக்கை வரம்பில் உள்ளது)
• ⏱️ **மொத்த வாயு அளவு:** ${doseVal} (${durationStr} ஷிப்ட்)

⚠️ **பாதுகாப்பு அறிவுரை:** பணி இடத்தில் காற்றோட்டத்தை அதிகரிக்கவும். விழிப்புடன் இருக்கவும்.`;
        case "हिंदी":
          return `📊 **कर्मचारी ${workerStr} की गैस सुरक्षा रिपोर्ट:**

• 🟡 **सुरक्षा स्थिति:** चेतावनी (Moderate Exposure)
• 💨 **औसत गैस स्तर:** ${twaStr} (थोड़ा बढ़ा हुआ)
• ⏱️ **कुल गैस सोखी गई:** ${doseVal} (${durationStr} शिफ्ट में)

⚠️ **सुरक्षा सलाह:** कार्यस्थल में वेंटिलेशन बढ़ाएं और सतर्क रहें।`;
        case "கன்னட":
        case "ಕನ್ನಡ":
          return `📊 **ಕಾರ್ಮಿಕ ${workerStr} ಅವರ ಗ್ಯಾಸ್ ವರದಿ:**

• 🟡 **ಸುರಕ್ಷತಾ ಸ್ಥಿತಿ:** ಎಚ್ಚರಿಕೆ (Moderate Exposure)
• 💨 **ಸರಾಸರಿ ಗ್ಯಾಸ್ ಮಟ್ಟ:** ${twaStr} (ಸ್ವಲ್ಪ ಹೆಚ್ಚಾಗಿದೆ)
• ⏱️ **ಒಟ್ಟು ಗ್ಯಾಸ್ ಶೇಖರಣೆ:** ${doseVal} (${durationStr} ಶಿಫ್ಟ್‌ನಲ್ಲಿ)

⚠️ **ಸುರಕ್ಷತಾ ಸಲಹೆ:** ಗಾಳಿ ಸಂಚಾರ ಹೆಚ್ಚಿಸಿ ಮತ್ತು ಎಚ್ಚರದಿಂದಿರಿ.`;
        case "മലയാളം":
          return `📊 **തൊഴിലാളി ${workerStr} യുടെ ഗ്യാസ് റിപ്പോർട്ട്:**

• 🟡 **സുരക്ഷാ നില:** മുന്നറിയിപ്പ് (Moderate Exposure)
• 💨 **ശരാശരി ഗ്യാസ് നില:** ${twaStr} (അല്പം കൂടുതലാണ്)
• ⏱️ **ആകെ ഗ്യാസ് നില:** ${doseVal} (${durationStr} ഷിഫ്റ്റിൽ)

⚠️ **സുരക്ഷാ ഉപദേശം:** വായുസഞ്ചാരം ഉറപ്പാക്കി ശ്രദ്ധയോടെ ജോലി ചെയ്യുക.`;
        default:
          return `📊 **YOUR WORK SAFETY & GAS EXPOSURE SUMMARY (${workerStr}):**

• 🟡 **Safety Condition:** MODERATE CAUTION
• 💨 **Average Gas Level:** ${twaStr} (Slightly elevated)
• ⏱️ **Total Gas Exposure:** ${doseVal} over ${durationStr} shift
• ⚠️ **Trace Status:** MODERATE

⚠️ **WORK SAFETY ACTION:** Increase area ventilation and stay vigilant. If gas smell worsens, move to fresh air.`;
      }
    } else {
      // SAFE CONDITION (Normal) - The exact answer for user's prompt!
      switch (lang) {
        case "தமிழ்":
          return `📊 **பணியாளர் ${workerStr} அவர்களின் பணி பாதுகாப்பு அறிக்கை:**

• 🟢 **பாதுகாப்பு நிலை:** மிகவும் பாதுகாப்பானது (SAFE)
• 💨 **சராசரி வாயு அளவு:** ${twaStr} (பாதுகாப்பான 1.00 ppm வரம்பிற்கு உட்பட்டது)
• ⏱️ **மொத்த வாயு அளவு:** ${doseVal} (${durationStr} ஷிப்ட்)
• ✅ **பேட்ஜ் நிலை:** செல்லுபடியாகும் (VALID)

👍 **பாதுகாப்பு செய்தி:** நீங்கள் முழு பாதுகாப்போடு பணியைத் தொடரலாம்!`;
        case "हिंदी":
          return `📊 **कर्मचारी ${workerStr} की कार्य सुरक्षा रिपोर्ट:**

• 🟢 **सुरक्षा स्थिति:** पूरी तरह सुरक्षित (SAFE)
• 💨 **औसत गैस स्तर:** ${twaStr} (सुरक्षित सीमा 1.00 ppm के भीतर)
• ⏱️ **कुल गैस सोखी गई:** ${doseVal} (${durationStr} शिफ्ट में)
• ✅ **बैज स्थिति:** मान्य (VALID)

👍 **सुरक्षा संदेश:** आप बिल्कुल सुरक्षित हैं, निश्चिंत होकर काम जारी रखें!`;
        case "கன்னட":
        case "ಕನ್ನಡ":
          return `📊 **ಕಾರ್ಮಿಕ ${workerStr} ಅವರ ಕೆಲಸದ ಸುರಕ್ಷತಾ ವರದಿ:**

• 🟢 **ಸುರಕ್ಷತಾ ಸ್ಥಿತಿ:** ಸಂಪೂರ್ಣ ಸುರಕ್ಷಿತ (SAFE)
• 💨 **ಸರಾಸರಿ ಗ್ಯಾಸ್ ಮಟ್ಟ:** ${twaStr} (ಸುರಕ್ಷಿತ ಮಿತಿ 1.00 ppm ಗಿಂತ ಕಡಿಮೆ)
• ⏱️ **ಒಟ್ಟು ಗ್ಯಾಸ್ ಶೇಖರಣೆ:** ${doseVal} (${durationStr} ಶಿಫ್ಟ್‌ನಲ್ಲಿ)
• ✅ **ಬ್ಯಾಡ್ಜ್ ಸ್ಥಿತಿ:** ಮಾನ್ಯವಾಗಿದೆ (VALID)

👍 **ಸುರಕ್ಷತಾ ಸಂದೇಶ:** ನೀವು ಸಂಪೂರ್ಣವಾಗಿ ಸುರಕ್ಷಿತವಾಗಿದ್ದೀರಿ, ಕೆಲಸ ಮುಂದುವರಿಸಿ!`;
        case "മലയാളം":
          return `📊 **തൊഴിലാളി ${workerStr} യുടെ തൊഴിൽ സുരക്ഷാ റിപ്പോർട്ട്:**

• 🟢 **സുരക്ഷാ നില:** പൂർണ്ണമായും സുരക്ഷിതം (SAFE)
• 💨 **ശരാശരി ഗ്യാസ് നില:** ${twaStr} (സുരക്ഷിത പരിധിക്കുള്ളിൽ)
• ⏱️ **ആകെ ഗ്യാസ് നില:** ${doseVal} (${durationStr} ഷിഫ്റ്റിൽ)
• ✅ **ബാഡ്ജ് നില:** സാധുവായത് (VALID)

👍 **സുരക്ഷാ ഉപദേശം:** നിങ്ങൾ പൂർണ്ണമായും സുരക്ഷിതനാണ്, ധൈര്യമായി ജോലി ചെയ്യാം!`;
        default:
          return `📊 **YOUR WORK SAFETY & GAS EXPOSURE SUMMARY (${workerStr}):**

• 🟢 **Gas Safety Status:** SAFE (Healthy Work Condition)
• 💨 **Average Gas Level:** ${twaStr} (Well below the 1.00 ppm safe workplace limit)
• ⏱️ **Total Gas Exposure:** ${doseVal} over your ${durationStr} shift
• ✅ **Dosimeter Badge:** VALID & Clean

👍 **WORKER SAFETY ASSESSMENT:** You are completely safe to work! Your air quality is healthy and within safe standards.`;
      }
    }
  }

  // 7. CONVERSATIONAL BOT SMART FALLBACK
  switch (lang) {
    case "தமிழ்":
      return `கேள்வி: "${query}"

• 📊 உங்கள் வாயு அளவு: ${twaStr} (நிலை: பாதுகாப்பானது)
• 🏷️ பேட்ஜ் நிலை: 🟢 செல்லுபடியாகும் (VALID)
• 💡 அவசர உதவிக்கு "அவசரம்" என்று தட்டச்சு செய்யவும்.`;
    case "हिंदी":
      return `प्रश्न: "${query}"

• 📊 आपका गैस स्तर: ${twaStr} (स्थिति: सुरक्षित)
• 🏷️ बैज स्थिति: 🟢 मान्य (VALID)
• 💡 आपात स्थिति के लिए "आपातकाल" टाइप करें।`;
    case "கன்னட":
    case "ಕನ್ನಡ":
      return `ಪ್ರಶ್ನೆ: "${query}"

• 📊 ನಿಮ್ಮ ಗ್ಯಾಸ್ ಮಟ್ಟ: ${twaStr} (ಸ್ಥಿತಿ: ಸುರಕ್ಷಿತ)
• 🏷️ ಬ್ಯಾಡ್ಜ್ ಸ್ಥಿತಿ: 🟢 ಮಾನ್ಯವಾಗಿದೆ (VALID)
• 💡 ತುರ್ತು ಸಹಾಯಕ್ಕಾಗಿ "ತುರ್ತು" ಎಂದು ಟೈಪ್ ಮಾಡಿ.`;
    case "മലയാളം":
      return `ചോദ്യം: "${query}"

• 📊 നിങ്ങളുടെ ഗ്യാസ് ലെവൽ: ${twaStr} (നില: സുരക്ഷിതം)
• 🏷️ ബാഡ്ജ് നില: 🟢 സാധുവായത് (VALID)
• 💡 അടിയന്തിര സഹായത്തിന് "അടിയന്തിരം" എന്ന് ടൈപ്പ് ചെയ്യുക.`;
    default:
      return `I received your question: "${query}"

• 🟢 **Current Gas Level:** ${twaStr} (Safe workplace condition)
• ⏱️ **Total Exposure:** ${doseVal}
• 🏷️ **Badge Status:** VALID

👍 **Summary:** You are completely safe to continue work! Type "emergency" for gas leak steps or "photos" for scanning instructions.`;
  }
}
