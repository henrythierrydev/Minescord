const languageMap = {
    'en': './langs/en.html',
    'es': './langs/es.html',
    'pt': './langs/pt.html',
};
  
function redirectToLanguage() {
    const userLang = navigator.language.split('-')[0];
    const defaultLang = 'en';
    const lang = languageMap[userLang] || languageMap[defaultLang];
    window.location.href = lang;
}
  
window.addEventListener("load", redirectToLanguage);