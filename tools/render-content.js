// Renders the Experience and Education sections into index.html at build time.
// Source of truth is assets/data/{experience,education}.yaml; the generated
// markup is injected between the BEGIN/END GENERATED marker comments.
// Run via `npm run render` (included in `npm run build`).

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const ROOT = path.join(__dirname, '..');
const INDEX_PATH = path.join(ROOT, 'index.html');
const SECTIONS = ['experience', 'education'];

function fail(message) {
    console.error(`render-content: ${message}`);
    process.exit(1);
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function validateSection(section, name) {
    if (!section || typeof section !== 'object') fail(`${name}.yaml did not parse to an object`);
    if (!section.header) fail(`${name}.yaml is missing "header"`);
    if (!Array.isArray(section.subsections) || section.subsections.length === 0)
        fail(`${name}.yaml has no subsections`);
    section.subsections.forEach((item, i) => {
        for (const field of ['header', 'logo', 'location', 'subtitle', 'duration']) {
            if (!item[field]) fail(`${name}.yaml subsection ${i + 1} is missing "${field}"`);
        }
        if (item.details !== undefined && !Array.isArray(item.details))
            fail(`${name}.yaml subsection ${i + 1}: "details" must be a list`);
        if (!fs.existsSync(path.join(ROOT, item.logo)))
            fail(`${name}.yaml subsection ${i + 1}: logo file not found: ${item.logo}`);
    });
}

function renderCareerEvent(event) {
    const details = (event.details || [])
        .map(detail => `                    <li>${escapeHtml(detail)}</li>`)
        .join('\n');
    const detailsHtml = details
        ? `\n                <ul class="details">\n${details}\n                </ul>`
        : '';
    return `            <article class="subsection card">
                <div class="career-event-header">
                    <img class="logo" src="${escapeHtml(event.logo)}" alt="${escapeHtml(event.header)} logo" width="64" height="64" loading="lazy">
                    <div class="title">
                        <h3>${escapeHtml(event.header)}</h3>
                        <p class="role">${escapeHtml(event.subtitle)}</p>
                    </div>
                    <div class="meta">
                        <p class="place">${escapeHtml(event.location)}</p>
                        <p class="dates">${escapeHtml(event.duration)}</p>
                    </div>
                </div>${detailsHtml}
            </article>`;
}

function renderSection(section) {
    const cards = section.subsections.map(renderCareerEvent).join('\n');
    return `            <div class="section-heading">
                <h2>${escapeHtml(section.header)}</h2>
            </div>
${cards}`;
}

let indexHtml = fs.readFileSync(INDEX_PATH, 'utf8');

for (const name of SECTIONS) {
    const yamlPath = path.join(ROOT, 'assets', 'data', `${name}.yaml`);
    if (!fs.existsSync(yamlPath)) fail(`missing data file: ${yamlPath}`);
    const section = yaml.load(fs.readFileSync(yamlPath, 'utf8'));
    validateSection(section, name);

    const begin = `<!-- BEGIN GENERATED ${name} -->`;
    const end = `<!-- END GENERATED ${name} -->`;
    const beginIdx = indexHtml.indexOf(begin);
    const endIdx = indexHtml.indexOf(end);
    if (beginIdx === -1 || endIdx === -1 || endIdx < beginIdx)
        fail(`markers for "${name}" not found (or malformed) in index.html`);

    indexHtml =
        indexHtml.slice(0, beginIdx + begin.length) +
        '\n' + renderSection(section) + '\n            ' +
        indexHtml.slice(endIdx);
}

fs.writeFileSync(INDEX_PATH, indexHtml);
console.log('render-content: Experience and Education rendered into index.html');
