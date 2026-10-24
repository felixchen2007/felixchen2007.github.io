# Board models

`buck-boost-converter.glb` is a web-ready export of the BuckBoostConvert Altium PCB assembly. The board and component geometry were exported as VRML, then converted to glTF 2.0 with Three.js. Meshes with matching materials were merged to reduce draw calls; geometry was centered and converted from millimeters to meters.

The board's top and bottom surface maps are generated from the saved Altium PCB document, including its actual copper tracks, pads, and silkscreen. Separate roughness and metalness maps distinguish exposed pads from solder mask. Component materials use subdued plastic, ceramic, and metal finishes.

The original Altium project files are not bundled with the website.
