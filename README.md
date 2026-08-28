# bhuvankaruturi.github.io

#### Portfolio / Online resume / About me
#### view live version [here](https://bhuvankaruturi.github.io)

## How it works

Plain static site — no frameworks. The Work Experience and Education sections
are generated from `assets/data/experience.yaml` and `assets/data/education.yaml`
at build time and injected into `index.html` between the
`<!-- BEGIN/END GENERATED ... -->` markers.

- **Edit content:** change the YAML files, then run `npm run build`
  (or just push — the GitHub Action renders and commits automatically).
- **Preview locally:** `npm start` (builds, then serves on localhost).
- **Résumé button:** the hero and nav have a résumé link that stays hidden
  until `assets/resume.pdf` exists. Drop your PDF at that path to enable it.
- **Service worker:** the cache version is bumped automatically by CI on
  every push to `master`.
