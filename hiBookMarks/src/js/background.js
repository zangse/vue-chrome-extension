function newTab() {
    var viewTabUrl = 'index.html'
    chrome.tabs.create({ url: viewTabUrl }, function(tab) {
        targetId = tab.id;
    });
}

chrome.browserAction.onClicked.addListener(newTab);