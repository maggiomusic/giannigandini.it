(() => {
    'use strict';

    // Header scroll effect
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        header.classList.toggle('header--scrolled', currentScroll > 50);
        lastScroll = currentScroll;
    }, { passive: true });

    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');

    hamburger.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu on link click
    nav.querySelectorAll('.header__link').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // Fade-in on scroll with Intersection Observer
    const fadeElements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    fadeElements.forEach(el => observer.observe(el));

    // "Leggi tutto" toggles
    document.querySelectorAll('.about__toggle').forEach(btn => {
        const more = btn.previousElementSibling;
        btn.addEventListener('click', () => {
            const isOpen = more.classList.toggle('open');
            btn.textContent = isOpen ? 'Leggi meno' : 'Leggi tutto';
            if (!isOpen) {
                const heading = more.previousElementSibling;
                if (heading) {
                    const headerH = header.offsetHeight;
                    const y = heading.getBoundingClientRect().top + window.scrollY - headerH - 20;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            }
        });
    });

    // Course description toggles
    document.querySelectorAll('.course-card__toggle').forEach(btn => {
        const more = btn.previousElementSibling;
        btn.addEventListener('click', () => {
            const isOpen = more.classList.toggle('open');
            btn.textContent = isOpen ? 'Leggi meno' : 'Leggi tutto';
        });
    });

    // Book description toggles
    document.querySelectorAll('.book-card__toggle').forEach(btn => {
        const desc = btn.previousElementSibling;
        btn.addEventListener('click', () => {
            const isOpen = desc.classList.toggle('open');
            btn.textContent = isOpen ? 'Leggi meno' : 'Leggi tutto';
        });
    });

    // Carousel navigation
    document.querySelectorAll('.carousel').forEach(carousel => {
        const track = carousel.querySelector('.carousel__track');
        const prevBtn = carousel.querySelector('.carousel__btn--prev');
        const nextBtn = carousel.querySelector('.carousel__btn--next');
        const counter = carousel.parentElement.querySelector('.carousel__counter');
        let current = 0;
        const items = track.querySelectorAll('.gallery__item');
        const total = items.length;

        function goTo(index) {
            const gap = parseFloat(getComputedStyle(track).gap) || 0;
            const cardWidth = items[0].offsetWidth;
            const step = cardWidth + gap;
            const trackTotal = total * cardWidth + (total - 1) * gap;
            const visible = carousel.clientWidth;
            const maxOffset = Math.max(0, trackTotal - visible);
            const maxSteps = Math.ceil(maxOffset / step);
            current = Math.max(0, Math.min(index, maxSteps));
            const offset = Math.min(current * step, maxOffset);
            track.style.transform = `translateX(-${offset}px)`;
            if (counter) {
                counter.textContent = `${current + 1} / ${maxSteps + 1}`;
            }
        }

        prevBtn.addEventListener('click', () => goTo(current - 1));
        nextBtn.addEventListener('click', () => goTo(current + 1));
    });

    // Contact form — invio tramite FormSubmit.co (AJAX)
    const form = document.getElementById('contact-form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = form.querySelector('.btn');
        const originalText = btn.textContent;
        btn.textContent = 'Invio in corso...';
        btn.disabled = true;

        const formData = new FormData(form);

        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        })
        .then((response) => {
            if (response.ok) {
                btn.textContent = 'Messaggio inviato!';
                btn.style.background = 'var(--color-warm)';
                form.reset();
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            } else {
                throw new Error('Errore invio');
            }
        })
        .catch(() => {
            btn.textContent = 'Errore. Riprova.';
            btn.style.background = '#c0392b';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        });
    });
})();
