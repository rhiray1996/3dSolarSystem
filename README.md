# 3dSolarSystem
3D Solar System SImulator 

# 3dSolarSystem — Interactive 3D Solar System (Three.js r128)

Interactive Solar System built with Three.js (r128). Two **modes** (Artistic vs Realistic), two **views** (System vs Planet), orbit animation, planet/moon selection, quick navigation, tweakable lighting, and optional Gemini fun‑fact/mission‑log buttons.

**Main file:** `index.html`  ·  **CDN deps:** `three.min.js@r128`, `OrbitControls.js@r128`

---

## Contents
- [What you see](#what-you-see)
- [How to use](#how-to-use)
- [Modes](#modes)
- [Views](#views)
- [Controls (sliders, buttons, checkboxes)](#controls-sliders-buttons-checkboxes)
- [Per‑planet editing (Modify Planet)](#per-planet-editing-modify-planet)
- [Interactions (clicking, quick nav, keyboard)](#interactions-clicking-quick-nav-keyboard)
- [Animation & math](#animation--math)
- [Data & constants](#data--constants)
- [Gemini integration](#gemini-integration)
- [Performance notes](#performance-notes)
- [Known limitations](#known-limitations)
- [Roadmap](#roadmap)

---

## What you see
- **Planets** – colored `MeshPhongMaterial` spheres (Sun has emissive).
- **Moons** – children of their parent planet (local orbits).
- **Orbits** – **`THREE.LineLoop`** circles (planets **and** moons).
- **Saturn’s rings** – `RingGeometry` mesh with alpha.
- **Stars** – ~40k `THREE.Points`.
- **Labels** – `CanvasTexture` name sprites that scale with distance and can auto‑hide when occluded.
- **UI** – Right control panel, top view toggle, left info panel, status pill.

---

## How to use
- **Rotate:** left click + drag
- **Pan:** right click + drag
- **Zoom:** scroll
- **Select:** click a planet or moon → opens info & enables per‑planet edits
- **Follow:** select a body, then **Planet View** (camera follows it)

> Tip: A small drag threshold (~5 px) prevents misclicks while orbiting the camera.

---

## Modes

### Artistic (default)
- **Scales:** Friendly values from `planetData.radius` and `planetData.distance`.
- **Adjustable:** Planet Size, Orbit Size, Sun Intensity (global), plus per‑planet edits.
- **Lighting:** Balanced; Sun is a PointLight with adjustable intensity.

### Realistic
- **Scales:**
  - Planet radius = `realisticRadiusKM * REALISTIC_RADIUS_SCALE` (1 unit = 10,000 km)
  - Orbit radius = `realisticDistanceAU * REALISTIC_DISTANCE_SCALE` (1 AU = 1500 units)
  - Moon distance = `realisticDistanceKM * KM_TO_UNIT_SCALE`
- **Locked:** Planet Size, Orbit Size, Sun Intensity sliders are disabled.
- **Lighting/Exposure:** Tuned for large scale.

Switch via **Simulation Mode** → **Artistic** / **Realistic** buttons.

---

## Views

### System View
- Free camera around the whole system.
- **Camera Distance** slider moves the camera along the **target → camera** vector (smooth; no jumps).
- Buttons: **Focus on Sun**, **Reset Camera**.

### Planet View
- Select a body → click **Planet View**.
- Camera **follows** the selected body (keeps relative offset as it orbits).
- **Auto‑rotate is disabled** on entry to prevent drift.
- Status pill shows: *Following {name}*.

Top‑center buttons switch **System View / Planet View** anytime.

---

## Controls (sliders, buttons, checkboxes)

### Time & Animation
| Control | Range | Step | Default | Mode | Effect |
|---|---:|---:|---:|---|---|
| **Time Scale** | 0 → 10 | 0.1 | 1.0 | Both | Global simulation speed (0 pauses). |
| **Orbit Speed** | 0 → 5 | 0.1 | 1.0 | Both | Multiplies all orbital angular velocities. |
| **Rotation Speed** | 0 → 5 | 0.1 | 1.0 | Both | Multiplies all planetary spins. |

### Visual Settings *(Artistic mode only)*
| Control | Range | Step | Default | Effect |
|---|---:|---:|---:|---|
| **Planet Size** | 0.5 → 3.0 | 0.1 | 1.0 | Scales all planets (stacks with per‑planet Size). |
| **Orbit Size** | 0.5 → 2.0 | 0.1 | 1.0 | Scales all **planet** orbit radii (artistic distances only). |
| **Camera Distance** | 25 → 300 | 5 | 100 | Camera distance in System View (along target→camera). |

### Display Options
- **Show Orbits** *(on)* — toggles planet & moon orbit **LineLoop**s.
- **Show Labels** *(on)* — toggles name sprites.
- **Show Stars** *(on)* — toggles starfield.
- **Realistic Lighting** *(on)* — low ambient when on; brighter ambient when off.
- **Hide Labels When Occluded** *(on)* — hides labels if any body is between the camera and the label.

### Lighting
| Control | Range | Step | Default | Mode | Effect |
|---|---:|---:|---:|---|---|
| **Sun Intensity** | 0.0 → 5.0 | 0.1 | 2.0 | Artistic | Sun PointLight intensity. |
| **Ambient Light** | 0.00 → 0.30 | 0.01 | 0.05 | Both | Scene ambient brightness. |

### Camera Actions
- **Focus on Sun** — Smooth focus animation to the Sun.
- **Reset Camera** — Smooth animation to the default vantage.

### Simulation Mode
- **Artistic / Realistic** — Button toggle at top of the control panel.

---

## Per‑planet editing (Modify Planet)
Visible when a **planet** is selected (hidden for moons).

| Control | Range | Step | Default | Notes |
|---|---:|---:|---:|---|
| **Size** | 0.5 → 3.0 | 0.1 | 1.0 | Multiplies this planet’s mesh (stacks with global Planet Size in Artistic). |
| **Rotation Speed** | 0 → 5 | 0.1 | 1.0 | Per‑planet spin multiplier. |
| **Orbit Speed** | 0 → 5 | 0.1 | 1.0 | Per‑planet orbit multiplier. *(Hidden for Sun.)* |
| **Color** | – | – | default | Changes `material.color`. |
| **Reset to Default** | button | – | – | Resets Size/Rotation/Orbit/Color. |

---

## Interactions (clicking, quick nav, keyboard)

### Click & selection
- Click a planet or moon to select (raycast over `allCelestialBodies`).
- Info panel shows Overview, **Current Situation** (day/night based on camera angle), Key Facts, Properties.
- In **Planet View**, following switches to the newly selected body.
- Clicking empty space hides the info panel.

### Quick Navigation
- Emoji buttons for all planets + major moons.
- Click to focus camera, open info, and (if in Planet View) switch follow target.

### Keyboard shortcuts
- `1` — System View
- `2` — Planet View *(if a body is selected)*
- `r` — Reset Camera
- `s` — Focus on Sun
- `Space` — Pause/Resume *(Time Scale 0 ↔ 1)*
- `h` — Toggle control panel

---

## Animation & math
- **Clock:** `THREE.Clock`; `time += delta * TimeScale`.
- **Spin:** `rotation.y += baseRotation * RotationSpeed * perPlanetRotation * TimeScale * delta * 50`.
- **Planet orbits:**
  - Artistic radius = `distance * OrbitSize`
  - Realistic radius = `realisticDistanceAU * REALISTIC_DISTANCE_SCALE`
  - Position = `(cos(angle)*r, 0, sin(angle)*r)` where `angle = time * baseOrbit * OrbitSpeed * perPlanetOrbit`.
- **Moon orbits:**
  - Artistic radius = `moon.distance`
  - Realistic radius = `realisticDistanceKM * KM_TO_UNIT_SCALE`.
- **Planet View follow:** target lerps to body; camera keeps offset by adding position deltas.

---

## Data & constants
**`planetData[]` fields:**
`name, emoji, radius, color, distance, rotationSpeed, orbitSpeed, realisticRadiusKM, realisticDistanceAU, description, facts[], properties[], moons[]`

Each moon mirrors fields and adds `realisticDistanceKM`.

**Runtime collections:**
`planets[]`, `labels[]`, `orbits[]` (planet LineLoops), `moonOrbits[]` (moon LineLoops), `moonObjects[]`, `allCelestialBodies[]`,
`planetModifiers[index] = { size, rotationSpeed, orbitSpeed, color }`

**Scales:**
```js
const REALISTIC_RADIUS_SCALE = 1 / 10000; // 1 unit = 10,000 km
const KM_PER_AU = 149_600_000;
const REALISTIC_DISTANCE_SCALE = 1500;    // 1 AU = 1500 units
const KM_TO_UNIT_SCALE = REALISTIC_DISTANCE_SCALE / KM_PER_AU;
```

---

## Gemini integration
- Buttons in info panel: **Generate Fun Fact ✨**, **Generate Mission Log ✨**.
- Requires Google Generative Language API key (set `apiKey` in the script).
- Spinner, retry with backoff, and basic error message on failure.

---

## Performance notes
- Orbits are `LineLoop` (cheap); starfield is one `Points` draw call.
- Geometry disposed & rebuilt when scales change.
- Labels scale with distance and can **auto‑hide when occluded** (toggle in Display Options).

---

## Known limitations
- **Textures:** none yet; planets use flat colors.
- **Orbits:** circular, coplanar; no eccentricity/inclination/Kepler elements yet.
- **Saturn rings:** mesh without self‑shadow (fine for now).

---

## Roadmap
1. Axial tilt per planet (big visual win: Earth seasons, Uranus tilt, Saturn ring tilt).
2. NASA albedo/normal maps + ring alpha texture toggle.
3. Keplerian orbits (a, e, i, Ω, ω, M → true anomaly).
4. HUD in Planet View (distance, phase, illumination).
5. Perf: frustum‑cull labels & throttle occlusion checks; debounce resize.