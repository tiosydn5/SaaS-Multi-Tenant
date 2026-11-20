window.SERVICE_ENGINE_CONFIG = {
  SUPABASE_URL:
    (window.__ENV__ && window.__ENV__.PUBLIC_SUPABASE_URL) ||
    "MASUKKAN_PROJECT_URL_SUPABASE_ANDA",

  SUPABASE_ANON_KEY:
    (window.__ENV__ && window.__ENV__.PUBLIC_SUPABASE_ANON_KEY) ||
    "MASUKKAN_ANON_KEY_SUPABASE_ANDA",

  STORAGE_BUCKET_NAME: "cafe-assets",
  STORAGE_KEY_PREFIX: "atelier_service_engine_v4_"
};

(function ensureSupabaseSdk() {
  const cfg = window.SERVICE_ENGINE_CONFIG;
  const hasRealUrl = cfg && cfg.SUPABASE_URL && !String(cfg.SUPABASE_URL).includes("MASUKKAN_PROJECT_URL");
  const hasRealKey = cfg && cfg.SUPABASE_ANON_KEY && !String(cfg.SUPABASE_ANON_KEY).includes("MASUKKAN_ANON_KEY");
  if (!hasRealUrl || !hasRealKey) return;

  if (typeof window.supabase === "undefined") {
    const injectScript = () => {
      if (typeof window.supabase !== "undefined") return;
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
      s.async = true;
      s.onload = () => {
        if (window.ServiceStore && window.ServiceStore.syncFromCloud) {
          window.ServiceStore.syncFromCloud();
        }
      };
      document.head.appendChild(s);
    };

    let isUncachedCustomMitra = false;
    try {
      const params = new URLSearchParams(window.location.search);
      const urlMitra = (params.get("mitra") || "").trim().toLowerCase();
      if (urlMitra && urlMitra !== "kultur-kicks") {
        const raw = localStorage.getItem(window.SERVICE_ENGINE_CONFIG.STORAGE_KEY_PREFIX + "tenants");
        const map = raw ? JSON.parse(raw) : {};
        if (!map[urlMitra]) isUncachedCustomMitra = true;
      }
    } catch (e) {}

    if (isUncachedCustomMitra) {
      injectScript();
    } else if (document.readyState === "complete") {
      setTimeout(injectScript, 100);
    } else {
      window.addEventListener("load", () => setTimeout(injectScript, 100), { once: true });
    }
  }
})();

