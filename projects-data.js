'use strict';
const projects = [
  {
    "id": "weather-monitor",
    "title": "Weather Monitor PCB",
    "heading": "Weather<br>Monitor PCB",
    "shortTitle": "Weather Monitor",
    "discipline": "Embedded systems",
    "role": "Independent project",
    "tools": "Altium / ESP32 / Firmware",
    "image": "assets/weather-monitor-pcb.png",
    "alt": "3D render of Felix Chen's ESP32 weather monitor PCB",
    "caption": "PCB assembly / isometric view",
    "summary": "An ESP32 weather monitor with temperature, humidity, and solar power readings.",
    "notes": [
      "ESP32 microcontroller",
      "Temperature & humidity sensing",
      "Solar power monitoring",
      "Display + web interface"
    ],
    "github": "https://github.com/felixchen2007/weather-monitor-pcb"
  },
  {
    "id": "buck-boost-converter",
    "title": "Adjustable Buck-Boost Converter",
    "heading": "Buck-Boost<br>Converter",
    "shortTitle": "Buck-Boost Converter",
    "discipline": "Power electronics",
    "role": "Independent project",
    "tools": "Altium / TPS63000 / Simulink",
    "image": "assets/buck-boost-converter-pcb.png",
    "alt": "3D render of Felix Chen's four-layer adjustable buck-boost converter PCB",
    "caption": "Four-layer PCB / isometric view",
    "summary": "A four-layer adjustable buck-boost converter built around the TI TPS63000.",
    "notes": [
      "TI TPS63000 converter",
      "Adjustable voltage selection",
      "Ground and power planes",
      "Test points for board bring-up"
    ],
    "github": "https://github.com/felixchen2007/buck-boost-converter"
  },
  {
    "id": "rainwater",
    "home": false,
    "title": "Rainwater Harvester",
    "heading": "Rainwater<br>Harvester",
    "shortTitle": "Rainwater Harvester",
    "discipline": "Systems modeling",
    "role": "Six-person team",
    "tools": "Excel / Simulation / Analysis",
    "photo": true,
    "image": "assets/rainwater-1.jpg",
    "alt": "Rainwater harvesting project design and analysis",
    "caption": "System design / project documentation",
    "summary": "An Excel model for an off-grid rainwater collection and treatment system.",
    "notes": [
      "Rainfall and demand modeling",
      "Tank storage and collection",
      "Filtration and disinfection",
      "Cost and reliability tradeoffs"
    ],
    "github": "https://github.com/felixchen2007/rainwater-harvester"
  },
  {
    "id": "arduino-claw",
    "home": false,
    "title": "Arduino Claw",
    "heading": "Arduino<br>Claw",
    "shortTitle": "Arduino Claw",
    "discipline": "Electromechanical design",
    "role": "Five-person team",
    "tools": "Arduino / Sensors / Control",
    "photo": true,
    "image": "assets/arduino-claw-1.jpg",
    "alt": "The Arduino claw prototype with its mechanical structure and electronics",
    "caption": "Working prototype / build photograph",
    "summary": "A team-built Arduino claw combining sensors, motors, and control code.",
    "notes": [
      "Arduino-based control",
      "Motor and sensor integration",
      "Wiring and mechanical assembly",
      "Three-round studio competition"
    ],
    "github": "https://github.com/felixchen2007/arduino-claw"
  },
  {
    "id": "subc-bms",
    "title": "SUBC BMS",
    "heading": "SUBC<br>BMS",
    "shortTitle": "SUBC BMS",
    "discipline": "Battery management",
    "role": "In progress",
    "tools": "To be documented",
    "placeholder": true,
    "image": "assets/subc-bms-draft.svg",
    "alt": "SUBC BMS temporary drawing — design in progress",
    "caption": "Temporary drawing / design in progress",
    "summary": "A SUBC battery management system project. In progress.",
    "notes": [
      "Scope in development",
      "Design in progress",
      "Validation pending",
      "Documentation to follow"
    ],
    "github": "https://github.com/felixchen2007/subc-bms"
  }
];
