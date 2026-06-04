const langToggler = document.getElementById('lang-toggler');
const htmlTag = document.getElementById('theme-html');
const ltrCss = document.getElementById('bootstrap-ltr');
const rtlCss = document.getElementById('bootstrap-rtl');

// 1. Function to apply the selected language
function setLanguage(lang) {
    // Update HTML tags
    if (lang === 'ar') {
        htmlTag.setAttribute('lang', 'ar');
        htmlTag.setAttribute('dir', 'rtl');
        rtlCss.removeAttribute('disabled'); // Turn on RTL CSS
        ltrCss.setAttribute('disabled', 'true'); // Turn off LTR CSS
        langToggler.textContent = translations.ar.toggleBtn;
    } else {
        htmlTag.setAttribute('lang', 'en');
        htmlTag.setAttribute('dir', 'ltr');
        ltrCss.removeAttribute('disabled'); // Turn on LTR CSS
        rtlCss.setAttribute('disabled', 'true'); // Turn off RTL CSS
        langToggler.textContent = translations.en.toggleBtn;
    }

    // Update all elements with a [data-key] attribute
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // Save choice to local storage
    localStorage.setItem('selectedLang', lang);
}

// 2. Event Listener for the button click
langToggler.addEventListener('click', () => {
    const currentLang = htmlTag.getAttribute('lang');
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
});

// 3. Initialize on page load (Check storage or default to English)
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('selectedLang') || 'en';
    setLanguage(savedLang);
});