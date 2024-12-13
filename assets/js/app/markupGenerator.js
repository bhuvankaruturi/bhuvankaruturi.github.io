var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "js-yaml"], function (require, exports, yaml) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    yaml = __importStar(yaml);
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
    function fetchAndParseYAML(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(filePath);
            const yamlText = yield response.text();
            return yaml.load(yamlText);
        });
    }
    function generateMarkup() {
        return __awaiter(this, void 0, void 0, function* () {
            const educationData = yield fetchAndParseYAML('assets/data/education.yaml');
            const experienceData = yield fetchAndParseYAML('assets/data/experience.yaml');
            const sections = [educationData, experienceData];
            for (const section of sections) {
                const container = createCareerEventsSection(section.header, section.id);
                for (const subsection of section.subsections) {
                    addCareerEvent(subsection, container);
                }
            }
        });
    }
    document.onreadystatechange = () => {
        console.log("inside onreadystatechange");
        if (document.readyState === 'complete') {
            console.log("inside complete");
            generateMarkup();
        }
    };
});
//# sourceMappingURL=markupGenerator.js.map