/*! decap-cms@2.15.72 | via jsDelivr */
!function(){
  function onError(e){console.error("Decap CMS init error:", e);}
  window.CMS_MANUAL_INIT = !0;
  var s = document.createElement("script");
  // ✅ Gebruik jsDelivr — deze werkt goed met MIME types
  s.src = "https://cdn.jsdelivr.net/npm/decap-cms@2.15.72/dist/decap-cms.js";
  s.onload = function(){
    try {
      if (window.CMS) CMS.init({ configPath: "/admin/config.yml" });
      else onError("CMS object missing");
    } catch (e) { onError(e); }
  };
  s.onerror = function(e){ onError(e); };
  document.body.appendChild(s);
}();

