setInterval(() => {
  const website = window.location.hostname;
  chrome.runtime.sendMessage({ website });
}, 5000); // every 5 seconds
