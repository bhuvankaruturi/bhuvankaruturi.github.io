import education from '../data/education';
import experience from '../data/experience';
import { CareerEvent } from './types/CareerEvent';

function addSectionContainer(id: string): HTMLElement {
    const section = document.getElementById(`section-${id}`);
    if (!section)
        return document.getElementsByTagName('body')[0];
    const container = document.createElement('div');
    container.classList.add('container');
    section.appendChild(container);
    return container;
}

function addSectionHeader(header: string, parentElement: HTMLElement) {
    const headerEle = document.createElement('div');
    headerEle.classList.add('section-heading');
    headerEle.textContent = header;
    parentElement.appendChild(headerEle);
}

function createCareerEventsSection(header: string, id: string): HTMLElement {
    const container = addSectionContainer(id);
    addSectionHeader(header, container);
    return container;
}

function addCareerEvent(careerEvent: CareerEvent, container: HTMLElement) {
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
        </div>`
    const careerEventHeaderHTML = `<div class="row justify-content-start flex-nowrap align-items-start mb-1 career-event-header">
        ${titleHTML}
    </div>`
    let detailsHTML = '';
    if (careerEvent.details && careerEvent.details.length > 0) {
        detailsHTML = `<ul>${careerEvent.details.map(detail => `<li>${detail}</li>`).join('')}<//ul>`
    }
    const subsectionHTML = `<div class="subsection">${careerEventHeaderHTML}${detailsHTML}</div>`;
    container.insertAdjacentHTML('beforeend', subsectionHTML);
}

function generateMarkup() {
    const sections = [education, experience];
    for (const section of sections) {
        const container = createCareerEventsSection(section.header, section.id);
        for (const subsection of section.subsections) {
            addCareerEvent(subsection as CareerEvent, container);
        }
    }
}

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        generateMarkup();
    }
}