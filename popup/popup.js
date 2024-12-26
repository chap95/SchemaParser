const handleClick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      // Background Script로 메시지 전송
      chrome.runtime.sendMessage({
        action: "parseSchema",
        tabId: tabs[0].id, // 현재 탭 ID 전달
      });
    }
  });
};

document
  .getElementById("chrome-extension-schema-start-button")
  .addEventListener("click", handleClick);
