window.onscroll = function() {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
    document.getElementById("progress-bar").style.width = scrolled + "%";
}

const setObservers = function() {
    this.observers = [];
    let options = {
        root: document.querySelector('#scrollArea'),
        rootMargin: '0px',
    }
    let threshold = 0.3;
    const addRevealBar = function(entries) {
        if (entries[0].isIntersecting) {
            entries[0].target.classList.add('reveal-bar');
        } else {
            entries[0].target.classList.remove('reveal-bar');
        }
    }
    this.sectionHeadings = document.querySelectorAll('section .section-heading');
    for (let i = 0; i < sectionHeadings.length; i++) {
        let element = sectionHeadings[i];
        options.threshold = threshold;
        this.observers.push(new IntersectionObserver(addRevealBar, options));
        this.observers[i].observe(element);
    }
}

setObservers();