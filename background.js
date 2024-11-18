chrome.commands.onCommand.addListener((command) => {
    if(command === 'copy-all'){
        getCurrentTabId().then((tabId) => {
            chrome.tabs.sendMessage(tabId, {action: 'copy-all'}, 
                (allCode) => {
                    console.log(allCode);
            });
        }); 
    }
});

async function getCurrentTabId() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab.id;
}
