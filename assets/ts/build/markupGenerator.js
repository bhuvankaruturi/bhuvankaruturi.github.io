import education from '../data/education.json';
import experience from '../data/experience.json';
function addSectionContainer(sectionName) {
    const section = document.getElementById(`section-${sectionName}`);
    if (!section)
        return document.getElementsByTagName('body')[0];
    section.id = `section-${sectionName}`;
    const container = document.createElement('div');
    container.classList.add('section-heading');
    section.appendChild(container);
    return container;
}
function addSectionHeader(header, parentElement) {
    const headerEle = document.createElement('div');
    headerEle.classList.add('section-heading');
    headerEle.textContent = header;
    parentElement.appendChild(headerEle);
}
function createCareerEventsSection(header) {
    const container = addSectionContainer(header.toLowerCase());
    addSectionHeader(header, container);
    return container;
}
function addCareerEvent(careerEvent, container) {
    if (!container || !careerEvent)
        return;
    const titleHTML = `<div class="row justify-content-between mb-1">
        <h5 class="col-sm-9"><img class="logo" src="${careerEvent.logo}"/>${careerEvent.header}</h5>
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
    const subsectionHTML = titleHTML + subtitleHTML + detailsHTML;
    container.insertAdjacentHTML('beforeend', subsectionHTML);
}
function generateMarkup() {
    const sections = [education, experience];
    for (const section of sections) {
        const container = createCareerEventsSection(section.header);
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
