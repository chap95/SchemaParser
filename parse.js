function extractGraphOrType(data) {
  const results = [];

  // 객체일 경우 탐색
  if (typeof data === "object" && data !== null) {
    if ("@graph" in data) {
      data["@graph"].forEach((graphData) => {
        results.push(...extractGraphOrType(graphData));
      });
    }
    if ("@type" in data) {
      results.push({ "@type": data["@type"] });
    }

    // 객체 내부를 재귀적으로 탐색
    for (const key in data) {
      results.push(...extractGraphOrType(data[key]));
    }
  }

  // 배열일 경우 각 요소를 탐색
  if (Array.isArray(data)) {
    data.forEach((item) => {
      results.push(...extractGraphOrType(item));
    });
  }

  return results;
}

(function handleScriptParse() {
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
          console.log(dataMapList);

          dataMapList.forEach((dataMap) => {
            const value = dataMap["@type"];

            if (Array.isArray(value)) {
              value.forEach((data) => {
                if (!typeCountMap[data]) {
                  typeCountMap[data] = 1;
                } else {
                  typeCountMap[data]++;
                }
              });
            }

            if (!typeCountMap[value]) {
              typeCountMap[value] = 1;
            } else {
              typeCountMap[value]++;
            }
          });

          console.log(typeCountMap);
        }
      }
    });
})();
