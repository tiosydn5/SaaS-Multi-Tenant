# PRODUCT.md — ATELIER ENGINE v4 (Multi-Tenant Service Studio SaaS)

## Core Architecture & Active Pages
ATELIER ENGINE v4 is a browser-native multi-tenant service platform with synchronized Supabase cloud persistence (`SUPABASE_SETUP.sql`), isolated flagship tenant state, and a 3-template polymorphic UI engine across all five application views:
1. **`index.html` (Public Storefront & Live Order Tracker)**: Customer-facing booking catalog, add-on estimator, dynamic SOP / inspection anatomy, WhatsApp order payload dispatch, and 5-stage live ticket tracker (`?mitra=<slug>`).
2. **`admin.html` (Cashier Workbench & Super Admin Console)**: High-speed 1-click stage progression, inline technician bench notes, List & Kanban queue views, service catalog editor, studio profile & media picker, plus role-gated tenant cloner & AI JSON generator.
3. **`analytics.html` (Omzet & Cashflow Telemetry)**: Cash-ready vs. rack-receivables telemetry, stage distribution, service revenue ranking bar chart, CSV ledger export, and live header template switching.
4. **`nota.html` (E-Nota Digital & Thermal 58mm Printer View)**: Claim ticket with QR live-tracking URL, synced template selector, and dedicated `@media print` monochrome 58mm thermal strip mode (`?thermal=1`).
5. **`platform.html` (Showcase & Live Split Simulator)**: Agency hub with live Desktop/Mobile telemetry preview, Pop-up Split 1:1 Sandbox modal, Instant Store Builder (3 template radio selector cards), and flagship vertical switchers.

## Multi-Niche Flagship Tenants
- `kultur-kicks` (`sneakers_care`): **KULTUR KICKS LAB** — Default Template `01 · Tactile Bento (Default)` (`tactile_bento`), prefix `KLK-`.
- `apex-motoworks` (`moto_detailing`): **APEX MOTODETAILING** — Default Template `01 · Tactile Bento (Default)` (`tactile_bento`), prefix `APX-`.
- `lume-laundry` (`laundry_care`): **LUME FABRIC & HOME CARE** — Default Template `02 · Swiss Editorial Grid` (`swiss_minimal`), prefix `LUM-`.
- `monarch-barber` (`barber_studio`): **MONARCH GROOMING CLUB** — Default Template `03 · Warm Atelier Lookbook` (`atelier_magazine`), prefix `MNR-`.

## 3-Template Engine & Cross-Page Sync
- Supported template keys (`WORKSHOP_UI_TEMPLATES`):
  1. `tactile_bento`: **01 · Tactile Bento (Default)** — Mineral-chalk storefront paired with dark Obsidian cockpit surfaces.
  2. `swiss_minimal`: **02 · Swiss Editorial Grid** — Crisp white/slate daylight storefront & E-Nota paired with Cool Architectural Slate Dark Mode in `admin.html` and `analytics.html`.
  3. `atelier_magazine`: **03 · Warm Atelier Lookbook** — Warm cream/linen editorial lookbook on `index.html` & `nota.html` (Playfair Display serif headlines, framed lookbook cards, ochre pill CTAs) paired with Warm Espresso Studio Dark Mode (`#181210` / `#241B17` / `#C87D28`) in `admin.html` and `analytics.html`.
- All unknown or legacy template keys coerce safely via `window.resolveValidUiTemplate()` to `tactile_bento` or the tenant's fallback template.
- Direct UI switching on `admin.html` (`#adminTemplateSelector`), `analytics.html` (`#anTemplateSelector`), `nota.html` (`#notaTemplateSelector`), and `platform.html` persists via `ServiceStore.saveTenantProfile()` across `localStorage` and cross-page storage/postMessage sync.

