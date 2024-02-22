chrome.tabs.onUpdated.addListener(
  (tabId, changeInfo, tab) => {
    getTabInfo(tabId);
  }
)

chrome.tabs.onActivated.addListener(
  (info) => {
    getTabInfo(info.tabId);
  }
)

chrome.tabs.onHighlighted.addListener(
  (info) => {
    getTabInfo(info.tabIds[0]);
  }
)

async function getTabInfo(tabId) {
  try {
    const tabs = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    console.log({url: tabs[0].url, title: tabs[0].title});
    await fetch({
      href: 'http://localhost:55588/websites',
      method: 'POST',
      body: JSON.stringify({
        websiteTitle: tabs[0].title,
        websiteUrl: tabs[0].url,
        startedAt: new Date().toISOString(),
      }),
    })
  } catch(err) {
    console.error(err);
  }
}
