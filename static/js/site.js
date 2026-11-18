// Interactividad del sitio. Sin dependencias.
(function () {
  // Diagrama del chip: un bloque seleccionado, un panel visible.
  var blocks = document.querySelectorAll("[data-block]");
  var panels = document.querySelectorAll("[data-panel]");
  function selectBlock(id) {
    blocks.forEach(function (b) {
      b.setAttribute("aria-selected", b.dataset.block === id ? "true" : "false");
    });
    panels.forEach(function (p) { p.hidden = p.dataset.panel !== id; });
  }
  if (blocks.length) {
    blocks.forEach(function (b) {
      b.addEventListener("click", function () { selectBlock(b.dataset.block); });
    });
    selectBlock(blocks[0].dataset.block);
  }

  // Conmutador de variantes.
  var vbtns = document.querySelectorAll("[data-variante]");
  var vpanels = document.querySelectorAll("[data-variante-panel]");
  function selectVariante(id) {
    vbtns.forEach(function (b) {
      b.setAttribute("aria-selected", b.dataset.variante === id ? "true" : "false");
    });
    vpanels.forEach(function (p) { p.hidden = p.dataset.variantePanel !== id; });
  }
  if (vbtns.length) {
    vbtns.forEach(function (b) {
      b.addEventListener("click", function () { selectVariante(b.dataset.variante); });
    });
    var inicial = document.querySelector('[data-variante][aria-selected="true"]') || vbtns[0];
    selectVariante(inicial.dataset.variante);
  }

  // Filtro del catálogo de núcleos.
  var fbtns = document.querySelectorAll("[data-filtro]");
  var cores = document.querySelectorAll("[data-cat]");
  fbtns.forEach(function (b) {
    b.addEventListener("click", function () {
      var f = b.dataset.filtro;
      fbtns.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      cores.forEach(function (c) { c.hidden = f !== "*" && c.dataset.cat !== f; });
    });
  });
})();
