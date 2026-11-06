// Renders the Skills, Experience, Education, and Projects sections into
// index.html at build time, and toggles the résumé links based on whether
// assets/resume.pdf exists.
// Source of truth is assets/data/{skills,experience,education,projects}.yaml;
// the generated markup is injected between the BEGIN/END GENERATED comments.
// Run via `npm run render` (included in `npm run build`).

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const ROOT = path.join(__dirname, '..');
const INDEX_PATH = path.join(ROOT, 'index.html');
const RESUME_PATH = path.join(ROOT, 'assets', 'resume.pdf');
const SECTIONS = ['skills', 'experience', 'education', 'projects'];

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

function validateCareerSection(section, name) {
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

function validateSkillsSection(section) {
    if (!section || typeof section !== 'object') fail('skills.yaml did not parse to an object');
    if (!section.header) fail('skills.yaml is missing "header"');
    if (!Array.isArray(section.subsections) || section.subsections.length === 0)
        fail('skills.yaml has no subsections');
    section.subsections.forEach((item, i) => {
        if (!item.header) fail(`skills.yaml subsection ${i + 1} is missing "header"`);
        if (!Array.isArray(item.items) || item.items.length === 0)
            fail(`skills.yaml subsection ${i + 1} must have a non-empty "items" list`);
    });
}

function validateProjectsSection(section) {
    if (!section || typeof section !== 'object') fail('projects.yaml did not parse to an object');
    if (!section.header) fail('projects.yaml is missing "header"');
    if (!Array.isArray(section.subsections) || section.subsections.length === 0)
        fail('projects.yaml has no subsections');
    section.subsections.forEach((item, i) => {
        for (const field of ['header', 'url']) {
            if (!item[field]) fail(`projects.yaml subsection ${i + 1} is missing "${field}"`);
        }
        if (!Array.isArray(item.details) || item.details.length === 0)
            fail(`projects.yaml subsection ${i + 1} must have a non-empty "details" list`);
    });
    if (section.more_projects !== undefined) {
        const more = section.more_projects;
        if (!more || typeof more !== 'object' || !more.header)
            fail('projects.yaml "more_projects" must have a "header"');
        (more.featured || []).forEach((item, i) => {
            for (const field of ['header', 'url']) {
                if (!item[field]) fail(`projects.yaml more_projects.featured ${i + 1} is missing "${field}"`);
            }
            if (!Array.isArray(item.details) || item.details.length === 0)
                fail(`projects.yaml more_projects.featured ${i + 1} must have a non-empty "details" list`);
        });
        (more.links || []).forEach((item, i) => {
            for (const field of ['header', 'url']) {
                if (!item[field]) fail(`projects.yaml more_projects.links ${i + 1} is missing "${field}"`);
            }
        });
    }
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

function renderCareerSection(section) {
    const cards = section.subsections.map(renderCareerEvent).join('\n');
    return `            <div class="section-heading">
                <h2>${escapeHtml(section.header)}</h2>
            </div>
${cards}`;
}

function renderSkillsSection(section) {
    const cards = section.subsections
        .map(group => {
            const items = group.items
                .map(skill => `                            <li>${escapeHtml(skill)}</li>`)
                .join('\n');
            return `                    <div class="subsection card">
                        <h3>${escapeHtml(group.header)}</h3>
                        <ul class="skills-list">
${items}
                        </ul>
                    </div>`;
        })
        .join('\n');
    return `                    <div class="section-heading">
                        <h2>${escapeHtml(section.header)}</h2>
                    </div>
${cards}`;
}

function renderProjectCard(project) {
    const details = project.details
        .map(detail => `                            <li>${escapeHtml(detail)}</li>`)
        .join('\n');
    return `                    <div class="subsection card">
                        <h3>
                            <a href="${escapeHtml(project.url)}" target="_blank" rel="noopener noreferrer">
                                ${escapeHtml(project.header)}
                                <svg class="link-icon" viewBox="0 0 24 24" width="16" height="16" fill="none"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" aria-hidden="true">
                                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                    <path d="M14 11a5 5 0 0 0-7.54.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                </svg>
                            </a>
                        </h3>
                        <ul class="details">
${details}
                        </ul>
                    </div>`;
}

function renderMoreProjects(more) {
    if (!more) return '';
    const featured = (more.featured || [])
        .map(project => {
            const details = project.details
                .map(detail => `                                <li>${escapeHtml(detail)}</li>`)
                .join('\n');
            return `                            <h4>
                                <a href="${escapeHtml(project.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(project.header)}</a>
                            </h4>
                            <ul class="details">
${details}
                            </ul>`;
        })
        .join('\n');
    const links = (more.links || [])
        .map(item => `                                <li><a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.header)}</a></li>`)
        .join('\n');
    const linksHtml = links
        ? `\n                            <ul class="projects-list">\n${links}\n                            </ul>`
        : '';
    return `\n                    <details class="subsection card more-projects">
                        <summary>
                            <h3>${escapeHtml(more.header)}</h3>
                        </summary>
                        <div class="subsection-inner">
${featured}${linksHtml}
                        </div>
                    </details>`;
}

function renderProjectsSection(section) {
    const cards = section.subsections.map(renderProjectCard).join('\n');
    const moreHtml = renderMoreProjects(section.more_projects);
    return `                    <div class="section-heading">
                        <h2>${escapeHtml(section.header)}</h2>
                    </div>
${cards}${moreHtml}`;
}

let indexHtml = fs.readFileSync(INDEX_PATH, 'utf8');

for (const name of SECTIONS) {
    const yamlPath = path.join(ROOT, 'assets', 'data', `${name}.yaml`);
    if (!fs.existsSync(yamlPath)) fail(`missing data file: ${yamlPath}`);
    const section = yaml.load(fs.readFileSync(yamlPath, 'utf8'));

    let rendered;
    if (name === 'skills') {
        validateSkillsSection(section);
        rendered = renderSkillsSection(section);
    } else if (name === 'projects') {
        validateProjectsSection(section);
        rendered = renderProjectsSection(section);
    } else {
        validateCareerSection(section, name);
        rendered = renderCareerSection(section);
    }

    const begin = `<!-- BEGIN GENERATED ${name} -->`;
    const end = `<!-- END GENERATED ${name} -->`;
    const beginIdx = indexHtml.indexOf(begin);
    const endIdx = indexHtml.indexOf(end);
    if (beginIdx === -1 || endIdx === -1 || endIdx < beginIdx)
        fail(`markers for "${name}" not found (or malformed) in index.html`);

    const indent = name === 'skills' || name === 'projects' ? '                    ' : '            ';
    indexHtml =
        indexHtml.slice(0, beginIdx + begin.length) +
        '\n' + rendered + '\n' + indent +
        indexHtml.slice(endIdx);
}

// Toggle `hidden` on `.resume-link` elements at build time based on whether
// assets/resume.pdf exists on disk (3.1)
const hasResume = fs.existsSync(RESUME_PATH);
indexHtml = indexHtml.replace(
    /<a\b([^>]*\bclass="[^"]*\bresume-link\b[^"]*"[^>]*)>/g,
    (match, attrs) => {
        const cleanAttrs = attrs.replace(/\s+\bhidden\b/g, '');
        return hasResume ? `<a${cleanAttrs}>` : `<a${cleanAttrs} hidden>`;
    }
);

fs.writeFileSync(INDEX_PATH, indexHtml);
console.log(`render-content: ${SECTIONS.join(', ')} rendered into index.html (resume link ${hasResume ? 'enabled' : 'hidden'})`);
