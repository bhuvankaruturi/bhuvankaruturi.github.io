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
        const titleHTML = `
        <div><img class="logo mr-3" src="${careerEvent.logo}"/></div>
        <div class="row flex-fill flex-wrap justify-content-around pt-1">
            <div class="col-md d-flex flex-column align-items-start justify-content-start title">
                <p>${careerEvent.header}</p>
                <p class="font-italic font-weight-bold">${careerEvent.subtitle}</p>
            </div>
            <div class="flex-fill"></div>
            <div class="col-md d-flex flex-column location">
                <p class="">${careerEvent.location}</p>
                <p class="font-italic">${careerEvent.duration}</p>
            </div>
        </div>`;
        const careerEventHeaderHTML = `<div class="row justify-content-start flex-nowrap align-items-start mb-1 career-event-header">
        ${titleHTML}
    </div>`;
        let detailsHTML = '';
        if (careerEvent.details && careerEvent.details.length > 0) {
            detailsHTML = `<ul>${careerEvent.details.map(detail => `<li>${detail}</li>`).join('')}<//ul>`;
        }
        const subsectionHTML = `<div class="subsection">${careerEventHeaderHTML}${detailsHTML}</div>`;
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