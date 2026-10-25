/* Site içeriği — Minta Mimarlık (Çerkezköy / Tekirdağ). Örnek tasarım: tekTıkla. */

(function () {
  // Kent Ormanı galerisi: render numaraları firmanın gönderdiği dosya adlarıyla aynı
  function ko(n, opt) { return Object.assign({ src: "images/kent-ormani-" + (n < 10 ? "0" : "") + n + ".jpg" }, opt || { land: true }); }
  function kv(ad) { return { video: "images/kent-ormani-" + ad + ".mp4", poster: "images/kent-ormani-" + ad + ".jpg", wide: true }; }
  function g(pre, list, opt) { return list.map(function (n) { return Object.assign({ src: "images/" + pre + "-0" + n + ".jpg" }, opt || { land: true }); }); }

  window.SITE = {

    brand: {
      name: "MINTA",
      suffix: "Mimarlık",
      description: "Minta Mimarlık; Çerkezköy / Tekirdağ merkezli, mimarlık ve iç mimarlıkta tasarım ve uygulama hizmeti veren bir ofistir."
    },

    nav: [
      { label: "Projeler", href: "projeler.html" },
      { label: "Stüdyo",   href: "studyo.html" },
      { label: "İletişim", href: "studyo.html#iletisim" }
    ],

    headlines: [
      ["MİMARLIK VE",   "İÇ MİMARLIK"],
      ["TASARIM &",     "UYGULAMA"],
      ["HER DETAYINDA", "MİNTA İMZASI"],
      ["KONUTTAN",      "KENT ORMANINA"],
      ["İSTANBUL",      "TEKİRDAĞ"]
    ],
    // Firmanın gönderdiği Kent Ormanı animasyonunun ilk 28 saniyesi (sessiz)
    heroVideo: "images/kent-ormani-hero.mp4",
    heroVideoCaption: "Çerkezköy Kent Ormanı — animasyon",
    heroSlides: [
      { image: "images/kent-ormani-02.jpg",   caption: "Çerkezköy Kent Ormanı — Kır Lokantası" },
      { image: "images/vivano-center-01.jpg", caption: "VIVANO CENTER — Çerkezköy, 2025" },
      { image: "images/gundogan-evleri-02.jpg", caption: "Gündoğan Evleri — Süleymanpaşa, 2025" },
      { image: "images/kent-kutuphanesi-01.jpg", caption: "Çerkezköy Kent Kütüphanesi — 2022" }
    ],

    // Firmanın VIVANO CENTER paylaşımındaki cümleden
    manifesto: "Her [detayında] Minta Mimarlık'ın imzasını taşıyan projeler; [Çerkezköy'e] ve çevresine değer katan [yaşam alanları].",
    manifestoNote: "Mimarlık ve iç mimarlıkta tasarım ve uygulama: İstanbul ve Tekirdağ'da konut, karma yapı, sanayi ve kamusal alan projeleri.",

    split: [
      {
        label: "Mimarlık",
        title: "Apartmandan karma yapıya.",
        text: "Çerkezköy'de rezidans ve apartmanlar, VIVANO CENTER gibi karma kullanımlı yapılar; Kapaklı'da bir sanayi sitesi, Yalıboyu'nda bir fabrika binası, Silivri Çayırdere'de bir tiny house yerleşkesi.",
        linkLabel: "Projeleri inceleyin",
        linkHref: "projeler.html",
        images: ["images/vivano-center-02.jpg", "images/acar-ol-rezidans-02.jpg", "images/gundogan-evleri-01.jpg"]
      },
      {
        label: "İç Mimarlık",
        title: "Yapıyla aynı dilde iç mekânlar.",
        text: "VIVANO CENTER'ın ofis ve konut birimlerinde mekân kurgusu, malzeme ve aydınlatma: ahşap ve mermer yüzeyler, gömme ışık hatları, ölçüye göre dolaplar.",
        linkLabel: "İç mekân projeleri",
        linkHref: "projeler.html?kategori=" + encodeURIComponent("İç Mekân"),
        images: ["images/vivano-ofis-01.jpg", "images/vivano-konut-01.jpg", "images/vivano-ofis-02.jpg"]
      },
      {
        label: "Kamusal Alan",
        title: "Kent için yapılar.",
        text: "Çerkezköy Kent Ormanı'nda kır lokantasından gözlem kulesine, giriş taklarından yaya köprüsüne kadar ormanın içine yerleşen yapılar; Çerkezköy Kent Kütüphanesi.",
        linkLabel: "Kent Ormanı projesi",
        linkHref: "proje.html?id=cerkezkoy-kent-ormani",
        images: ["images/kent-ormani-21.jpg", "images/kent-ormani-07.jpg", "images/kent-kutuphanesi-02.jpg"]
      }
    ],

    /* ---------- PROJELER ----------
       Yıl ve yer: firmanın Instagram açıklamalarından. Kent Ormanı: WhatsApp.
    */
    projects: [
      {
        slug: "cerkezkoy-kent-ormani",
        title: "Çerkezköy Kent Ormanı",
        tagline: "Kır lokantası, kır kahvesi, gözlem kulesi ve oyun alanlarıyla ormanın içine yerleşen yapılar.",
        location: "Çerkezköy, Tekirdağ",
        year: "",
        category: "Kamusal Alan",
        featured: true,
        showcase: true,
        cover: "images/kent-ormani-02.jpg",
        text: [
          "Çerkezköy Kent Ormanı için hazırladığımız tasarım; ormanın içinden geçen yürüyüş ve bisiklet yolları boyunca dizilen yapıları ve açık alanları kapsıyor.",
          "Projede kır lokantası, iki etaplı kır kahvesi, araç ve yaya giriş takları, yaya köprüsü, gözlem kulesi, büfe, yağmur barınağı, müştemilat ve WC yapıları, spor sahaları, otopark ve çocuk oyun alanları yer alıyor.",
          "Yapılarda ahşap kaplama ile koyu renkli metal çerçeve birlikte kullanıldı; giriş takları, kır lokantası ve kır kahvesi aynı çerçeve dilini paylaşıyor.",
          "Bu sayfadaki görseller ve animasyonlar projenin tasarım aşamasına aittir."
        ],
        gallery: [
          kv("ucus"),
          ko(1, { wide: true }),
          ko(2), ko(19),
          kv("anim-2"),
          ko(3), ko(4),
          ko(20, { wide: true }),
          kv("anim-3"),
          ko(25), ko(26),
          ko(27, { wide: true }),
          ko(5), ko(6),
          kv("anim-4"),
          ko(7), ko(8),
          kv("anim-5"),
          ko(9), ko(10),
          ko(21), ko(22),
          ko(23), ko(24),
          ko(14, { wide: true }),
          kv("anim-6"),
          ko(17), ko(18),
          ko(11), ko(12),
          ko(13), ko(15),
          ko(16, { wide: true })
        ]
      },
      {
        slug: "vivano-center",
        title: "VIVANO CENTER",
        titleLang: "en",
        tagline: "Çerkezköy'de konut, ofis ve ticari birimleri bir araya getiren karma yapı.",
        location: "Çerkezköy, Tekirdağ",
        year: 2025,
        category: "Karma Yapı",
        status: "Tamamlandı",
        featured: true,
        showcase: true,
        cover: "images/vivano-center-01.jpg",
        text: [
          "Geçtiğimiz aylarda tasarım sürecini paylaştığımız VIVANO CENTER projemiz tamamlandı.",
          "Her detayında Minta Mimarlık'ın imzasını taşıyan bu karma yapı projesi, Çerkezköy'e değer katan bir yaşam alanı olarak tasarlandı.",
          "Yapının ofis ve konut birimlerinin iç mekân tasarımını da biz yaptık."
        ],
        gallery: [
          { src: "images/vivano-center-02.jpg", wide: true },
          { src: "images/vivano-center-03.jpg", land: true }, { src: "images/vivano-center-04.jpg", land: true },
          { src: "images/vivano-center-05.jpg", wide: true },
          { src: "images/vivano-center-07.jpg", wide: false }, { src: "images/vivano-center-gece-01.jpg", wide: false },
          { src: "images/vivano-center-06.jpg", wide: true }
        ]
      },
      {
        slug: "vivano-center-ofis",
        title: "VIVANO CENTER — Ofis",
        titleLang: "en",
        tagline: "Ofis birimleri için iç mekân tasarımı.",
        location: "Çerkezköy, Tekirdağ",
        year: 2025,
        category: "İç Mekân",
        featured: false,
        showcase: false,
        cover: "images/vivano-ofis-02.jpg",
        text: [
          "VIVANO CENTER'daki ofis birimleri için iç mekân tasarımı.",
          "Çalışma odaları, mutfak nişi ve ıslak hacimlerde ahşap çıtalı duvarlar, mermer ve taş görünümlü yüzeyler ile tavana gömülü çizgisel aydınlatma birlikte kullanıldı."
        ],
        gallery: [
          { src: "images/vivano-ofis-01.jpg", land: true }, { src: "images/vivano-ofis-02.jpg", land: true },
          { src: "images/vivano-ofis-03.jpg", wide: false }, { src: "images/vivano-ofis-04.jpg", wide: false }
        ]
      },
      {
        slug: "vivano-center-konut",
        title: "VIVANO CENTER — Konut",
        titleLang: "en",
        tagline: "Konut birimleri için iç mekân tasarımı.",
        location: "Çerkezköy, Tekirdağ",
        year: 2025,
        category: "İç Mekân",
        featured: false,
        showcase: false,
        cover: "images/vivano-konut-01.jpg",
        text: [
          "VIVANO CENTER'daki konut birimleri için iç mekân tasarımı.",
          "Açık mutfaklı yaşama alanı, yatak odası ve banyoda açık tonlu ahşap, beyaz yüzeyler ve mermer bir arada."
        ],
        gallery: [
          { src: "images/vivano-konut-01.jpg", wide: true },
          { src: "images/vivano-konut-02.jpg", land: true }, { src: "images/vivano-konut-03.jpg", land: true }
        ]
      },
      {
        slug: "acar-ol-rezidans",
        title: "ACAR-OL Rezidans",
        tagline: "Zemin katında ticari birimler bulunan konut yapısı.",
        location: "Çerkezköy, Tekirdağ",
        year: 2025,
        category: "Konut",
        featured: true,
        showcase: false,
        cover: "images/acar-ol-rezidans-01.jpg",
        text: [
          "Çerkezköy'de, zemin katında ticari birimler bulunan bir konut yapısı.",
          "Cephede beyaz ve antrasit yüzeyler, altın tonlu çerçevelerle bir araya geliyor."
        ],
        gallery: g("acar-ol-rezidans", [2, 3])
      },
      {
        slug: "gundogan-evleri",
        title: "Gündoğan Evleri",
        tagline: "Sahile bakan, teraslı konutlar.",
        location: "Barbaros, Süleymanpaşa, Tekirdağ",
        year: 2025,
        category: "Konut",
        featured: true,
        showcase: true,
        cover: "images/gundogan-evleri-02.jpg",
        text: [
          "Tekirdağ Süleymanpaşa'nın Barbaros mahallesinde, sahile bakan bir konut projesi.",
          "Sahile bakan cephede geniş balkonlar ve teraslar sıralanıyor."
        ],
        gallery: g("gundogan-evleri", [1, 3, 4, 5])
      },
      {
        slug: "alcik-apartmani",
        title: "Alçık Apartmanı",
        tagline: "Geniş balkonlu bir apartman.",
        location: "Marmaracık, Ergene, Tekirdağ",
        year: 2025,
        category: "Konut",
        featured: false,
        showcase: false,
        cover: "images/alcik-apartmani-01.jpg",
        text: [
          "Ergene'nin Marmaracık mahallesinde bir apartman projesi.",
          "Cephede geniş balkonlar ve apartman adının yazılı olduğu dikey bir şerit öne çıkıyor."
        ],
        gallery: g("alcik-apartmani", [2, 3])
      },
      {
        slug: "kaya-apartmani",
        title: "Kaya Apartmanı",
        tagline: "Zemin katında mağazalar bulunan bir apartman.",
        location: "Çerkezköy, Tekirdağ",
        year: 2025,
        category: "Konut",
        featured: false,
        showcase: false,
        cover: "images/kaya-apartmani-01.jpg",
        text: [
          "Çerkezköy'de, zemin katında mağazalar bulunan bir apartman projesi."
        ],
        gallery: g("kaya-apartmani", [2, 3])
      },
      {
        slug: "arzen-rezidans",
        title: "Arzen Rezidans",
        tagline: "Eğimli arsada yükselen bir konut yapısı.",
        location: "Çerkezköy, Tekirdağ",
        year: 2025,
        category: "Konut",
        featured: false,
        showcase: false,
        cover: "images/arzen-rezidans-01.jpg",
        text: [
          "Çerkezköy'de, eğimli bir arsada yer alan konut projesi.",
          "Antrasit ve beyaz cephe yüzeyleri köşelerde balkonlarla açılıyor."
        ],
        gallery: g("arzen-rezidans", [1, 2, 3, 4])
      },
      {
        slug: "ozturk-apartmani",
        title: "Öztürk Apartmanı",
        tagline: "Köşe parselde, zemin katı mağazalı bir apartman.",
        location: "Çerkezköy, Tekirdağ",
        year: 2025,
        category: "Konut",
        featured: false,
        showcase: false,
        cover: "images/ozturk-apartmani-01.jpg",
        text: [
          "Çerkezköy'de, köşe parselde yer alan ve zemin katında mağazalar bulunan bir apartman projesi."
        ],
        gallery: g("ozturk-apartmani", [2, 3])
      },
      {
        slug: "asmet-rezidans",
        title: "Asmet Rezidans",
        tagline: "Zemin katı ticari, üst katları konut olan uzun bir blok.",
        location: "Çerkezköy, Tekirdağ",
        year: 2023,
        category: "Konut",
        featured: false,
        showcase: false,
        cover: "images/asmet-rezidans-01.jpg",
        text: [
          "Çerkezköy'de, zemin katında ticari birimler, üst katlarında konutlar bulunan bir rezidans projesi."
        ],
        gallery: g("asmet-rezidans", [2, 3, 4, 5])
      },
      {
        slug: "greengold-tinyhouse",
        title: "GREENGOLD Tinyhouse",
        titleLang: "en",
        tagline: "Ağaçlık bir arazide tiny house yerleşkesi.",
        location: "Çayırdere, Silivri, İstanbul",
        year: 2023,
        category: "Konut",
        featured: true,
        showcase: false,
        cover: "images/greengold-01.jpg",
        text: [
          "Silivri Çayırdere'de, ağaçlık bir arazi üzerinde tiny house evlerden oluşan bir yerleşke tasarımı.",
          "Evler bahçeleriyle birlikte yerleşiyor; yerleşkenin ortasında bir oyun ve yürüyüş alanı bulunuyor."
        ],
        gallery: g("greengold", [2, 3])
      },
      {
        slug: "colakoglu-rezidans",
        title: "Çolakoğlu Rezidans",
        tagline: "Köşe parselde bir konut yapısı.",
        location: "Çerkezköy, Tekirdağ",
        year: 2023,
        category: "Konut",
        featured: false,
        showcase: false,
        cover: "images/colakoglu-rezidans-01.jpg",
        text: [
          "Çerkezköy'de, köşe parselde yer alan bir konut projesi.",
          "Koyu cephe yüzeylerini dikey bakır tonlu şeritler bölüyor."
        ],
        gallery: g("colakoglu-rezidans", [2, 3])
      },
      {
        slug: "cerkezkoy-kent-kutuphanesi",
        title: "Çerkezköy Kent Kütüphanesi",
        tagline: "Taş kaplamalı, dikey çıtalı cephesiyle bir kent kütüphanesi.",
        location: "Çerkezköy, Tekirdağ",
        year: 2022,
        category: "Kamusal Alan",
        featured: true,
        showcase: true,
        cover: "images/kent-kutuphanesi-01.jpg",
        text: [
          "Çerkezköy için tasarladığımız kent kütüphanesi.",
          "Taş kaplamalı kütleler ile dikey çıtalı bir cephe bir arada."
        ],
        gallery: g("kent-kutuphanesi", [2, 3])
      },
      {
        slug: "ct-villas",
        title: "C-T Villa's",
        titleLang: "en",
        tagline: "Havuzlu bahçeler etrafında bir villa grubu.",
        location: "Çerkezköy, Tekirdağ",
        year: 2022,
        category: "Villa",
        featured: true,
        showcase: false,
        cover: "images/ct-villas-01.jpg",
        text: [
          "Çerkezköy'de, havuzlu bahçeler etrafında yerleşen villalardan oluşan bir proje.",
          "Ahşap, taş ve koyu metal yüzeyler; çatılı araç girişleri ve geniş teraslar."
        ],
        gallery: g("ct-villas", [2, 3, 4, 5])
      },
      {
        slug: "noa-plastik",
        title: "Noa Plastik",
        titleLang: "en",
        tagline: "Cam cepheli yönetim bloğu ve üretim alanıyla bir fabrika binası.",
        location: "Yalıboyu OSB, Tekirdağ",
        year: 2023,
        category: "Sanayi",
        featured: true,
        showcase: false,
        cover: "images/noa-plastik-01.jpg",
        text: [
          "Yalıboyu Organize Sanayi Bölgesi'nde bir fabrika binası.",
          "Cam cepheli yönetim bloğu ve arkasında uzanan üretim yapısı."
        ],
        gallery: g("noa-plastik", [1, 2, 3, 4])
      },
      {
        slug: "pekel-sanayi-sitesi",
        title: "Pekel Sanayi Sitesi",
        tagline: "Kapaklı'da sıralı işyerlerinden oluşan bir sanayi sitesi.",
        location: "Kapaklı, Tekirdağ",
        year: 2022,
        category: "Sanayi",
        featured: false,
        showcase: false,
        cover: "images/pekel-sanayi-01.jpg",
        text: [
          "Kapaklı'da, yan yana sıralanan işyerlerinden oluşan bir sanayi sitesi projesi."
        ],
        gallery: g("pekel-sanayi", [2, 3])
      }
    ],

    services: [
      { title: "Mimari Tasarım", short: "Konut, karma yapı, sanayi.", text: "Apartman ve rezidanslardan karma kullanımlı yapılara, sanayi sitelerinden fabrika binalarına kadar farklı ölçeklerde mimari tasarım." },
      { title: "İç Mimarlık", short: "Ofis ve konut iç mekânları.", text: "Mekân kurgusu, malzeme ve aydınlatma tasarımı. VIVANO CENTER'da ofis ve konut birimlerinin iç mekânlarını yapıyla birlikte tasarladık." },
      { title: "Uygulama", short: "Tasarımdan sahaya.", text: "Tasarladığımız projelerin uygulama sürecinde de çalışıyoruz." },
      { title: "Kamusal Alan", short: "Kent ormanı, kütüphane, açık alanlar.", text: "Çerkezköy Kent Ormanı ve Çerkezköy Kent Kütüphanesi gibi kamusal projelerde yapı ve açık alan tasarımı." }
    ],

    news: [],

    studio: {
      headline: "Mimarlık ve iç mimarlıkta, tasarımdan uygulamaya çalışan bir ofisiz.",
      image: "images/kent-kutuphanesi-02.jpg",
      text: [
        "Minta Mimarlık, Çerkezköy merkezli bir mimarlık ofisi. İstanbul ve Tekirdağ'da konut, karma yapı, sanayi ve kamusal alan projeleri tasarlıyoruz.",
        "Kendimizi mimari, şehircilik, iç mekân tasarımı, sergi ve araştırma gibi farklı ölçek ve mecralarda çalışan kolektif bir oluşum olarak tanımlıyoruz.",
        "Ofis iki kurucu ortak tarafından kuruldu."
      ],
      stats: [
        { value: "17",   label: "Sitedeki proje" },
        { value: "2",    label: "Kurucu ortak" },
        { value: "2",    label: "Şehir: İstanbul ve Tekirdağ" },
        { value: "2022", label: "Paylaşılan en eski proje" }
      ]
    },

    team: [],

    offices: [
      { city: "Çerkezköy", code: "ÇRK", timeZone: "Europe/Istanbul", address: "Gazi Osman Paşa Mah. Atatürk Cad. Sözer İş Merkezi No: 39 İç Kapı No: 501, Çerkezköy / Tekirdağ", phone: "+90 553 207 69 09" }
    ],

    labels: {
      featured: "Öne Çıkan Projeler",
      showcaseLabel: "Seçilmiş işler",
      showcaseTitle: "Projeler",
      allProjects: "Tüm projeleri gör",
      services: "Hizmetler",
      servicesTitle: "Tasarımdan uygulamaya.",
      news: "Haberler",
      newsTitle: "Stüdyodan",
      offices: "Ofis",
      team: "Ekip",
      teamTitle: "Stüdyonun arkasındaki ekip.",
      studio: "Stüdyo",
      contact: "İletişim",
      view: "İNCELE",
      next: "SONRAKİ",
      nextProject: "Sonraki proje",
      more: "İncele"
    },

    contact: {
      headline: "Projenizi birlikte konuşalım.",
      email: "mintamimarlik@gmail.com",
      phone: "+90 553 207 69 09",
      social: [
        { label: "Instagram", href: "https://www.instagram.com/minta_mimarlik/" },
        { label: "LinkedIn",  href: "https://www.linkedin.com/company/mi%CC%87nta-mi%CC%87marlik" }
      ]
    }
  };
})();
