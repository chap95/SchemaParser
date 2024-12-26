chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { action, tabId, typeList } = message;

  if (action === "parseSchema") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabId === tabs[0].id) {
        chrome.scripting.executeScript(
          {
            target: { tabId },
            files: ["parse.js"],
          },
          () => {}
        );
      }
    });

    return;
  }
});
