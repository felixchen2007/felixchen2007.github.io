'use strict';
const projects = [
  {
    id: 'weather-monitor', title: 'Weather Monitor PCB', heading: 'Weather<br>Monitor PCB', shortTitle: 'Weather Monitor', discipline: 'Embedded systems', role: 'Independent project', tools: 'Altium / ESP32 / Firmware',
    image: 'assets/weather-monitor-pcb.png', alt: "3D render of Felix Chen's ESP32 weather monitor PCB", caption: 'PCB assembly / isometric view',
    summary: 'From a breadboard to a custom PCB. An ESP32 weather monitor that brings temperature, humidity, and solar power data to a screen and the web.',
    intro: 'A complete embedded system, developed one iteration at a time.',
    notes: ['ESP32 microcontroller', 'Temperature & humidity sensing', 'Solar power monitoring', 'Display + web interface'],
    sections: [
      ['From breadboard to board', 'I developed the monitor through three iterations: a breadboard prototype, a PCB built around an ESP32 development board, and a fully integrated custom PCB designed in Altium Designer. Each iteration brought more of the system onto one board.'],
      ['Making the sensors talk', 'I wrote firmware to read temperature and humidity from a DHT11 and monitor power using an INA219. Debugging involved checking I²C addresses, communications, and pin assignments so the sensors and controller could work together.'],
      ['Turning measurements into information', 'A 240 × 240 ST7789 TFT display and a custom webpage present the measurements. The project connects hardware design, firmware, and a usable interface in a single system.']
    ]
  },
  {
    id: 'buck-boost-converter', title: 'Adjustable Buck-Boost Converter', heading: 'Buck-Boost<br>Converter', shortTitle: 'Buck-Boost Converter', discipline: 'Power electronics', role: 'Independent project', tools: 'Altium / TPS63000 / Simulink',
    image: 'assets/buck-boost-converter-pcb.png', alt: "3D render of Felix Chen's four-layer adjustable buck-boost converter PCB", caption: 'Four-layer PCB / isometric view',
    summary: 'An adjustable power supply built around the TPS63000. A four-layer PCB taken from schematic and layout through manufacturing and assembly.',
    intro: 'Power electronics, from the feedback network to the physical layout.',
    notes: ['TI TPS63000 converter', 'Adjustable voltage selection', 'Ground and power planes', 'Test points for board bring-up'],
    sections: [
      ['Designing the power stage', 'I independently designed, manufactured, and assembled a four-layer adjustable buck-boost converter using the TI TPS63000. The design includes feedback, enable, input and output filtering, and voltage selection.'],
      ['Layout is part of the circuit', 'I used ground and power planes, kept high-current paths short, and considered thermal behavior throughout the layout. I also imported and checked LCSC and EasyEDA library assets, ran design-rule checks, and added test points.'],
      ['Understanding the behavior', 'I built a simplified Simulink model to explore transient response and control concepts alongside the physical converter design.']
    ]
  },
  {
    id: 'rainwater', title: 'Rainwater Harvester', heading: 'Rainwater<br>Harvester', shortTitle: 'Rainwater Harvester', discipline: 'Systems modeling', role: 'Six-person team', tools: 'Excel / Simulation / Analysis', photo: true,
    image: 'assets/rainwater-1.jpg', alt: 'Rainwater harvesting project design and analysis', caption: 'System design / project documentation',
    summary: 'A rainwater collection and treatment system for a two-person, off-grid household in remote British Columbia. Designed around the whole system.',
    intro: 'Balancing water, energy, and the realities of an off-grid household.',
    notes: ['Rainfall and demand modeling', 'Tank storage and collection', 'Filtration and disinfection', 'Cost and reliability tradeoffs'],
    sections: [
      ['Modeling the household', 'Working in a six-person team, I contributed to an Excel simulation for rainwater harvesting and treatment for a two-person household in a remote British Columbia community. The model considered rainfall, water demand, storage, and energy.'],
      ['Connecting the subsystems', 'The design brought together collection, pumping, filtration, and disinfection. We used pump and system curves to understand how components would operate together.'],
      ['Making practical tradeoffs', 'We compared tank, piping, treatment, and power choices by cost, reliability, and maintenance needs. The objective was a system that made sense as a whole, within the constraints of off-grid living.']
    ]
  },
  {
    id: 'arduino-claw', title: 'Arduino Claw', heading: 'Arduino<br>Claw', shortTitle: 'Arduino Claw', discipline: 'Electromechanical design', role: 'Five-person team', tools: 'Arduino / Sensors / Control', photo: true,
    image: 'assets/arduino-claw-1.jpg', alt: 'The Arduino claw prototype with its mechanical structure and electronics', caption: 'Working prototype / build photograph',
    summary: 'Motors, sensors, code, and a little mechanical persistence. A team-built Arduino claw designed to handle three rounds of a studio competition.',
    intro: 'Bringing mechanical construction and embedded control together.',
    notes: ['Arduino-based control', 'Motor and sensor integration', 'Wiring and mechanical assembly', 'Three-round studio competition'],
    sections: [
      ['Building an integrated prototype', 'In a five-person team, I helped build and program an Arduino claw combining motors, sensors, and mechanical parts. My contributions included sensor-reading and control logic, assembly, and wiring.'],
      ['Testing under real constraints', 'We tested and debugged the integrated system for tasks involving object handling, timed foam-block collection, and cooperative lifting. The competition required the mechanism and control logic to work reliably together.'],
      ['Putting it to the test', 'The team achieved top studio scores across the three-round competition. The project was an exercise in iteration, hands-on integration, and coordinating a build as a team.']
    ]
  }
];
