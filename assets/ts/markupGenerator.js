var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "../data/education", "../data/experience"], function (require, exports, education_1, experience_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    education_1 = __importDefault(education_1);
    experience_1 = __importDefault(experience_1);
    function addSectionContainer(id) {
        const section = document.getElementById(`section-${id}`);
        if (!section)
            return document.getElementsByTagName('body')[0];
        const container = document.createElement('div');
        container.classList.add('container');
        section.appendChild(container);
        return container;
    }
    function addSectionHeader(header, parentElement) {
        const headerEle = document.createElement('div');
        headerEle.classList.add('section-heading');
        headerEle.textContent = header;
        parentElement.appendChild(headerEle);
    }
    function createCareerEventsSection(header, id) {
        const container = addSectionContainer(id);
        addSectionHeader(header, container);
        return container;
    }
    function addCareerEvent(careerEvent, container) {
        if (!container || !careerEvent)
            return;
        const titleHTML = `<div class="row justify-content-between mb-1">
        <h5 class="col-sm-9"><img class="logo mr-2" src="${careerEvent.logo}"/>${careerEvent.header}</h5>
        <p class="col-sm pt-2">${careerEvent.location}</p>
    </div>`;
        const subtitleHTML = `<div class="row justify-content-between mb-1">
        <p class="col-sm-9 font-italic my-0 font-weight-bold">${careerEvent.subtitle}</p>
        <p class="col-sm font-italic my-0">${careerEvent.duration}</p>
    </div>`;
        let detailsHTML = '';
        if (careerEvent.details && careerEvent.details.length > 0) {
            detailsHTML = `<ul>${careerEvent.details.map(detail => `<li>${detail}</li>`).join('')}<//ul>`;
        }
        const subsectionHTML = `<div class="subsection">${titleHTML}${subtitleHTML}${detailsHTML}</div>`;
        container.insertAdjacentHTML('beforeend', subsectionHTML);
    }
    function generateMarkup() {
        const sections = [education_1.default, experience_1.default];
        for (const section of sections) {
            const container = createCareerEventsSection(section.header, section.id);
            for (const subsection of section.subsections) {
                addCareerEvent(subsection, container);
            }
        }
    }
    document.onreadystatechange = () => {
        if (document.readyState === 'complete') {
            generateMarkup();
        }
    };
});
//# sourceMappingURL=markupGenerator.js.map