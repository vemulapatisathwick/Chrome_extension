let activeSite = null;
let startTime = null;

chrome.tabs.onActivated.addListener(({ tabId }) => {
  chrome.tabs.get(tabId, (tab) => {
    if (tab.url) switchSite(getDomain(tab.url));
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === "complete" && tab.url) {
    switchSite(getDomain(tab.url));
  }
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    saveTime();
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url) {
        switchSite(getDomain(tabs[0].url));
      }
    });
  }
});

function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch (e) {
    return null;
  }
}

function switchSite(domain) {
  saveTime();
  if (domain) {
    activeSite = domain;
    startTime = Date.now();
  }
}

function saveTime() {
  if (activeSite && startTime) {
    const duration = Math.floor((Date.now() - startTime) / 1000);
    chrome.storage.local.get("siteTimes", (data) => {
      const siteTimes = data.siteTimes || {};
      siteTimes[activeSite] = (siteTimes[activeSite] || 0) + duration;
      chrome.storage.local.set({ siteTimes });
    });
  }
  activeSite = null;
  startTime = null;
}
