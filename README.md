# bhuvankaruturi.github.io

#### Portfolio / Online resume / About me
#### view live version [here](https://bhuvankaruturi.github.io)

## How it works

Plain static site — no frameworks. The Skills, Work Experience, Education,
and Earlier Projects sections are generated from `assets/data/*.yaml` at
build time and injected into `index.html` between the
`<!-- BEGIN/END GENERATED ... -->` markers.

- **Edit content:** change the YAML files, then run `npm run build`
  (or just push — the GitHub Action renders and commits automatically).
- **Preview locally:** `npm start` (builds, then serves on localhost).
- **Résumé button:** the hero and nav résumé links are automatically enabled
  at build time when `assets/resume.pdf` exists. Drop or update your PDF at
  that path and run `npm run build`.
- **Service worker:** the cache version is bumped automatically by CI on
  every push to `master`.
