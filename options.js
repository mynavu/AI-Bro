const apiKey = document.getElementById("apiKey");
const saveSettings = document.getElementById("saveSettings");
const successMessage = document.getElementById("successMessage");
const modeInput = document.getElementById("modeInput");
const typeInput = document.getElementById("typeInput");

document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.sync.get(["geminiApiKey", "defaultMode", "defaultType"], ({ geminiApiKey, defaultMode, defaultType }) => {
        if (geminiApiKey) {
            apiKey.value = geminiApiKey;
        }
        if (defaultMode) {
            modeInput.value = defaultMode;
        }
        if (defaultType) {
            modeInput.value = defaultMode;
        }
    })

    saveSettings.addEventListener("click", () => {
        if (!apiKey.value.trim()) {
            alert("Set an API key from Google AI Studio to save and use AI Bro.");
            return;
        }
        chrome.storage.sync.set({ geminiApiKey: apiKey.value.trim(), defaultMode: modeInput.value, defaultType: typeInput.value }, () => {
            successMessage.textContent = "Settings saved successfully.";
            setTimeout(() => window.close(), 1000);
        } )
    })
})