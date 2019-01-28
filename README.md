# Mobile Web Specialist Certification Course
---

## Project Overview:

The **Restaurant Reviews** is a static webpage converted to a mobile-ready web application.

1. Responsive DSIGN on different sized displays.
2. Accessible for screen reader use with aria descriptive atributes.
3. Registerd service worker for content chashing.
4. Vanilla JavaScript

### Specification

CSS HTML
- adaptive grid with flexible cards
- responsive images for 200,400,800 pixels
- aria descriptive tags

JavaScript
- focus on filter when page load

Leaflet.js
- custom leaflet map markers with shadows and colors on focus
- updated leaflet version to 1.4.0


### How to start?

1. In this folder, start up a simple HTTP server to serve up the site files on your local computer. Python has some simple tools to do this, and you don't even need to know Python. For most people, it's already installed on your computer.

    * In a terminal, check the version of Python you have: `python -V`. If you have Python 2.x, spin up the server with `python -m SimpleHTTPServer 8000` (or some other port, if port 8000 is already in use.) For Python 3.x, you can use `python3 -m http.server 8000`. If you don't have Python installed, navigate to Python's [website](https://www.python.org/) to download and install the software.
   * Note -  For Windows systems, Python 3.x is installed as `python` by default. To start a Python 3.x server, you can simply enter `python -m http.server 8000`.
2. With your server running, visit the site: `http://localhost:8000`,


## Leaflet.js and Mapbox:

This repository uses [leafletjs](https://leafletjs.com/) with [Mapbox](https://www.mapbox.com/). You need to replace `<your MAPBOX API KEY HERE>` with a token from [Mapbox](https://www.mapbox.com/). Mapbox is free to use, and does not require any payment information.

### Note about ES6

Most of the code in this project has been written to the ES6 JavaScript specification for compatibility with modern web browsers and future-proofing JavaScript code.
