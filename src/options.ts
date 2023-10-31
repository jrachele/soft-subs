document.addEventListener("DOMContentLoaded", function () {
  var checkbox = <HTMLInputElement>document.getElementById("enableExtension");

  // Restore checkbox state when the options page loads
  chrome.storage.sync.get("enabled", function (data) {
    checkbox.checked = !!data.enabled;
  });

  // Save checkbox state changes to chrome.storage
  checkbox.addEventListener("change", function () {
    chrome.storage.sync.set({ enabled: this.checked });
  });

  var langbox = <HTMLSelectElement>document.getElementById("language");

  // Restore checkbox state when the options page loads
  chrome.storage.sync.get("lang", function (data) {
    langbox.value = data.lang;
  });

  // Save checkbox state changes to chrome.storage
  langbox.addEventListener("change", function () {
    console.log("setting lang to " + this.value);
    chrome.storage.sync.set({ lang: this.value });
  });

  var confidence = <HTMLInputElement>document.getElementById("confidence");
  var confidenceVal = <HTMLSpanElement>document.getElementById("confidenceVal");

  // Restore checkbox state when the options page loads
  chrome.storage.sync.get("confidence", function (data) {
    confidence.value = data.confidence;
    confidenceVal.innerHTML = `${confidence.value}%`;
  });

  confidence.addEventListener("change", function() {
    confidenceVal.innerHTML = `${this.value}%`;
    chrome.storage.sync.set({confidence: this.value});
  })

  var screenregion = <HTMLInputElement>document.getElementById("screenregion");
  var screenregionVal = <HTMLSpanElement>document.getElementById("screenregionVal");

  let formatScreenRegionVal = (val) => {
    var formatted = "";
    if (val == 0)
    {
        formatted = "Scan entire video viewport";
    }
    else if (val == 100)
    {
        formatted = "Scan none of the video viewport (OCR disabled)"
    }
    else
    {
        formatted = `Scan bottom ${100 - val}% of video viewport`;
    }
    screenregionVal.innerHTML = formatted; 
  };

  // Restore checkbox state when the options page loads
  chrome.storage.sync.get("screenRegion", function (data) {
    screenregion.value = data.screenRegion;
    formatScreenRegionVal(data.screenRegion);
  });

  screenregion.addEventListener("change", function() {
    formatScreenRegionVal(this.value);
    chrome.storage.sync.set({screenRegion: this.value});
  })
});
