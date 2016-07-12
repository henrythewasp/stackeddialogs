# Stackeddialogs

jQuery plugin to manage little dialog boxes that can be stacked in the browser window.

Requires jQuery and jQuery UI.

It exposes 2 functions:

1. `addStackedDialog(msg, opts)` - displays a new stackeddialog, removing the oldest to make room if required
2. `refreshStackedDialogs()` - can be used in window resize handlers

### Example of `addStackedDialog()`
```javascript
var count = 1;
var opts = {
  maxNum : 6,
  autoCloseTimeout: 10000,
  width: 300
};
$("#clickme").click(function() {
  $.fn.addStackedDialog(count++ + ") Your changes have been saved!!!", opts);
});
```

### Example of `refreshStackedDialogs()`
```javascript
var resizeTimer = null;
var windowHeight = $(window).height();
function handleResize() {
  if (resizeTimer) clearTimeout(resizeTimer);

  if (windowHeight != $(window).height()) {
    resizeTimer = setTimeout($.fn.refreshStackedDialogs, 100);
  }
}

$(window).bind('resize', handleResize);
```

