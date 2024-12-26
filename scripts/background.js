chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { action, tabId } = message;

  if (action === "parseSchema") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabId === tabs[0].id) {
        chrome.scripting.executeScript(
          {
            target: { tabId }, // 스크립트를 실행할 탭 ID
            files: ["parse.js"], // 주입할 Content Script 파일
          },
          () => {
            console.log("Content script injected.");
          }
        );
      }
    });
  }
});
