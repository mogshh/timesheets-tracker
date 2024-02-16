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
  const tabs = await chrome.tabs.query({active: true, lastFocusedWindow: true});
  console.log({url: tabs[0].url, title: tabs[0].title});
  fetch({
    href: 'http://localhost:55588/websites',
    body: JSON.stringify({
      
    })
  })
}
