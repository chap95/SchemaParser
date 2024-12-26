function generateResultText(type) {
  return `<div class="result-box">
    <p class="result-type">${type}</p>
    <a class="result-type-info" href="https://schema.org/${type}">more info</a>
  </div>`;
}

function handleMoreInfoClick(event) {
  event.preventDefault();
  if (event.target.tagName === "A") {
    chrome.tabs.create({ url: event.target.href }, () => {});
  }
}
let content = "";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { action, typeList } = message;

  if (action === "emptyResult") {
    document.getElementById("result-box").innerHTML =
      "There is no Schema detected";
  }

  if (action === "sendResult") {
    if (typeList && typeList.length > 0) {
      content = "";
    }

    typeList.forEach((types) => {
      Object.keys(types).forEach((type) => {
        content += generateResultText(type);
      });
    });

    document.getElementById("result-box").innerHTML = content;
    window.addEventListener("click", handleMoreInfoClick);

    document.getElementById("title").innerText = "Result";
    document.getElementById("chrome-extension-schema-start-button").innerText =
      "regenerate";
  }
});

const handleClick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log("### parse");
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
