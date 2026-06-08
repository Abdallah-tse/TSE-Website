// ==========================================
// TSE CONTACT PAGE ENGINE
// ==========================================

// ---- Product chip selector ----
const chips = document.querySelectorAll('.product-chip');
const hiddenProductInput = document.getElementById('selected-product');

chips.forEach(chip => {
    chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        if (hiddenProductInput) {
            hiddenProductInput.value = chip.getAttribute('data-value');
        }
    });
});

// ---- Client-side form validation & mailto submit ----
const form = document.getElementById('contact-form');
const successState = document.getElementById('form-success');
const submitBtn = document.getElementById('submit-btn');

if (form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // ---- Honeypot check: bots fill hidden fields, real users don't ----
        const honeypot = document.getElementById('tse-website');
        if (honeypot && honeypot.value.trim() !== '') {
            // Silently pretend to succeed — don't alert bots that they were caught
            if (submitBtn) submitBtn.disabled = true;
            setTimeout(() => {
                form.style.transition = 'opacity 0.3s ease';
                form.style.opacity = '0';
                setTimeout(() => {
                    form.hidden = true;
                    if (successState) {
                        successState.hidden = false;
                        successState.style.opacity = '0';
                        successState.style.transition = 'opacity 0.4s ease';
                        requestAnimationFrame(() => { successState.style.opacity = '1'; });
                    }
                }, 300);
            }, 400);
            return; // bail out — no mailto fired
        }

        const name    = document.getElementById('contact-name');
        const email   = document.getElementById('contact-email');
        const message = document.getElementById('contact-message');
        let valid = true;

        [name, email, message].forEach(field => {
            if (!field) return;
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                valid = false;
            } else {
                field.classList.remove('is-invalid');
            }
        });

        if (email && email.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value.trim())) {
                email.classList.add('is-invalid');
                valid = false;
            }
        }

        if (!valid) return;

        // Build mailto href
        const product  = hiddenProductInput ? hiddenProductInput.value : '';
        const company  = document.getElementById('contact-company')?.value || '';
        const phone    = document.getElementById('contact-phone')?.value || '';
        const nameVal  = name?.value || '';
        const emailVal = email?.value || '';
        const msgVal   = message?.value || '';

        const subject = encodeURIComponent(`TSE Inquiry — ${product} — ${nameVal}`);
        const body    = encodeURIComponent(
            `Name: ${nameVal}\nCompany: ${company}\nEmail: ${emailVal}\nPhone: ${phone}\nProduct Interest: ${product}\n\nMessage:\n${msgVal}`
        );

        window.location.href = `mailto:tse@tsegypt.com?subject=${subject}&body=${body}`;

        // Show success state
        if (submitBtn) submitBtn.disabled = true;
        setTimeout(() => {
            form.style.transition = 'opacity 0.3s ease';
            form.style.opacity = '0';
            setTimeout(() => {
                form.hidden = true;
                if (successState) {
                    successState.hidden = false;
                    successState.style.opacity = '0';
                    successState.style.transition = 'opacity 0.4s ease';
                    requestAnimationFrame(() => {
                        successState.style.opacity = '1';
                    });
                }
            }, 300);
        }, 400);
    });

    // Live validation: clear error on input
    form.querySelectorAll('.tse-input').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('is-invalid');
        });
    });
}

// ---- Extend translations for contact page ----
document.addEventListener('DOMContentLoaded', () => {
    if (typeof translations !== 'undefined') {
        const contactEn = {
            "contact-eyebrow": "Get In Touch",
            "contact-hero-title": "Let's Talk About Your Operation",
            "contact-hero-desc": "Our engineering team is ready to walk you through a full system demonstration — tailored to your incoming tour operation requirements.",
            "contact-info-badge": "Direct Channels",
            "contact-info-title": "Reach Our Team",
            "contact-info-desc": "Whether you need a product demo, pricing information, or technical support — we respond fast.",
            "channel-email-label": "Email Us",
            "channel-phone-label": "Call & WhatsApp",
            "phone-number": "+20 155 572 9580",
            "channel-location-label": "Our Location",
            "channel-location-value": "Cairo, Egypt",
            "contact-response-time": "Typical response within 1 business day",
            "contact-form-badge": "Send a Message",
            "contact-form-title": "Request a Demonstration",
            "contact-form-desc": "Tell us about your operation and we'll prepare a customized walkthrough of the platform.",
            "form-name-label": "Full Name",
            "form-company-label": "Company / Agency",
            "form-email-label": "Email Address",
            "form-phone-label": "Phone Number",
            "form-interest-label": "Product Interest",
            "form-message-label": "Message",
            "form-submit-label": "Send Message",
            "form-success-title": "Message Sent!",
            "form-success-desc": "Thank you for reaching out. Our team will get back to you within one business day.",
            "map-label": "Cairo, Egypt",
            "map-open": "Open in Maps ↗",
            "footer-tagline": "Software House Specialized In Travel Solutions",
            "footer-address": "Cairo, Egypt"
        };

        const contactAr = {
            "contact-eyebrow": "تواصل معنا",
            "contact-hero-title": "دعنا نتحدث عن عمليتك السياحية",
            "contact-hero-desc": "فريقنا الهندسي مستعد لتقديم عرض توضيحي شامل للنظام — مصمم خصيصاً لمتطلبات شركتك السياحية.",
            "contact-info-badge": "قنوات التواصل المباشر",
            "contact-info-title": "تواصل مع فريقنا",
            "contact-info-desc": "سواء كنت بحاجة إلى عرض توضيحي للمنتج، أو معلومات تسعير، أو دعم تقني — نحن نستجيب بسرعة.",
            "channel-email-label": "راسلنا",
            "channel-phone-label": "اتصل بنا أو واتساب",
            "phone-number": "+20 155 572 9580",
            "channel-location-label": "موقعنا",
            "channel-location-value": "القاهرة، مصر",
            "contact-response-time": "وقت الاستجابة المعتاد خلال يوم عمل واحد",
            "contact-form-badge": "أرسل رسالة",
            "contact-form-title": "اطلب عرضاً توضيحياً",
            "contact-form-desc": "أخبرنا عن عمليتك وسنُعدّ جولة توضيحية مخصصة للمنصة.",
            "form-name-label": "الاسم الكامل",
            "form-company-label": "الشركة / الوكالة",
            "form-email-label": "البريد الإلكتروني",
            "form-phone-label": "رقم الهاتف",
            "form-interest-label": "المنتج الذي تهتم به",
            "form-message-label": "الرسالة",
            "form-submit-label": "إرسال الرسالة",
            "form-success-title": "تم إرسال الرسالة!",
            "form-success-desc": "شكراً لتواصلك معنا. سيعاود فريقنا الاتصال بك خلال يوم عمل واحد.",
            "map-label": "القاهرة، مصر",
            "map-open": "فتح في الخرائط ↗",
            "footer-tagline": "شركة برمجيات متخصصة في حلول السفر",
            "footer-address": "القاهرة، مصر"
        };

        Object.assign(translations.en, contactEn);
        Object.assign(translations.ar, contactAr);

        // Re-apply current language to pick up new keys
        const currentLang = document.getElementById('theme-html')?.getAttribute('lang') || 'en';
        if (typeof setLanguage === 'function') {
            setLanguage(currentLang, true);
        }
    }
});