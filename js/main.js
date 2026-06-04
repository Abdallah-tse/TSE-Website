/* ============================================
   TSE - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    
    // --- Navbar Scroll Effect ---
    const nav = document.getElementById('mainNav');
    function updateNav() {
        if (window.scrollY > 20) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', updateNav);
    updateNav();

    // --- Active Nav Link Highlighting ---
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // --- Mobile Menu: Close on Link Click ---
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const navbarCollapse = document.getElementById('navMenu');
            if (navbarCollapse.classList.contains('show')) {
                bootstrap.Collapse.getInstance(navbarCollapse).hide();
            }
        });
    });

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal-up');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Language Toggle (EN / AR) ---
    const langToggle = document.getElementById('langToggle');
    const htmlEl = document.documentElement;
    
    // Translations
    const translations = {
        ar: {
            nav_home: 'الرئيسية',
            nav_products: 'المنتجات',
            nav_faq: 'الأسئلة الشائعة',
            nav_contact: 'تواصل معنا',
            hero_title: 'حلول برمجية لصناعة السفر',
            hero_desc: 'منذ عام 2003، تقدم شركة حلول السفر المصرية أنظمة أتمتة موثوقة وفعالة لمنظمي الرحلات الوافدة ومديري الأرضيات.',
            btn_products: 'استكشف المنتجات',
            btn_contact: 'تواصل معنا',
            customers_title: 'يثق بنا كبار منظمي الرحلات',
            customers_desc: 'أنظمتنا تدعم بعض أكثر العلامات التجارية السياحية موثوقية في مصر.',
            tech_title: 'التقنيات التي نستخدمها',
            tech_desc: 'مبنية على تقنيات مؤسسية مجربة.',
            cta_title: 'هل أنت مستعد لتبسيط عملياتك؟',
            cta_desc: 'اكتشف كيف يمكن لـ ITOMS تحويل أعمال منظم الرحلات الخاص بك.',
            prod_header: 'منتجاتنا',
            prod_sub: 'حلول متكاملة شاملة مصممة خصيصًا لمنظمي الرحلات الوافدة ومديري الأرضيات.',
            itoms_desc: 'نظام إدارة منظمي الرحلات الوافدة — نظام شامل للدعم والحجز والإدارة يعتمد على أحدث التقنيات وخبرة عميقة في صناعة السفر.',
            arch_title: 'نظام الأرشفة',
            arch_desc: 'مدمج بالكامل مع ITOMS، يقضي حل الأرشفة لدينا على هدر الورق، ويوفر المساحة الفعلية، ويضع كل مستند في متناول يدك.',
            b2b_desc: 'تطبيق ويب يبسط ويؤتمت عملية الحجز والحجز لخدمات السفر والسياحة في جميع أنحاء مصر.',
            vision_title: 'رؤيتنا',
            vision_desc: 'التزويد المستمر ببرمجيات متقدمة وموثوقة تمكن شركات السفر من العمل بأقصى درجات الكفاءة وأقل النفقات العامة.',
            faq_header: 'الأسئلة الشائعة',
            faq_sub: 'إجابات سريعة على الأسئلة الشائعة.',
            contact_header: 'تواصل معنا',
            contact_sub: 'نحن جاهزون لدعم عملك.',
            form_title: 'أرسل رسالة',
            form_name: 'الاسم',
            form_email: 'البريد الإلكتروني',
            form_message: 'الرسالة',
            form_send: 'إرسال الرسالة',
            form_note: 'سيفتح هذا تطبيق البريد الافتراضي لديك. للحصول على رد أسرع، اتصل بنا أو راسلنا عبر واتساب.'
        }
    };

    let currentLang = localStorage.getItem('tse-lang') || 'en';

    function applyLanguage(lang) {
        if (lang === 'ar') {
            htmlEl.setAttribute('lang', 'ar');
            htmlEl.setAttribute('dir', 'rtl');
            if (langToggle) langToggle.textContent = 'English';
        } else {
            htmlEl.setAttribute('lang', 'en');
            htmlEl.setAttribute('dir', 'ltr');
            if (langToggle) langToggle.textContent = 'العربية';
        }

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            } else if (lang === 'en') {
                // Restore original English text stored in data attribute if available
                if (el.hasAttribute('data-i18n-en')) {
                    el.textContent = el.getAttribute('data-i18n-en');
                }
            }
        });

        // Store original English text on first run
        if (!window.i18nInitialized) {
            document.querySelectorAll('[data-i18n]').forEach(el => {
                if (!el.hasAttribute('data-i18n-en')) {
                    el.setAttribute('data-i18n-en', el.textContent);
                }
            });
            window.i18nInitialized = true;
        }

        localStorage.setItem('tse-lang', lang);
    }

    // Store original English text
    if (!window.i18nInitialized) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            el.setAttribute('data-i18n-en', el.textContent);
        });
        window.i18nInitialized = true;
    }

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            currentLang = currentLang === 'en' ? 'ar' : 'en';
            applyLanguage(currentLang);
        });
    }

    // Apply saved language
    if (currentLang === 'ar') {
        applyLanguage('ar');
    }

    // --- Contact Form Basic Handling ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const name = this.querySelector('[name="name"]').value.trim();
            const email = this.querySelector('[name="email"]').value.trim();
            const message = this.querySelector('[name="message"]').value.trim();
            
            if (!name || !email || !message) {
                e.preventDefault();
                alert(currentLang === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields.');
                return false;
            }
        });
    }

});