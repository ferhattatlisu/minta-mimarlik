/* =====================================================================
   Sitenin tüm davranışı: sayfaları js/data.js içeriğinden üretir,
   açılış ekranı, sayfa geçişi, hero, hover listesi, imleç, saatler.
   İçerik değiştirmek için bu dosyaya değil js/data.js dosyasına bakın.
   ===================================================================== */
(function () {
  "use strict";

  var S = window.SITE;
  var doc = document, html = doc.documentElement, body = doc.body;
  var pageEl = doc.getElementById("page");
  var main = doc.getElementById("main");

  if (!S) {
    html.classList.remove("is-loading", "mid-transition");
    main.innerHTML = '<p style="padding:2rem;color:#fff;font-family:sans-serif">İçerik yüklenemedi. <b>js/data.js</b> dosyasında bir yazım hatası olabilir (eksik virgül veya tırnak işareti).</p>';
    return;
  }

  var RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var FINE = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var GRADS = window.__GRADS || ["linear-gradient(90deg,#c5e5e5,#ebf0f0)"];
  var PAGE = body.getAttribute("data-page") || "home";
  // data.js'te bir bölüm silinmiş ya da boş bırakılmışsa site yine de çalışsın
  ["nav", "headlines", "heroSlides", "split", "projects", "services", "news", "team", "offices"].forEach(function (k) {
    if (!Array.isArray(S[k])) S[k] = [];
  });
  S.brand = S.brand || { name: "" };
  S.contact = S.contact || {};
  S.studio = S.studio || {};
  var BRAND = ((S.brand.name || "") + " " + (S.brand.suffix || "")).trim();

  // Bölüm başlıkları: data.js içindeki "labels" bölümünden gelir; orada olmayanlar için bunlar kullanılır
  var L = Object.assign({
    featured: "Öne Çıkan Projeler",
    showcaseLabel: "Seçilmiş işler",
    showcaseTitle: "Projeler",
    allProjects: "Tüm projeleri gör",
    services: "Hizmetler",
    servicesTitle: "Fikirden anahtar teslimine.",
    news: "Haberler",
    newsTitle: "Stüdyodan",
    offices: "Ofislerimiz",
    team: "Ekip",
    teamTitle: "Stüdyonun arkasındaki ekip.",
    studio: "Stüdyo",
    contact: "İletişim",
    view: "İNCELE",
    next: "SONRAKİ",
    nextProject: "Sonraki proje",
    more: "İncele"
  }, S.labels || {});

  /* ------------------------------------------------------------------
     Yardımcılar
     ------------------------------------------------------------------ */
  function $(sel, root) { return (root || doc).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || doc).querySelectorAll(sel)); }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  // [kelime] -> altı çizili kelime
  function rich(text) {
    return esc(text).replace(/\[([^\]]+)\]/g, '<span class="uline">$1</span>');
  }
  // Unsplash yer tutucularında gereksiz büyük görsel indirmemek için genişliği ayarlar
  function sized(url, w) {
    if (!url || !w || url.indexOf("images.unsplash.com") === -1) return url;
    return url.replace(/([?&])w=\d+/, "$1w=" + w);
  }
  function media(url, alt, w, cls, eager) {
    var c = "media" + (cls ? " " + cls : "");
    if (!url) return '<span class="' + c + ' is-empty" data-ph="' + esc(alt || "") + '"></span>';
    return '<span class="' + c + '" data-ph="Görsel">' +
      '<img src="' + esc(sized(url, w)) + '" alt="' + esc(alt || "") + '"' +
      (eager ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async"></span>';
  }
  function projectUrl(p) { return "proje.html?id=" + encodeURIComponent(p.slug); }
  // "Yer · Yıl" satırı; yeri henüz bilinmeyen projede yalnızca yıl görünür.
  // Türkçe olmayan proje adı (ör. Parla Suits) büyük harfte "İ" olmasın.
  function ttl(p) { return p.titleLang ? '<span lang="' + esc(p.titleLang) + '">' + esc(p.title) + "</span>" : esc(p.title); }
  function placeYear(p) { return esc([p.location, p.year].filter(Boolean).join(" · ")); }
  function initials(name) {
    var p = String(name || "").trim().split(/\s+/);
    return ((p[0] || "").charAt(0) + (p.length > 1 ? p[p.length - 1].charAt(0) : "")).toLocaleUpperCase("tr");
  }
  // Adresten sayfa adını çıkarır ("projeler"). Bazı hosting servisleri adresteki
  // ".html" uzantısını kaldırdığı için karşılaştırmalar uzantısız yapılır.
  function fileOf(path) {
    var f = path.split("?")[0].split("#")[0].split("/").pop().replace(/\.html?$/i, "");
    return f === "" ? "index" : f;
  }
  function safeQuery(hash) {
    try { return hash && hash.length > 1 ? doc.getElementById(decodeURIComponent(hash.slice(1))) : null; }
    catch (e) { return null; }
  }

  /* ------------------------------------------------------------------
     Görsel yükleme / kırık görsel
     ------------------------------------------------------------------ */
  doc.addEventListener("load", function (e) {
    var t = e.target;
    if (t && t.tagName === "IMG") t.classList.add("is-loaded");
  }, true);
  doc.addEventListener("error", function (e) {
    var t = e.target;
    if (t && t.tagName === "IMG" && t.parentNode && t.parentNode.classList) t.parentNode.classList.add("is-broken");
  }, true);
  // Açılışı yavaşlatmamak için bekletilen görselleri (data-src) yükler
  function loadDeferred(root) {
    $$("img[data-src]", root).forEach(function (im) {
      var src = im.getAttribute("data-src");
      im.removeAttribute("data-src");
      im.src = src;
    });
  }
  function checkImages(root) {
    $$(".media img", root).forEach(function (img) {
      if (!img.complete) return;
      if (img.naturalWidth > 0) img.classList.add("is-loaded");
      else if (img.currentSrc || img.src) img.parentNode.classList.add("is-broken");
    });
  }

  /* ------------------------------------------------------------------
     Saatler
     ------------------------------------------------------------------ */
  var fmtCache = {};
  function zoneTime(tz) {
    try {
      var f = fmtCache[tz] || (fmtCache[tz] = new Intl.DateTimeFormat("en-GB", {
        timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23"
      }));
      var o = {};
      f.formatToParts(new Date()).forEach(function (p) { o[p.type] = p.value; });
      return { h: parseInt(o.hour, 10) % 24, m: parseInt(o.minute, 10), s: parseInt(o.second, 10) };
    } catch (e) {
      var d = new Date();
      return { h: d.getHours(), m: d.getMinutes(), s: d.getSeconds() };
    }
  }
  function setText(el, v) { if (el && el.textContent !== v) el.textContent = v; }
  function tickClocks() {
    $$("[data-tz]").forEach(function (el) {
      var t = zoneTime(el.getAttribute("data-tz"));
      setText($("[data-hh]", el), pad2(t.h));
      setText($("[data-mm]", el), pad2(t.m));
      var hh = $(".hand-h", el);
      if (hh) {
        var secs = t.h * 3600 + t.m * 60 + t.s;
        hh.style.transform = "rotate(" + (secs / 120) + "deg)";
        $(".hand-m", el).style.transform = "rotate(" + (secs / 10) + "deg)";
        $(".hand-s", el).style.transform = "rotate(" + (secs * 6) + "deg)";
        el.classList.toggle("is-night", t.h < 6 || t.h >= 19);
      }
    });
  }
  function clockSVG() {
    var ticks = "";
    for (var i = 0; i < 12; i++) {
      ticks += '<line class="tick" x1="50" y1="' + (i % 3 === 0 ? 5 : 6.5) + '" x2="50" y2="' + (i % 3 === 0 ? 13 : 10.5) + '" transform="rotate(' + (i * 30) + ' 50 50)"/>';
    }
    return '<svg class="clock-face" viewBox="0 0 100 100" aria-hidden="true">' +
      '<circle class="dial" cx="50" cy="50" r="49"/>' + ticks +
      '<line class="hand hand-h" x1="50" y1="50" x2="50" y2="27"/>' +
      '<line class="hand hand-m" x1="50" y1="50" x2="50" y2="15"/>' +
      '<line class="hand hand-s" x1="50" y1="60" x2="50" y2="12"/>' +
      '<circle class="pin" cx="50" cy="50" r="1.8"/></svg>';
  }
  function digital() {
    return '<span data-hh>--</span><span class="colon">:</span><span data-mm>--</span>';
  }

  /* ------------------------------------------------------------------
     Ortak bölümler
     ------------------------------------------------------------------ */
  function isCurrent(href) {
    if (href.indexOf("#") !== -1) return false;
    var here = fileOf(location.pathname);
    if (here === "proje") here = "projeler";
    return fileOf(href) === here;
  }

  function headerHTML() {
    var links = S.nav.map(function (n) {
      return '<a class="pill' + (isCurrent(n.href) ? " is-current" : "") + '" href="' + esc(n.href) + '">' + esc(n.label) + "</a>";
    }).join("");
    var big = [{ label: "Ana Sayfa", href: "index.html" }].concat(S.nav).map(function (n, i) {
      return '<a href="' + esc(n.href) + '"><span class="mk" style="--i:' + i + '"><span>' + esc(n.label) + "</span></span></a>";
    }).join("");
    var o = S.offices[0];
    return '' +
      '<header class="hdr" data-theme="dark">' +
        '<a class="logo" href="index.html" aria-label="' + esc(BRAND) + ' — ana sayfa">' +
          '<span class="logo-a">' + esc(S.brand.name) + '</span>' +
          (S.brand.suffix ? '<span class="logo-b">' + esc(S.brand.suffix) + "</span>" : "") +
        "</a>" +
        '<nav class="pills" aria-label="Ana menü">' + links + "</nav>" +
        '<button class="pill pill-menu" type="button" aria-expanded="false" aria-controls="menu">Menü</button>' +
      "</header>" +
      '<div class="menu" id="menu" aria-hidden="true">' +
        '<nav class="menu-links" aria-label="Mobil menü">' + big + "</nav>" +
        '<div class="menu-foot">' +
          '<a href="mailto:' + esc(S.contact.email) + '">' + esc(S.contact.email) + "</a>" +
          (o ? '<span data-tz="' + esc(o.timeZone) + '">' + esc(o.code) + " " + digital() + "</span>" : "") +
        "</div>" +
      "</div>";
  }

  function footerHTML(plain) {
    var offices = S.offices.map(function (o) {
      return '<p class="ftr-office"><strong>' + esc(o.city) + "</strong><br>" + esc(o.address) +
        (o.phone ? '<br><a href="tel:' + esc(o.phone.replace(/\s/g, "")) + '">' + esc(o.phone) + "</a>" : "") + "</p>";
    }).join("");
    var links = [{ label: "Ana Sayfa", href: "index.html" }].concat(S.nav).map(function (n) {
      return '<li><a href="' + esc(n.href) + '">' + esc(n.label) + "</a></li>";
    }).join("");
    var social = (S.contact.social || []).map(function (s) {
      var ext = /^https?:/i.test(s.href);
      return '<li><a href="' + esc(s.href) + '"' + (ext ? ' target="_blank" rel="noopener"' : "") + ">" + esc(s.label) + "</a></li>";
    }).join("");
    return '' +
      '<footer class="ftr t-dark' + (plain ? " is-plain" : "") + '" data-theme="dark">' +
        (plain ? "" :
          '<div class="ftr-cta rv">' +
            '<p class="ftr-cta-text">' + esc(S.contact.headline) + "</p>" +
            '<a class="btn" href="mailto:' + esc(S.contact.email) + '">' + esc(S.contact.email) + " <i>→</i></a>" +
          "</div>") +
        '<div class="ftr-cols">' +
          '<div class="ftr-col ftr-about"><p>' + esc(S.brand.description) + "</p></div>" +
          (offices ? '<div class="ftr-col"><h3 class="label">' + esc(L.offices) + "</h3>" + offices + "</div>" : "") +
          '<div class="ftr-col"><h3 class="label">Menü</h3><ul>' + links + "</ul></div>" +
          (social ? '<div class="ftr-col"><h3 class="label">Takip</h3><ul>' + social + "</ul></div>" : "") +
        "</div>" +
        '<div class="ftr-word" aria-hidden="true"><span>' + esc(S.brand.name) + "</span></div>" +
        '<div class="ftr-base">' +
          "<span>© " + new Date().getFullYear() + " " + esc(BRAND) + "</span>" +
          '<button class="ftr-top" type="button">Yukarı ↑</button>' +
        "</div>" +
      "</footer>";
  }

  function clocksHTML(theme) {
    if (!S.offices.length) return "";
    var items = S.offices.map(function (o, i) {
      return '<div class="clock rv" style="--d:' + (i * 0.1) + 's" data-tz="' + esc(o.timeZone) + '">' +
        clockSVG() +
        '<div><div class="clock-city">' + esc(o.city) + "</div>" +
        '<div class="clock-time">' + esc(o.code) + " · " + digital() + "</div></div>" +
      "</div>";
    }).join("");
    return '<section class="clocks ' + theme + '" data-theme="light" aria-label="' + esc(L.offices) + '">' +
      '<div class="sec-head"><h2 class="label">' + esc(L.offices) + "</h2></div>" +
      '<div class="clocks-row" style="--n:' + S.offices.length + '">' + items + "</div>" +
    "</section>";
  }

  function servicesHTML(full, theme) {
    if (!S.services.length) return "";
    var rows = S.services.map(function (s, i) {
      var inner = '<span class="svc-no">' + pad2(i + 1) + "</span>" +
        '<span class="svc-name">' + esc(s.title) + "</span>" +
        '<span class="svc-desc">' + esc(full ? s.text : s.short) + "</span>";
      if (full) return '<div class="svc-row is-full rv">' + inner + "</div>";
      return '<a class="svc-row rv" href="studyo.html#hizmetler">' + inner +
        '<span class="svc-go">' + esc(L.more) + " <i>→</i></span></a>";
    }).join("");
    return '<section class="svc ' + theme + '" data-theme="light" id="hizmetler">' +
      '<div class="svc-grid">' +
        '<div class="svc-head rv"><p class="label">' + esc(L.services) + "</p><h2>" + esc(L.servicesTitle) + "</h2></div>" +
        '<div class="svc-list">' + rows + "</div>" +
      "</div>" +
    "</section>";
  }

  /* ------------------------------------------------------------------
     ANA SAYFA
     ------------------------------------------------------------------ */
  function heroHTML() {
    var slides = S.heroSlides || [];
    var hasVideo = !!S.heroVideo;
    var bg = hasVideo
      ? '<video class="hero-video" autoplay muted loop playsinline preload="auto"' +
          (slides[0] ? ' poster="' + esc(slides[0].image) + '"' : "") + ">" +
          '<source src="' + esc(S.heroVideo) + '"></video>'
      : slides.map(function (s, i) {
          return '<div class="media hero-slide" data-ph="">' +
            '<img ' + (i === 0 ? 'fetchpriority="high" src' : "data-src") + '="' + esc(sized(s.image, 2000)) + '" alt="" decoding="async"></div>';
        }).join("");
    var heads = S.headlines.map(function (h) {
      return '<span class="hl" aria-hidden="true">' + h.map(function (line) {
        return '<span class="mk"><span>' + esc(line) + "</span></span>";
      }).join("") + "</span>";
    }).join("");
    var dots = hasVideo || slides.length < 2 ? "" : '<div class="hero-dots">' + slides.map(function (s, i) {
      return '<button class="hero-dot" type="button" aria-label="Slayt ' + (i + 1) + '"></button>';
    }).join("") + "</div>";
    var caption = hasVideo ? (S.heroVideoCaption || "") : (slides[0] ? slides[0].caption : "");
    var clocks = S.offices.slice(0, 2).map(function (o) {
      return '<span data-tz="' + esc(o.timeZone) + '"><b>' + esc(o.code) + "</b>" + digital() + "</span>";
    }).join("");
    return '' +
      '<section class="hero" data-theme="dark">' +
        '<div class="hero-bg">' + bg + "</div>" +
        '<div class="hero-shade"></div>' +
        '<h1 class="hero-title" aria-label="' + esc(BRAND + " — " + (S.headlines[0] || []).join(" ")) + '">' + heads + "</h1>" +
        '<div class="hero-bar">' +
          '<div class="hero-cap"><p class="hero-cap-text">' + esc(caption) + "</p>" + dots + "</div>" +
          '<a class="hero-arrow" href="#manifesto" aria-label="Aşağı kaydır">' +
            '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 2v15M3.5 10.5 10 17l6.5-6.5"/></svg></a>' +
          '<div class="hero-clocks">' + clocks + "</div>" +
        "</div>" +
      "</section>";
  }

  function renderHome() {
    var feat = S.projects.filter(function (p) { return p.featured; });
    var show = S.projects.filter(function (p) { return p.showcase; });
    var shapes = ["s0", "s1", "s2"];

    var manifesto = '' +
      '<section class="manifesto t-light" data-theme="light" id="manifesto">' +
        '<p class="manifesto-text rv">' + rich(S.manifesto) + "</p>" +
        '<div class="manifesto-side"><div class="manifesto-note rv">' +
          "<p>" + esc(S.manifestoNote) + "</p>" +
          '<a class="btn" href="studyo.html">' + esc(L.studio) + " <i>→</i></a>" +
        "</div></div>" +
      "</section>";

    var featured = !feat.length ? "" :
      '<section class="feat t-dark" data-theme="dark">' +
        '<div class="sec-head rv"><h2 class="label">' + esc(L.featured) + '</h2><span class="label mute">' + pad2(feat.length) + "</span></div>" +
        '<div class="feat-list">' +
          feat.map(function (p, i) {
            return '<a class="feat-row" href="' + projectUrl(p) + '" data-i="' + i + '">' +
              '<span class="feat-txt"><span class="feat-name">' + ttl(p) + '</span><span class="feat-desc">' + esc(p.tagline) + "</span></span>" +
              media(p.cover, "", 400, "feat-thumb") +
            "</a>";
          }).join("") +
          '<div class="feat-preview" aria-hidden="true">' +
            feat.map(function (p, i) {
              return '<span class="media ' + shapes[i % 3] + '"><img data-src="' + esc(sized(p.cover, 800)) + '" alt="" decoding="async"></span>';
            }).join("") +
          "</div>" +
        "</div>" +
        '<div class="feat-more rv"><a class="btn" href="projeler.html">' + esc(L.allProjects) + " <i>→</i></a></div>" +
      "</section>";

    var showcase = !show.length ? "" :
      '<section class="show t-light" data-theme="light">' +
        '<p class="label rv">' + esc(L.showcaseLabel) + "</p>" +
        '<h2 class="show-title mkw"><span class="mk"><span>' + esc(L.showcaseTitle) + "</span></span></h2>" +
        '<div class="show-grid">' +
          show.map(function (p) {
            return '<a class="card rv" href="' + projectUrl(p) + '" data-cursor="' + esc(L.view) + '">' +
              '<span class="media" data-ph="Görsel"><img src="' + esc(sized(p.cover, 1400)) + '" alt="' + esc(p.title) + '" loading="lazy" decoding="async">' +
                '<span class="card-cta">' + esc(L.view) + " →</span></span>" +
              '<span class="card-meta"><span class="card-title">' + ttl(p) + "</span>" +
              '<span class="card-sub">' + placeYear(p) + "</span></span>" +
            "</a>";
          }).join("") +
        "</div>" +
        '<div class="show-more rv"><a class="btn" href="projeler.html">' + esc(L.allProjects) + " <i>→</i></a></div>" +
      "</section>";

    var split = !S.split.length ? "" :
      '<section class="split t-dark" data-theme="dark">' +
        S.split.map(function (b, i) {
          return '<div class="split-row' + (i % 2 ? " is-rev" : "") + '">' +
            '<div class="split-photos">' + (b.images || []).map(function (src) { return media(src, "", 1400); }).join("") + "</div>" +
            '<div class="split-text"><div class="split-sticky">' +
              '<p class="label mute">' + esc(b.label) + "</p>" +
              '<h2 class="split-title">' + esc(b.title) + "</h2>" +
              '<p class="split-body">' + esc(b.text) + "</p>" +
              (b.linkHref ? '<a class="btn" href="' + esc(b.linkHref) + '">' + esc(b.linkLabel || L.more) + " <i>→</i></a>" : "") +
              '<p class="split-count label">' + pad2(i + 1) + " / " + pad2(S.split.length) + "</p>" +
            "</div></div>" +
          "</div>";
        }).join("") +
      "</section>";

    var news = !S.news.length ? "" :
      '<section class="news t-dark" data-theme="dark">' +
        '<div class="sec-head rv"><h2 class="h-serif">' + esc(L.newsTitle) + '</h2><span class="label mute">' + esc(L.news) + "</span></div>" +
        '<div class="news-grid">' +
          S.news.map(function (n, i) {
            var inner = media(n.image, n.title, 800) +
              '<span class="news-meta label"><span>' + esc(n.tag) + "</span><span>" + esc(n.date) + "</span></span>" +
              '<span class="news-title">' + esc(n.title) + "</span>";
            var attrs = ' class="news-card rv rv-blur" style="--d:' + (i * 0.08) + 's"';
            return n.link ? "<a" + attrs + ' href="' + esc(n.link) + '">' + inner + "</a>" : "<div" + attrs + ">" + inner + "</div>";
          }).join("") +
        "</div>" +
      "</section>";

    main.innerHTML = heroHTML() + manifesto + clocksHTML("t-light") + featured + showcase + split + servicesHTML(false, "t-light") + news;
    doc.title = BRAND;
  }

  /* ------------------------------------------------------------------
     PROJELER SAYFASI
     ------------------------------------------------------------------ */
  function renderProjects() {
    var all = S.projects;
    var cats = [];
    all.forEach(function (p) { if (cats.indexOf(p.category) === -1) cats.push(p.category); });
    var cur = "";
    try { cur = new URLSearchParams(location.search).get("kategori") || ""; } catch (e) {}
    if (cats.indexOf(cur) === -1) cur = "";
    var view = "liste";

    main.innerHTML = '' +
      '<section class="t-light" data-theme="light">' +
        '<div class="phead">' +
          '<div class="phead-row rv"><p class="label">' + esc(BRAND) + '</p><p class="label mute" data-count></p></div>' +
          '<h1 class="phead-title mkw"><span class="mk"><span>' + esc(L.showcaseTitle) + "</span></span></h1>" +
        "</div>" +
        '<div class="pbar rv">' +
          '<div class="chips" data-cats>' +
            [""].concat(cats).map(function (c) {
              var n = c ? all.filter(function (p) { return p.category === c; }).length : all.length;
              return '<button class="chip" type="button" data-cat="' + esc(c) + '">' + esc(c || "Tümü") + "<sup>" + n + "</sup></button>";
            }).join("") +
          "</div>" +
          '<div class="chips" data-views>' +
            '<button class="chip" type="button" data-view="liste">Liste</button>' +
            '<button class="chip" type="button" data-view="izgara">Izgara</button>' +
          "</div>" +
        "</div>" +
        '<div class="plist" data-view="liste"></div>' +
      "</section>";

    var list = $(".plist", main), count = $("[data-count]", main);

    function draw() {
      var items = all.filter(function (p) { return !cur || p.category === cur; });
      list.setAttribute("data-view", view);
      list.innerHTML = items.length ? items.map(function (p, i) {
        return '<a class="pitem" href="' + projectUrl(p) + '" style="--i:' + i + '"' + (view === "izgara" ? ' data-cursor="' + esc(L.view) + '"' : "") + ">" +
          '<span class="pitem-no">' + pad2(i + 1) + "</span>" +
          '<span class="pitem-title">' + ttl(p) + "</span>" +
          '<span class="pitem-sub">' + placeYear(p) + "</span>" +
          '<span class="pitem-loc">' + esc(p.location) + "</span>" +
          '<span class="pitem-cat">' + esc(p.category) + "</span>" +
          '<span class="pitem-year">' + esc(p.year) + "</span>" +
          media(p.cover, p.title, 800, "pitem-img") +
        "</a>";
      }).join("") : '<p class="pempty">Bu kategoride proje yok.</p>';
      count.textContent = items.length + " proje";
      $$("[data-cat]", main).forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-cat") === cur)); });
      $$("[data-view]", $("[data-views]", main)).forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-view") === view)); });
      checkImages(list);
    }

    main.addEventListener("click", function (e) {
      var c = e.target.closest("[data-cat]"), v = e.target.closest("[data-views] [data-view]");
      if (c) { cur = c.getAttribute("data-cat"); draw(); }
      else if (v) { view = v.getAttribute("data-view"); draw(); }
    });
    draw();
    doc.title = L.showcaseTitle + " — " + BRAND;
  }

  /* ------------------------------------------------------------------
     PROJE DETAY SAYFASI
     ------------------------------------------------------------------ */
  function renderProject() {
    var id = "";
    try { id = new URLSearchParams(location.search).get("id") || ""; } catch (e) {}
    var idx = -1;
    S.projects.forEach(function (p, i) { if (p.slug === id) idx = i; });

    if (idx === -1) {
      main.innerHTML = '<section class="notfound t-dark" data-theme="dark">' +
        '<p class="label mute">404</p><h1 class="h-serif">Aradığınız proje bulunamadı.</h1>' +
        '<a class="btn" href="projeler.html">' + esc(L.allProjects) + " <i>→</i></a></section>";
      doc.title = "Proje bulunamadı — " + BRAND;
      return;
    }

    var p = S.projects[idx];
    var next = S.projects[(idx + 1) % S.projects.length];
    var facts = [
      ["Yer", esc(p.location)],
      ["Yıl", esc(p.year)],
      ["Alan", esc(p.area)],
      ["Tür", '<a href="projeler.html?kategori=' + encodeURIComponent(p.category) + '">' + esc(p.category) + "</a>"],
      ["Durum", esc(p.status)],
      ["İşveren", esc(p.client)]
    ].filter(function (f) { return f[1]; });
    var text = p.text || [];

    main.innerHTML = '' +
      '<section class="pcover t-dark" data-theme="dark">' +
        media(p.cover, p.title, 2000, "", true) +
        '<div class="pcover-in mkw">' +
          '<p class="label rv">' + esc([p.category, p.year].filter(Boolean).join(" · ")) + "</p>" +
          '<h1 class="pcover-title"><span class="mk"><span>' + ttl(p) + "</span></span></h1>" +
          '<div class="pcover-foot rv" style="--d:.3s"><p>' + esc(p.tagline) + "</p><span>" + esc(p.location) + "</span></div>" +
        "</div>" +
      "</section>" +
      '<section class="t-light" data-theme="light">' +
        '<div class="pinfo">' +
          '<dl class="pfacts rv">' + facts.map(function (f) { return "<div><dt>" + f[0] + "</dt><dd>" + f[1] + "</dd></div>"; }).join("") + "</dl>" +
          '<div class="ptext">' +
            (text[0] ? '<p class="ptext-lead rv">' + esc(text[0]) + "</p>" : "") +
            '<div class="ptext-body rv">' + text.slice(1).map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("") + "</div>" +
          "</div>" +
        "</div>" +
        '<div class="pgal">' +
          (p.gallery || []).map(function (g, i) {
            // Varsayılan: 1 geniş + 2 yan yana. Nesne verilirse düzen elle seçilir:
            //   { src, wide: true }  tam genişlik   { src, land: true }  yarım genişlik, yatay
            //   { src, wide: false } yarım genişlik, dikey   { video, poster } video
            var o = typeof g === "string" ? { src: g } : (g || {});
            var wide = o.wide == null ? (!o.land && !o.video && i % 3 === 0 && typeof g === "string") : !!o.wide;
            var cls = "rv" + (wide ? " is-wide" : "") + (o.land ? " is-land" : "");
            if (o.video) {
              return '<span class="media is-video ' + cls + '"><video src="' + esc(o.video) + '"' +
                (o.poster ? ' poster="' + esc(o.poster) + '"' : "") +
                ' controls muted playsinline preload="none" aria-label="' + esc(p.title) + ' — video"></video></span>';
            }
            return media(o.src, p.title + " — görsel " + (i + 1), wide ? 2000 : 1200, cls);
          }).join("") +
        "</div>" +
      "</section>" +
      '<a class="pnext t-dark" data-theme="dark" href="' + projectUrl(next) + '" data-cursor="' + esc(L.next) + '">' +
        media(next.cover, "", 1600) +
        '<span class="label">' + esc(L.nextProject) + "</span>" +
        '<span class="pnext-title">' + ttl(next) + "</span>" +
      "</a>";
    doc.title = p.title + " — " + BRAND;
  }

  /* ------------------------------------------------------------------
     STÜDYO SAYFASI
     ------------------------------------------------------------------ */
  function renderStudio() {
    var st = S.studio;
    main.innerHTML = '' +
      '<section class="t-cream" data-theme="light">' +
        '<div class="shead">' +
          '<p class="label rv">' + esc(L.studio) + "</p>" +
          '<h1 class="shead-title rv" style="--d:.1s">' + rich(st.headline) + "</h1>" +
        "</div>" +
        '<div class="sabout">' +
          media(st.image, BRAND, 1400, "rv") +
          '<div class="sabout-text rv">' +
            (st.text || []).map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("") +
            (!(st.stats || []).length ? "" : '<div class="stats">' + st.stats.map(function (s) {
              return '<div class="stat"><b>' + esc(s.value) + "</b><span>" + esc(s.label) + "</span></div>";
            }).join("") + "</div>") +
          "</div>" +
        "</div>" +
      "</section>" +
      servicesHTML(true, "t-light") +
      (!S.team.length ? "" :
      '<section class="team t-cream" data-theme="light" id="ekip">' +
        '<p class="label rv">' + esc(L.team) + "</p>" +
        '<h2 class="h-serif rv" style="margin-top:.5em">' + esc(L.teamTitle) + "</h2>" +
        '<div class="team-grid">' + S.team.map(function (m, i) {
          return '<div class="person rv" style="--d:' + ((i % 3) * 0.08) + 's">' +
            (m.image ? media(m.image, m.name, 800) : media("", initials(m.name))) +
            '<p class="person-name">' + esc(m.name) + '</p><p class="person-role">' + esc(m.role) + "</p></div>";
        }).join("") + "</div>" +
      "</section>") +
      clocksHTML("t-cream").replace('class="clocks ', 'style="padding-top:' + (S.team.length ? "0" : "clamp(72px,10vw,160px)") + '" class="clocks ') +
      '<section class="contact t-dark" data-theme="dark" id="iletisim">' +
        '<p class="label mute rv">' + esc(L.contact) + "</p>" +
        '<h2 class="contact-title rv">' + esc(S.contact.headline) + "</h2>" +
        '<div class="rv" style="--d:.15s">' +
          '<a class="contact-mail" href="mailto:' + esc(S.contact.email) + '">' + esc(S.contact.email) + "</a>" +
          (S.contact.phone ? '<a class="contact-phone" href="tel:' + esc(S.contact.phone.replace(/\s/g, "")) + '">' + esc(S.contact.phone) + "</a>" : "") +
        "</div>" +
        (!S.offices.length ? "" : '<div class="contact-offices">' + S.offices.map(function (o) {
          return '<div class="rv"><h3>' + esc(o.city) + "</h3><p>" + esc(o.address) + (o.phone ? "<br>" + esc(o.phone) : "") + "</p></div>";
        }).join("") + "</div>") +
      "</section>";
    doc.title = L.studio + " — " + BRAND;
  }

  /* ------------------------------------------------------------------
     Hero: başlık döngüsü + fotoğraf slaytı
     ------------------------------------------------------------------ */
  function initHero() {
    var hero = $(".hero");
    if (!hero) return null;
    var hls = $$(".hl", hero), slides = $$(".hero-slide", hero), dots = $$(".hero-dot", hero);
    var cap = $(".hero-cap-text", hero);
    var hi = -1, si = -1, timer = null, capTimer = null;
    var DUR = 5000;

    function showHeadline(n) {
      if (!hls.length || n === hi) return;
      var prev = hls[hi];
      if (prev) {
        prev.classList.remove("is-active");
        prev.classList.add("is-leaving");
        clearTimeout(prev._t);
        prev._t = setTimeout(function () { prev.classList.remove("is-leaving"); }, 800);
      }
      hi = n;
      clearTimeout(hls[hi]._t);
      hls[hi].classList.remove("is-leaving");
      hls[hi].classList.add("is-active");
    }

    function showSlide(n) {
      if (!slides.length || n === si) return;
      var prev = slides[si];
      slides.forEach(function (s) { if (s !== prev) { clearTimeout(s._t); s.classList.remove("is-prev"); } });
      if (prev) {
        prev.classList.remove("is-active");
        prev.classList.add("is-prev");
        prev._t = setTimeout(function () { prev.classList.remove("is-prev"); }, 1100);
      }
      si = n;
      clearTimeout(slides[si]._t);
      slides[si].classList.remove("is-prev");
      slides[si].classList.add("is-active");
      dots.forEach(function (d, i) { d.classList.toggle("is-active", i === si); });
      var text = (S.heroSlides[si] || {}).caption || "";
      if (cap && cap.textContent !== text) {
        cap.classList.add("is-out");
        clearTimeout(capTimer);
        capTimer = setTimeout(function () { cap.textContent = text; cap.classList.remove("is-out"); }, 380);
      }
    }

    function go(slide) {
      if (slides.length) showSlide(((slide % slides.length) + slides.length) % slides.length);
      if (hls.length > 1) showHeadline((hi + 1) % hls.length);
    }
    function play() {
      clearInterval(timer);
      timer = setInterval(function () { if (!doc.hidden) go(si + 1); }, DUR);
    }

    dots.forEach(function (d, i) {
      d.addEventListener("click", function () { if (i !== si) { go(i); play(); } });
    });

    return {
      start: function () {
        hero.classList.add("is-started");
        loadDeferred(hero);     // kalan slayt fotoğrafları (açılışı yavaşlatmasınlar)
        showSlide(0);
        showHeadline(0);
        if (hls.length > 1 || slides.length > 1) play();
      }
    };
  }

  /* ------------------------------------------------------------------
     Öne çıkan projeler: satıra gelince beliren görsel
     ------------------------------------------------------------------ */
  function initFeatured() {
    var wrap = $(".feat-list");
    if (!wrap) return;
    var prev = $(".feat-preview", wrap), rows = $$(".feat-row", wrap), imgs = $$(".media", prev);
    var shown = false;

    function activate(row) {
      var i = parseInt(row.getAttribute("data-i"), 10);
      loadDeferred(prev);
      rows.forEach(function (r) { r.classList.toggle("is-on", r === row); });
      imgs.forEach(function (m, k) { m.classList.toggle("is-on", k === i); });
      var h = imgs[i].offsetHeight;
      var y = row.offsetTop + row.offsetHeight / 2 - h / 2;
      y = clamp(y, -24, Math.max(-24, wrap.offsetHeight - h + 24));
      if (!shown) {
        // ilk görünüşte yukarıdan kayarak gelmesin
        prev.classList.add("no-anim");
        prev.style.transform = "translate3d(0," + y + "px,0)";
        void prev.offsetHeight;
        prev.classList.remove("no-anim");
        shown = true;
      } else {
        prev.style.transform = "translate3d(0," + y + "px,0)";
      }
    }
    function clear() {
      shown = false;
      rows.forEach(function (r) { r.classList.remove("is-on"); });
      imgs.forEach(function (m) { m.classList.remove("is-on"); });
    }
    rows.forEach(function (r) {
      r.addEventListener("mouseenter", function () { activate(r); });
      r.addEventListener("focus", function () { activate(r); });
      r.addEventListener("blur", clear);
    });
    wrap.addEventListener("mouseleave", clear);
  }

  /* ------------------------------------------------------------------
     İmleci izleyen "İNCELE" yuvarlağı
     ------------------------------------------------------------------ */
  var recheckCursor = null;
  function initCursor() {
    if (!FINE) return;
    body.insertAdjacentHTML("beforeend", '<div class="cursor" aria-hidden="true"><span></span></div>');
    var c = $(".cursor"), label = $("span", c);
    var x = 0, y = 0, tx = 0, ty = 0, raf = null, seen = false;
    html.classList.add("has-cursor");

    function loop() {
      var k = RM ? 1 : 0.2;
      x += (tx - x) * k; y += (ty - y) * k;
      c.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0)";
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.2 ? requestAnimationFrame(loop) : null;
    }
    function check(target) {
      var t = target && target.closest ? target.closest("[data-cursor]") : null;
      if (t) { label.textContent = t.getAttribute("data-cursor"); c.classList.add("is-on"); }
      else c.classList.remove("is-on");
    }
    doc.addEventListener("mousemove", function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!seen) { seen = true; x = tx; y = ty; }
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    doc.addEventListener("mouseover", function (e) { check(e.target); }, { passive: true });
    // Fare kıpırdamadan sayfa kayarsa da imlecin altındaki öğeyi yeniden kontrol et
    recheckCursor = function () { if (seen) check(doc.elementFromPoint(tx, ty)); };
    doc.documentElement.addEventListener("mouseleave", function () { c.classList.remove("is-on"); });
    window.addEventListener("blur", function () { c.classList.remove("is-on"); });
  }

  /* ------------------------------------------------------------------
     Kaydırma: menü rengi, logo küçülmesi, vitrin arka planı, hero kayması
     ------------------------------------------------------------------ */
  var hdr, themed = [], showSec, heroTitle, heroBg, ticking = false;
  var STOPS = [[246, 246, 246], [213, 235, 235], [234, 242, 204], [221, 221, 243], [247, 243, 234]];

  function mix(p) {
    var f = clamp(p, 0, 1) * (STOPS.length - 1);
    var i = Math.min(STOPS.length - 2, Math.floor(f)), t = f - i, a = STOPS[i], b = STOPS[i + 1];
    return "rgb(" + Math.round(a[0] + (b[0] - a[0]) * t) + "," + Math.round(a[1] + (b[1] - a[1]) * t) + "," + Math.round(a[2] + (b[2] - a[2]) * t) + ")";
  }

  function onScroll() {
    ticking = false;
    var y = window.pageYOffset || 0, vh = window.innerHeight;
    if (hdr) {
      hdr.classList.toggle("is-small", y > 60);
      var probe = hdr.offsetHeight / 2, theme = hdr.getAttribute("data-theme");
      for (var i = 0; i < themed.length; i++) {
        var r = themed[i].getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) theme = themed[i].getAttribute("data-theme");
      }
      if (hdr.getAttribute("data-theme") !== theme) hdr.setAttribute("data-theme", theme);
    }
    if (showSec) {
      var s = showSec.getBoundingClientRect();
      if (s.bottom > -vh && s.top < vh * 2) {
        showSec.style.backgroundColor = mix((vh * 0.75 - s.top) / (s.height + vh * 0.25));
      }
    }
    if (recheckCursor) recheckCursor();
    if (heroTitle && !RM && y < vh * 1.2) {
      heroTitle.style.transform = "translate3d(0," + (y * 0.38).toFixed(1) + "px,0)";
      if (heroBg) heroBg.style.transform = "translate3d(0," + (y * 0.18).toFixed(1) + "px,0)";
    }
  }
  function requestScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(onScroll);
    // Sekme arka plandayken requestAnimationFrame çalışmaz; yedek olarak zamanlayıcı
    setTimeout(function () { if (ticking) onScroll(); }, 200);
  }

  /* ------------------------------------------------------------------
     Kaydırdıkça belirme
     ------------------------------------------------------------------ */
  var io = null;
  function observeReveals() {
    var els = $$(".rv:not(.is-in), .mkw:not(.is-in)");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    io = io || new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -7% 0px", threshold: 0.06 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------
     Footer'daki dev marka yazısını genişliğe sığdır
     ------------------------------------------------------------------ */
  function fitWord() {
    var box = $(".ftr-word"), span = box && $("span", box);
    if (!span) return;
    box.style.fontSize = "100px";
    var w = span.getBoundingClientRect().width;
    if (w > 0) box.style.fontSize = (100 * box.clientWidth / w * 0.975).toFixed(2) + "px";
  }

  /* ------------------------------------------------------------------
     Mobil menü
     ------------------------------------------------------------------ */
  function setMenu(open) {
    var btn = $(".pill-menu"), menu = $("#menu");
    html.classList.toggle("menu-open", open);
    if (btn) { btn.setAttribute("aria-expanded", String(open)); btn.textContent = open ? "Kapat" : "Menü"; }
    if (menu) menu.setAttribute("aria-hidden", String(!open));
  }

  /* ------------------------------------------------------------------
     Sayfa geçişi
     ------------------------------------------------------------------ */
  var leaving = false;
  function leave(url) {
    if (leaving) return;
    leaving = true;
    var i = 0;
    try { i = parseInt(sessionStorage.getItem("site:gecis-sira"), 10) || 0; } catch (e) {}
    i = i % GRADS.length;
    html.style.setProperty("--panel", GRADS[i]);
    html.classList.add("is-transitioning");
    setTimeout(function () {
      try {
        sessionStorage.setItem("site:gecis", i + "|" + Date.now());
        sessionStorage.setItem("site:gecis-sira", String((i + 1) % GRADS.length));
      } catch (e) {}
      location.href = url;
    }, RM ? 0 : 430);
  }

  function onClick(e) {
    var top = e.target.closest ? e.target.closest(".ftr-top") : null;
    if (top) { window.scrollTo({ top: 0, behavior: RM ? "auto" : "smooth" }); return; }
    if (e.target.closest && e.target.closest(".pill-menu")) { setMenu(!html.classList.contains("menu-open")); return; }

    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest ? e.target.closest("a[href]") : null;
    if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
    var raw = a.getAttribute("href");
    if (raw === "#") { e.preventDefault(); return; }
    if (/^(mailto:|tel:|javascript:)/i.test(raw)) return;
    if (a.protocol !== location.protocol || a.host !== location.host) return;

    var same = fileOf(a.pathname) === fileOf(location.pathname) &&
      a.pathname.replace(/[^/]*$/, "") === location.pathname.replace(/[^/]*$/, "") &&
      a.search === location.search;
    if (same) {
      e.preventDefault();
      setMenu(false);
      var target = safeQuery(a.hash);
      if (target) target.scrollIntoView({ behavior: RM ? "auto" : "smooth" });
      else window.scrollTo({ top: 0, behavior: RM ? "auto" : "smooth" });
      return;
    }
    e.preventDefault();
    leave(a.href);
  }

  /* ------------------------------------------------------------------
     Başlat
     ------------------------------------------------------------------ */
  var hero = null;

  function start() {
    if (hero) hero.start();
    // Kapak ekranındaki öğeler kaydırmayı beklemeden belirsin
    $$(".pcover .rv, .pcover .mkw, .phead .rv, .phead .mkw, .shead .rv").forEach(function (el) { el.classList.add("is-in"); });
    observeReveals();
    onScroll();
    setTimeout(function () { loadDeferred(doc); }, 1500);   // hover önizlemeleri vb.
  }

  /* ------------------------------------------------------------------
     Açılış: büyük marka yazısı site yüklendikçe küçülür, sonra üst
     menüdeki logonun yerine oturur ve site açılır
     ------------------------------------------------------------------ */
  function runIntro() {
    var mark = $(".preloader-mark"), word = mark && $(".logo-a", mark);
    var real = $(".hdr .logo-a");
    var key = $(".hero-slide img, .pcover img");
    var imageDone = !key || key.complete;
    if (!imageDone) {
      var onImage = function () { imageDone = true; };
      key.addEventListener("load", onImage);
      key.addEventListener("error", onImage);
    }

    if (RM || !word || !real) {
      // "Hareketi azalt" açıksa animasyonsuz, kısa bir beklemeyle aç
      setTimeout(function () { html.classList.remove("is-loading"); start(); }, 150);
      return;
    }

    var MIN = 1600;       // yazının küçülmesi en az bu kadar sürer (ms)
    var MAX = 5000;       // görsel gelmese de en geç bu sürede site açılır (ms)
    var SHRINK = 0.62;    // yükleme bitene kadar yazı bu oranda küçülür
    var box = null, t0 = 0, timer = null;

    // p: 0 (başlangıç, en büyük) -> 1 (yükleme bitti); yazı ekranın ortasında kalır
    function place(p) {
      var e = p * p * (3 - 2 * p);
      var s = 1 - SHRINK * e;
      var x = (html.clientWidth - box.width * s) / 2 - box.left * s;
      var y = (window.innerHeight - box.height * s) / 2 - box.top * s;
      mark.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px) scale(" + s.toFixed(4) + ")";
    }

    // Yazı üst menüdeki logonun tam üstüne oturur, siyah perde kalkar
    function land() {
      // Önce kaydırma kilidini kaldır (perde hâlâ kapalıyken), sonra logonun yerini ölç
      html.classList.add("is-opening");
      html.classList.remove("is-loading");
      var t = real.getBoundingClientRect(), s = t.width / box.width;
      mark.classList.add("is-landing");
      mark.style.color = getComputedStyle(hdr).color;
      mark.style.transform = "translate(" + (t.left - box.left * s).toFixed(2) + "px," + (t.top - box.top * s).toFixed(2) + "px) scale(" + s.toFixed(5) + ")";
      setTimeout(start, 350);
      setTimeout(function () { html.classList.remove("is-opening"); }, 1080);
    }

    function tick() {
      var elapsed = Date.now() - t0;
      // İlk görsel gelmediyse %60 civarında bekle, beklerken çok yavaş ilerle
      var cap = imageDone ? 1 : 0.6 + 0.25 * clamp((elapsed - MIN * 0.6) / 3000, 0, 1);
      var p = elapsed >= MAX ? 1 : Math.min(elapsed / MIN, cap);
      place(p);
      if (p >= 1) { clearInterval(timer); setTimeout(land, 420); }
    }

    function begin() {
      if (box) return;
      // Yazıyı ekranı dolduracak boyda kur; büyükten küçüğe ölçeklendiği için net kalır
      var k = Math.min(0.72 * html.clientWidth / real.offsetWidth, 0.45 * window.innerHeight / real.offsetHeight);
      mark.style.fontSize = (parseFloat(getComputedStyle(real).fontSize) * k).toFixed(2) + "px";
      box = word.getBoundingClientRect();
      place(0);
      void mark.offsetWidth;
      mark.classList.add("is-ready", "is-live");
      t0 = Date.now();
      timer = setInterval(tick, 80);
    }

    // Yazı tipi gelmeden yazıyı gösterme (sonradan biçim değiştirmesin)
    var font = doc.fonts && doc.fonts.load ? doc.fonts.load('800 1em "Inter Tight"') : null;
    if (font && font.then) font.then(begin, begin);
    setTimeout(begin, 1200);
  }

  function boot() {
    if (PAGE === "projects") renderProjects();
    else if (PAGE === "project") renderProject();
    else if (PAGE === "studio") renderStudio();
    else renderHome();

    pageEl.insertAdjacentHTML("beforebegin", headerHTML());
    pageEl.insertAdjacentHTML("beforeend", footerHTML(PAGE === "studio"));
    var pl = $(".preloader-mark .logo-a");
    if (pl) pl.textContent = S.brand.name;
    var md = $('meta[name="description"]');
    if (md) md.setAttribute("content", S.brand.description || "");

    hdr = $(".hdr");
    themed = $$("[data-theme]", pageEl);
    showSec = $(".show");
    heroTitle = $(".hero-title");
    heroBg = $(".hero-bg");
    hero = initHero();
    initFeatured();
    initCursor();
    checkImages(doc);

    tickClocks();
    setTimeout(function () { $$(".clock").forEach(function (c) { c.classList.add("is-live"); }); }, 60);
    setInterval(tickClocks, 1000);

    fitWord();
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(fitWord);

    doc.addEventListener("click", onClick);
    doc.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    window.addEventListener("scroll", requestScroll, { passive: true });
    window.addEventListener("resize", function () { fitWord(); requestScroll(); if (window.innerWidth > 900) setMenu(false); });
    window.addEventListener("pageshow", function (e) {
      // Tarayıcının "geri" tuşuyla dönülünce geçiş durumunda takılı kalmasın
      if (e.persisted) { leaving = false; html.classList.remove("is-transitioning"); }
    });

    // #iletisim gibi bir hedefle gelindiyse oraya git
    var target = safeQuery(location.hash);
    if (target) target.scrollIntoView();
    onScroll();

    if (html.classList.contains("mid-transition")) {
      // Geçişle gelindi: panel sola çıkar, içerik %20'den yerine kayar
      setTimeout(function () {
        void pageEl.offsetWidth;      // başlangıç konumu kesinleşsin, sonra animasyon başlasın
        html.classList.add("has-transitioned");
        html.classList.remove("mid-transition");
        start();
        setTimeout(function () { html.classList.remove("has-transitioned"); }, 600);
      }, 100);
    } else {
      runIntro();
    }
  }

  boot();
})();
