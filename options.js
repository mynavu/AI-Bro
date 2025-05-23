const apiKey = document.getElementById("apiKey");
const saveSettings = document.getElementById("saveSettings");
const successMessage = document.getElementById("successMessage");
const modeInput = document.getElementById("modeInput");

document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.sync.get(["geminiApiKey", "defaultMode"], ({ geminiApiKey, defaultMode }) => {
        if (geminiApiKey) {
            apiKey.value = geminiApiKey;
        }
        if (defaultMode) {
            modeInput.value = defaultMode;
        }
    }
)

saveSettings.addEventListener("click", () => {
    if (!apiKey.value.trim()) {
        return;
    }
    chrome.storage.sync.set({ geminiApiKey: apiKey.value.trim(), defaultMode: modeInput.value }, () => {
        successMessage.textContent = "Settings saved successfully";
        setTimeout(() => window.close(), 1000);

    } )
        
})

})