const langToggler = document.getElementById('lang-toggler');
const htmlTag = document.getElementById('theme-html');
const ltrCss = document.getElementById('bootstrap-ltr');
const rtlCss = document.getElementById('bootstrap-rtl');

// 1. Function to apply the selected language
function setLanguage(lang) {
    // SAFETY GUARD: Prevent script from crashing if translations.js failed to load or has path errors
    if (typeof translations === 'undefined') {
        console.error("TSE Engine Error: 'js/translations.js' file failed to load. Check your file path structure.");
        return;
    }

    if (!translations[lang]) {
        console.error(`TSE Engine Error: Language dictionary for '${lang}' is missing inside translations.js.`);
        return;
    }

    // Update HTML tags
    if (lang === 'ar') {
        htmlTag.setAttribute('lang', 'ar');
        htmlTag.setAttribute('dir', 'rtl');
        if (rtlCss) rtlCss.removeAttribute('disabled'); // Turn on RTL CSS
        if (ltrCss) ltrCss.setAttribute('disabled', 'true'); // Turn off LTR CSS
        if (langToggler) langToggler.textContent = translations.ar.toggleBtn;
    } else {
        htmlTag.setAttribute('lang', 'en');
        htmlTag.setAttribute('dir', 'ltr');
        if (ltrCss) ltrCss.removeAttribute('disabled'); // Turn on LTR CSS
        if (rtlCss) rtlCss.setAttribute('disabled', 'true'); // Turn off RTL CSS
        if (langToggler) langToggler.textContent = translations.en.toggleBtn;
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
if (langToggler) {
    langToggler.addEventListener('click', () => {
        const currentLang = htmlTag.getAttribute('lang') || 'en';
        const newLang = currentLang === 'en' ? 'ar' : 'en';
        setLanguage(newLang);
    });
}

// 3. Initialize on page load
document.addEventListener('DOMContentLoaded', () => {

    // --- STEP A: RUN SCROLL ANIMATIONS IMMEDIATELY ---
    // Running this first ensures your content becomes visible even if language files fail to load
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        root: null,      // Use the browser viewport
        rootMargin: '0px',
        threshold: 0.1   // Trigger when 10% of the element is visible
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop tracking once visible
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => scrollObserver.observe(el));

    // --- STEP B: INITIALIZE TRANSLATION ENGINE ---
    const savedLang = localStorage.getItem('selectedLang') || 'en';
    setLanguage(savedLang);
});