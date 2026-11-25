# Research and decision — 25 November 2026

Reviewed primary project pages before choosing dependencies. Repository activity numbers are observations, not compatibility guarantees; only installed dependencies were compiled together in this project.

| Reference | Finding and decision |
| --- | --- |
| [Schem-at/schematic-renderer](https://github.com/Schem-at/schematic-renderer) | Available; AGPL-3.0; 197 commits visible. Three.js plus Rust/WASM/workers, schem/schematic/litematic and resource packs. Strong format coverage, but resource pack rights and collision integration remain separate work. Not adopted. |
| [tmc-catalogue/renderer](https://github.com/tmc-catalogue/renderer) | Available; AGPL-3.0; 43 commits visible. WebGL2 GPU vertex-pulling fork. Its own rendering path adds integration cost to cinematic Three.js effects. Not adopted. |
| [Davide0995/schematic.viewer](https://github.com/Davide0995/schematic.viewer) | Available; MIT source; package declares Three ^0.185.1 and fflate ^0.8.2. Local NBT/litematic/schematic loading and optional resource packs. Bundled Pixel Perfection Legacy is CC BY-SA 4.0, separately licensed. A plausible importer, but no properly licensed target garden selected. Not adopted. |
| [dgreenheck clone](https://github.com/dgreenheck/minecraft-threejs-clone) | Available; reference for voxel rendering/player movement. No source copied, so no dependency or redistribution of its assets. |
| [ginogiorgi](https://github.com/ginogiorgi/minecraft), [abenoharukas](https://github.com/abenoharukas/web-minecraft), [takeokunn](https://github.com/takeokunn/ts-minecraft) | Available browser voxel references. Their full-world gameplay and engine dependencies exceed this garden scope. No code or assets adopted; their dependency compatibility and redistribution rights therefore not relied upon. |
| [Kenney Voxel Pack](https://kenney.nl/assets/voxel-pack) | CC0, 190 files, 128px tiles, categorized as 2D. Legally suitable, but not an immediately usable detailed 3D cherry garden. Not downloaded. |
| [Pixel Perfection](https://github.com/minetest-texture-packs/Pixel-Perfection) | CC BY-SA 4.0, attribution to Hugh “XSSheep” Rutland. Suitable pixel textures with share-alike obligations. Chose original textures instead. |
| [Planet Minecraft](https://www.planetminecraft.com/projects/), [Minecraft Schematics](https://www.minecraft-schematics.com/) | Available catalogs; downloadable builds do not by themselves grant web redistribution rights. No garden with confirmed suitable permission was selected. Abfielder returned 403 in research. |
| [Troika](https://github.com/protectwise/troika) | MIT; installed troika-three-text, compiled and inspected in browser. Local Quicksand font avoids external font dependency. |
| [postprocessing](https://github.com/pmndrs/postprocessing) | Available, but separate package not needed; use Three's own EffectComposer, UnrealBloomPass and OutputPass to match the installed renderer revision. |

## Format prototype

`public/models/bridge-prototype.gltf` is an original generated bridge with embedded binary geometry. `src/import-prototype.ts` imports it using GLTFLoader, renders it, traverses 65 meshes and calculates bounds suitable for collision extraction. This tests glTF import, but does not test Minecraft block-state decoding. Vanilla glTF meshes do not retain semantic walkable/collision flags; those require extras or separately authored bounds. The final bridge uses batched authored blocks, improving customization and reducing object count.

The selected custom approach avoids shipping a Minecraft resource pack, unsupported block models, arbitrary large builds or copied engine mechanics. BSL and Complementary are visual inspirations only; no shader-pack files are used. Water uses a small animated shader, lighting uses ACES, warm sun, hemisphere fill, shadows and fog.
