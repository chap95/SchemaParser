function generateMoreInfoHref(type) {
  return `<a href="https://schema.org/${type}" class="result-type-info">more info</a>`;
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
      "Sorry, No schema detected.";
  }

  if (action === "sendResult") {
    if (typeList && typeList.length > 0) {
      content = "";
    }

    typeList.forEach((typePropertiesMapList) => {
      typePropertiesMapList.forEach((typePropertiesMap) => {
        Object.entries(typePropertiesMap).forEach(([type, properties]) => {
          content += `<div class="result-box">
            <p class="result-type">${type}</p>
              <div>
              ${properties
                .map((property) => {
                  return `<p class="result-property">${property}</p>`;
                })
                .join("")}
              </div>
            <div class="hr"></div>
            <div class="more-info-box">
              ${
                type.includes(",")
                  ? type
                      .split(",")
                      .map(
                        (value) => `${value} : ${generateMoreInfoHref(value)}`
                      )
                      .join("")
                  : generateMoreInfoHref(type)
              }
            </div>
           
          </div>`;
        });
      });
    });

    document.getElementById("result-box").innerHTML = content;
    window.addEventListener("click", handleMoreInfoClick);

    document.getElementById("title").innerText = "RESULT";
    document.getElementById("chrome-extension-schema-start-button").innerText =
      "regenerate";
  }
});

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
