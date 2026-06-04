// ==========================================
// TSE INTERACTIVE ENGINE v2.0
// ==========================================

const langToggler = document.getElementById('lang-toggler');
const htmlTag = document.getElementById('theme-html');
const ltrCss = document.getElementById('bootstrap-ltr');
const rtlCss = document.getElementById('bootstrap-rtl');
const preloader = document.getElementById('preloader');
const backToTop = document.getElementById('back-to-top');
const navbar = document.getElementById('main-nav');

// ==========================================
// 1. PRELOADER
// ==========================================
function hidePreloader() {
    if (!preloader) return;
    setTimeout(() => {
        preloader.classList.add('hidden');
        // Remove from DOM after transition
        setTimeout(() => {
            if (preloader.parentNode) {
                preloader.parentNode.removeChild(preloader);
            }
        }, 600);
    }, 1400);
}

// ==========================================
// 2. LANGUAGE SYSTEM
// ==========================================
function setLanguage(lang) {
    if (typeof translations === 'undefined') {
        console.error("TSE Engine Error: translations.js failed to load.");
        return;
    }

    if (!translations[lang]) {
        console.error(`TSE Engine Error: Language '${lang}' missing in translations.js.`);
        return;
    }

    // Update HTML attributes
    if (lang === 'ar') {
        htmlTag.setAttribute('lang', 'ar');
        htmlTag.setAttribute('dir', 'rtl');
        if (rtlCss) rtlCss.removeAttribute('disabled');
        if (ltrCss) ltrCss.setAttribute('disabled', 'true');
    } else {
        htmlTag.setAttribute('lang', 'en');
        htmlTag.setAttribute('dir', 'ltr');
        if (ltrCss) ltrCss.removeAttribute('disabled');
        if (rtlCss) rtlCss.setAttribute('disabled', 'true');
    }

    // Update all data-key elements with fade transition
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        if (translations[lang][key]) {
            // Add subtle fade effect
            element.style.opacity = '0.7';
            element.style.transition = 'opacity 0.15s ease';
            
            setTimeout(() => {
                element.textContent = translations[lang][key];
                element.style.opacity = '1';
            }, 150);
        }
    });

    // Save preference
    localStorage.setItem('selectedLang', lang);
}

if (langToggler) {
    langToggler.addEventListener('click', () => {
        const currentLang = htmlTag.getAttribute('lang') || 'en';
        const newLang = currentLang === 'en' ? 'ar' : 'en';
        setLanguage(newLang);
    });
}

// ==========================================
// 3. SCROLL OBSERVER & ANIMATIONS
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
// 4. NAVBAR SCROLL BEHAVIOR
// ==========================================
let lastScrollY = window.scrollY;
let ticking = false;

function handleNavbarScroll() {
    if (!navbar) return;
    
    const currentScrollY = window.scrollY;
    
    // Add/remove scrolled class
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
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

window.addEventListener('scroll', handleBackToTop);

// ==========================================
// 6. COUNTER ANIMATION FOR STATS
// ==========================================
function animateCounter(element) {
    const target = parseFloat(element.getAttribute('data-count'));
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out cubic
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        const currentValue = startValue + (target - startValue) * easeProgress;
        
        if (Number.isInteger(target)) {
            element.textContent = Math.floor(currentValue) + suffix;
        } else {
            element.textContent = currentValue.toFixed(1) + suffix;
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

function initCounterAnimations() {
    const counters = document.querySelectorAll('[data-count]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

// ==========================================
// 7. SMOOTH SCROLL FOR ANCHOR LINKS
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// 8. ACTIVE NAV LINK HIGHLIGHTING
// ==========================================
function highlightActiveNav() {
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

window.addEventListener('scroll', highlightActiveNav);

// ==========================================
// 9. PARALLAX HERO EFFECT (subtle)
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
// 10. MOBILE MENU ENHANCEMENT
// ==========================================
const navbarToggler = document.querySelector('.navbar-toggler');
const navbarCollapse = document.querySelector('.navbar-collapse');

if (navbarToggler && navbarCollapse) {
    navbarToggler.addEventListener('click', () => {
        const isExpanded = navbarToggler.getAttribute('aria-expanded') === 'true';
        navbarToggler.setAttribute('aria-expanded', !isExpanded);
    });
    
    // Close mobile menu when clicking a link
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
// 11. INITIALIZE EVERYTHING
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Hide preloader
    hidePreloader();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize counter animations
    initCounterAnimations();
    
    // Initialize parallax
    initParallax();
    
    // Set language
    const savedLang = localStorage.getItem('selectedLang') || 'en';
    setLanguage(savedLang);
    
    // Initial navbar state
    handleNavbarScroll();
});