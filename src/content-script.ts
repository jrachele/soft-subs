var ENABLED = true;
var LANG = "ch";
var CONFIDENCE = 97.0;
var SCREEN_REGION = 80.0;

// Video element to be global
var VIDEO: HTMLVideoElement = null;

let observer;
var isModifyingDOM = false;

function waitForElement(selector, timeout = 30000) {
  return new Promise((resolve, reject) => {
    let observer;

    // Start the timer for the timeout
    let timer = setTimeout(() => {
      if (observer) observer.disconnect();
      reject(new Error("Element did not load within the specified timeout"));
    }, timeout);

    observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        clearTimeout(timer);
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });
}

waitForElement("video")
  .then(registerCallbacks)
  .catch((error) =>
    console.error(
      "Softsubs was unable to retrieve a video on this page:",
      error
    )
  );

async function registerCallbacks(video: HTMLVideoElement): Promise<void> {
  chrome.storage.onChanged.addListener(settingsChanged);

  if (video === null) {
    console.log("Video is null!");
    return;
  }

  VIDEO = video;

  console.log("SoftSubs Loaded.");

  // Listen for the pause event
  VIDEO.addEventListener("pause", captureVideoScreenshot);
  VIDEO.addEventListener("play", clearAll);

  VIDEO.addEventListener("timeupdate", function () {
    clearAll();
    if (VIDEO.paused) {
      captureVideoScreenshot.call(VIDEO);
    }
  });

  window.addEventListener("resize", function () {
    clearAll();
    if (VIDEO.paused) {
      captureVideoScreenshot.call(VIDEO);
    }
  });

  document.addEventListener("fullscreenchange", function () {
    clearAll();
    if (VIDEO.paused) {
      captureVideoScreenshot.call(VIDEO);
    }
  });

  window.addEventListener("beforeunload", clearAll);

  // Create a MutationObserver instance
let observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        clearAll();
        if (VIDEO.paused) {
          captureVideoScreenshot.call(VIDEO);
        }
      }
  });
});

// Start observing the element for attribute changes
observer.observe(VIDEO, { attributes: true });
}

function getScreenRegionOffset() {
  if (VIDEO === null) {
    return 0;
  }

  return VIDEO.videoHeight * (SCREEN_REGION / 100);
}

async function captureVideoScreenshot() {
  if (!ENABLED) return;

  // Create a canvas element
  let canvas = document.createElement("canvas");

  // Get the 2D context of the canvas
  let context = canvas!.getContext("2d");

  let screenRegionOffset = getScreenRegionOffset();

  canvas.width = this.videoWidth;
  canvas.height = this.videoHeight;
  context.drawImage(this, 0, 0, canvas.width, canvas.height);

  // Draw the current frame of the video onto the canvas, but crop the proper screen region
  let [sx, sy, sWidth, sHeight] = [
    0,
    screenRegionOffset,
    this.videoWidth,
    this.videoHeight - screenRegionOffset,
  ];

  var buffer = document.createElement("canvas");
  var bCtx = buffer.getContext("2d");

  buffer.width = sWidth;
  buffer.height = sHeight;
  bCtx.drawImage(
    canvas,
    sx,
    sy,
    sWidth,
    sHeight,
    0,
    0,
    buffer.width,
    buffer.height
  );

  let dataUrl = buffer.toDataURL("image/png");

  fetch(`http://localhost:5000/ocr/${LANG}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image: dataUrl,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      drawSoftSubs(this, data)
      })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function drawSoftSubs(video, data) {
  if (!ENABLED) return;
  clearAll();

  if (data === undefined) {
    return;
  }

  data = data[0];
  if (data == null) return;

  let screenRegionOffset = getScreenRegionOffset();

  data.forEach((cluster) => {
    var [bounding_box, text_data] = cluster;
    var [text, confidence] = text_data;

    if (confidence < CONFIDENCE / 100) {
      console.log(
        `Confidence low, throwing out ${text}, (confidence ${confidence})`
      );
      return;
    }

    var [topleft, topright, bottomright, bottomleft] = bounding_box;
    var font_size_px = bottomleft[1] - topleft[1];

    let videoRect = VIDEO.getBoundingClientRect();
    let videoRatio = [
      videoRect.width / VIDEO.videoWidth,
      videoRect.height / VIDEO.videoHeight,
    ];

    let textOverlay = document.createElement("div");
    textOverlay.classList.add("soft-sub");
    textOverlay.style.position = "absolute";
    textOverlay.style.zIndex = "2147483647";
    textOverlay.style.fontSize = `${font_size_px * videoRatio[1] * 0.9}px`;
    textOverlay.style.left = `${topleft[0] * videoRatio[0] + (videoRect.left + document.documentElement.scrollLeft)}px`;
    textOverlay.style.top = `${
      (topleft[1] + screenRegionOffset) * videoRatio[1] + (videoRect.top + document.documentElement.scrollTop)
    }px`;
    textOverlay.style.backgroundColor = "#ffffffcc";
    // textOverlay.style.color = 'transparent';
    textOverlay.innerHTML = text;
    document.body.appendChild(textOverlay);

  });
}

function clearAll() {
  document
    .querySelectorAll(".soft-sub")
    .forEach((e, k, p) => e.parentElement.removeChild(e));

}

function settingsChanged(changes, namespace) {
  for (let [key, { oldValue, newValue }] of <any>Object.entries(changes)) {
    if (key === "enabled") {
      ENABLED = newValue;
    } else if (key === "lang") {
      LANG = newValue;
    } else if (key === "confidence") {
      CONFIDENCE = newValue;
    } else if (key === "screenRegion") {
      SCREEN_REGION = newValue;
    }
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
  }

  if (!ENABLED) {
    clearAll();
  } else {
    captureVideoScreenshot.call(VIDEO);
  }
}
