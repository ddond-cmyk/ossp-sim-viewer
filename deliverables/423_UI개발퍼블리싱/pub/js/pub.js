/* pub.js — 352 계약의 최소 구현: 오버레이(닫힘 3경로·포커스 트랩·복귀) · 탭 · blur 검증.
   프레임워크 없음 — 423 산출물은 마크업·CSS·바닐라 스크립트다. */
(function () {
  "use strict";
  // T-07 오버레이 — 352 §3
  var opener = null;
  function openOverlay(ov, btn) {
    opener = btn; ov.hidden = false; document.body.style.overflow = "hidden";
    var f = ov.querySelector("button,[href],input,select");
    if (f) f.focus();
  }
  function closeOverlay(ov) {
    ov.hidden = true; document.body.style.overflow = "";
    if (opener) opener.focus();          // 포커스 복귀
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-overlay-open]");
    if (t) { openOverlay(document.getElementById(t.getAttribute("data-overlay-open")), t); return; }
    if (e.target.closest("[data-overlay-close]") || e.target.classList.contains("hd-overlay__dim")) {
      var ov = e.target.closest(".hd-overlay"); if (ov) closeOverlay(ov);
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var ov = document.querySelector(".hd-overlay:not([hidden])");
    if (ov) closeOverlay(ov);
  });
  // N-04 탭 — 같은 화면 안 전환(333 판정)
  document.addEventListener("click", function (e) {
    var tab = e.target.closest("[role=tab]"); if (!tab) return;
    var list = tab.closest("[role=tablist]");
    list.querySelectorAll("[role=tab]").forEach(function (t) {
      t.setAttribute("aria-selected", t === tab ? "true" : "false");
      var p = document.getElementById(t.getAttribute("aria-controls"));
      if (p) p.hidden = (t !== tab);
    });
  });
  // C-04 blur 1차 검증 — 352 §4 (오류 문구는 332 3요소 공식)
  document.addEventListener("blur", function (e) {
    var el = e.target;
    if (!(el instanceof HTMLInputElement) || !el.required) return;
    var bad = !el.value.trim();
    el.setAttribute("aria-invalid", bad ? "true" : "false");
    updateSubmit(el.form);
  }, true);
  function updateSubmit(form) {
    if (!form) return;
    var btn = form.querySelector("[data-submit]"); if (!btn) return;
    var ok = Array.prototype.every.call(form.querySelectorAll("input[required]"),
      function (i) { return i.value.trim(); });
    btn.disabled = !ok;                  // Default 비활성 → 충족 시 활성
  }
  document.addEventListener("input", function (e) {
    if (e.target.form) updateSubmit(e.target.form);
  });
})();
