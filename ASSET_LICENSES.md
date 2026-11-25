# Asset and dependency licenses

## Original project assets

All garden designs, 32 × 32 canvas pixel textures, crossed flower artwork, display board, particle geometry, water/sky shaders, bridge glTF feasibility fixture and synthesized ambient tones were created for this project. No Mojang textures, Minecraft music, community build, BSL or Complementary shader files are included. Original visual assets are dedicated to CC0-1.0 for reuse; application source remains available to the project owner without third-party copied source restrictions.

## Bundled font

Quicksand by Andrew Paglinawan and contributors, distributed under SIL Open Font License 1.1. Downloaded from [Google Fonts upstream](https://github.com/google/fonts/tree/main/ofl/quicksand). The full copyright and OFL license are included in `public/fonts/OFL.txt` and copied to production `dist/fonts/OFL.txt`. The variable font is bundled unchanged.

## Runtime dependencies

| Package | License | Use |
| --- | --- | --- |
| three / Three.js addons | MIT | Rendering, pointer lock, glTF prototype, effects |
| troika-three-text | MIT | SDF world text |
| troika-three-utils, troika-worker-utils | MIT | Troika helpers |
| bidi-js | MIT | Text layout |
| webgl-sdf-generator | MIT | SDF glyph generation |

Vite, TypeScript, @types/three and their build dependencies retain their own licenses. `package-lock.json` pins the installed dependency graph. Full installed-package notices are collected in `THIRD_PARTY_NOTICES.txt`; retain this file with source distribution. No external audio library or downloaded sound is used.

Referenced but **not bundled**: Kenney Voxel Pack (CC0), Pixel Perfection (CC BY-SA 4.0), schematic-renderer and tmc renderer (AGPL-3.0), schematic.viewer (MIT). See research notes for links. Minecraft is a trademark of Mojang/Microsoft; this independent garden is not affiliated with or endorsed by them.

The pink hooded voxel character, pixel face, heart backpack and walk cycle are original project assets, using the same CC0 dedication as the other original visual assets. No downloaded character skin is used.

The broad pink voxel blossoms, yellow centers and leafy hanging vines are original geometry and pixel materials inspired by the user’s visual reference. No pixels or Minecraft textures were extracted from the screenshot. The white display board is also original project geometry.

The yellow motor scooter is original project geometry and materials (CC0 dedication). No external vehicle model or brand assets were used. Its static components are merged into seven meshes for mobile rendering.
