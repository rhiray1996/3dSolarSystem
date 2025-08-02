const planetData = [
                {
                    name: 'Sun', emoji: '☀️',
                    radius: 12, realisticRadiusKM: 696340,
                    distance: 0, realisticDistanceAU: 0,
                    color: 0xffff00,
                    rotationSpeed: 0.001,
                    orbitSpeed: 0,
                    emissive: 0xffff00,
                    emissiveIntensity: 1,
                    description: 'The Sun is the star at the center of our Solar System. It is a nearly perfect sphere of hot plasma that provides the light and energy that support life on Earth.',
                    facts: [
                        { icon: '🌡️', text: 'Surface Temperature: 5,500°C' },
                        { icon: '⚡', text: 'Core Temperature: 15 million°C' },
                        { icon: '🔄', text: 'Rotation Period: 25-35 days' },
                        { icon: '🌍', text: 'Age: 4.6 billion years' }
                    ],
                    properties: [
                        { label: 'Type', value: 'G-type main-sequence star' },
                        { label: 'Diameter', value: '1.39 million km' },
                        { label: 'Mass', value: '1.989 × 10^30 kg' },
                        { label: 'Composition', value: '73% Hydrogen, 25% Helium' }
                    ]
                },
                {
                    name: 'Mercury', emoji: '🟤',
                    radius: 2, realisticRadiusKM: 2439.7,
                    distance: 25, realisticDistanceAU: 0.4,
                    color: 0x8c7853,
                    rotationSpeed: 0.01,
                    orbitSpeed: 0.04,
                    description: 'Mercury is the smallest and innermost planet in the Solar System. Its surface is covered with craters, and it has no atmosphere to retain heat.',
                    facts: [
                        { icon: '🌡️', text: 'Day Temperature: 430°C' },
                        { icon: '❄️', text: 'Night Temperature: -180°C' },
                        { icon: '📅', text: 'Year Length: 88 Earth days' },
                        { icon: '🌙', text: 'Moons: 0' }
                    ],
                    properties: [
                        { label: 'Type', value: 'Terrestrial planet' },
                        { label: 'Diameter', value: '4,879 km' },
                        { label: 'Distance from Sun', value: '57.9 million km' },
                        { label: 'Day Length', value: '59 Earth days' }
                    ]
                },
                {
                    name: 'Venus', emoji: '🟠',
                    radius: 3, realisticRadiusKM: 6051.8,
                    distance: 35, realisticDistanceAU: 0.7,
                    color: 0xffc649,
                    rotationSpeed: 0.005,
                    orbitSpeed: 0.03,
                    description: 'Venus is the second planet from the Sun and the hottest planet in our Solar System. It has a thick, toxic atmosphere filled with carbon dioxide.',
                    facts: [
                        { icon: '🌡️', text: 'Surface Temperature: 462°C' },
                        { icon: '🌪️', text: 'Atmospheric Pressure: 92x Earth' },
                        { icon: '📅', text: 'Year Length: 225 Earth days' },
                        { icon: '🌙', text: 'Moons: 0' }
                    ],
                    properties: [
                        { label: 'Type', value: 'Terrestrial planet' },
                        { label: 'Diameter', value: '12,104 km' },
                        { label: 'Distance from Sun', value: '108.2 million km' },
                        { label: 'Day Length', value: '243 Earth days' }
                    ]
                },
                {
                    name: 'Earth', emoji: '🌍',
                    radius: 3.2, realisticRadiusKM: 6371,
                    distance: 45, realisticDistanceAU: 1,
                    color: 0x2233ff,
                    rotationSpeed: 0.02,
                    orbitSpeed: 0.02,
                    description: 'Earth is the third planet from the Sun and the only astronomical object known to harbor life. About 71% of Earth\'s surface is covered with water.',
                    facts: [
                        { icon: '🌡️', text: 'Average Temperature: 15°C' },
                        { icon: '💧', text: 'Surface Water: 71%' },
                        { icon: '📅', text: 'Year Length: 365.25 days' },
                        { icon: '🌙', text: 'Moons: 1 (The Moon)' }
                    ],
                    properties: [
                        { label: 'Type', value: 'Terrestrial planet' },
                        { label: 'Diameter', value: '12,742 km' },
                        { label: 'Distance from Sun', value: '149.6 million km' },
                        { label: 'Day Length', value: '24 hours' }
                    ],
                    moons: [
                        { name: 'Moon', emoji: '🌕', radius: 0.8, distance: 6, color: 0xaaaaaa, orbitSpeed: 0.2, realisticRadiusKM: 1737.4, realisticDistanceKM: 384400, description: 'The Moon is Earth\'s only natural satellite. It is the fifth largest satellite in the Solar System and is the largest and most massive relative to its parent planet.', facts: [{icon: '🌡️', text: 'Temperature: -173 to 127°C'}], properties: [{label: 'Diameter', value: '3,474 km'}]}
                    ]
                },
                {
                    name: 'Mars', emoji: '🔴',
                    radius: 2.5, realisticRadiusKM: 3389.5,
                    distance: 55, realisticDistanceAU: 1.5,
                    color: 0xff3333,
                    rotationSpeed: 0.018,
                    orbitSpeed: 0.015,
                    description: 'Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System. It is often referred to as the "Red Planet" due to iron oxide on its surface.',
                    facts: [
                        { icon: '🌡️', text: 'Average Temperature: -63°C' },
                        { icon: '🏔️', text: 'Highest Mountain: Olympus Mons' },
                        { icon: '📅', text: 'Year Length: 687 Earth days' },
                        { icon: '🌙', text: 'Moons: 2 (Phobos, Deimos)' }
                    ],
                    properties: [
                        { label: 'Type', value: 'Terrestrial planet' },
                        { label: 'Diameter', value: '6,779 km' },
                        { label: 'Distance from Sun', value: '227.9 million km' },
                        { label: 'Day Length', value: '24.6 hours' }
                    ],
                    moons: [
                        { name: 'Phobos', emoji: '🪨', radius: 0.3, distance: 4, color: 0x999999, orbitSpeed: 0.4, realisticRadiusKM: 11.26, realisticDistanceKM: 9376, description: 'Phobos is the larger and closer of Mars\'s two moons. It is a small, irregularly shaped object, believed to be a captured asteroid.', facts: [{icon: '📅', text: 'Orbital Period: 7.7 hours'}], properties: [{label: 'Diameter', value: '22.5 km'}] },
                        { name: 'Deimos', emoji: '🪨', radius: 0.2, distance: 5, color: 0xbbbbbb, orbitSpeed: 0.3, realisticRadiusKM: 6.2, realisticDistanceKM: 23460, description: 'Deimos is the smaller and more distant of Mars\'s two moons. Like Phobos, it is thought to be a captured asteroid.', facts: [{icon: '📅', text: 'Orbital Period: 30.3 hours'}], properties: [{label: 'Diameter', value: '12.4 km'}] }
                    ]
                },
                {
                    name: 'Jupiter', emoji: '🪐',
                    radius: 8, realisticRadiusKM: 69911,
                    distance: 85, realisticDistanceAU: 5.2,
                    color: 0xcc9966,
                    rotationSpeed: 0.04,
                    orbitSpeed: 0.01,
                    description: 'Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass more than two and a half times that of all the other planets combined.',
                    facts: [
                        { icon: '🌪️', text: 'Great Red Spot: Giant storm' },
                        { icon: '📏', text: 'Diameter: 11x Earth' },
                        { icon: '📅', text: 'Year Length: 12 Earth years' },
                        { icon: '🌙', text: 'Moons: 79 known moons' }
                    ],
                    properties: [
                        { label: 'Type', value: 'Gas giant' },
                        { label: 'Diameter', value: '139,820 km' },
                        { label: 'Distance from Sun', value: '778.5 million km' },
                        { label: 'Day Length', value: '9.9 hours' }
                    ],
                    moons: [
                        { name: 'Io', emoji: '⚪', radius: 0.9, distance: 12, color: 0xffff99, orbitSpeed: 0.4, realisticRadiusKM: 1821.6, realisticDistanceKM: 421700, description: 'Io is the most volcanically active object in the Solar System, with hundreds of volcanoes, some erupting lava fountains dozens of miles high.', facts: [{icon: '🌋', text: 'Over 400 active volcanoes'}], properties: [{label: 'Diameter', value: '3,643 km'}] },
                        { name: 'Europa', emoji: '⚪', radius: 0.8, distance: 14, color: 0xccaa88, orbitSpeed: 0.3, realisticRadiusKM: 1560.8, realisticDistanceKM: 671100, description: 'Europa\'s surface is a vast, icy shell, beneath which is believed to lie a salt-water ocean, making it a prime candidate for extraterrestrial life.', facts: [{icon: '💧', text: 'Subsurface ocean may hold life'}], properties: [{label: 'Diameter', value: '3,121 km'}] },
                        { name: 'Ganymede', emoji: '⚪', radius: 1.2, distance: 16, color: 0x999999, orbitSpeed: 0.2, realisticRadiusKM: 2634.1, realisticDistanceKM: 1070400, description: 'Ganymede is the largest moon in the Solar System, larger than the planet Mercury. It is the only moon known to have its own magnetic field.', facts: [{icon: '🧲', text: 'Has its own magnetic field'}], properties: [{label: 'Diameter', value: '5,268 km'}] },
                        { name: 'Callisto', emoji: '⚪', radius: 1.1, distance: 18, color: 0x777777, orbitSpeed: 0.1, realisticRadiusKM: 2410.3, realisticDistanceKM: 1882700, description: 'Callisto\'s surface is the most heavily cratered of any object in the Solar System, indicating a very old and inactive surface.', facts: [{icon: '💥', text: 'Most cratered surface in solar system'}], properties: [{label: 'Diameter', value: '4,820 km'}] }
                    ]
                },
                {
                    name: 'Saturn', emoji: '🪐',
                    radius: 7, realisticRadiusKM: 58232,
                    distance: 115, realisticDistanceAU: 9.5,
                    color: 0xffcc99,
                    rotationSpeed: 0.035,
                    orbitSpeed: 0.008,
                    description: 'Saturn is the sixth planet from the Sun and the second-largest in the Solar System. It is best known for its prominent ring system made of ice particles.',
                    facts: [
                        { icon: '💍', text: 'Ring System: 7 main groups' },
                        { icon: '⚖️', text: 'Density: Less than water' },
                        { icon: '📅', text: 'Year Length: 29 Earth years' },
                        { icon: '🌙', text: 'Moons: 82 known moons' }
                    ],
                    properties: [
                        { label: 'Type', value: 'Gas giant' },
                        { label: 'Diameter', value: '116,460 km' },
                        { label: 'Distance from Sun', value: '1.43 billion km' },
                        { label: 'Day Length', value: '10.7 hours' }
                    ],
                    moons: [
                        { name: 'Titan', emoji: '⚪', radius: 1.2, distance: 15, color: 0xff9900, orbitSpeed: 0.15, realisticRadiusKM: 2574.7, realisticDistanceKM: 1221870, description: 'Titan is the second-largest moon in the Solar System and the only one with a dense atmosphere. It features rivers, lakes, and seas of liquid methane and ethane.', facts: [{icon: '☁️', text: 'Only moon with a dense atmosphere'}], properties: [{label: 'Diameter', value: '5,149 km'}] },
                        { name: 'Rhea', emoji: '⚪', radius: 0.7, distance: 18, color: 0xcccccc, orbitSpeed: 0.1, realisticRadiusKM: 763.8, realisticDistanceKM: 527108, description: 'Rhea is an icy moon with a heavily cratered surface. It is the second-largest moon of Saturn.', facts: [{icon: '🧊', text: 'Composed mainly of water ice'}], properties: [{label: 'Diameter', value: '1,527 km'}] }
                    ]
                },
                {
                    name: 'Uranus', emoji: '🔵',
                    radius: 4.5, realisticRadiusKM: 25362,
                    distance: 145, realisticDistanceAU: 19.2,
                    color: 0x4fd0e7,
                    rotationSpeed: 0.03,
                    orbitSpeed: 0.005,
                    description: 'Uranus is the seventh planet from the Sun. It has the third-largest planetary radius and fourth-largest planetary mass in the Solar System. It rotates at a nearly 90-degree angle.',
                    facts: [
                        { icon: '🔄', text: 'Axial Tilt: 98 degrees' },
                        { icon: '❄️', text: 'Coldest Atmosphere: -224°C' },
                        { icon: '📅', text: 'Year Length: 84 Earth years' },
                        { icon: '🌙', text: 'Moons: 27 known moons' }
                    ],
                    properties: [
                        { label: 'Type', value: 'Ice giant' },
                        { label: 'Diameter', value: '50,724 km' },
                        { label: 'Distance from Sun', value: '2.87 billion km' },
                        { label: 'Day Length', value: '17.2 hours' }
                    ]
                },
                {
                    name: 'Neptune', emoji: '🔷',
                    radius: 4.3, realisticRadiusKM: 24622,
                    distance: 175, realisticDistanceAU: 30.1,
                    color: 0x3366ff,
                    rotationSpeed: 0.025,
                    orbitSpeed: 0.003,
                    description: 'Neptune is the eighth and outermost planet in the Solar System. It is the fourth-largest planet by diameter and the third-largest by mass. It has the strongest winds in the Solar System.',
                    facts: [
                        { icon: '💨', text: 'Wind Speed: Up to 2,100 km/h' },
                        { icon: '🔵', text: 'Color: Blue from methane' },
                        { icon: '📅', text: 'Year Length: 165 Earth years' },
                        { icon: '🌙', text: 'Moons: 14 known moons' }
                    ],
                    properties: [
                        { label: 'Type', value: 'Ice giant' },
                        { label: 'Diameter', value: '49,244 km' },
                        { label: 'Distance from Sun', value: '4.5 billion km' },
                        { label: 'Day Length', value: '16.1 hours' }
                    ]
                }
            ];

export default planetData;