(function () {
  let cachedClient = null;

  // Industrial Tag Accents on Pure Monochrome Carbon / Paper Surfaces
  window.WORKSHOP_THEME_PRESETS = {
    crimson: {
      name: "Obsidian & Signal Vermilion",
      accent: "#D9381E",
      accentHover: "#B82B14",
      accentLight: "#FF6B52",
      accentSoft: "rgba(217, 56, 30, 0.14)",
      rgbAccent: "217 56 30",
      shellTint: "#161619",
      shellDark: "#0B0B0D",
      fgOnAccent: "#FFFFFF"
    },
    amber: {
      name: "Obsidian & Signal Amber",
      accent: "#D97706",
      accentHover: "#B45309",
      accentLight: "#FBBF24",
      accentSoft: "rgba(217, 119, 6, 0.14)",
      rgbAccent: "217 119 6",
      shellTint: "#161618",
      shellDark: "#0B0B0D",
      fgOnAccent: "#FFFFFF"
    },
    volt: {
      name: "Pure Monochrome Steel",
      accent: "#3F3F46",
      accentHover: "#27272A",
      accentLight: "#E4E4E7",
      accentSoft: "rgba(161, 161, 170, 0.14)",
      rgbAccent: "63 63 70",
      shellTint: "#161619",
      shellDark: "#0B0B0D",
      fgOnAccent: "#FFFFFF"
    },
    cobalt: {
      name: "Obsidian & Precision Cobalt",
      accent: "#2563EB",
      accentHover: "#1D4ED8",
      accentLight: "#60A5FA",
      accentSoft: "rgba(37, 99, 235, 0.14)",
      rgbAccent: "37 99 235",
      shellTint: "#15161A",
      shellDark: "#0B0B0D",
      fgOnAccent: "#FFFFFF"
    },
    emerald: {
      name: "Obsidian & Lab Teal",
      accent: "#047857",
      accentHover: "#065F46",
      accentLight: "#34D399",
      accentSoft: "rgba(4, 120, 87, 0.14)",
      rgbAccent: "4 120 87",
      shellTint: "#141717",
      shellDark: "#0B0B0D",
      fgOnAccent: "#FFFFFF"
    }
  };

  window.WORKSHOP_UI_TEMPLATES = {
    tactile_bento: {
      id: "tactile_bento",
      name: "01 · Tactile Bento (Default)",
      desc: "Layout asimetris 7:5, navbar kapsul, katalog 2 kolom horizontal & hard-shadow 3D."
    },
    swiss_minimal: {
      id: "swiss_minimal",
      name: "02 · Swiss Editorial Grid",
      desc: "Hero terpusat, tracker bar horizontal terang, katalog 3 kolom di atas & SOP 5-tahap mendatar."
    },
    atelier_magazine: {
      id: "atelier_magazine",
      name: "03 · Warm Atelier Lookbook",
      desc: "Kertas krem klasik, tipografi serif Editorial, kartu galeri berbingkai & voucher reservasi."
    }
  };

  window.resolveValidUiTemplate = function (templateKey, fallbackKey) {
    if (templateKey && window.WORKSHOP_UI_TEMPLATES && window.WORKSHOP_UI_TEMPLATES[templateKey]) {
      return templateKey;
    }
    if (fallbackKey && window.WORKSHOP_UI_TEMPLATES && window.WORKSHOP_UI_TEMPLATES[fallbackKey]) {
      return fallbackKey;
    }
    return "tactile_bento";
  };

  window.applyWorkshopTemplate = function (templateKey) {
    const validKey = window.resolveValidUiTemplate(templateKey);
    document.documentElement.setAttribute("data-ui-template", validKey);
    return validKey;
  };

  // Curated Real-Camera Workshop Photo Bank (Sneakers Care & Motodetailing)
  window.CURATED_WORKSHOP_BANK = [
    {
      cat: "snk_wash",
      label: "Deep Clean & Fast Wash Sneakers",
      keywords: ["fast clean", "fast wash", "deep clean", "cuci sepatu", "daily wash", "upper", "insole", "mesh", "canvas", "sneakers"],
      urls: [
        "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=800&q=80"
      ]
    },
    {
      cat: "snk_restore",
      label: "Unyellowing Midsole, Suede & Repaint",
      keywords: ["unyellowing", "uv", "midsole", "repaint", "restoration", "restorasi", "suede", "nubuck", "kulit", "leather", "reglue", "jahit"],
      urls: [
        "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=900&q=80"
      ]
    },
    {
      cat: "snk_protect",
      label: "Hydrophobic Nano Shield, Tas & Apparel",
      keywords: ["hydrophobic", "nano shield", "water repellent", "protection", "anti air", "tas", "bag", "backpack", "topi", "cap"],
      urls: [
        "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80"
      ]
    },
    {
      cat: "moto_detail",
      label: "Detailing Wash, Bongkar Bodi & Mesin Motor",
      keywords: ["detailing wash", "cuci detail", "dismantle", "bongkar bodi", "engine", "mesin", "cvt", "rangka", "velg", "asphalt", "tar"],
      urls: [
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?auto=format&fit=crop&w=900&q=80"
      ]
    },
    {
      cat: "moto_coat",
      label: "Paint Correction & Nano Ceramic 9H Motor",
      keywords: ["ceramic", "9h", "polish", "poles", "paint correction", "coating", "big bike", "moge", "250cc", "vespa", "harley", "sport"],
      urls: [
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=900&q=80"
      ]
    },
    {
      cat: "helmet",
      label: "Helmet Spa, Sterilisasi Ozon & Coating Visor",
      keywords: ["helm", "helmet", "visor", "arai", "shoei", "agv", "ozon", "busa", "riding gear"],
      urls: [
        "https://images.unsplash.com/photo-1558980664-3a031cf67ea8?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1575997759258-91792eaaf87b?auto=format&fit=crop&w=900&q=80"
      ]
    },
    {
      cat: "laundry",
      label: "Laundry Kiloan, Setrika Uap, Karpet & Sofa Care",
      keywords: ["laundry", "kiloan", "setrika", "steam", "karpet", "carpet", "sofa", "spring bed", "bed cover", "gordyn", "pakaian", "jas", "dry clean"],
      urls: [
        "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=800&q=80"
      ]
    },
    {
      cat: "barber",
      label: "Barbershop, Gentleman Haircut, Fade & Hot Towel",
      keywords: ["barber", "haircut", "cut", "fade", "taper", "potong rambut", "grooming", "beard", "shave", "kumis", "janggut", "pomade", "coloring", "perm", "smoothing"],
      urls: [
        "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80"
      ]
    },
    {
      cat: "studio",
      label: "Interior Studio Sneakers & Detailing Garage",
      keywords: ["studio", "workshop", "bay", "garasi", "rak", "interior", "hero"],
      urls: [
        "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&w=1200&q=80"
      ]
    }
  ];

  window.resolveWorkshopServiceImage = function (serviceName, category, niche, itemIndex = 0) {
    const hay = `${serviceName || ""} ${category || ""}`.toLowerCase();
    let bestEntry = null;
    let maxScore = 0;

    for (const entry of window.CURATED_WORKSHOP_BANK) {
      if (entry.cat === "studio") continue;
      let score = 0;
      for (const kw of entry.keywords) {
        if (hay.includes(kw)) score += kw.length * 2;
      }
      if (score > maxScore) {
        maxScore = score;
        bestEntry = entry;
      }
    }

    if (!bestEntry) {
      if (niche === "moto_detailing") {
        bestEntry = window.CURATED_WORKSHOP_BANK.find(e => e.cat === "moto_detail");
      } else if (niche === "laundry_care") {
        bestEntry = window.CURATED_WORKSHOP_BANK.find(e => e.cat === "laundry");
      } else if (niche === "barber_studio") {
        bestEntry = window.CURATED_WORKSHOP_BANK.find(e => e.cat === "barber");
      } else {
        bestEntry = window.CURATED_WORKSHOP_BANK[0];
      }
    }

    const urls = bestEntry.urls;
    return urls[itemIndex % urls.length];
  };

  window.resolveWorkshopHeroImage = function (niche) {
    if (niche === "moto_detailing") {
      return "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80";
    }
    if (niche === "laundry_care") {
      return "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=1200&q=80";
    }
    if (niche === "barber_studio") {
      return "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80";
    }
    return "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1200&q=80";
  };

  window.applyWorkshopTheme = function (themeKey, customBrandHex, uiTemplateKey) {
    const preset =
      window.WORKSHOP_THEME_PRESETS[themeKey] ||
      window.WORKSHOP_THEME_PRESETS.crimson;
    const root = document.documentElement;
    const isValidHex = val => typeof val === "string" && /^#[0-9a-fA-F]{3,8}$/.test(val.trim());
    const hexCandidate =
      (isValidHex(customBrandHex) && customBrandHex.trim()) ||
      (isValidHex(themeKey) && themeKey.trim()) ||
      null;
    const accent = hexCandidate || preset.accent;
    root.style.setProperty("--brand", accent);
    root.style.setProperty("--brand-hover", hexCandidate ? accent : preset.accentHover);
    root.style.setProperty("--brand-light", hexCandidate ? accent : (preset.accentLight || preset.accent));
    root.style.setProperty("--brand-soft", preset.accentSoft);
    root.style.setProperty("--brand-rgb", preset.rgbAccent);
    root.style.setProperty("--brand-fg", preset.fgOnAccent || "#FFFFFF");
    root.style.setProperty("--shell-tint", preset.shellTint);
    root.style.setProperty("--shell-dark", preset.shellDark);

    let resolvedTpl = uiTemplateKey && window.WORKSHOP_UI_TEMPLATES && window.WORKSHOP_UI_TEMPLATES[uiTemplateKey]
      ? uiTemplateKey
      : null;
    if (!resolvedTpl) {
      try {
        const urlTpl = new URLSearchParams(window.location.search).get("template");
        if (urlTpl && window.WORKSHOP_UI_TEMPLATES && window.WORKSHOP_UI_TEMPLATES[urlTpl]) {
          resolvedTpl = urlTpl;
        }
      } catch (e) {}
    }
    if (!resolvedTpl && window.ServiceStore && window.ServiceStore.getTenant && window.getActiveMitraSlug) {
      const activeTenantObj = window.ServiceStore.getTenant(window.getActiveMitraSlug());
      if (activeTenantObj && activeTenantObj.uiTemplate && window.WORKSHOP_UI_TEMPLATES && window.WORKSHOP_UI_TEMPLATES[activeTenantObj.uiTemplate]) {
        resolvedTpl = activeTenantObj.uiTemplate;
      }
    }
    if (window.applyWorkshopTemplate) {
      window.applyWorkshopTemplate(resolvedTpl || "tactile_bento");
    }
    return preset;
  };

  window.NICHE_DEFINITIONS = {
    sneakers_care: {
      label: "Sneakers & Apparel Care",
      shortLabel: "Sneaker Lab",
      unitName: "Pasang",
      itemPlaceholder: "Salomon XT-6 / Nike Jordan 1 Low",
      steps: [
        {
          step: 1,
          code: "DROP",
          period: "Tahap 01",
          label: "Inspeksi Awal",
          desc: "Cek karakter bahan upper, insole, dan dokumentasi kondisi awal.",
          defaultNote: "Unit diterima di studio. Pengecekan material upper & midsole selesai."
        },
        {
          step: 2,
          code: "WASH",
          period: "Tahap 02",
          label: "Deep Cleaning",
          desc: "Cuci detail luar-dalam dengan larutan pH-netral sesuai bahan.",
          defaultNote: "Proses deep cleaning dengan cairan pH-netral dan sikat bulu kuda."
        },
        {
          step: 3,
          code: "TREAT",
          period: "Tahap 03",
          label: "Detailing / UV",
          desc: "Unyellowing midsole di UV chamber, repaint, atau nano coating.",
          defaultNote: "Sedang proses treatment khusus (UV unyellowing / nano shield)."
        },
        {
          step: 4,
          code: "QC",
          period: "Tahap 04",
          label: "Sterilisasi & QC",
          desc: "Pengeringan suhu ruang, fogging ozon antibakteri, dan cek QC.",
          defaultNote: "Pengeringan selesai. Sedang sterilisasi ozon & pengecekan QC."
        },
        {
          step: 5,
          code: "READY",
          period: "Tahap 05",
          label: "Siap Serah Terima",
          desc: "Dikemas rapi dengan silica gel. Siap diambil atau dikirim kurir.",
          defaultNote: "Lolos QC 100%. Sepatu sudah dikemas & siap diambil/dikirim."
        }
      ],
      addons: [
        { id: "express", label: "Express 24 Jam", desc: "Prioritas pengerjaan tanpa antre", price: 40000 },
        { id: "protect", label: "Hydrophobic Coat", desc: "Lapisan anti-air & noda 3 bulan", price: 35000 }
      ],
      inspectionZones: [
        {
          code: "ZN-01",
          title: "Upper Material",
          part: "Suede / Nubuck / Mesh",
          tool: "Horsehair Brush",
          detail: "Pembersihan lembut tanpa merusak serat suede atau rajutan."
        },
        {
          code: "ZN-02",
          title: "Midsole Rim",
          part: "Rubber / Boost Foam",
          tool: "UV-A Chamber",
          detail: "Angkat oksidasi kuning kembali putih bersih."
        },
        {
          code: "ZN-03",
          title: "Insole Cavity",
          part: "Footbed / Ortholite",
          tool: "Ozone Sterilizer",
          detail: "Bongkar insole total untuk eliminasi bakteri & bau."
        },
        {
          code: "ZN-04",
          title: "Outsole Tread",
          part: "Gum / Vibram Sole",
          tool: "Degreaser Brush",
          detail: "Angkat kerikil dan noda aspal di sela tapak bawah."
        }
      ],
      faqs: [
        {
          q: "Apakah aman untuk bahan Suede, Nubuck, atau Canvas?",
          a: "Aman. Bahan sensitif menggunakan metode dry-foam dan sikat bulu kuda khusus tanpa direndam air."
        },
        {
          q: "Bagaimana cara kerja layanan jemput-antar (Pick-Up)?",
          a: "Isi form booking di web, kurir kami menjemput ke lokasi Anda dan mengirimkan Nomor Nota untuk cek progres live."
        },
        {
          q: "Apakah ada garansi jika kurang bersih?",
          a: "Tersedia Garansi Re-Clean 24 jam gratis apabila masih ada noda non-permanen yang terlewat saat QC."
        }
      ]
    },
    moto_detailing: {
      label: "Motodetailing & Coating",
      shortLabel: "Detailing Bay",
      unitName: "Unit Motor",
      itemPlaceholder: "Vespa Sprint 150 / Kawasaki ZX-25R",
      steps: [
        {
          step: 1,
          code: "CHECK",
          period: "Tahap 01",
          label: "Inspeksi Cat",
          desc: "Cek ketebalan pernis dan pemetaan baret halus di bawah lampu.",
          defaultNote: "Unit masuk bay. Pengecekan kondisi cat & kelistrikan selesai."
        },
        {
          step: 2,
          code: "DECON",
          period: "Tahap 02",
          label: "Bongkar & Decon",
          desc: "Bongkar bodi halus, degreasing sela mesin, rangka, dan velg.",
          defaultNote: "Bodi dilepas. Sedang proses degreasing blok mesin & velg."
        },
        {
          step: 3,
          code: "POLISH",
          period: "Tahap 03",
          label: "Paint Correction",
          desc: "Poles multi-tahap untuk mengeliminasi swirl mark & kusam.",
          defaultNote: "Proses paint correction 2-tahap untuk mengembalikan kilap cat."
        },
        {
          step: 4,
          code: "COAT",
          period: "Tahap 04",
          label: "Nano Ceramic 9H",
          desc: "Aplikasi layer keramik 9H dan pematangan lampu infrared.",
          defaultNote: "Layer Nano Ceramic 9H diaplikasikan & proses curing infrared."
        },
        {
          step: 5,
          code: "READY",
          period: "Tahap 05",
          label: "Final QC & Siap",
          desc: "Perakitan kembali bodi presisi, lolos QC, siap serah terima.",
          defaultNote: "Bodi terpasang presisi & lolos QC. Motor siap diambil/towing."
        }
      ],
      addons: [
        { id: "express", label: "Fast Track Double-Tech", desc: "Dikerjakan 2 teknisi paralel", price: 120000 },
        { id: "protect", label: "Helmet Care + Coating", desc: "Detailing interior helm & visor", price: 75000 }
      ],
      inspectionZones: [
        {
          code: "BAY-01",
          title: "Fairing & Clear Coat",
          part: "Gloss / Matte Paint",
          tool: "Dual-Action Polisher",
          detail: "Koreksi baret halus hingga 90% sebelum pelapisan keramik."
        },
        {
          code: "BAY-02",
          title: "Engine & Inner Frame",
          part: "Crankcase / Chassis",
          tool: "Bodi Dismantle",
          detail: "Bongkar panel bodi untuk bersihkan kerak oli di rangka dalam."
        },
        {
          code: "BAY-03",
          title: "Wheels & Caliper",
          part: "Rim / Brake Caliper",
          tool: "Iron & Tar Remover",
          detail: "Luruhkan debu kampas rem dan bintik aspal pada velg."
        },
        {
          code: "BAY-04",
          title: "Cockpit & Plastic Trim",
          part: "Speedometer / Trim",
          tool: "UV Trim Restorer",
          detail: "Kembalikan warna hitam pekat pada plastik kasar & panel."
        }
      ],
      faqs: [
        {
          q: "Apakah bongkar bodi aman untuk kelistrikan dan klip?",
          a: "Aman. Seluruh baut disimpan di wadah bernomor per panel dan soket kelistrikan ditutup kedap air."
        },
        {
          q: "Berapa lama daya tahan lapisan Nano Ceramic 9H?",
          a: "Bertahan 12–24 bulan dengan efek daun talas (hydrophobic) dan proteksi sinar UV."
        },
        {
          q: "Apakah tersedia layanan Towing jemput-antar?",
          a: "Tersedia. Pilih opsi Towing pada kalkulator booking dan tim kami akan menjadwalkan penjemputan."
        }
      ]
    },
    laundry_care: {
      label: "Laundry Express, Carpet & Home Care",
      shortLabel: "Laundry & Care",
      unitName: "Kg / Unit",
      itemPlaceholder: "Pakaian 5 Kg / Karpet Turki / Sofa L",
      steps: [
        {
          step: 1,
          code: "SORT",
          period: "Tahap 01",
          label: "Timbang & Sortir",
          desc: "Penimbangan berat/ukuran, sortir warna pakaian, dan cek noda berat.",
          defaultNote: "Cucian diterima & ditimbang. Sudah disortir berdasarkan warna dan serat kain."
        },
        {
          step: 2,
          code: "WASH",
          period: "Tahap 02",
          label: "Washing & Extraction",
          desc: "Pencucian antibakteri atau vakum ekstraksi mendalam untuk sofa/karpet.",
          defaultNote: "Sedang proses pencucian utama dengan deterjen cair ramah serat & disinfektan."
        },
        {
          step: 3,
          code: "DRY",
          period: "Tahap 03",
          label: "Hygienic Drying",
          desc: "Pengeringan mesin suhu terkontrol bebas bau apek.",
          defaultNote: "Proses pengeringan higienis di mesin tumbler dryer suhu terukur."
        },
        {
          step: 4,
          code: "STEAM",
          period: "Tahap 04",
          label: "Setrika Uap & Parfum",
          desc: "Setrika uap boiler bertekanan tinggi dan pelipatan rapi.",
          defaultNote: "Sedang proses setrika uap (steam press), pemberian parfum grade A & pengemasan."
        },
        {
          step: 5,
          code: "READY",
          period: "Tahap 05",
          label: "Siap Antar / Ambil",
          desc: "Sudah dikemas plastik kedap debu. Siap diambil atau diantar kurir.",
          defaultNote: "Selesai dikemas rapi & wangi. Siap diambil atau dikirim kurir ke alamat Anda."
        }
      ],
      addons: [
        { id: "express", label: "Kilat Express 6 Jam", desc: "Selesai di hari yang sama (prioritas mesin)", price: 25000 },
        { id: "protect", label: "Anti-Tungau & Disinfektan", desc: "Cairan khusus pembasmi tungau & bakteri", price: 20000 }
      ],
      inspectionZones: [
        {
          code: "LN-01",
          title: "Pakaian Harian & Kemeja",
          part: "Katun / Linen / Rayon",
          tool: "1 Mesin 1 Pelanggan",
          detail: "Pakaian tidak pernah dicampur dengan cucian pelanggan lain."
        },
        {
          code: "LN-02",
          title: "Karpet & Permadani",
          part: "Bulu Tebal / Wol / Sintetis",
          tool: "Rotary Carpet Polisher",
          detail: "Sikat mesin putar dan bilas bertekanan tinggi hingga ke dasar karpet."
        },
        {
          code: "LN-03",
          title: "Sofa & Spring Bed",
          part: "Busa / Kain Fabric / Kulit",
          tool: "Hydro-Vacuum Extractor",
          detail: "Sedot debu tungau, noda keringat, dan kotoran membandel (panggilan ke rumah)."
        },
        {
          code: "LN-04",
          title: "Bed Cover & Gordyn",
          part: "Serat Tebal / King Size",
          tool: "Boiler Steam Press",
          detail: "Pencucian kapasitas besar dan uap panas agar serat kembali mengembang."
        }
      ],
      faqs: [
        {
          q: "Apakah pakaian saya dicampur dengan pelanggan lain?",
          a: "Tidak pernah. Kami menerapkan standar 1 Mesin 1 Nota Pelanggan untuk menjaga kebersihan dan mencegah pakaian tertukar."
        },
        {
          q: "Apakah cuci sofa dan spring bed dikerjakan di rumah pelanggan?",
          a: "Ya, untuk sofa dan spring bed tim teknisi kami datang membawa peralatan Hydro-Vacuum ke rumah Anda. Untuk karpet dan pakaian bisa dijemput kurir."
        },
        {
          q: "Bagaimana cara menghitung estimasi biaya di website?",
          a: "Pilih jenis layanan (Kiloan, Satuan, Karpet, atau Sofa) dan masukkan jumlah Kg/Unit pada kalkulator booking di bawah."
        }
      ]
    },
    barber_studio: {
      label: "Premier Barbershop & Men's Grooming",
      shortLabel: "Barber Studio",
      unitName: "Orang",
      itemPlaceholder: "Comma Hair / Taper Fade + Beard Trim (Capster: Rian)",
      steps: [
        {
          step: 1,
          code: "BOOK",
          period: "Tahap 01",
          label: "Jadwal Terkonfirmasi",
          desc: "Slot jam potong dan pilihan capster sudah dikunci di jadwal studio.",
          defaultNote: "Slot jadwal potong Anda sudah tercatat. Silakan datang 10 menit sebelum jam booking."
        },
        {
          step: 2,
          code: "LOUNGE",
          period: "Tahap 02",
          label: "Check-In & Konsultasi",
          desc: "Pelanggan tiba di studio, analisis bentuk wajah & arah tumbuh rambut.",
          defaultNote: "Pelanggan sudah check-in di kursi. Konsultasi gaya potongan dengan capster."
        },
        {
          step: 3,
          code: "CUT",
          period: "Tahap 03",
          label: "Precision Haircut",
          desc: "Eksekusi gunting, clipper fade presisi, dan perapihan janggut/kumis.",
          defaultNote: "Sedang proses potong rambut presisi (fade & texturizing) oleh capster."
        },
        {
          step: 4,
          code: "WASH",
          period: "Tahap 04",
          label: "Hair Wash & Hot Towel",
          desc: "Keramas bersih, handuk hangat relaksasi, dan pijat kepala-bahu.",
          defaultNote: "Proses keramas menyegarkan, kompres handuk hangat (hot towel) & pijat relaksasi."
        },
        {
          step: 5,
          code: "STYLE",
          period: "Tahap 05",
          label: "Pomade Styling & Selesai",
          desc: "Aplikasi hair tonic, blow-dry, styling pomade/powder, dan siap tampil.",
          defaultNote: "Sesi grooming selesai. Rambut sudah di-styling rapi."
        }
      ],
      addons: [
        { id: "express", label: "VIP Priority Slot (Tanpa Antre)", desc: "Kunci jam pasti tanpa tunggu walk-in", price: 15000 },
        { id: "protect", label: "Black Mask & Face Scrub", desc: "Angkat komedo & perawatan wajah pria", price: 35000 }
      ],
      inspectionZones: [
        {
          code: "BR-01",
          title: "Fade & Taper Precision",
          part: "Side & Back Gradation",
          tool: "Zero-Gap Clipper",
          detail: "Gradasi tipis bertahap yang bersih dan menyatu alami dengan bentuk kepala."
        },
        {
          code: "BR-02",
          title: "Top Texture & Volume",
          part: "Crown & Fringe",
          tool: "Japanese Thinning Scissors",
          detail: "Penyesuaian volume rambut atas agar mudah diatur setiap hari."
        },
        {
          code: "BR-03",
          title: "Beard & Mustache Sculpting",
          part: "Jawline & Facial Hair",
          tool: "Straight Razor & Hot Towel",
          detail: "Cukur garis rahang dengan handuk hangat dan pisau cukur steril sekali pakai."
        },
        {
          code: "BR-04",
          title: "Scalp & Hair Care",
          part: "Kulit Kepala & Akar Rambut",
          tool: "Cooling Tonic & Shiatsu",
          detail: "Keramas bersih dari sisa potongan rambut disertai pijat relaksasi leher."
        }
      ],
      faqs: [
        {
          q: "Bagaimana cara booking jam potong agar tidak mengantre lama?",
          a: "Pilih paket grooming di kalkulator bawah, tulis jam kedatangan dan nama capster pilihan Anda, lalu klik tombol Terbitkan Nota & Kirim WA."
        },
        {
          q: "Apakah semua paket sudah termasuk keramas dan pomade?",
          a: "Untuk paket Gentleman Cut ke atas sudah lengkap termasuk Hair Wash, Hot Towel, pijat bahu, dan styling pomade/clay."
        },
        {
          q: "Apakah alat cukur dijamin steril?",
          a: "Seluruh clipper disemprot disinfektan setiap selesai 1 pelanggan, dan silet cukur (razor blade) selalu diganti baru."
        }
      ]
    }
  };

  const CORE_FLAGSHIP_SLUGS = [
    "kultur-kicks",
    "apex-motoworks",
    "lume-laundry",
    "monarch-barber"
  ];

  function isCrossContaminated(slug, itemText, orderId) {
    const txt = String(itemText || "").toLowerCase();
    const ord = String(orderId || "").trim().toUpperCase();
    if (slug === "kultur-kicks") {
      if (/karpet|sofa|spring bed|kiloan|setrika|motor|vespa|haircut|barber|capster/.test(txt)) return true;
      if (ord && !/^(KLK|KUL)-/.test(ord)) return true;
    } else if (slug === "apex-motoworks") {
      if (/karpet|sofa|spring bed|kiloan|sepatu|sneaker|unyellowing|haircut|barber/.test(txt)) return true;
      if (ord && !/^(APX|APE)-/.test(ord)) return true;
    } else if (slug === "lume-laundry") {
      if (/sepatu|sneaker|unyellowing|vespa|ceramic|haircut|barber|capster/.test(txt)) return true;
      if (ord && !/^LUM-/.test(ord)) return true;
    } else if (slug === "monarch-barber") {
      if (/karpet|sofa|spring bed|kiloan|sepatu|sneaker|unyellowing|vespa|ceramic/.test(txt)) return true;
      if (ord && !/^(MNR|MON)-/.test(ord)) return true;
    }
    return false;
  }
  window.isCrossContaminated = isCrossContaminated;

  function isTenantDataCorrupted(slug, services, orders) {
    if (!CORE_FLAGSHIP_SLUGS.includes(slug)) return false;
    if (!Array.isArray(services) || services.length === 0) return true;
    if (!Array.isArray(orders) || orders.length === 0) return true;

    const badSvc = services.some(
      s => !s || !s.name || isCrossContaminated(slug, `${s.name} ${s.category || ""}`, "")
    );
    const badOrd = orders.some(
      o => !o || !o.orderId || isCrossContaminated(slug, `${o.itemName || ""} ${o.serviceName || ""}`, o.orderId)
    );
    return badSvc || badOrd;
  }

  window.escapeHtml = function (val) {
    return String(val == null ? "" : val)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  };

  window.sanitizeUrl = function (rawUrl, fallbackUrl) {
    const fb = typeof fallbackUrl === "string" ? fallbackUrl : "";
    if (typeof rawUrl !== "string") return fb;
    const trimmed = rawUrl.trim();
    if (!trimmed) return fb;
    if (/[\u0000-\u001F\u007F]/.test(trimmed)) return fb;

    const head = trimmed.split(/[/?#]/)[0];
    let decodedHead = head;
    try {
      decodedHead = decodeURIComponent(head);
    } catch (e) {}

    if (/^data:/i.test(trimmed) || /^data:/i.test(decodedHead)) {
      if (/^data:image\/(png|jpeg|jpg|webp|gif|avif)(?:;[a-z0-9=._+-]+)*(?:;base64)?,[a-z0-9+/=]+$/i.test(trimmed)) {
        return trimmed;
      }
      return fb;
    }

    if (/^(https?|blob):/i.test(trimmed)) {
      try {
        const parsed = new URL(trimmed, "https://localhost");
        if (parsed.protocol === "http:" || parsed.protocol === "https:" || parsed.protocol === "blob:") {
          return trimmed;
        }
      } catch (e) {
        return fb;
      }
      return fb;
    }

    if (/^(?:\/\/|\/\\|\\\/|\\)/.test(trimmed)) return fb;
    if (head.includes(":") || decodedHead.includes(":")) return fb;
    if (/^(?:\/(?!\/)|\.\/|\.\.\/|\?|#|[a-zA-Z0-9_-])/.test(trimmed)) {
      return trimmed;
    }
    return fb;
  };

  window.stripDangerousTags = function (val) {
    if (typeof val !== "string") return val;
    return val
      .replace(/<\s*(script|iframe|object|embed|svg|style|link|meta)\b[^>]*>[\s\S]*?<\/\s*\1\s*>/gi, "")
      .replace(/<\s*\/?\s*[a-z!/?][^>]*>/gi, "")
      .replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
      .replace(/javascript\s*:/gi, "")
      .replace(/[<>]/g, "")
      .trim();
  };

  function cleanServicePayload(s) {
    if (!s || typeof s !== "object") return s;
    return {
      ...s,
      name: window.stripDangerousTags(s.name),
      category: window.stripDangerousTags(s.category),
      duration: window.stripDangerousTags(s.duration),
      badge: window.stripDangerousTags(s.badge),
      desc: window.stripDangerousTags(s.desc),
      imageUrl: typeof s.imageUrl === "string" ? window.sanitizeUrl(s.imageUrl) : s.imageUrl
    };
  }

  function generateTrackingToken128() {
    try {
      if (typeof window !== "undefined" && window.crypto && typeof window.crypto.getRandomValues === "function") {
        const bytes = new Uint8Array(16);
        window.crypto.getRandomValues(bytes);
        return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
      }
    } catch (e) {}
    let out = "";
    for (let i = 0; i < 4; i++) {
      out += Math.floor((Math.random() * 0x100000000) >>> 0).toString(16).padStart(8, "0").toUpperCase();
    }
    return out;
  }
  window.generateTrackingToken128 = generateTrackingToken128;

  function generateOrderShortHex32() {
    try {
      if (typeof window !== "undefined" && window.crypto && typeof window.crypto.getRandomValues === "function") {
        const bytes = new Uint8Array(4);
        window.crypto.getRandomValues(bytes);
        return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
      }
    } catch (e) {}
    return Math.floor((Math.random() * 0x100000000) >>> 0).toString(16).padStart(8, "0").toUpperCase();
  }

  function cleanOrderPayload(o) {
    if (!o || typeof o !== "object") return o;
    const rawToken = typeof o.trackingToken === "string"
      ? o.trackingToken
      : (typeof o.tracking_token === "string" ? o.tracking_token : "");
    const cleanToken = String(rawToken || "").toUpperCase().replace(/[^A-F0-9]/g, "");
    const rawPublicNote = typeof o.publicNote === "string"
      ? o.publicNote
      : (typeof o.public_note === "string" ? o.public_note : "");
    const cleaned = {
      ...o,
      orderId: window.stripDangerousTags(o.orderId),
      trackingToken: cleanToken,
      customerName: window.stripDangerousTags(o.customerName),
      phone: window.stripDangerousTags(o.phone),
      itemName: window.stripDangerousTags(o.itemName),
      serviceName: window.stripDangerousTags(o.serviceName),
      deliveryType: window.stripDangerousTags(o.deliveryType),
      etaDate: window.stripDangerousTags(o.etaDate),
      publicNote: window.stripDangerousTags(rawPublicNote),
      techNote: window.stripDangerousTags(o.techNote || "")
    };
    if (typeof o.statusLabel === "string") {
      cleaned.statusLabel = window.stripDangerousTags(o.statusLabel);
    }
    return cleaned;
  }

  function cleanTenantPayload(t) {
    if (!t || typeof t !== "object") return t;
    const copy = { ...t };
    const textKeys = [
      "name",
      "branch",
      "whatsapp",
      "instagram",
      "address",
      "hours",
      "heroHeadline1",
      "heroHeadline2",
      "heroDesc",
      "pickupPolicy",
      "ratingScore"
    ];
    textKeys.forEach(k => {
      if (typeof copy[k] === "string") {
        copy[k] = window.stripDangerousTags(copy[k]);
      }
    });
    if (typeof copy.logoUrl === "string") {
      copy.logoUrl = window.sanitizeUrl(copy.logoUrl);
    }
    if (typeof copy.heroImageUrl === "string") {
      copy.heroImageUrl = window.sanitizeUrl(copy.heroImageUrl);
    }
    if (typeof copy.brandColor === "string") {
      const c = copy.brandColor.trim();
      copy.brandColor = /^#[0-9a-fA-F]{3,8}$/.test(c) ? c : "";
    }
    if (copy.serviceImagesMap && typeof copy.serviceImagesMap === "object") {
      const cleanImgMap = {};
      Object.keys(copy.serviceImagesMap).forEach(k => {
        const cleanVal = window.sanitizeUrl(copy.serviceImagesMap[k]);
        if (cleanVal) cleanImgMap[window.stripDangerousTags(k)] = cleanVal;
      });
      copy.serviceImagesMap = cleanImgMap;
    }
    if (Array.isArray(copy.services)) {
      copy.services = copy.services.map(cleanServicePayload);
    }
    if (Array.isArray(copy.orders)) {
      copy.orders = copy.orders.map(cleanOrderPayload);
    }
    return copy;
  }

  window.canWriteToCloud = function (targetSlug) {
    if (window.__wsIsAuthenticated !== true) return false;
    if (window.__wsCurrentRole === "super_admin") return true;
    if (window.__wsCurrentRole === "owner") {
      if (!targetSlug) return Boolean(window.__wsCurrentTenantSlug);
      const cleanTarget = String(targetSlug || "").toLowerCase().trim();
      const mySlug = String(window.__wsCurrentTenantSlug || "").toLowerCase().trim();
      return Boolean(cleanTarget && mySlug && cleanTarget === mySlug);
    }
    return false;
  };

  const INITIAL_SEED_TENANTS = {
    "kultur-kicks": {
      slug: "kultur-kicks",
      name: "KULTUR KICKS LAB",
      branch: "Margonda, Depok",
      niche: "sneakers_care",
      serviceMode: "pickup_delivery",
      themePreset: "crimson",
      uiTemplate: "tactile_bento",
      whatsapp: "6281299887766",
      instagram: "@kulturkicks.depok",
      address: "Jl. Margonda Raya No. 412, Depok",
      hours: "Setiap Hari · 10.00 – 21.00 WIB",
      heroHeadline1: "Restorasi Presisi untuk",
      heroHeadline2: "Koleksi Sepatu Harian.",
      heroDesc: "Studio perawatan sepatu berstandar laboratorium. Lacak tahapan pengerjaan barang Anda secara langsung tanpa perlu menunggu balasan admin.",
      pickupPolicy: "Gratis jemput-antar radius 5 km area Depok (min. 2 pasang).",
      ratingScore: "4.9",
      services: [
        { id: "srv-1", name: "Fast Clean (Upper & Midsole)", category: "Daily Wash", price: 45000, promoPrice: null, isPromo: false, duration: "24 Jam", badge: "Kilat 24 Jam", available: true, desc: "Cuci cepat bagian luar upper dan midsole untuk pemakaian harian." },
        { id: "srv-2", name: "Deep Clean All Material", category: "Signature Treatment", price: 75000, promoPrice: 65000, isPromo: true, duration: "2–3 Hari", badge: "Terlaris", available: true, desc: "Pembersihan menyeluruh luar-dalam aman untuk Suede, Nubuck, Mesh, dan Leather." },
        { id: "srv-3", name: "Unyellowing + Deep Clean", category: "Restoration", price: 125000, promoPrice: null, isPromo: false, duration: "3–4 Hari", badge: "UV Chamber", available: true, desc: "Angkat oksidasi kuning pada midsole karet kembali putih bersih + cuci total." },
        { id: "srv-4", name: "Hydrophobic Nano Shield", category: "Protection", price: 95000, promoPrice: null, isPromo: false, duration: "2 Hari", badge: "Anti Air", available: true, desc: "Pelapisan pelindung cairan, lumpur, dan noda kopi tahan hingga 3 bulan." },
        { id: "srv-5", name: "Full Suede / Canvas Repaint", category: "Restoration", price: 190000, promoPrice: null, isPromo: false, duration: "5–7 Hari", badge: "Restorasi", available: true, desc: "Restorasi pigmen warna pudar menggunakan tinta khusus yang lembut di bahan." }
      ],
      orders: [
        { id: "ord-1", orderId: "KLK-2601", trackingToken: "A1F0260199B44C82D1E37701C8A52601", customerName: "Raka Pratama", phone: "081288990011", itemName: "Salomon XT-6 White Lunar", serviceName: "Deep Clean + Coating", price: 160000, stepIndex: 3, deliveryType: "Pick-Up Kurir", etaDate: "Besok · 18:00 WIB", publicNote: "Mesh sudah bersih 100%. Sedang proses curing lapisan water repellent.", techNote: "Mesh sudah bersih 100%. Sedang proses curing lapisan water repellent.", createdAt: "2026-11-02T09:30:00Z" },
        { id: "ord-2", orderId: "KLK-2602", trackingToken: "A1F0260299B44C82D1E37702C8A52602", customerName: "Nadia Vega", phone: "085711223344", itemName: "New Balance 550 White Grey", serviceName: "Unyellowing + Deep Clean", price: 125000, stepIndex: 5, deliveryType: "Drop-Off Studio", etaDate: "Siap Diambil", publicNote: "Oksidasi midsole hilang sempurna. Sudah sterilisasi ozon & siap diambil.", techNote: "Oksidasi midsole hilang sempurna. Sudah sterilisasi ozon & siap diambil.", createdAt: "2026-11-01T14:15:00Z" },
        { id: "ord-3", orderId: "KLK-2603", trackingToken: "A1F0260399B44C82D1E37703C8A52603", customerName: "Dimas Anggara", phone: "081366778899", itemName: "Jordan 1 Low Olive Suede", serviceName: "Deep Clean All Material", price: 65000, stepIndex: 2, deliveryType: "Pick-Up Kurir", etaDate: "05 Nov · 16:00 WIB", publicNote: "Pembersihan suede dengan dry-foam pH netral & sikat bulu kuda.", techNote: "Pembersihan suede dengan dry-foam pH netral & sikat bulu kuda.", createdAt: "2026-11-03T07:45:00Z" }
      ]
    },
    "apex-motoworks": {
      slug: "apex-motoworks",
      name: "APEX MOTODETAILING",
      branch: "Cinere, Depok",
      niche: "moto_detailing",
      serviceMode: "studio_slot",
      themePreset: "amber",
      uiTemplate: "tactile_bento",
      whatsapp: "6281377889900",
      instagram: "@apexmotoworks.id",
      address: "Jl. Cinere Raya No. 88, Depok",
      hours: "Selasa – Minggu · 09.00 – 20.00 WIB",
      heroHeadline1: "Koreksi Cat & Proteksi",
      heroHeadline2: "Nano Ceramic Kelas Kontes.",
      heroDesc: "Workshop detailing motor & helm dengan pembongkaran bodi presisi. Pantau tahapan pengerjaan motor Anda langsung dari layar HP.",
      pickupPolicy: "Tersedia layanan Towing jemput-antar area Depok & Jaksel.",
      ratingScore: "4.9",
      services: [
        { id: "mtr-1", name: "Signature Detailing Wash", category: "Detailing Wash", price: 125000, promoPrice: null, isPromo: false, duration: "3–4 Jam", badge: "Cuci Detail", available: true, desc: "Cuci detail sela mesin, luruhkan aspal & kerak velg, plus carnauba wax." },
        { id: "mtr-2", name: "Full Body Dismantle Detailing", category: "Deep Detailing", price: 350000, promoPrice: 299000, isPromo: true, duration: "1 Hari", badge: "Bongkar Bodi", available: true, desc: "Bongkar seluruh bodi halus, degreasing rangka dalam, CVT, dan poles 1-step." },
        { id: "mtr-3", name: "2-Stage Polish + Ceramic 9H", category: "Nano Ceramic", price: 650000, promoPrice: null, isPromo: false, duration: "2 Hari", badge: "Garansi 1 Thn", available: true, desc: "Koreksi baret halus 90%, bongkar bodi total, dan aplikasi 2 layer Ceramic 9H." },
        { id: "mtr-4", name: "Big Bike 250cc+ Ceramic Pro", category: "Nano Ceramic", price: 1100000, promoPrice: null, isPromo: false, duration: "2–3 Hari", badge: "2 Layer 9H+", available: true, desc: "Paket lengkap 250cc ke atas termasuk coating bodi, velg, knalpot, dan visor." }
      ],
      orders: [
        { id: "ord-101", orderId: "APX-8801", trackingToken: "B2E0880199B44C82D1E37704C8A58801", customerName: "Bima Sakti", phone: "081233445566", itemName: "Vespa Sprint 150 I-Get Grey", serviceName: "2-Stage Polish + Ceramic 9H", price: 650000, stepIndex: 4, deliveryType: "Drop-Off Bengkel", etaDate: "Hari Ini · 17:00 WIB", publicNote: "Layer ke-2 Nano Ceramic selesai diaplikasikan. Sedang curing infrared.", techNote: "Layer ke-2 Nano Ceramic selesai diaplikasikan. Sedang curing infrared.", createdAt: "2026-11-02T10:00:00Z" },
        { id: "ord-102", orderId: "APX-8802", trackingToken: "B2E0880299B44C82D1E37705C8A58802", customerName: "Hendri Wijaya", phone: "081899001122", itemName: "Kawasaki ZX-25R Black", serviceName: "Big Bike Ceramic Pro", price: 1100000, stepIndex: 2, deliveryType: "Towing Pick-Up", etaDate: "Besok · 17:00 WIB", publicNote: "Fairing dilepas. Sedang dekontaminasi kerak blok mesin dan rantai.", techNote: "Fairing dilepas. Sedang dekontaminasi kerak blok mesin dan rantai.", createdAt: "2026-11-03T08:10:00Z" }
      ]
    },
    "lume-laundry": {
      slug: "lume-laundry",
      name: "LUME FABRIC & HOME CARE",
      branch: "Kemang, Jakarta Selatan",
      niche: "laundry_care",
      serviceMode: "pickup_delivery",
      themePreset: "emerald",
      uiTemplate: "swiss_minimal",
      whatsapp: "6281288776655",
      instagram: "@lumefabric.care",
      address: "Jl. Kemang Raya No. 18, Jakarta Selatan",
      hours: "Setiap Hari · 07.00 – 21.00 WIB",
      heroHeadline1: "Higienis 1 Mesin 1 Pelanggan",
      heroHeadline2: "untuk Pakaian, Karpet & Sofa.",
      heroDesc: "Studio perawatan tekstil modern, setrika uap boiler, serta pencucian karpet & sofa panggilan ke rumah. Pantau progres cucian Anda langsung dari layar HP.",
      pickupPolicy: "Gratis jemput-antar kurir & kunjungan Home Service sofa area Jaksel.",
      ratingScore: "4.9",
      services: [
        { id: "lum-1", name: "Cuci Komplit + Setrika Uap (5 Kg)", category: "Laundry Harian", price: 45000, promoPrice: 40000, isPromo: true, duration: "24 Jam", badge: "1 Mesin 1 Nota", available: true, desc: "Paket cuci bersih 1 mesin 1 pelanggan, kering higienis, setrika uap boiler & parfum grade A." },
        { id: "lum-2", name: "Bed Cover King / Queen Size", category: "Bedding Care", price: 55000, promoPrice: null, isPromo: false, duration: "1–2 Hari", badge: "Anti Tungau", available: true, desc: "Pencucian mesin kapasitas besar dengan cairan anti-tungau & pengeringan suhu terukur." },
        { id: "lum-3", name: "Deep Wash Karpet Permadani", category: "Carpet Care", price: 95000, promoPrice: null, isPromo: false, duration: "2–3 Hari", badge: "Rotary Polisher", available: true, desc: "Sikat mesin putar & bilas ekstraksi bertekanan tinggi hingga ke dasar serat karpet." },
        { id: "lum-4", name: "Hydro-Vacuum Cuci Sofa (3 Dudukan)", category: "Home Service", price: 210000, promoPrice: 185000, isPromo: true, duration: "3–4 Jam (Panggilan)", badge: "Panggil ke Rumah", available: true, desc: "Teknisi datang ke rumah menyedot tungau, noda keringat, dan disinfeksi sofa." }
      ],
      orders: [
        { id: "ord-301", orderId: "LUM-2601", trackingToken: "C3D0260199B44C82D1E37706C8A52601", customerName: "Ibu Ratna Sari", phone: "081211223344", itemName: "Pakaian Harian 7 Kg + 1 Bed Cover", serviceName: "Cuci Komplit + Setrika Uap (5 Kg)", price: 95000, stepIndex: 3, deliveryType: "Jemput Kurir / Home Service Sofa", etaDate: "Sore Ini · 17:30 WIB", publicNote: "Proses pengeringan higienis di mesin tumbler dryer suhu terkontrol.", techNote: "Proses pengeringan higienis di mesin tumbler dryer suhu terkontrol.", createdAt: "2026-11-03T04:15:00Z" },
        { id: "ord-302", orderId: "LUM-2602", trackingToken: "C3D0260299B44C82D1E37707C8A52602", customerName: "Hendra Kusuma", phone: "081355667788", itemName: "Karpet Turki Ruang Tamu 2x3m", serviceName: "Deep Wash Karpet Permadani", price: 95000, stepIndex: 2, deliveryType: "Jemput Kurir / Home Service Sofa", etaDate: "Besok · 16:00 WIB", publicNote: "Sedang pencucian ekstraksi dengan mesin rotary carpet polisher.", techNote: "Sedang pencucian ekstraksi dengan mesin rotary carpet polisher.", createdAt: "2026-11-03T07:00:00Z" },
        { id: "ord-303", orderId: "LUM-2603", trackingToken: "C3D0260399B44C82D1E37708C8A52603", customerName: "Clarissa Putri", phone: "085799887766", itemName: "Pakaian Kerja & Kemeja 5 Kg", serviceName: "Cuci Komplit + Setrika Uap (5 Kg)", price: 40000, stepIndex: 5, deliveryType: "Antar Sendiri ke Outlet", etaDate: "Siap Diambil", publicNote: "Sudah disetrika uap, diberi parfum grade A & dikemas kedap debu.", techNote: "Sudah disetrika uap, diberi parfum grade A & dikemas kedap debu.", createdAt: "2026-11-02T09:00:00Z" }
      ]
    },
    "monarch-barber": {
      slug: "monarch-barber",
      name: "MONARCH GROOMING CLUB",
      branch: "Senopati, Jakarta Selatan",
      niche: "barber_studio",
      serviceMode: "studio_slot",
      themePreset: "cobalt",
      uiTemplate: "atelier_magazine",
      whatsapp: "6281266554433",
      instagram: "@monarchgrooming.id",
      address: "Jl. Suryo No. 42, Senopati, Jakarta Selatan",
      hours: "Setiap Hari · 10.00 – 21.30 WIB",
      heroHeadline1: "Potongan Presisi & Grooming",
      heroHeadline2: "Tanpa Antre di Kursi Studio.",
      heroDesc: "Premier barbershop & men's grooming club. Kunci jam kedatangan serta capster pilihan Anda dan lacak tiket reservasi kursi langsung dari HP.",
      pickupPolicy: "Datang 10 menit sebelum jadwal booking untuk langsung naik kursi capster.",
      ratingScore: "5.0",
      services: [
        { id: "mnr-1", name: "Gentlemen Signature Cut & Wash", category: "Haircut & Styling", price: 65000, promoPrice: null, isPromo: false, duration: "45 Menit", badge: "All-In Grooming", available: true, desc: "Potong rambut presisi, keramas hair tonic dingin, hot towel, pijat bahu & styling pomade." },
        { id: "mnr-2", name: "Executive Cut + Beard Sculpting", category: "Complete Package", price: 95000, promoPrice: 85000, isPromo: true, duration: "60 Menit", badge: "Terlaris", available: true, desc: "Paket Gentlemen Cut lengkap ditambah cukur rapi kumis/janggut dengan handuk hangat." },
        { id: "mnr-3", name: "Korean Down Perm + Two Block Cut", category: "Chemical & Texture", price: 185000, promoPrice: null, isPromo: false, duration: "90 Menit", badge: "Korean Style", available: true, desc: "Rapikan rambut samping yang mengembang agar jatuh rapi alami + potongan Two Block." },
        { id: "mnr-4", name: "Royal Black Mask & Scalp Spa", category: "Men's Spa", price: 75000, promoPrice: null, isPromo: false, duration: "40 Menit", badge: "Relaxing", available: true, desc: "Perawatan angkat komedo wajah, scrub kopi, dan creambath detoks kulit kepala." }
      ],
      orders: [
        { id: "ord-501", orderId: "MNR-2601", trackingToken: "D4C0260199B44C82D1E37709C8A52601", customerName: "Bagas Kara", phone: "081244556688", itemName: "Taper Fade + Beard Trim (Capster: Rian)", serviceName: "Executive Cut + Beard Sculpting", price: 85000, stepIndex: 1, deliveryType: "Sesi Malam (17.00 - 21.00)", etaDate: "Hari Ini · 19:00 WIB", publicNote: "Slot Kursi #2 bersama Capster Rian jam 19.00 WIB sudah terkonfirmasi.", techNote: "Slot Kursi #2 bersama Capster Rian jam 19.00 WIB sudah terkonfirmasi.", createdAt: "2026-11-03T07:20:00Z" },
        { id: "ord-502", orderId: "MNR-2602", trackingToken: "D4C0260299B44C82D1E37710C8A52602", customerName: "Dion Wiyoko", phone: "081388776655", itemName: "Korean Two Block + Down Perm (Capster: Edo)", serviceName: "Korean Down Perm + Two Block Cut", price: 185000, stepIndex: 3, deliveryType: "Sesi Siang / Sore (10.00 - 17.00)", etaDate: "Hari Ini · 15:00 WIB", publicNote: "Pelanggan sedang di kursi studio — proses aplikasi obat Down Perm & texturizing.", techNote: "Pelanggan sedang di kursi studio — proses aplikasi obat Down Perm & texturizing.", createdAt: "2026-11-03T07:50:00Z" },
        { id: "ord-503", orderId: "MNR-2603", trackingToken: "D4C0260399B44C82D1E37711C8A52603", customerName: "Arya Saloka", phone: "085733221100", itemName: "Comma Hair Classic (Capster: Rian)", serviceName: "Gentlemen Signature Cut & Wash", price: 65000, stepIndex: 5, deliveryType: "Sesi Siang / Sore (10.00 - 17.00)", etaDate: "Selesai", publicNote: "Sesi grooming selesai. Rambut sudah di-styling clay matte finish.", techNote: "Sesi grooming selesai. Rambut sudah di-styling clay matte finish.", createdAt: "2026-11-02T16:10:00Z" }
      ]
    }
  };

  const RECENT_PUBLIC_ORDERS_SUFFIX = "recent_public_orders";

  window.isSameOriginMessage = function (eventObj) {
    if (!eventObj) return false;
    const winOrigin = window.location && window.location.origin;
    if (!winOrigin || winOrigin === "null") {
      return eventObj.origin === "null" || eventObj.source === window.parent || eventObj.source === window.top;
    }
    return eventObj.origin === winOrigin;
  };

  window.isSupabaseConfigured = function () {
    const cfg = window.SERVICE_ENGINE_CONFIG || {};
    const env = window.__ENV__ || {};
    const url = String(env.PUBLIC_SUPABASE_URL || cfg.SUPABASE_URL || "").trim();
    const key = String(env.PUBLIC_SUPABASE_ANON_KEY || cfg.SUPABASE_ANON_KEY || "").trim();
    if (!url || !key) return false;
    if (url.includes("MASUKKAN_PROJECT_URL") || key.includes("MASUKKAN_ANON_KEY")) return false;
    if (!/^https?:\/\//i.test(url)) return false;
    if (key.length <= 20) return false;
    return true;
  };

  window.getSupabaseClient = function () {
    if (cachedClient) return cachedClient;
    if (!window.isSupabaseConfigured()) return null;
    if (typeof window.supabase === "undefined" || !window.supabase.createClient) return null;
    const cfg = window.SERVICE_ENGINE_CONFIG || {};
    const env = window.__ENV__ || {};
    const url = String(env.PUBLIC_SUPABASE_URL || cfg.SUPABASE_URL || "").trim();
    const key = String(env.PUBLIC_SUPABASE_ANON_KEY || cfg.SUPABASE_ANON_KEY || "").trim();
    cachedClient = window.supabase.createClient(url, key);
    return cachedClient;
  };

  function getRecentOrdersStorageKey() {
    const prefix = (window.SERVICE_ENGINE_CONFIG && window.SERVICE_ENGINE_CONFIG.STORAGE_KEY_PREFIX) || "atelier_service_engine_v4_";
    return prefix + RECENT_PUBLIC_ORDERS_SUFFIX;
  }

  function readRecentOrdersMapFrom(storageObj) {
    try {
      if (!storageObj) return {};
      const raw = storageObj.getItem(getRecentOrdersStorageKey());
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  function saveRecentPublicOrder(slug, orderObj) {
    const cleanSlug = String(slug || "").toLowerCase().trim().replace(/[^a-z0-9-]/g, "");
    if (!cleanSlug || !orderObj || !orderObj.orderId) return null;
    const safeOrder = cleanOrderPayload({
      ...orderObj,
      orderId: String(orderObj.orderId).trim(),
      trackingToken: orderObj.trackingToken || orderObj.tracking_token || "",
      publicNote: orderObj.publicNote || orderObj.public_note || "",
      price: Math.max(0, Number(orderObj.price) || 0),
      stepIndex: Math.min(Math.max(Number(orderObj.stepIndex) || 1, 1), 5),
      paid: Boolean(orderObj.paid)
    });
    const upperCode = safeOrder.orderId.toUpperCase();
    const key = getRecentOrdersStorageKey();

    [localStorage, typeof sessionStorage !== "undefined" ? sessionStorage : null].forEach(store => {
      if (!store) return;
      try {
        const map = readRecentOrdersMapFrom(store);
        const list = Array.isArray(map[cleanSlug]) ? map[cleanSlug] : [];
        const filtered = list.filter(o => o && String(o.orderId || "").trim().toUpperCase() !== upperCode);
        filtered.unshift(safeOrder);
        map[cleanSlug] = filtered.slice(0, 25);
        store.setItem(key, JSON.stringify(map));
      } catch (e) {}
    });
    return safeOrder;
  }

  function getRecentPublicOrders(slug) {
    const cleanSlug = String(slug || "").toLowerCase().trim().replace(/[^a-z0-9-]/g, "");
    if (!cleanSlug) return [];
    const sessMap = readRecentOrdersMapFrom(typeof sessionStorage !== "undefined" ? sessionStorage : null);
    const localMap = readRecentOrdersMapFrom(typeof localStorage !== "undefined" ? localStorage : null);
    const merged = [];
    const seen = new Set();

    [...(Array.isArray(sessMap[cleanSlug]) ? sessMap[cleanSlug] : []), ...(Array.isArray(localMap[cleanSlug]) ? localMap[cleanSlug] : [])].forEach(o => {
      if (!o || !o.orderId) return;
      const codeKey = String(o.orderId).trim().toUpperCase();
      if (!codeKey || seen.has(codeKey)) return;
      seen.add(codeKey);
      merged.push(cleanOrderPayload(o));
    });
    return merged;
  }

  function normalizeOrderFromDb(o) {
    if (!o || typeof o !== "object") return null;
    const hasTechNote = o.tech_note !== undefined || o.techNote !== undefined;
    const rawPublicNote = o.public_note != null
      ? o.public_note
      : (o.publicNote != null ? o.publicNote : "");
    return cleanOrderPayload({
      id: o.id || "ord-cloud",
      tenantSlug: o.tenant_slug || o.tenantSlug || "",
      orderId: String(o.order_id || o.orderId || "").trim(),
      trackingToken: String(o.tracking_token || o.trackingToken || "").trim(),
      customerName: o.customer_name || o.customerName || "Pelanggan",
      phone: o.phone || "",
      itemName: o.item_name || o.itemName || "",
      serviceName: o.service_name || o.service || o.serviceName || "",
      price: Number(o.price) || 0,
      stepIndex: Math.min(Math.max(Number(o.step_index != null ? o.step_index : o.stepIndex) || 1, 1), 5),
      statusLabel: o.status_label || o.statusLabel || "",
      deliveryType: o.delivery_type || o.deliveryType || "-",
      etaDate: o.eta_date || o.eta || o.etaDate || "Segera",
      publicNote: rawPublicNote,
      techNote: hasTechNote ? (o.tech_note || o.techNote || "") : "",
      paid: Boolean(o.paid),
      createdAt: o.created_at || o.createdAt || new Date().toISOString(),
      updatedAt: o.updated_at || o.updatedAt || null
    });
  }

  function parseOrderAndTokenInput(rawOrderOrToken, explicitToken) {
    const raw = String(rawOrderOrToken || "").trim().toUpperCase();
    let token = String(explicitToken || "").toUpperCase().replace(/[^A-F0-9]/g, "");
    let orderId = "";
    if (!token) {
      if (raw.includes(".")) {
        const parts = raw.split(".");
        orderId = (parts[0] || "").trim();
        token = (parts[1] || "").replace(/[^A-F0-9]/g, "");
      } else if (raw.includes(":")) {
        const parts = raw.split(":");
        orderId = (parts[0] || "").trim();
        token = (parts[1] || "").replace(/[^A-F0-9]/g, "");
      } else if (/^[A-F0-9]{32,64}$/.test(raw)) {
        token = raw;
      } else {
        orderId = raw;
      }
    } else {
      orderId = raw;
    }
    return { orderId, token };
  }

  function findLocalOrderByCode(tenantSlug, orderId, trackingToken) {
    const cleanSlug = String(tenantSlug || "").toLowerCase().trim().replace(/[^a-z0-9-]/g, "");
    const parsed = parseOrderAndTokenInput(orderId, trackingToken);
    const cleanCode = parsed.orderId;
    const cleanToken = parsed.token;
    if (!cleanSlug || (cleanCode.length < 6 && cleanToken.length < 32)) return null;

    const matchesOrder = (o) => {
      if (!o || !o.orderId) return false;
      const oCode = String(o.orderId).trim().toUpperCase();
      const oTok = String(o.trackingToken || "").trim().toUpperCase();
      if (cleanToken.length >= 32 && oTok) {
        return oTok === cleanToken && (!cleanCode || oCode === cleanCode);
      }
      return Boolean(cleanCode && oCode === cleanCode);
    };

    const recentOrders = getRecentPublicOrders(cleanSlug);
    const recentMatch = recentOrders.find(matchesOrder);
    if (recentMatch) return recentMatch;

    const isAdmin = Boolean(
      window.ServiceStore &&
      window.ServiceStore.isAdminForTenant &&
      window.ServiceStore.isAdminForTenant(cleanSlug)
    );
    const map = getLocalStoreMap();
    const tenantOrders = map[cleanSlug] && Array.isArray(map[cleanSlug].orders) ? map[cleanSlug].orders : [];
    const localMatch = tenantOrders.find(
      o => matchesOrder(o) && (isAdmin || String(o.id || "").startsWith("ord-"))
    );
    if (localMatch) return cleanOrderPayload(localMatch);

    const seedOrders = INITIAL_SEED_TENANTS[cleanSlug] && Array.isArray(INITIAL_SEED_TENANTS[cleanSlug].orders)
      ? INITIAL_SEED_TENANTS[cleanSlug].orders
      : [];
    const seedMatch = seedOrders.find(matchesOrder);
    return seedMatch ? JSON.parse(JSON.stringify(seedMatch)) : null;
  }

  async function waitForSupabaseClient(timeoutMs = 2000) {
    const immediate = window.getSupabaseClient();
    if (immediate) return immediate;
    if (!window.isSupabaseConfigured()) return null;

    const started = Date.now();
    while (Date.now() - started < timeoutMs) {
      await new Promise(resolve => setTimeout(resolve, 60));
      const client = window.getSupabaseClient();
      if (client) return client;
    }
    return window.getSupabaseClient();
  }

  function purgeCloudAdminOrders(keepManagedSlug) {
    try {
      const map = getLocalStoreMap();
      let changed = false;
      Object.keys(map).forEach(slugKey => {
        if (!map[slugKey] || !Array.isArray(map[slugKey].orders)) return;
        if (keepManagedSlug && slugKey === keepManagedSlug) return;
        const recentCodes = new Set(
          getRecentPublicOrders(slugKey).map(o => String((o && o.orderId) || "").trim().toUpperCase())
        );
        const beforeLen = map[slugKey].orders.length;
        const filtered = map[slugKey].orders.filter(o => {
          if (!o || !o.orderId) return false;
          const codeUpper = String(o.orderId).trim().toUpperCase();
          if (recentCodes.has(codeUpper)) return true;
          return String(o.id || "").startsWith("ord-");
        });
        if (filtered.length !== beforeLen) {
          changed = true;
          if (filtered.length === 0 && CORE_FLAGSHIP_SLUGS.includes(slugKey) && INITIAL_SEED_TENANTS[slugKey]) {
            map[slugKey].orders = JSON.parse(JSON.stringify(INITIAL_SEED_TENANTS[slugKey].orders));
          } else {
            map[slugKey].orders = filtered;
          }
        }
      });
      if (changed) {
        saveLocalStoreMap(map);
      }
    } catch (e) {}
  }

  async function resolveCloudAdminSession() {
    const sb = window.getSupabaseClient();
    if (!sb || !sb.auth || typeof sb.auth.getSession !== "function") {
      return null;
    }
    try {
      const { data: sessData, error: sessErr } = await sb.auth.getSession();
      if (sessErr || !sessData || !sessData.session) {
        window.__wsIsAuthenticated = false;
        window.__wsCurrentTenantSlug = null;
        if (window.__wsCurrentRole !== "sandbox") {
          window.__wsCurrentRole = null;
        }
        window.__wsCurrentEmail = null;
        purgeCloudAdminOrders(null);
        return null;
      }
      const { data: rows, error: profErr } = await sb.rpc("get_my_ws_admin_profile");
      const profile = Array.isArray(rows) ? rows[0] : rows;
      if (profErr || !profile || !profile.role) {
        window.__wsIsAuthenticated = false;
        window.__wsCurrentTenantSlug = null;
        if (window.__wsCurrentRole !== "sandbox") {
          window.__wsCurrentRole = null;
        }
        window.__wsCurrentEmail = null;
        purgeCloudAdminOrders(null);
        return null;
      }
      window.__wsIsAuthenticated = true;
      window.__wsCurrentRole = profile.role === "super_admin" ? "super_admin" : (profile.role === "owner" ? "owner" : null);
      window.__wsCurrentTenantSlug = profile.tenant_slug ? String(profile.tenant_slug).toLowerCase().trim() : null;
      window.__wsCurrentEmail = profile.email || (sessData.session.user && sessData.session.user.email) || null;
      if (window.__wsCurrentRole === "owner") {
        purgeCloudAdminOrders(window.__wsCurrentTenantSlug);
      }
      return profile;
    } catch (e) {
      return null;
    }
  }

  window.getActiveMitraSlug = function () {
    const params = new URLSearchParams(window.location.search);
    const s = params.get("mitra") || params.get("kafe") || localStorage.getItem("active_mitra_slug");
    if (s) {
      const cleaned = s.toLowerCase().trim().replace(/[^a-z0-9-]/g, "");
      return cleaned || "kultur-kicks";
    }
    return "kultur-kicks";
  };

  function getLocalStoreMap() {
    const key = window.SERVICE_ENGINE_CONFIG.STORAGE_KEY_PREFIX + "tenants";
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Object.keys(parsed).length > 0) {
          let dirty = false;
          CORE_FLAGSHIP_SLUGS.forEach(seedSlug => {
            if (
              !parsed[seedSlug] ||
              parsed[seedSlug].name !== INITIAL_SEED_TENANTS[seedSlug].name ||
              parsed[seedSlug].niche !== INITIAL_SEED_TENANTS[seedSlug].niche
            ) {
              const prevTpl = parsed[seedSlug] && parsed[seedSlug].uiTemplate;
              const prevLocalFlag = Boolean(parsed[seedSlug] && parsed[seedSlug]._localUiTemplateUpdated);
              parsed[seedSlug] = JSON.parse(JSON.stringify(INITIAL_SEED_TENANTS[seedSlug]));
              if (prevTpl && window.WORKSHOP_UI_TEMPLATES && window.WORKSHOP_UI_TEMPLATES[prevTpl]) {
                parsed[seedSlug].uiTemplate = prevTpl;
                if (prevLocalFlag) parsed[seedSlug]._localUiTemplateUpdated = true;
              }
              dirty = true;
            } else if (isTenantDataCorrupted(seedSlug, parsed[seedSlug].services, parsed[seedSlug].orders)) {
              const prevTpl = parsed[seedSlug].uiTemplate;
              const prevLocalFlag = Boolean(parsed[seedSlug]._localUiTemplateUpdated);
              parsed[seedSlug].services = JSON.parse(JSON.stringify(INITIAL_SEED_TENANTS[seedSlug].services));
              parsed[seedSlug].orders = JSON.parse(JSON.stringify(INITIAL_SEED_TENANTS[seedSlug].orders));
              parsed[seedSlug].serviceImagesMap = {};
              if (prevTpl && window.WORKSHOP_UI_TEMPLATES && window.WORKSHOP_UI_TEMPLATES[prevTpl]) {
                parsed[seedSlug].uiTemplate = prevTpl;
                if (prevLocalFlag) parsed[seedSlug]._localUiTemplateUpdated = true;
              }
              dirty = true;
            }
          });
          Object.keys(parsed).forEach(slugKey => {
            const tplVal = parsed[slugKey] && parsed[slugKey].uiTemplate;
            if (
              parsed[slugKey] &&
              (!tplVal || !(window.WORKSHOP_UI_TEMPLATES && window.WORKSHOP_UI_TEMPLATES[tplVal]))
            ) {
              parsed[slugKey].uiTemplate =
                (INITIAL_SEED_TENANTS[slugKey] && INITIAL_SEED_TENANTS[slugKey].uiTemplate) ||
                "tactile_bento";
              dirty = true;
            }
          });
          if (dirty) {
            localStorage.setItem(key, JSON.stringify(parsed));
          }
          return parsed;
        }
      }
    } catch (e) {}
    localStorage.setItem(key, JSON.stringify(INITIAL_SEED_TENANTS));
    return JSON.parse(JSON.stringify(INITIAL_SEED_TENANTS));
  }

  function saveLocalStoreMap(mapObj) {
    const key = window.SERVICE_ENGINE_CONFIG.STORAGE_KEY_PREFIX + "tenants";
    localStorage.setItem(key, JSON.stringify(mapObj));
    try {
      window.dispatchEvent(new CustomEvent("ws-store-updated", { detail: { key } }));
      if (window.parent && window.parent !== window) {
        const targetOrigin = window.location && window.location.origin && window.location.origin !== "null"
          ? window.location.origin
          : "*";
        window.parent.postMessage({ type: "ATELIER_STORE_SYNC", key: key }, targetOrigin);
      }
    } catch (e) {}
  }

  window.addEventListener("storage", function (e) {
    const key = window.SERVICE_ENGINE_CONFIG.STORAGE_KEY_PREFIX + "tenants";
    if (e.key === key || e.key === getRecentOrdersStorageKey() || e.key === "active_mitra_slug") {
      window.dispatchEvent(new CustomEvent("ws-cloud-synced"));
    }
  });

  window.ServiceStore = {
    escapeHtml: window.escapeHtml,
    sanitizeUrl: window.sanitizeUrl,

    purgeCloudAdminOrders(keepManagedSlug) {
      return purgeCloudAdminOrders(keepManagedSlug);
    },

    isAdminForTenant(slug) {
      if (window.__wsIsAuthenticated !== true) return false;
      if (window.__wsCurrentRole === "super_admin") return true;
      if (window.__wsCurrentRole === "owner") {
        const target = String(slug || "").toLowerCase().trim();
        const mySlug = String(window.__wsCurrentTenantSlug || "").toLowerCase().trim();
        return Boolean(target && mySlug && target === mySlug);
      }
      return false;
    },

    async ensureAdminSessionForTenant(slug) {
      const sb = window.getSupabaseClient();
      if (sb && window.__wsIsAuthenticated !== true && sb.auth && typeof sb.auth.getSession === "function") {
        await resolveCloudAdminSession();
      }
      return this.isAdminForTenant(slug);
    },

    getRecentPublicOrders(slug) {
      return getRecentPublicOrders(slug);
    },

    saveRecentPublicOrder(slug, orderObj) {
      return saveRecentPublicOrder(slug, orderObj);
    },

    findLocalOrderByCode(tenantSlug, orderId, trackingToken) {
      return findLocalOrderByCode(tenantSlug, orderId, trackingToken);
    },

    async fetchPublicOrderByCode(tenantSlug, orderId, trackingToken) {
      const cleanSlug = String(tenantSlug || "").toLowerCase().trim().replace(/[^a-z0-9-]/g, "");
      let urlToken = "";
      try {
        const params = new URLSearchParams(window.location && window.location.search ? window.location.search : "");
        urlToken = params.get("token") || "";
      } catch (e) {}

      const parsed = parseOrderAndTokenInput(orderId, trackingToken || urlToken);
      const cleanCode = parsed.orderId;
      const explicitToken = parsed.token;
      if (!cleanSlug || (cleanCode.length < 6 && explicitToken.length < 32)) return null;

      // Client-side rate limit guard (max 10 failed attempts / 5 minutes)
      const rlKey = (window.SERVICE_ENGINE_CONFIG.STORAGE_KEY_PREFIX || "atelier_service_engine_v4_") + "track_rl_" + cleanSlug;
      const now = Date.now();
      let failedTimestamps = [];
      try {
        const rawRl = typeof sessionStorage !== "undefined" && sessionStorage ? sessionStorage.getItem(rlKey) : null;
        if (rawRl) {
          const arr = JSON.parse(rawRl);
          if (Array.isArray(arr)) {
            failedTimestamps = arr.filter(ts => typeof ts === "number" && now - ts < 5 * 60 * 1000);
          }
        }
      } catch (e) {}
      if (failedTimestamps.length >= 10) {
        return null;
      }
      const recordFailedAttempt = () => {
        try {
          failedTimestamps.push(Date.now());
          if (typeof sessionStorage !== "undefined" && sessionStorage) {
            sessionStorage.setItem(rlKey, JSON.stringify(failedTimestamps.slice(-15)));
          }
        } catch (e) {}
      };

      // 1. Cek state lokal / localStorage / sessionStorage / sample INITIAL_SEED_TENANTS terlebih dahulu
      const localMatch = findLocalOrderByCode(cleanSlug, cleanCode || explicitToken, explicitToken);
      const resolvedToken =
        explicitToken.length >= 32
          ? explicitToken
          : (localMatch && localMatch.trackingToken && String(localMatch.trackingToken).length >= 32
              ? String(localMatch.trackingToken).toUpperCase().replace(/[^A-F0-9]/g, "")
              : "");

      const toPublicSafeOrder = (ordObj) => {
        if (!ordObj) return null;
        const copy = { ...ordObj };
        if (!copy.publicNote) {
          copy.publicNote = "Unit sedang diproses sesuai tahapan SOP laboratorium studio.";
        }
        copy.techNote = "";
        return copy;
      };

      // 2. Jika Supabase tidak dikonfigurasi, langsung kembalikan kecocokan lokal (instan / mode offline)
      if (!window.isSupabaseConfigured()) {
        if (!localMatch) recordFailedAttempt();
        return toPublicSafeOrder(localMatch);
      }

      if (resolvedToken.length >= 32) {
        try {
          const sb = localMatch
            ? window.getSupabaseClient()
            : await waitForSupabaseClient(2000);
          if (!sb || typeof sb.rpc !== "function") {
            return toPublicSafeOrder(localMatch);
          }
          const { data, error } = await sb.rpc("get_public_ws_order", {
            p_tenant_slug: cleanSlug,
            p_order_id: cleanCode || (localMatch ? localMatch.orderId : ""),
            p_tracking_token: resolvedToken
          });
          if (!error && data) {
            const row = Array.isArray(data) ? data[0] : data;
            if (row && (row.order_id || row.orderId)) {
              const normalized = normalizeOrderFromDb(row);
              if (normalized) {
                normalized.trackingToken = resolvedToken;
                normalized.techNote = "";
                if (
                  localMatch &&
                  (!normalized.deliveryType || normalized.deliveryType === "-") &&
                  localMatch.deliveryType
                ) {
                  normalized.deliveryType = localMatch.deliveryType;
                }
                saveRecentPublicOrder(cleanSlug, normalized);
                return normalized;
              }
            }
          }
        } catch (err) {}
      }

      if (!localMatch) {
        recordFailedAttempt();
      }
      return toPublicSafeOrder(localMatch);
    },

    async createPublicBooking(slug, orderPayload) {
      const cleanSlug = String(slug || "").toLowerCase().trim().replace(/[^a-z0-9-]/g, "");
      const map = getLocalStoreMap();
      const tenant = map[cleanSlug];
      if (!cleanSlug || !tenant) {
        throw new Error("Studio tidak ditemukan.");
      }

      const raw = orderPayload || {};
      const cleanCustomerName = window.stripDangerousTags(String(raw.customerName || "")).trim();
      if (cleanCustomerName.length < 2 || cleanCustomerName.length > 80) {
        throw new Error("Nama pelanggan harus terdiri dari 2 sampai 80 karakter.");
      }

      const cleanItemName = window.stripDangerousTags(String(raw.itemName || "")).trim();
      if (cleanItemName.length < 2 || cleanItemName.length > 100) {
        throw new Error("Nama unit/barang harus terdiri dari 2 sampai 100 karakter.");
      }

      const cleanPhone = String(raw.phone || "").trim().replace(/\s+/g, "");
      if (!cleanPhone || !/^[0-9+-]+$/.test(cleanPhone)) {
        throw new Error("Nomor telepon hanya boleh berisi angka, tanda + atau -.");
      }
      const phoneDigits = cleanPhone.replace(/\D/g, "");
      if (phoneDigits.length < 9 || phoneDigits.length > 16) {
        throw new Error("Nomor telepon harus terdiri dari 9 sampai 16 digit.");
      }

      const cleanServiceName = window.stripDangerousTags(String(raw.serviceName || "")).trim();
      if (!cleanServiceName) {
        throw new Error("Paket layanan wajib dipilih.");
      }

      const cleanNotes = window.stripDangerousTags(
        String(raw.notes != null ? raw.notes : (raw.techNote || ""))
      )
        .replace(/[\r\n\t]+/g, " ")
        .trim()
        .slice(0, 160);

      let isDemoMode = false;
      try {
        const search = window.location && window.location.search ? window.location.search : "";
        const params = new URLSearchParams(search);
        isDemoMode = params.get("demo") === "1" || params.get("mode") === "demo";
      } catch (e) {}

      let finalOrder = null;

      if (window.isSupabaseConfigured() && !isDemoMode) {
        const sb = await waitForSupabaseClient(2000);
        if (!sb || typeof sb.rpc !== "function") {
          throw new Error("Koneksi layanan booking sedang dimuat. Silakan coba lagi sebentar.");
        }
        const { data, error } = await sb.rpc("create_public_ws_booking", {
          p_tenant_slug: cleanSlug,
          p_customer_name: cleanCustomerName,
          p_phone: cleanPhone,
          p_item_name: cleanItemName,
          p_service_name: cleanServiceName,
          p_notes: cleanNotes
        });
        if (error) {
          throw new Error(error.message || "Booking ditolak oleh server.");
        }
        const row = Array.isArray(data) ? data[0] : data;
        finalOrder = normalizeOrderFromDb(row);
        if (!finalOrder || !finalOrder.orderId) {
          throw new Error("Server gagal mengembalikan kode nota yang valid.");
        }
        if (!finalOrder.trackingToken || finalOrder.trackingToken.length < 32) {
          finalOrder.trackingToken = generateTrackingToken128();
        }
        if (!finalOrder.publicNote) {
          finalOrder.publicNote = "Pesanan diterima melalui booking online. Menunggu inspeksi awal studio.";
        }
        if (raw.deliveryType && (!finalOrder.deliveryType || finalOrder.deliveryType === "-" || finalOrder.deliveryType === "Booking Web")) {
          finalOrder.deliveryType = String(raw.deliveryType).trim().slice(0, 60);
        }
      } else {
        // Fallback offline / mode demo: hitung harga resmi langsung dari katalog lokal tenant
        const catalog = Array.isArray(tenant.services) ? tenant.services : [];
        const matchedSrv = catalog.find(
          s =>
            s &&
            s.available !== false &&
            String(s.name || "").trim().toLowerCase() === cleanServiceName.toLowerCase()
        );
        if (!matchedSrv) {
          throw new Error("Paket layanan tidak ditemukan di katalog resmi studio.");
        }
        const hasPromo = Boolean(
          matchedSrv.isPromo &&
            matchedSrv.promoPrice != null &&
            Number(matchedSrv.promoPrice) >= 0 &&
            Number(matchedSrv.promoPrice) < Number(matchedSrv.price)
        );
        const unitPrice = hasPromo ? Number(matchedSrv.promoPrice) : Math.max(0, Number(matchedSrv.price) || 0);
        const qty = Math.min(Math.max(parseInt(raw.qty, 10) || 1, 1), 20);
        const nicheDef = (window.NICHE_DEFINITIONS && window.NICHE_DEFINITIONS[tenant.niche]) || {};
        const addonList = Array.isArray(nicheDef.addons) ? nicheDef.addons : [];
        const chosenAddonIds = Array.isArray(raw.addonIds) ? raw.addonIds : [];
        const addonsUnitTotal = chosenAddonIds.reduce((sum, aid) => {
          const foundAddon = addonList.find(a => a && a.id === aid);
          return sum + (foundAddon ? Math.max(0, Number(foundAddon.price) || 0) : 0);
        }, 0);
        const computedTotal = Math.max(0, (unitPrice + addonsUnitTotal) * qty);

        const hex8 = generateOrderShortHex32();
        const trackingToken128 = generateTrackingToken128();
        const cleanPrefix = (tenant.name || "ORD").replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase().padEnd(3, "X");
        const generatedOrderId = `${cleanPrefix}-${hex8}`;

        finalOrder = cleanOrderPayload({
          id: "ord-" + Date.now(),
          tenantSlug: cleanSlug,
          orderId: generatedOrderId,
          trackingToken: trackingToken128,
          customerName: cleanCustomerName,
          phone: cleanPhone,
          itemName: cleanItemName,
          serviceName: matchedSrv.name,
          price: computedTotal,
          stepIndex: 1,
          deliveryType: raw.deliveryType || (tenant.serviceMode === "studio_slot" ? "Reservasi Slot Studio" : "Booking Web"),
          etaDate: matchedSrv.duration || "Segera",
          publicNote: "Pesanan diterima melalui booking online. Menunggu inspeksi awal studio.",
          techNote: cleanNotes
            ? `[Catatan Pelanggan]: ${cleanNotes}`
            : "Pesanan masuk via booking web. Menunggu inspeksi & konfirmasi admin studio.",
          paid: false,
          createdAt: new Date().toISOString()
        });
      }

      if (!Array.isArray(tenant.orders)) tenant.orders = [];
      const existingIdx = tenant.orders.findIndex(
        o => o && String(o.orderId || "").trim().toUpperCase() === finalOrder.orderId.toUpperCase()
      );
      if (existingIdx >= 0) {
        tenant.orders[existingIdx] = { ...tenant.orders[existingIdx], ...finalOrder };
      } else {
        tenant.orders.unshift(finalOrder);
      }
      saveLocalStoreMap(map);
      saveRecentPublicOrder(cleanSlug, finalOrder);
      return finalOrder;
    },

    async syncFromCloud() {
      const sb = window.getSupabaseClient();
      if (!sb) return false;

      try {
        if (!window.canWriteToCloud()) {
          await resolveCloudAdminSession();
        }
        const canReadOrdersFromCloud = window.canWriteToCloud();

        const queries = [
          sb.from("ws_tenants").select("*"),
          sb.from("ws_services").select("*").order("sort_order", { ascending: true })
        ];
        if (canReadOrdersFromCloud) {
          queries.push(sb.from("ws_orders").select("*").order("created_at", { ascending: false }));
        }

        const results = await Promise.all(queries);
        const tRes = results[0];
        const sRes = results[1];
        const oRes = canReadOrdersFromCloud ? results[2] : { data: [], error: null };

        if (tRes.error || !tRes.data || tRes.data.length === 0) return false;

        const currentMap = getLocalStoreMap();
        const newMap = { ...currentMap };
        const protectedSeedLock = new Set();

        tRes.data.forEach(row => {
          const existingLocal = currentMap[row.slug] || {};
          const recentPublicOrders = getRecentPublicOrders(row.slug);
          const isManagedByCurrentAdmin = canReadOrdersFromCloud && this.isAdminForTenant(row.slug);
          const keepLocalTemplate =
            !canReadOrdersFromCloud &&
            existingLocal._localUiTemplateUpdated &&
            existingLocal.uiTemplate &&
            window.WORKSHOP_UI_TEMPLATES &&
            window.WORKSHOP_UI_TEMPLATES[existingLocal.uiTemplate];

          if (
            CORE_FLAGSHIP_SLUGS.includes(row.slug) &&
            (row.niche !== INITIAL_SEED_TENANTS[row.slug].niche ||
              row.name !== INITIAL_SEED_TENANTS[row.slug].name)
          ) {
            newMap[row.slug] = JSON.parse(JSON.stringify(INITIAL_SEED_TENANTS[row.slug]));
            if (keepLocalTemplate) {
              newMap[row.slug].uiTemplate = existingLocal.uiTemplate;
              newMap[row.slug]._localUiTemplateUpdated = true;
            }
            protectedSeedLock.add(row.slug);
            return;
          }
          const customCfg = row.custom_config || {};
          const cloudTpl =
            customCfg.uiTemplate &&
            window.WORKSHOP_UI_TEMPLATES &&
            window.WORKSHOP_UI_TEMPLATES[customCfg.uiTemplate]
              ? customCfg.uiTemplate
              : null;
          const localTpl =
            existingLocal.uiTemplate &&
            window.WORKSHOP_UI_TEMPLATES &&
            window.WORKSHOP_UI_TEMPLATES[existingLocal.uiTemplate]
              ? existingLocal.uiTemplate
              : null;
          const seedTpl =
            INITIAL_SEED_TENANTS[row.slug] &&
            INITIAL_SEED_TENANTS[row.slug].uiTemplate &&
            window.WORKSHOP_UI_TEMPLATES &&
            window.WORKSHOP_UI_TEMPLATES[INITIAL_SEED_TENANTS[row.slug].uiTemplate]
              ? INITIAL_SEED_TENANTS[row.slug].uiTemplate
              : null;
          const resolvedUiTemplate = keepLocalTemplate
            ? existingLocal.uiTemplate
            : cloudTpl || localTpl || seedTpl || "tactile_bento";

          let preservedOrders = [];
          if (!isManagedByCurrentAdmin || (oRes && oRes.error)) {
            const seenCodes = new Set();
            const recentCodeSet = new Set(
              recentPublicOrders.map(ro => String((ro && ro.orderId) || "").trim().toUpperCase())
            );
            [...recentPublicOrders, ...(Array.isArray(existingLocal.orders) ? existingLocal.orders : [])].forEach(o => {
              if (!o || !o.orderId) return;
              const codeKey = String(o.orderId).trim().toUpperCase();
              if (!codeKey || seenCodes.has(codeKey)) return;
              const isLocalOrRecent =
                recentCodeSet.has(codeKey) || String(o.id || "").startsWith("ord-");
              if (!isManagedByCurrentAdmin && !isLocalOrRecent) return;
              seenCodes.add(codeKey);
              preservedOrders.push(o);
            });
          }

          const rawImgMap = customCfg.serviceImagesMap && typeof customCfg.serviceImagesMap === "object"
            ? customCfg.serviceImagesMap
            : {};
          const cleanServiceImagesMap = {};
          Object.keys(rawImgMap).forEach(k => {
            const safeImgUrl = window.sanitizeUrl(rawImgMap[k]);
            if (safeImgUrl) cleanServiceImagesMap[k] = safeImgUrl;
          });
          const rawBrandColor = String(customCfg.brandColor || existingLocal.brandColor || "").trim();

          newMap[row.slug] = {
            slug: row.slug,
            name: row.name,
            branch: row.branch,
            niche: row.niche || "sneakers_care",
            serviceMode: row.service_mode || "pickup_delivery",
            themePreset: row.theme_preset || "crimson",
            uiTemplate: resolvedUiTemplate,
            _localUiTemplateUpdated: Boolean(keepLocalTemplate),
            whatsapp: row.whatsapp || "6281299887766",
            instagram: row.instagram || "",
            address: row.address || "",
            hours: row.hours || "",
            heroHeadline1: row.hero_headline_1 || "Restorasi Presisi untuk",
            heroHeadline2: row.hero_headline_2 || "Koleksi Sepatu Harian.",
            heroDesc: row.hero_desc || "",
            pickupPolicy: row.pickup_policy || "",
            ratingScore: row.rating_score || "4.9",
            logoUrl: window.sanitizeUrl(customCfg.logoUrl || existingLocal.logoUrl || ""),
            heroImageUrl: window.sanitizeUrl(customCfg.heroImageUrl || existingLocal.heroImageUrl || ""),
            brandColor: /^#[0-9a-fA-F]{3,8}$/.test(rawBrandColor) ? rawBrandColor : "",
            serviceImagesMap: cleanServiceImagesMap,
            services: [],
            orders: preservedOrders
          };
        });

        (sRes.data || []).forEach(s => {
          if (protectedSeedLock.has(s.tenant_slug)) {
            return;
          }
          if (
            CORE_FLAGSHIP_SLUGS.includes(s.tenant_slug) &&
            isCrossContaminated(s.tenant_slug, `${s.name || ""} ${s.category || ""}`, "")
          ) {
            return;
          }
          if (newMap[s.tenant_slug]) {
            const imgMap = newMap[s.tenant_slug].serviceImagesMap || {};
            newMap[s.tenant_slug].services.push({
              id: s.id,
              name: s.name,
              category: s.category || "Treatment",
              price: Number(s.price) || 0,
              promoPrice: s.promo_price ? Number(s.promo_price) : null,
              isPromo: Boolean(s.is_promo),
              duration: s.duration || "2–3 Hari",
              badge: s.badge || "",
              available: s.available !== false,
              imageUrl: window.sanitizeUrl(imgMap[s.name] || ""),
              desc: s.description || ""
            });
          }
        });

        if (canReadOrdersFromCloud && oRes && !oRes.error) {
          (oRes.data || []).forEach(o => {
            if (protectedSeedLock.has(o.tenant_slug)) {
              return;
            }
            if (!this.isAdminForTenant(o.tenant_slug)) {
              return;
            }
            if (
              CORE_FLAGSHIP_SLUGS.includes(o.tenant_slug) &&
              isCrossContaminated(o.tenant_slug, `${o.item_name || ""} ${o.service_name || ""}`, o.order_id)
            ) {
              return;
            }
            if (newMap[o.tenant_slug]) {
              const norm = normalizeOrderFromDb(o);
              if (norm && norm.orderId) {
                const exists = newMap[o.tenant_slug].orders.some(
                  ex => ex && String(ex.orderId || "").trim().toUpperCase() === norm.orderId.toUpperCase()
                );
                if (!exists) {
                  newMap[o.tenant_slug].orders.push(norm);
                }
              }
            }
          });
          Object.keys(newMap).forEach(slugKey => {
            if (!this.isAdminForTenant(slugKey)) return;
            const recents = getRecentPublicOrders(slugKey);
            recents.forEach(ro => {
              if (!ro || !ro.orderId) return;
              const rk = String(ro.orderId).trim().toUpperCase();
              const exists = newMap[slugKey].orders.some(
                ex => ex && String(ex.orderId || "").trim().toUpperCase() === rk
              );
              if (!exists) {
                newMap[slugKey].orders.push(ro);
              }
            });
          });
        }

        CORE_FLAGSHIP_SLUGS.forEach(seedSlug => {
          if (newMap[seedSlug]) {
            if (!Array.isArray(newMap[seedSlug].services) || newMap[seedSlug].services.length === 0) {
              newMap[seedSlug].services = JSON.parse(JSON.stringify(INITIAL_SEED_TENANTS[seedSlug].services));
              newMap[seedSlug].serviceImagesMap = {};
            }
            if (!Array.isArray(newMap[seedSlug].orders) || newMap[seedSlug].orders.length === 0) {
              newMap[seedSlug].orders = JSON.parse(JSON.stringify(INITIAL_SEED_TENANTS[seedSlug].orders));
            }
          }
        });

        saveLocalStoreMap(newMap);
        window.dispatchEvent(new CustomEvent("ws-cloud-synced"));
        return true;
      } catch (err) {
        return false;
      }
    },

    getAllTenants() {
      const map = getLocalStoreMap();
      return Object.values(map);
    },

    getTenant(slug) {
      const map = getLocalStoreMap();
      if (map[slug]) return map[slug];
      const base = map["kultur-kicks"] || Object.values(map)[0];
      const s = String(slug || "studio").toLowerCase();
      let guessedNiche = "sneakers_care";
      let guessedTheme = "crimson";
      let guessedMode = "pickup_delivery";
      if (/moto|garage|vespa|auto|helm|bike/.test(s)) {
        guessedNiche = "moto_detailing";
        guessedTheme = "amber";
        guessedMode = "studio_slot";
      } else if (/barber|monarch|cut|groom|hair|gentlemen/.test(s)) {
        guessedNiche = "barber_studio";
        guessedTheme = "cobalt";
        guessedMode = "studio_slot";
      } else if (!/shoe|sneaker|kicks/.test(s) && /laundry|lume|carpet|sofa|wash/.test(s)) {
        guessedNiche = "laundry_care";
        guessedTheme = "emerald";
        guessedMode = "pickup_delivery";
      }
      const cleanName = (slug || "studio").replace(/-/g, " ").toUpperCase();
      const prefix = cleanName.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase() || "STD";
      return {
        ...base,
        slug: slug,
        name: cleanName,
        branch: "Studio Partner",
        niche: guessedNiche,
        themePreset: guessedTheme,
        uiTemplate: window.resolveValidUiTemplate(
          INITIAL_SEED_TENANTS[slug] && INITIAL_SEED_TENANTS[slug].uiTemplate
        ),
        serviceMode: guessedMode,
        address: "Memuat lokasi studio...",
        instagram: "@" + (slug || "studio").replace(/-/g, "."),
        logoUrl: "",
        heroImageUrl: "",
        pickupPolicy: "Layanan perawatan & reservasi studio terpadu.",
        heroHeadline1: "Layanan Presisi di",
        heroHeadline2: cleanName + ".",
        heroDesc: "Studio layanan berstandar operasional terukur. Lacak tahapan pengerjaan atau jadwal reservasi Anda secara langsung dari HP.",
        services: [],
        orders: [
          {
            id: "ord-Wait",
            orderId: `${prefix}-2601`,
            customerName: "Pelanggan Studio",
            phone: "-",
            itemName: "Memuat Data Unit...",
            serviceName: "Sinkronisasi Layanan Studio",
            price: 0,
            stepIndex: 1,
            deliveryType: "Studio",
            etaDate: "Live",
            techNote: "Menghubungkan ke meja operasional studio..."
          }
        ],
        isPlaceholder: true
      };
    },

    saveTenantProfile(slug, updatedFields) {
      const map = getLocalStoreMap();
      if (!map[slug]) return null;
      const safeFields = cleanTenantPayload(updatedFields || {});
      const mergedProfile = { ...map[slug], ...safeFields };
      if (safeFields && safeFields.uiTemplate !== undefined) {
        mergedProfile.uiTemplate = window.resolveValidUiTemplate(
          safeFields.uiTemplate,
          map[slug].uiTemplate
        );
        mergedProfile._localUiTemplateUpdated = !window.canWriteToCloud(slug);
      } else {
        mergedProfile.uiTemplate = window.resolveValidUiTemplate(mergedProfile.uiTemplate);
      }
      map[slug] = mergedProfile;
      saveLocalStoreMap(map);

      const cur = map[slug];
      const serviceImagesMap = {};
      (cur.services || []).forEach(s => {
        if (s.name && s.imageUrl) serviceImagesMap[s.name] = s.imageUrl;
      });

      const sb = window.getSupabaseClient();
      if (sb && window.canWriteToCloud(slug)) {
        sb.from("ws_tenants").update({
          name: cur.name,
          branch: cur.branch,
          niche: cur.niche,
          service_mode: cur.serviceMode || "pickup_delivery",
          theme_preset: cur.themePreset || "crimson",
          whatsapp: cur.whatsapp,
          instagram: cur.instagram,
          rating_score: cur.ratingScore || "4.9",
          address: cur.address,
          hours: cur.hours,
          hero_headline_1: cur.heroHeadline1,
          hero_headline_2: cur.heroHeadline2,
          hero_desc: cur.heroDesc,
          pickup_policy: cur.pickupPolicy,
          custom_config: {
            logoUrl: cur.logoUrl || "",
            heroImageUrl: cur.heroImageUrl || "",
            brandColor: cur.brandColor || "",
            uiTemplate: window.resolveValidUiTemplate(cur.uiTemplate),
            serviceImagesMap
          },
          updated_at: new Date().toISOString()
        }).eq("slug", slug).then(() => {});
      }
      return map[slug];
    },

    saveTenant(slug, tenantData) {
      if (!slug || !tenantData) return null;
      const cleanSlug = String(slug).toLowerCase().trim().replace(/[^a-z0-9-]/g, "");
      if (!cleanSlug) return null;
      const map = getLocalStoreMap();
      const existing = map[cleanSlug] || {};
      const safeData = cleanTenantPayload(tenantData);
      const resolvedUiTpl = window.resolveValidUiTemplate(
        safeData.uiTemplate,
        existing.uiTemplate
      );
      const merged = {
        ...existing,
        ...safeData,
        slug: cleanSlug,
        uiTemplate: resolvedUiTpl,
        _localUiTemplateUpdated:
          safeData.uiTemplate !== undefined
            ? !window.canWriteToCloud(cleanSlug)
            : Boolean(existing._localUiTemplateUpdated),
        services: Array.isArray(safeData.services)
          ? safeData.services
          : (existing.services || []),
        orders: Array.isArray(safeData.orders)
          ? safeData.orders
          : (existing.orders || [])
      };
      delete merged.isPlaceholder;
      map[cleanSlug] = merged;
      saveLocalStoreMap(map);

      // Sinkronkan tenant, layanan, dan order baru ke Supabase jika client tersedia
      const sb = getSupabaseClient();
      if (sb && window.canWriteToCloud(cleanSlug)) {
        const serviceImagesMap = {};
        merged.services.forEach((s) => {
          if (s && s.name && s.imageUrl) {
            serviceImagesMap[s.name] = s.imageUrl;
          }
        });
        (async () => {
          try {
            const { error: tenantErr } = await sb.from("ws_tenants").upsert({
              slug: cleanSlug,
              name: merged.name || cleanSlug,
              branch: merged.branch || "",
              niche: merged.niche || "sneakers_care",
              service_mode: merged.serviceMode || "pickup_delivery",
              theme_preset: merged.themePreset || "editorial_craft",
              whatsapp: merged.whatsapp || "",
              instagram: merged.instagram || "",
              rating_score: merged.ratingScore || "4.9",
              address: merged.address || "",
              hours: merged.hours || "",
              hero_headline_1: merged.heroHeadline1 || "",
              hero_headline_2: merged.heroHeadline2 || "",
              hero_desc: merged.heroDesc || "",
              pickup_policy: merged.pickupPolicy || "",
              custom_config: {
                logoUrl: merged.logoUrl || "",
                heroImageUrl: merged.heroImageUrl || "",
                brandColor: merged.brandColor || "",
                uiTemplate: resolvedUiTpl,
                serviceImagesMap
              },
              updated_at: new Date().toISOString()
            }, { onConflict: "slug" });
            if (tenantErr) {
              console.warn("[ServiceStore] Gagal upsert ws_tenants:", tenantErr.message);
              return;
            }
            if (merged.services.length > 0) {
              const serviceRows = merged.services.map((s, idx) => ({
                tenant_slug: cleanSlug,
                name: s.name,
                category: s.category || "Reguler",
                price: Number(s.price) || 0,
                promo_price: s.promoPrice ? Number(s.promoPrice) : null,
                is_promo: Boolean(s.isPromo),
                duration: s.duration || "",
                badge: s.badge || "",
                available: s.available !== false,
                description: s.desc || "",
                sort_order: idx
              }));
              const { error: svcErr } = await sb.from("ws_services").upsert(serviceRows, { onConflict: "tenant_slug,name" });
              if (svcErr) console.warn("[ServiceStore] Gagal upsert ws_services:", svcErr.message);
            }
            if (merged.orders.length > 0) {
              const orderRows = merged.orders.map((o) => ({
                tenant_slug: cleanSlug,
                order_id: o.orderId,
                tracking_token:
                  o.trackingToken && String(o.trackingToken).length >= 32
                    ? o.trackingToken
                    : generateTrackingToken128(),
                customer_name: o.customerName || "Pelanggan",
                phone: o.phone || "",
                item_name: o.itemName || "",
                service_name: o.serviceName || "",
                price: Number(o.price) || 0,
                step_index: typeof o.stepIndex === "number" ? o.stepIndex : 1,
                delivery_type: o.deliveryType || "",
                eta_date: o.etaDate || "",
                public_note: o.publicNote || "",
                tech_note: o.techNote || "",
                paid: Boolean(o.paid)
              }));
              const { error: ordErr } = await sb.from("ws_orders").upsert(orderRows, { onConflict: "tenant_slug,order_id" });
              if (ordErr) console.warn("[ServiceStore] Gagal upsert ws_orders:", ordErr.message);
            }
          } catch (e) {
            console.warn("[ServiceStore] SaveTenant cloud sync failed:", e.message);
          }
        })();
      }

      return map[cleanSlug];
    },

    updateOrderStage(slug, orderId, newStage, newNote) {
      return this.updateOrderStep(slug, orderId, newStage, newNote);
    },

    addOrder(slug, orderPayload) {
      return this.upsertOrder(slug, orderPayload);
    },

    duplicateTenant(sourceSlug, newSlug, newName, newBranch, newNiche, newUiTemplate) {
      const cleanNewSlug = String(newSlug || "").toLowerCase().trim().replace(/[^a-z0-9-]/g, "");
      const safeName = window.stripDangerousTags(String(newName || ""));
      const safeBranch = window.stripDangerousTags(String(newBranch || ""));
      if (!cleanNewSlug || !safeName) return null;

      const map = getLocalStoreMap();
      const src = map[sourceSlug] || map["kultur-kicks"];
      const targetNiche = newNiche || src.niche;
      const templateDonor = Object.values(map).find(t => t.niche === targetNiche) || src;

      const defaultMetaByNiche = {
        sneakers_care: {
          serviceMode: "pickup_delivery",
          themePreset: "crimson",
          h1: "Restorasi Presisi untuk",
          h2: "Koleksi Sepatu Harian.",
          desc: `Studio perawatan sepatu berstandar laboratorium di ${safeBranch}. Lacak progres pengerjaan sepatu Anda secara real-time.`
        },
        moto_detailing: {
          serviceMode: "studio_slot",
          themePreset: "amber",
          h1: "Koreksi Cat & Proteksi",
          h2: "Nano Ceramic Kelas Kontes.",
          desc: `Workshop detailing motor & helm presisi di ${safeBranch}. Lacak progres pengerjaan motor Anda langsung dari HP.`
        },
        laundry_care: {
          serviceMode: "pickup_delivery",
          themePreset: "emerald",
          h1: "Higienis 1 Mesin 1 Pelanggan",
          h2: "untuk Pakaian, Karpet & Sofa.",
          desc: `Layanan laundry express, setrika uap, serta cuci karpet & sofa panggilan di ${safeBranch}. Pantau tahapan cucian Anda langsung dari HP.`
        },
        barber_studio: {
          serviceMode: "studio_slot",
          themePreset: "cobalt",
          h1: "Potongan Presisi & Grooming",
          h2: "Tanpa Antre di Kursi Studio.",
          desc: `Barbershop & men's grooming studio di ${safeBranch}. Kunci jadwal jam potong serta capster pilihan Anda dan lacak antrean langsung dari HP.`
        }
      };
      const meta = defaultMetaByNiche[targetNiche] || defaultMetaByNiche.sneakers_care;
      const chosenUiTemplate = window.resolveValidUiTemplate(
        newUiTemplate,
        templateDonor.uiTemplate || src.uiTemplate
      );

      map[cleanNewSlug] = {
        ...JSON.parse(JSON.stringify(templateDonor)),
        slug: cleanNewSlug,
        name: safeName.toUpperCase(),
        branch: safeBranch,
        niche: targetNiche,
        serviceMode: meta.serviceMode,
        themePreset: meta.themePreset,
        uiTemplate: chosenUiTemplate,
        _localUiTemplateUpdated: !(window.canWriteToCloud() && window.__wsCurrentRole === "super_admin"),
        instagram: "@" + cleanNewSlug.replace(/-/g, "."),
        address: `Studio ${safeName.toUpperCase()}, Area ${safeBranch}`,
        heroHeadline1: meta.h1,
        heroHeadline2: meta.h2,
        heroDesc: meta.desc,
        services: JSON.parse(JSON.stringify(templateDonor.services)),
        orders: []
      };
      saveLocalStoreMap(map);

      const sb = window.getSupabaseClient();
      if (sb && window.canWriteToCloud() && window.__wsCurrentRole === "super_admin") {
        sb.rpc("duplicate_ws_tenant", {
          source_slug: sourceSlug,
          new_slug: cleanNewSlug,
          new_name: safeName,
          new_branch: safeBranch,
          new_niche: targetNiche
        }).then(async () => {
          try {
            const { data: rowData } = await sb
              .from("ws_tenants")
              .select("custom_config")
              .eq("slug", cleanNewSlug)
              .single();
            const mergedCfg = {
              ...(rowData && rowData.custom_config ? rowData.custom_config : {}),
              uiTemplate: chosenUiTemplate
            };
            await sb.from("ws_tenants").update({ custom_config: mergedCfg }).eq("slug", cleanNewSlug);
          } catch (e) {}
          return this.syncFromCloud();
        });
      }
      return map[cleanNewSlug];
    },

    deleteTenant(slug) {
      const protectedSlugs = [
        "kultur-kicks",
        "apex-motoworks",
        "lume-laundry",
        "monarch-barber"
      ];
      if (protectedSlugs.includes(slug)) return false;
      const map = getLocalStoreMap();
      delete map[slug];
      saveLocalStoreMap(map);

      const sb = window.getSupabaseClient();
      if (sb && window.canWriteToCloud() && window.__wsCurrentRole === "super_admin") {
        sb.from("ws_tenants").delete().eq("slug", slug).then(() => {});
      }
      return true;
    },

    upsertOrder(slug, orderPayload) {
      const map = getLocalStoreMap();
      const tenant = map[slug];
      if (!tenant) return null;
      const safeOrder = cleanOrderPayload(orderPayload || {});
      const hasValidExplicitOrderId = Boolean(
        safeOrder.id && String(safeOrder.id).trim() && String(safeOrder.id).trim() !== "undefined"
      );
      if (!hasValidExplicitOrderId) {
        delete safeOrder.id;
      }
      const idx = tenant.orders.findIndex(o =>
        (hasValidExplicitOrderId && o.id === safeOrder.id) ||
        (safeOrder.orderId && o.orderId === safeOrder.orderId)
      );
      if (idx >= 0) {
        const existingTok = tenant.orders[idx].trackingToken;
        if (!safeOrder.trackingToken || safeOrder.trackingToken.length < 32) {
          safeOrder.trackingToken =
            existingTok && existingTok.length >= 32 ? existingTok : generateTrackingToken128();
        }
        if (!safeOrder.publicNote) {
          safeOrder.publicNote =
            tenant.orders[idx].publicNote ||
            "Unit telah terdaftar di studio dan sedang diproses sesuai tahapan SOP.";
        }
        tenant.orders[idx] = {
          ...tenant.orders[idx],
          ...safeOrder,
          id: hasValidExplicitOrderId
            ? String(safeOrder.id).trim()
            : tenant.orders[idx].id || "ord-" + Date.now()
        };
      } else {
        if (!safeOrder.trackingToken || safeOrder.trackingToken.length < 32) {
          safeOrder.trackingToken = generateTrackingToken128();
        }
        if (!safeOrder.publicNote) {
          safeOrder.publicNote = "Unit telah terdaftar di studio dan sedang diproses sesuai tahapan SOP.";
        }
        tenant.orders.unshift({
          id: hasValidExplicitOrderId ? String(safeOrder.id).trim() : "ord-" + Date.now(),
          createdAt: new Date().toISOString(),
          ...safeOrder
        });
      }
      saveLocalStoreMap(map);

      const sb = window.getSupabaseClient();
      if (sb && window.canWriteToCloud(slug)) {
        const dbRow = {
          tenant_slug: slug,
          order_id: safeOrder.orderId,
          tracking_token: safeOrder.trackingToken,
          customer_name: safeOrder.customerName,
          phone: safeOrder.phone,
          item_name: safeOrder.itemName,
          service_name: safeOrder.serviceName,
          price: Number(safeOrder.price) || 0,
          step_index: Number(safeOrder.stepIndex) || 1,
          delivery_type: safeOrder.deliveryType || "Drop-Off Studio",
          eta_date: safeOrder.etaDate || "Segera",
          public_note: safeOrder.publicNote || "",
          tech_note: safeOrder.techNote || "",
          paid: Boolean(safeOrder.paid)
        };
        sb.from("ws_orders")
          .upsert(dbRow, { onConflict: "tenant_slug,order_id" })
          .then(() => this.syncFromCloud());
      }
      return tenant.orders;
    },

    updateOrderStep(slug, orderId, newStep, newNote) {
      const map = getLocalStoreMap();
      const tenant = map[slug];
      if (!tenant) return null;
      const ord = tenant.orders.find(o => o.id === orderId || o.orderId === orderId);
      if (ord) {
        ord.stepIndex = Math.min(Math.max(Number(newStep) || 1, 1), 5);
        if (newNote !== undefined) {
          const safeStageNote = window.stripDangerousTags(String(newNote));
          ord.publicNote = safeStageNote;
          if (!ord.techNote || !String(ord.techNote).startsWith("[Catatan Pelanggan]:")) {
            ord.techNote = safeStageNote;
          }
        }
        if (ord.stepIndex === 5) {
          ord.etaDate = "Siap Diambil";
        }
        saveLocalStoreMap(map);

        const sb = window.getSupabaseClient();
        if (sb && window.canWriteToCloud(slug)) {
          const q = sb.from("ws_orders").update({
            step_index: ord.stepIndex,
            eta_date: ord.etaDate,
            public_note: ord.publicNote || "",
            tech_note: ord.techNote || "",
            updated_at: new Date().toISOString()
          });
          if (!String(ord.id).startsWith("ord-")) {
            q.eq("id", ord.id).then(() => {});
          } else {
            q.eq("tenant_slug", slug).eq("order_id", ord.orderId).then(() => {});
          }
        }
      }
      return ord;
    },

    updateOrderNote(slug, orderId, newNote, newEta, newPublicNote) {
      const map = getLocalStoreMap();
      const tenant = map[slug];
      if (!tenant) return null;
      const ord = tenant.orders.find(o => o.id === orderId || o.orderId === orderId);
      if (ord) {
        if (newNote !== undefined) ord.techNote = window.stripDangerousTags(String(newNote));
        if (newEta !== undefined) ord.etaDate = window.stripDangerousTags(String(newEta));
        if (newPublicNote !== undefined) ord.publicNote = window.stripDangerousTags(String(newPublicNote));
        saveLocalStoreMap(map);

        const sb = window.getSupabaseClient();
        if (sb && window.canWriteToCloud(slug)) {
          const payload = {
            tech_note: ord.techNote,
            eta_date: ord.etaDate,
            updated_at: new Date().toISOString()
          };
          if (newPublicNote !== undefined) {
            payload.public_note = ord.publicNote;
          }
          const q = sb.from("ws_orders").update(payload);
          if (!String(ord.id).startsWith("ord-")) {
            q.eq("id", ord.id).then(() => {});
          } else {
            q.eq("tenant_slug", slug).eq("order_id", ord.orderId).then(() => {});
          }
        }
      }
      return ord;
    },

    deleteOrder(slug, orderId) {
      const map = getLocalStoreMap();
      const tenant = map[slug];
      if (!tenant) return;
      const target = tenant.orders.find(o => o.id === orderId || o.orderId === orderId);
      tenant.orders = tenant.orders.filter(o => o.id !== orderId && o.orderId !== orderId);
      saveLocalStoreMap(map);

      const sb = window.getSupabaseClient();
      if (sb && target && window.canWriteToCloud(slug)) {
        sb.from("ws_orders").delete().eq("tenant_slug", slug).eq("order_id", target.orderId).then(() => {});
      }
    },

    upsertService(slug, srvPayload) {
      const map = getLocalStoreMap();
      const tenant = map[slug];
      if (!tenant) return;
      const safeSrv = cleanServicePayload(srvPayload || {});
      const hasValidExplicitSrvId = Boolean(
        safeSrv.id && String(safeSrv.id).trim() && String(safeSrv.id).trim() !== "undefined"
      );
      if (!hasValidExplicitSrvId) {
        delete safeSrv.id;
      }
      const idx = tenant.services.findIndex(s =>
        (hasValidExplicitSrvId && s.id === safeSrv.id) ||
        (safeSrv.name && s.name.toLowerCase() === safeSrv.name.toLowerCase())
      );
      if (idx >= 0) {
        tenant.services[idx] = {
          ...tenant.services[idx],
          ...safeSrv,
          id: hasValidExplicitSrvId
            ? String(safeSrv.id).trim()
            : tenant.services[idx].id || "srv-" + Date.now()
        };
      } else {
        tenant.services.push({
          id: hasValidExplicitSrvId ? String(safeSrv.id).trim() : "srv-" + Date.now(),
          available: true,
          ...safeSrv
        });
      }
      saveLocalStoreMap(map);

      const sb = window.getSupabaseClient();
      if (sb && window.canWriteToCloud(slug)) {
        sb.from("ws_services").upsert({
          tenant_slug: slug,
          name: safeSrv.name,
          category: safeSrv.category || "Signature Treatment",
          price: Number(safeSrv.price) || 50000,
          promo_price: safeSrv.promoPrice ? Number(safeSrv.promoPrice) : null,
          is_promo: Boolean(safeSrv.isPromo),
          duration: safeSrv.duration || "2–3 Hari",
          badge: safeSrv.badge || null,
          available: safeSrv.available !== false,
          description: safeSrv.desc || ""
        }, { onConflict: "tenant_slug,name" }).then(() => this.syncFromCloud());
      }
    },

    deleteService(slug, srvId) {
      const map = getLocalStoreMap();
      const tenant = map[slug];
      if (!tenant) return;
      const target = tenant.services.find(s => s.id === srvId);
      tenant.services = tenant.services.filter(s => s.id !== srvId);
      saveLocalStoreMap(map);

      const sb = window.getSupabaseClient();
      if (sb && target && window.canWriteToCloud(slug)) {
        sb.from("ws_services").delete().eq("tenant_slug", slug).eq("name", target.name).then(() => {});
      }
    },

    resetSeedData() {
      const key = window.SERVICE_ENGINE_CONFIG.STORAGE_KEY_PREFIX + "tenants";
      localStorage.setItem(key, JSON.stringify(INITIAL_SEED_TENANTS));
      this.syncFromCloud();
    }
  };

  window.formatRupiah = function (num) {
    return "Rp " + Math.round(Number(num) || 0).toLocaleString("id-ID");
  };
})();
