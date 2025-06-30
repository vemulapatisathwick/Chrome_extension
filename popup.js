let productiveSites = [];
let unproductiveSites = [];

document.addEventListener("DOMContentLoaded", () => {
  // Load settings
  chrome.storage.sync.get(["productiveSites", "unproductiveSites"], (data) => {
    productiveSites = data.productiveSites || [];
    unproductiveSites = data.unproductiveSites || [];
    updateList("productiveList", productiveSites);
    updateList("unproductiveList", unproductiveSites);
  });

  // Load time tracking
  chrome.storage.local.get("siteTimes", (data) => {
    const stats = data.siteTimes || {};
    const usageStats = document.getElementById("usageStats");
    usageStats.innerHTML = "";
    for (const site in stats) {
      const total = stats[site];
      const minutes = Math.floor(total / 60);
      const seconds = total % 60;
      const p = document.createElement("p");
      p.textContent = `${site} — ${minutes} min ${seconds} sec`;
      usageStats.appendChild(p);
    }
  });

  // Add event listeners
  document.getElementById("addProductive").addEventListener("click", () => {
    const input = document.getElementById("productiveInput");
    const site = input.value.trim();
    if (site && !productiveSites.includes(site)) {
      productiveSites.push(site);
      updateList("productiveList", productiveSites);
      input.value = "";
    }
  });

  document.getElementById("addUnproductive").addEventListener("click", () => {
    const input = document.getElementById("unproductiveInput");
    const site = input.value.trim();
    if (site && !unproductiveSites.includes(site)) {
      unproductiveSites.push(site);
      updateList("unproductiveList", unproductiveSites);
      input.value = "";
    }
  });

  document.getElementById("saveSettings").addEventListener("click", () => {
    chrome.storage.sync.set({
      productiveSites,
      unproductiveSites
    }, () => {
      alert("✅ Settings Saved!");
    });
  });
});

function updateList(listId, items) {
  const list = document.getElementById(listId);
  list.innerHTML = "";
  items.forEach((site) => {
    const li = document.createElement("li");
    li.textContent = site;
    list.appendChild(li);
  });
}
