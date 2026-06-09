// ==========================================
// TSE INTERACTIVE ENGINE v3.1 — Optimized
// ==========================================

const langToggler = document.getElementById('lang-toggler');
const htmlTag = document.documentElement;
const ltrCss = document.getElementById('bootstrap-ltr');
const rtlCss = document.getElementById('bootstrap-rtl');
const navbar = document.getElementById('main-nav');
const backToTop = document.getElementById('back-to-top');

// Cache for translations to avoid repeated DOM queries
let translationCache = null;
let currentLang = 'en';

// ==========================================
// 1. LANGUAGE SYSTEM — Instant Synchronous Switch
// ==========================================
function setLanguage(lang, immediate = false) {
    if (typeof translations === 'undefined') {
        console.error("TSE Engine Error: translations.js failed to load.");
        return;
    }
    if (!translations[lang]) {
        console.error(`TSE Engine Error: Language '${lang}' missing in translations.js.`);
        return;
    }

    // Skip if already active
    if (currentLang === lang && !immediate) return;
    currentLang = lang;

    const t = translations[lang];
    const isRTL = lang === 'ar';

    // --- Everything is one synchronous batch: zero rAF, zero timeouts ---
    // The browser won't paint mid-batch, so there is no visible intermediate state.

    // 1. Direction + lang attribute
    htmlTag.setAttribute('lang', isRTL ? 'ar' : 'en');
    htmlTag.setAttribute('dir', isRTL ? 'rtl' : 'ltr');

    // 2. Bootstrap stylesheet swap via media (already parsed, just toggled)
    if (ltrCss) ltrCss.media = isRTL ? 'none' : 'all';
    if (rtlCss) rtlCss.media = isRTL ? 'all' : 'none';

    // 3. All text updates in one pass
    document.querySelectorAll('[data-key]').forEach(el => {
        const val = t[el.getAttribute('data-key')];
        if (val) el.textContent = val;
    });

    localStorage.setItem('selectedLang', lang);
}

if (langToggler) {
    langToggler.addEventListener('click', () => {
        const newLang = currentLang === 'en' ? 'ar' : 'en';
        setLanguage(newLang, false);
    });
}

// ==========================================
// 2. SCROLL OBSERVER & ANIMATIONS
// ==========================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => scrollObserver.observe(el));
}

// ==========================================
// 3. NAVBAR SCROLL BEHAVIOR
// ==========================================
let lastScrollY = window.scrollY;
let ticking = false;

function handleNavbarScroll() {
    if (!navbar) return;
    const currentScrollY = window.scrollY;
    if (currentScrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    lastScrollY = currentScrollY;
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(handleNavbarScroll);
        ticking = true;
    }
});

// ==========================================
// 4. STATS DISPLAY
// ==========================================
function initStatsDisplay() {
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach(element => {
        const target = parseFloat(element.getAttribute('data-count'));
        const suffix = element.getAttribute('data-suffix') || '';
        if (!isNaN(target)) {
            element.textContent = (Number.isInteger(target) ? target : target.toFixed(1)) + suffix;
        }
    });
}

// ==========================================
// 5. BACK TO TOP BUTTON
// ==========================================
function handleBackToTop() {
    if (!backToTop) return;
    if (window.scrollY > 600) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}

if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

window.addEventListener('scroll', handleBackToTop);

// ==========================================
// 6. SMOOTH SCROLL FOR ANCHOR LINKS
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    });
});

// ==========================================
// 7. ACTIVE NAV LINK HIGHLIGHTING
// ==========================================
const activePageHref = document.body.getAttribute('data-active-page');

function highlightActiveNav() {
    if (activePageHref) return;
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentSection ||
            (currentSection === '' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        }
    });
}

function setFixedActiveNav() {
    if (!activePageHref) return;
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === activePageHref);
    });
}

window.addEventListener('scroll', highlightActiveNav);

// ==========================================
// 8. PARALLAX HERO EFFECT
// ==========================================
function initParallax() {
    const hero = document.querySelector('.blended-hero-zone');
    if (!hero) return;
    const orbs = hero.querySelectorAll('.hero-orb');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const rate = scrollY * 0.3;
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.1;
            orb.style.transform = `translateY(${rate * speed}px)`;
        });
    });
}

// ==========================================
// 9. MOBILE MENU ENHANCEMENT
// ==========================================
const navbarToggler = document.querySelector('.navbar-toggler');
const navbarCollapse = document.querySelector('.navbar-collapse');

if (navbarToggler && navbarCollapse) {
    navbarToggler.addEventListener('click', () => {
        const isExpanded = navbarToggler.getAttribute('aria-expanded') === 'true';
        navbarToggler.setAttribute('aria-expanded', !isExpanded);
    });

    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 992) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }
        });
    });
}

// ==========================================
// 10. INITIALIZE EVERYTHING
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initParallax();
    initStatsDisplay();

    const savedLang = localStorage.getItem('selectedLang') || 'en';
    setLanguage(savedLang, true); // instant, no animation

    handleNavbarScroll();
    setFixedActiveNav();
    htmlTag.classList.remove('lang-loading');
});