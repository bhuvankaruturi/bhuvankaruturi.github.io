requirejs.config({
    "baseUrl": "assets/js",
    "paths": {
        "js-yaml": "https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min"
    }
});

// Load the main app module to start the app
requirejs(["app/markupGenerator"]);