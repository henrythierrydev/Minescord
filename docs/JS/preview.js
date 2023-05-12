const languageMap = {
    'en': '../docs/langs/en.html',
    'es': '../docs/langs/es.html',
    'pt': '../docs/langs/pt.html',
};
  
function redirectToLanguage() {
    const userLang = navigator.language.split('-')[0];
    const defaultLang = 'en';
    const lang = languageMap[userLang] || languageMap[defaultLang];
    window.location.href = lang;
}
  
window.addEventListener("load", redirectToLanguage);