-- ============================================================================
-- ATELIER ENGINE v4 — SUPABASE SCHEMA, RLS SECURITY, RPC & STORAGE SETUP
-- Idempotent script: safe to re-run in Supabase SQL Editor.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ----------------------------------------------------------------------------
-- 1. CORE TABLES
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.ws_tenants (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  branch TEXT NOT NULL DEFAULT '',
  niche TEXT NOT NULL DEFAULT 'sneakers_care',
  service_mode TEXT NOT NULL DEFAULT 'pickup_delivery',
  theme_preset TEXT NOT NULL DEFAULT 'crimson',
  whatsapp TEXT NOT NULL DEFAULT '',
  instagram TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  hours TEXT NOT NULL DEFAULT '',
  hero_headline_1 TEXT NOT NULL DEFAULT 'Restorasi Presisi untuk',
  hero_headline_2 TEXT NOT NULL DEFAULT 'Koleksi Sepatu Harian.',
  hero_desc TEXT NOT NULL DEFAULT '',
  pickup_policy TEXT NOT NULL DEFAULT '',
  rating_score TEXT NOT NULL DEFAULT '4.9',
  custom_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ws_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_slug TEXT NOT NULL REFERENCES public.ws_tenants(slug) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Treatment',
  price NUMERIC NOT NULL DEFAULT 0,
  promo_price NUMERIC NULL,
  is_promo BOOLEAN NOT NULL DEFAULT FALSE,
  duration TEXT NOT NULL DEFAULT '2–3 Hari',
  badge TEXT NULL,
  available BOOLEAN NOT NULL DEFAULT TRUE,
  description TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT ws_services_tenant_name_unique UNIQUE (tenant_slug, name)
);

CREATE TABLE IF NOT EXISTS public.ws_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_slug TEXT NOT NULL REFERENCES public.ws_tenants(slug) ON DELETE CASCADE,
  order_id TEXT NOT NULL,
  tracking_token TEXT NOT NULL DEFAULT UPPER(ENCODE(gen_random_bytes(16), 'hex')),
  customer_name TEXT NOT NULL DEFAULT 'Pelanggan',
  phone TEXT NOT NULL DEFAULT '',
  item_name TEXT NOT NULL DEFAULT '',
  service_name TEXT NOT NULL DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  step_index INTEGER NOT NULL DEFAULT 1,
  delivery_type TEXT NOT NULL DEFAULT 'Drop-Off Studio',
  eta_date TEXT NOT NULL DEFAULT 'Segera',
  public_note TEXT NOT NULL DEFAULT '',
  tech_note TEXT NOT NULL DEFAULT '',
  paid BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT ws_orders_tenant_order_unique UNIQUE (tenant_slug, order_id)
);

ALTER TABLE public.ws_orders ADD COLUMN IF NOT EXISTS paid BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.ws_orders ADD COLUMN IF NOT EXISTS tracking_token TEXT NOT NULL DEFAULT UPPER(ENCODE(gen_random_bytes(16), 'hex'));
ALTER TABLE public.ws_orders ADD COLUMN IF NOT EXISTS public_note TEXT NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS public.ws_tracking_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_slug TEXT NOT NULL,
  client_fingerprint TEXT NOT NULL,
  lookup_key TEXT NOT NULL DEFAULT '',
  was_hit BOOLEAN NOT NULL DEFAULT FALSE,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ws_admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'owner')),
  tenant_slug TEXT NULL REFERENCES public.ws_tenants(slug) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for fast tenant queries & 128-bit tracking token lookup
CREATE INDEX IF NOT EXISTS idx_ws_services_tenant_sort
  ON public.ws_services (tenant_slug, sort_order ASC);

