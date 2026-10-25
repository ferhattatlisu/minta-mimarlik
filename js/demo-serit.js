/* Demo şeridi: sayfanın altında "örnek tasarım" notu gösterir.
   Siteyi yayına alırken bu dosyayı ve HTML'lerdeki <script> satırını silin. */
(function () {
  var serit = document.createElement("div");
  serit.id = "demo-serit";
  serit.setAttribute("role", "note");
  serit.textContent = "Örnek tasarım · tekTıkla tarafından Minta Mimarlık için hazırlandı · Görseller firmanın kendi paylaşımlarından";
  serit.style.cssText = "position:fixed;left:0;right:0;bottom:0;z-index:99999;background:#111;color:#fff;" +
    "font:500 12px/1.35 'Inter Tight',system-ui,sans-serif;letter-spacing:.02em;text-align:center;" +
    "padding:8px 14px calc(8px + env(safe-area-inset-bottom,0px))";
  // Şerit alt bilgiyi örtmesin diye sayfanın sonuna aynı yükseklikte boşluk
  var bosluk = document.createElement("div");
  bosluk.setAttribute("aria-hidden", "true");
  function olc() { bosluk.style.height = serit.offsetHeight + "px"; }
  document.body.appendChild(bosluk);
  document.body.appendChild(serit);
  olc();
  window.addEventListener("resize", olc);
})();