## Security, Isolation & Role Boundaries
- **Cloud Write Guard (`canWriteToCloud()`)**: Anonymous visitors, demo sandboxes (`?demo=1`, `?mode=demo`), and unauthenticated sessions keep all mutations local and never overwrite Supabase tables or upload files to Storage buckets.
- **Server-Side Booking RPC (`create_public_ws_booking`)**: Direct public `INSERT` on `public.ws_orders` is disabled. Public bookings are processed exclusively through `public.create_public_ws_booking(...)` (`SECURITY DEFINER`), which validates tenant existence, enforces server-side rate limiting (anti-spam per tenant/phone/name), calculates authoritative service & add-on pricing directly from `public.ws_services`, separates customer-facing `public_note` from internal `tech_note`, and generates a 32-bit random order code (`PREFIX-XXXXXXXX`) paired with a **128-bit cryptographic `tracking_token`** (`gen_random_bytes(16)` = 32 hex chars).
- **Token-Gated & Rate-Limited Public Order Tracking (`get_public_ws_order`)**: Public `SELECT` on `public.ws_orders` is completely blocked (`ws_orders_admin_select` restricts table reads strictly to authenticated admins of that tenant or `super_admin`). Public Live Tracker (`index.html`) and E-Nota (`nota.html`) query `public.get_public_ws_order(p_tenant_slug, p_order_id, p_tracking_token)`, which enforces per-client and per-order rate limits via `public.ws_tracking_attempts`, verifies the 128-bit `tracking_token`, masks customer PII (partially redacted name and phone, `delivery_type` hidden), and returns only `public_note` (never exposing internal `tech_note`).
- **Role-Based Admin Permissions & Tenant Isolation**:
  - `super_admin`: Full access across all tenants, Cloner & Gemini AI tab (`#navBtn-cloner`), tenant creation/duplication (`duplicate_ws_tenant` — copies profile & catalog only, never customer orders), and demo reset.
  - `owner`: Strictly scoped to assigned `tenant_slug` across `ws_tenants`, `ws_services`, `ws_orders`, and `storage.objects` (`cafe-assets` bucket folder `<tenant_slug>/...`); cloner tools and multi-tenant switchers are locked out.
  - `sandbox` (Portfolio Demo `?demo=1`): Can switch flagship tenants (`#adminTenantSelect`) and edit store niche (`#profNiche`), while Cloner/AI tools and demo reset remain strictly locked.
- **Cross-Contamination & XSS Shield (`service-config.js`)**: Flagship service and order imports from cloud or `localStorage` run through `isCrossContaminated()` per item, backfilling clean domain records if empty, while `stripDangerousTags()`, `window.escapeHtml()`, and `window.sanitizeUrl()` sanitize all dynamic values before DOM rendering.

## Deployment & Distribusi
- **Database Cloud (Opsional — Supabase)**: Jalankan skrip idempotent `SUPABASE_SETUP.sql` di Supabase SQL Editor tanpa khawatir menghapus data atau akun admin yang sudah ada (`CREATE TABLE IF NOT EXISTS`, `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`, tanpa `DROP TABLE`). Kebijakan RLS mengizinkan publik membaca profil & katalog layanan (`ws_tenants`, `ws_services`), memproses booking publik melalui RPC `create_public_ws_booking()` (validasi katalog & harga server-side + rate-limit), serta melacak status pesanan secara aman melalui RPC `get_public_ws_order()` dengan verifikasi `tracking_token` 128-bit dan pemisahan `public_note` dari `tech_note`. Seluruh pembacaan tabel pesanan penuh, pembaruan status, penghapusan nota, dan pengelolaan profil/layanan/storage studio dikunci ketat per-tenant pada akun `authenticated` di `ws_admin_users`.
- **Catatan Rilis Kreavo (Paket ZIP Komersial)**: Untuk distribusi file ZIP komersial (`Atelier-Engine-v4-Kreavo.zip`), nilai `SUPABASE_URL` dan `SUPABASE_ANON_KEY` pada `window.SERVICE_ENGINE_CONFIG` di `service-config.js` telah disiapkan dengan placeholder (`"MASUKKAN_PROJECT_URL_SUPABASE_ANDA"` dan `"MASUKKAN_ANON_KEY_SUPABASE_ANDA"`). Saat placeholder terdeteksi, `window.isSupabaseConfigured()` otomatis menonaktifkan panggilan cloud dan seluruh engine langsung berjalan penuh secara offline/static-host menggunakan `localStorage` tanpa perlu konfigurasi server atau backend tambahan.

