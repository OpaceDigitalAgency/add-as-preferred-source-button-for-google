/* Docs demo wiring: event console + framework tabs. Plain JS, no dependencies. */
(function () {
  'use strict';

  // 04 — event console
  var consoleBox = document.getElementById('event-console');
  function log(name, detail) {
    if (!consoleBox) return;
    var line = new Date().toISOString().slice(11, 19) + ' ' + name + ' ' + JSON.stringify(detail || {});
    consoleBox.value += line + '\n';
    consoleBox.scrollTop = consoleBox.scrollHeight;
  }
  ['ps-click', 'ps-ready', 'ps-fallback'].forEach(function (name) {
    document.addEventListener(name, function (event) {
      log(name, event.detail);
    });
  });

  // 05 — framework tabs
  var tabs = document.querySelectorAll('#framework-tabs [role="tab"]');
  var panels = document.querySelectorAll('#framework-tabs [role="tabpanel"]');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (other) {
        other.setAttribute('aria-selected', other === tab ? 'true' : 'false');
      });
      panels.forEach(function (panel) {
        panel.hidden = panel.getAttribute('data-panel') !== tab.getAttribute('data-tab');
      });
    });
  });
})();
