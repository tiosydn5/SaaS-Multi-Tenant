# DESIGN.md — ATELIER ENGINE v4 Design System

## 1. 3-Template Visual Architecture
All surfaces adapt cleanly to three distinct UI presets (`html[data-ui-template="..."]`) managed centrally via `applyWorkshopTheme()` and `applyWorkshopTemplate()` in `service-config.js`.

| Key | Label | Storefront (`index.html`, `nota.html`) | Cockpit (`admin.html`, `analytics.html`) |
| --- | --- | --- | --- |
| `tactile_bento` | **01 · Tactile Bento (Default)** | Mineral Chalk `#F2F4F7`, `1.5px solid #18181B` `.tactile-card`, Sage `#DCE3C9` & Obsidian `#111216` contrast tickets | Obsidian Horizon `#08090C`, elevated `#0E1015` rail, `#12141A` cards, signal Emerald `#08291D` & Bronze `#1D150B` cards |
| `swiss_minimal` | **02 · Swiss Editorial Grid** | Crisp `#FFFFFF` daylight canvas, `#CBD5E1` hairlines, centered hero, 3-column grid above, horizontal 5-step bar | **Cool Architectural Slate Dark Mode**: `#0F172A` canvas/rail, `#1E293B` cards, `#475569` crisp `6px` radii, `#FFFFFF` CTA w/ `#0F172A` text (17.8:1) |
| `atelier_magazine` | **03 · Warm Atelier Lookbook** | Warm Linen `#EFECE6` canvas, Cream `#FAF7F0` lookbook cards, Playfair Display headlines, `185px` photography frames, ochre pill CTAs `#9A5B13` (`5.06:1`) | **Warm Espresso Studio Dark Mode**: `#181210` canvas, `#241B17` espresso cards, `#4A3830` borders, `#C87D28` ochre CTAs w/ `#181210` ink (`5.27:1`) |

- **Thermal Print Mode Immunity (`nota.html`)**: `.thermal-58mm` explicitly scopes template rules with `body:not(.thermal-58mm)` so 58mm receipt output remains crisp `#000000` on `#FFFFFF` across all templates.

## 2. Typography & Scale Tokens
- **Default / Swiss**: `'Sora'` (Display 600–800), `'Onest'` (UI 400–700), `'Space Grotesk'` (Swiss headlines), `'JetBrains Mono'` (`tabular-nums` for order IDs and Rupiah figures).
- **Warm Atelier Lookbook (`atelier_magazine`)**: `'Playfair Display'` serif display headers paired with `'Plus Jakarta Sans'` clean UI body copy and `'JetBrains Mono'` numeric readouts.

## 3. Static CSS Compilation Rule (`style.css`)
- `style.css` starts with pre-compiled static Tailwind v3 output (`--tw-*`). **No Tailwind JIT engine runs at runtime.**
- Every custom visual state, dark-mode override, responsive width clamp (`.ws-tpl-select-hdr`, `.an-select-tenant`, `.an-select-tpl`, `.nota-tpl-select`), or lookbook gallery component (`.am-gallery-card`, `.tpl-magazine-card`, `.am-gallery-media`, `.am-gallery-cta`) is authored in vanilla CSS at the bottom of `style.css` or inside page `<style>` tags.

## 4. Accessibility & Responsive Discipline
- **WCAG AA Contrast**: All interactive CTAs, pills, badges, and financial totals maintain `>= 4.5:1` contrast (dark slate `#FFFFFF`/`#0F172A` = 17.8:1; warm espresso `#C87D28`/`#181210` = 5.27:1; lookbook pill `#9A5B13`/`#FAF7F0` = 5.06:1).
- **Zero Horizontal Overflow**: Every template across `index.html`, `admin.html`, `analytics.html`, `nota.html`, and `platform.html` validates `scrollWidth <= clientWidth` at both `1440x900` desktop and `390x844` mobile viewports.
