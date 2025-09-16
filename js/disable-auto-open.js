<script>
(function () {
  var onHome = location.pathname === '/' || /\/index\.html$/.test(location.pathname);
  if (!onHome) return;

  var unpatchAt = Date.now() + 2000; // 拦截 2 秒，必要时改成 4000

  // 1) 劫持 jQuery.pjax
  var pjaxOrig = $.pjax;
  if (typeof pjaxOrig === 'function') {
    $.pjax = function () {
      if (Date.now() < unpatchAt) return;           // 丢弃自动 PJAX
      return pjaxOrig.apply(this, arguments);
    };
  }

  // 2) 劫持元素 click（主题可能用 a.click() 触发）
  var clickOrig = HTMLElement.prototype.click;
  HTMLElement.prototype.click = function () {
    if (Date.now() < unpatchAt) return;
    return clickOrig.apply(this, arguments);
  };

  // 3) 兜底：劫持 pushState（有些实现直接改地址）
  var pushOrig = history.pushState;
  history.pushState = function () {
    if (Date.now() < unpatchAt) return;
    return pushOrig.apply(this, arguments);
  };

  // 2 秒后恢复一切（避免影响正常操作）
  setTimeout(function () {
    if (typeof pjaxOrig === 'function') $.pjax = pjaxOrig;
    HTMLElement.prototype.click = clickOrig;
    history.pushState = pushOrig;
  }, unpatchAt - Date.now() + 100);
})();
</script>
