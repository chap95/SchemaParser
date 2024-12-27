function extractGraphOrType(data) {
  const results = [];

  if (typeof data === "object" && data !== null) {
    if ("@graph" in data) {
      data["@graph"].forEach((graphData) => {
        results.push(...extractGraphOrType(graphData));
      });
    }

    let currentType;

    for (const key in data) {
      if (key === "@id") {
        continue;
      }

      if (key === "@type") {
        currentType = data[key];

        results.push({ [currentType]: [] });
        continue;
      }

      if (currentType) {
        results.forEach((result) => {
          if (result[currentType]) {
            result[currentType].push(key);
          }
        });
      }
    }

    return results;
  }

  return results;
}

function addToMap(map, value) {
  if (!map[value]) {
    map[value] = 1;
  } else {
    map[value]++;
  }
}

(function handleScriptParse() {
  const typeList = [];

  document
    .querySelectorAll('script[type="application/ld+json"]')
    .forEach((script) => {
      if (script.textContent.startsWith(`{"@context":"https://schema.org"`)) {
        let json;
        try {
          json = JSON.parse(script.textContent);
        } catch (e) {
          console.log("JSON 파싱 중 Error 발생");
        }

        if (json) {
          typeList.push(extractGraphOrType(json));
        }
      }
    });

  const action = typeList.length > 0 ? "sendResult" : "emptyResult";
  chrome.runtime.sendMessage({ action, typeList });
})();