CREATE INDEX IF NOT EXISTS idx_ws_orders_tenant_created
  ON public.ws_orders (tenant_slug, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_ws_orders_tenant_tracking_token
  ON public.ws_orders (tenant_slug, tracking_token);

CREATE INDEX IF NOT EXISTS idx_ws_tracking_attempts_lookup
  ON public.ws_tracking_attempts (tenant_slug, client_fingerprint, attempted_at DESC);

CREATE INDEX IF NOT EXISTS idx_ws_tracking_attempts_key
  ON public.ws_tracking_attempts (tenant_slug, lookup_key, attempted_at DESC);

CREATE INDEX IF NOT EXISTS idx_ws_admin_users_user_id
  ON public.ws_admin_users (user_id);

-- ----------------------------------------------------------------------------
-- 2. AUTHENTICATION & AUTHORIZATION HELPERS + RPCs
-- ----------------------------------------------------------------------------

DROP FUNCTION IF EXISTS public.get_my_ws_admin_profile();
CREATE OR REPLACE FUNCTION public.get_my_ws_admin_profile()
RETURNS TABLE (
  role TEXT,
  tenant_slug TEXT,
  email TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT u.role, u.tenant_slug, u.email
  FROM public.ws_admin_users u
  WHERE u.user_id = auth.uid()
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_ws_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.ws_admin_users u
    WHERE u.user_id = auth.uid()
      AND u.role = 'super_admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.can_manage_ws_tenant(target_slug TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.ws_admin_users u
    WHERE u.user_id = auth.uid()
      AND (
        u.role = 'super_admin'
        OR (u.role = 'owner' AND u.tenant_slug = target_slug)
      )
  );
$$;

-- Instant Store Cloner RPC invoked from service-config.js -> duplicateTenant()
DROP FUNCTION IF EXISTS public.duplicate_ws_tenant(text,text,text,text,text);
CREATE OR REPLACE FUNCTION public.duplicate_ws_tenant(
  source_slug TEXT,
  new_slug TEXT,
  new_name TEXT,
  new_branch TEXT,
  new_niche TEXT DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_src RECORD;
  v_clean_slug TEXT;
  v_target_niche TEXT;
  v_donor_slug TEXT;
  v_mode TEXT;
  v_theme TEXT;
  v_h1 TEXT;
  v_h2 TEXT;
  v_desc TEXT;
BEGIN
  IF NOT public.is_ws_super_admin() THEN
    RAISE EXCEPTION 'Unauthorized: super_admin role required to duplicate tenant';
  END IF;

  v_clean_slug := LOWER(REGEXP_REPLACE(TRIM(COALESCE(new_slug, '')), '[^a-z0-9-]', '', 'g'));
  IF v_clean_slug = '' THEN
    RAISE EXCEPTION 'Invalid target slug';
  END IF;

  SELECT * INTO v_src FROM public.ws_tenants WHERE slug = source_slug LIMIT 1;
  IF NOT FOUND THEN
    SELECT * INTO v_src FROM public.ws_tenants ORDER BY created_at ASC LIMIT 1;
  END IF;

  v_target_niche := COALESCE(NULLIF(TRIM(new_niche), ''), v_src.niche, 'sneakers_care');

  IF v_target_niche = 'moto_detailing' THEN
    v_mode := 'studio_slot'; v_theme := 'amber';
    v_h1 := 'Koreksi Cat & Proteksi';
    v_h2 := 'Nano Ceramic Kelas Kontes.';
    v_desc := FORMAT('Workshop detailing motor & helm presisi di %s. Lacak progres pengerjaan motor Anda langsung dari HP.', new_branch);
  ELSIF v_target_niche = 'laundry_care' THEN
    v_mode := 'pickup_delivery'; v_theme := 'emerald';
    v_h1 := 'Higienis 1 Mesin 1 Pelanggan';
    v_h2 := 'untuk Pakaian, Karpet & Sofa.';
    v_desc := FORMAT('Layanan laundry express, setrika uap, serta cuci karpet & sofa panggilan di %s. Pantau tahapan cucian Anda langsung dari HP.', new_branch);
  ELSIF v_target_niche = 'barber_studio' THEN
    v_mode := 'studio_slot'; v_theme := 'cobalt';
    v_h1 := 'Potongan Presisi & Grooming';
    v_h2 := 'Tanpa Antre di Kursi Studio.';
    v_desc := FORMAT('Barbershop & men''s grooming studio di %s. Kunci jadwal jam potong serta capster pilihan Anda dan lacak antrean langsung dari HP.', new_branch);
  ELSE
    v_mode := 'pickup_delivery'; v_theme := 'crimson';
    v_h1 := 'Restorasi Presisi untuk';
    v_h2 := 'Koleksi Sepatu Harian.';
    v_desc := FORMAT('Studio perawatan sepatu berstandar laboratorium di %s. Lacak progres pengerjaan sepatu Anda secara real-time.', new_branch);
  END IF;

  SELECT slug INTO v_donor_slug
  FROM public.ws_tenants
  WHERE niche = v_target_niche
  ORDER BY created_at ASC
  LIMIT 1;
  IF v_donor_slug IS NULL THEN
    v_donor_slug := COALESCE(v_src.slug, source_slug);
  END IF;

  INSERT INTO public.ws_tenants (
    slug, name, branch, niche, service_mode, theme_preset, whatsapp, instagram,
    address, hours, hero_headline_1, hero_headline_2, hero_desc, pickup_policy,
    rating_score, custom_config
  )
  VALUES (
    v_clean_slug,
    UPPER(TRIM(new_name)),
    TRIM(COALESCE(new_branch, '')),
    v_target_niche,
    v_mode,
    v_theme,
    COALESCE(v_src.whatsapp, '6281299887766'),
    '@' || REPLACE(v_clean_slug, '-', '.'),
    FORMAT('Studio %s, Area %s', UPPER(TRIM(new_name)), TRIM(COALESCE(new_branch, ''))),
    COALESCE(v_src.hours, 'Setiap Hari · 10.00 – 21.00 WIB'),
    v_h1,
    v_h2,
    v_desc,
    COALESCE(v_src.pickup_policy, ''),
    COALESCE(v_src.rating_score, '4.9'),
    COALESCE(v_src.custom_config, '{}'::jsonb)
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    branch = EXCLUDED.branch,
    niche = EXCLUDED.niche,
    service_mode = EXCLUDED.service_mode,
    theme_preset = EXCLUDED.theme_preset,
    updated_at = NOW();

  INSERT INTO public.ws_services (
    tenant_slug, name, category, price, promo_price, is_promo, duration, badge, available, description, sort_order
  )
  SELECT
    v_clean_slug, name, category, price, promo_price, is_promo, duration, badge, available, description, sort_order
  FROM public.ws_services
  WHERE tenant_slug = v_donor_slug
  ON CONFLICT (tenant_slug, name) DO NOTHING;

  RETURN v_clean_slug;
END;
$$;

-- Server-Side Public Booking RPC (validates tenant, format, 10-min rate limit, catalog price, 128-bit tracking_token, separated public_note vs tech_note)
DROP FUNCTION IF EXISTS public.create_public_ws_booking(text, text, text, text, text, text);
CREATE OR REPLACE FUNCTION public.create_public_ws_booking(
  p_tenant_slug TEXT,
  p_customer_name TEXT,
  p_phone TEXT,
  p_item_name TEXT,
  p_service_name TEXT,
  p_notes TEXT DEFAULT ''
)
RETURNS SETOF public.ws_orders
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_clean_slug TEXT;
  v_tenant public.ws_tenants%ROWTYPE;
  v_customer_name TEXT;
  v_item_name TEXT;
  v_raw_phone TEXT;
  v_phone_digits TEXT;
  v_norm_phone TEXT;
  v_recent_count INTEGER := 0;
  v_service_name TEXT;
  v_service_price NUMERIC;
  v_service_duration TEXT;
  v_clean_notes TEXT;
  v_public_note TEXT;
  v_tech_note TEXT;
  v_prefix TEXT;
  v_delivery_type TEXT;
  v_order_id TEXT;
  v_tracking_token TEXT;
  v_inserted public.ws_orders%ROWTYPE;
  v_attempt INTEGER;
BEGIN
  v_clean_slug := LOWER(TRIM(COALESCE(p_tenant_slug, '')));
  IF v_clean_slug = '' THEN
    RAISE EXCEPTION 'Tenant studio wajib diisi';
  END IF;

  SELECT * INTO v_tenant
  FROM public.ws_tenants
  WHERE slug = v_clean_slug
  LIMIT 1;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Studio tenant tidak ditemukan';
  END IF;

  v_customer_name := TRIM(REGEXP_REPLACE(REGEXP_REPLACE(COALESCE(p_customer_name, ''), '<[^>]*>', '', 'g'), '[<>]', '', 'g'));
  IF CHAR_LENGTH(v_customer_name) < 2 OR CHAR_LENGTH(v_customer_name) > 80 THEN
    RAISE EXCEPTION 'Nama pelanggan harus terdiri dari 2 sampai 80 karakter';
  END IF;

  v_item_name := TRIM(REGEXP_REPLACE(REGEXP_REPLACE(COALESCE(p_item_name, ''), '<[^>]*>', '', 'g'), '[<>]', '', 'g'));
  IF CHAR_LENGTH(v_item_name) < 2 OR CHAR_LENGTH(v_item_name) > 100 THEN
    RAISE EXCEPTION 'Nama unit/barang harus terdiri dari 2 sampai 100 karakter';
  END IF;

  v_raw_phone := TRIM(COALESCE(p_phone, ''));
  IF v_raw_phone = '' OR v_raw_phone !~ '^[0-9+-]+$' THEN
    RAISE EXCEPTION 'Format nomor telepon hanya boleh berisi angka, tanda + atau -';
  END IF;

  v_phone_digits := REGEXP_REPLACE(v_raw_phone, '[^0-9]', '', 'g');
  IF CHAR_LENGTH(v_phone_digits) < 9 OR CHAR_LENGTH(v_phone_digits) > 16 THEN
    RAISE EXCEPTION 'Nomor telepon harus memiliki 9 sampai 16 digit';
  END IF;

  v_norm_phone := REGEXP_REPLACE(v_phone_digits, '^62', '0');
  SELECT COUNT(*) INTO v_recent_count
  FROM public.ws_orders o
  WHERE o.tenant_slug = v_clean_slug
    AND o.created_at >= NOW() - INTERVAL '10 minutes'
    AND (
      REGEXP_REPLACE(REGEXP_REPLACE(COALESCE(o.phone, ''), '[^0-9]', '', 'g'), '^62', '0') = v_norm_phone
      OR LOWER(TRIM(COALESCE(o.customer_name, ''))) = LOWER(v_customer_name)
    );

  IF v_recent_count >= 3 THEN
    RAISE EXCEPTION 'Terlalu banyak permintaan booking dalam 10 menit terakhir. Silakan tunggu sebentar sebelum mencoba lagi.';
  END IF;

  SELECT
    s.name,
    CASE
      WHEN COALESCE(s.is_promo, FALSE)
        AND s.promo_price IS NOT NULL
        AND s.promo_price >= 0
        AND s.promo_price < s.price
      THEN s.promo_price
      ELSE COALESCE(s.price, 0)
    END,
    COALESCE(NULLIF(TRIM(s.duration), ''), 'Segera')
  INTO v_service_name, v_service_price, v_service_duration
  FROM public.ws_services s
  WHERE s.tenant_slug = v_clean_slug
    AND COALESCE(s.available, TRUE) = TRUE
    AND LOWER(TRIM(s.name)) = LOWER(TRIM(COALESCE(p_service_name, '')))
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Layanan "%" tidak ditemukan atau sedang tidak tersedia untuk studio ini', COALESCE(p_service_name, '');
  END IF;

  v_clean_notes := TRIM(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(COALESCE(p_notes, ''), '<[^>]*>', '', 'g'),
        '[<>]', '', 'g'
      ),
      '[\r\n\t]+', ' ', 'g'
    )
  );
  v_clean_notes := LEFT(v_clean_notes, 160);
  v_public_note := 'Pesanan diterima melalui booking online. Menunggu inspeksi awal studio.';
  IF v_clean_notes <> '' THEN
    v_tech_note := '[Catatan Pelanggan]: ' || v_clean_notes;
  ELSE
    v_tech_note := 'Pesanan masuk via booking web. Menunggu inspeksi & konfirmasi admin studio.';
  END IF;

  v_prefix := UPPER(LEFT(REGEXP_REPLACE(COALESCE(v_tenant.name, ''), '[^A-Za-z]', '', 'g'), 3));
  IF v_prefix = '' THEN
    v_prefix := UPPER(LEFT(REGEXP_REPLACE(v_clean_slug, '[^a-z]', '', 'g'), 3));
  END IF;
  IF CHAR_LENGTH(v_prefix) < 3 THEN
    v_prefix := RPAD(COALESCE(NULLIF(v_prefix, ''), 'ORD'), 3, 'X');
  END IF;

  v_delivery_type := CASE
    WHEN v_tenant.service_mode = 'studio_slot' THEN 'Reservasi Slot Studio'
    ELSE 'Booking Web'
  END;

  FOR v_attempt IN 1..5 LOOP
    -- Short receipt label uses 32-bit random hex, paired with a mandatory 128-bit (16-byte) cryptographic tracking_token
    v_order_id := v_prefix || '-' || UPPER(ENCODE(gen_random_bytes(4), 'hex'));
    v_tracking_token := UPPER(ENCODE(gen_random_bytes(16), 'hex'));
    BEGIN
      INSERT INTO public.ws_orders (
        tenant_slug,
        order_id,
        tracking_token,
        customer_name,
        phone,
        item_name,
        service_name,
        price,
        step_index,
        delivery_type,
        eta_date,
        public_note,
        tech_note,
        paid
      )
      VALUES (
        v_clean_slug,
        v_order_id,
        v_tracking_token,
        v_customer_name,
        v_raw_phone,
        v_item_name,
        v_service_name,
        v_service_price,
        1,
        v_delivery_type,
        v_service_duration,
        v_public_note,
        v_tech_note,
        FALSE
      )
      RETURNING * INTO v_inserted;

      RETURN NEXT v_inserted;
      RETURN;
    EXCEPTION
      WHEN unique_violation THEN
        IF v_attempt = 5 THEN
          RAISE EXCEPTION 'Gagal menghasilkan kode nota unik, silakan ulangi';
        END IF;
    END;
  END LOOP;
END;
$$;

-- Public Receipt Lookup RPC (Requires 128-bit tracking_token ownership proof, enforces rate limiting via ws_tracking_attempts, masks PII, and strictly excludes internal tech_note)
DROP FUNCTION IF EXISTS public.get_public_ws_order(text, text);
DROP FUNCTION IF EXISTS public.get_public_ws_order(text, text, text);
CREATE OR REPLACE FUNCTION public.get_public_ws_order(
  p_tenant_slug TEXT,
  p_order_id TEXT,
  p_tracking_token TEXT DEFAULT NULL
)
RETURNS TABLE (
  order_id TEXT,
  tenant_slug TEXT,
  customer_name TEXT,
  phone TEXT,
  item_name TEXT,
  service TEXT,
  price NUMERIC,
  step_index INTEGER,
  status_label TEXT,
  paid BOOLEAN,
  public_note TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  eta TEXT
)
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_clean_slug TEXT;
  v_raw_input TEXT;
  v_clean_order_id TEXT := '';
  v_clean_token TEXT := '';
  v_headers JSONB := '{}'::jsonb;
  v_client_fp TEXT := 'anon-client';
  v_lookup_key TEXT := '';
  v_failed_ip_count INTEGER := 0;
  v_failed_key_count INTEGER := 0;
  v_burst_count INTEGER := 0;
  v_found_row RECORD;
BEGIN
  v_clean_slug := LOWER(TRIM(COALESCE(p_tenant_slug, '')));
  v_raw_input := UPPER(TRIM(COALESCE(p_order_id, '')));
  v_clean_token := UPPER(REGEXP_REPLACE(TRIM(COALESCE(p_tracking_token, '')), '[^A-F0-9]', '', 'g'));

  IF v_clean_slug = '' OR (v_raw_input = '' AND v_clean_token = '') THEN
    RETURN;
  END IF;

  -- Allow composite input "ORDER_ID.TRACKING_TOKEN" or "ORDER_ID:TRACKING_TOKEN" or direct 128-bit hex token in p_order_id
  IF v_clean_token = '' THEN
    IF POSITION('.' IN v_raw_input) > 0 THEN
      v_clean_order_id := TRIM(SPLIT_PART(v_raw_input, '.', 1));
      v_clean_token := REGEXP_REPLACE(TRIM(SPLIT_PART(v_raw_input, '.', 2)), '[^A-F0-9]', '', 'g');
    ELSIF POSITION(':' IN v_raw_input) > 0 THEN
      v_clean_order_id := TRIM(SPLIT_PART(v_raw_input, ':', 1));
      v_clean_token := REGEXP_REPLACE(TRIM(SPLIT_PART(v_raw_input, ':', 2)), '[^A-F0-9]', '', 'g');
    ELSIF v_raw_input ~ '^[A-F0-9]{32,64}$' THEN
      v_clean_token := v_raw_input;
    ELSE
      v_clean_order_id := v_raw_input;
    END IF;
  ELSE
    v_clean_order_id := v_raw_input;
  END IF;

  v_lookup_key := COALESCE(NULLIF(v_clean_order_id, ''), LEFT(v_clean_token, 16), 'unknown');

  -- Extract client fingerprint from PostgREST request headers for rate limiting
  BEGIN
    v_headers := COALESCE(NULLIF(CURRENT_SETTING('request.headers', true), '')::jsonb, '{}'::jsonb);
    v_client_fp := COALESCE(
      NULLIF(TRIM(SPLIT_PART(COALESCE(v_headers ->> 'x-forwarded-for', ''), ',', 1)), ''),
      NULLIF(TRIM(COALESCE(v_headers ->> 'cf-connecting-ip', '')), ''),
      NULLIF(TRIM(COALESCE(v_headers ->> 'x-real-ip', '')), ''),
      COALESCE(auth.uid()::text, 'anon-client')
    );
  EXCEPTION
    WHEN OTHERS THEN
      v_client_fp := COALESCE(auth.uid()::text, 'anon-client');
  END;

  -- Prune expired rate-limit logs (> 1 hour old)
  DELETE FROM public.ws_tracking_attempts
  WHERE attempted_at < NOW() - INTERVAL '1 hour';

  -- Rate-limit check 1: Burst limit per client (max 25 requests / 1 minute)
  SELECT COUNT(*) INTO v_burst_count
  FROM public.ws_tracking_attempts a
  WHERE a.tenant_slug = v_clean_slug
    AND a.client_fingerprint = v_client_fp
    AND a.attempted_at >= NOW() - INTERVAL '1 minute';

  IF v_burst_count >= 25 THEN
    RAISE EXCEPTION 'Terlalu banyak permintaan pelacakan nota dalam 1 menit terakhir. Silakan tunggu sebentar.';
  END IF;

  -- Rate-limit check 2: Failed attempts per client (max 10 failed tries / 5 minutes)
  SELECT COUNT(*) INTO v_failed_ip_count
  FROM public.ws_tracking_attempts a
  WHERE a.tenant_slug = v_clean_slug
    AND a.client_fingerprint = v_client_fp
    AND a.was_hit = FALSE
    AND a.attempted_at >= NOW() - INTERVAL '5 minutes';

  IF v_failed_ip_count >= 10 THEN
    RAISE EXCEPTION 'Terlalu banyak percobaan pelacakan nota yang gagal. Silakan tunggu 5 menit sebelum mencoba kembali.';
  END IF;

  -- Rate-limit check 3: Failed attempts targeting a specific order code (max 8 failed tries / 5 minutes)
  IF v_clean_order_id <> '' THEN
    SELECT COUNT(*) INTO v_failed_key_count
    FROM public.ws_tracking_attempts a
    WHERE a.tenant_slug = v_clean_slug
      AND a.lookup_key = v_clean_order_id
      AND a.was_hit = FALSE
      AND a.attempted_at >= NOW() - INTERVAL '5 minutes';

    IF v_failed_key_count >= 8 THEN
      RAISE EXCEPTION 'Kode nota ini sedang dikunci sementara karena terlalu banyak percobaan gagal. Silakan coba lagi dalam 5 menit.';
    END IF;
  END IF;

  -- Ownership verification: strictly require >= 128-bit (32 hex chars) tracking_token
  IF CHAR_LENGTH(v_clean_token) < 32 THEN
    INSERT INTO public.ws_tracking_attempts (tenant_slug, client_fingerprint, lookup_key, was_hit)
    VALUES (v_clean_slug, v_client_fp, v_lookup_key, FALSE);
    RETURN;
  END IF;

  SELECT
    o.order_id,
    o.tenant_slug,
    CASE
      WHEN POSITION(' ' IN REGEXP_REPLACE(TRIM(COALESCE(o.customer_name, '')), '\s+', ' ', 'g')) > 0 THEN
        SPLIT_PART(REGEXP_REPLACE(TRIM(COALESCE(o.customer_name, '')), '\s+', ' ', 'g'), ' ', 1) || ' ***'
      WHEN CHAR_LENGTH(TRIM(COALESCE(o.customer_name, ''))) >= 4 THEN
        LEFT(TRIM(o.customer_name), 2) || '***'
      WHEN CHAR_LENGTH(TRIM(COALESCE(o.customer_name, ''))) > 0 THEN
        LEFT(TRIM(o.customer_name), 1) || '***'
      ELSE '***'
    END AS masked_customer_name,
    CASE
      WHEN LENGTH(REGEXP_REPLACE(COALESCE(o.phone, ''), '[^0-9]', '', 'g')) >= 8 THEN
        LEFT(REGEXP_REPLACE(COALESCE(o.phone, ''), '[^0-9]', '', 'g'), 4)
        || '****'
        || RIGHT(REGEXP_REPLACE(COALESCE(o.phone, ''), '[^0-9]', '', 'g'), 3)
      WHEN LENGTH(REGEXP_REPLACE(COALESCE(o.phone, ''), '[^0-9]', '', 'g')) >= 4 THEN
        LEFT(REGEXP_REPLACE(COALESCE(o.phone, ''), '[^0-9]', '', 'g'), 2)
        || '****'
        || RIGHT(REGEXP_REPLACE(COALESCE(o.phone, ''), '[^0-9]', '', 'g'), 1)
      WHEN LENGTH(REGEXP_REPLACE(COALESCE(o.phone, ''), '[^0-9]', '', 'g')) > 0 THEN
        '****'
      ELSE ''
    END AS masked_phone,
    o.item_name,
    o.service_name AS service,
    o.price,
    o.step_index,
    CASE COALESCE(t.niche, 'sneakers_care')
      WHEN 'moto_detailing' THEN
        CASE LEAST(GREATEST(COALESCE(o.step_index, 1), 1), 5)
          WHEN 1 THEN 'Inspeksi Cat'
          WHEN 2 THEN 'Bongkar & Decon'
          WHEN 3 THEN 'Paint Correction'
          WHEN 4 THEN 'Nano Ceramic 9H'
          ELSE 'Final QC & Siap'
        END
      WHEN 'laundry_care' THEN
        CASE LEAST(GREATEST(COALESCE(o.step_index, 1), 1), 5)
          WHEN 1 THEN 'Timbang & Sortir'
          WHEN 2 THEN 'Washing & Extraction'
          WHEN 3 THEN 'Hygienic Drying'
          WHEN 4 THEN 'Setrika Uap & Parfum'
          ELSE 'Siap Antar / Ambil'
        END
      WHEN 'barber_studio' THEN
        CASE LEAST(GREATEST(COALESCE(o.step_index, 1), 1), 5)
          WHEN 1 THEN 'Jadwal Terkonfirmasi'
          WHEN 2 THEN 'Check-In & Konsultasi'
          WHEN 3 THEN 'Precision Haircut'
          WHEN 4 THEN 'Hair Wash & Hot Towel'
          ELSE 'Pomade Styling & Selesai'
        END
      ELSE
        CASE LEAST(GREATEST(COALESCE(o.step_index, 1), 1), 5)
          WHEN 1 THEN 'Inspeksi Awal'
          WHEN 2 THEN 'Deep Cleaning'
          WHEN 3 THEN 'Detailing / UV'
          WHEN 4 THEN 'Sterilisasi & QC'
          ELSE 'Siap Serah Terima'
        END
    END AS computed_status_label,
    o.paid,
    COALESCE(
      NULLIF(TRIM(o.public_note), ''),
      CASE LEAST(GREATEST(COALESCE(o.step_index, 1), 1), 5)
        WHEN 1 THEN 'Unit telah diterima studio dan sedang dalam antrean inspeksi awal.'
        WHEN 2 THEN 'Unit sedang dalam proses pengerjaan inti sesuai SOP laboratorium studio.'
        WHEN 3 THEN 'Tahap pendetailan presisi dan perawatan lanjutan sedang berlangsung.'
        WHEN 4 THEN 'Tahap sterilisasi akhir dan pemeriksaan kendali mutu (Quality Control).'
        ELSE 'Pengerjaan selesai. Unit siap diserahkan atau diambil sesuai jadwal.'
      END
    ) AS safe_public_note,
    o.created_at,
    o.updated_at,
    o.eta_date AS eta
  INTO v_found_row
  FROM public.ws_orders o
  LEFT JOIN public.ws_tenants t
    ON t.slug = o.tenant_slug
  WHERE o.tenant_slug = v_clean_slug
    AND UPPER(TRIM(o.tracking_token)) = v_clean_token
    AND (v_clean_order_id = '' OR UPPER(TRIM(o.order_id)) = v_clean_order_id)
  LIMIT 1;

  IF NOT FOUND THEN
    INSERT INTO public.ws_tracking_attempts (tenant_slug, client_fingerprint, lookup_key, was_hit)
    VALUES (v_clean_slug, v_client_fp, v_lookup_key, FALSE);
    RETURN;
  END IF;

  INSERT INTO public.ws_tracking_attempts (tenant_slug, client_fingerprint, lookup_key, was_hit)
  VALUES (v_clean_slug, v_client_fp, v_lookup_key, TRUE);

  RETURN QUERY SELECT
    v_found_row.order_id,
    v_found_row.tenant_slug,
    v_found_row.masked_customer_name,
    v_found_row.masked_phone,
    v_found_row.item_name,
    v_found_row.service,
    v_found_row.price,
    v_found_row.step_index,
    v_found_row.computed_status_label,
    v_found_row.paid,
    v_found_row.safe_public_note,
    v_found_row.created_at,
    v_found_row.updated_at,
    v_found_row.eta;
END;
$$;

REVOKE ALL ON FUNCTION public.get_my_ws_admin_profile() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_my_ws_admin_profile() TO authenticated;

REVOKE ALL ON FUNCTION public.is_ws_super_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_ws_super_admin() TO authenticated;

REVOKE ALL ON FUNCTION public.can_manage_ws_tenant(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.can_manage_ws_tenant(TEXT) TO authenticated;

REVOKE ALL ON FUNCTION public.duplicate_ws_tenant(TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.duplicate_ws_tenant(TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;

REVOKE ALL ON FUNCTION public.create_public_ws_booking(text, text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_public_ws_booking(text, text, text, text, text, text) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.get_public_ws_order(text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_ws_order(text, text, text) TO anon, authenticated;

-- ----------------------------------------------------------------------------
-- 3. ROW-LEVEL SECURITY (ADMIN-ONLY ORDER READ/WRITE, PUBLIC BOOKING VIA RPC ONLY)
-- ----------------------------------------------------------------------------

ALTER TABLE public.ws_tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ws_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ws_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ws_tracking_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ws_admin_users ENABLE ROW LEVEL SECURITY;

-- ws_tenants policies
DROP POLICY IF EXISTS "ws_tenants_public_read" ON public.ws_tenants;
CREATE POLICY "ws_tenants_public_read"
  ON public.ws_tenants FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "ws_tenants_super_admin_insert" ON public.ws_tenants;
CREATE POLICY "ws_tenants_super_admin_insert"
  ON public.ws_tenants FOR INSERT
  TO authenticated
  WITH CHECK (public.is_ws_super_admin());

DROP POLICY IF EXISTS "ws_tenants_authorized_update" ON public.ws_tenants;
CREATE POLICY "ws_tenants_authorized_update"
  ON public.ws_tenants FOR UPDATE
  TO authenticated
  USING (public.can_manage_ws_tenant(slug))
  WITH CHECK (public.can_manage_ws_tenant(slug));

DROP POLICY IF EXISTS "ws_tenants_super_admin_delete" ON public.ws_tenants;
CREATE POLICY "ws_tenants_super_admin_delete"
  ON public.ws_tenants FOR DELETE
  TO authenticated
  USING (public.is_ws_super_admin());

-- ws_services policies
DROP POLICY IF EXISTS "ws_services_public_read" ON public.ws_services;
CREATE POLICY "ws_services_public_read"
  ON public.ws_services FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "ws_services_authorized_write" ON public.ws_services;
DROP POLICY IF EXISTS "ws_services_authorized_insert" ON public.ws_services;
CREATE POLICY "ws_services_authorized_insert"
  ON public.ws_services FOR INSERT
  TO authenticated
  WITH CHECK (public.can_manage_ws_tenant(tenant_slug));

DROP POLICY IF EXISTS "ws_services_authorized_update" ON public.ws_services;
CREATE POLICY "ws_services_authorized_update"
  ON public.ws_services FOR UPDATE
  TO authenticated
  USING (public.can_manage_ws_tenant(tenant_slug))
  WITH CHECK (public.can_manage_ws_tenant(tenant_slug));

DROP POLICY IF EXISTS "ws_services_authorized_delete" ON public.ws_services;
CREATE POLICY "ws_services_authorized_delete"
  ON public.ws_services FOR DELETE
  TO authenticated
  USING (public.can_manage_ws_tenant(tenant_slug));

-- ws_orders policies (Isolated per-tenant admin CRUD; public access strictly via SECURITY DEFINER RPCs)
DROP POLICY IF EXISTS "ws_orders_public_read" ON public.ws_orders;
DROP POLICY IF EXISTS "ws_orders_admin_select" ON public.ws_orders;
CREATE POLICY "ws_orders_admin_select"
  ON public.ws_orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.ws_admin_users u
      WHERE u.user_id = auth.uid()
        AND (
          u.role = 'super_admin'
          OR u.tenant_slug = ws_orders.tenant_slug
        )
    )
  );

DROP POLICY IF EXISTS "ws_orders_authorized_write" ON public.ws_orders;
DROP POLICY IF EXISTS "ws_orders_public_booking_insert" ON public.ws_orders;
DROP POLICY IF EXISTS "ws_orders_public_insert" ON public.ws_orders;
DROP POLICY IF EXISTS "ws_orders_authorized_insert" ON public.ws_orders;
DROP POLICY IF EXISTS "ws_orders_admin_insert" ON public.ws_orders;
CREATE POLICY "ws_orders_admin_insert"
  ON public.ws_orders FOR INSERT
  TO authenticated
  WITH CHECK (public.can_manage_ws_tenant(tenant_slug));

DROP POLICY IF EXISTS "ws_orders_authorized_update" ON public.ws_orders;
CREATE POLICY "ws_orders_authorized_update"
  ON public.ws_orders FOR UPDATE
  TO authenticated
  USING (public.can_manage_ws_tenant(tenant_slug))
  WITH CHECK (public.can_manage_ws_tenant(tenant_slug));

DROP POLICY IF EXISTS "ws_orders_authorized_delete" ON public.ws_orders;
CREATE POLICY "ws_orders_authorized_delete"
  ON public.ws_orders FOR DELETE
  TO authenticated
  USING (public.can_manage_ws_tenant(tenant_slug));

-- ws_admin_users policies (read-only self profile or super_admin)
DROP POLICY IF EXISTS "ws_admin_users_read_self" ON public.ws_admin_users;
CREATE POLICY "ws_admin_users_read_self"
  ON public.ws_admin_users FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_ws_super_admin());

-- ----------------------------------------------------------------------------
-- 4. STORAGE BUCKET & MEDIA POLICIES ("cafe-assets")
-- ----------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cafe-assets',
  'cafe-assets',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE
SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "ws_assets_public_read" ON storage.objects;
CREATE POLICY "ws_assets_public_read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'cafe-assets');

DROP POLICY IF EXISTS "ws_assets_authenticated_upload" ON storage.objects;
CREATE POLICY "ws_assets_authenticated_upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'cafe-assets'
    AND EXISTS (
      SELECT 1
      FROM public.ws_admin_users u
      WHERE u.user_id = auth.uid()
        AND (
          u.role = 'super_admin'
          OR (
            (storage.foldername(name))[1] = 'workshop'
            AND (storage.foldername(name))[2] = u.tenant_slug
          )
        )
    )
  );

DROP POLICY IF EXISTS "ws_assets_authenticated_update" ON storage.objects;
CREATE POLICY "ws_assets_authenticated_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'cafe-assets'
    AND EXISTS (
      SELECT 1
      FROM public.ws_admin_users u
      WHERE u.user_id = auth.uid()
        AND (
          u.role = 'super_admin'
          OR (
            (storage.foldername(name))[1] = 'workshop'
            AND (storage.foldername(name))[2] = u.tenant_slug
          )
        )
    )
  )
  WITH CHECK (
    bucket_id = 'cafe-assets'
    AND EXISTS (
      SELECT 1
      FROM public.ws_admin_users u
      WHERE u.user_id = auth.uid()
        AND (
          u.role = 'super_admin'
          OR (
            (storage.foldername(name))[1] = 'workshop'
            AND (storage.foldername(name))[2] = u.tenant_slug
          )
        )
    )
  );

DROP POLICY IF EXISTS "ws_assets_authenticated_delete" ON storage.objects;
CREATE POLICY "ws_assets_authenticated_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'cafe-assets'
    AND EXISTS (
      SELECT 1
      FROM public.ws_admin_users u
      WHERE u.user_id = auth.uid()
        AND (
          u.role = 'super_admin'
          OR (
            (storage.foldername(name))[1] = 'workshop'
            AND (storage.foldername(name))[2] = u.tenant_slug
          )
        )
    )
  );

-- ----------------------------------------------------------------------------
-- OPTIONAL INITIAL SUPER ADMIN SEED EXAMPLE (Run after creating user in Auth):
-- INSERT INTO public.ws_admin_users (user_id, email, role, tenant_slug)
-- SELECT id, email, 'super_admin', NULL
-- FROM auth.users
-- WHERE email = 'founder@atelier-engine.id'
-- ON CONFLICT (user_id) DO NOTHING;
-- ----------------------------------------------------------------------------
