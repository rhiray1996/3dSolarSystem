# 3dSolarSystem

Interactive 3D visualization of the solar system powered by [Three.js](https://threejs.org). The project renders the Sun, planets and many moons and lets you explore them in either an artistic or realistic scale.

## Features

- **System & Planet Views** – switch between a wide system view and following the currently selected body.
- **Simulation Controls** – sliders adjust time scale, orbit speed and rotation speed.
- **Visual Settings** – tweak planet size, orbit size and camera distance; toggle orbits, labels, stars and realistic lighting.
- **Lighting Controls** – change sun intensity and ambient light.
- **Quick Navigation & Info** – panel with buttons for each planet/moon and detailed information sections.
- **Gemini API integration** for generating fun facts and mission logs about the selected object (requires Google API key).
- **Keyboard shortcuts** for common actions, such as switching views, resetting the camera, pausing time and toggling the control panel.
- **Mouse controls** – left drag to rotate, right drag to pan and scroll to zoom.

## Getting Started

1. Start a simple local server:

   ```bash
   python3 -m http.server
   ```

2. Open `http://localhost:8000/index.html` in a modern web browser.  
   The page retrieves Three.js from a CDN, so an internet connection is required.

### Gemini API (optional)

To enable the “Cosmic Insights” buttons, supply a Google Generative Language API key by replacing the empty `apiKey` string in `index.html` or injecting it when serving the page.

## License

This project has no license specified.

