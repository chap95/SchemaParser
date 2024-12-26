chrome.devtools.panels.create(
  "Schema Result", // 제목
  "images/icons_16.png", // 아이콘 (옵션)
  "panel.html", // 표시할 HTML 파일
  function (panel) {
    console.log("Custom DevTools Panel created.");
  }
);
