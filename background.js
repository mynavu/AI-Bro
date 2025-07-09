chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "summarizeText",
        title: "Summarize this",
        contexts: ["selection"]
    });

    chrome.contextMenus.create({
        id: "explainText",
        title: "Explain this",
        contexts: ["selection"]
    });

    const modes = ["Gen Z/Alpha", "Easy-to-understand", "Normal", "Hood", "Fruity"];

    modes.forEach(mode => {
        chrome.contextMenus.create({
            id: `summarize_${mode.toLowerCase().replace(/[\s\/\-]/g, "_")}`,
            parentId: "summarizeText",
            title: mode,
            contexts: ["selection"]
        });
        chrome.contextMenus.create({
            id: `explain_${mode.toLowerCase().replace(/[\s\/\-]/g, "_")}`,
            parentId: "explainText",
            title: mode,
            contexts: ["selection"]
        });
    });

    chrome.storage.sync.get(["geminiApiKey"], (result) => {
        if (!result.geminiApiKey) {
            chrome.tabs.create({ url: "options.html" })
        }
    })
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
    chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
    }, () => {
        const [type, ...modeParts] = info.menuItemId.split("_");
        const mode = modeParts.join("_");
        chrome.tabs.sendMessage(tab.id, {
        action: type,
        text: info.selectionText,
        mode
        });
    })
    });