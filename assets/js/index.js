// adding service workers for offline loading
// check if the browser supports service workers
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
                .register('/sw_cache_site.js')
                .then(reg => console.log("Service worker registered"))
                .catch(err => console.error("Service worker registration error"))
    })
}

// function to update the progress bar at the top of the page
window.onscroll = function() {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
    document.getElementById("progress-bar").style.width = scrolled + "%";
}

// observers for each section to add animations when
// the particular sections enters or leaves the view port
const setObservers = function() {
    this.observers = [];
    let options = {
        root: document.querySelector('#scrollArea'),
        rootMargin: '0px',
    }
    let threshold = 0.2;
    const addRevealBar = function(entries) {
        let sectionHeading = entries[0].target.getElementsByClassName("section-heading")[0];
        if (entries[0].isIntersecting && sectionHeading) {
            sectionHeading.classList.add('reveal-bar');
        } else if (sectionHeading) {
            sectionHeading.classList.remove('reveal-bar');
        }
    }
    this.sectionHeadings = document.querySelectorAll('section');
    for (let i = 0; i < sectionHeadings.length; i++) {
        let element = sectionHeadings[i];
        options.threshold = threshold;
        this.observers.push(new IntersectionObserver(addRevealBar, options));
        this.observers[i].observe(element);
    }
}

setObservers();