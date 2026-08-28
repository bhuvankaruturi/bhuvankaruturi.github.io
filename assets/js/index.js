// Progressive enhancement for the portfolio page: service worker, scroll
// progress, heading reveals, sticky nav state, hero peek, resume link.

// service worker for offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/sw_cache_site.js')
            .catch(() => console.error('Service worker registration error'));
    });
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// scroll progress bar (rAF-throttled)
const progressBar = document.getElementById('progress-bar');
let progressTicking = false;
window.addEventListener('scroll', () => {
    if (progressTicking) return;
    progressTicking = true;
    requestAnimationFrame(() => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        progressBar.style.width = height > 0 ? `${(scrollTop / height) * 100}%` : '0%';
        progressTicking = false;
    });
}, { passive: true });

const sections = document.querySelectorAll('main section[id]');

// heading reveal: play once per section, then stop watching (F7)
const revealObserver = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.querySelector('.section-heading')?.classList.add('reveal-bar');
        observer.unobserve(entry.target);
    }
}, { threshold: 0.2 });
sections.forEach(section => revealObserver.observe(section));

// sticky nav: shown once the hero is mostly out of view, with the link for
// the section nearest the middle of the viewport highlighted (F11)
const nav = document.getElementById('site-nav');
const hero = document.getElementById('hero');
const scrollCue = document.querySelector('.scroll-cue');

new IntersectionObserver(entries => {
    const heroVisible = entries[0].isIntersecting;
    nav.classList.toggle('visible', !heroVisible);
    scrollCue.classList.toggle('hidden', !heroVisible);
}, { threshold: 0.15 }).observe(hero);

const navObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        nav.querySelectorAll('a').forEach(link =>
            link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    }
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(section => navObserver.observe(section));

// hero peek: one shot, only if the visitor is still at the top (F10)
if (!prefersReducedMotion) {
    setTimeout(() => {
        if (window.scrollY === 0) {
            const page = document.getElementById('page');
            page.classList.add('squeeze');
            page.addEventListener('animationend', () => page.classList.remove('squeeze'), { once: true });
        }
    }, 2500);
}

// resume links stay hidden until assets/resume.pdf actually exists
fetch('assets/resume.pdf', { method: 'HEAD' })
    .then(response => {
        if (!response.ok) return;
        document.querySelectorAll('.resume-link').forEach(link => link.hidden = false);
    })
    .catch(() => { /* keep hidden */ });
