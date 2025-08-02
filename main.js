import planetData from "./data/planetData.js";

        window.addEventListener('DOMContentLoaded', () => {
            // Scene setup
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 80000);
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.0;
            document.getElementById('canvas-container').appendChild(renderer.domElement);

            // Remove loading message
            document.querySelector('.loading').style.display = 'none';

            // Controls
            const controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.minDistance = 0.01;
            controls.maxDistance = 40000;
            controls.enablePan = true;

            // Enhanced lighting setup
            const sunLight = new THREE.PointLight(0xffffff, 2, 0, 2);
            sunLight.position.set(0, 0, 0);
            sunLight.castShadow = true;
            sunLight.shadow.mapSize.width = 4096;
            sunLight.shadow.mapSize.height = 4096;
            sunLight.shadow.camera.near = 0.5;
            sunLight.shadow.camera.far = 5000; // REALISM FIX: Extend shadow camera range
            scene.add(sunLight);

            // Very minimal ambient light for realistic space
            const ambientLight = new THREE.AmbientLight(0x0a0a0a, 0.05);
            scene.add(ambientLight);

            // Enhanced star field
            const starsGeometry = new THREE.BufferGeometry();
            const starsMaterial = new THREE.PointsMaterial({ 
                color: 0xffffff, 
                size: 20, // REALISM: Make stars larger to be visible from afar
                transparent: true,
                opacity: 0.8
            });
            const starsVertices = [];
            for (let i = 0; i < 40000; i++) {
                const x = (Math.random() - 0.5) * 80000;
                const y = (Math.random() - 0.5) * 80000;
                const z = (Math.random() - 0.5) * 80000;
                starsVertices.push(x, y, z);
            }
            starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
            const stars = new THREE.Points(starsGeometry, starsMaterial);
            scene.add(stars);

            // Grid
            const gridHelper = new THREE.GridHelper(500, 50, 0x444444, 0x222222);
            gridHelper.visible = false;
            scene.add(gridHelper);

            // Planet data with detailed information
            ];

            // Create planets
            const planets = [];
            const orbits = [];
            const labels = [];
            const planetModifiers = {};
            const allCelestialBodies = []; // For raycasting
            const moonObjects = []; // For quick navigation

            // REALISM SCALES
            const REALISTIC_RADIUS_SCALE = 1 / 10000; // 1 unit = 10,000 km
            const KM_PER_AU = 149.6e6;
            const REALISTIC_DISTANCE_SCALE = 1500; // 1 AU = 1500 units
            const KM_TO_UNIT_SCALE = REALISTIC_DISTANCE_SCALE / KM_PER_AU; // Scale for moon distances

            let sunPhongMaterial; // To store original sun material

            planetData.forEach((data, index) => {
                // Create planet with enhanced material
                const geometry = new THREE.SphereGeometry(data.radius, 64, 64);
                const material = new THREE.MeshPhongMaterial({ 
                    color: data.color,
                    emissive: data.emissive || 0x000000,
                    emissiveIntensity: data.emissiveIntensity || 0,
                    shininess: 30,
                    specular: 0x222222
                });
                if (data.name === 'Sun') sunPhongMaterial = material;

                const planet = new THREE.Mesh(geometry, material);
                
                if (data.name !== 'Sun') {
                    planet.castShadow = true;
                } else {
                    planet.castShadow = false;
                }
                
                planet.receiveShadow = true;
                planet.userData = { ...data, index, isPlanet: true };
                
                // Create orbit
                if (data.distance > 0) {
                    const orbitGeometry = new THREE.RingGeometry(data.distance - 0.2, data.distance + 0.2, 128);
                    const orbitMaterial = new THREE.MeshBasicMaterial({ 
                        color: data.color, 
                        side: THREE.DoubleSide,
                        transparent: true,
                        opacity: 0.3
                    });
                    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
                    orbit.rotation.x = -Math.PI / 2;
                    scene.add(orbit);
                    orbits.push(orbit);
                }
                
                // Create label
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = 256;
                canvas.height = 64;
                context.font = 'Bold 48px Arial';
                context.fillStyle = 'white';
                context.textAlign = 'center';
                context.fillText(data.name, 128, 48);
                
                const texture = new THREE.CanvasTexture(canvas);
                const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
                const sprite = new THREE.Sprite(spriteMaterial);
                sprite.scale.set(10, 2.5, 1);
                
                planets.push(planet);
                labels.push(sprite);
                scene.add(planet);
                scene.add(sprite);
                allCelestialBodies.push(planet);
                
                // Initialize modifiers
                planetModifiers[index] = {
                    size: 1,
                    rotationSpeed: 1,
                    orbitSpeed: 1,
                    color: '#' + data.color.toString(16).padStart(6, '0')
                };

                // REALISM: Add Moons
                if (data.moons) {
                    data.moons.forEach(moonData => {
                        const moonGeom = new THREE.SphereGeometry(moonData.radius, 32, 32);
                        const moonMat = new THREE.MeshPhongMaterial({ color: moonData.color });
                        const moon = new THREE.Mesh(moonGeom, moonMat);
                        moon.castShadow = true;
                        moon.receiveShadow = true;
                        moon.userData = { ...moonData, isPlanet: false, parentPlanet: planet };
                        
                        // Add moon orbit
                        const moonOrbitGeom = new THREE.RingGeometry(moonData.distance - 0.05, moonData.distance + 0.05, 64);
                        const moonOrbitMat = new THREE.MeshBasicMaterial({ color: 0x666666, side: THREE.DoubleSide, transparent: true, opacity: 0.3 });
                        const moonOrbit = new THREE.Mesh(moonOrbitGeom, moonOrbitMat);
                        moonOrbit.rotation.x = -Math.PI / 2;
                        
                        planet.add(moonOrbit); // Add orbit to the planet
                        planet.add(moon); // Add moon as a child of the planet
                        allCelestialBodies.push(moon);
                        moonObjects.push(moon);
                    });
                }
            });

            // Saturn's rings
            const ringGeometry = new THREE.RingGeometry(9, 13, 64);
            const ringMaterial = new THREE.MeshLambertMaterial({ 
                color: 0xffcc99, 
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.8
            });
            const rings = new THREE.Mesh(ringGeometry, ringMaterial);
            rings.rotation.x = -Math.PI / 2.5;
            planets[6].add(rings);

            // Camera position
            camera.position.set(80, 60, 120);
            camera.lookAt(0, 0, 0);

            // Control variables
            let timeScale = 1;
            let orbitSpeedMultiplier = 1;
            let rotationSpeedMultiplier = 1;
            let planetSizeMultiplier = 1;
            let orbitSizeMultiplier = 1;
            let showOrbits = true;
            let showLabels = true;
            let showStars = true;
            let realisticLighting = true;
            let sunIntensity = 2;
            let ambientLightIntensity = 0.05;
            let selectedObject = null; // Can be planet or moon
            let currentView = 'system';
            let followingObject = null;
            let isGeminiRunning = false;
            let currentMode = 'artistic';
            let isAnimatingCamera = false;
            let lastTargetPosition = new THREE.Vector3();
            let mouseDownPos = new THREE.Vector2();

            // Panel toggle
            const togglePanel = document.getElementById('togglePanel');
            const controlsPanel = document.getElementById('controlsPanel');
            
            togglePanel.addEventListener('click', () => {
                controlsPanel.classList.toggle('collapsed');
                togglePanel.classList.toggle('panel-hidden');
            });

            // View toggle
            const systemViewBtn = document.getElementById('systemViewBtn');
            const planetViewBtn = document.getElementById('planetViewBtn');
            const statusIndicator = document.getElementById('statusIndicator');
            const statusText = document.getElementById('statusText');

            systemViewBtn.addEventListener('click', () => {
                currentView = 'system';
                followingObject = null;
                systemViewBtn.classList.add('active');
                planetViewBtn.classList.remove('active');
                statusIndicator.classList.remove('active');
                controls.autoRotate = false; 
                resetCameraView();
            });

            planetViewBtn.addEventListener('click', () => {
                if (selectedObject !== null) {
                    currentView = 'planet';
                    followingObject = selectedObject;
                    planetViewBtn.classList.add('active');
                    systemViewBtn.classList.remove('active');
                    statusIndicator.classList.add('active');
                    updateStatusText();
                    focusOnObject(selectedObject);
                }
            });

            function updateStatusText() {
                if (followingObject !== null) {
                    const objectName = followingObject.userData.name;
                    statusText.textContent = `Following ${objectName}`;
                }
            }

            // Control handlers
            document.getElementById('timeScale').addEventListener('input', (e) => {
                timeScale = parseFloat(e.target.value);
                document.getElementById('timeScaleValue').textContent = timeScale.toFixed(1) + 'x';
            });

            document.getElementById('orbitSpeed').addEventListener('input', (e) => {
                orbitSpeedMultiplier = parseFloat(e.target.value);
                document.getElementById('orbitSpeedValue').textContent = orbitSpeedMultiplier.toFixed(1) + 'x';
            });

            document.getElementById('rotationSpeed').addEventListener('input', (e) => {
                rotationSpeedMultiplier = parseFloat(e.target.value);
                document.getElementById('rotationSpeedValue').textContent = rotationSpeedMultiplier.toFixed(1) + 'x';
            });

            document.getElementById('planetSize').addEventListener('input', (e) => {
                planetSizeMultiplier = parseFloat(e.target.value);
                document.getElementById('planetSizeValue').textContent = planetSizeMultiplier.toFixed(1) + 'x';
                updatePlanetSizes();
            });

            document.getElementById('orbitSize').addEventListener('input', (e) => {
                orbitSizeMultiplier = parseFloat(e.target.value);
                document.getElementById('orbitSizeValue').textContent = orbitSizeMultiplier.toFixed(1) + 'x';
                updateOrbitSizes();
            });

            document.getElementById('cameraDistance').addEventListener('input', (e) => {
                const distance = parseFloat(e.target.value);
                document.getElementById('cameraDistanceValue').textContent = distance;
                if (currentView === 'system') {
                    const direction = camera.position.clone().normalize();
                    camera.position.copy(direction.multiplyScalar(distance));
                }
            });

            document.getElementById('showOrbits').addEventListener('change', (e) => {
                showOrbits = e.target.checked;
                orbits.forEach(orbit => orbit.visible = showOrbits);
            });

            document.getElementById('showLabels').addEventListener('change', (e) => {
                showLabels = e.target.checked;
                labels.forEach(label => label.visible = showLabels);
            });

            document.getElementById('showStars').addEventListener('change', (e) => {
                showStars = e.target.checked;
                stars.visible = showStars;
            });

            document.getElementById('realisticLighting').addEventListener('change', (e) => {
                realisticLighting = e.target.checked;
                if (realisticLighting) {
                    ambientLight.intensity = 0.05;
                    document.getElementById('ambientLight').value = 0.05;
                    document.getElementById('ambientLightValue').textContent = '0.05';
                } else {
                    ambientLight.intensity = 0.2;
                    document.getElementById('ambientLight').value = 0.2;
                    document.getElementById('ambientLightValue').textContent = '0.20';
                }
            });

            document.getElementById('sunIntensity').addEventListener('input', (e) => {
                sunIntensity = parseFloat(e.target.value);
                document.getElementById('sunIntensityValue').textContent = sunIntensity.toFixed(1);
                if (currentMode === 'artistic') {
                    sunLight.intensity = sunIntensity;
                }
            });

            document.getElementById('ambientLight').addEventListener('input', (e) => {
                ambientLightIntensity = parseFloat(e.target.value);
                document.getElementById('ambientLightValue').textContent = ambientLightIntensity.toFixed(2);
                ambientLight.intensity = ambientLightIntensity;
            });

            // Camera actions
            document.getElementById('focusOnSun').addEventListener('click', () => {
                focusOnObject(planets[0]);
            });

            document.getElementById('resetCamera').addEventListener('click', resetCameraView);

            function focusOnObject(object) {
                const objectData = object.userData;
                const radius = (currentMode === 'realistic' && objectData.realisticRadiusKM) ? objectData.realisticRadiusKM * REALISTIC_RADIUS_SCALE : objectData.radius;
                const sizeModifier = (objectData.isPlanet && currentMode === 'artistic') ? planetModifiers[objectData.index].size : 1;
                
                let distance = radius * (currentMode === 'artistic' ? planetSizeMultiplier : 1) * sizeModifier * 4;
                if(currentMode === 'realistic') {
                    distance = Math.max(radius * 10, 50); // Ensure a minimum distance in realistic mode
                }

                const worldPosition = new THREE.Vector3();
                object.getWorldPosition(worldPosition);
                
                const offset = new THREE.Vector3(distance, distance * 0.6, distance);
                const cameraPosition = worldPosition.clone().add(offset);
                
                animateCamera(cameraPosition, worldPosition);
            }

            function resetCameraView() {
                let distance = parseFloat(document.getElementById('cameraDistance').value);
                if(currentMode === 'realistic') distance = 3000;

                const cameraPosition = new THREE.Vector3(distance, distance * 0.75, distance);
                animateCamera(cameraPosition, new THREE.Vector3(0, 0, 0));
            }

            function animateCamera(targetPosition, lookAtPosition) {
                isAnimatingCamera = true;
                const startPosition = camera.position.clone();
                const startTarget = controls.target.clone();
                
                const distance = startPosition.distanceTo(targetPosition);
                const duration = Math.max(1500, distance / 5);
                
                const startTime = Date.now();

                function updateCamera() {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeProgress = 1 - Math.pow(1 - progress, 3);

                    camera.position.lerpVectors(startPosition, targetPosition, easeProgress);
                    controls.target.lerpVectors(startTarget, lookAtPosition, easeProgress);
                    controls.update();

                    if (progress < 1) {
                        requestAnimationFrame(updateCamera);
                    } else {
                        isAnimatingCamera = false;
                        lastTargetPosition.copy(lookAtPosition);
                    }
                }

                updateCamera();
            }

            // Planet modification controls
            document.getElementById('modifySize').addEventListener('input', (e) => {
                if (selectedObject && selectedObject.userData.isPlanet) {
                    const value = parseFloat(e.target.value);
                    planetModifiers[selectedObject.userData.index].size = value;
                    document.getElementById('modifySizeValue').textContent = value.toFixed(1) + 'x';
                    updateSelectedPlanet();
                }
            });

            document.getElementById('modifyRotation').addEventListener('input', (e) => {
                if (selectedObject && selectedObject.userData.isPlanet) {
                    const value = parseFloat(e.target.value);
                    planetModifiers[selectedObject.userData.index].rotationSpeed = value;
                    document.getElementById('modifyRotationValue').textContent = value.toFixed(1) + 'x';
                }
            });

            document.getElementById('modifyOrbit').addEventListener('input', (e) => {
                if (selectedObject && selectedObject.userData.isPlanet) {
                    const value = parseFloat(e.target.value);
                    planetModifiers[selectedObject.userData.index].orbitSpeed = value;
                    document.getElementById('modifyOrbitValue').textContent = value.toFixed(1) + 'x';
                }
            });

            document.getElementById('modifyColor').addEventListener('input', (e) => {
                if (selectedObject && selectedObject.userData.isPlanet) {
                    const color = e.target.value;
                    planetModifiers[selectedObject.userData.index].color = color;
                    document.getElementById('colorValue').textContent = color;
                    updateSelectedPlanetColor();
                }
            });

            document.getElementById('resetPlanet').addEventListener('click', () => {
                if (selectedObject && selectedObject.userData.isPlanet) {
                    resetPlanet(selectedObject.userData.index);
                }
            });

            // Update functions
            function updatePlanetSizes() {
                planets.forEach((planet, index) => {
                    const modifier = planetModifiers[index].size;
                    planet.scale.setScalar(planetSizeMultiplier * modifier);
                });
            }

            function updateOrbitSizes() {
                orbits.forEach((orbit, index) => {
                    const originalDistance = planetData[index + 1].distance;
                    const newDistance = originalDistance * orbitSizeMultiplier;
                    orbit.geometry.dispose();
                    orbit.geometry = new THREE.RingGeometry(newDistance - 0.2, newDistance + 0.2, 128);
                });
            }

            function updateSelectedPlanet() {
                if (selectedObject && selectedObject.userData.isPlanet) {
                    const planet = selectedObject;
                    const modifier = planetModifiers[planet.userData.index].size;
                    planet.scale.setScalar(planetSizeMultiplier * modifier);
                }
            }

            function updateSelectedPlanetColor() {
                if (selectedObject && selectedObject.userData.isPlanet) {
                    const planet = selectedObject;
                    const color = planetModifiers[planet.userData.index].color;
                    planet.material.color.set(color);

                    if (planet.userData.index === 0) {
                        planet.material.emissive.set(color);
                    }
                }
            }

            function resetPlanet(index) {
                const planet = planets[index];
                const data = planetData[index];
                
                planetModifiers[index] = {
                    size: 1,
                    rotationSpeed: 1,
                    orbitSpeed: 1,
                    color: '#' + data.color.toString(16).padStart(6, '0')
                };
                
                document.getElementById('modifySize').value = 1;
                document.getElementById('modifySizeValue').textContent = '1.0x';
                document.getElementById('modifyRotation').value = 1;
                document.getElementById('modifyRotationValue').textContent = '1.0x';
                document.getElementById('modifyOrbit').value = 1;
                document.getElementById('modifyOrbitValue').textContent = '1.0x';
                document.getElementById('modifyColor').value = '#' + data.color.toString(16).padStart(6, '0');
                document.getElementById('colorValue').textContent = '#' + data.color.toString(16).padStart(6, '0');
                
                planet.scale.setScalar(planetSizeMultiplier);
                planet.material.color.set(data.color);
                if (index === 0) {
                     planet.material.emissive.set(data.color);
                }
            }

            // Raycaster for planet selection
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();

            function onMouseDown(event) {
                mouseDownPos.x = event.clientX;
                mouseDownPos.y = event.clientY;
            }

            function onMouseUp(event) {
                const deltaX = Math.abs(event.clientX - mouseDownPos.x);
                const deltaY = Math.abs(event.clientY - mouseDownPos.y);
                const dragThreshold = 5;

                if (deltaX > dragThreshold || deltaY > dragThreshold) {
                    return; // It was a drag, do nothing.
                }

                if (event.target.closest('.controls-panel') || 
                    event.target.closest('.planet-info') || 
                    event.target.closest('.view-toggle') ||
                    event.target.closest('.toggle-panel') ||
                    event.target.closest('.info-panel') ||
                    event.target.closest('.help-text') ||
                    event.target.closest('.status-indicator')) {
                    return;
                }

                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

                raycaster.setFromCamera(mouse, camera);
                const intersects = raycaster.intersectObjects(allCelestialBodies);

                if (intersects.length > 0) {
                    const object = intersects[0].object;
                    selectedObject = object;
                    showObjectInfo(object.userData);
                    
                    if (currentView === 'planet') {
                        followingObject = selectedObject;
                        updateStatusText();
                        focusOnObject(selectedObject);
                    }
                } else {
                    hidePlanetInfo();
                    selectedObject = null;
                }
            }

            function showObjectInfo(data) {
                const infoPanel = document.getElementById('planetInfo');
                const nameElement = document.getElementById('planetName');
                const descriptionElement = document.getElementById('planetDescription');
                const factsElement = document.getElementById('planetFacts');
                const propertiesElement = document.getElementById('planetProperties');
                const orbitSpeedControl = document.getElementById('orbitSpeedControl');
                const modifySection = document.querySelector('.modify-section');

                nameElement.textContent = data.name;
                descriptionElement.textContent = data.description || `A moon of ${data.parentPlanet.userData.name}.`;
                
                document.getElementById('planetSituation').innerHTML = '';
                document.getElementById('gemini-response').innerHTML = 'Click a button to learn more!';
                
                factsElement.innerHTML = '';
                if (data.facts) {
                    data.facts.forEach(fact => {
                        const factDiv = document.createElement('div');
                        factDiv.className = 'fact';
                        factDiv.innerHTML = `<span class="fact-icon">${fact.icon}</span> ${fact.text}`;
                        factsElement.appendChild(factDiv);
                    });
                }
                
                propertiesElement.innerHTML = '';
                 if (data.properties) {
                    data.properties.forEach(prop => {
                        const propDiv = document.createElement('p');
                        propDiv.innerHTML = `<strong>${prop.label}:</strong> ${prop.value}`;
                        propertiesElement.appendChild(propDiv);
                    });
                }
                
                if (data.isPlanet) {
                    modifySection.style.display = 'block';
                    if (data.name === 'Sun') {
                        orbitSpeedControl.style.display = 'none';
                    } else {
                        orbitSpeedControl.style.display = 'block';
                    }
                    const modifier = planetModifiers[data.index];
                    document.getElementById('modifySize').value = modifier.size;
                    document.getElementById('modifySizeValue').textContent = modifier.size.toFixed(1) + 'x';
                    document.getElementById('modifyRotation').value = modifier.rotationSpeed;
                    document.getElementById('modifyRotationValue').textContent = modifier.rotationSpeed.toFixed(1) + 'x';
                    document.getElementById('modifyOrbit').value = modifier.orbitSpeed;
                    document.getElementById('modifyOrbitValue').textContent = modifier.orbitSpeed.toFixed(1) + 'x';
                    document.getElementById('modifyColor').value = modifier.color;
                    document.getElementById('colorValue').textContent = modifier.color;
                } else {
                    modifySection.style.display = 'none';
                }
                
                infoPanel.style.display = 'block';
            }

            function hidePlanetInfo() {
                document.getElementById('planetInfo').style.display = 'none';
            }
            
            function updateLiveInfo() {
                if (selectedObject === null) return;
                
                const situationElement = document.getElementById('planetSituation');
                if (!situationElement) return;

                const data = selectedObject.userData;
                let situationText = '';
                
                const worldPosition = new THREE.Vector3();
                selectedObject.getWorldPosition(worldPosition);

                if (data.name === 'Sun') {
                    situationText = 'The Sun illuminates all planets in the solar system.';
                } else {
                    const sunPosition = new THREE.Vector3(); 
                    const objectToSun = new THREE.Vector3().subVectors(sunPosition, worldPosition).normalize();
                    const objectToCamera = new THREE.Vector3().subVectors(camera.position, worldPosition).normalize();
                    const angle = objectToSun.angleTo(objectToCamera) * (180 / Math.PI);

                    if (angle < 90) {
                         situationText = `Viewing the day side (${angle.toFixed(0)}°)`;
                    } else {
                         situationText = `Viewing the night side (${angle.toFixed(0)}°)`;
                    }
                }
                situationElement.innerHTML = `<p><strong>Viewpoint:</strong> ${situationText}</p>`;
            }


            window.addEventListener('mousedown', onMouseDown);
            window.addEventListener('mouseup', onMouseUp);

            // --- Gemini API Integration ---
            const generateFactBtn = document.getElementById('generateFactBtn');
            const generateLogBtn = document.getElementById('generateLogBtn');
            const geminiResponseEl = document.getElementById('gemini-response');

            async function callGeminiAPI(prompt, maxRetries = 3) {
                isGeminiRunning = true;
                setGeminiButtonsDisabled(true);
                geminiResponseEl.innerHTML = '<div class="gemini-loader"></div>';

                const apiKey = ""; // Will be provided by the environment
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
                
                const payload = {
                    contents: [{ role: "user", parts: [{ text: prompt }] }]
                };

                for (let i = 0; i < maxRetries; i++) {
                    try {
                        const response = await fetch(apiUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        });

                        if (!response.ok) {
                            throw new Error(`API call failed with status: ${response.status}`);
                        }

                        const result = await response.json();
                        
                        if (result.candidates && result.candidates.length > 0 &&
                            result.candidates[0].content && result.candidates[0].content.parts &&
                            result.candidates[0].content.parts.length > 0) {
                            const text = result.candidates[0].content.parts[0].text;
                            geminiResponseEl.innerText = text;
                            isGeminiRunning = false;
                            setGeminiButtonsDisabled(false);
                            return;
                        } else {
                             throw new Error("Invalid response structure from API.");
                        }

                    } catch (error) {
                        if (i === maxRetries - 1) {
                            geminiResponseEl.innerText = 'Error: Could not get a response. Please try again later.';
                            console.error("Gemini API Error:", error);
                            isGeminiRunning = false;
                            setGeminiButtonsDisabled(false);
                            return;
                        }
                        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
                    }
                }
            }

            function setGeminiButtonsDisabled(disabled) {
                generateFactBtn.disabled = disabled;
                generateLogBtn.disabled = disabled;
            }

            generateFactBtn.addEventListener('click', () => {
                if (selectedObject !== null && !isGeminiRunning) {
                    const objectName = selectedObject.userData.name;
                    const prompt = `You are an expert astronomer. Tell me one surprising or little-known fun fact about the celestial body ${objectName}. Make it concise and engaging for a general audience.`;
                    callGeminiAPI(prompt);
                }
            });

            generateLogBtn.addEventListener('click', () => {
                if (selectedObject !== null && !isGeminiRunning) {
                    const objectName = selectedObject.userData.name;
                    const prompt = `Write a creative, short "mission log" entry (about 50-75 words) from an astronaut exploring ${objectName}. Capture the feeling of being there, mentioning one of its key characteristics.`;
                    callGeminiAPI(prompt);
                }
            });


            // Animation loop
            let time = 0;
            const clock = new THREE.Clock();

            function animate() {
                requestAnimationFrame(animate);

                const delta = clock.getDelta();
                time += delta * timeScale;

                // Update planets and their moons
                planets.forEach((planet, index) => {
                    const data = planetData[index];
                    const modifier = planetModifiers[index];
                    
                    planet.rotation.y += data.rotationSpeed * rotationSpeedMultiplier * modifier.rotationSpeed * timeScale * delta * 50;
                    
                    if (data.distance > 0) {
                        const distance = (currentMode === 'realistic') ? data.realisticDistanceAU * REALISTIC_DISTANCE_SCALE : data.distance * orbitSizeMultiplier;
                        const angle = time * data.orbitSpeed * orbitSpeedMultiplier * modifier.orbitSpeed;
                        planet.position.x = Math.cos(angle) * distance;
                        planet.position.z = Math.sin(angle) * distance;
                    }
                    
                    labels[index].position.copy(planet.position);
                    labels[index].position.y += data.radius * planetSizeMultiplier * modifier.size + 4;
                    
                    const distance = camera.position.distanceTo(labels[index].position);
                    const labelScale = distance / 15;
                    labels[index].scale.set(labelScale, labelScale * 0.25, 1);

                    // Animate moons
                    if(data.moons) {
                        planet.children.forEach(child => {
                            if (child.userData.isPlanet === false) { // It's a moon
                                const moonData = child.userData;
                                const distance = (currentMode === 'realistic') ? moonData.realisticDistanceKM * KM_TO_UNIT_SCALE : moonData.distance;
                                const angle = time * moonData.orbitSpeed * orbitSpeedMultiplier;
                                child.position.x = Math.cos(angle) * distance;
                                child.position.z = Math.sin(angle) * distance;
                            }
                        });
                    }
                });

                if (currentView === 'planet' && followingObject !== null && !isAnimatingCamera) {
                    const newTargetPosition = new THREE.Vector3();
                    followingObject.getWorldPosition(newTargetPosition);

                    if (!lastTargetPosition.equals(new THREE.Vector3(0,0,0))) {
                        const deltaMove = new THREE.Vector3().subVectors(newTargetPosition, lastTargetPosition);
                        camera.position.add(deltaMove);
                    }
                    
                    controls.target.copy(newTargetPosition);
                    lastTargetPosition.copy(newTargetPosition);
                } else if (currentView !== 'planet' || isAnimatingCamera) {
                    lastTargetPosition.set(0,0,0);
                }
                
                if (document.getElementById('planetInfo').style.display === 'block') {
                    updateLiveInfo();
                }

                // CAMERA IMPROVEMENT: Dynamic camera speed
                if (controls.enabled) {
                    const distanceToTarget = camera.position.distanceTo(controls.target);
                    controls.zoomSpeed = Math.max(0.1, distanceToTarget / 200);
                    controls.panSpeed = Math.max(0.1, distanceToTarget / 200);
                }

                controls.update();
                renderer.render(scene, camera);
            }

            // Handle window resize
            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });

            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                switch(e.key) {
                    case '1':
                        systemViewBtn.click();
                        break;
                    case '2':
                        if (selectedObject !== null) {
                            planetViewBtn.click();
                        }
                        break;
                    case 'r':
                        resetCameraView();
                        break;
                    case 's':
                        document.getElementById('focusOnSun').click();
                        break;
                    case ' ':
                        e.preventDefault();
                        const timeScaleSlider = document.getElementById('timeScale');
                        timeScaleSlider.value = timeScaleSlider.value === '0' ? '1' : '0';
                        timeScaleSlider.dispatchEvent(new Event('input'));
                        break;
                    case 'h':
                        controlsPanel.classList.toggle('collapsed');
                        togglePanel.classList.toggle('panel-hidden');
                        break;
                }
            });
            
            // --- Mode Switching Logic ---
            const artisticModeBtn = document.getElementById('artisticModeBtn');
            const realisticModeBtn = document.getElementById('realisticModeBtn');
            const visualSettingsGroup = document.getElementById('visual-settings-group');

            function setMode(mode) {
                currentMode = mode;
                const isArtistic = mode === 'artistic';

                artisticModeBtn.classList.toggle('active', isArtistic);
                realisticModeBtn.classList.toggle('active', !isArtistic);
                
                // Disable visual settings in realistic mode
                document.getElementById('planetSize').disabled = !isArtistic;
                document.getElementById('orbitSize').disabled = !isArtistic;
                document.getElementById('sunIntensity').disabled = !isArtistic;
                
                // REALISM FIX: Adjust lighting for the selected mode
                if (isArtistic) {
                    sunLight.intensity = sunIntensity;
                    renderer.toneMappingExposure = 1.0;
                    sunLight.shadow.camera.far = 5000;
                    planets[0].material = sunPhongMaterial;
                } else { // Realistic Mode
                    sunLight.intensity = 200;
                    renderer.toneMappingExposure = 0.1;
                    sunLight.shadow.camera.far = 50000;
                    planets[0].material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
                }
                sunLight.shadow.camera.updateProjectionMatrix();
                
                // Update scales and positions
                planets.forEach((planet, index) => {
                    const data = planetData[index];
                    const radius = isArtistic ? data.radius : data.realisticRadiusKM * REALISTIC_RADIUS_SCALE;
                    planet.scale.set(1,1,1);
                    planet.geometry.dispose();
                    planet.geometry = new THREE.SphereGeometry(radius, 64, 64);

                    if(data.moons){
                         planet.children.forEach(child => {
                            if (child.userData.isPlanet === false) { // It's a moon
                                const moonData = child.userData;
                                const moonRadius = isArtistic ? moonData.radius : moonData.realisticRadiusKM * REALISTIC_RADIUS_SCALE;
                                child.geometry.dispose();
                                child.geometry = new THREE.SphereGeometry(moonRadius, 32, 32);
                            }
                         });
                    }
                });

                orbits.forEach((orbit, index) => {
                    const data = planetData[index + 1];
                    const distance = isArtistic ? data.distance : data.realisticDistanceAU * REALISTIC_DISTANCE_SCALE;
                    orbit.geometry.dispose();
                    orbit.geometry = new THREE.RingGeometry(distance - 0.2, distance + 0.2, 128);
                });
                
                // Adjust camera for new scale
                camera.far = isArtistic ? 10000 : 80000;
                controls.maxDistance = isArtistic ? 500 : 40000;
                camera.updateProjectionMatrix();
                resetCameraView();
            }

            artisticModeBtn.addEventListener('click', () => setMode('artistic'));
            realisticModeBtn.addEventListener('click', () => setMode('realistic'));

            // --- Quick Navigation UI ---
            const navButtonsContainer = document.getElementById('nav-buttons');
            planetData.forEach((data, index) => {
                const navItem = document.createElement('div');
                navItem.className = 'nav-item';
                navItem.innerHTML = `<div class="nav-icon">${data.emoji}</div><div class="nav-name">${data.name}</div>`;
                navItem.addEventListener('click', () => {
                    const objectToFocus = planets[index];
                    focusOnObject(objectToFocus);
                    selectedObject = objectToFocus;
                    showObjectInfo(objectToFocus.userData);
                    if (currentView === 'planet') {
                        followingObject = objectToFocus;
                        updateStatusText();
                    }
                });
                navButtonsContainer.appendChild(navItem);
            });

            moonObjects.forEach(moon => {
                 const navItem = document.createElement('div');
                navItem.className = 'nav-item';
                navItem.innerHTML = `<div class="nav-icon">${moon.userData.emoji}</div><div class="nav-name">${moon.userData.name}</div>`;
                navItem.addEventListener('click', () => {
                    focusOnObject(moon);
                    selectedObject = moon;
                    showObjectInfo(moon.userData);
                    if (currentView === 'planet') {
                        followingObject = moon;
                        updateStatusText();
                    }
                });
                navButtonsContainer.appendChild(navItem);
            });


            // Start animation
            animate();
        });
