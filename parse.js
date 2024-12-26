function extractGraphOrType(data) {
  const results = [];

  if (typeof data === "object" && data !== null) {
    if ("@graph" in data) {
      data["@graph"].forEach((graphData) => {
        results.push(...extractGraphOrType(graphData));
      });
      return results;
    }
    if ("@type" in data) {
      results.push({ "@type": data["@type"] });
      return results;
    }

    for (const key in data) {
      results.push(...extractGraphOrType(data[key]));
    }
    return results;
  }

  if (Array.isArray(data)) {
    data.forEach((item) => {
      results.push(...extractGraphOrType(item));
    });
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
          const dataMapList = extractGraphOrType(json);
          const typeCountMap = {};

          dataMapList.forEach((dataMap) => {
            const typeNameData = dataMap["@type"];

            if (Array.isArray(typeNameData)) {
              typeNameData.forEach((typeName) => {
                addToMap(typeCountMap, typeName);
              });
            } else {
              addToMap(typeCountMap, typeNameData);
            }
          });

          typeList.push(typeCountMap);
        }
      }
    });

  const action = typeList.length > 0 ? "sendResult" : "emptyResult";
  chrome.runtime.sendMessage({ action, typeList });
})();
